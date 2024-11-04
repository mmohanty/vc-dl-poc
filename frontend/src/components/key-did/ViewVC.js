import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Paper } from "@mui/material";

const ViewVC = () => {
  const [vcList, setVcList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVCs = async () => {
      try {
        const response = await axios.get("http://localhost:4000/issued-vcs");
        setVcList(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load VCs");
        setLoading(false);
      }
    };

    fetchVCs();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Your Verifiable Credentials
      </Typography>
      {Object.keys(vcList).length > 0 ? (
        Object.values(vcList).map((vc, index) => (
          <Paper
            key={index}
            sx={{
              padding: 2,
              marginBottom: 2,
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            <Typography variant="subtitle1">VC ID: {vc.id}</Typography>
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {JSON.stringify(vc, null, 2)}
            </pre>
          </Paper>
        ))
      ) : (
        <Typography variant="body1">
          No Verifiable Credentials found.
        </Typography>
      )}
    </Box>
  );
};

export default ViewVC;
