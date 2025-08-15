import type { PublicKey } from "@solana/web3.js";
import type { TokenMillSDK } from "../sdk";
import { findMarketAddress } from "../utils/pda";
import type { TokenMetadata } from "../prepareMarket";

const MAX_FILE_SIZE = 5242880; // 5MB in bytes

export async function getMessageToSign(
  sdk: TokenMillSDK,
  address: PublicKey
): Promise<string> {
  if (!sdk.apiKey) {
    throw new Error("This method requires an API key");
  }

  const response = await Bun.fetch(
    "https://api.tokenmill.xyz/v2/auth/web3-message",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-tokenmill-api-key": sdk.apiKey,
      },
      body: JSON.stringify({
        address,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get message to sign: ${response.statusText}`);
  }

  const data: { message: string } = (await response.json()) as any;
  return data.message;
}

export async function login(
  sdk: TokenMillSDK,
  address: PublicKey,
  message: string,
  signature: string
): Promise<string> {
  if (!sdk.apiKey) {
    throw new Error("This method requires an API key");
  }

  const response = await Bun.fetch("https://api.tokenmill.xyz/v2/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-tokenmill-api-key": sdk.apiKey,
    },
    body: JSON.stringify({
      address: address,
      message,
      signature,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to login: ${response.statusText}`);
  }

  const data: { accessToken: string; refreshToken: string } =
    (await response.json()) as any;
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
  if (!sdk.apiKey) {
    throw new Error("This method requires an API key");
  }

  const ext = imagePath.split(".").pop()?.toLowerCase();
  let contentType: string;
  if (ext === "png") {
    contentType = "image/png";
  } else if (ext === "jpg" || ext === "jpeg") {
    contentType = "image/jpeg";
  } else {
    throw new Error("Only PNG and JPEG images are supported");
  }

  const response = await Bun.fetch(
    "https://api.tokenmill.xyz/v2/markets/drafts/upload/posturl",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-tokenmill-api-key": sdk.apiKey,
      },
      body: JSON.stringify({
        contentType,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to request upload: ${response.statusText}`);
  }

  const data = (await response.json()) as any;
  return data;
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
  if (!sdk.apiKey) {
    throw new Error("This method requires an API key");
  }

  const marketAddress = findMarketAddress(token);

  const response = await Bun.fetch(
    `https://api.tokenmill.xyz/v2/markets/solana/${marketAddress.toBase58()}/${token.toBase58()}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-tokenmill-api-key": sdk.apiKey,
      },
      body: JSON.stringify({
        iconUrl: imageUrl,
        description: tokenMetadata.description,
        discordUrl: tokenMetadata.socials?.discord,
        telegramUrl: tokenMetadata.socials?.telegram,
        twitterUrl: tokenMetadata.socials?.twitter,
        websiteUrl: tokenMetadata.socials?.website,
      }),
    }
  );

  if (!response.ok) {
    console.log(response);
    throw new Error(`Failed to update metadata: ${response.statusText}`);
  }
}

export function getMetadataURL(token: PublicKey): string {
  return `https://api.tokenmill.xyz/v2/tokens/solana/${token.toBase58()}/metadata`;
}

export async function fetchTokenMetadata(
  sdk: TokenMillSDK,
  mint: PublicKey
): Promise<any> {
  if (!sdk.apiKey) {
    throw new Error("This method requires an API key");
  }

  const response = await Bun.fetch(getMetadataURL(mint), {
    headers: {
      "x-tokenmill-api-key": sdk.apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch metadata: ${response.statusText}`);
  }

  return await response.json();
}
