import { WalletSdkContext } from "@ae-wallet-connection/features/ae-sdk";
import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box, Flex, Heading, Link, Stack, useDisclosure
} from "@chakra-ui/react";
import { AeAddress, AeLogo } from "libs/ui/components/src";
import { useContext } from "react";
/* eslint-disable-next-line */
export interface HeaderProps { }

export function Header(props: HeaderProps) {
  const { accounts, clients } = useContext(WalletSdkContext);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleToggle = () => (isOpen ? onClose() : onOpen());

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={6}
      bg="white"
      color="black"
      boxShadow='md'
      {...props}
    >
      <Flex align="center" mr={5}>
        <AeLogo />
        <Heading as="h5" size="sm" pl={2}>
          Wallet Example
        </Heading>
      </Flex>

      <Box display={{ base: "block", md: "none" }} onClick={handleToggle}>
        <HamburgerIcon />
      </Box>

      <Stack
        direction={{ base: "column", md: "row" }}
        display={{ base: isOpen ? "block" : "none", md: "flex" }}
        width={{ base: "full", md: "auto" }}
        alignItems="center"
        flexGrow={1}
        mt={{ base: 4, md: 0 }}
      >
        <Box>
          <Link href='https://docs.aeternity.com/aepp-sdk-js/v12.1.2/' isExternal>
            Docs
          </Link>
        </Box>
        <Box>
          <Link href='https://github.com/ifaouibadi/ae-wallet-connection' isExternal>
            Source Code
          </Link>
        </Box>
      </Stack>

      <Stack
        direction={{ base: "column", md: "row" }}
        display={{ base: isOpen ? "block" : "none", md: "flex" }}
        width={{ base: "full", md: "auto" }}
        alignItems="center"
        mt={{ base: 4, md: 0 }}
      >

        <Link mr={4}>
          Clients
          <Badge ml='1' colorScheme='red'>
            {clients.length}
          </Badge>
        </Link>

        {
          (accounts.length) && (
            <AeAddress address={accounts[0]} />
          )
        }
      </Stack>
    </Flex >
  );
}

export default Header;
