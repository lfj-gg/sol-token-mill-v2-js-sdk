import {
  TransactionInstruction,
  type Keypair,
  type PublicKey,
} from "@solana/web3.js";
import type { TokenMillSDK } from "./sdk";
import {
  getMessageToSign,
  getMetadataURL,
  login,
  requestUpload,
  updateTokenMetadata,
  uploadImage,
} from "./api/metadata";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
import { getVanityAddress } from "./api/vanity";

export interface TokenMetadata {
  name: string;
  symbol: string;
  imagePath: string;
  description?: string;
  socials?: {
    discord?: string;
    telegram?: string;
    twitter?: string;
    website?: string;
  };
}

export async function prepareMarketIxWithVanityAddress(
  sdk: TokenMillSDK,
  devKeypair: Keypair,
  tokenMetadata: TokenMetadata
): Promise<{ tokenAddress: PublicKey; ix: TransactionInstruction }> {
  const vanityAddress = await getVanityAddress();

  const tokenMetadataURI = await prepareTokenMetadata(
    sdk,
    devKeypair,
    vanityAddress,
    tokenMetadata
  );

  const ix = await sdk.createMarketInstruction(
    { token: vanityAddress, creator: devKeypair.publicKey },
    {
      name: tokenMetadata.name,
      symbol: tokenMetadata.symbol,
      uri: tokenMetadataURI,
    }
  );

  return { tokenAddress: vanityAddress, ix };
}

export async function prepareTokenMetadata(
  sdk: TokenMillSDK,
  devKeypair: Keypair,
  tokenAddress: PublicKey,
  tokenMetadata: TokenMetadata
): Promise<string> {
  const messageToSign = await getMessageToSign(sdk, devKeypair.publicKey);
  const messageBytes = naclUtil.decodeUTF8(messageToSign);
  const signature = nacl.sign.detached(messageBytes, devKeypair.secretKey);

  const loginToken = await login(
    sdk,
    devKeypair.publicKey,
    messageToSign,
    bs58.encode(signature)
  );

  const uploadInfo = await requestUpload(
    sdk,
    loginToken,
    tokenMetadata.imagePath
  );
  await uploadImage(
    uploadInfo.presignedUploadUrl,
    uploadInfo.fields,
    tokenMetadata.imagePath
  );

  const destinationUrl = "https://" + uploadInfo.destinationUrl;

  await updateTokenMetadata(
    sdk,
    tokenAddress,
    loginToken,
    destinationUrl,
    tokenMetadata
  );

  return getMetadataURL(tokenAddress);
}
