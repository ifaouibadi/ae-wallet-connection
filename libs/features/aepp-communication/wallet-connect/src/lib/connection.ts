import WalletConnect from '@walletconnect/client';
import { MESSAGE_DIRECTION } from '@aeternity/aepp-sdk';
import BrowserConnection from '@aeternity/aepp-sdk/es/aepp-wallet-communication/connection/BrowserWindowMessage';

export class DappBrowserConnection extends BrowserConnection {
  providerName = 'aepp-communication/wallet-connect';
  connector: WalletConnect;
  override listener?: any;

  constructor(args: any) {
    const { connector, ...options } = args;
    super(options);
    this.connector = connector;
    this.listener = null;
  }

  /**
   * Connect
   * @param onMessage - Message handler
   * @param onDisconnect - trigger when runtime connection in closed
   */
  override connect(
    onMessage: (message: any, origin: string, source: any) => void,
    onDisconnect: () => void
  ) {
    if (this.sendDirection === MESSAGE_DIRECTION.to_waellet) {
      this.listener = (message: any) =>
        onMessage(message, this.providerName, this.connector);
    } else {
      this.listener = true;
      this.connector.on('call_request', async (error, payload) => {
        if (error) {
          throw error;
        }

        if (!payload.params.topic) {
          payload.params.topic = payload.method;
        }
        onMessage(payload, this.providerName, this.connector);
      });
    }

    this.connector.on('disconnect', (error, payload) => {
      if (error) {
        throw error;
      }
      onDisconnect();
    });
  }

  /**
   * Send message
   */
  override sendMessage(message: any) {
    if (this.sendDirection === MESSAGE_DIRECTION.to_waellet) {
      this.connector
        .sendCustomRequest(message, message.params)
        .then(this.listener);
    } else if (message.result) {
      this.connector.approveRequest({
        id: message.id,
        result: message,
      });
    }
  }
  /**
   * Check if connected
   * @returns Is connected
   */
  override isConnected() {
    return this.listener != null;
  }

  override disconnect(): void {
    this.listener = null;
    if (this.sendDirection === MESSAGE_DIRECTION.to_waellet) {
      this.connector.killSession({
        message: 'Connection ended',
      });
    }
  }
}
