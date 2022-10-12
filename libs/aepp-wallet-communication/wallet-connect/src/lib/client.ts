import BrowserConnection from '@aeternity/aepp-sdk/es/aepp-wallet-communication/connection/BrowserWindowMessage';
import WalletConnect from '@walletconnect/client';

export class WalletConnectDappClient extends BrowserConnection {
  connector: WalletConnect;
  override listener?:
    | ((this: Window, ev: MessageEvent<any>) => void)
    | undefined;

  constructor(args: any) {
    const { connector, ...options } = args;
    super(options);
    this.connector = connector;
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
    console.info('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@======');
    console.info('connect.this', this);
    console.info('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@======');
    this.listener = (message: any) => {
      console.info('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@======');
      console.info('WalletConnectDappClient-> listener::', message);
      console.info('this', this);
      console.info('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@======');
      onMessage(message, 'http://localhost:3001/', '');
    };

    this.connector.on('disconnect', (error, payload) => {
      if (error) {
        throw error;
      }
      onDisconnect();
    });

    // window.addEventListener("message", this.listener);
  }

  /**
   * Send message
   */
  override sendMessage(message: any) {
    this.connector
      .sendCustomRequest(message, message.params)
      .then(this.listener);
  }
  /**
   * Check if connected
   * @returns Is connected
   */
  override isConnected() {
    return this.listener != null;
  }

  override disconnect(): void {
    delete this.listener;
    this.connector.killSession({
      message: 'Connection ended',
    });
  }
}
