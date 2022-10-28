import { Image, ImageProps } from '@chakra-ui/react';
import Logo from './logo-black-text.svg'


export function AeLogo(props: ImageProps) {
  return (
    <Image {...props} src={Logo} />
  );
}

export default AeLogo;
