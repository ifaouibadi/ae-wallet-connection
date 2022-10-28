import { CommunicationProviderInterface } from '@ae-wallet-connection/features/aepp-communication/shared';
import React, { Context, createContext, useMemo } from 'react';
import { UseAeSdkHook } from '../types';
import { useWalletSdk } from './wallet.hooks';

export interface WalletSdkProviderProps {
  children: React.ReactNode,
  providers: CommunicationProviderInterface[]
}


export const WalletSdkContext: Context<UseAeSdkHook> = createContext({} as UseAeSdkHook);

export function WalletSdkProvider({ children, providers }: WalletSdkProviderProps) {
  const _useWalletSdk = useWalletSdk({ providers });

  const contextValue: UseAeSdkHook = useMemo(() => ({
    ..._useWalletSdk,
  }), [
    _useWalletSdk,
  ]);
  return (
    <WalletSdkContext.Provider value={contextValue}>
      {children}
    </WalletSdkContext.Provider>
  );
}
