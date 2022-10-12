// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { aeternityInitWalletSDK } from '@ae-wallet-connection/aeternity/wallet';
import WalletConnect from '@walletconnect/client';
import { useEffect, useRef, useState } from 'react';

import { getCachedWalletConnectSession, WalletConnectClient } from '@ae-wallet-connection/aepp-wallet-communication/wallet-connect';
import {
  AeSdkWallet
} from '@aeternity/aepp-sdk';


import styles from './app.module.css';

export function App() {
  const asSdk = useRef<AeSdkWallet>();
  const walletConnector = useRef<WalletConnect>();
  const [initializingSdk, setInitializingSdk] = useState(false)
  const [addresses, setAddresses] = useState<any>([]);

  const [sdkReady, setSdkReady] = useState(false);
  const [waitingForApproval, setWaitingForApproval] = useState(false);
  const [connectedToApp, setConnectedToApp] = useState(false)


  useEffect(() => {
    if (initializingSdk || sdkReady) return;
    setInitializingSdk(true);
    (async () => {
      asSdk.current = await aeternityInitWalletSDK();
      setSdkReady(true);
    })();
  }, []);

  useEffect(() => {
    if (sdkReady) {
      setAddresses(asSdk.current?.addresses() as any);
      const session = getCachedWalletConnectSession();
      if (session) {
        _connectWallet({
          session
        })
      }
      console.log('addresses ::', addresses);
    }
  }, [sdkReady]);

  const _connectWallet = async (props: any) => {
    if (!sdkReady || !asSdk.current) return;

    const connector: WalletConnect = new WalletConnect(props);

    
    if (!connector.connected) {
      await connector.createSession();
      setWaitingForApproval(true);
    } else {
      setConnectedToApp(true);
    }

    walletConnector.current = connector;

    console.log('=================');
    console.log('_connectWallet');
    console.log('props ::', props);
    console.log('connector ::', connector);
    console.log('=================');

  }

  const onApproveDapp = async () => {
    if (!walletConnector.current || !asSdk.current) return;

    const chainId: any = asSdk.current.addRpcClient(new WalletConnectClient({
      connector: walletConnector.current,
      debug: true
    }));
    console.log('####### chainId', chainId);
    walletConnector.current.approveSession({
      chainId,
      accounts: addresses
    });
    setWaitingForApproval(false);
    setConnectedToApp(true);
  }

  const onRejectSession = async () => {
    if (!walletConnector.current) return;
    walletConnector.current.rejectSession({
      message: 'Connection Was rejected by user'
    });
    setWaitingForApproval(false);
  }

  const renderApproveConnection = () => waitingForApproval && (
    <div className={styles['card']}>
      <div className={styles['row']}>
        <button
          className={[styles['button'], styles['black-bg']].join(' ')}
          onClick={onApproveDapp}
        >
          Approve
        </button>
        <div style={{ width: '5px' }} />
        <button
          className={[styles['button'], styles['red-bg']].join(' ')}
          onClick={onRejectSession}
        >
          Reject
        </button>
      </div>
    </div>
  )

  const renderScanAndWalletInputCard = () => !connectedToApp && (
    <div className={styles['card']}>
      <div className={styles['row']}>
        <button className={[styles['button'], styles['black-bg']].join(' ')}>
          Scan
        </button>
        <div>
          OR
        </div>
        <input
          className={styles['input']}
          placeholder='Paste wc: uri'
          onChange={event => _connectWallet({
            uri: event.target.value,
          })}
        />
      </div>
    </div>
  )

  return (
    <div className={styles['container']}>
      <div className={styles['row']}>
        <div>
          Connected to <br />
          <strong>Testnet</strong>
        </div>
        {
          (addresses && addresses.length) ? (
            <div>
              {addresses[0].substr(0, 8)}
              ...
              {addresses[0].substr(addresses[0].length - 4, addresses[0].length)}
            </div>
          ) : null
        }
      </div>

      {renderScanAndWalletInputCard()}
      {renderApproveConnection()}
    </div>
  );
}

export default App;
