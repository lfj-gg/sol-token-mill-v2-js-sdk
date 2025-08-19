import {
  Connection,
  TransactionInstruction,
  PublicKey,
  Keypair,
  Transaction,
} from "@solana/web3.js";
import anchor, { Program } from "@coral-xyz/anchor";
import tokenMillIdl from "./idl/token_mill_v2.json";
import { type TokenMillV2 } from "./idl/token_mill_v2";
import {
  createMarketInstruction,
  updateFeeReserveInstruction,
  swapInstruction,
  type CreateMarketArgs,
} from "./instructions";
import type {
  CreateMarketAccounts,
  UpdateFeeReserveAccounts,
  SwapAccounts,
  SwapParameters,
  SwapAccountsRaw,
  CreateMarketOptions,
} from "./types";
import {
  prepareMarketIxWithVanityAddress,
  prepareTokenMetadata,
  type TokenMetadata,
} from "./prepareMarket";
import { signMarketCreationTransaction } from "./api/vanity";
import type NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { findMarketAddress } from "./utils/pda";
import {
  createAssociatedTokenAccountIdempotentInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { TOKEN_MILL_CONFIG_ACCOUNT, WRAPPED_SOL_MINT } from "./constants";
import { swapInstructionRaw } from "./instructions/swap";

export class TokenMillSDK {
  public readonly connection: Connection;
  public readonly program: Program<TokenMillV2>;
  public apiKey?: string;
  public anchorWallet?: NodeWallet;

  constructor(rpc: string) {
    this.connection = new Connection(rpc, "confirmed");

    this.program = new Program<TokenMillV2>(tokenMillIdl as any, {
      connection: this.connection,
    });
  }

  public setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  public initializeAnchorWallet() {
    this.anchorWallet = anchor.Wallet.local();
  }

  public async createMarket(
    tokenMetadata: TokenMetadata,
    options?: CreateMarketOptions
  ): Promise<void> {
    const keypair = this.validateKeypair(options?.devKeypair, "createMarket");

    const { tokenAddress, ix: marketCreationIx } =
      await this.prepareMarketWithVanityAddress(keypair, tokenMetadata);

    const createAtaIx = createAssociatedTokenAccountIdempotentInstruction(
      keypair.publicKey,
      getAssociatedTokenAddressSync(tokenAddress, keypair.publicKey),
      keypair.publicKey,
      tokenAddress
    );

    const config = await this.program.account.tokenMillConfig.fetch(
      TOKEN_MILL_CONFIG_ACCOUNT
    );

    // Defaults to buying 1 token, as markets require a swap to be indexed
    const swapParameters = options?.initialSwapParameters || {
      buyExactOut: {
        amountOut: new anchor.BN(1e6),
        maxAmountIn: new anchor.BN(1e6),
      },
    };

    const swapIx = await this.swapInstructionRaw(
      {
        market: findMarketAddress(tokenAddress),
        token: tokenAddress,
        user: keypair.publicKey,
        userTokenAccount0: getAssociatedTokenAddressSync(
          tokenAddress,
          keypair.publicKey
        ),
        userTokenAccount1: getAssociatedTokenAddressSync(
          WRAPPED_SOL_MINT,
          keypair.publicKey
        ),
        feeReserve: config.creatorFeePool,
        protocolFeeReserve: config.protocolFeeReserve,
        creatorFeePool: config.creatorFeePool,
      },
      swapParameters
    );

    const tx = await this.createAndSignTransaction(
      [marketCreationIx, createAtaIx, swapIx],
      keypair.publicKey,
      []
    );

    const signedTx = await signMarketCreationTransaction(tx);
    signedTx.partialSign(keypair);

    console.log("Creating token:", tokenAddress.toString());

    const signature = await this.connection.sendRawTransaction(
      signedTx.serialize()
    );

    console.log("Transaction Signature:", signature, "✅");
  }

  public async swap(
    accounts: SwapAccounts,
    swapParameters: SwapParameters,
    devKeypair?: Keypair
  ): Promise<void> {
    const keypair = this.validateKeypair(devKeypair, "swap");

    const swapIx = await this.swapInstruction(accounts, swapParameters);

    const tx = await this.createAndSignTransaction([swapIx], accounts.user, [
      keypair,
    ]);

    const signature = await this.connection.sendRawTransaction(tx.serialize());

    console.log("Transaction Signature:", signature, "✅");
  }

  public async prepareMarketWithVanityAddress(
    devKeypair: Keypair,
    tokenMetadata: TokenMetadata
  ): Promise<{ tokenAddress: PublicKey; ix: TransactionInstruction }> {
    return prepareMarketIxWithVanityAddress(this, devKeypair, tokenMetadata);
  }

  public async prepareTokenMetadata(
    devKeypair: Keypair,
    tokenAddress: PublicKey,
    tokenMetadata: TokenMetadata
  ): Promise<string> {
    return prepareTokenMetadata(this, devKeypair, tokenAddress, tokenMetadata);
  }

  public async createMarketInstruction(
    accounts: CreateMarketAccounts,
    args: CreateMarketArgs
  ): Promise<TransactionInstruction> {
    return createMarketInstruction(this, accounts, args);
  }

  public async swapInstruction(
    accounts: SwapAccounts,
    swapParameters: SwapParameters
  ): Promise<TransactionInstruction> {
    return swapInstruction(this, accounts, swapParameters);
  }

  public async swapInstructionRaw(
    accounts: SwapAccountsRaw,
    swapParameters: SwapParameters
  ): Promise<TransactionInstruction> {
    return swapInstructionRaw(this, accounts, swapParameters);
  }

  public async updateFeeReserveInstruction(
    accounts: UpdateFeeReserveAccounts
  ): Promise<TransactionInstruction> {
    return updateFeeReserveInstruction(this, accounts);
  }

  private validateKeypair(
    devKeypair?: Keypair,
    operation: string = "operation"
  ): Keypair {
    if (!devKeypair) {
      if (!this.anchorWallet) {
        throw new Error(
          `${operation} requires a Keypair or to have an initialized anchor wallet`
        );
      }
      return this.anchorWallet.payer;
    }
    return devKeypair;
  }

  private async createAndSignTransaction(
    instructions: TransactionInstruction[],
    payer: PublicKey,
    signers: Keypair[]
  ): Promise<Transaction> {
    const tx = new Transaction().add(...instructions);

    tx.recentBlockhash = (
      await this.connection.getLatestBlockhash("confirmed")
    ).blockhash;

    tx.feePayer = payer;

    if (signers.length > 0) {
      tx.partialSign(...signers);
    }

    return tx;
  }
}
