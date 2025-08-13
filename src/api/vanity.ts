import { PublicKey, Transaction } from "@solana/web3.js";
import type { TokenMillSDK } from "../sdk";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

export async function getVanityAddress(): Promise<PublicKey> {
  const response = await Bun.fetch(
    "https://sol-barn.tokenmill.xyz/v2/keypairs/available",
    {
      headers: {
        "Content-Type": "application/json",
        origin: "https://tokenmill.xyz",
        referer: "https://tokenmill.xyz",
      },
    }
  );

  const data: { id: string } = (await response.json()) as any;
  return new PublicKey(data.id);
}

export async function signMarketCreationTransaction(
  transaction: Transaction
): Promise<Transaction> {
  const response = await Bun.fetch(
    "https://sol-barn.tokenmill.xyz/v2/keypairs/sign-transaction",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        origin: "https://tokenmill.xyz",
        referer: "https://tokenmill.xyz",
      },
      body: JSON.stringify({
        transaction: bs58.encode(
          transaction.serialize({ verifySignatures: false })
        ),
      }),
    }
  );

  const data: { transaction: string } = (await response.json()) as any;
  const signedTxData = bs58.decode(data.transaction);
  const signedTx = Transaction.from(signedTxData);

  return signedTx;
}
