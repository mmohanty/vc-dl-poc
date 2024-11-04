const express = require('express');
const { SigningStargateClient } = require('@cosmjs/stargate');
const { DirectSecp256k1HdWallet } = require('@cosmjs/proto-signing');
const crypto = require('crypto');
const { issuerWallet, holderWallet, issuerDID, holderDID } = require('./wallet-setup');
const { Resolver } = require('did-resolver');
const bs58 = require('bs58');
const { createJWT, verifyJWT } = require('did-jwt');
const cors = require('cors');



//for production grade one of these - not sure which one is better
//const { getResolver } = require('key-did-resolver');
//const { getResolver } = require('ethr-did-resolver');

// for local testing
const { verifyCredential } = require('did-jwt-vc');
const { Wallet } = require('ethers');



const bodyParser = require('body-parser');
const app = express();

app.use(cors());// Enable CORS for all routes
app.use(bodyParser.json());


// In-memory store for issued VCs
let issuedVCs = {};


//for production grade
// Create a DID resolver instance
// const resolver = new Resolver({
//     ...getResolver({
    // networks: [
    //     { name: 'mainnet', rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID' },
    //     { name: 'ropsten', rpcUrl: 'https://ropsten.infura.io/v3/YOUR_INFURA_PROJECT_ID' }
    //   ]}),
//   });
 // Verification endpoint
//  app.post('/verify-vc', async (req, res) => {
//     const { vc } = req.body;
  
//     try {
//       // Verify the credential
//       const verifiedVC = await verifyCredential(vc, {
//         resolver,
//         compactProof: true, // Use compact proof mode if needed
//       });
  
//       // If verification succeeds, return the details
//       res.json({ success: true, message: 'VC verified successfully', verifiedVC });
//     } catch (error) {
//       // If verification fails, return the error
//       res.status(400).json({ success: false, message: 'Verification failed', error: error.message });
//     }
//   });

//End of production ready code

// for local testing
// Function to create a wallet and get the public key in Base58
function getIssuerPublicKeyBase58() {
  
    // Get the public key in hexadecimal format (uncompressed, starts with '0x04')
    const publicKeyHex = issuerWallet.publicKey;
  
    // Remove the '0x' prefix and convert the hex to a buffer
    const publicKeyBuffer = Buffer.from(publicKeyHex.slice(2), 'hex');
  
    // Encode the public key in Base58
    const publicKeyBase58 = bs58.default.encode(publicKeyBuffer);
  
    console.log('Issuer Wallet Address:', issuerWallet.address);
    console.log('Issuer Private Key:', issuerWallet.privateKey);
    console.log('Issuer Public Key Base58:', publicKeyBase58);
  
    return { issuerWallet, publicKeyBase58 };
  }

  function getHolderPublicKeyBase58() {
  
    // Get the public key in hexadecimal format (uncompressed, starts with '0x04')
    const publicKeyHex = holderWallet.publicKey;
  
    // Remove the '0x' prefix and convert the hex to a buffer
    const publicKeyBuffer = Buffer.from(publicKeyHex.slice(2), 'hex');
  
    // Encode the public key in Base58
    const publicKeyBase58 = bs58.default.encode(publicKeyBuffer);
  
    console.log('Holder Wallet Address:', issuerWallet.address);

  
    return { holderWallet, publicKeyBase58 };
  }
// Mock data store for DIDs (replace with an actual store or database if needed)
const localDIDs = {
    issuerDID: {
      id: issuerDID.did,
      publicKeyBase58: bs58.default.encode(Buffer.from(issuerWallet.publicKey.slice(2), 'hex')),
    },
    holderDID: {
      id: holderDID.did,
      publicKeyBase58: bs58.default.encode(Buffer.from(holderWallet.publicKey.slice(2), 'hex')),
    }
  };

// Custom local resolver for DIDs
const customResolver = new Resolver({
    resolve: async (did) => {
        console.log('Resolving DID:', did); 
      if (localDIDs[did]) {
        return {
          '@context': 'https://w3id.org/did/v1',
          id: did,
          publicKey: [
            {
              id: `${did}#keys-1`,
              type: 'Ed25519VerificationKey2018',
              controller: did,
              publicKeyBase58: localDIDs[did].publicKeyBase58,
            }
          ]
        };
      } else {
        throw new Error(`DID not found: ${did}`);
      }
    }
  });
  // Create an instance of Resolver
  const localResolver = new Resolver({
    ...customResolver
  });

  // Endpoint to verify a VC locally
app.post('/verify-vc', async (req, res) => {
    const { vc } = req.body;
  
    try {
      // Verify the VC using the local resolver
      const verifiedVC = await verifyCredential(vc, { resolver: localResolver });
      res.json({ success: true, message: 'VC verified successfully', verifiedVC });
    } catch (error) {
        console.error('Verification failed:', error);
      res.status(400).json({ success: false, message: 'Verification failed', error: error.message });
    }
  });

  //End of Local testing code

  const signer = async (data) => {
    console.log('Signing data:', data);
    const signature = await issuerWallet.signMessage(data);
    // Convert signature to a format compatible with JWT (hex format)
    return signature; 
  };

  async function signPayload(jwtPayload, issuerDid) {
    return await createJWT(
        jwtPayload,
        {
            issuer: issuerDid,
            signer,
            alg: 'ES256K'
        }
    );
}

// Endpoint to issue a VC and store it in memory
app.post('/issue-vc', async (req, res) => {
    const { holderDid, credentialData, issuerDid } = req.body;
  
    try {

      // Create a signer function for the JWT
  
      const jwtPayload = {
        sub: holderDid,
        vc: {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential'],
          issuer: issuerDid,
          issuanceDate: new Date().toISOString(),
          credentialSubject: credentialData,
        }
      };
  
      // Sign the payload and create the JWT
      const jwt = await signPayload(jwtPayload, issuerDid);
  
      // Store the issued VC in memory
      issuedVCs[jwt] = jwt;
  
      res.json({ success: true, vc: jwt });
  
    } catch (error) {
        console.error('Failed to issue VC:', error);
      res.status(500).json({ success: false, message: 'Failed to issue VC', error: error.message });
    }

  });
  
  // Endpoint to view issued VCs (for testing purposes)
  app.get('/issued-vcs', (req, res) => {
    res.json(issuedVCs);
  });
  

 

  // API endpoint to get the issuer DID
app.get('/issuer-did', (req, res) => {
    res.json({
      did: issuerDID.did,
      walletAddress: issuerWallet.address,
      privateKey: issuerWallet.privateKey,
    });
  });
  
  // API endpoint to get the holder DID
  app.get('/holder-did', (req, res) => {
    res.json({
      did: holderDID.did,
      walletAddress: holderWallet.address,
      privateKey: holderWallet.privateKey,
    });
  });

  app.listen(4000, () => {
    console.log('Server running on http://localhost:4000');
  });