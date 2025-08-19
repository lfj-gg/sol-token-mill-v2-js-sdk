# sol-token-mill-v2-js-sdk

This package is not published on npm. To use it, run 

```bash
bun add lfj-gg/sol-token-mill-v2-js-sdk
```

It provides easy to use functions for token creation ([requires an API key](https://developers.lfj.gg/lfj-dex-api/api-access-requests)) and swaps.

### Create token

```js
const sdk = new TokenMillSDK("https://api.mainnet-beta.solana.com");
const apiKey = process.env.API_KEY ?? "";
sdk.setApiKey(apiKey);
sdk.initializeAnchorWallet();

const tokenMetadata: TokenMetadata = {
  name: "My Token",
  symbol: "MYTK",
  imagePath: "Path to the icon image, PNG or JPEG, 5Mo maximum",
  description: "My custom description",
  socials: {
      discord: "https://discord.gg/mytoken",
      telegram: "https://t.me/mytoken",
      twitter: "https://twitter.com/mytoken",
      website: "https://mytoken.com",
    },
};

await sdk.createMarket(tokenMetadata);

// Optional swap parameters can be provided for the initial buy
await sdk.createMarket(tokenMetadata, {
  initialSwapParameters: {
    buyExactIn: { amountIn: new BN(1e9), minAmountOut: new BN(0) },
  },
});
```

### Swap

```js
const sdk = new TokenMillSDK("https://api.mainnet-beta.solana.com");
const apiKey = process.env.API_KEY ?? "";

// Either call sdk.initializeAnchorWallet() or directly provide the payer keypair 
// to any function of the SDK
const devKeypair = Keypair.generate();

await sdk.swap(
  {
    market: new PublicKey("11111111111111111111111111111111"),
    user: new PublicKey("22222222222222222222222222222222"),
  },
  { buyExactIn: { amountIn: new BN(1e9), minAmountOut: new BN(0) } },
  devKeypair
);
```