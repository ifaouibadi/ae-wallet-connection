import { CommunicationProviderInterface } from '@ae-wallet-connection/features/aepp-communication/shared';
import {
  getStorageValue,
  setStorageValue,
} from '@ae-wallet-connection/features/async-storage';
import { AeSdkAepp, Node, SUBSCRIPTION_TYPES } from '@aeternity/aepp-sdk/es';
import { WalletInfo } from '@aeternity/aepp-sdk/es/aepp-wallet-communication/rpc/types';
import { useEffect, useRef, useState } from 'react';

export function useAeppSdk({
  providers = [],
}: {
  providers: CommunicationProviderInterface[];
}): any {
  const sdk = useRef<AeSdkAepp>();
  const sdkCommunications = useRef<{
    [name: string]: CommunicationProviderInterface;
  }>({});
  const [sdkReady, setSdkReady] = useState(false);

  const [accounts, setAccounts] = useState([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [connectedWalletInfo, setConnectedWalletInfo] =
    useState<WalletInfo | null>(null);

  const initSdk = async () => {
    const aeSdk = new AeSdkAepp({
      name: 'Simple æpp',
      compilerUrl: 'https://compiler.aepps.com',
      nodes: [
        {
          name: 'testnet',
          instance: new Node('https://testnet.aeternity.io'),
        },
      ],
      onNetworkChange: async ({ networkId }) => {
        const [{ name }] = (await aeSdk.getNodesInPool()).filter(
          (node) => node.nodeNetworkId === networkId
        );
        aeSdk.selectNode(name);
        console.info('========================');
        console.info('onNetworkChange ::', name, networkId);
        console.info('========================');

        // commit("setNetworkId", networkId);
      },
      onAddressChange: ({ current }) => {
        console.info('========================');
        console.info('onAddressChange ::', current);
        console.info('========================');
      },
      onDisconnect: () => {
        setConnectedWalletInfo(null);
        setWalletConnected(false);
        setStorageValue('wallet', null);
      },
    });

    sdk.current = aeSdk;
    _restoreConnectedWallet();
    providers.forEach((provider: CommunicationProviderInterface) => {
      sdkCommunications.current[provider.name] = provider;
    });

    setSdkReady(true);
  };

  const _onWalletConnected = async (wallet: WalletInfo) => {
    if (!sdk.current) return;
    setStorageValue('wallet', wallet);
    setConnectedWalletInfo(wallet);
    setWalletConnected(true);

    sdk.current
      .subscribeAddress(SUBSCRIPTION_TYPES.subscribe, 'connected')
      .then(({ address: { current } }: any) =>
        setAccounts(Object.keys(current) as any)
      );
  };

  const connectWallet = async (providerName: string) => {
    if (!sdk.current) return;
    if (sdkCommunications.current[providerName]) {
      return await sdkCommunications.current[providerName].connectWallet(
        sdk.current,
        _onWalletConnected
      );
    }
    throw new Error(`${providerName} doesn't exists`);
  };

  const disconnectWallet = async () => {
    if (!sdk.current || !connectedWalletInfo) return;
    if (sdkCommunications.current[connectedWalletInfo.origin]) {
      await sdkCommunications.current[
        connectedWalletInfo.origin
      ].disconnectWallet(sdk.current);
    }
  };

  const _restoreConnectedWallet = async () => {
    const _wallet = await getStorageValue('wallet');

    if (_wallet) {
      if (sdkCommunications.current[_wallet.origin] && sdk.current) {
        const wallet = await sdkCommunications.current[
          _wallet.origin
        ].restoreWalletConnection(sdk.current, _wallet);
        if (wallet) {
          _onWalletConnected(wallet);
        }
      }
    }
  };

  useEffect(() => {
    if (sdk.current) return;
    initSdk();
  }, []);

  return {
    sdk,
    sdkReady,
    connectWallet,
    disconnectWallet,
    accounts,
    walletConnected,
    connectedWalletInfo,
  };
}
