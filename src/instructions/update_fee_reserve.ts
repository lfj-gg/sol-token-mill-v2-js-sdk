import { TransactionInstruction } from "@solana/web3.js";
import type { UpdateFeeReserveAccounts } from "../types";
import type { TokenMillSDK } from "../sdk";

export async function updateFeeReserveInstruction(
  sdk: TokenMillSDK,
  accounts: UpdateFeeReserveAccounts
): Promise<TransactionInstruction> {
  return await sdk.program.methods
    .updateFeeReserve()
    .accounts({
      market: accounts.market,
      newFeeReserve: accounts.newFeeReserve || null,
      program: sdk.program.programId,
    })
    .instruction();
}
