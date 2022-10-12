import { render } from '@testing-library/react';

import { AeppSdkProvider } from './aepp-sdk-provider';

describe('AeppSdkProvider', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <AeppSdkProvider >
        Hello
      </AeppSdkProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
