const express = require("express");

const cors = require("cors");
const bodyParser = require("body-parser");
const { BearerDid, DidJwk } = require("@web5/dids"); // or "@web5/dids";
const { LocalKeyManager } = require("@web5/crypto"); // or "@web5/crypto";
const { VerifiableCredential, VerifiablePresentation, PresentationExchange } = require('@web5/credentials');
const app = express();


app.use(cors());// Enable CORS for all routes
app.use(bodyParser.json());


// In-memory store for issued VCs
let issuedVCs = {};

// for local testing
// Function to create a wallet and get the public key in Base58
function getIssuerPublicKeyBase58() {
  // Get the public key in hexadecimal format (uncompressed, starts with '0x04')
  const publicKeyHex = issuerWallet.publicKey;

  // Remove the '0x' prefix and convert the hex to a buffer
  const publicKeyBuffer = Buffer.from(publicKeyHex.slice(2), "hex");

  // Encode the public key in Base58
  const publicKeyBase58 = bs58.default.encode(publicKeyBuffer);

  console.log("Issuer Wallet Address:", issuerWallet.address);
  console.log("Issuer Private Key:", issuerWallet.privateKey);
  console.log("Issuer Public Key Base58:", publicKeyBase58);

  return { issuerWallet, publicKeyBase58 };
}



// Endpoint to verify a VC locally
app.post("/verify-vc", async (req, res) => {
  const { vc } = req.body;

  try {
    // Verify the VC using the local resolver
    const vcJwt = await VerifiableCredential.verify({ vcJwt: vc });
    console.log("VC Verification successful!");
    res.json({
      success: true,
      message: "VC verified successfully",
      vcJwt,
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

// Endpoint to issue a VC and store it in memory
app.post("/issue-vc", async (req, res) => {
  const { holderDid, credentialData, issuerDid } = req.body;

  try {
    res.setHeader("Content-Type", "application/json");

    const issuer = await DidJwk.create({ keyManager });

    const vc = await VerifiableCredential.create({
      type: "DrivingLicense",
      issuer: issuer.uri,
      subject: "did:example:subject",
      data: credentialData,
    });

    console.log("Issuer Docs");
    console.log(issuer.uri);

    const signedVcJwt = await vc.sign({ did: issuer });

    // Store the issued VC in memory
    issuedVCs[signedVcJwt] = signedVcJwt;

    res.json({ success: true, vc: signedVcJwt });
  } catch (error) {
    console.error("Failed to issue VC:", error);
    res.status(500).json({
      success: false,
      message: "Failed to issue VC",
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
    did: issuerDID.did,
    walletAddress: issuerWallet.address,
    privateKey: issuerWallet.privateKey,
  });
});

// API endpoint to get the holder DID
app.get("/holder-did", (req, res) => {
  res.json({
    did: holderDID.did,
    walletAddress: holderWallet.address,
    privateKey: holderWallet.privateKey,
  });
});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
