import BrowserConnection from '@aeternity/aepp-sdk/es/aepp-wallet-communication/connection/BrowserWindowMessage';
import WalletConnect from '@walletconnect/client';

export class WalletConnectClient extends BrowserConnection {
  connector: WalletConnect;
  connected: boolean;
  override listener: any;

  constructor(args: any) {
    const { connector, ...options } = args;
    super(options);
    this.connector = connector;
    this.connected = false;
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
    this.connected = true;
    this.listener = true;
    console.info('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@======');
    console.info('connect.this', this);
    console.info('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@======');
    this.connector.on('call_request', async (error, payload) => {
      if (error) {
        throw error;
      }
      console.info('========================');
      console.info('WalletConnectClient->call_request::', payload);
      console.info('========================');
      onMessage(payload, payload.origin, payload.source);
    });

    this.connector.on('disconnect', (error, payload) => {
      if (error) {
        throw error;
      }
      onDisconnect();
    });
  }

  /**
   * Receive message
   */
  override receiveMessage(message: any) {
    console.info('========================');
    console.info('WalletConnectClient.receiveMessage ::', message);
    console.info('========================');
  }
  /**
   * Send message
   */
  override sendMessage(message: any) {
    console.info('========================');
    console.info('WalletConnectClient.sendMessage ::', message);
    console.info('========================');
    this.connector // Handle Call Request
      .approveRequest({
        id: message.id,
        result: message,
      });
  }

  override disconnect(): void {
    this.connector.killSession({
      message: 'Bye!!'
    })
  }

  /**
   * Check if connected
   * @returns Is connected
   */
  override isConnected() {
    return !!this.connected;
  }
}
