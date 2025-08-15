import { TransactionInstruction } from "@solana/web3.js";
import type { SwapAccounts, SwapAccountsRaw, SwapParameters } from "../types";
import type { TokenMillSDK } from "../sdk";
import { TOKEN_MILL_CONFIG_ACCOUNT, WRAPPED_SOL_MINT } from "../constants";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";

export async function swapInstruction(
  sdk: TokenMillSDK,
  accounts: SwapAccounts,
  swapParameters: SwapParameters
): Promise<TransactionInstruction> {
  const market = await sdk.program.account.market.fetch(accounts.market);
  const config = await sdk.program.account.tokenMillConfig.fetch(
    TOKEN_MILL_CONFIG_ACCOUNT
  );

  const userReserve0 = getAssociatedTokenAddressSync(
    WRAPPED_SOL_MINT,
    accounts.user
  );
  const userReserve1 = getAssociatedTokenAddressSync(
    market.tokenMint0,
    accounts.user
  );

  return swapInstructionRaw(
    sdk,
    {
      ...accounts,
      token: market.tokenMint0,
      userTokenAccount0: userReserve0,
      userTokenAccount1: userReserve1,
      feeReserve: market.feeReserve ?? config.creatorFeePool,
      creatorFeePool: config.creatorFeePool,
      protocolFeeReserve: config.protocolFeeReserve,
    },
    swapParameters
  );
}

export async function swapInstructionRaw(
  sdk: TokenMillSDK,
  accounts: SwapAccountsRaw,
  swapParameters: SwapParameters
): Promise<TransactionInstruction> {
  const marketReserve0 = getAssociatedTokenAddressSync(
    accounts.token,
    accounts.market,
    true
  );
  const marketReserve1 = getAssociatedTokenAddressSync(
    WRAPPED_SOL_MINT,
    accounts.market,
    true
  );

  const formattedSwapParameters = formatSwapParameters(swapParameters);

  return await sdk.program.methods
    .swap(formattedSwapParameters)
    .accountsPartial({
      config: TOKEN_MILL_CONFIG_ACCOUNT,
      market: accounts.market,
      marketReserve0: marketReserve0,
      userTokenAccount0: accounts.userTokenAccount0,
      marketReserve1: marketReserve1,
      userTokenAccount1: accounts.userTokenAccount1,
      feeReserve: accounts.feeReserve,
      protocolFeeReserve: accounts.protocolFeeReserve,
      creatorFeePool: accounts.creatorFeePool,
      user: accounts.user,
      program: sdk.program.programId,
      swapAuthority: sdk.program.programId,
    })
    .instruction();
}

function formatSwapParameters(swapParameters: SwapParameters) {
  const swapTypeKey = Object.keys(swapParameters)[0] as
    | keyof SwapParameters
    | undefined;

  if (!swapTypeKey) {
    throw new Error("Invalid swapParameters: no swap type key found.");
  }
  const swapValues = swapParameters[swapTypeKey];

  if (!swapValues) {
    throw new Error("Invalid swapParameters: no swap values found.");
  }

  return {
    [swapTypeKey]: [Object.values(swapValues)[0], Object.values(swapValues)[1]],
  };
}
