const express = require('express');
const bodyParser = require('body-parser');
const { createDrivingLicenseVC } = require('./create-vc');
const { verifyVC } = require('./verify-vc');
const cors = require('cors');

const app = express();

app.use(cors());// Enable CORS for all routes
app.use(bodyParser.json());

app.post('/api/create-credential', async (req, res) => {
  const { holderDid, licenseData } = req.body;
  try {
    const jwt = await createDrivingLicenseVC(holderDid, licenseData);
    res.json({ jwt });
  } catch (error) {
    console.error('Error creating credential:', error);
    res.status(500).json({ error: 'Error creating credential', details: error.message });
  }
});

app.post('/api/verify-credential', async (req, res) => {
  const { jwt } = req.body;
  try {
    const result = await verifyVC(jwt);
    res.json(result);
  } catch (error) {
    res.status(500).send('Verification failed');
  }
});

app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
