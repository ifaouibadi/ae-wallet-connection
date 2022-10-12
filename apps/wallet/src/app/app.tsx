// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { WalletSdkProvider } from 'libs/ui/providers/sdk/src';
import { Routes, Route } from 'react-router';
import Home from './screens/home/home';

export function App() {


  return (
    <WalletSdkProvider>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
      </Routes>
    </WalletSdkProvider>
  );
}

export default App;
