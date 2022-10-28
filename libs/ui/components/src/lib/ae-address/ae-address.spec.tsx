import { render } from '@testing-library/react';

import AeAddress from './ae-address';

describe('AeAddress', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AeAddress />);
    expect(baseElement).toBeTruthy();
  });
});
