import { render } from '@testing-library/react';

import FeaturesChakraUi from './features-chakra-ui';

describe('FeaturesChakraUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeaturesChakraUi />);
    expect(baseElement).toBeTruthy();
  });
});
