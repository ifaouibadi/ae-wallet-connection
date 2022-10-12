import { render } from '@testing-library/react';

import { WalletSdkProvider } from './wallet-sdk-provider';

describe('WalletSdkProvider', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <WalletSdkProvider >
        Hello
      </WalletSdkProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
