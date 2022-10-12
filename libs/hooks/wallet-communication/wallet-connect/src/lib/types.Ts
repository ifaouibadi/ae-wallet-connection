import { WalletInfo } from "@aeternity/aepp-sdk/es/aepp-wallet-communication/rpc/types";

export interface UseAeppConnectHook {
  walletConnected: boolean;
  walletConnectorReady: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  connectedWalletInfo?: WalletInfo | null;
}
