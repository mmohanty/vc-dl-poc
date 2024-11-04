import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";

const IssueVC = () => {
  const [issuerDID, setIssuerDID] = useState("");
  const [holderDID, setHolderDID] = useState("");
  const [issuerPrivateKey, setIssuerPrivateKey] = useState({});

  const [credentialData, setCredentialData] = useState({
    name: "Manas Mohanty",
    dob: "2020-01-01",
    licenseNumber: "OD12345678",
    expiryDate: "2030-01-01",
  });
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    // Fetch issuer and holder DIDs from the backend
    const fetchDIDs = async () => {
      try {
        const issuerResponse = await axios.get(
          "http://localhost:4000/issuer-did"
        );
        const holderResponse = await axios.get(
          "http://localhost:4000/holder-did"
        );
        setIssuerDID(issuerResponse.data.did);
        setHolderDID(holderResponse.data.did);
        setIssuerPrivateKey(issuerResponse.data.privateKey);
      } catch (error) {
        console.error("Error fetching DIDs:", error);
      }
    };

    fetchDIDs();
  }, []);

  const handleChange = (e) => {
    setCredentialData({
      ...credentialData,
      [e.target.name]: e.target.value,
    });
  };

  const issueVC = async () => {
    try {
      const response = await axios.post("http://localhost:4000/issue-vc", {
        issuerDid: issuerDID,
        issuerPrivateJwk: issuerPrivateKey,
        holderDid: holderDID,
        credentialData,
      });
      setStatusMessage("VC issued successfully! ID: " + response.data.vc);
    } catch (error) {
      setStatusMessage("Error issuing VC: " + error.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Issue Verifiable Credential
      </Typography>
      <Typography variant="body1">Issuer DID: {issuerDID}</Typography>
      <Typography variant="body1">Holder DID: {holderDID}</Typography>
      <TextField
        label="Name"
        fullWidth
        margin="normal"
        name="name"
        value={credentialData.name}
        onChange={handleChange}
      />
      <TextField
        label="Date of Birth"
        fullWidth
        margin="normal"
        name="dob"
        type="date"
        value={credentialData.dob}
        onChange={handleChange}
      />
      <TextField
        label="License Number"
        fullWidth
        margin="normal"
        name="licenseNumber"
        value={credentialData.licenseNumber}
        onChange={handleChange}
      />
      <TextField
        label="Expiry Date"
        fullWidth
        margin="normal"
        name="expiryDate"
        type="date"
        value={credentialData.expiryDate}
        onChange={handleChange}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={issueVC}
        sx={{ mt: 2 }}
      >
        Issue VC
      </Button>
      {statusMessage && (
        <Typography
          variant="body1"
          color="textSecondary"
          sx={{ mt: 2, wordWrap: "break-word", whiteSpace: "normal" }}
        >
          {statusMessage}
        </Typography>
      )}
    </Box>
  );
};

export default IssueVC;
