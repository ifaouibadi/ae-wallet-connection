import { AeppSdkContext } from 'libs/ui/providers/sdk/src';
import { useContext } from 'react';
import styles from './home.module.css';

/* eslint-disable-next-line */
export interface HomeProps { }

export function Home(props: HomeProps) {
  const { sdk, sdkReady, walletConnectorReady, walletConnected, connectWallet, disconnectWallet } = useContext(AeppSdkContext);

  const appReady = sdkReady && walletConnectorReady;

  const getAddresses = async () => {
    const _addresses = sdk.current?.addresses();

    console.info("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@======");
    console.info("dapp getAddresses ::", _addresses);
    console.info("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@======");
  }


  const renderConnectToWallet = () => (appReady && !walletConnected) && (
    <div>
      <button onClick={connectWallet}>
        Connect To Wallet
      </button>
    </div>
  )

  const renderDisconnectWallet = () => (appReady && walletConnected) && (
    <div>
      <button onClick={disconnectWallet}>
        Disconnect
      </button>
    </div>
  )

  const renderGetAddress = () => (appReady && walletConnected) && (
    <div>
      <br />
      <button onClick={getAddresses}>
        Get Address
      </button>
    </div>
  )

  return (
    <div className={styles['container']}>
      <h3>APP {appReady ? 'Ready' : 'Not Ready'}</h3>
      <br />
      {renderConnectToWallet()}
      {renderDisconnectWallet()}
      {renderGetAddress()}
      <br />

    </div>
  );
}

export default Home;
