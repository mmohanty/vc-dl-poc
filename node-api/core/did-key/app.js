const express = require("express");
const nacl = require("tweetnacl");
const multibase = require("multibase");
const { SignJWT, jwtVerify, importJWK } = require("jose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// In-memory store for issued VCs
let issuedVCs = {};

// Function to generate a DID:key and keys in JWK format
async function generateDidKeyPair() {
  const keyPair = nacl.sign.keyPair();
  const rawPublicKey = Buffer.from(keyPair.publicKey);
  const encodedKeyBuffer = multibase.encode("base58btc", rawPublicKey);
  const encodedKey = Buffer.from(encodedKeyBuffer).toString();
  const didKey = `did:key:${encodedKey}`;

  // Convert the keys to JWK format
  const publicJwk = {
    kty: "OKP",
    crv: "Ed25519",
    x: rawPublicKey.toString("base64url"),
  };

  const privateJwk = {
    ...publicJwk,
    d: Buffer.from(keyPair.secretKey.slice(0, 32)).toString("base64url"),
  };

  const privateKey = await importJWK(privateJwk, "EdDSA");
  const publicKey = await importJWK(publicJwk, "EdDSA");

  return {
    didKey,
    privateKey,
    publicKey,
    privateJwk,
    publicJwk
  };
}

const convertJWKtoEdDSA = async (jwk) => {
  return await importJWK(jwk, "EdDSA");
};

let issuerKeys = {};
let holderKeys = {};


async function issueVC(
  issuerDid,
  privateKey,
  holderDid,
  drivingLicenseDetails
) {
  const vcPayload = {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    type: ["VerifiableCredential", "DrivingLicenseCredential"],
    issuer: issuerDid,
    issuanceDate: new Date().toISOString(),
    credentialSubject: {
      id: holderDid,
      drivingLicenseDetails,
    },
  };

  const jwt = await new SignJWT(vcPayload)
    .setProtectedHeader({ alg: "EdDSA" })
    .sign(privateKey);

  return jwt;
}

// Function to verify the Verifiable Credential (VC)
async function verifyVC(jwt, publicKey) {
  try {
    const { payload } = await jwtVerify(jwt, issuerKeys.publicKey, {
      algorithms: ["EdDSA"],
    });
    console.log("VC is valid:", payload);
    return payload;
  } catch (error) {
    console.error("VC verification failed:", error.message);
  }
}

// Endpoint to issue a VC and store it in memory
app.post("/issue-vc", async (req, res) => {
  const { holderDid, credentialData, issuerDid, issuerPrivateJwk } = req.body;

  const issuerPrivateKey = await convertJWKtoEdDSA(issuerPrivateJwk);

  try {
    const vcJwt = await issueVC(
      issuerDid,
      issuerPrivateKey,
      holderDid,
      credentialData
    );
    // Store the issued VC in memory
    issuedVCs[vcJwt] = vcJwt;
    res.json({ success: true, vc: vcJwt });
  } catch (error) {
    console.error("Failed to issue VC:", error);
    res.status(500).json({
      success: false,
      message: "Failed to issue VC",
      error: error.message,
    });
  }
});

app.post("/verify-vc", async (req, res) => {
  const { vc, issuerPublicJwk } = req.body;

  try {

    const issuerPublicKey = await convertJWKtoEdDSA(issuerPublicJwk);
    // Verify the VC using the local resolver
    const verifiedVC = await verifyVC(vc, issuerPublicKey);
    res.json({
      success: true,
      message: "VC verified successfully",
      verifiedVC,
    });
  } catch (error) {
    console.error("Verification failed:", error);
    res.status(400).json({
      success: false,
      message: "Verification failed",
      error: error.message,
    });
  }
});

// Endpoint to view issued VCs (for testing purposes)
app.get("/issued-vcs", (req, res) => {
  res.json(issuedVCs);
});

// API endpoint to get the issuer DID
app.get("/issuer-did", (req, res) => {
  res.json({
    did: issuerKeys.didKey,
    privateKey: issuerKeys.privateJwk,
    publicKey: issuerKeys.publicJwk,
  });
});

// API endpoint to get the holder DID
app.get("/holder-did", (req, res) => {
  res.json({
    did: holderKeys.didKey,
    privateKey: holderKeys.privateJwk,
    publicKey: holderKeys.publicJwk,
  });
});

app.listen(4000, async () => {
  issuerKeys = await generateDidKeyPair();
  holderKeys = await generateDidKeyPair();
  console.log("Issuer DID:", issuerKeys.didKey);
  console.log("Holder DID:", holderKeys.didKey);
  console.log("Issuer public JWK:", issuerKeys.publicJwk);
  console.log("Server running on http://localhost:4000");
});
