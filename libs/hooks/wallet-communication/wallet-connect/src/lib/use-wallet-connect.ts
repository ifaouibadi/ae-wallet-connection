import {
  getCachedWalletConnectSession,
  setCachedWalletConnectSession,
  WalletConnectClient,
} from '@ae-wallet-connection/aepp-wallet-communication/wallet-connect';
import { AeSdkWallet } from '@aeternity/aepp-sdk';
import WalletConnect from '@walletconnect/client';
import { MutableRefObject, useEffect, useRef, useState } from 'react';

export function useWalletConnect(
  sdk: MutableRefObject<AeSdkWallet | undefined>
) {
  const [clients, setClients] = useState<WalletConnect[]>([]);

  const addAeppClient = async (props: any) => {
    const connector: WalletConnect = new WalletConnect(props);

    if (!connector.connected) {
      await connector.createSession();
    }

    console.info('========================');
    console.info('useWalletConnect-> addAeppClient::', connector);
    console.info('========================');
    if (!connector.peerId) {
      _updateClients([...clients, connector]);
    } else {
      acceptAeppClientConnection(connector);
    }
  };

  const acceptAeppClientConnection = async (client: WalletConnect) => {
    if (
      !sdk.current ||
      clients.filter(
        (_client) => _client.connected && _client.peerId === client.peerId
      ).length
    )
      return;
    const chainId: any = _addRpcClient(client);
    console.log('####### chainId', chainId);
    client.approveSession({
      chainId,
      accounts: sdk.current.addresses(),
    });

    _updateClients(
      clients.map((_client) => {
        if (_client.peerId === client.peerId) {
          return client;
        }
        return _client;
      })
    );
  };

  const rejectAeppClientConnection = async (client: WalletConnect) => {
    client.rejectSession({
      message: 'Connection Was rejected by user',
    });

    _updateClients(
      clients.filter((_client) => _client.peerId !== client.peerId)
    );
  };

  const disconnectClient = async (client: WalletConnect) => {
    sdk.current?.removeRpcClient(client.chainId as any);
    _updateClients(
      clients.filter((_client) => _client.peerId !== client.peerId)
    );
  };

  const _addRpcClient = (connector: WalletConnect): any => {
    return sdk.current?.addRpcClient(
      new WalletConnectClient({
        connector,
        debug: true,
      })
    ) as any;
  };
  const _updateClients = (_clients: WalletConnect[]) => {
    setCachedWalletConnectSession(
      'clients',
      _clients.map((client: WalletConnect) => client.session)
    );
    setClients(_clients);
  };

  useEffect(() => {
    const _clients = getCachedWalletConnectSession('clients');
    if (sdk.current && _clients && !clients.length) {
      const restoredClients = _clients.map((session: any) => {
        const client = new WalletConnect({ session });

        client.chainId = _addRpcClient(client);
        return client;
      });

      setClients(restoredClients);
    }
  }, [sdk.current]);

  return {
    clients,
    addAeppClient,
    acceptAeppClientConnection,
    rejectAeppClientConnection,
    disconnectClient,
  };
}
