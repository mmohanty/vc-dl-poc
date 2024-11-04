import React, { useState } from 'react';

function VerifyCredential() {
  const [jwt, setJwt] = useState('');
  const [result, setResult] = useState(null);

  const verifyCredential = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/verify-credential', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jwt }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error verifying credential:', error);
    }
  };

  return (
    <div>
      <h2>Verify Verifiable Credential</h2>
      <textarea
        placeholder="Paste JWT here"
        value={jwt}
        onChange={(e) => setJwt(e.target.value)}
      ></textarea>
      <button onClick={verifyCredential}>Verify Credential</button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}

export default VerifyCredential;
