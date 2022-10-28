import { render } from '@testing-library/react';

import AeLogo from './ae-logo';

describe('AeLogo', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AeLogo />);
    expect(baseElement).toBeTruthy();
  });
});
