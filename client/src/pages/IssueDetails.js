
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Chip,
  Button,
  CircularProgress,
  Card,
  Divider,
  Grid,
  Stack,
  Tooltip,
  IconButton,
  Alert,
} from "@mui/material";
import {
  ArrowBack,
  Share,
  CalendarToday,
  LocationOn,
  CopyAll,
  Navigation,
  GpsFixed,
  Straighten,
} from "@mui/icons-material";
import { format } from "date-fns";

const IssueDetails = () => {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [copySuccess, setCopySuccess] = useState("");
  const [locationError, setLocationError] = useState("");
  const [distance, setDistance] = useState(null);

  const navigate = useNavigate();

  const fetchIssue = async () => {
    try {
      const res = await axios.get(`/api/user/issue/${id}`);
      console.log("res: of the fetchissue", res.data.issue);
      setIssue(res.data.issue);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const parseLocationData = (locationString) => {
    try {
      const locationData =
        typeof locationString === "string" ? JSON.parse(locationString) : locationString;

      const coordinates = locationData.coordinates || [];
      const lat = coordinates[1] || null;
      const lng = coordinates[0] || null;

      const address =
        locationData.address ||
        locationData.formattedAddress ||
        (lat && lng ? `Lat: ${lat}, Lng: ${lng}` : "Location not available");

      return { lat, lng, address, coordinates };
    } catch {
      return { lat: null, lng: null, address: "Location not available", coordinates: [] };
    }
  };

  const issueLocation = issue ? parseLocationData(issue.location) : {};

  const osmEmbedUrl = issueLocation.lat
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${issueLocation.lng - 0.01
    },${issueLocation.lat - 0.01},${issueLocation.lng + 0.01},${issueLocation.lat + 0.01
    }&marker=${issueLocation.lat}%2C${issueLocation.lng}`
    : null;

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setLocationError(''); // Clear previous errors

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setCopySuccess("✅ Location detected successfully!");
        setTimeout(() => setCopySuccess(""), 3000);
      },
      (error) => {
        let errorMessage = '';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "❌ Location permission denied. Click the lock icon 🔒 next to the URL and enable location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
          default:
            errorMessage = "Unable to fetch your location";
        }

        setLocationError(errorMessage);
        setTimeout(() => setLocationError(""), 10000); // Show error for 10 seconds
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;

    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const km = R * c;
    return km < 1 ? `${(km * 1000).toFixed(0)} meters away` : `${km.toFixed(1)} km away`;
  };

  useEffect(() => {
    if (issue && userLocation) {
      setDistance(
        calculateDistance(
          userLocation.lat,
          userLocation.lng,
          issueLocation.lat,
          issueLocation.lng
        )
      );
    }
  }, [userLocation, issue]);

  const shareIssue = () => {
    if (navigator.share) {
      navigator.share({
        title: issue.title,
        text: issue.description,
        url: window.location.href,
      });
    }
  };

  const copyCoordinates = () => {
    navigator.clipboard.writeText(
      `${issueLocation.lat.toFixed(6)}, ${issueLocation.lng.toFixed(6)}`
    );
    setCopySuccess("Coordinates copied!");
  };

  const openDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${issueLocation.lat},${issueLocation.lng}`,
      "_blank"
    );
  };

  if (loading)
    return (
      <Box sx={{ height: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress size={60} />
      </Box>
    );

  if (!issue)
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h5">Issue not found</Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate(-1)} variant="contained" startIcon={<ArrowBack />}>
          Go Back
        </Button>
      </Box>
    );

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} variant="outlined">
          Back
        </Button>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Issue Details
        </Typography>
        <IconButton onClick={shareIssue} size="large" color="primary">
          <Share />
        </IconButton>
      </Box>

      <Grid container spacing={4}>
        {/* Left Side - Content */}
        <Grid item xs={12} md={7}>
          <Stack spacing={3}>
            {/* Title Card */}
            <Card sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {issue.title}
              </Typography>

              <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                <Chip
                  label={issue.status}
                  color={issue.status === 'resolved' ? 'success' : 'primary'}
                  variant="filled"
                />
                <Chip
                  label={`Priority: ${issue.priority}`}
                  color={
                    issue.priority === 'high' ? 'error' :
                      issue.priority === 'medium' ? 'warning' : 'info'
                  }
                />
              </Box>

              <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }} color="text.secondary">
                <CalendarToday fontSize="small" />
                Reported on {format(new Date(issue.createdAt), "PPpp")}
              </Typography>
            </Card>

            {/* Description Card */}
            <Card sx={{ p: 4, borderRadius: 3, boxShadow: 2 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Description
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
                {issue.description}
              </Typography>
            </Card>

            {/* Image Card */}
            {issue.image && (
              <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Attached Image
                </Typography>
                <Box
                  component="img"
                  src={issue.image}
                  alt="Issue"
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    maxHeight: 400,
                    objectFit: "cover",
                    cursor: "pointer",
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    }
                  }}
                  onClick={() => window.open(issue.image, "_blank")}
                />
              </Card>
            )}
          </Stack>
        </Grid>

        {/* Right Side - Sidebar */}
        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            {/* Location Details */}
            <Card sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn color="primary" />
                Location Details
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Address
                </Typography>
                <Typography variant="body1" sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                  <LocationOn color="action" sx={{ mt: 0.5 }} />
                  {issueLocation.address}
                </Typography>
              </Box>

              {issueLocation.lat && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Coordinates
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontFamily="monospace" sx={{ flex: 1 }}>
                      {issueLocation.lat.toFixed(6)}, {issueLocation.lng.toFixed(6)}
                    </Typography>
                    <Tooltip title="Copy Coordinates">
                      <IconButton size="small" onClick={copyCoordinates} color="primary">
                        <CopyAll fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              )}

              {distance && (
                <Alert severity="info" icon={<Straighten />} sx={{ borderRadius: 2 }}>
                  <Typography fontWeight="bold">
                    {distance}
                  </Typography>
                </Alert>
              )}
            </Card>

            {/* Actions */}
            <Card sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Quick Actions
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Stack spacing={2}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<GpsFixed />}
                  onClick={getUserLocation}
                  size="large"
                  sx={{ py: 1.5 }}
                >
                  {userLocation ? "Update My Location" : "Get My Location"}
                </Button>

                {userLocation && issueLocation.lat && (
                  <Button
                    variant="outlined"
                    color="success"
                    fullWidth
                    startIcon={<Navigation />}
                    onClick={openDirections}
                    size="large"
                    sx={{ py: 1.5 }}
                  >
                    Get Directions
                  </Button>
                )}
              </Stack>
            </Card>

            {/* Map */}
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Location Map
              </Typography>
              {issueLocation.lat ? (
                <Box sx={{ height: 400, borderRadius: 2, overflow: "hidden", mt: 2 }}>
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src={osmEmbedUrl}
                    style={{ border: 0 }}
                    title="Issue location map"
                  />
                </Box>
              ) : (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No GPS data available
                </Typography>
              )}
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Notifications */}
      <Box sx={{ position: 'fixed', bottom: 20, right: 20, maxWidth: 400 }}>
        {copySuccess && (
          <Alert severity="success" sx={{ boxShadow: 3 }}>
            {copySuccess}
          </Alert>
        )}
        {locationError && (
          <Alert severity="error" sx={{ boxShadow: 3 }}>
            {locationError}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default IssueDetails;