import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react"; // Use QRCodeCanvas instead

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
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={8}>
                <Typography variant="subtitle1">VC ID: {vc.id}</Typography>
                <pre style={{ whiteSpace: "pre-wrap" }}>
                  {JSON.stringify(vc, null, 2)}
                </pre>
              </Grid>
              <Grid item xs={4}>
                <QRCodeCanvas
                  value={JSON.stringify(vc)}
                  size={128}
                  level={"M"}
                />
              </Grid>
            </Grid>
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
