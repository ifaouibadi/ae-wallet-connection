import { CommunicationProviderInterface } from '@ae-wallet-connection/features/aepp-communication/shared';
import {
  getStorageValue,
  setStorageValue,
} from '@ae-wallet-connection/features/async-storage';
import {
  AeSdkWallet,
  MemoryAccount,
  Node,
  WALLET_TYPE,
} from '@aeternity/aepp-sdk';
import { useEffect, useRef, useState, useCallback } from 'react';
import { UseAeSdkHook } from '../types';

export function useWalletSdk({
  providers = [],
}: {
  providers?: CommunicationProviderInterface[];
}): UseAeSdkHook | any {
  const sdk = useRef<AeSdkWallet | undefined>();
  const sdkCommunications = useRef<{
    [name: string]: CommunicationProviderInterface;
  }>({});
  const [sdkReady, setSdkReady] = useState(false);
  const clientsRef = useRef<{ [clientId: string]: any }>({});
  const [clients, setClients] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const initSdk = useCallback(async () => {
    console.info('========================');
    console.info('useWalletSdk initSdk');
    console.info('========================');

    const aeSdk = new AeSdkWallet({
      id: 'ae-wallet',
      name: 'Wallet',
      type: WALLET_TYPE.extension, // TODO: need to tell
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
        _addClient({ clientId, origin, ...params });
      },
      onDisconnect(clientId, params) {
        console.info('========================');
        console.info('AeSdkWallet.onDisconnect ::', clientId, params);
        console.info('========================');
        _removeClient(clientId);
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
    sdk.current = aeSdk;

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

    providers.forEach((provider: CommunicationProviderInterface) => {
      sdkCommunications.current[provider.name] = provider;
    });

    aeSdk.getAccounts();
    await _restoreClients();
    setSdkReady(true);
  }, []);

  const connectClient = async (params: any) => {
    if (!sdk.current) return;
    if (sdkCommunications.current[params.provider]) {
      const client = await sdkCommunications.current[
        params.provider
      ].connectClient(sdk.current, params);
      _addClient(client);
    }
  };

  const disconnectClient = async (clientId: string) => {
    if (clientsRef.current[clientId]) {
      const client = clientsRef.current[clientId];

      if (sdkCommunications.current[client.origin] && sdk.current) {
        await sdkCommunications.current[client.origin].disconnectClient(
          sdk.current,
          client
        );
      }
    }
    try {
      sdk.current?.removeRpcClient(clientId);
    } catch (error) {
      //
    }
    _removeClient(clientId);
  };

  const _addClient = (client: { clientId: string; origin: string }) => {
    clientsRef.current[client.clientId] = {
      ...clientsRef.current[client.clientId],
      ...client,
    };
    setStorageValue('clients', clientsRef.current);
    setClients(Object.values(clientsRef.current) as any);
  };

  const _removeClient = (clientId: string) => {
    delete clientsRef.current[clientId];
    setStorageValue('clients', clientsRef.current);
    setClients(Object.values(clientsRef.current) as any);
  };

  const _restoreClients = async () => {
    const _clients = await getStorageValue('clients');

    if (_clients) {
      Object.values(_clients).forEach(async (params: any) => {
        if (sdkCommunications.current[params.origin] && sdk.current) {
          const client = await sdkCommunications.current[
            params.origin
          ].restoreClient(sdk.current, params);
          if (client) {
            _addClient({
              ...params,
              ...client,
            });
          }
        }
      });
    }
  };

  useEffect(() => {
    if (sdk.current) return;
    initSdk();
  }, [initSdk]);

  return {
    sdk,
    sdkReady,
    accounts,
    clients,
    connectClient,
    disconnectClient,
  };
}
