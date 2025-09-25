import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Chip,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Alert,
  Paper,
  Stack,
  Tooltip,
  Breadcrumbs,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import { 
  LocationOn, 
  Map, 
  Navigation,
  ArrowBack,
  Visibility,
  GpsFixed,
  Straighten,
  Info,
  Share,
  CopyAll,
  CalendarToday,
  Flag,
  Assignment,
  Image as ImageIcon,
  OpenInNew,
  Edit,
  NoteAdd,
  Search
} from '@mui/icons-material';
import { format } from 'date-fns';

const IssueDetails = () => {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [distance, setDistance] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/user/issue/${id}`);
        setIssue(res.data.issue);
      } catch (err) {
        console.error('Error fetching issue:', err);
        setIssue(null);
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id]);

  const parseLocationData = (locationString) => {
    try {
      const locationData = typeof locationString === 'string' 
        ? JSON.parse(locationString) 
        : locationString;
      
      const coordinates = locationData.coordinates || [];
      const lat = coordinates[0];
      const lng = coordinates[1];
      
      const address = locationData.address || 
                    locationData.formattedAddress || 
                    `Lat: ${lat}, Lng: ${lng}`;
      
      return {
        lat: lat || null,
        lng: lng || null,
        address: address,
        coordinates: coordinates
      };
    } catch (error) {
      console.error('Error parsing location:', error);
      if (typeof locationString === 'string') {
        const latMatch = locationString.match(/Lat:\s*([\d.-]+)/);
        const lngMatch = locationString.match(/Lng:\s*([\d.-]+)/);
        if (latMatch && lngMatch) {
          return {
            lat: parseFloat(latMatch[1]),
            lng: parseFloat(lngMatch[1]),
            address: locationString,
            coordinates: [parseFloat(latMatch[1]), parseFloat(lngMatch[1])]
          };
        }
      }
      return { lat: null, lng: null, address: 'Location data not available', coordinates: [] };
    }
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    setLocationError('');
    setCopySuccess('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setCopySuccess('📍 Your location detected successfully!');
        setTimeout(() => setCopySuccess(''), 3000);
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
          default:
            errorMessage = 'An unknown error occurred.';
            break;
        }
        setLocationError(errorMessage);
      }
    );
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distanceKm = R * c;
    
    if (distanceKm < 1) {
      return `${(distanceKm * 1000).toFixed(0)} meters away`;
    }
    return `${distanceKm.toFixed(1)} km away`;
  };

  const copyCoordinates = () => {
    const issueLocation = parseLocationData(issue.location);
    if (issueLocation.lat && issueLocation.lng) {
      const coords = `${issueLocation.lat.toFixed(6)}, ${issueLocation.lng.toFixed(6)}`;
      navigator.clipboard.writeText(coords);
      setCopySuccess('✅ Coordinates copied to clipboard!');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const shareIssue = async () => {
    const issueLocation = parseLocationData(issue.location);
    const text = `Issue: ${issue.title}\nLocation: ${issueLocation.address}\nStatus: ${issue.status}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: issue.title,
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(`${text}\nURL: ${window.location.href}`);
      setCopySuccess('📋 Issue details copied to clipboard!');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const openInOSM = () => {
    const issueLocation = parseLocationData(issue.location);
    if (issueLocation.lat && issueLocation.lng) {
      const url = `https://www.openstreetmap.org/?mlat=${issueLocation.lat}&mlon=${issueLocation.lng}#map=15/${issueLocation.lat}/${issueLocation.lng}`;
      window.open(url, '_blank');
    } else if (issueLocation.address) {
      const url = `https://www.openstreetmap.org/search?query=${encodeURIComponent(issueLocation.address)}`;
      window.open(url, '_blank');
    }
  };

  const openDirections = () => {
    const issueLocation = parseLocationData(issue.location);
    if (!issueLocation.lat || !issueLocation.lng || !userLocation) return;
    
    const url = `https://www.openstreetmap.org/directions?engine=osrm_car&route=${userLocation.lat}%2C${userLocation.lng}%3B${issueLocation.lat}%2C${issueLocation.lng}`;
    window.open(url, '_blank');
  };

  const getOSMEmbedUrl = (lat, lng, zoom = 15) => {
    if (!lat || !lng) return null;
    const bbox = `${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&marker=${lat}%2C${lng}&layer=mapnik&zoom=${zoom}`;
  };

  useEffect(() => {
    if (issue && userLocation) {
      const issueLocation = parseLocationData(issue.location);
      if (issueLocation.lat && issueLocation.lng) {
        const dist = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          issueLocation.lat,
          issueLocation.lng
        );
        setDistance(dist);
      }
    }
  }, [userLocation, issue]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Stack spacing={3} alignItems="center">
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Loading issue details...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (!issue) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 3 }}>
        <Stack spacing={3} alignItems="center" textAlign="center">
          <Assignment sx={{ fontSize: 64, color: 'text.disabled' }} />
          <Typography variant="h4" fontWeight={600}>
            Issue Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            The requested issue could not be found.
          </Typography>
          <Button variant="contained" startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Stack>
      </Box>
    );
  }

  const issueLocation = parseLocationData(issue.location);
  const osmEmbedUrl = getOSMEmbedUrl(issueLocation.lat, issueLocation.lng);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'grey.50', pb: 4 }}>
      {/* Notification Alerts */}
      {(copySuccess || locationError) && (
        <Box sx={{ position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 2000 }}>
          {copySuccess && <Alert severity="success">{copySuccess}</Alert>}
          {locationError && <Alert severity="error">{locationError}</Alert>}
        </Box>
      )}

      {/* Header */}
      <Paper elevation={1} sx={{ borderRadius: 0, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Breadcrumbs>
              <Link color="inherit" onClick={() => navigate(-1)} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1 }}>
                <ArrowBack fontSize="small" />
                Back to Issues
              </Link>
              <Typography color="text.primary" fontWeight={600}>
                Issue Details
              </Typography>
            </Breadcrumbs>
            
            <Tooltip title="Share this issue">
              <IconButton onClick={shareIssue} color="primary">
                <Share />
              </IconButton>
            </Tooltip>
          </Stack>
        </Container>
      </Paper>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          
          {/* Issue Header Card */}
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
                <Box>
                  <Typography variant="h4" fontWeight={700} gutterBottom>
                    {issue.title}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip 
                      label={issue.status} 
                      color="default"
                      sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
                    />
                    <Chip 
                      icon={<Flag />}
                      label={`${issue.priority} Priority`}
                      sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
                    />
                  </Stack>
                </Box>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.9 }}>
                  <CalendarToday fontSize="small" />
                  {format(new Date(issue.createdAt), 'PPpp')}
                </Typography>
              </Stack>
            </Box>
          </Card>

          {/* Two Column Layout */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
            
            {/* Left Column - Main Content */}
            <Stack spacing={3}>
              
              {/* Description Card */}
              <Card elevation={2} sx={{ borderRadius: 3 }}>
                <Box sx={{ p: 2.5, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Assignment />
                    Description
                  </Typography>
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: 'text.secondary' }}>
                    {issue.description}
                  </Typography>
                </CardContent>
              </Card>

              {/* Map Card */}
              <Card elevation={2} sx={{ borderRadius: 3 }}>
                <Box sx={{ p: 2.5, bgcolor: 'success.main', color: 'white', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Map />
                    Location Map
                  </Typography>
                </Box>
                <CardContent sx={{ p: 0 }}>
                  {issueLocation.lat && issueLocation.lng ? (
                    <Box sx={{ height: 400, position: 'relative' }}>
                      <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        src={osmEmbedUrl}
                        onLoad={() => setMapLoaded(true)}
                        style={{ 
                          borderBottomLeftRadius: 12,
                          borderBottomRightRadius: 12,
                          filter: mapLoaded ? 'none' : 'blur(2px)'
                        }}
                        title="Issue Location Map"
                      />
                      {!mapLoaded && (
                        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                          <CircularProgress />
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
                      <Map sx={{ fontSize: 48, color: 'text.disabled' }} />
                      <Typography color="text.secondary">No location data available</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Issue Image */}
              {issue.image && (
                <Card elevation={2} sx={{ borderRadius: 3 }}>
                  <Box sx={{ p: 2.5, bgcolor: 'secondary.main', color: 'white', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                    <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ImageIcon />
                      Issue Image
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Box
                      component="img"
                      src={issue.image}
                      alt={issue.title}
                      sx={{
                        width: '100%',
                        maxHeight: 400,
                        objectFit: 'cover',
                        borderRadius: 2,
                        cursor: 'pointer'
                      }}
                      onClick={() => window.open(issue.image, '_blank')}
                    />
                  </Box>
                </Card>
              )}
            </Stack>

            {/* Right Column - Sidebar */}
            <Stack spacing={3}>
              
              {/* Location Details */}
              <Card elevation={2} sx={{ borderRadius: 3 }}>
                <Box sx={{ p: 2.5, bgcolor: 'warning.main', color: 'white', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn />
                    Location
                  </Typography>
                </Box>
                <CardContent sx={{ p: 2.5 }}>
                  <Stack spacing={2.5}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Address
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {issueLocation.address}
                      </Typography>
                    </Box>

                    {issueLocation.lat && issueLocation.lng && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Coordinates
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'grey.50', p: 1, borderRadius: 1, flex: 1 }}>
                            {issueLocation.lat.toFixed(6)}, {issueLocation.lng.toFixed(6)}
                          </Typography>
                          <Tooltip title="Copy coordinates">
                            <IconButton size="small" onClick={copyCoordinates}>
                              <CopyAll fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Box>
                    )}

                    {distance && (
                      <Alert severity="info" icon={<Straighten />} sx={{ borderRadius: 2 }}>
                        <Typography variant="body2" fontWeight={600}>
                          {distance}
                        </Typography>
                      </Alert>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              {/* Actions Card */}
              <Card elevation={2} sx={{ borderRadius: 3 }}>
                <Box sx={{ p: 2.5, bgcolor: 'info.main', color: 'white', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Actions
                  </Typography>
                </Box>
                <CardContent sx={{ p: 2.5 }}>
                  <Stack spacing={2}>
                    <Button 
                      variant="contained" 
                      startIcon={<Visibility />}
                      onClick={openInOSM}
                      fullWidth
                      sx={{ borderRadius: 2 }}
                    >
                      View on Map
                    </Button>
                    
                    <Button 
                      variant="outlined" 
                      startIcon={<GpsFixed />}
                      onClick={getUserLocation}
                      fullWidth
                      sx={{ borderRadius: 2 }}
                    >
                      {userLocation ? 'Update Location' : 'Get My Location'}
                    </Button>

                    {userLocation && (
                      <Button 
                        variant="contained" 
                        color="success"
                        startIcon={<Navigation />}
                        onClick={openDirections}
                        fullWidth
                        sx={{ borderRadius: 2 }}
                      >
                        Get Directions
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              {/* Map Tools */}
              {issueLocation.lat && issueLocation.lng && (
                <Card elevation={2} sx={{ borderRadius: 3 }}>
                  <Box sx={{ p: 2.5, bgcolor: 'grey.800', color: 'white', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                    <Typography variant="h6" fontWeight={600}>
                      Map Tools
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack spacing={1.5}>
                      <Button 
                        variant="outlined" 
                        size="small"
                        startIcon={<Edit />}
                        endIcon={<OpenInNew />}
                        onClick={() => window.open(`https://www.openstreetmap.org/edit#map=15/${issueLocation.lat}/${issueLocation.lng}`, '_blank')}
                        fullWidth
                        sx={{ borderRadius: 1.5, justifyContent: 'flex-start' }}
                      >
                        Edit Map
                      </Button>
                      
                      <Button 
                        variant="outlined" 
                        size="small"
                        startIcon={<NoteAdd />}
                        endIcon={<OpenInNew />}
                        onClick={() => window.open(`https://www.openstreetmap.org/note/new#map=15/${issueLocation.lat}/${issueLocation.lng}`, '_blank')}
                        fullWidth
                        sx={{ borderRadius: 1.5, justifyContent: 'flex-start' }}
                      >
                        Add Note
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              )}

              {/* Info Card */}
              <Card elevation={2} sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Alert severity="info" icon={<Info />} sx={{ borderRadius: 2 }}>
                    <Typography variant="body2" fontWeight={600}>
                      OpenStreetMap
                    </Typography>
                    <Typography variant="caption">
                      Free, open-source mapping service
                    </Typography>
                  </Alert>
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default IssueDetails;