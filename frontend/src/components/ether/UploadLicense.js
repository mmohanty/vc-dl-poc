import React from 'react';

function UploadLicense({ setLicenseData }) {
  const handleUpload = (e) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const data = JSON.parse(fileReader.result);
      setLicenseData(data);
    };
    fileReader.readAsText(e.target.files[0]);
  };

  return (
    <div>
      <h2>Upload Driving License</h2>
      <input type="file" accept=".json" onChange={handleUpload} />
    </div>
  );
}

export default UploadLicense;
