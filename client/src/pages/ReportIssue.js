import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Container,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  TextField,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  InputAdornment,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  useTheme,
  alpha,
  styled
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  LocationOn as LocationOnIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  MyLocation as MyLocationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default Leaflet marker
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const steps = ['Issue Details', 'Location', 'Review & Submit'];

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const StyledStepIcon = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: ownerState.completed ? theme.palette.primary.main : 
                     ownerState.active ? theme.palette.primary.main : theme.palette.grey[300],
  color: ownerState.completed || ownerState.active ? '#fff' : theme.palette.grey[500],
  width: 32,
  height: 32,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
}));

const PriorityChip = styled(Chip)(({ priority, theme }) => ({
  backgroundColor: 
    priority === 'High' ? alpha(theme.palette.error.main, 0.1) :
    priority === 'Medium' ? alpha(theme.palette.warning.main, 0.1) :
    alpha(theme.palette.success.main, 0.1),
  color: 
    priority === 'High' ? theme.palette.error.main :
    priority === 'Medium' ? theme.palette.warning.main :
    theme.palette.success.main,
  border: `1px solid ${
    priority === 'High' ? theme.palette.error.main :
    priority === 'Medium' ? theme.palette.warning.main :
    theme.palette.success.main
  }`,
  fontWeight: 'bold',
}));

const ReportIssue = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    imagePreview: null,
    address: '',
    position: null,
    priority: 'Low',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mapReady, setMapReady] = useState(false);
  const fileInputRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => setMapReady(true), []);
  useEffect(() => {
    if (mapReady && formData.position && mapRef.current && markerRef.current) {
      const map = mapRef.current;
      map.flyTo(formData.position, 18, { animate: true, duration: 1.5 });
      markerRef.current.setLatLng(formData.position);
    }
  }, [formData.position, mapReady]);

  const handleMarkerDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    const address = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;

    setFormData(prev => ({
      ...prev,
      position: [lat, lng],
      address: address
    }));
    setErrors({ ...errors, position: null, address: null });
  };

  // Fixed validation function - now properly prevents navigation
  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 0:
        if (!formData.title.trim()) newErrors.title = 'Issue type is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.priority) newErrors.priority = 'Priority is required';
        // Image is optional, so no validation needed
        break;
      case 1:
        if (!formData.address.trim()) newErrors.address = 'Location is required';
        if (!formData.position) newErrors.position = 'Please select a location on the map';
        break;
      default:
        break;
    }

    setErrors(newErrors);
    
    // Return false if there are any errors
    return Object.keys(newErrors).length === 0;
  };

  const detectLocation = () => {
    setLoading(true);
    setErrors({});

    if (!navigator.geolocation) {
      setErrors({ address: 'Geolocation is not supported by your browser' });
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const address = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;

        setFormData(prev => ({
          ...prev,
          position: [latitude, longitude],
          address: address
        }));
        setLoading(false);
      },
      (error) => {
        let errorMessage = 'Failed to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        setErrors({ address: errorMessage });
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    const address = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;

    setFormData(prev => ({
      ...prev,
      position: [lat, lng],
      address: address
    }));
    setErrors({ ...errors, position: null, address: null });
  };

  // Fixed handleNext function - now properly validates before proceeding
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    } else {
      // Show error toast if validation fails
      toast.error('Please fill all required fields before proceeding');
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setErrors({});
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ image: 'Image size should be less than 5MB' });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
        setErrors({ ...errors, image: null });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation before submission
    if (!validateStep(0) || !validateStep(1)) {
      toast.error('Please complete all required fields before submitting');
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("priority", formData.priority);

      const locationData = {
        type: "Point",
        coordinates: [formData.position[1], formData.position[0]],
        address: formData.address || "",
      };
      form.append("location", JSON.stringify(locationData));

      if (formData.image) {
        form.append("image", formData.image);
      }

      const response = await axios.post(
        "http://localhost:5000/api/user/createissue",
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 10000
        }
      );

      toast.success("Issue reported successfully!");
      setFormData({
        title: '',
        description: '',
        image: null,
        imagePreview: null,
        address: '',
        position: null,
        priority: 'Low',
      });
      setActiveStep(0);
      navigate('/submission-success');

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit issue");
    } finally {
      setLoading(false);
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: handleMapClick,
    });
    return null;
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.title} required>
                  <InputLabel id="title-label">Issue Type *</InputLabel>
                  <Select
                    labelId="title-label"
                    value={formData.title}
                    label="Issue Type *"
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="Pothole">🚧 Pothole</MenuItem>
                    <MenuItem value="Garbage Dumping">🗑️ Garbage Dumping</MenuItem>
                    <MenuItem value="Street Light Issue">💡 Street Light Issue</MenuItem>
                    <MenuItem value="Water Leakage">💧 Water Leakage</MenuItem>
                    <MenuItem value="Other">❓ Other</MenuItem>
                  </Select>
                  {errors.title && <FormHelperText error>{errors.title}</FormHelperText>}
                </FormControl>

                <FormControl fullWidth error={!!errors.priority} required>
                  <InputLabel id="priority-label">Priority Level *</InputLabel>
                  <Select
                    labelId="priority-label"
                    value={formData.priority}
                    label="Priority Level *"
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <MenuItem value="Low">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', mr: 1 }} />
                        Low Priority
                      </Box>
                    </MenuItem>
                    <MenuItem value="Medium">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main', mr: 1 }} />
                        Medium Priority
                      </Box>
                    </MenuItem>
                    <MenuItem value="High">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main', mr: 1 }} />
                        High Priority
                      </Box>
                    </MenuItem>
                  </Select>
                  {errors.priority && <FormHelperText error>{errors.priority}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Description *"
                  multiline
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  error={!!errors.description}
                  helperText={errors.description || 'Please provide detailed description of the issue'}
                  placeholder="Describe the issue in detail including any specific observations..."
                  required
                />
              </Grid>
            </Grid>

            <Card variant="outlined" sx={{ mt: 3, p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CloudUploadIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Upload Image (Optional)</Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center', py: 3, border: '2px dashed', 
                borderColor: errors.image ? 'error.main' : 'grey.300', borderRadius: 2 }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
                
                {!formData.imagePreview ? (
                  <Box>
                    <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Drag & drop or click to upload
                    </Typography>
                    <Button 
                      variant="outlined" 
                      onClick={() => fileInputRef.current?.click()}
                      sx={{ mt: 1 }}
                    >
                      Choose Image
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <img 
                      src={formData.imagePreview} 
                      alt="Preview" 
                      style={{ 
                        maxWidth: '200px', 
                        maxHeight: '150px', 
                        borderRadius: '8px',
                        marginBottom: '10px'
                      }} 
                    />
                    <Box>
                      <Button 
                        startIcon={<EditIcon />}
                        onClick={() => fileInputRef.current?.click()}
                        sx={{ mr: 1 }}
                      >
                        Change
                      </Button>
                      <Button 
                        startIcon={<DeleteIcon />}
                        color="error"
                        onClick={removeImage}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
              {errors.image && (
                <FormHelperText error sx={{ mt: 1 }}>{errors.image}</FormHelperText>
              )}
            </Card>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              Please select the exact location of the issue on the map below.
            </Alert>

            <TextField
              fullWidth
              label="Location Address *"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              error={!!errors.address}
              helperText={errors.address || 'Click on the map or use current location'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Use current location">
                      <span>
                        <IconButton 
                          color="primary" 
                          onClick={detectLocation} 
                          disabled={loading}
                          sx={{ 
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                          }}
                        >
                          {loading ? <CircularProgress size={24} /> : <MyLocationIcon />}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
              required
            />

            <Card variant="outlined">
              <Box sx={{ height: '400px', width: '100%', position: 'relative' }}>
                <MapContainer
                  center={formData.position || [28.6139, 77.2090]}
                  zoom={formData.position ? 16 : 12}
                  style={{ height: '100%', width: '100%' }}
                  ref={mapRef}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  <MapClickHandler />
                  {formData.position && (
                    <Marker
                      position={formData.position}
                      draggable={true}
                      eventHandlers={{ dragend: handleMarkerDragEnd }}
                      ref={markerRef}
                    >
                      <Popup>Issue Location - Drag to adjust</Popup>
                    </Marker>
                  )}
                </MapContainer>
                
                {!formData.position && (
                  <Box sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    bgcolor: 'background.paper',
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 3
                  }}>
                    <LocationOnIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
                    <Typography variant="body1" fontWeight="bold">
                      Click on the map to set issue location
                    </Typography>
                  </Box>
                )}
              </Box>
            </Card>
            {errors.position && (
              <FormHelperText error sx={{ mt: 1, textAlign: 'center' }}>
                {errors.position}
              </FormHelperText>
            )}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Please review your issue report before submitting
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      📋 Issue Details
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">Issue Type</Typography>
                      <Typography variant="body1" fontWeight="bold">{formData.title}</Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">Priority</Typography>
                      <PriorityChip 
                        label={formData.priority} 
                        priority={formData.priority}
                        size="small"
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {formData.description}
                      </Typography>
                    </Box>

                    {formData.imagePreview && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">Attached Image</Typography>
                        <img 
                          src={formData.imagePreview} 
                          alt="Issue preview" 
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: '200px', 
                            borderRadius: '8px',
                            marginTop: '8px'
                          }} 
                        />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: alpha(theme.palette.success.main, 0.02) }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      📍 Location Details
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                      <Typography variant="body1" fontWeight="bold">{formData.address}</Typography>
                    </Box>

                    <Box sx={{ height: '200px', borderRadius: 2, overflow: 'hidden' }}>
                      {formData.position && (
                        <MapContainer 
                          center={formData.position} 
                          zoom={16} 
                          style={{ height: '100%', width: '100%' }}
                          scrollWheelZoom={false}
                          dragging={false}
                          zoomControl={false}
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; OpenStreetMap contributors'
                          />
                          <Marker position={formData.position} />
                        </MapContainer>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Alert severity="warning" sx={{ mt: 3 }}>
              <WarningIcon sx={{ mr: 1 }} />
              Once submitted, this report cannot be edited. Please verify all information is correct.
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  const CustomStepIcon = (props) => {
    const { active, completed, icon } = props;
    return (
      <StyledStepIcon ownerState={{ active, completed }}>
        {completed ? <CheckCircleIcon sx={{ fontSize: 20 }} /> : icon}
      </StyledStepIcon>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
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
          }}
        >
          Report an Issue
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Help us improve your community by reporting issues
        </Typography>
      </Box>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6 }}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel StepIconComponent={CustomStepIcon}>
              <Typography variant="subtitle1" fontWeight="bold">
                {label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 3, 
          borderRadius: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
        }}
      >
        {renderStepContent(activeStep)}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button 
          variant="outlined" 
          disabled={activeStep === 0 || loading} 
          onClick={handleBack} 
          startIcon={<ArrowBackIcon />}
          size="large"
        >
          Back
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Step {activeStep + 1} of {steps.length}
          </Typography>
          
          {activeStep === steps.length - 1 ? (
            <Button 
              variant="contained" 
              onClick={handleSubmit} 
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
              size="large"
              sx={{ 
                px: 4,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                }
              }}
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </Button>
          ) : (
            <Button 
              variant="contained" 
              onClick={handleNext} 
              disabled={loading}
              size="large"
              sx={{ px: 4 }}
            >
              Continue
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ReportIssue;