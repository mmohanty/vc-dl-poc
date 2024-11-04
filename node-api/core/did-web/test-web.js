const { Resolver } = require('did-resolver');
const { getResolver} = require ('web-did-resolver');

// Create a DID resolver that includes the did:web method
const didResolver = new Resolver({
  ...getResolver(),
});

// Example: Resolve a did:web
const resolveDid = async (did) => {
  try {
    const didDocument = await didResolver.resolve(did);
    console.log('DID Document:', didDocument);
  } catch (error) {
    console.error('Error resolving DID:', error);
  }
};

// Replace with your desired DID:web identifier
resolveDid('did:web:example.com');
