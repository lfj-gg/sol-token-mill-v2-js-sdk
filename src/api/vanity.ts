import { PublicKey, Transaction } from "@solana/web3.js";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { ApiClient } from "./client";
import type { TokenMillSDK } from "../sdk";

export async function getVanityAddress(): Promise<PublicKey> {
  const dummySdk = {} as TokenMillSDK;
  const client = new ApiClient(dummySdk);
  
  const data = await client.requestBarn<{ id: string }>("/v2/keypairs/available");
  return new PublicKey(data.id);
}

export async function signMarketCreationTransaction(
  transaction: Transaction
): Promise<Transaction> {
  const dummySdk = {} as TokenMillSDK;
  const client = new ApiClient(dummySdk);
  
  const data = await client.requestBarn<{ transaction: string }>(
    "/v2/keypairs/sign-transaction",
    {
      method: "POST",
      body: JSON.stringify({
        transaction: bs58.encode(
          transaction.serialize({ verifySignatures: false })
        ),
      }),
    }
  );

  const signedTxData = bs58.decode(data.transaction);
  const signedTx = Transaction.from(signedTxData);

  return signedTx;
}
