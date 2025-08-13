import { PublicKey } from "@solana/web3.js";
import TokenMillIDL from "../idl/token_mill_v2.json";

export function findMarketAddress(
  tokenMint0: PublicKey,
  programId = TokenMillIDL.address
): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("market"), tokenMint0.toBuffer()],
    new PublicKey(programId)
  )[0];
}

export function findTokenMetadataAddress(tokenMint0: PublicKey): PublicKey {
  const metaplexMetadata = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );

  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      metaplexMetadata.toBuffer(),
      tokenMint0.toBuffer(),
    ],
    metaplexMetadata
  )[0];
}

export function findEventAuthorityAddress(
  programId = TokenMillIDL.address
): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("__event_authority")],
    new PublicKey(programId)
  )[0];
}
