import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Paper } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

const UserPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 4 }}>
          <ReportProblemIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Your Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Report new issues or track existing ones
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          size="large"
          startIcon={<ReportProblemIcon />}
          onClick={() => navigate('/report-issue')}
          sx={{ py: 1.5, px: 4, fontSize: '1.1rem' }}
        >
          Report an Issue
        </Button>
      </Paper>
    </Container>
  );
};

export default UserPage;
