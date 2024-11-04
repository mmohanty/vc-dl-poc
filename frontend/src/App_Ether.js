import React, { useState } from 'react';
import UploadLicense from './components/ether/UploadLicense';
import CreateCredential from './components/ether/CreateCredential';
import VerifyCredential from './components/ether/VerifyCredential';

function App() {
  const [licenseData, setLicenseData] = useState(null);

  return (
    <div className="App">
      <h1>Verifiable Credential POC</h1>
      <UploadLicense setLicenseData={setLicenseData} />
      <CreateCredential licenseData={licenseData} />
      <VerifyCredential />
    </div>
  );
}

export default App;
