import { TransactionInstruction } from "@solana/web3.js";
import type { CreateMarketAccounts } from "../types";
import type { TokenMillSDK } from "../sdk";
import { TOKEN_MILL_CONFIG_ACCOUNT, WRAPPED_SOL_MINT } from "../constants";
import { findTokenMetadataAddress } from "../utils/pda";

export interface CreateMarketArgs {
  name: string;
  symbol: string;
  uri: string;
}

export async function createMarketInstruction(
  sdk: TokenMillSDK,
  accounts: CreateMarketAccounts,
  args: CreateMarketArgs
): Promise<TransactionInstruction> {
  const token0Metadata = findTokenMetadataAddress(accounts.token);

  return await sdk.program.methods
    .createMarket(args.name, args.symbol, args.uri, null)
    .accounts({
      tokenMillConfig: TOKEN_MILL_CONFIG_ACCOUNT,
      tokenMint0: accounts.token,
      token0Metadata: token0Metadata,
      tokenMint1: WRAPPED_SOL_MINT,
      creator: accounts.creator,
      program: sdk.program.programId,
    })
    .instruction();
}
