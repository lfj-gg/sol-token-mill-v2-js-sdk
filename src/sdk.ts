import { Connection, TransactionInstruction, PublicKey } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import tokenMillIdl from "./idl/token_mill_v2.json";
import { type TokenMillV2 } from "./idl/token_mill_v2";
import {
  createMarketInstruction,
  updateFeeReserveInstruction,
  swapInstruction,
} from "./instructions";
import type {
  CreateMarketAccounts,
  UpdateFeeReserveAccounts,
  SwapAccounts,
  SwapParameters,
} from "./types";

export class TokenMillSDK {
  public readonly connection: Connection;
  public readonly program: Program<TokenMillV2>;

  constructor(rpc: string) {
    this.connection = new Connection(rpc, "confirmed");

    this.program = new Program<TokenMillV2>(tokenMillIdl as any, {
      connection: this.connection,
    });
  }

  // Instruction methods - delegate to existing instruction functions
  public async createMarketInstruction(
    accounts: CreateMarketAccounts,
    args: {
      name: string;
      symbol: string;
      uri: string;
      swapAuthority?: PublicKey;
    }
  ): Promise<TransactionInstruction> {
    return createMarketInstruction(this, accounts, args);
  }

  public async swapInstruction(
    accounts: SwapAccounts,
    swapParameters: SwapParameters
  ): Promise<TransactionInstruction> {
    return swapInstruction(this, accounts, swapParameters);
  }

  public async updateFeeReserveInstruction(
    accounts: UpdateFeeReserveAccounts
  ): Promise<TransactionInstruction> {
    return updateFeeReserveInstruction(this, accounts);
  }
}
