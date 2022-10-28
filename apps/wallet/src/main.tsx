import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './app/app';

import { Buffer } from 'buffer';
import { FeaturesChakraUi } from '@ae-wallet-connection/features/chakra-ui';

(window as any).Buffer = Buffer as any;


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <FeaturesChakraUi>
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  </FeaturesChakraUi>
);
