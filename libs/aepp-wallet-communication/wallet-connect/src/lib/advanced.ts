import { AeSdkAepp, AeSdkWallet, WALLET_TYPE, Node } from '@aeternity/aepp-sdk';
import WalletConnect from '@walletconnect/client';
import { WalletConnectDappClient } from './client';
import { getCachedWalletConnectSession } from './utilities';

export interface SharedWalletConnecterI {
  sdk?: AeSdkAepp | AeSdkWallet;
  connector?: WalletConnect;
  isConnected?: boolean;

  initWallet: () => Promise<any>;
  initClient: () => Promise<any>;

  requestWalletConnection: () => Promise<string>;
  acceptClientConnection: (requestId: string) => Promise<void>;
  rejectClientConnection: (requestId: string) => Promise<void>;
  disconnect: () => Promise<void>;
}

export class SharedWalletConnecter implements SharedWalletConnecterI {
  sdk?: AeSdkAepp | AeSdkWallet;
  connector?: WalletConnect;
  isConnected?: boolean;
  compilerUrl = 'https://compiler.aepps.com';
  nodes = [
    {
      name: 'testnet',
      instance: new Node('https://testnet.aeternity.io'),
    },
  ];

  async initWallet(): Promise<SharedWalletConnecter> {
    console.info('========================');
    console.info('SWC->initWallet ');
    console.info('========================');

    const { nodes, compilerUrl } = this;
    const sdk = new AeSdkWallet({
      id: 'ae-wallet',
      name: 'Wallet',
      type: WALLET_TYPE.extension,
      compilerUrl,
      nodes,
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

    this.sdk = sdk;
    return this;
  }
  async initClient(): Promise<SharedWalletConnecter> {
    console.info('========================');
    console.info('SWC->initClient ');
    console.info('========================');
    const { nodes, compilerUrl } = this;

    const sdk = new AeSdkAepp({
      name: 'Simple æpp',
      compilerUrl,
      nodes,
      onNetworkChange: async ({ networkId }) => {
        const [{ name }] = (await sdk.getNodesInPool()).filter(
          (node: any) => node.nodeNetworkId === networkId
        );
        sdk.selectNode(name);
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
        console.info('========================');
        console.info(' onDisconnect::');
        console.info('========================');
      },
    });

    this.sdk = sdk;
    const session = getCachedWalletConnectSession();
    if (session) {
      await this._clientRestoreSessionConnection({ session });
    }

    return this;
  }

  async _clientConnectToWallet() {
    if (this.sdk && this.sdk instanceof AeSdkAepp) {
      const walletConnector = (await new WalletConnectDappClient({
        connector: this.connector,
        debug: true,
        origin: window.location.origin,
        receiveDirection: 'to_aepp',
        sendDirection: 'to_waellet',
      })) as any;

      const wallet = await this.sdk.connectToWallet(walletConnector, {
        connectNode: true,
        name: 'wallet-node',
        select: true,
      });

      // setWalletConnected(true);

      console.info('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@======');
      console.info('client connector-> connect ini wallet ::', wallet);
      console.info('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@======');

      this.sdk
        .subscribeAddress('subscribe' as any, 'connected')
        .then((data: any) => {
          console.info('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@======');
          console.info('aeSdk.subscribeAddress ::', data);
          console.info('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@======');
        });

      this.isConnected = true;
    }
  }
  async _clientRestoreSessionConnection(props: any) {
    this.connector = new WalletConnect(props);

    this.connector.on('connect', async (error, payload) => {
      console.info('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@======');
      console.info(
        '_clientRestoreSessionConnection .on. connect::',
        error,
        payload
      );
      console.info('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@======');

      if (error) {
        throw error;
      }

      this._clientConnectToWallet();
    });

    // Check if connection is already established
    if (!this.connector.connected) {
      // create new session
      await this.connector.createSession();
    } else {
      console.log('connected --->->-');
      this._clientConnectToWallet();
    }

    return this;
  }

  async requestWalletConnection() {
    return 'TODO';
  }

  async acceptClientConnection(requestId: string) {
    console.log('acceptClientConnection::', requestId);
  }

  async rejectClientConnection(requestId: string) {
    console.log('rejectClientConnection::', requestId);
  }

  async disconnect() {
    console.log('disconnect');
  }
}
