import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Holder = () => {
  const [vcList, setVcList] = useState([]);

  // Fetch issued VCs from the backend and store them in localStorage
  useEffect(() => {
    const fetchAndStoreVCs = async () => {
      try {
        // Fetch VCs from the backend
        const response = await axios.get('http://localhost:4000/issued-vcs');
        const vcs = response.data;

        // Store VCs in localStorage
        localStorage.setItem('vcList', JSON.stringify(vcs));

        // Update state to show VCs on the page
        setVcList(vcs);
      } catch (error) {
        console.error('Error fetching VCs:', error);
      }
    };

    // Load VCs from localStorage if they exist
    const storedVCs = JSON.parse(localStorage.getItem('vcList'));
    if (storedVCs) {
      setVcList(storedVCs);
    } else {
      fetchAndStoreVCs();
    }
  }, []);

  return (
    <div>
      <h2>Your Verifiable Credentials</h2>
      {Object.keys(vcList).length > 0 ? (
        Object.values(vcList).map((vc, index) => (
          <div key={index}>
            <h3>VC ID: {vc.id}</h3>
            <pre>{JSON.stringify(vc, null, 2)}</pre>
          </div>
        ))
      ) : (
        <p>No Verifiable Credentials found.</p>
      )}
    </div>
  );
};

export default Holder;
