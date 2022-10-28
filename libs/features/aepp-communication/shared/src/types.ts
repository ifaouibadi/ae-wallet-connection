import { AeSdkAepp, AeSdkWallet } from '@aeternity/aepp-sdk';
import { WalletInfo } from '@aeternity/aepp-sdk/es/aepp-wallet-communication/rpc/types';

export interface UseAeppConnectHook {
  walletConnected: boolean;
  walletConnectorReady: boolean;
  accounts: string[];
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  connectedWalletInfo?: WalletInfo | null;
}

export interface CommunicationProviderInterface {
  name: string;
  // Client Side
  connectWallet: (
    sdk: AeSdkAepp,
    onConnectCallback: (wallet: WalletInfo) => void,
    session?: any,
  ) => Promise<any>;
  disconnectWallet: (sdk: AeSdkAepp) => Promise<any>;
  restoreWalletConnection: (sdk: AeSdkAepp, params: any) => Promise<WalletInfo>;

  connectClient: (sdk: AeSdkWallet, params: any) => Promise<any>;
  restoreClient: (sdk: AeSdkWallet, params: any) => Promise<any>;
  disconnectClient: (sdk: AeSdkWallet, clientId: string) => Promise<void>;
}
