import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Box, 
  Typography, 
  Button, 
  Paper,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import { 
  ReportProblem, 
  TrackChanges, 
  History, 
  TrendingUp,
  NotificationsActive,
  ArrowForward
} from '@mui/icons-material';

const UserPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const statsData = [
    { icon: <TrackChanges />, label: 'Active Issues', value: '12', color: theme.palette.primary.main },
    { icon: <History />, label: 'Resolved', value: '28', color: theme.palette.success.main },
    { icon: <TrendingUp />, label: 'This Month', value: '8', color: theme.palette.info.main },
    { icon: <NotificationsActive />, label: 'Urgent', value: '3', color: theme.palette.error.main },
  ];

  const quickActions = [
    { label: 'Report New Issue', icon: <ReportProblem />, path: '/report-issue', color: 'primary' },

    { label: 'Track Issue', icon: <TrackChanges />, path: '/track-issue', color: 'success' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        py: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section - Centered */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontSize: isSmallMobile ? '2rem' : isMobile ? '2.5rem' : '3rem',
              lineHeight: 1.2
            }}
          >
            Welcome to Your Dashboard
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              fontSize: isMobile ? '1rem' : '1.25rem',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6
            }}
          >
            Manage and track all your reported issues in one place. Get real-time updates and quick solutions.
          </Typography>
        </Box>

        {/* Stats Overview - Centered */}
        <Grid container spacing={3} sx={{ mb: 6, justifyContent: 'center' }}>
          {statsData.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card 
                sx={{ 
                  width: '100%',
                  maxWidth: 250,
                  background: `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`,
                  border: `1px solid ${alpha(stat.color, 0.2)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 25px ${alpha(stat.color, 0.15)}`,
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      backgroundColor: alpha(stat.color, 0.1),
                      color: stat.color,
                      mb: 2
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" component="div" fontWeight="bold" color={stat.color}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions Section - Centered */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom fontWeight="600" sx={{ mb: 3 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={4} md={4} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={action.icon}
                  endIcon={<ArrowForward />}
                  onClick={() => navigate(action.path)}
                  sx={{
                    width: '100%',
                    maxWidth: 280,
                    p: 2.5,
                    justifyContent: 'space-between',
                    border: `2px solid ${alpha(theme.palette[action.color].main, 0.2)}`,
                    borderRadius: 2,
                    color: 'text.primary',
                    textTransform: 'none',
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      border: `2px solid ${theme.palette[action.color].main}`,
                      backgroundColor: alpha(theme.palette[action.color].main, 0.04),
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  {action.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Main Action Card - Centered */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Card 
            sx={{
              width: '100%',
              maxWidth: 600,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              color: 'white',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 50%)',
              }
            }}
          >
            <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: alpha('#fff', 0.2),
                    mb: 3
                  }}
                >
                  <ReportProblem sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h5" gutterBottom fontWeight="600">
                  Report an Issue
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 3, maxWidth: '400px', margin: '0 auto' }}>
                  Found something that needs attention? Let us know and we'll get it fixed quickly.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/report-issue')}
                  sx={{
                    backgroundColor: 'white',
                    color: theme.palette.primary.main,
                    fontWeight: 'bold',
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: alpha('#fff', 0.9),
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Get Started
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Recent Activity Preview - Centered */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper 
            sx={{ 
              width: '100%',
              maxWidth: 600,
              p: 3, 
              borderRadius: 3,
              background: alpha(theme.palette.background.paper, 0.7),
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="600">
              Recent Activity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your issue #ISS-284 was updated 2 hours ago • New comment from support team
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default UserPage;