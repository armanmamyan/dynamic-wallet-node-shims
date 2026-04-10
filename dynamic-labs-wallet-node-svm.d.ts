/**
 * Type shim for @dynamic-labs-wallet/node-svm (published types point at missing ./src).
 * Mirrors runtime exports from index.cjs.
 */

declare module '@dynamic-labs-wallet/node-svm' {
  import type {
    Transaction,
    VersionedTransaction,
  } from '@solana/web3.js';
  import type { DelegatedWalletClient, DynamicWalletClient } from '@dynamic-labs-wallet/node';

  export type DelegatedSvmWalletClient = DelegatedWalletClient & {
    readonly chainName: 'SVM';
  };

  export function createDelegatedSvmWalletClient(options: {
    environmentId: string;
    apiKey: string;
    baseApiUrl?: string;
    baseMPCRelayApiUrl?: string;
    debug?: boolean;
  }): DelegatedSvmWalletClient;

  export function delegatedSignMessage(
    client: DelegatedSvmWalletClient,
    params: {
      walletId: string;
      message: string;
      isFormatted?: boolean;
    },
  ): Promise<string>;

  export function delegatedSignRawMessage(
    client: DelegatedSvmWalletClient,
    params: {
      walletId: string;
      message: string;
    },
  ): Promise<string>;

  export function delegatedSignTransaction(
    client: DelegatedSvmWalletClient,
    params: {
      walletId: string;
      transaction: Transaction | VersionedTransaction;
      signerAddress?: string;
    },
  ): Promise<Transaction | VersionedTransaction>;

  export function revokeDelegation(
    client: DelegatedSvmWalletClient,
    params: unknown,
  ): Promise<void>;

  export function encodeBase58(source: Uint8Array | Buffer): string;
  export function decodeBase58(str: string): Uint8Array;

  export class DynamicSvmWalletClient extends DynamicWalletClient {
    readonly chainName: 'SVM';
    constructor(options: {
      environmentId: string;
      baseApiUrl?: string;
      baseMPCRelayApiUrl?: string;
      debug?: boolean;
      enableMPCAccelerator?: boolean;
      logger?: unknown;
    });
  }
}
