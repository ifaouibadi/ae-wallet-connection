import WalletConnect from '@walletconnect/client';
import { WalletSdkContext } from 'libs/ui/providers/sdk/src';
import { useContext } from 'react';
import styles from './home.module.css';

/* eslint-disable-next-line */
export interface HomeProps { }

export function Home(props: HomeProps) {
  const { sdk, sdkReady, clients, addAeppClient, acceptAeppClientConnection, rejectAeppClientConnection, disconnectClient } = useContext(WalletSdkContext);



  const onAddClient = (uri: string) => {
    if (!uri) return;

    addAeppClient({
      uri,
    })
  }

  const renderScanAndWalletInputCard = () => sdkReady && (
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
          onChange={event => onAddClient(event.target.value)}
        />
      </div>
    </div>
  )

  const renderClients = () => (
    <div>
      <h2>Clients ({clients.length}) ::</h2>
      {
        clients.map((client: WalletConnect, index: number) => (
          <div key={index} className={styles['card']}>
            Peer ID: {client.peerId} <br />
            Chain ID: {client.chainId} <br />
            Session Peer ID:  {client.session.peerId} <br />
            Name:: {client.peerMeta?.name}<br />
            Website:: {client.peerMeta?.url}<br />
            <br />
            Connected: {client.connected ? 'Yes' : 'No'}

            {
              !client.connected && (
                <div className={styles['row']}>
                  <button
                    className={[styles['button'], styles['black-bg']].join(' ')}
                    onClick={() => acceptAeppClientConnection(client)}
                  >
                    Approve
                  </button>
                  <div style={{ width: '5px' }} />
                  <button
                    className={[styles['button'], styles['red-bg']].join(' ')}
                    onClick={() => rejectAeppClientConnection(client)}
                  >
                    Reject
                  </button>
                </div>
              )
            }
            <br /><br />

            {
              client.connected && (
                <div className={styles['row']}>
                  <button
                    className={[styles['button'], styles['red-bg']].join(' ')}
                    onClick={() => disconnectClient(client)}
                  >
                    Disconnect
                  </button>
                </div>
              )
            }

          </div>
        ))
      }
      <hr />
      <hr />
    </div>
  )

  return (
    <div className={styles['container']}>
      <h1>Wallet {sdkReady ? 'Ready' : 'Not Ready'}</h1>


      {renderScanAndWalletInputCard()}
      {renderClients()}

      <hr />
        {JSON.stringify(clients)}
      <hr />
    </div>
  );
}

export default Home;
