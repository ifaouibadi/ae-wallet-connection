import { AeppSdkContext } from '@ae-wallet-connection/features/ae-sdk';
import { WalletConnectBtn } from '@ae-wallet-connection/ui/dapp';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Code, Container, Heading, Spinner, VStack } from '@chakra-ui/react';
import { useContext } from 'react';
import styles from './home.module.css';

/* eslint-disable-next-line */
export interface HomeProps { }

export function Home(props: HomeProps) {
  const { sdkReady, walletConnected, accounts } = useContext(AeppSdkContext);

  const appReady = sdkReady;


  const renderAccounts = () => walletConnected && (
    <Box>
      <Heading size='md'>Accounts :</Heading>
      <Code>
        {JSON.stringify(accounts, null, 4)}
      </Code>
    </Box>
  )

  const renderConnectWallet = () => !walletConnected && (
    <WalletConnectBtn />
  )

  return (
    <Container>
      <VStack className={styles['container']}>
        <Box pt={8}>
          {
            appReady ? (
              <Alert status='info'>
                <AlertIcon />
                <AlertTitle>AeSDK </AlertTitle>
                <AlertDescription> is ready {walletConnected ? ' and wallet is connected!' : 'for wallet connection!'}</AlertDescription>
              </Alert>
            ) : (
              <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='red.500'
                size='xl'
              />
            )
          }
        </Box>
        <br />
        {renderAccounts()}
        {renderConnectWallet()}
        <br />

      </VStack>
    </Container>
  );
}

export default Home;
