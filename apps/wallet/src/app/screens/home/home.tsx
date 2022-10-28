import { WalletSdkContext } from '@ae-wallet-connection/features/ae-sdk';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Container, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, Textarea } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { QrReader } from 'react-qr-reader';

/* eslint-disable-next-line */
export interface HomeProps { }

export function Home(props: HomeProps) {
  const { sdkReady, clients, connectClient, disconnectClient } = useContext(WalletSdkContext);

  const [code, setCode] = useState<string>('');
  const [scanCode, setScanCode] = useState(false);


  const onAddClient = async (uri: string) => {
    if (!uri) return;

    await connectClient({
      uri,
      provider: 'aepp-communication/wallet-connect'
    });
    setCode('');
  }

  const renderScanAndWalletInputCard = () => sdkReady && (
    <Box mt={8} p={5} shadow='md' borderWidth='1px' >
      <Heading fontSize='xl' >Add Clients</Heading>
      <Textarea
        my={4}
        placeholder='Paste wc: uri'
        value={code}
        onChange={e => setCode(e.target.value)}
      />
      <Button onClick={() => onAddClient(code)}>
        Add Client
      </Button>
      <br />
      <br />
      <Button onClick={() => setScanCode(true)}>
        Scan
      </Button>

    </Box>

  )

  const renderQrScanner = () => (
    <Modal isOpen={scanCode} onClose={() => setScanCode(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Scan Connection Code</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <QrReader
            onResult={(result: any, error) => {
              if (result && result.text) {
                setScanCode(false);
                onAddClient(result.text)
              }

              if (error) {
                console.info(error);
              }
            }}
            constraints={{
              facingMode: 'environment'
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )

  const renderClients = () => (clients && Array.isArray(clients)) && (
    <div>
      {
        clients.map((client: any, index: number) => (
          <Box
            key={index}
            mt={8} p={4} shadow='md' borderWidth='1px' >
            <Text fontSize='md' >
              <strong>App Name:</strong> {client.name}
            </Text>
            <Text fontSize='md' >
              <strong>Client ID:</strong> {client.clientId}
            </Text>
            <Text fontSize='md' >
              <strong>Provider:</strong> {client.origin}
            </Text>

            <Button
              my={8}
              colorScheme='red'
              onClick={() => disconnectClient(client.clientId as any)}
            >
              Disconnect
            </Button>

            <Accordion allowToggle>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex='1' textAlign='left'>
                      Client JSON Data
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <pre>
                    {JSON.stringify(client, null, 4)}
                  </pre>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>
        ))
      }
    </div>
  )

  return (
    <Container>
      <Box pt={8}>
        {
          sdkReady ? (
            <Alert status='info'>
              <AlertIcon />
              <AlertTitle>WalletSDK </AlertTitle>
              <AlertDescription> is ready </AlertDescription>
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


      {renderScanAndWalletInputCard()}
      {renderQrScanner()}
      {renderClients()}
    </Container>
  );
}

export default Home;
