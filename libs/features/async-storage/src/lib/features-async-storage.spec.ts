import { getStorageValue } from './features-async-storage';

describe('getStorageValue', () => {
  it('should work', () => {
    expect(getStorageValue()).toEqual('features-async-storage');
  });
});
