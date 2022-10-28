import { MutableRefObject } from 'react';

import { CommunicationProviderInterface } from '@ae-wallet-connection/features/aepp-communication/shared';
import { AeSdkAepp, AeSdkWallet } from '@aeternity/aepp-sdk';

export interface UseAeSdkHook {
  sdk: MutableRefObject<AeSdkAepp | AeSdkWallet | undefined>;
  sdkCommunication: MutableRefObject<CommunicationProviderInterface | undefined>;
  sdkReady: boolean;
  connectClient: (params: any) => void;
  disconnectClient: (clientId: string) => void;
  clients: any[];
  accounts: string[];
  // TODO move into dapp SDK interface
  connectWallet: (providerName: string) => Promise<string>;
  disconnectWallet: () => Promise<void>;
  walletConnected: boolean;
}
