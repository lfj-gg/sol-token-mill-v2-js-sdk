import { TransactionInstruction } from "@solana/web3.js";
import type { SwapAccounts, SwapParameters } from "../types";
import type { TokenMillSDK } from "../sdk";
import { TOKEN_MILL_CONFIG_ACCOUNT } from "../constants";

export async function swapInstruction(
  sdk: TokenMillSDK,
  accounts: SwapAccounts,
  swapParameters: SwapParameters
): Promise<TransactionInstruction> {
  const market = await sdk.program.account.market.fetch(accounts.market);
  const config = await sdk.program.account.tokenMillConfig.fetch(
    TOKEN_MILL_CONFIG_ACCOUNT
  );

  return await sdk.program.methods
    .swap(swapParameters)
    .accounts({
      market: accounts.market,
      marketReserve0: market.reserve0,
      userTokenAccount0: accounts.userTokenAccount0,
      marketReserve1: market.reserve1,
      userTokenAccount1: accounts.userTokenAccount1,
      feeReserve: market.feeReserve ?? config.creatorFeePool,
      protocolFeeReserve: config.protocolFeeReserve,
      creatorFeePool: config.creatorFeePool,
      user: accounts.user,
      program: sdk.program.programId,
    })
    .instruction();
}
