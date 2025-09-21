import React from 'react';
import { Container, Box, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const AuthLayout = ({ children, title, icon: Icon }) => {
  const theme = useTheme();

  return (
    <Container 
      component="main" 
      maxWidth="xs"
      sx={{
        minHeight: 'calc(100vh - 128px)', // Account for header/footer
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            mb: 4,
          }}
        >
          {Icon && (
            <Box
              sx={{
                margin: 1,
                backgroundColor: theme.palette.primary.main,
                padding: '12px',
                borderRadius: '50%',
                color: 'white',
              }}
            >
              <Icon fontSize="large" />
            </Box>
          )}
          <Typography component="h1" variant="h5" sx={{ mt: 1, mb: 3 }}>
            {title}
          </Typography>
          {children}
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthLayout;
