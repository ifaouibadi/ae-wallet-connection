import { AeppSdkContext } from "@ae-wallet-connection/features/ae-sdk";
import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Box, Button, Flex, Heading, Link, Stack, useDisclosure
} from "@chakra-ui/react";
import { AeAddress, AeLogo } from "libs/ui/components/src";
import { useContext } from "react";
import WalletConnectBtn from "../wallet-connect-btn/wallet-connect-btn";
/* eslint-disable-next-line */
export interface HeaderProps { }

export function Header(props: HeaderProps) {
  const { walletConnected, disconnectWallet, accounts } = useContext(AeppSdkContext);


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
          dApp Example
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
        {
          (walletConnected && accounts.length) && (
            <AeAddress address={accounts[0]} />
          )
        }
        {
          walletConnected ? (
            <Button
              bg='red.500'
              color='white'
              _hover={{ bg: "red.400" }}
              onClick={disconnectWallet}
            >
              Disconnect Wallet
            </Button>
          ) : (
            <WalletConnectBtn />
          )
        }

      </Stack>
    </Flex >
  );
}

export default Header;
