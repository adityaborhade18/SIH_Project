// import React from 'react';
// import { Link as RouterLink } from 'react-router-dom';
// import { Box, Container, Grid, Typography, Link, Divider, useTheme, useMediaQuery } from '@mui/material';
// import FacebookIcon from '@mui/icons-material/Facebook';
// import TwitterIcon from '@mui/icons-material/Twitter';
// import InstagramIcon from '@mui/icons-material/Instagram';
// import ReportProblemIcon from '@mui/icons-material/ReportProblem';

// const Footer = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//   const currentYear = new Date().getFullYear();

//   const footerLinks = [
//     {
//       title: 'Quick Links',
//       links: [
//         { text: 'Home', to: '/' },
//         { text: 'Report an Issue', to: '/report-issue' },
//         { text: 'Track Issues', to: '/track-issue' },
//         { text: 'About Us', to: '/about' },
//       ],
//     },
//     {
//       title: 'Support',
//       links: [
//         { text: 'Help Center', to: '/help' },
//         { text: 'FAQs', to: '/faqs' },
//         { text: 'Contact Us', to: '/contact' },
//         { text: 'Privacy Policy', to: '/privacy' },
//       ],
//     },
//     {
//       title: 'Legal',
//       links: [
//         { text: 'Terms of Service', to: '/terms' },
//         { text: 'Privacy Policy', to: '/privacy' },
//         { text: 'Cookie Policy', to: '/cookies' },
//         { text: 'Accessibility', to: '/accessibility' },
//       ],
//     },
//   ];

//   const socialLinks = [
//     { icon: <FacebookIcon />, label: 'Facebook', url: '#' },
//     { icon: <TwitterIcon />, label: 'Twitter', url: '#' },
//     { icon: <InstagramIcon />, label: 'Instagram', url: '#' },
//   ];

//   return (
//     <Box
//       component="footer"
//       sx={{
//         backgroundColor: theme.palette.primary.main,
//         color: theme.palette.primary.contrastText,
//         py: 6,
//         mt: 'auto',
//       }}
//     >
//       <Container maxWidth="lg">
//         <Grid container spacing={4}>
//           {/* Logo and Description */}
//           <Grid item xs={12} md={4}>
//             <Box display="flex" alignItems="center" mb={2}>
//               <ReportProblemIcon sx={{ mr: 1, fontSize: 30 }} />
//               <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
//                 CivicConnect
//               </Typography>
//             </Box>
//             <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
//               Empowering communities to report and resolve local issues efficiently. 
//               Together, we can make our neighborhoods better places to live.
//             </Typography>
//             <Box display="flex" gap={2} mt={2}>
//               {socialLinks.map((social, index) => (
//                 <Link
//                   key={index}
//                   href={social.url}
//                   color="inherit"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   sx={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     width: 36,
//                     height: 36,
//                     borderRadius: '50%',
//                     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//                     transition: 'background-color 0.3s',
//                     '&:hover': {
//                       backgroundColor: 'rgba(255, 255, 255, 0.2)',
//                     },
//                   }}
//                   aria-label={social.label}
//                 >
//                   {social.icon}
//                 </Link>
//               ))}
//             </Box>
//           </Grid>

//           {/* Footer Links */}
//           {footerLinks.map((column, index) => (
//             <Grid item xs={12} sm={6} md={2.666} key={index}>
//               <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
//                 {column.title}
//               </Typography>
//               <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
//                 {column.links.map((link, linkIndex) => (
//                   <Box component="li" key={linkIndex} sx={{ mb: 1 }}>
//                     <Link
//                       component={RouterLink}
//                       to={link.to}
//                       color="inherit"
//                       variant="body2"
//                       sx={{
//                         opacity: 0.8,
//                         textDecoration: 'none',
//                         '&:hover': {
//                           opacity: 1,
//                           textDecoration: 'underline',
//                         },
//                       }}
//                     >
//                       {link.text}
//                     </Link>
//                   </Box>
//                 ))}
//               </Box>
//             </Grid>
//           ))}
//         </Grid>

//         {/* Divider */}
//         <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

//         {/* Copyright and Bottom Links */}
//         <Box
//           display="flex"
//           flexDirection={isMobile ? 'column' : 'row'}
//           justifyContent="space-between"
//           alignItems={isMobile ? 'flex-start' : 'center'}
//           gap={isMobile ? 2 : 0}
//         >
//           <Typography variant="body2" sx={{ opacity: 0.8 }}>
//             © {currentYear} CivicConnect. All rights reserved.
//           </Typography>
//           <Box display="flex" gap={3}>
//             <Link
//               component={RouterLink}
//               to="/terms"
//               color="inherit"
//               variant="body2"
//               sx={{
//                 opacity: 0.8,
//                 textDecoration: 'none',
//                 '&:hover': {
//                   opacity: 1,
//                   textDecoration: 'underline',
//                 },
//               }}
//             >
//               Terms of Service
//             </Link>
//             <Link
//               component={RouterLink}
//               to="/privacy"
//               color="inherit"
//               variant="body2"
//               sx={{
//                 opacity: 0.8,
//                 textDecoration: 'none',
//                 '&:hover': {
//                   opacity: 1,
//                   textDecoration: 'underline',
//                 },
//               }}
//             >
//               Privacy Policy
//             </Link>
//             <Link
//               component={RouterLink}
//               to="/cookies"
//               color="inherit"
//               variant="body2"
//               sx={{
//                 opacity: 0.8,
//                 textDecoration: 'none',
//                 '&:hover': {
//                   opacity: 1,
//                   textDecoration: 'underline',
//                 },
//               }}
//             >
//               Cookie Policy
//             </Link>
//           </Box>
//         </Box>

//         {/* Attribution */}
//         <Box mt={4} textAlign="center">
//           <Typography variant="caption" sx={{ opacity: 0.6, fontSize: '0.7rem' }}>
//             Made with ❤️ for better communities
//           </Typography>
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default Footer;

const Footer=()=>{
  return(
 <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">CivicConnect</h3>
              <p className="text-gray-400">Empowering communities to solve civic issues together.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Report Issue</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Issues Map</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li>contact@civicconnect.com</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Community St, City</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2023 CivicConnect. All rights reserved.</p>
          </div>
        </div>
      </footer> )

  }

  export default Footer;
