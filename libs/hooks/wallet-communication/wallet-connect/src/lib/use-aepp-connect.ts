import { AeSdkAepp } from '@aeternity/aepp-sdk';
import WalletConnect from '@walletconnect/client';
import { MutableRefObject, useState, useEffect, useRef } from 'react';
import QRCodeModal from '@walletconnect/qrcode-modal';
import {
  getCachedWalletConnectSession,
  WalletConnectDappClient,
} from '@ae-wallet-connection/aepp-wallet-communication/wallet-connect';
import { WalletInfo } from '@aeternity/aepp-sdk/es/aepp-wallet-communication/rpc/types';

import { UseAeppConnectHook } from './types';

export function useAeppConnect(
  sdk: MutableRefObject<AeSdkAepp | undefined>
): UseAeppConnectHook {
  const _walletConnect = useRef<WalletConnect>();
  const [walletConnectorReady, setWalletConnectorReady] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [connectedWalletInfo, setConnectedWalletInfo] = useState<WalletInfo | null>(null);

  const connectWallet = async () => {
    if (!_walletConnect.current) return;

    if (!_walletConnect.current.connected) {
      await _walletConnect.current.createSession();
    }
  };

  const disconnectWallet = async () => {
    if (!sdk.current) return;
    try {
      sdk.current.disconnectWallet();
    } catch (error) {
      //
    }
    setWalletConnected(false);
    setConnectedWalletInfo(null);
  };

  const _restoreWalletSession = async () => {
    const session = getCachedWalletConnectSession();
    if (session) {
      await _initWalletConnectSdk({ session });
      await _connectAeSdkWallet();
    } else {
      await _initWalletConnectSdk();
    }
  };

  const _initWalletConnectSdk = async (props: any = {}) => {
    const connector = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org', // Required
      qrcodeModal: QRCodeModal,
      qrcodeModalOptions: {
        desktopLinks: []
      },
      ...props,
    });

    connector.on('connect', (error, payload) => {
      if (error) {
        throw error;
      }
      _connectAeSdkWallet();
    });

    _walletConnect.current = connector;
    setWalletConnectorReady(true);
  };

  const _connectAeSdkWallet = async () => {
    console.info('========================');
    console.info('useAeppConnect->_connectAeSdkWallet');
    console.info('========================');
    if (!sdk.current) return;
    const walletConnector = (await new WalletConnectDappClient({
      connector: _walletConnect.current,
      debug: true,
      origin: window.location.origin,
      receiveDirection: 'to_aepp',
      sendDirection: 'to_waellet',
    })) as any;

    console.info('========================');
    console.info(
      'useAeppConnect->_connectAeSdkWallet :: walletConnector ==',
      walletConnector
    );
    console.info('========================');

    const wallet = await sdk.current.connectToWallet(walletConnector, {
      connectNode: true,
      name: _walletConnect.current?.peerId,
      select: true,
    });

    setConnectedWalletInfo(wallet);
    setWalletConnected(true);

    console.info('========================');
    console.info('useAeppConnect->_connectAeSdkWallet :: wallet ==', wallet);
    console.info('========================');

    sdk.current
      .subscribeAddress('subscribe' as any, 'connected')
      .then((data: any) => {
        console.info('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@======');
        console.info('aeSdk.subscribeAddress ::', data);
        console.info('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@======');
      });
  };

  useEffect(() => {
    if (!sdk.current || _walletConnect.current) return;

    if (!walletConnected) {
      _restoreWalletSession();
    }

    sdk.current.onDisconnect = disconnectWallet;
  }, [sdk]);

  return {
    walletConnected,
    walletConnectorReady,
    connectWallet,
    disconnectWallet,
    connectedWalletInfo,
  };
}
