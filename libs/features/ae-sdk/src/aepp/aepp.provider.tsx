import { CommunicationProviderInterface } from '@ae-wallet-connection/features/aepp-communication/shared';
import React, { createContext, useMemo } from 'react';
import { UseAeSdkHook } from '../types';
import { useAeppSdk } from './aepp.hooks';

export interface AeppSdkProviderProps {
  children: React.ReactNode,
  providers: CommunicationProviderInterface[]
}


export const AeppSdkContext = createContext<UseAeSdkHook>({} as UseAeSdkHook);

export function AeppSdkProvider({ children, providers }: AeppSdkProviderProps) {
  const _useAeppSdk = useAeppSdk({ providers });

  const contextValue: UseAeSdkHook = useMemo(() => ({
    ..._useAeppSdk,
  }), [_useAeppSdk]);
  return (
    <AeppSdkContext.Provider value={contextValue}>
      {children}
    </AeppSdkContext.Provider>
  );
}
