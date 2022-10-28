import { Text, TextProps } from '@chakra-ui/react';

export interface AeAddressProps extends TextProps {
  address: string
}

export function AeAddress(props: AeAddressProps) {

  const { address } = props;

  if (!address) return null;

  return (
    <Text alignItems='center' {...props}>
      {address.substring(0, 6)}
      ...
      {address.substring(address.length - 3, address.length)}
    </Text>
  );
}

export default AeAddress;
