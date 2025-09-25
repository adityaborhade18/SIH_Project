// import React from 'react';
// import { Link as RouterLink } from 'react-router-dom';
// import {
//   Box,
//   Button,
//   Container,
//   Grid,
//   Typography,
//   Card,
//   CardContent,
//   CardMedia,
//   useTheme,
//   useMediaQuery,
// } from '@mui/material';
// import ReportProblemIcon from '@mui/icons-material/ReportProblem';
// import TrackChangesIcon from '@mui/icons-material/TrackChanges';
// import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

// const features = [
//   {
//     icon: <ReportProblemIcon fontSize="large" color="primary" />,
//     title: 'Report Issues',
//     description: 'Quickly report local issues like potholes, broken streetlights, or garbage problems with just a few taps.',
//   },
//   {
//     icon: <TrackChangesIcon fontSize="large" color="primary" />,
//     title: 'Track Progress',
//     description: 'Follow the status of your reported issues and get real-time updates on their resolution.',
//   },
//   {
//     icon: <NotificationsActiveIcon fontSize="large" color="primary" />,
//     title: 'Stay Informed',
//     description: 'Receive notifications about the issues you care about and community updates.',
//   },
// ];

// const HomePage = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));

//   return (
//     <Box>
//       {/* Hero Section */}
//       <Box
//         sx={{
//           bgcolor: 'primary.main',
//           color: 'white',
//           pt: 8,
//           pb: 12,
//           mb: 6,
//           backgroundImage: 'linear-gradient(rgba(25, 118, 210, 0.9), rgba(25, 118, 210, 0.9))',
//         }}
//       >
//         <Container maxWidth="lg">
//           <Grid container spacing={4} alignItems="center">
//             <Grid item xs={12} md={6}>
//               <Typography
//                 variant={isMobile ? 'h4' : 'h3'}
//                 component="h1"
//                 gutterBottom
//                 sx={{ fontWeight: 700 }}
//               >
//                 Make Your Community Better
//               </Typography>
//               <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
//                 Report local issues, track their progress, and help improve your neighborhood with CivicConnect.
//               </Typography>
//               <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
//                 <Button
//                   component={RouterLink}
//                   to="/report-issue"
//                   variant="contained"
//                   color="secondary"
//                   size="large"
//                 >
//                   Report an Issue
//                 </Button>
//                 <Button
//                   component={RouterLink}
//                   to="/track-issue"
//                   variant="outlined"
//                   color="inherit"
//                   size="large"
//                   sx={{ color: 'white', borderColor: 'white' }}
//                 >
//                   Track Issues
//                 </Button>
//               </Box>
//             </Grid>

//           </Grid>
//         </Container>
//       </Box>

//       {/* Features Section */}
//       <Container maxWidth="lg" sx={{ mb: 12 }}>
//         <Typography
//           variant="h4"
//           component="h2"
//           align="center"
//           gutterBottom
//           sx={{ fontWeight: 600, mb: 6 }}
//         >
//           How It Works
//         </Typography>
//         <Grid container spacing={4}>
//           {features.map((feature, index) => (
//             <Grid item xs={12} md={4} key={index}>
//               <Card
//                 elevation={2}
//                 sx={{
//                   height: '100%',
//                   display: 'flex',
//                   flexDirection: 'column',
//                   transition: 'transform 0.3s, box-shadow 0.3s',
//                   '&:hover': {
//                     transform: 'translateY(-8px)',
//                     boxShadow: 6,
//                   },
//                 }}
//               >
//                 <Box sx={{ p: 3, textAlign: 'center' }}>
//                   {feature.icon}
//                   <Typography variant="h6" component="h3" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
//                     {feature.title}
//                   </Typography>
//                   <Typography variant="body1" color="text.secondary">
//                     {feature.description}
//                   </Typography>
//                 </Box>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Container>

//       {/* Call to Action */}
//       <Box
//         sx={{
//           bgcolor: 'grey.100',
//           py: 8,
//           textAlign: 'center',
//         }}
//       >
//         <Container maxWidth="md">
//           <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
//             Ready to Make a Difference?
//           </Typography>
//           <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
//             Join thousands of community members who are making their neighborhoods better, one report at a time.
//           </Typography>
//           <Button
//             component={RouterLink}
//             to="/report-issue"
//             variant="contained"
//             color="primary"
//             size="large"
//             sx={{ px: 6, py: 1.5, fontSize: '1.1rem' }}
//           >
//             Report an Issue Now
//           </Button>
//         </Container>
//       </Box>
//     </Box>
//   );
// };

// export default HomePage;


// import React, { useState, useEffect } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
// import {
//   Box,
//   Button,
//   Container,
//   Grid,
//   Typography,
//   Card,
//   CardContent,
//   useTheme,
//   useMediaQuery,
//   alpha,
//   Chip,
//   Avatar,
//   Stack,
//   Paper,
//   IconButton,
//   Fade,
//   Zoom,
//   Slide,
// } from '@mui/material';
// import {
//   Security,
//   TrackChanges,
//   NotificationsActive,
//   ArrowForward,
//   PlayArrow,
//   Pause,
//   CheckCircle,
//   Schedule,
//   Error,
//   TrendingUp,
//   LocationOn,
//   Groups,
//   Speed,
// } from '@mui/icons-material';

// // Mock data for dynamic issues
// const dynamicIssues = [
//   {
//     id: 1,
//     title: "Road Repair Completed",
//     location: "Main Street Downtown",
//     type: "infrastructure",
//     status: "resolved",
//     votes: 142,
//     image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
//     blur: true
//   },
//   {
//     id: 2,
//     title: "Park Maintenance Required",
//     location: "Central Park Area",
//     type: "public_space",
//     status: "in_progress",
//     votes: 89,
//     image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
//     blur: false
//   },
//   {
//     id: 3,
//     title: "Street Light Outage",
//     location: "Residential Zone 4B",
//     type: "safety",
//     status: "reported",
//     votes: 56,
//     image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=400&h=300&fit=crop",
//     blur: true
//   },
//   {
//     id: 4,
//     title: "Traffic Signal Upgrade",
//     location: "Intersection 5th & Maple",
//     type: "infrastructure",
//     status: "planned",
//     votes: 203,
//     image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=300&fit=crop",
//     blur: false
//   }
// ];

// const stats = [
//   { value: '15,247', label: 'Issues Resolved', icon: <CheckCircle />, color: 'success' },
//   { value: '2,893', label: 'Active Reports', icon: <Schedule />, color: 'warning' },
//   { value: '98%', label: 'Satisfaction Rate', icon: <TrendingUp />, color: 'info' },
//   { value: '42', label: 'Cities Served', icon: <LocationOn />, color: 'primary' },
// ];

// const features = [
//   {
//     icon: <Speed sx={{ fontSize: 40 }} />,
//     title: 'Real-time Tracking',
//     description: 'Monitor issue resolution progress with live updates and automated status notifications.',
//     gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
//   },
//   {
//     icon: <Groups sx={{ fontSize: 40 }} />,
//     title: 'Community Driven',
//     description: 'Collaborate with neighbors and local authorities to prioritize and solve problems together.',
//     gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
//   },
//   {
//     icon: <Security sx={{ fontSize: 40 }} />,
//     title: 'Verified Resolution',
//     description: 'Every solved issue undergoes quality verification to ensure complete satisfaction.',
//     gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
//   },
// ];

// const HomePage = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//   const [currentIssueIndex, setCurrentIssueIndex] = useState(0);
//   const [autoPlay, setAutoPlay] = useState(true);

//   useEffect(() => {
//     if (!autoPlay) return;

//     const interval = setInterval(() => {
//       setCurrentIssueIndex((prev) => (prev + 1) % dynamicIssues.length);
//     }, 4000);

//     return () => clearInterval(interval);
//   }, [autoPlay]);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'resolved': return 'success';
//       case 'in_progress': return 'warning';
//       case 'planned': return 'info';
//       default: return 'error';
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'resolved': return <CheckCircle />;
//       case 'in_progress': return <Schedule />;
//       case 'planned': return <TrackChanges />;
//       default: return <Error />;
//     }
//   };

//   return (
//     <Box sx={{ overflow: 'hidden' }}>
//       {/* Hero Section with Dynamic Background */}
//       <Box
//         sx={{
//           minHeight: '100vh',
//           background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.9)} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%), 
//                       url(${dynamicIssues[currentIssueIndex].image})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           backgroundAttachment: 'fixed',
//           display: 'flex',
//           alignItems: 'center',
//           position: 'relative',
//           color: 'white',
//         }}
//       >
//         <Container maxWidth="lg">
//           <Grid container spacing={6} alignItems="center">
//             <Grid item xs={12} md={6}>
//               <Fade in timeout={1000}>
//                 <Box>
//                   <Chip 
//                     label="Trusted by 50K+ Communities" 
//                     color="secondary" 
//                     sx={{ mb: 3, color: 'white', fontWeight: 600 }}
//                   />
//                   <Typography
//                     variant={isMobile ? 'h3' : 'h2'}
//                     component="h1"
//                     gutterBottom
//                     sx={{ 
//                       fontWeight: 800,
//                       lineHeight: 1.2,
//                       mb: 3,
//                     }}
//                   >
//                     Transforming Communities Through{' '}
//                     <Box
//                       component="span"
//                       sx={{
//                         background: 'linear-gradient(45deg, #fff, #e3f2fd)',
//                         backgroundClip: 'text',
//                         WebkitBackgroundClip: 'text',
//                         WebkitTextFillColor: 'transparent',
//                       }}
//                     >
//                       Collective Action
//                     </Box>
//                   </Typography>
//                   <Typography 
//                     variant="h6" 
//                     paragraph 
//                     sx={{ 
//                       mb: 4, 
//                       opacity: 0.9,
//                       fontSize: '1.2rem',
//                       lineHeight: 1.6
//                     }}
//                   >
//                     IssueTracker Pro empowers citizens and local governments to collaboratively 
//                     identify, track, and resolve community issues with unprecedented efficiency 
//                     and transparency.
//                   </Typography>
//                   <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
//                     <Button
//                       component={RouterLink}
//                       to="/report-issue"
//                       variant="contained"
//                       color="secondary"
//                       size="large"
//                       endIcon={<ArrowForward />}
//                       sx={{
//                         px: 4,
//                         py: 1.5,
//                         fontSize: '1.1rem',
//                         borderRadius: 2,
//                         fontWeight: 600,
//                       }}
//                     >
//                       Report an Issue
//                     </Button>
//                     <Button
//                       component={RouterLink}
//                       to="/track-issue"
//                       variant="outlined"
//                       color="inherit"
//                       size="large"
//                       sx={{
//                         px: 4,
//                         py: 1.5,
//                         fontSize: '1.1rem',
//                         borderRadius: 2,
//                         fontWeight: 600,
//                         borderWidth: 2,
//                         '&:hover': {
//                           borderWidth: 2,
//                           backgroundColor: alpha('#fff', 0.1),
//                         }
//                       }}
//                     >
//                       Track Issues
//                     </Button>
//                   </Stack>
//                 </Box>
//               </Fade>
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <Slide direction="up" in timeout={800}>
//                 <Paper
//                   elevation={8}
//                   sx={{
//                     p: 4,
//                     borderRadius: 4,
//                     background: alpha('#fff', 0.95),
//                     backdropFilter: 'blur(20px)',
//                     color: 'text.primary',
//                   }}
//                 >
//                   <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                     <Typography variant="h5" fontWeight={700} sx={{ flexGrow: 1 }}>
//                       Active Community Issue
//                     </Typography>
//                     <IconButton 
//                       onClick={() => setAutoPlay(!autoPlay)}
//                       color="primary"
//                     >
//                       {autoPlay ? <Pause /> : <PlayArrow />}
//                     </IconButton>
//                   </Box>

//                   <Box sx={{ position: 'relative', mb: 3 }}>
//                     <Box
//                       component="img"
//                       src={dynamicIssues[currentIssueIndex].image}
//                       alt={dynamicIssues[currentIssueIndex].title}
//                       sx={{
//                         width: '100%',
//                         height: 200,
//                         objectFit: 'cover',
//                         borderRadius: 2,
//                         filter: dynamicIssues[currentIssueIndex].blur ? 'blur(4px)' : 'none',
//                         transition: 'all 0.5s ease',
//                       }}
//                     />
//                     <Box
//                       sx={{
//                         position: 'absolute',
//                         top: 0,
//                         left: 0,
//                         right: 0,
//                         bottom: 0,
//                         background: alpha('#000', 0.3),
//                         borderRadius: 2,
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                       }}
//                     >
//                       <Chip
//                         icon={getStatusIcon(dynamicIssues[currentIssueIndex].status)}
//                         label={dynamicIssues[currentIssueIndex].status.replace('_', ' ').toUpperCase()}
//                         color={getStatusColor(dynamicIssues[currentIssueIndex].status)}
//                         sx={{ color: 'white', fontWeight: 600 }}
//                       />
//                     </Box>
//                   </Box>

//                   <Typography variant="h6" fontWeight={600} gutterBottom>
//                     {dynamicIssues[currentIssueIndex].title}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" paragraph>
//                     {dynamicIssues[currentIssueIndex].location}
//                   </Typography>

//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <Chip
//                       label={`${dynamicIssues[currentIssueIndex].votes} Votes`}
//                       variant="outlined"
//                     />
//                     <Box sx={{ display: 'flex', gap: 0.5 }}>
//                       {dynamicIssues.map((_, index) => (
//                         <Box
//                           key={index}
//                           sx={{
//                             width: 8,
//                             height: 8,
//                             borderRadius: '50%',
//                             bgcolor: index === currentIssueIndex ? 'primary.main' : 'grey.400',
//                             transition: 'all 0.3s ease',
//                           }}
//                         />
//                       ))}
//                     </Box>
//                   </Box>
//                 </Paper>
//               </Slide>
//             </Grid>
//           </Grid>
//         </Container>
//       </Box>

//       {/* Stats Section */}
//       <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
//         <Container maxWidth="lg">
//           <Grid container spacing={4}>
//             {stats.map((stat, index) => (
//               <Grid item xs={6} md={3} key={index}>
//                 <Zoom in timeout={800} style={{ transitionDelay: `${index * 200}ms` }}>
//                   <Box sx={{ textAlign: 'center' }}>
//                     <Avatar
//                       sx={{
//                         bgcolor: `${stat.color}.main`,
//                         width: 80,
//                         height: 80,
//                         mx: 'auto',
//                         mb: 2,
//                       }}
//                     >
//                       {stat.icon}
//                     </Avatar>
//                     <Typography variant="h4" component="div" fontWeight={800} color={`${stat.color}.main`}>
//                       {stat.value}
//                     </Typography>
//                     <Typography variant="h6" color="text.secondary">
//                       {stat.label}
//                     </Typography>
//                   </Box>
//                 </Zoom>
//               </Grid>
//             ))}
//           </Grid>
//         </Container>
//       </Box>

//       {/* Features Section */}
//       <Box sx={{ py: 12 }}>
//         <Container maxWidth="lg">
//           <Box textAlign="center" sx={{ mb: 8 }}>
//             <Typography variant="h3" component="h2" fontWeight={800} gutterBottom>
//               Why Choose IssueTracker Pro?
//             </Typography>
//             <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
//               Our platform combines cutting-edge technology with community-driven insights 
//               to deliver unparalleled results in urban issue resolution.
//             </Typography>
//           </Box>

//           <Grid container spacing={4}>
//             {features.map((feature, index) => (
//               <Grid item xs={12} md={4} key={index}>
//                 <Fade in timeout={800} style={{ transitionDelay: `${index * 300}ms` }}>
//                   <Card
//                     elevation={0}
//                     sx={{
//                       height: '100%',
//                       background: feature.gradient,
//                       color: 'white',
//                       p: 4,
//                       borderRadius: 4,
//                       transition: 'all 0.3s ease',
//                       '&:hover': {
//                         transform: 'translateY(-8px)',
//                         boxShadow: 8,
//                       },
//                     }}
//                   >
//                     <Box sx={{ textAlign: 'center' }}>
//                       {feature.icon}
//                       <Typography variant="h5" component="h3" sx={{ mt: 2, mb: 2, fontWeight: 600 }}>
//                         {feature.title}
//                       </Typography>
//                       <Typography variant="body1" sx={{ opacity: 0.9 }}>
//                         {feature.description}
//                       </Typography>
//                     </Box>
//                   </Card>
//                 </Fade>
//               </Grid>
//             ))}
//           </Grid>
//         </Container>
//       </Box>

//       {/* CTA Section */}
//       <Box
//         sx={{
//           py: 12,
//           background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
//           color: 'white',
//           textAlign: 'center',
//         }}
//       >
//         <Container maxWidth="md">
//           <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 800, mb: 3 }}>
//             Ready to Transform Your Community?
//           </Typography>
//           <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
//             Join thousands of proactive citizens and local authorities who are building 
//             better communities through transparent, efficient issue resolution.
//           </Typography>
//           <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
//             <Button
//               component={RouterLink}
//               to="/report-issue"
//               variant="contained"
//               color="secondary"
//               size="large"
//               endIcon={<ArrowForward />}
//               sx={{
//                 px: 6,
//                 py: 1.5,
//                 fontSize: '1.1rem',
//                 borderRadius: 2,
//                 fontWeight: 600,
//               }}
//             >
//               Get Started Now
//             </Button>
//             <Button
//               component={RouterLink}
//               to="/about"
//               variant="outlined"
//               color="inherit"
//               size="large"
//               sx={{
//                 px: 6,
//                 py: 1.5,
//                 fontSize: '1.1rem',
//                 borderRadius: 2,
//                 fontWeight: 600,
//                 borderWidth: 2,
//                 '&:hover': {
//                   borderWidth: 2,
//                   backgroundColor: alpha('#fff', 0.1),
//                 }
//               }}
//             >
//               Learn More
//             </Button>
//           </Stack>
//         </Container>
//       </Box>
//     </Box>
//   );
// };

// export default HomePage;

import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"

const CivicIssueSystem = () => {
  // Civic issues data with images and descriptions
  const civicIssues = [
    {
      id: 1,
      title: "Road Maintenance",
      description: "Report potholes, road damage, and traffic hazards",
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Public Sanitation",
      description: "Report garbage accumulation, blocked drains, and sanitation issues",
      image: "https://images.unsplash.com/photo-1550147760-44c9966d6bc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Street Lighting",
      description: "Report malfunctioning street lights and dark areas",
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "Public Parks",
      description: "Report issues with public parks, playgrounds, and green spaces",
      image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5,
      title: "Water Supply",
      description: "Report water leakage, contamination, and supply issues",
      image: "https://images.unsplash.com/photo-1545560810-99dce9c0b872?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  // State for current slide and animation
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      handleNextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  // Handle next slide with smooth transition
  const handleNextSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % civicIssues.length);
      setIsTransitioning(false);
    }, 500);
  };

  // Handle previous slide
  const handlePrevSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + civicIssues.length) % civicIssues.length);
      setIsTransitioning(false);
    }, 500);
  };

  // Go to specific slide
  const goToSlide = (index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}


      {/* Hero Section with Slideshow */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Slideshow */}
        <div className="absolute inset-0 z-0">
          {civicIssues.map((issue, index) => (
            <div
              key={issue.id}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${issue.image})` }}
              ></div>
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
          ))}
        </div>

        {/* Slideshow Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Make Your Community Better
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up animation-delay-200">
            {civicIssues[currentSlide].description}
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up animation-delay-400">

            <Link to="/report-issue">
              <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105">
                Report an Issue
              </button>
            </Link>
            <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors transform hover:scale-105">
              View Issues Map
            </button>
          </div>
        </div>

        {/* Slideshow Controls */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-4 z-10 p-3 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-4 z-10 p-3 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
          {civicIssues.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
            ></button>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How CivicConnect Helps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Reporting</h3>
              <p className="text-gray-600">Report civic issues in just a few taps with our intuitive interface.</p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">Monitor the status of your reported issues in real-time.</p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Engagement</h3>
              <p className="text-gray-600">Connect with neighbors and local authorities to solve problems together.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-green-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">15,247</div>
              <div className="text-blue-100">Issues Reported</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">12,589</div>
              <div className="text-blue-100">Issues Resolved</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">82%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">42</div>
              <div className="text-blue-100">Active Communities</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Reporting an issue"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <div className="space-y-8">
                <div className="flex">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Report an Issue</h3>
                    <p className="text-gray-600">Take a photo, add a description, and pin the location on our map.</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Issue Verification</h3>
                    <p className="text-gray-600">Our team verifies the issue and assigns it to the relevant department.</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
                    <p className="text-gray-600">Monitor the resolution process and receive updates on your issue.</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-yellow-600 font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Issue Resolved</h3>
                    <p className="text-gray-600">Get notified when your issue is resolved and confirm the solution.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



    </div>
  );
};

export default CivicIssueSystem;