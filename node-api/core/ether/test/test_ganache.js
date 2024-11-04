const { Resolver } = require('did-resolver');
const { getResolver } = require('ethr-did-resolver');
const { ethers } = require('ethers');

// Configure a provider for your local Ganache instance
const provider = new ethers.JsonRpcProvider('http://localhost:8545');

// Configuration for ethr-did-resolver with a local network
const ethrDidConfig = {
  networks: [
    {
      name: 'development',
      rpcUrl: 'http://localhost:8545',
      chainId: 1337, // Ganache default chain ID
      registry: '0x0000000000000000000000000000000000000000', // Replace with DID Registry address if needed
    },
  ],
};

// Initialize the DID resolver with the ethr-did-resolver
const ethrDidResolver = getResolver(ethrDidConfig);
const didResolver = new Resolver(ethrDidResolver);

// Function to resolve a sample DID
async function resolveDid(did) {
  try {
    const doc = await didResolver.resolve(did);
    console.log('Resolved DID Document:', JSON.stringify(doc, null, 2));
  } catch (error) {
    console.error('Error resolving DID:', error);
  }
}

// Replace with a sample DID created for testing
resolveDid('did:ethr:development:0x846426B56b98ce02251CE2bbd4861b5750526732');
