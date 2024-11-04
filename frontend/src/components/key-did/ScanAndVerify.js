// import React, { useEffect, useRef, useState } from 'react';
// import { Html5Qrcode } from 'html5-qrcode';
// import axios from 'axios';

// const ScanAndVerify = () => {
//   const [scanResult, setScanResult] = useState('');
//   const [verificationResult, setVerificationResult] = useState('');
//   const qrCodeRef = useRef(null);

//   useEffect(() => {
//     const html5QrCode = new Html5Qrcode(qrCodeRef.current.id);

//     html5QrCode.start(
//       { facingMode: 'environment' }, // Use rear camera
//       {
//         fps: 10, // Frames per second for the scan
//         qrbox: { width: 250, height: 250 }, // Size of the scanning box
//       },
//       async (decodedText) => {
//         setScanResult(decodedText);

//         try {
//           // Parse the scanned data if necessary (assuming it's a JSON string)
//           const vcData = JSON.parse(decodedText);

//           // Call the verify endpoint with the VC data
//           const response = await axios.post('http://localhost:4000/verify-vc', {
//             vc: vcData,
//           });

//           // Display the verification result
//           setVerificationResult(JSON.stringify(response.data, null, 2));
//         } catch (error) {
//           setVerificationResult(`Verification failed: ${error.message}`);
//         }

//         // Stop scanning after a successful scan
//         html5QrCode.stop().catch((err) => console.error('Stop error:', err));
//       },
//       (errorMessage) => {
//         console.warn('Scanning error:', errorMessage);
//       }
//     ).catch((err) => {
//       console.error('Failed to start QR code scanner:', err);
//     });

//     // Cleanup when the component unmounts
//     return () => {
//       html5QrCode.stop().catch((err) => console.error('Cleanup stop error:', err));
//     };
//   }, []);

//   return (
//     <div>
//       <h2>Scan and Verify VC</h2>
//       <div id="reader" ref={qrCodeRef} style={{ width: '300px', height: '300px' }}></div>
//       <h3>Scan Result:</h3>
//       <pre>{scanResult}</pre>
//       <h3>Verification Result:</h3>
//       <pre>{verificationResult}</pre>
//     </div>
//   );
// };

// export default ScanAndVerify;
