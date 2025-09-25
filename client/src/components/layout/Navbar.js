
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  useMediaQuery,
  useTheme,
  Box,
  Divider,
  Menu,
  MenuItem,
  Container,
  alpha,
  Avatar,
  Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LoginIcon from '@mui/icons-material/Login';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import SecurityIcon from '@mui/icons-material/Security';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';

import Loginn from '../../pages/loginn.js';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showUserlogin, setShowUserlogin] = useState(false);

  const navigate = useNavigate();
  const isMenuOpen = Boolean(anchorEl);

  // Mock authentication state
  const isAuthenticated = false;
  const user = { name: 'John Doe', email: 'john@example.com' };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    navigate('/login');
  };

  // Enhanced navItems with professional icons and better organization
  const navItems = [
    { 
      text: 'Home', 
      path: '/', 
      type: 'link',
      icon: <HomeIcon sx={{ fontSize: 20, mr: 1 }} />
    },
    { 
      text: 'User Portal', 
      path: '/user', 
      type: 'link',
      icon: <PeopleIcon sx={{ fontSize: 20, mr: 1 }} />
    },
    { 
      text: 'Admin Dashboard', 
      path: '/admin/dashboard', 
      type: 'link',
      icon: <DashboardIcon sx={{ fontSize: 20, mr: 1 }} />
    },
    { 
      text: 'Track Issue', 
      path: '/track-issue', 
      type: 'highlight',
      icon: <TrackChangesIcon sx={{ fontSize: 20, mr: 1 }} />
    },
    { 
      text: 'Login', 
      action: () => setShowUserlogin(true), 
      type: 'cta',
      icon: <LoginIcon sx={{ fontSize: 20, mr: 1 }} />
    },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', height: '100%', background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.dark, 0.9)} 100%)` }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, bgcolor: 'primary.dark' }}>
        <SecurityIcon sx={{ mr: 1.5, color: 'white', fontSize: 30 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, color: 'white', letterSpacing: 0.5 }}>
          IssueTracker Pro
        </Typography>
      </Box>
      <Divider sx={{ bgcolor: alpha('#fff', 0.2) }} />
      <List sx={{ py: 2 }}>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5, px: 1 }}>
            <ListItemButton
              component={item.path ? RouterLink : 'button'}
              to={item.path || undefined}
              onClick={item.action ? item.action : undefined}
              sx={{ 
                textAlign: 'left',
                borderRadius: 2,
                mb: 0.5,
                color: item.type === 'cta' ? 'primary.main' : 'white',
                bgcolor: item.type === 'cta' ? 'white' : 'transparent',
                mx: 1,
                '&:hover': {
                  bgcolor: item.type === 'cta' ? alpha('#fff', 0.9) : alpha('#fff', 0.15),
                  transform: 'translateY(-1px)',
                  boxShadow: 2,
                },
                transition: 'all 0.3s ease-in-out',
                py: 1.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                {item.icon}
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: item.type === 'highlight' || item.type === 'cta' ? 600 : 500,
                    fontSize: '0.95rem',
                  }}
                />
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        color="default" 
        elevation={1}
        sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.default, 0.98)} 100%)`,
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          py: 0.5
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ py: 1 }}>
            {/* Logo Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  mr: 4,
                }}
                component={RouterLink}
                to="/"
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    mr: 2,
                    boxShadow: 3,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: 4,
                    }
                  }}
                >
                  <SecurityIcon sx={{ color: 'white', fontSize: 26 }} />
                </Box>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.primary.dark,
                    display: { xs: 'none', sm: 'block' },
                    letterSpacing: 0.3,
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  }}
                >
                 CivicConnect
                </Typography>
              </Box>

              {/* Desktop Navigation */}
              {!isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {navItems.filter(item => item.type === 'link').map((item) => (
                    <Button
                      key={item.text}
                      component={RouterLink}
                      to={item.path}
                      startIcon={item.icon}
                      sx={{ 
                        color: 'text.secondary',
                        fontWeight: 500,
                        px: 2.5,
                        borderRadius: 2,
                        fontSize: '0.9rem',
                        textTransform: 'none',
                        letterSpacing: 0.2,
                        '&:hover': {
                          color: 'primary.main',
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                          transform: 'translateY(-1px)',
                          boxShadow: 1,
                        },
                        transition: 'all 0.2s ease-in-out',
                        border: `1px solid transparent`,
                        '&.active': {
                          color: 'primary.main',
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                        }
                      }}
                    >
                      {item.text}
                    </Button>
                  ))}
                </Box>
              )}
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {/* Track Issue Button */}
              {!isMobile && (
                <Button
                  component={RouterLink}
                  to="/track-issue"
                  startIcon={<AssignmentIcon />}
                  sx={{
                    color: 'primary.main',
                    border: `1.5px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                    borderRadius: 2,
                    px: 3,
                    fontWeight: 600,
                    textTransform: 'none',
                    letterSpacing: 0.3,
                    fontSize: '0.9rem',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      borderColor: theme.palette.primary.main,
                      transform: 'translateY(-1px)',
                      boxShadow: 3,
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  Track Issue
                </Button>
              )}

              {/* Login/Profile Section */}
              {isAuthenticated ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton
                    sx={{
                      border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                      bgcolor: alpha(theme.palette.background.paper, 0.9),
                      '&:hover': {
                        bgcolor: theme.palette.background.paper,
                        transform: 'translateY(-1px)',
                        boxShadow: 1,
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <Badge badgeContent={3} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                  
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1.5,
                      cursor: 'pointer',
                      p: 1,
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                    onClick={handleProfileMenuOpen}
                  >
                    <Avatar 
                      sx={{ 
                        width: 36, 
                        height: 36, 
                        bgcolor: 'primary.main',
                        fontSize: 14,
                        fontWeight: 600,
                        boxShadow: 2,
                      }}
                    >
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Typography variant="body2" fontWeight={600} sx={{ display: { xs: 'none', sm: 'block' } }}>
                      {user.name}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                !isMobile && (
                  <Button
                    onClick={() => setShowUserlogin(true)}
                    startIcon={<LoginIcon />}
                    variant="contained"
                    sx={{
                      borderRadius: 2,
                      px: 3.5,
                      fontWeight: 600,
                      textTransform: 'none',
                      letterSpacing: 0.3,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      boxShadow: 3,
                      fontSize: '0.9rem',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 6,
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                      },
                      transition: 'all 0.3s ease-in-out',
                    }}
                  >
                    Sign In
                  </Button>
                )
              )}

              {/* Mobile Menu Button */}
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="end"
                  onClick={handleDrawerToggle}
                  sx={{ 
                    ml: 1,
                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    bgcolor: alpha(theme.palette.background.paper, 0.9),
                    '&:hover': {
                      bgcolor: theme.palette.background.paper,
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 300,
              border: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMenuOpen}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 4,
            sx: {
              borderRadius: 2,
              mt: 1.5,
              minWidth: 180,
              overflow: 'visible',
              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
                borderLeft: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              },
            },
          }}
        >
          <MenuItem onClick={handleMenuClose} component={RouterLink} to="/profile" sx={{ py: 1.5, fontSize: '0.9rem' }}>
            <AccountCircle sx={{ mr: 2, color: 'text.secondary' }} />
            My Profile
          </MenuItem>
          <MenuItem onClick={handleMenuClose} component={RouterLink} to="/settings" sx={{ py: 1.5, fontSize: '0.9rem' }}>
            <NotificationsIcon sx={{ mr: 2, color: 'text.secondary' }} />
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main', fontSize: '0.9rem' }}>
            Logout
          </MenuItem>
        </Menu>
      </AppBar>

      
    </>
  );
};

export default Navbar;