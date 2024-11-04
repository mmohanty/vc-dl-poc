const express = require('express');
const { Wallet } = require('ethers');
const { EthrDID } = require('ethr-did');

const app = express();
app.use(express.json());

// Function to create a new Ethereum wallet
function createWallet() {
  const wallet = Wallet.createRandom();
  return wallet;
}

// Function to create an Ethr DID from a wallet
function createDID(wallet) {
  const ethrDID = new EthrDID({
    identifier: wallet.address,
    privateKey: wallet.privateKey.substring(2),
  });
  return ethrDID;
}

// Create issuer wallet and DID
console.log('--- Issuer Wallet and DID ---');
const issuerWallet = createWallet();
const issuerDID = createDID(issuerWallet);


// Create holder wallet and DID
console.log('--- Holder Wallet and DID ---');
const holderWallet = createWallet();
const holderDID = createDID(holderWallet);




module.exports = { issuerWallet, issuerDID, holderWallet , holderDID };