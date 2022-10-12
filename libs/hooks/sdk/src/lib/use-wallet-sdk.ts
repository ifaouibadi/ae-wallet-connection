import {
  AeSdkWallet,
  MemoryAccount,
  Node,
  WALLET_TYPE,
} from '@aeternity/aepp-sdk';
import { useEffect, useRef, useState } from 'react';
import { UseAeSdkHook } from './types';

export function useWalletSdk(): UseAeSdkHook {
  const sdk = useRef<AeSdkWallet | undefined>();
  const [sdkReady, setSdkReady] = useState(false);

  const initSdk = async () => {
    console.info('========================');
    console.info('useWalletSdk initSdk');
    console.info('========================');

    const aeSdk = new AeSdkWallet({
      id: 'ae-wallet',
      name: 'Wallet',
      type: WALLET_TYPE.extension,
      compilerUrl: 'https://compiler.aepps.com',
      nodes: [
        {
          name: 'testnet',
          instance: new Node('https://testnet.aeternity.io'),
        },
      ],
      onConnection(clientId, params, origin) {
        console.info('========================');
        console.info('AeSdkWallet.onConnection ::', clientId, params, origin);
        console.info('========================');
      },
      onDisconnect(clientId, params) {
        console.info('========================');
        console.info('AeSdkWallet.onDisconnect ::', clientId, params);
        console.info('========================');
      },
      onSubscription(clientId, params, origin) {
        console.info('========================');
        console.info('AeSdkWallet.onSubscription ::', clientId, params, origin);
        console.info('========================');
      },
      onSign(clientId, params, origin) {
        console.info('========================');
        console.info('AeSdkWallet.onSign ::', clientId, params, origin);
        console.info('========================');
        return new Promise((resolve, reject) => {
          resolve({} as any);
        }) as any;
      },
      onAskAccounts(clientId, params, origin) {
        console.info('========================');
        console.info('AeSdkWallet.onAskAccounts ::', clientId, params, origin);
        console.info('========================');
      },
      onMessageSign(clientId, params, origin) {
        console.info('========================');
        console.info('AeSdkWallet.onMessageSign ::', clientId, params, origin);
        console.info('========================');

        return new Promise<{ onAccount?: any } | undefined>((resolve, reject) =>
          resolve({
            onAccount: () => null,
          })
        );
      },
    });

    // TODO remove
    await aeSdk.addAccount(
      new MemoryAccount({
        keypair: {
          publicKey: 'ak_2dATVcZ9KJU5a8hdsVtTv21pYiGWiPbmVcU1Pz72FFqpk9pSRR',
          secretKey:
            'bf66e1c256931870908a649572ed0257876bb84e3cdf71efb12f56c7335fad54d5cf08400e988222f26eb4b02c8f89077457467211a6e6d955edb70749c6a33b',
        },
      }),
      { select: true }
    );
    sdk.current = aeSdk;
    setSdkReady(true);
  };

  useEffect(() => {
    if (sdk.current) return;
    initSdk();
  }, []);

  return { sdk, sdkReady };
}
