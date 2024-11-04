const { verifyCredential } = require('did-jwt-vc');
const { Resolver } = require('did-resolver');
const { getResolver } = require('ethr-did-resolver');

const providerConfig = {
  rpcUrl: 'https://mainnet.infura.io/v3/205806f5baa148e4ba7249aa487397e2', // Replace with your provider
};
const resolver = new Resolver(getResolver(providerConfig));

async function verifyVC(jwt) {
  try {
    const verifiedVC = await verifyCredential(jwt, resolver);
    console.log('Verified VC:', verifiedVC);
  } catch (error) {
    console.error('Verification failed:', error);
  }
}



// Export the function
module.exports = { verifyVC };

// Call the function to verify a VC
// const jwt = 'eyJhbGciOiJFUzI1NkstUiIsInR5cCI6IkpXVCJ9.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiRHJpdmluZ0xpY2Vuc2VDcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmV0aHI6MHhhYmNkZWYxMjM0NTYiLCJsaWNlbnNlRGF0YSI6eyJuYW1lIjoiSm9obiBEb2UiLCJsaWNlbnNlTnVtYmVyIjoiREwxMjM0NTY3OCIsImV4cGlyeURhdGUiOiIyMDI1LTEwLTAxIn19fSwic3ViIjoiZGlkOmV0aHI6MHhhYmNkZWYxMjM0NTYiLCJuYmYiOjE3MzA1NTEyMzQsImlzcyI6ImRpZDpldGhyOjB4ZEUxZGJmQmNiRWZBNUM1MzBjM0M4QTk0RDhhOEJmNTQ4NzgzMTdERCJ9.88mXL6OtynWa1vQ-VOq13kChSG8BwDVTZbbD703yFEppLZEmAhLZi_3pABBPynxQb-rK5V3R0i1nHNX1loZsFAA'; // Replace with the actual JWT created earlier
// verifyVC(jwt);
