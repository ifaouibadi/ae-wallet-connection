import { AeppSdkContext } from '@ae-wallet-connection/features/ae-sdk';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import QRCode from "react-qr-code";

/* eslint-disable-next-line */
export interface WalletConnectBtnProps { }

export function WalletConnectBtn(props: WalletConnectBtnProps) {
  const { connectWallet } = useContext(AeppSdkContext);
  const toast = useToast()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [code, setCode] = useState('');


  const onConnectWalletClick = async () => {
    const _code = await connectWallet('aepp-communication/wallet-connect');
    setCode(_code);
    onOpen();
  }

  const onCopyCode = async () => {
    await navigator.clipboard.writeText(code);
    toast({
      title: 'Connection Code',
      description: "Copied to clipboard!!",
      status: 'success',
      duration: 9000,
      isClosable: true,
    });
    onClose();
  }


  const renderQrCodeModal = () => (
    <Modal
      isOpen={isOpen}
      onClose={onClose}>
      <ModalOverlay
        bg='blackAlpha.300'
        backdropFilter='blur(10px) hue-rotate(90deg)'
      />
      <ModalContent>
        <ModalHeader>Scan Connection Code</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <QRCode
            value={code}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            viewBox={`0 0 256 256`}
          />

          <Button
            mt={4}
            w='100%'
            onClick={onCopyCode}

          >
            Copy Code
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  )

  return (
    <>
      {renderQrCodeModal()}
      <Button
        variant="outline"
        _hover={{ bg: "blue.500", color: 'white' }}
        onClick={onConnectWalletClick}
      >
        Connect To Wallet
      </Button>
    </>
  );
}

export default WalletConnectBtn;
