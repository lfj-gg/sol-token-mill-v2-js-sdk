import { TransactionInstruction } from "@solana/web3.js";
import type { UpdateFeeReserveAccounts } from "../types";
import type { TokenMillSDK } from "../sdk";

export async function updateFeeReserveInstruction(
  sdk: TokenMillSDK,
  accounts: UpdateFeeReserveAccounts
): Promise<TransactionInstruction> {
  return await sdk.program.methods
    .updateFeeReserve()
    .accountsPartial({
      config: accounts.config,
      market: accounts.market,
      newFeeReserve: accounts.newFeeReserve || null,
      creator: accounts.creator,
      eventAuthority: accounts.eventAuthority,
      program: accounts.program,
    })
    .instruction();
}
