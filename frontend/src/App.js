import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import IssueVC from './components/key-did/IssueVC';
import ViewVC from './components/key-did/ViewVC';
import VerifyVC from './components/key-did/VerifyVC';
import ScanAndVerify from './components/key-did/ScanAndVerify';

const App = () => {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Verifiable Credentials Management
          </Typography>
          <Button color="inherit" component={Link} to="/issue-vc">Issue VC</Button>
          <Button color="inherit" component={Link} to="/view-vc">View VCs</Button>
          <Button color="inherit" component={Link} to="/verify-vc">Verify VC</Button>
          {/* <Button color="inherit" component={Link} to="/scan-vc">Scan and verify VC</Button> */}
        </Toolbar>
      </AppBar>
      <Container>
        <Box sx={{ marginTop: 4 }}>
          <Routes>
            <Route path="/issue-vc" element={<IssueVC />} />
            <Route path="/view-vc" element={<ViewVC />} />
            <Route path="/verify-vc" element={<VerifyVC />} />
            {/* <Route path="/scan-vc" element={<ScanAndVerify />} /> */}
            <Route path="/" element={<Home />} />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
};

const Home = () => (
  <Box sx={{ textAlign: 'center', marginTop: 10 }}>
    <Typography variant="h4" gutterBottom>Welcome to Verifiable Credentials Management</Typography>
    <Typography variant="body1">
      Use the navigation to issue, view, and verify VCs.
    </Typography>
  </Box>
);

export default App;
