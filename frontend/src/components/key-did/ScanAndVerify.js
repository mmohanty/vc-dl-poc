// import React, { useState } from 'react';
// import QrReader from 'react-qr-reader';
// import axios from 'axios';

// const ScanAndVerify = () => {
//   const [scanResult, setScanResult] = useState('');
//   const [verificationResult, setVerificationResult] = useState('');

//   const handleScan = async (data) => {
//     if (data) {
//       setScanResult(data);

//       try {
//         // Parse the scanned data if necessary (assuming it's a JSON string)
//         const vcData = JSON.parse(data);

//         // Call the verify endpoint with the VC data
//         const response = await axios.post('http://localhost:3000/verify-vc', {
//           vc: vcData,
//         });

//         // Display the verification result
//         setVerificationResult(response.data);
//       } catch (error) {
//         setVerificationResult(`Verification failed: ${error.message}`);
//       }
//     }
//   };

//   const handleError = (error) => {
//     console.error('QR Scan Error:', error);
//     setVerificationResult(`Error scanning QR: ${error.message}`);
//   };

//   return (
//     <div>
//       <h2>Scan and Verify VC</h2>
//       <QrReader
//         delay={300}
//         onError={handleError}
//         onScan={handleScan}
//         style={{ width: '100%' }}
//       />
//       <h3>Scan Result:</h3>
//       <pre>{scanResult}</pre>
//       <h3>Verification Result:</h3>
//       <pre>{verificationResult}</pre>
//     </div>
//   );
// };

// export default ScanAndVerify;
