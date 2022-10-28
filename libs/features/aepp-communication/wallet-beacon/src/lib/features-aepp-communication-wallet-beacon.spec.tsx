import { render } from '@testing-library/react';

import FeaturesCommunicationProviderInterfaceWalletBeacon from './features-aepp-communication-wallet-beacon';

describe('FeaturesCommunicationProviderInterfaceWalletBeacon', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeaturesCommunicationProviderInterfaceWalletBeacon />);
    expect(baseElement).toBeTruthy();
  });
});
