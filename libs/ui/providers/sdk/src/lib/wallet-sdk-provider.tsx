import { useWalletSdk } from '@ae-wallet-connection/hooks/sdk';
import { useWalletConnect } from '@ae-wallet-connection/hooks/wallet-communication/wallet-connect';
import React, { createContext, useMemo } from 'react';

export interface WalletSdkProviderProps {
  children: React.ReactNode
}

export const WalletSdkContext = createContext({} as any);
// export interface WalletSdk extends UseAeSdkHook {
//   //
// };


export function WalletSdkProvider({ children }: WalletSdkProviderProps) {
  const _useWalletSdk = useWalletSdk();
  const _useWalletConnect = useWalletConnect(_useWalletSdk.sdk as any);

  const contextValue = useMemo(() => ({
    ..._useWalletSdk,
    ..._useWalletConnect,
  }), [
    _useWalletSdk,
    _useWalletConnect,
  ]);
  return (
    <WalletSdkContext.Provider value={contextValue}>
      {children}
    </WalletSdkContext.Provider>
  );
}

export default WalletSdkProvider;
