
import { Route, Routes } from "react-router-dom";
import { AeppSdkProvider } from "libs/ui/providers/sdk/src";


import Home from "./screens/home/home";

export function App() {
  return (
    <AeppSdkProvider>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
      </Routes>
    </AeppSdkProvider>
  );
}

export default App;
