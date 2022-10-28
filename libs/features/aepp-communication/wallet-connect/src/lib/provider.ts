import { CommunicationProviderInterface } from '@ae-wallet-connection/features/aepp-communication/shared';
import { AeSdkAepp, AeSdkWallet } from '@aeternity/aepp-sdk';
import { WalletInfo } from '@aeternity/aepp-sdk/es/aepp-wallet-communication/rpc/types';
import WalletConnect from '@walletconnect/client';
import {
  IWalletConnectOptions,
  IWalletConnectSession,
} from '@walletconnect/types';
import { DappBrowserConnection } from './connection';

export class WalletConnectProvider implements CommunicationProviderInterface {
  name = 'aepp-communication/wallet-connect';
  clients: WalletConnect[] = [];

  async connectClient(sdk: AeSdkWallet, params: IWalletConnectOptions) {
    localStorage.removeItem('walletconnect');

    const connector: WalletConnect = new WalletConnect(params);

    if (!connector.connected) {
      await connector.createSession();
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let clientId: string = connector.session.chainId as never;
        if (!connector.connected) {
          clientId = sdk.addRpcClient(
            new DappBrowserConnection({
              connector,
            })
          );
          connector.approveSession({
            chainId: clientId as never,
            accounts: sdk.addresses(),
          });
        }

        resolve({
          clientId,
          session: connector.session,
        });
      }, 500);
    });
  }

  async restoreClient(sdk: AeSdkWallet, params: any) {
    if (params.session) {
      return await this.connectClient(sdk, {
        ...params,
        session: {
          ...params.session,
          connected: false,
        },
      });
    }
    return null;
  }

  async disconnectClient(sdk: AeSdkWallet, params: any) {
    const connector: WalletConnect = new WalletConnect(params.session);
    connector.killSession({
      message: 'Bye!!',
    });
  }

  async connectWallet(
    sdk: AeSdkAepp,
    onConnectCallback: (wallet: any) => void,
    session: IWalletConnectSession | any = {}
  ) {
    localStorage.removeItem('walletconnect');

    const connector = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org', // Required
      session,
    });

    const _connectToWallet = async () => {
      const walletConnector = (await new DappBrowserConnection({
        connector,
        debug: true,
        origin: this.name,
        receiveDirection: 'to_aepp',
        sendDirection: 'to_waellet',
      })) as any;
      try {
        await sdk.disconnectWallet();
      } catch (error) {
        //
      }
      const wallet = await sdk.connectToWallet(walletConnector, {
        connectNode: true,
        name: connector.chainId as never,
        select: true,
      });

      onConnectCallback({
        ...wallet,
        clientId: connector.chainId as never,
        session: connector.session,
        origin: this.name,
      });
    };

    connector.on('connect', async (error, payload) => {
      if (error) {
        throw error;
      }
      _connectToWallet();
    });

    if (session.clientId) {
      await _connectToWallet();
    } else {
      await connector.createSession();
    }

    return connector.uri;
  }

  async disconnectWallet(sdk: AeSdkAepp) {
    try {
      sdk.disconnectWallet();
    } catch (error) {
      //
    }
  }

  async restoreWalletConnection(sdk: AeSdkAepp, params: any) {
    return new Promise((resolve, reject) => {
      this.connectWallet(
        sdk,
        (wallet: WalletInfo) => resolve(wallet),
        params.session
      );
    }) as any;
  }
}
