import { MutableRefObject } from 'react';

import { AeSdkAepp, AeSdkWallet } from '@aeternity/aepp-sdk';

export interface UseAeSdkHook {
  sdk: MutableRefObject<AeSdkAepp | AeSdkWallet | undefined>;
  sdkReady: boolean;
}
