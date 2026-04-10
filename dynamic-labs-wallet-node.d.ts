/**
 * Type shims for Dynamic Node SDK packages.
 *
 * The published packages point at a missing `./src/index` in their d.ts files,
 * so TypeScript sees no exports. These declarations mirror the runtime API
 * surface of `index.cjs` in `@dynamic-labs-wallet/node` and
 * `@dynamic-labs-wallet/node-evm`.
 */

/* ------------------------------------------------------------------ */
/*  @dynamic-labs-wallet/node                                         */
/* ------------------------------------------------------------------ */
declare module '@dynamic-labs-wallet/node' {
  /** Plain object returned by {@link createDelegatedWalletClient}. */
  export interface DelegatedWalletClient {
    readonly environmentId: string;
    readonly debug: boolean;
    readonly apiUrl: string;
    readonly wallets: Record<string, unknown>;
    readonly logger: unknown;
    readonly apiKey: string;
    readonly baseMPCRelayApiUrl?: string;
    createApiClient(options?: Record<string, unknown>): unknown;
  }

  export type BitcoinConfig = { addressType?: string; tweak?: unknown };

  export interface DynamicWalletClientOptions {
    environmentId: string;
    baseApiUrl?: string;
    baseMPCRelayApiUrl?: string;
    debug?: boolean;
    forwardMPCClient?: unknown;
    enableMPCAccelerator?: boolean;
    logger?: unknown;
  }

  export class DynamicWalletClient {
    walletMap: Record<string, unknown>;
    logger: unknown;
    environmentId: string;
    baseApiUrl: string;
    baseMPCRelayApiUrl: string;
    debug: boolean;
    isApiClientAuthenticated: boolean;
    baseJWTAuthToken?: string;
    forwardMPCEnabled: boolean;
    apiClient: unknown;
    resolvedForwardMPCClient?: unknown;

    constructor(options: DynamicWalletClientOptions);

    ensureApiClientAuthenticated(): void;

    authenticateApiToken(authToken: string): Promise<void>;

    sign(params: {
      accountAddress: string;
      message: string | Uint8Array;
      chainName: string;
      password?: string;
      externalServerKeyShares?: unknown[];
      isFormatted?: boolean;
      context?: unknown;
      onError?: (error: Error) => void;
      bitcoinConfig?: BitcoinConfig;
    }): Promise<unknown>;

    signMessage?(...args: unknown[]): Promise<unknown>;

    keyGen(params: {
      chainName: string;
      thresholdSignatureScheme: ThresholdSignatureScheme | string;
      skipLock?: boolean;
      bitcoinConfig?: BitcoinConfig;
      onError?: (e: Error) => void;
      onCeremonyComplete?: (accountAddress: string, walletId: string) => void;
    }): Promise<{ rawPublicKey?: unknown; externalServerKeyShares?: unknown[] }>;

    getWallet(params: {
      accountAddress: string;
      walletOperation?: WalletOperation | string;
      shareCount?: number;
      password?: string;
    }): Promise<Record<string, unknown>>;

    getWalletByAddress(accountAddress: string): Promise<Record<string, unknown> | null>;

    getWallets(): Promise<Record<string, unknown>[]>;

    recoverEncryptedBackupByWallet(params: {
      accountAddress: string;
      password?: string;
      walletOperation: WalletOperation | string;
      shareCount?: number;
      storeRecoveredShares?: boolean;
    }): Promise<unknown[]>;

    verifyPassword(params: { accountAddress: string; password?: string }): Promise<void>;

    checkWalletFields(params: {
      accountAddress: string;
      walletOperation?: WalletOperation | string;
      shareCount?: number;
    }): Promise<boolean>;

    initializeWalletMapEntry(params: {
      accountAddress: string;
      walletId: string;
      chainName: string;
      thresholdSignatureScheme: ThresholdSignatureScheme | string;
      derivationPath?: string;
      additionalProps?: Record<string, unknown>;
    }): void;
  }

  export function createDelegatedWalletClient(options: {
    environmentId: string;
    baseApiUrl?: string;
    baseMPCRelayApiUrl?: string;
    apiKey: string;
    debug?: boolean;
  }): DelegatedWalletClient;

  export function delegatedSignMessage(
    client: DelegatedWalletClient,
    params: {
      walletId: string;
      walletApiKey: string;
      keyShare: unknown;
      message: string | Uint8Array;
      chainName: string;
      isFormatted?: boolean;
      onError?: (error: Error) => void;
      context?: unknown;
    },
  ): Promise<unknown>;

  export function revokeDelegation(
    client: DelegatedWalletClient,
    walletId: string,
  ): Promise<void>;

  export function createLogError(clientTag: string): (args: {
    message: string;
    error: unknown;
    context?: Record<string, unknown>;
  }) => void;

  export function logError(args: {
    message: string;
    error: unknown;
    context?: Record<string, unknown>;
    clientTag?: string;
  }): void;

  export function stripHexPrefix(str: string): string;
  export function isHexString(str: string): boolean;
  export function stringToBytes(str: string): Uint8Array;
  export function bytesToBase64(arr: Uint8Array): string;
  export function base64ToBytes(base64: string): Uint8Array;
  export function ensureBase64Padding(str: string): string;

  export function getExternalServerKeyShareBackupInfo(
    params?: Record<string, unknown>,
  ): Record<string, unknown>;

  export function formatEvmMessage(message: unknown): unknown;
  export function formatMessage(chainName: string, message: unknown): unknown;

  export function mergeUniqueKeyShares(
    existingKeyShares: unknown[],
    newKeyShares: unknown[],
  ): unknown[];

  export function retryPromise<T>(
    operation: () => Promise<T>,
    config?: {
      maxAttempts?: number;
      retryInterval?: number;
      operationName?: string;
      logContext?: Record<string, unknown>;
    },
  ): Promise<T>;

  export function getMPCSignatureScheme(options: {
    signingAlgorithm: unknown;
    baseRelayUrl?: string;
  }): unknown;

  export function getMPCSigner(options: {
    chainName: string;
    baseRelayUrl?: string;
    bitcoinConfig?: BitcoinConfig;
  }): unknown;

  export const SOLANA_RPC_URL: string;

  export enum ThresholdSignatureScheme {
    TWO_OF_TWO = 'TWO_OF_TWO',
    TWO_OF_THREE = 'TWO_OF_THREE',
  }

  export enum WalletOperation {
    NO_OPERATION = 'NO_OPERATION',
    SIGN_MESSAGE = 'SIGN_MESSAGE',
    SIGN_TRANSACTION = 'SIGN_TRANSACTION',
    EXPORT_PRIVATE_KEY = 'EXPORT_PRIVATE_KEY',
    REACH_THRESHOLD = 'REACH_THRESHOLD',
    REACH_ALL_PARTIES = 'REACH_ALL_PARTIES',
    REFRESH = 'REFRESH',
    RESHARE = 'RESHARE',
  }

  export function getMPCChainConfig(
    chainName: string,
    bitcoinConfig?: BitcoinConfig,
  ): { derivationPath: readonly number[]; signingAlgorithm?: unknown };
}

/* ------------------------------------------------------------------ */
/*  @dynamic-labs-wallet/node-evm                                      */
/* ------------------------------------------------------------------ */
declare module '@dynamic-labs-wallet/node-evm' {
  import type {
    Account,
    Address,
    Authorization,
    Chain,
    Hash,
    Hex,
    PublicClient,
    SerializableTransaction,
    Signature,
    TypedDataDefinition,
    WalletClient,
  } from 'viem';

  import type { DelegatedWalletClient, DynamicWalletClient } from '@dynamic-labs-wallet/node';

  export const EVM_SIGN_MESSAGE_PREFIX: string;

  export const ERROR_KEYGEN_FAILED: string;
  export const ERROR_CREATE_WALLET_ACCOUNT: string;
  export const ERROR_SIGN_MESSAGE: string;
  export const ERROR_SIGN_TYPED_DATA: string;
  export const ERROR_ACCOUNT_ADDRESS_REQUIRED: string;
  export const ERROR_VERIFY_MESSAGE_SIGNATURE: string;
  export const ERROR_SIGN_RAW_MESSAGE: string;

  export interface DelegatedEvmSigningParams {
    walletId: string;
    walletApiKey: string;
    keyShare: unknown;
  }

  /** Return value of {@link createDelegatedEvmWalletClient}. */
  export type DelegatedEvmWalletClient = DelegatedWalletClient & { chainName: 'EVM' };

  export function createDelegatedEvmWalletClient(options: {
    environmentId: string;
    baseApiUrl?: string;
    baseMPCRelayApiUrl?: string;
    apiKey: string;
    debug?: boolean;
  }): DelegatedEvmWalletClient;

  export function formatEVMMessage(message: string | { raw: Hex | Uint8Array }): Hex;

  export function formatTypedData(typedData: TypedDataDefinition): string;

  export function serializeECDSASignature(signature: {
    r: Uint8Array | Buffer;
    s: Uint8Array | Buffer;
    v: number | bigint;
  }): Hex;

  export function deriveAccountAddress(params: {
    rawPublicKey: {
      serializeUncompressed(): Uint8Array;
      pubKeyAsHex(): string;
    };
  }): { accountAddress: Address; publicKeyHex: string };

  export function delegatedSignMessage(
    client: DelegatedEvmWalletClient,
    params: DelegatedEvmSigningParams & {
      message: string | { raw: Hex | Uint8Array };
      context?: unknown;
      onError?: (error: Error) => void;
    },
  ): Promise<Hex>;

  export function delegatedSignTransaction(
    client: DelegatedEvmWalletClient,
    params: DelegatedEvmSigningParams & {
      transaction: SerializableTransaction;
    },
  ): Promise<Hex>;

  export function delegatedSignTypedData(
    client: DelegatedEvmWalletClient,
    params: DelegatedEvmSigningParams & { typedData: TypedDataDefinition },
  ): Promise<Hex>;

  export function delegatedSignAuthorization(
    client: DelegatedEvmWalletClient,
    params: DelegatedEvmSigningParams & { authorization: Authorization },
  ): Promise<Signature>;

  export function delegatedSignRawMessage(
    client: DelegatedEvmWalletClient,
    params: DelegatedEvmSigningParams & {
      message: Hex;
      context?: unknown;
      onError?: (error: Error) => void;
    },
  ): Promise<Hex>;

  export function revokeDelegation(
    client: DelegatedEvmWalletClient,
    params: unknown,
  ): ReturnType<typeof import('@dynamic-labs-wallet/node').revokeDelegation>;

  export interface CreateAccountAdapterDelegated {
    delegatedClient: DelegatedEvmWalletClient;
    walletId: string;
    walletApiKey: string;
    keyShare: unknown;
  }

  export function createAccountAdapter(params: {
    evmClient: DynamicEvmWalletClient;
    accountAddress: Address;
    password?: string;
    externalServerKeyShares?: unknown[];
    delegated?: CreateAccountAdapterDelegated;
  }): Account;

  export class DynamicEvmWalletClient extends DynamicWalletClient {
    readonly chainName: 'EVM';

    constructor(options: {
      environmentId: string;
      baseApiUrl?: string;
      baseMPCRelayApiUrl?: string;
      debug?: boolean;
      enableMPCAccelerator?: boolean;
      logger?: unknown;
    });

    get jwtAuthToken(): string | undefined;

    get apiUrl(): string;

    createViemPublicClient(params: { chain: Chain; rpcUrl?: string }): PublicClient;

    getWalletClient(params: {
      accountAddress: string;
      password?: string;
      externalServerKeyShares?: unknown[];
      chain?: Chain;
      chainId?: number;
      rpcUrl?: string;
    }): Promise<WalletClient>;

    createWalletAccount(params: {
      thresholdSignatureScheme: string;
      password?: string;
      onError?: (error: Error) => void;
      backUpToClientShareService?: boolean;
    }): Promise<{
      walletId: string;
      accountAddress: Address;
      rawPublicKey: unknown;
      publicKeyHex: string;
      externalServerKeyShares: unknown[];
      externalKeySharesWithBackupStatus: unknown;
    }>;

    signMessage(params: {
      message: string | { raw: Hex | Uint8Array };
      accountAddress: string;
      password?: string;
      externalServerKeyShares?: unknown[];
      context?: unknown;
      onError?: (error: Error) => void;
    }): Promise<Hex>;

    signPrehashedMessage(params: {
      prehashed: string;
      accountAddress: string;
      password?: string;
      externalServerKeyShares?: unknown[];
      context?: unknown;
      onError?: (error: Error) => void;
      recoverErrorMessage?: string;
    }): Promise<Hex>;

    signRawMessage(params: {
      message: Hex;
      accountAddress: string;
      password?: string;
      externalServerKeyShares?: unknown[];
      context?: unknown;
      onError?: (error: Error) => void;
    }): Promise<Hex>;

    signTypedData(params: {
      accountAddress: string;
      typedData: TypedDataDefinition;
      password?: string;
      externalServerKeyShares?: unknown[];
      onError?: (error: Error) => void;
    }): Promise<Hex>;

    signTransaction(params: {
      senderAddress: string;
      transaction: SerializableTransaction;
      password?: string;
      externalServerKeyShares?: unknown[];
    }): Promise<Hex>;

    signAuthorization(params: {
      authorization: Authorization;
      accountAddress: string;
      password?: string;
      externalServerKeyShares?: unknown[];
      onError?: (error: Error) => void;
    }): Promise<Authorization>;

    isSignAuthorizationSupported(): boolean;

    verifyMessageSignature(params: {
      accountAddress: Address;
      message: string | { raw: Hex | Uint8Array };
      signature: Hex;
    }): Promise<boolean>;

    exportPrivateKey(params: {
      accountAddress: string;
      password?: string;
      externalServerKeyShares?: unknown[];
    }): Promise<{ derivedPrivateKey: Hex }>;

    offlineExportPrivateKey(params: {
      keyShares: unknown[];
      derivationPath: string;
    }): Promise<{ derivedPrivateKey: Hex }>;

    importPrivateKey(params: {
      privateKey: Hex;
      chainName: string;
      thresholdSignatureScheme: string;
      password?: string;
      backUpToClientShareService?: boolean;
      onError?: (e: Error) => void;
    }): Promise<{
      accountAddress: Address;
      rawPublicKey: unknown;
      publicKeyHex: string;
      externalServerKeyShares: unknown[];
      externalKeySharesWithBackupStatus: unknown;
    }>;

    getEvmWallets(): Promise<Record<string, unknown>[]>;
  }

  /**
   * ZeroDev / kernel client wrapper created by {@link createZerodevClient}.
   * Options use Dynamic project settings; kept loose to avoid coupling to
   * `@dynamic-labs-sdk/*` types.
   */
  export interface DynamicEvmZeroDevClient {
    evmClient: DynamicEvmWalletClient;
    initialize(): Promise<void>;
    getNetworkData(networkId: number): Record<string, unknown>;
    createKernelClientForAddress(
      options: Record<string, unknown>,
    ): Promise<unknown>;
    createKernelAccountWithCustomSigner(options: {
      publicClient: PublicClient;
      signer: Account;
    }): Promise<unknown>;
  }

  export function createZerodevClient(
    evmClient: DynamicEvmWalletClient,
  ): Promise<DynamicEvmZeroDevClient>;
}
