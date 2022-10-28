
import { AeppSdkProvider } from "@ae-wallet-connection/features/ae-sdk";
import { WalletConnectProvider } from "@ae-wallet-connection/features/aepp-communication/wallet-connect";
import { Header } from "@ae-wallet-connection/ui/dapp";
import { Route, Routes } from "react-router-dom";


import Home from "./screens/home/home";

export function App() {
  return (
    <AeppSdkProvider
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
    </AeppSdkProvider>
  );
}

export default App;
