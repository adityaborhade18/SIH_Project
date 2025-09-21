import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const features = [
  {
    icon: <ReportProblemIcon fontSize="large" color="primary" />,
    title: 'Report Issues',
    description: 'Quickly report local issues like potholes, broken streetlights, or garbage problems with just a few taps.',
  },
  {
    icon: <TrackChangesIcon fontSize="large" color="primary" />,
    title: 'Track Progress',
    description: 'Follow the status of your reported issues and get real-time updates on their resolution.',
  },
  {
    icon: <NotificationsActiveIcon fontSize="large" color="primary" />,
    title: 'Stay Informed',
    description: 'Receive notifications about the issues you care about and community updates.',
  },
];

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          pt: 8,
          pb: 12,
          mb: 6,
          backgroundImage: 'linear-gradient(rgba(25, 118, 210, 0.9), rgba(25, 118, 210, 0.9))',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant={isMobile ? 'h4' : 'h3'}
                component="h1"
                gutterBottom
                sx={{ fontWeight: 700 }}
              >
                Make Your Community Better
              </Typography>
              <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
                Report local issues, track their progress, and help improve your neighborhood with CivicConnect.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  component={RouterLink}
                  to="/report-issue"
                  variant="contained"
                  color="secondary"
                  size="large"
                >
                  Report an Issue
                </Button>
                <Button
                  component={RouterLink}
                  to="/track-issue"
                  variant="outlined"
                  color="inherit"
                  size="large"
                  sx={{ color: 'white', borderColor: 'white' }}
                >
                  Track Issues
                </Button>
              </Box>
            </Grid>
           
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 12 }}>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          sx={{ fontWeight: 600, mb: 6 }}
        >
          How It Works
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                }}
              >
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  {feature.icon}
                  <Typography variant="h6" component="h3" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box
        sx={{
          bgcolor: 'grey.100',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Ready to Make a Difference?
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
            Join thousands of community members who are making their neighborhoods better, one report at a time.
          </Typography>
          <Button
            component={RouterLink}
            to="/report-issue"
            variant="contained"
            color="primary"
            size="large"
            sx={{ px: 6, py: 1.5, fontSize: '1.1rem' }}
          >
            Report an Issue Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
