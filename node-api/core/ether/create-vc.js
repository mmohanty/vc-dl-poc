const { createVerifiableCredentialJwt } = require('did-jwt-vc');
const { issuerDID } = require('./wallet-did-setup');

async function createDrivingLicenseVC(holderDid, licenseData) {
  const vcPayload = {
    sub: holderDid,
    nbf: Math.floor(Date.now() / 1000),
    vc: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential', 'DrivingLicenseCredential'],
      credentialSubject: {
        id: holderDid,
        licenseData,
      },
    },
  };

  const jwt = await createVerifiableCredentialJwt(vcPayload, issuerDID);
  console.log('Verifiable Credential JWT:', jwt);
  return jwt;
}

// Export the function
module.exports = { createDrivingLicenseVC };

// Sample call to create a VC -- for testing purposes
// const holderDID = 'did:ethr:0xE8Fccd1328225D0eA66A62F8fBD3f637066D0ADb'; // Replace with actual holder DID from the generated wallet
// const licenseData = {
//   name: 'John Doe',
//   licenseNumber: 'DL12345678',
//   expiryDate: '2025-10-01',
// };

// createDrivingLicenseVC(holderDID, licenseData);
