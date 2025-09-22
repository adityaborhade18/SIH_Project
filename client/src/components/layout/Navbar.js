// import React, { useState } from 'react';
// import { Link as RouterLink, useNavigate } from 'react-router-dom';
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   IconButton,
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemButton,
//   useMediaQuery,
//   useTheme,
//   Box,
//   Divider,
//   Avatar,
//   Menu,
//   MenuItem,
//   Container,
// } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
// import ReportProblemIcon from '@mui/icons-material/ReportProblem';
// import AccountCircle from '@mui/icons-material/AccountCircle';

// const Navbar = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//    const [showUserlogin, setShowUserlogin] = useState(false); 
  
//   const navigate = useNavigate();
//   const isMenuOpen = Boolean(anchorEl);

//   // Mock authentication state - replace with actual auth context
//   const isAuthenticated = false;
//   const user = { name: 'John Doe', email: 'john@example.com' };

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const handleProfileMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleLogout = () => {
//     // TODO: Implement logout logic
//     handleMenuClose();
//     navigate('/login');
//   };

//   const navItems = [
//     { text: 'Home', path: '/' },
//     { text: 'User', path: '/user' },
//     { text: 'Admin', path: '/admin/dashboard' },
//     { text: 'Login/Sign In', path: '/login' },
//     { text: 'Login', path: '/loginn' },
//     { text: 'Track Issue', path: '/track-issue' },
//   ];

//   const drawer = (
//     <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
//       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
//         <ReportProblemIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
//         <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
//           CivicConnect
//         </Typography>
//       </Box>
//       <Divider />
//       <List>
//         {navItems.map((item) => (
//           <ListItem key={item.text} disablePadding>
//             <ListItemButton
//               component={RouterLink}
//               to={item.path}
//               sx={{ textAlign: 'center' }}
//             >
//               <ListItemText primary={item.text} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//         {!isAuthenticated ? (
//           <ListItem disablePadding>
//             <ListItemButton
//               component={RouterLink}
//               to="/login"
//               sx={{ textAlign: 'center', color: theme.palette.primary.main }}
//             >
//               <ListItemText primary="Login / Register" />
//             </ListItemButton>
//           </ListItem>
//         ) : (
//           <>
//             <ListItem disablePadding>
//               <ListItemButton
//                 onClick={handleProfileMenuOpen}
//                 sx={{ textAlign: 'center' }}
//               >
//                 <ListItemText primary={user.name} />
//               </ListItemButton>
//             </ListItem>
//             <ListItem disablePadding>
//               <ListItemButton
//                 onClick={handleLogout}
//                 sx={{ textAlign: 'center', color: theme.palette.error.main }}
//               >
//                 <ListItemText primary="Logout" />
//               </ListItemButton>
//             </ListItem>
//           </>
//         )}
//       </List>
//     </Box>
//   );

//   return (
//     <AppBar position="static" color="default" elevation={1}>
//       <Container maxWidth="lg">
//         <Toolbar disableGutters>
//           <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
//             <ReportProblemIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
//             <Typography
//               variant="h6"
//               noWrap
//               component={RouterLink}
//               to="/"
//               sx={{
//                 mr: 2,
//                 display: { xs: 'none', md: 'flex' },
//                 fontWeight: 700,
//                 color: 'inherit',
//                 textDecoration: 'none',
//               }}
//             >
//               Issue Tracker
//             </Typography>
//           </Box>

//           {isMobile ? (
//             <IconButton
//               color="inherit"
//               aria-label="open drawer"
//               edge="start"
//               onClick={handleDrawerToggle}
//               sx={{ mr: 2, display: { md: 'none' } }}
//             >
//               <MenuIcon />
//             </IconButton>
//           ) : (
//             <Box sx={{ display: 'flex' }}>
//               {navItems.map((item) => (
//                 <Button
//                   key={item.text}
//                   component={RouterLink}
//                   to={item.path}
//                   sx={{ 
//                     color: 'text.primary',
//                     mx: 1,
//                     '&:hover': {
//                       backgroundColor: 'action.hover',
//                     },
//                   }}
//                 >
//                   {item.text}
//                 </Button>
//               ))}
//               {isAuthenticated && (
//                 <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
//                   <IconButton
//                     size="large"
//                     edge="end"
//                     aria-label="account of current user"
//                     aria-controls="primary-search-account-menu"
//                     aria-haspopup="true"
//                     onClick={handleProfileMenuOpen}
//                     color="inherit"
//                   >
//                     <AccountCircle />
//                   </IconButton>
//                   <Typography variant="body1" sx={{ ml: 1 }}>
//                     {user.name}
//                   </Typography>
//                 </Box>
//               )}
//             </Box>
//           )}
//         </Toolbar>
//       </Container>

//       {/* Mobile Drawer */}
//       <Drawer
//         variant="temporary"
//         open={mobileOpen}
//         onClose={handleDrawerToggle}
//         ModalProps={{
//           keepMounted: true, // Better open performance on mobile.
//         }}
//         sx={{
//           display: { xs: 'block', md: 'none' },
//           '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
//         }}
//       >
//         {drawer}
//       </Drawer>

//       {/* Profile Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         anchorOrigin={{
//           vertical: 'top',
//           horizontal: 'right',
//         }}
//         id="primary-search-account-menu"
//         keepMounted
//         transformOrigin={{
//           vertical: 'top',
//           horizontal: 'right',
//         }}
//         open={isMenuOpen}
//         onClose={handleMenuClose}
//       >
//         <MenuItem onClick={handleMenuClose} component={RouterLink} to="/profile">
//           Profile
//         </MenuItem>
//         <MenuItem onClick={handleMenuClose} component={RouterLink} to="/settings">
//           Settings
//         </MenuItem>
//         <MenuItem onClick={handleLogout}>Logout</MenuItem>
//       </Menu>
//     </AppBar>
//   );
// };

// export default Navbar;


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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showUserlogin, setShowUserlogin] = useState(false); 

  const navigate = useNavigate();
  const isMenuOpen = Boolean(anchorEl);

  // Mock authentication state - replace with actual auth context
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
    // TODO: Implement logout logic
    handleMenuClose();
    navigate('/login');
  };

  // ✅ Added action for Loginn
  const navItems = [
    { text: 'Home', path: '/' },
    { text: 'User', path: '/user' },
    { text: 'Admin', path: '/admin/dashboard' },
    
    { text: 'Login', action: () => setShowUserlogin(true),path: '/loginn' }, 
    { text: 'Track Issue', path: '/track-issue' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <ReportProblemIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
          CivicConnect
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={item.path ? RouterLink : 'button'}
              to={item.path || undefined}
              onClick={item.action ? item.action : undefined}
              sx={{ textAlign: 'center' }}
            >
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        {!isAuthenticated ? (
          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/login"
              sx={{ textAlign: 'center', color: theme.palette.primary.main }}
            >
              <ListItemText primary="Login / Register" />
            </ListItemButton>
          </ListItem>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleProfileMenuOpen}
                sx={{ textAlign: 'center' }}
              >
                <ListItemText primary={user.name} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{ textAlign: 'center', color: theme.palette.error.main }}
              >
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <ReportProblemIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                component={RouterLink}
                to="/"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontWeight: 700,
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                Issue Tracker
              </Typography>
            </Box>

            {isMobile ? (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex' }}>
                {navItems.map((item) => (
                  <Button
                    key={item.text}
                    component={item.path ? RouterLink : 'button'}
                    to={item.path || undefined}
                    onClick={item.action ? item.action : undefined}
                    sx={{ 
                      color: 'text.primary',
                      mx: 1,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
                {isAuthenticated && (
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                    <IconButton
                      size="large"
                      edge="end"
                      aria-label="account of current user"
                      aria-controls="primary-search-account-menu"
                      aria-haspopup="true"
                      onClick={handleProfileMenuOpen}
                      color="inherit"
                    >
                      <AccountCircle />
                    </IconButton>
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {user.name}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Toolbar>
        </Container>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          id="primary-search-account-menu"
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose} component={RouterLink} to="/profile">
            Profile
          </MenuItem>
          <MenuItem onClick={handleMenuClose} component={RouterLink} to="/settings">
            Settings
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </AppBar>

      {/* ✅ Show Login section when Loginn is clicked */}
      {showUserlogin && (
        <Box sx={{ p: 3, textAlign: 'center', backgroundColor: '#f9f9f9' }}>
          <Typography variant="h5" color="primary">
            User Login Component goes here 🚀
          </Typography>
        </Box>
      )}
    </>
  );
};

export default Navbar;
