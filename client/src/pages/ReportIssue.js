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
  Tooltip
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  LocationOn as LocationOnIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

const ReportIssue = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    imagePreview: null,
    address: '', // For user-friendly display
    position: null, // For internal map use [lat, lng]
    priority: 'Low',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

  const detectLocation = () => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
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
            errorMessage = 'User denied location access';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Request timed out';
            break;
        }
        setError(errorMessage);
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
  };

  const handleMarkerDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    const address = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
    
    setFormData(prev => ({
      ...prev,
      position: [lat, lng],
      address: address
    }));
  };

  const handleNext = () => {
    if (validateStep(activeStep)) setActiveStep(prev => prev + 1);
  };
  const handleBack = () => setActiveStep(prev => prev - 1);

  const validateStep = (step) => {
    switch (step) {
      case 0:
        if (!formData.title) { setError('Please select an issue type'); return false; }
        if (!formData.description) { setError('Please provide a description'); return false; }
        if (!formData.priority) { setError('Please select a priority'); return false; }
        break;
      case 1:
        if (!formData.address) { setError('Please provide or confirm the location'); return false; }
        break;
      default: return true;
    }
    setError('');
    return true;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Validate required fields
    if (!formData.title || !formData.description) {
      toast.error("Title and description are required");
      return;
    }

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("priority", formData.priority);
    
    // Simplify location data - send as plain string
    const locationString = formData.address || "Location not specified";
    form.append("location", locationString);
    
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
    
    // Reset form
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
    if (err.response) {
      // Server responded with error
      if (typeof err.response.data === 'string' && err.response.data.includes('<!DOCTYPE html>')) {
        toast.error("Backend error: Check server console for details");
      } else {
        toast.error(err.response.data?.message || "Server error occurred");
      }
    } else if (err.request) {
      toast.error("No response from server. Check if backend is running.");
    } else {
      toast.error(`Error: ${err.message}`);
    }
  } finally {
    setLoading(false);
  }
};

  const renderStepContent = (step) => {
    switch(step){
      case 0:
        return (
          <Box component="form" noValidate sx={{ mt:2 }}>
            {/* Issue Type */}
            <FormControl fullWidth margin="normal" required error={!formData.title && error}>
              <InputLabel id="title-label">Issue Type</InputLabel>
              <Select
                labelId="title-label"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              >
                <MenuItem value="Pothole">Pothole</MenuItem>
                <MenuItem value="Garbage Dumping">Garbage Dumping</MenuItem>
                <MenuItem value="Street Light Issue">Street Light Issue</MenuItem>
                <MenuItem value="Water Leakage">Water Leakage</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
              {!formData.title && error && <FormHelperText>{error}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth margin="normal" required error={!formData.priority && error}>
              <InputLabel id="priority-label">Priority</InputLabel>
              <Select
                labelId="priority-label"
                id="priority-select"
                value={formData.priority}
                label="Priority"
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
              {!formData.priority && error && (
                <FormHelperText>{error}</FormHelperText>
              )}
            </FormControl>

            {/* Description */}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              error={!formData.description && !!error}
              helperText={!formData.description && error ? error : 'Provide detailed description'}
            />

            {/* Image Upload */}
            <Box sx={{ mt:2, mb:2 }}>
              <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} sx={{ mr:2 }}>
                Upload Image
                <VisuallyHiddenInput 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  ref={fileInputRef}
                />
              </Button>

              {formData.imagePreview && (
                <Box sx={{ mt:2, display:'flex', alignItems:'center' }}>
                  <img src={formData.imagePreview} alt="Preview" style={{ maxWidth:'150px', maxHeight:'150px', borderRadius:'4px', marginRight:'10px' }} />
                  <Button variant="text" color="secondary" onClick={() => fileInputRef.current?.click()}>Change Image</Button>
                </Box>
              )}
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt:2 }}>
            <TextField
              fullWidth
              label="Address / Landmark"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              error={!!error}
              helperText={error || 'Click location icon to detect current location'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Detect current location">
                      <span>
                        <IconButton color="primary" onClick={detectLocation} disabled={loading}>
                          {loading ? <CircularProgress size={24} /> : <LocationOnIcon />}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ height:'300px', width:'100%', mt:2, mb:2 }}>
              <MapContainer
                center={formData.position || [0,0]}
                zoom={formData.position ? 18 : 2}
                style={{ height:'100%', width:'100%' }}
                ref={mapRef}
                onClick={handleMapClick}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                {formData.position && (
                  <Marker
                    position={formData.position}
                    draggable={true}
                    eventHandlers={{ dragend: handleMarkerDragEnd }}
                    ref={markerRef}
                  >
                    <Popup>Drag to adjust location</Popup>
                  </Marker>
                )}
              </MapContainer>
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt:2 }}>
            <Paper elevation={2} sx={{ p:3, mb:3 }}>
              <Typography variant="h6" gutterBottom>Issue Details</Typography>
              <Typography><strong>Type:</strong> {formData.title}</Typography>
              <Typography><strong>Priority:</strong> {formData.priority}</Typography>
              <Typography><strong>Description:</strong> {formData.description}</Typography>
              {formData.imagePreview && <img src={formData.imagePreview} alt="Preview" style={{ maxWidth:'200px', maxHeight:'200px', marginTop:'10px' }} />}
              <Typography variant="h6" sx={{ mt:3, mb:2 }}>Location</Typography>
              <Typography>{formData.address}</Typography>
              {formData.position && (
                <Box sx={{ height:'200px', width:'100%', mt:2, mb:2 }}>
                  <MapContainer center={formData.position} zoom={15} style={{ height:'100%', width:'100%' }} scrollWheelZoom={false} dragging={false}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; OpenStreetMap contributors'
                    />
                    <Marker position={formData.position} />
                  </MapContainer>
                </Box>
              )}
            </Paper>
          </Box>
        );
      default: return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py:4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Report an Issue
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb:4 }}>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper elevation={3} sx={{ p:3, mb:3 }}>
        {renderStepContent(activeStep)}
      </Paper>

      <Box sx={{ display:'flex', justifyContent:'space-between' }}>
        <Button disabled={activeStep===0 || loading} onClick={handleBack} startIcon={<ArrowBackIcon />}>Back</Button>
        {activeStep===steps.length-1 ? (
          <Button variant="contained" onClick={handleSubmit} disabled={loading} endIcon={loading ? <CircularProgress size={24}/> : <CheckCircleIcon />}>
            {loading ? 'Submitting...' : 'Submit Report'}
          </Button>
        ) : (
          <Button variant="contained" onClick={handleNext} disabled={loading}>Next</Button>
        )}
      </Box>
    </Container>
  );
};

export default ReportIssue;