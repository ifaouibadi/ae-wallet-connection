import { useAeppSdk, UseAeSdkHook } from '@ae-wallet-connection/hooks/sdk';
import { useAeppConnect, UseAeppConnectHook } from '@ae-wallet-connection/hooks/wallet-communication/wallet-connect';
import React, { createContext, useMemo } from 'react';

export interface AeppSdkProviderProps {
  children: React.ReactNode
}



export interface AeppSdk extends UseAeSdkHook, UseAeppConnectHook { }

export const AeppSdkContext = createContext<AeppSdk>({} as any);

export function AeppSdkProvider({ children }: AeppSdkProviderProps) {
  const _useAeppSdk = useAeppSdk();

  const _useAeppConnect = useAeppConnect(_useAeppSdk.sdk as any)

  const contextValue: AeppSdk = useMemo(() => ({
    ..._useAeppSdk,
    ..._useAeppConnect
  }), [_useAeppConnect, _useAeppSdk]);
  return (
    <AeppSdkContext.Provider value={contextValue}>
      {children}
    </AeppSdkContext.Provider>
  );
}

export default AeppSdkContext;
