import React, { useState } from 'react';

function CreateCredential({ licenseData }) {
  const [holderDid, setHolderDid] = useState('');
  const [credential, setCredential] = useState('');

  const createCredential = async () => {
    if (!licenseData) {
      alert('Please upload license data before creating a credential.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/create-credential', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access-control-allow-origin': '*',
          'no-cors': 'true',
        },
        body: JSON.stringify({holderDid, licenseData }),
      });
      const result = await response.json();
      setCredential(result.jwt);
    } catch (error) {
      console.error('Error creating credential:', error);
    }
  };

  return (
    <div>
      <h2>Create Verifiable Credential</h2>
      <input
        type="text"
        placeholder="Enter Holder DID"
        value={holderDid}
        onChange={(e) => setHolderDid(e.target.value)}
      />
      <button onClick={createCredential} disabled={!licenseData}>
        Create Credential
      </button>
      {credential && <pre>{credential}</pre>}
    </div>
  );
}

export default CreateCredential;
