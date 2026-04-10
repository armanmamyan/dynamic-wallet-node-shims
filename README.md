# Dynamic Wallet Node Shims

TypeScript declaration shims for:

- `@dynamic-labs-wallet/node`
- `@dynamic-labs-wallet/node-evm`
- `@dynamic-labs-wallet/node-svm`

This repo exists because some Dynamic Node SDK packages publish runtime bundles that work, but their `.d.ts` entrypoints point to a missing `./src/index`, which causes TypeScript to see little or no usable API surface.

## The Problem

When using Dynamic's server-side wallet SDKs, you can end up in a state where:

- the package installs correctly
- the runtime code works
- TypeScript cannot resolve the exports correctly
- IDE autocomplete and type checking break

Typical symptoms:

- `Module '"@dynamic-labs-wallet/node-evm"' has no exported member ...`
- TypeScript resolves the package but exposes the wrong or empty type surface
- delegated wallet helpers like `createDelegatedEvmWalletClient()` or `createDelegatedSvmWalletClient()` are missing from typings

In practice, this makes `node-evm` and `node-svm` much harder to adopt than they should be, especially for delegated WaaS flows.

## What This Repo Contains

- `src/types/dynamic-labs-wallet-node.d.ts`
- `src/types/dynamic-labs-wallet-node-svm.d.ts`

These shims mirror the runtime exports from the published CommonJS bundles and restore a usable TypeScript developer experience.

## Covered APIs

### `@dynamic-labs-wallet/node`

- `DynamicWalletClient`
- `createDelegatedWalletClient`
- `delegatedSignMessage`
- `ThresholdSignatureScheme`
- `WalletOperation`
- common helpers used by the EVM and SVM packages

### `@dynamic-labs-wallet/node-evm`

- `DynamicEvmWalletClient`
- `createDelegatedEvmWalletClient`
- `delegatedSignMessage`
- `delegatedSignTypedData`
- `delegatedSignTransaction`
- `delegatedSignAuthorization`
- `delegatedSignRawMessage`
- `createAccountAdapter`
- `createZerodevClient`

### `@dynamic-labs-wallet/node-svm`

- `DynamicSvmWalletClient`
- `createDelegatedSvmWalletClient`
- `delegatedSignMessage`
- `delegatedSignTransaction`
- `delegatedSignRawMessage`
- `encodeBase58`
- `decodeBase58`

## Why These Shims Matter

There are two separate concepts in Dynamic's Node SDKs, and the typings need to reflect both:

### Regular Node clients

These are class-based clients like:

- `DynamicWalletClient`
- `DynamicEvmWalletClient`
- `DynamicSvmWalletClient`

They are used with methods like:

- `authenticateApiToken(...)`
- `signMessage(...)`
- `signTypedData(...)`
- `signTransaction(...)`

These flows are generally keyed by `accountAddress`.

### Delegated WaaS clients

These are functional clients like:

- `createDelegatedEvmWalletClient(...)`
- `createDelegatedSvmWalletClient(...)`

They are used with delegated helpers like:

- `delegatedSignTypedData(...)`
- `delegatedSignTransaction(...)`
- `delegatedSignMessage(...)`

These flows are keyed by:

- `walletId`
- `walletApiKey`
- `keyShare`

That distinction is easy to miss, and broken typings make it even more confusing.

## Installation

Install the Dynamic packages you actually use:

```bash
yarn add @dynamic-labs-wallet/node @dynamic-labs-wallet/node-evm @dynamic-labs-wallet/node-svm
```

Copy the shim files into your project, for example:

```text
src/types/dynamic-labs-wallet-node.d.ts
src/types/dynamic-labs-wallet-node-svm.d.ts
```

Make sure your `tsconfig.json` includes those files via your normal project include rules.

## Usage

### EVM delegated WaaS

```ts
import {
  createDelegatedEvmWalletClient,
  delegatedSignTypedData,
} from '@dynamic-labs-wallet/node-evm';

const client = createDelegatedEvmWalletClient({
  environmentId: process.env.DYNAMIC_ENV_ID!,
  apiKey: process.env.DYNAMIC_API_TOKEN!,
});

const signature = await delegatedSignTypedData(client, {
  walletId,
  walletApiKey,
  keyShare,
  typedData,
});
```

### Solana delegated WaaS

```ts
import {
  createDelegatedSvmWalletClient,
  delegatedSignTransaction,
} from '@dynamic-labs-wallet/node-svm';

const client = createDelegatedSvmWalletClient({
  environmentId: process.env.DYNAMIC_ENV_ID!,
  apiKey: process.env.DYNAMIC_API_TOKEN!,
});

const signedTx = await delegatedSignTransaction(client, {
  walletId,
  walletApiKey,
  keyShare,
  transaction,
  signerAddress,
});
```

## Notes

- These shims are version-aligned to the Dynamic packages used during validation.
- They are intended as a pragmatic compatibility fix until upstream typings are corrected.
- If Dynamic changes the runtime export surface in a future release, the shims may need updating.

## Validation

These shims were validated against the published runtime bundles and used to restore TypeScript support for:

- delegated EVM signing
- delegated Solana signing
- regular Node SDK imports


## License

Use whatever license fits your publishing goals. MIT is a reasonable default for a shim repository.
