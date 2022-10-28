// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { WalletSdkProvider } from '@ae-wallet-connection/features/ae-sdk';
import { WalletConnectProvider } from '@ae-wallet-connection/features/aepp-communication/wallet-connect';
import { Header } from '@ae-wallet-connection/ui/wallet';
import { Routes, Route } from 'react-router';
import Home from './screens/home/home';

export function App() {


  return (
    <WalletSdkProvider
      providers={[new WalletConnectProvider()]}
    >
      <>
        <Header />
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
        </Routes>
      </>
    </WalletSdkProvider>
  );
}

export default App;
