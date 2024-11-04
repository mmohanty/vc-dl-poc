const nacl = require('tweetnacl');
const multibase = require('multibase');
const { SignJWT, jwtVerify, importJWK } = require('jose');

// Function to generate a DID:key and keys in JWK format
async function generateDidKeyPair() {
  const keyPair = nacl.sign.keyPair();
  const rawPublicKey = Buffer.from(keyPair.publicKey);
  const encodedKeyBuffer = multibase.encode('base58btc', rawPublicKey);
  const encodedKey = Buffer.from(encodedKeyBuffer).toString();
  const didKey = `did:key:${encodedKey}`;

  // Convert the keys to JWK format
  const publicJwk = {
    kty: 'OKP',
    crv: 'Ed25519',
    x: rawPublicKey.toString('base64url'),
  };

  const privateJwk = {
    ...publicJwk,
    d: Buffer.from(keyPair.secretKey.slice(0, 32)).toString('base64url'),
  };

  const privateKey = await importJWK(privateJwk, 'EdDSA');
  const publicKey = await importJWK(publicJwk, 'EdDSA');

  return {
    didKey,
    privateKey,
    publicKey,
  };
}

// Function to issue a Verifiable Credential (VC)
async function issueVC(issuerDid, privateKey, holderDid, drivingLicenseDetails) {
  const vcPayload = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiableCredential', 'DrivingLicenseCredential'],
    issuer: issuerDid,
    issuanceDate: new Date().toISOString(),
    credentialSubject: {
      id: holderDid,
      drivingLicenseDetails,
    },
  };

  const jwt = await new SignJWT(vcPayload)
    .setProtectedHeader({ alg: 'EdDSA' })
    .sign(privateKey);

  return jwt;
}

// Function to verify the Verifiable Credential (VC)
async function verifyVC(jwt, publicKey) {
  try {
    const { payload } = await jwtVerify(jwt, publicKey, {
      algorithms: ['EdDSA'],
    });
    console.log('VC is valid:', payload);
  } catch (error) {
    console.error('VC verification failed:', error.message);
  }
}

// Main function to issue and verify a VC
(async () => {
  const issuerKeys = await generateDidKeyPair();
  const holderKeys = await generateDidKeyPair();

  console.log('Issuer DID:', issuerKeys.didKey);

  const drivingLicenseDetails = {
    licenseNumber: 'DL-123-456-789',
    name: 'John Doe',
    issuedDate: '2022-01-01',
    expiryDate: '2032-01-01',
    category: 'B',
  };

  const vcJwt = await issueVC(issuerKeys.didKey, issuerKeys.privateKey, holderKeys.didKey, drivingLicenseDetails);
  console.log('Issued VC JWT:', vcJwt);

  await verifyVC(vcJwt, issuerKeys.publicKey);
})();
