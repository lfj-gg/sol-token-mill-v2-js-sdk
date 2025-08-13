import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

export interface SwapParameters {
  buyExactIn?: { amountIn: BN; minAmountOut: BN };
  buyExactOut?: { maxAmountIn: BN; amountOut: BN };
  sellExactIn?: { amountIn: BN; minAmountOut: BN };
  sellExactOut?: { maxAmountIn: BN; amountOut: BN };
}

export interface SwapResult {
  amountIn: BN;
  amountOut: BN;
  feeAmountTokenIn: BN;
  feeAmountToken1: BN;
  nextSqrtPrice: BN;
}

export interface CreateMarketAccounts {
  token: PublicKey;
  creator: PublicKey;
}

export interface SwapAccounts {
  market: PublicKey;
  userTokenAccount0: PublicKey;
  userTokenAccount1: PublicKey;
  user: PublicKey;
}

export interface UpdateFeeReserveAccounts {
  market: PublicKey;
  newFeeReserve?: PublicKey;
}
