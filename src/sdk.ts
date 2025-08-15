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
} from "./types";
import {
  prepareMarketWithVanityAddress,
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
    devKeypair?: Keypair
  ): Promise<void> {
    if (!devKeypair) {
      if (!this.anchorWallet) {
        throw new Error(
          "createMarket requires a Keypair or to have an initialized anchor wallet"
        );
      }
      devKeypair = this.anchorWallet.payer;
    }

    const { tokenAddress, ix: marketCreationIx } =
      await this.prepareMarketWithVanityAddress(devKeypair, tokenMetadata);

    const createAtaIx = createAssociatedTokenAccountIdempotentInstruction(
      devKeypair.publicKey,
      getAssociatedTokenAddressSync(tokenAddress, devKeypair.publicKey),
      devKeypair.publicKey,
      tokenAddress
    );

    const config = await this.program.account.tokenMillConfig.fetch(
      TOKEN_MILL_CONFIG_ACCOUNT
    );

    const swapIx = await this.swapInstructionRaw(
      {
        market: findMarketAddress(tokenAddress),
        token: tokenAddress,
        user: devKeypair.publicKey,
        userTokenAccount0: getAssociatedTokenAddressSync(
          tokenAddress,
          devKeypair.publicKey
        ),
        userTokenAccount1: getAssociatedTokenAddressSync(
          WRAPPED_SOL_MINT,
          devKeypair.publicKey
        ),
        feeReserve: config.creatorFeePool,
        protocolFeeReserve: config.protocolFeeReserve,
        creatorFeePool: config.creatorFeePool,
      },
      {
        buyExactOut: {
          amountOut: new anchor.BN(1e6),
          maxAmountIn: new anchor.BN(1e6),
        },
      }
    );

    const tx = new Transaction()
      .add(marketCreationIx)
      .add(createAtaIx)
      .add(swapIx);

    tx.recentBlockhash = (
      await this.connection.getLatestBlockhash("confirmed")
    ).blockhash;

    tx.feePayer = devKeypair.publicKey;

    const signedTx = await signMarketCreationTransaction(tx);
    signedTx.partialSign(devKeypair);

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
    if (!devKeypair) {
      if (!this.anchorWallet) {
        throw new Error(
          "This function requires a Keypair or to have an initialized anchor wallet"
        );
      }
      devKeypair = this.anchorWallet.payer;
    }

    const swapIx = await this.swapInstruction(accounts, swapParameters);

    const tx = new Transaction().add(swapIx);

    tx.recentBlockhash = (
      await this.connection.getLatestBlockhash("confirmed")
    ).blockhash;

    tx.feePayer = accounts.user;
    tx.sign(devKeypair);

    const signature = await this.connection.sendRawTransaction(tx.serialize());

    console.log("Transaction Signature:", signature, "✅");
  }

  public async prepareMarketWithVanityAddress(
    devKeypair: Keypair,
    tokenMetadata: TokenMetadata
  ): Promise<{ tokenAddress: PublicKey; ix: TransactionInstruction }> {
    return prepareMarketWithVanityAddress(this, devKeypair, tokenMetadata);
  }

  public async prepareTokenMetadata(
    devKeypair: Keypair,
    tokenAddress: PublicKey,
    tokenMetadata: TokenMetadata
  ): Promise<string> {
    return prepareTokenMetadata(this, devKeypair, tokenAddress, tokenMetadata);
  }

  // Instruction methods - delegate to existing instruction functions
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
}
