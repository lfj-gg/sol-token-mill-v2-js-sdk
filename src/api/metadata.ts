import type { PublicKey } from "@solana/web3.js";
import type { TokenMillSDK } from "../sdk";
import { findMarketAddress } from "../utils/pda";
import type { TokenMetadata } from "../prepareMarket";
import { ApiClient } from "./client";

const MAX_FILE_SIZE = 5242880; // 5MB in bytes

export async function getMessageToSign(
  sdk: TokenMillSDK,
  address: PublicKey
): Promise<string> {
  const client = new ApiClient(sdk);
  
  const data = await client.requestMain<{ message: string }>(
    "/v2/auth/web3-message",
    {
      method: "POST",
      body: JSON.stringify({ address }),
    }
  );
  
  return data.message;
}

export async function login(
  sdk: TokenMillSDK,
  address: PublicKey,
  message: string,
  signature: string
): Promise<string> {
  const client = new ApiClient(sdk);
  
  const data = await client.requestMain<{ accessToken: string; refreshToken: string }>(
    "/v2/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ address, message, signature }),
    }
  );
  
  return data.accessToken;
}

export async function requestUpload(
  sdk: TokenMillSDK,
  accessToken: string,
  imagePath: string
): Promise<{
  presignedUploadUrl: string;
  fields: any;
  destinationUrl: string;
}> {
  const ext = imagePath.split(".").pop()?.toLowerCase();
  let contentType: string;
  if (ext === "png") {
    contentType = "image/png";
  } else if (ext === "jpg" || ext === "jpeg") {
    contentType = "image/jpeg";
  } else {
    throw new Error("Only PNG and JPEG images are supported");
  }

  const client = new ApiClient(sdk);
  
  return await client.requestMain(
    "/v2/markets/drafts/upload/posturl",
    {
      method: "POST",
      body: JSON.stringify({ contentType }),
      requiresAuth: true,
    },
    accessToken
  );
}

export async function uploadImage(
  presignedUploadUrl: string,
  fields: any,
  imagePath: string
): Promise<void> {
  const file = await Bun.file(imagePath).arrayBuffer();
  if (file.byteLength > MAX_FILE_SIZE) {
    throw new Error("Image file size exceeds the maximum allowed size of 5MB");
  }

  const formData = new FormData();
  for (const key in fields) {
    formData.append(key, fields[key]);
  }
  formData.append("file", new Blob([file]));

  const response = await Bun.fetch(presignedUploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload image: ${response.statusText}`);
  }
}

export async function updateTokenMetadata(
  sdk: TokenMillSDK,
  token: PublicKey,
  accessToken: string,
  imageUrl: string,
  tokenMetadata: TokenMetadata
): Promise<void> {
  const marketAddress = findMarketAddress(token);
  const client = new ApiClient(sdk);
  
  await client.requestMain<void>(
    `/v2/markets/solana/${marketAddress.toBase58()}/${token.toBase58()}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        iconUrl: imageUrl,
        description: tokenMetadata.description,
        discordUrl: tokenMetadata.socials?.discord,
        telegramUrl: tokenMetadata.socials?.telegram,
        twitterUrl: tokenMetadata.socials?.twitter,
        websiteUrl: tokenMetadata.socials?.website,
      }),
      requiresAuth: true,
    },
    accessToken
  );
}

export function getMetadataURL(token: PublicKey): string {
  return `/v2/tokens/solana/${token.toBase58()}/metadata`;
}

export async function fetchTokenMetadata(
  sdk: TokenMillSDK,
  mint: PublicKey
): Promise<any> {
  const client = new ApiClient(sdk);
  
  return await client.requestMain(
    `/v2/tokens/solana/${mint.toBase58()}/metadata`
  );
}
