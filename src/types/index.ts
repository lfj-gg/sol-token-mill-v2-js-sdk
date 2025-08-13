import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

export interface MarketSettingsInput {
  maxSupply: BN;
  supplyAtGraduation: BN;
  sqrtPriceAX96: BN;
  sqrtPriceBX96: BN;
  fee: number;
}

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
  tokenMillConfig: PublicKey;
  market: PublicKey;
  tokenMint0: PublicKey;
  marketReserve0: PublicKey;
  token0Metadata: PublicKey;
  tokenMint1: PublicKey;
  marketReserve1: PublicKey;
  creator: PublicKey;
  systemProgram: PublicKey;
  tokenProgram: PublicKey;
  tokenMetadataProgram: PublicKey;
  associatedTokenProgram: PublicKey;
  eventAuthority: PublicKey;
  program: PublicKey;
}

export interface UpdateFeeReserveAccounts {
  config: PublicKey;
  market: PublicKey;
  newFeeReserve?: PublicKey;
  creator: PublicKey;
  eventAuthority: PublicKey;
  program: PublicKey;
}

export interface SwapAccounts {
  config: PublicKey;
  market: PublicKey;
  marketReserve0: PublicKey;
  userTokenAccount0: PublicKey;
  marketReserve1: PublicKey;
  userTokenAccount1: PublicKey;
  feeReserve: PublicKey;
  protocolFeeReserve: PublicKey;
  creatorFeePool: PublicKey;
  user: PublicKey;
  swapAuthority?: PublicKey;
  tokenProgram: PublicKey;
  eventAuthority: PublicKey;
  program: PublicKey;
}
