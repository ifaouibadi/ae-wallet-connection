import { render } from '@testing-library/react';

import WalletConnectBtn from './wallet-connect-btn';

describe('WalletConnectBtn', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<WalletConnectBtn />);
    expect(baseElement).toBeTruthy();
  });
});
