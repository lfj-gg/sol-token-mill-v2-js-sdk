import { TransactionInstruction } from "@solana/web3.js";
import type { SwapAccounts, SwapParameters } from "../types";
import type { TokenMillSDK } from "../sdk";

export async function swapInstruction(
  sdk: TokenMillSDK,
  accounts: SwapAccounts,
  swapParameters: SwapParameters
): Promise<TransactionInstruction> {
  return await sdk.program.methods
    .swap(swapParameters)
    .accountsPartial({
      config: accounts.config,
      market: accounts.market,
      marketReserve0: accounts.marketReserve0,
      userTokenAccount0: accounts.userTokenAccount0,
      marketReserve1: accounts.marketReserve1,
      userTokenAccount1: accounts.userTokenAccount1,
      feeReserve: accounts.feeReserve,
      protocolFeeReserve: accounts.protocolFeeReserve,
      creatorFeePool: accounts.creatorFeePool,
      user: accounts.user,
      swapAuthority: accounts.swapAuthority || null,
      tokenProgram: accounts.tokenProgram,
      eventAuthority: accounts.eventAuthority,
      program: accounts.program,
    })
    .instruction();
}
