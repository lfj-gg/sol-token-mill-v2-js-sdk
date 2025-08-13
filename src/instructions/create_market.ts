import { TransactionInstruction, PublicKey } from "@solana/web3.js";
import type { CreateMarketAccounts } from "../types";
import type { TokenMillSDK } from "../sdk";

export interface CreateMarketArgs {
  name: string;
  symbol: string;
  uri: string;
  swapAuthority?: PublicKey;
}

export async function createMarketInstruction(
  sdk: TokenMillSDK,
  accounts: CreateMarketAccounts,
  args: CreateMarketArgs
): Promise<TransactionInstruction> {
  return await sdk.program.methods
    .createMarket(args.name, args.symbol, args.uri, args.swapAuthority || null)
    .accountsPartial({
      tokenMillConfig: accounts.tokenMillConfig,
      market: accounts.market,
      tokenMint0: accounts.tokenMint0,
      marketReserve0: accounts.marketReserve0,
      token0Metadata: accounts.token0Metadata,
      tokenMint1: accounts.tokenMint1,
      marketReserve1: accounts.marketReserve1,
      creator: accounts.creator,
      systemProgram: accounts.systemProgram,
      tokenProgram: accounts.tokenProgram,
      tokenMetadataProgram: accounts.tokenMetadataProgram,
      associatedTokenProgram: accounts.associatedTokenProgram,
      eventAuthority: accounts.eventAuthority,
      program: accounts.program,
    })
    .instruction();
}
