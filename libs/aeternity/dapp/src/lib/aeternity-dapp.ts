import { AeSdkAepp, Node } from '@aeternity/aepp-sdk/es';

export function aeternityInitDappSDK(): AeSdkAepp {
  const aeSdk = new AeSdkAepp({
    name: 'Simple æpp',
    compilerUrl: 'https://compiler.aepps.com',
    nodes: [
      {
        name: 'testnet',
        instance: new Node('https://testnet.aeternity.io'),
      },
    ],
    onNetworkChange: async ({ networkId }) => {
      const [{ name }] = (await aeSdk.getNodesInPool()).filter(
        (node) => node.nodeNetworkId === networkId
      );
      aeSdk.selectNode(name);
      console.info('========================');
      console.info('onNetworkChange ::', name, networkId);
      console.info('========================');

      // commit("setNetworkId", networkId);
    },
    onAddressChange: ({ current }) => {
      console.info('========================');
      console.info('onAddressChange ::', current);
      console.info('========================');
    },
    onDisconnect: () => {
      console.info('========================');
      console.info(' onDisconnect::');
      console.info('========================');
    },
  });

  return aeSdk;
}
