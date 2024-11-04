import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';

const VerifyVC = () => {
  const [vcInput, setVcInput] = useState('');
  const [verificationResult, setVerificationResult] = useState('');


  const [issuerPublicKey, setIssuerPublicKey] = useState({});


  useEffect(() => {
    // Fetch issuer and holder DIDs from the backend
    const fetchDIDs = async () => {
      try {
        const issuerResponse = await axios.get('http://localhost:4000/issuer-did');
       
        setIssuerPublicKey(issuerResponse.data.publicKey);
      } catch (error) {
        console.error('Error fetching DIDs:', error);
      }
    };

    fetchDIDs();
  }, []);

  const verifyVC = async () => {
    try {
      const response = await axios.post('http://localhost:4000/verify-vc', {
        //vc: JSON.parse(vcInput),
        vc: vcInput,
        issuerPublicJwk: issuerPublicKey,
      });
      setVerificationResult('Verification successful: ' + JSON.stringify(response.data));
    } catch (error) {
      setVerificationResult('Verification failed: ' + error.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>Verify Verifiable Credential</Typography>
      <TextField
        label="Paste VC JWT"
        fullWidth
        multiline
        rows={6}
        margin="normal"
        value={vcInput}
        onChange={(e) => setVcInput(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={verifyVC} sx={{ mt: 2 }}>
        Verify VC
      </Button>
      {verificationResult && (
        <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
          {verificationResult}
        </Typography>
      )}
    </Box>
  );
};

export default VerifyVC;
