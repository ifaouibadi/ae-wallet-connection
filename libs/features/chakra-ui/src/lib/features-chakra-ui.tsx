import React from 'react';

import { ChakraProvider, theme } from '@chakra-ui/react'

export interface FeaturesChakraUiProps {
  children: React.ReactNode
}

export function FeaturesChakraUi({ children }: FeaturesChakraUiProps) {
  return (
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  );
}

export default FeaturesChakraUi;
