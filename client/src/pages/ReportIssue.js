// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Container,
//   Stepper,
//   Step,
//   StepLabel,
//   Button,
//   Typography,
//   Box,
//   TextField,
//   Paper,
//   IconButton,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   FormHelperText,
//   CircularProgress,
//   InputAdornment,
//   Tooltip,
//   SvgIcon
// } from '@mui/material';
// import {
//   CloudUpload as CloudUploadIcon,
//   LocationOn as LocationOnIcon,
//   ArrowBack as ArrowBackIcon,
//   CheckCircle as CheckCircleIcon,
//   Info as InfoIcon
// } from '@mui/icons-material';
// import { styled } from '@mui/material/styles';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // Fix for default marker icon in Leaflet with webpack
// import icon from 'leaflet/dist/images/marker-icon.png';
// import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// let DefaultIcon = L.icon({
//   iconUrl: icon,
//   shadowUrl: iconShadow,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41]
// });

// L.Marker.prototype.options.icon = DefaultIcon;

// const steps = ['Issue Details', 'Location', 'Review & Submit'];

// const VisuallyHiddenInput = styled('input')({
//   clip: 'rect(0 0 0 0)',
//   clipPath: 'inset(50%)',
//   height: 1,
//   overflow: 'hidden',
//   position: 'absolute',
//   bottom: 0,
//   left: 0,
//   whiteSpace: 'nowrap',
//   width: 1,
// });

// const ReportIssue = () => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [formData, setFormData] = useState({
//     issueType: '',
//     description: '',
//     image: null,
//     imagePreview: null,
//     address: '',
//     position: null,
//     contactInfo: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [locationError, setLocationError] = useState('');
//   const [mapReady, setMapReady] = useState(false);
//   const fileInputRef = useRef(null);
//   const mapRef = useRef(null);
//   const markerRef = useRef(null);
//   const navigate = useNavigate();

//   // Initialize map when component mounts
//   useEffect(() => {
//     setMapReady(true);
//     return () => {
//       setMapReady(false);
//     };
//   }, []);

//   // Update marker position when position changes
//   useEffect(() => {
//     if (mapReady && formData.position && mapRef.current && markerRef.current) {
//       const map = mapRef.current;
//       map.flyTo(formData.position, 18, {
//         animate: true,
//         duration: 1.5
//       });
      
//       // Update marker position
//       markerRef.current.setLatLng(formData.position);
//     }
//   }, [formData.position, mapReady]);

//   const detectLocation = () => {
//     setLoading(true);
//     setLocationError('');

//     const options = {
//       enableHighAccuracy: true,  // Use GPS if available
//       timeout: 10000,           // 10 seconds
//       maximumAge: 0            // Force fresh location
//     };

//     if (!navigator.geolocation) {
//       setLocationError('Geolocation is not supported by your browser');
//       setLoading(false);
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         const newPosition = [latitude, longitude];
        
//         // Update form data with new position
//         setFormData(prev => ({
//           ...prev,
//           position: newPosition,
//           address: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`
//         }));
        
//         // Reverse geocode to get address (in a real app, you would use a geocoding service)
//         // For now, we'll just use the coordinates as the address
//         setLoading(false);
//       },
//       (error) => {
//         let errorMessage = 'Failed to get location';
//         switch(error.code) {
//           case error.PERMISSION_DENIED:
//             errorMessage = 'User denied location access';
//             break;
//           case error.POSITION_UNAVAILABLE:
//             errorMessage = 'Location information is unavailable';
//             break;
//           case error.TIMEOUT:
//             errorMessage = 'Request timed out';
//             break;
//           default:
//             errorMessage = 'An unknown error occurred';
//         }
//         setLocationError(errorMessage);
//         setLoading(false);
//       },
//       options
//     );
//   };

//   const handleMapClick = (e) => {
//     const { lat, lng } = e.latlng;
//     const newPosition = [lat, lng];
    
//     setFormData(prev => ({
//       ...prev,
//       position: newPosition,
//       address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`
//     }));
//   };

//   const handleMarkerDragEnd = (e) => {
//     const { lat, lng } = e.target.getLatLng();
//     const newPosition = [lat, lng];
    
//     setFormData(prev => ({
//       ...prev,
//       position: newPosition,
//       address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`
//     }));
//   };

//   const handleNext = () => {
//     if (validateStep(activeStep)) {
//       setActiveStep((prevStep) => prevStep + 1);
//     }
//   };

//   const handleBack = () => {
//     setActiveStep((prevStep) => prevStep - 1);
//   };

//   const validateStep = (step) => {
//     switch (step) {
//       case 0:
//         if (!formData.issueType) {
//           setLocationError('Please select an issue type');
//           return false;
//         }
//         if (!formData.description) {
//           setLocationError('Please provide a description');
//           return false;
//         }
//         break;
//       case 1:
//         if (!formData.address) {
//           setLocationError('Please provide or confirm the location');
//           return false;
//         }
//         break;
//       default:
//         return true;
//     }
//     setLocationError('');
//     return true;
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData(prev => ({
//           ...prev,
//           image: file,
//           imagePreview: reader.result
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setLoading(true);
//     // Simulate API call
//     setTimeout(() => {
//       console.log('Form submitted:', formData);
//       setLoading(false);
//       navigate('/submission-success');
//     }, 1500);
//   };

//   const renderStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <Box component="form" noValidate sx={{ mt: 2 }}>
//             <FormControl fullWidth margin="normal" required error={!formData.issueType && locationError}>
//               <InputLabel id="issue-type-label">Issue Type</InputLabel>
//               <Select
//                 labelId="issue-type-label"
//                 id="issue-type"
//                 value={formData.issueType}
//                 label="Issue Type"
//                 onChange={(e) => setFormData({...formData, issueType: e.target.value})}
//               >
//                 <MenuItem value="pothole">Pothole</MenuItem>
//                 <MenuItem value="garbage">Garbage Dumping</MenuItem>
//                 <MenuItem value="streetlight">Street Light Issue</MenuItem>
//                 <MenuItem value="water">Water Leakage</MenuItem>
//                 <MenuItem value="other">Other</MenuItem>
//               </Select>
//               {!formData.issueType && locationError && (
//                 <FormHelperText>{locationError}</FormHelperText>
//               )}
//             </FormControl>

//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="description"
//               label="Description"
//               name="description"
//               multiline
//               rows={4}
//               value={formData.description}
//               onChange={(e) => setFormData({...formData, description: e.target.value})}
//               error={!formData.description && !!locationError}
//               helperText={!formData.description && locationError ? locationError : 'Please provide a detailed description of the issue'}
//             />

//             <Box sx={{ mt: 2, mb: 2 }}>
//               <Button
//                 component="label"
//                 variant="outlined"
//                 startIcon={<CloudUploadIcon />}
//                 sx={{ mr: 2 }}
//               >
//                 Upload Image
//                 <VisuallyHiddenInput 
//                   type="file" 
//                   accept="image/*" 
//                   onChange={handleImageChange}
//                   ref={fileInputRef}
//                 />
//               </Button>
              
//               {formData.imagePreview && (
//                 <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
//                   <img 
//                     src={formData.imagePreview} 
//                     alt="Preview" 
//                     style={{ 
//                       maxWidth: '150px', 
//                       maxHeight: '150px',
//                       borderRadius: '4px',
//                       marginRight: '10px'
//                     }} 
//                   />
//                   <Button 
//                     variant="text" 
//                     color="secondary"
//                     onClick={() => fileInputRef.current?.click()}
//                   >
//                     Change Image
//                   </Button>
//                 </Box>
//               )}
//             </Box>
//           </Box>
//         );
      
//       case 1:
//         return (
//           <Box sx={{ mt: 2 }}>
//             <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
//               <TextField
//                 fullWidth
//                 label="Address / Landmark"
//                 value={formData.address}
//                 onChange={(e) => setFormData({...formData, address: e.target.value})}
//                 error={!!locationError}
//                 helperText={locationError || 'Click the location icon to detect your current location'}
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <Tooltip title="Detect current location">
//                         <span>
//                           <IconButton 
//                             color="primary" 
//                             onClick={detectLocation}
//                             disabled={loading}
//                             edge="end"
//                           >
//                             {loading ? <CircularProgress size={24} /> : <LocationOnIcon />}
//                           </IconButton>
//                         </span>
//                       </Tooltip>
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </Box>

//             <Box sx={{ 
//               height: '300px', 
//               width: '100%', 
//               mt: 2, 
//               mb: 2,
//               borderRadius: 1,
//               overflow: 'hidden',
//               boxShadow: 1
//             }}>
//               <MapContainer
//                 center={formData.position || [0, 0]}
//                 zoom={formData.position ? 18 : 2}
//                 style={{ 
//                   height: '100%', 
//                   width: '100%',
//                   zIndex: 0
//                 }}
//                 ref={mapRef}
//                 whenCreated={(map) => {
//                   mapRef.current = map;
//                 }}
//                 zoomControl={false}
//                 onClick={handleMapClick}
//               >
//                 <TileLayer
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                   attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                 />
//                 {formData.position && (
//                   <Marker
//                     position={formData.position}
//                     draggable={true}
//                     eventHandlers={{
//                       dragend: handleMarkerDragEnd,
//                     }}
//                     ref={markerRef}
//                   >
//                     <Popup minWidth={180}>
//                       <Box sx={{ textAlign: 'center' }}>
//                         <Typography variant="body2">
//                           Drag to adjust location
//                         </Typography>
//                         <Typography variant="caption" display="block">
//                           {formData.address}
//                         </Typography>
//                       </Box>
//                     </Popup>
//                   </Marker>
//                 )}
//               </MapContainer>
//             </Box>
            
//             <Box sx={{ 
//               display: 'flex', 
//               alignItems: 'center', 
//               mt: 1, 
//               mb: 2,
//               p: 1,
//               bgcolor: 'action.hover',
//               borderRadius: 1
//             }}>
//               <InfoIcon color="info" sx={{ mr: 1 }} />
//               <Typography variant="body2" color="text.secondary">
//                 Click on the map to set location or drag the marker to adjust precisely.
//               </Typography>
//             </Box>
//           </Box>
//         );
      
//       case 2:
//         return (
//           <Box sx={{ mt: 2 }}>
//             <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
//               <Typography variant="h6" gutterBottom>Issue Details</Typography>
//               <Typography><strong>Type:</strong> {formData.issueType}</Typography>
//               <Typography><strong>Description:</strong> {formData.description}</Typography>
              
//               <Box sx={{ mt: 2, mb: 2 }}>
//                 <Typography><strong>Image:</strong></Typography>
//                 {formData.imagePreview && (
//                   <img 
//                     src={formData.imagePreview} 
//                     alt="Issue preview" 
//                     style={{ 
//                       maxWidth: '200px', 
//                       maxHeight: '200px',
//                       marginTop: '10px',
//                       borderRadius: '4px'
//                     }} 
//                   />
//                 )}
//               </Box>
              
//               <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Location</Typography>
//               <Typography>{formData.address}</Typography>
              
//               {formData.position && (
//                 <Box sx={{ height: '200px', width: '100%', mt: 2, mb: 2 }}>
//                   <MapContainer
//                     center={formData.position}
//                     zoom={15}
//                     style={{ height: '100%', width: '100%', borderRadius: '4px' }}
//                     zoomControl={false}
//                     scrollWheelZoom={false}
//                     dragging={false}
//                   >
//                     <TileLayer
//                       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                       attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                     />
//                     <Marker position={formData.position} />
//                   </MapContainer>
//                 </Box>
//               )}
//             </Paper>

//             <TextField
//               margin="normal"
//               fullWidth
//               id="contact"
//               label="Contact Information (Optional)"
//               name="contact"
//               value={formData.contactInfo}
//               onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
//               helperText="Email or phone number for updates (optional)"
//             />
//           </Box>
//         );
      
//       default:
//         return 'Unknown step';
//     }
//   };

//   return (
//     <Container maxWidth="md" sx={{ py: 4 }}>
//       <Typography variant="h4" component="h1" gutterBottom align="center">
//         Report an Issue
//       </Typography>
      
//       <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
//         {steps.map((label) => (
//           <Step key={label}>
//             <StepLabel>{label}</StepLabel>
//           </Step>
//         ))}
//       </Stepper>

//       <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
//         {renderStepContent(activeStep)}
//       </Paper>

//       <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//         <Button
//           disabled={activeStep === 0 || loading}
//           onClick={handleBack}
//           startIcon={<ArrowBackIcon />}
//         >
//           Back
//         </Button>
        
//         {activeStep === steps.length - 1 ? (
//           <Button
//             variant="contained"
//             onClick={handleSubmit}
//             disabled={loading}
//             endIcon={loading ? <CircularProgress size={24} /> : <CheckCircleIcon />}
//           >
//             {loading ? 'Submitting...' : 'Submit Report'}
//           </Button>
//         ) : (
//           <Button
//             variant="contained"
//             onClick={handleNext}
//             disabled={loading}
//           >
//             Next
//           </Button>
//         )}
//       </Box>
//     </Container>
//   );
// };

// export default ReportIssue;



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
    issueType: '',
    description: '',
    image: null,
    imagePreview: null,
    address: '',
    position: null,
    contactInfo: ''
  });
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
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

  // Detect user's location
  const detectLocation = () => {
    setLoading(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          position: [latitude, longitude],
          address: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`
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
        setLocationError(errorMessage);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setFormData(prev => ({
      ...prev,
      position: [lat, lng],
      address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`
    }));
  };

  const handleMarkerDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    setFormData(prev => ({
      ...prev,
      position: [lat, lng],
      address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`
    }));
  };

  const handleNext = () => {
    if (validateStep(activeStep)) setActiveStep(prev => prev + 1);
  };
  const handleBack = () => setActiveStep(prev => prev - 1);

  const validateStep = (step) => {
    switch (step) {
      case 0:
        if (!formData.issueType) { setLocationError('Please select an issue type'); return false; }
        if (!formData.description) { setLocationError('Please provide a description'); return false; }
        break;
      case 1:
        if (!formData.address) { setLocationError('Please provide or confirm the location'); return false; }
        break;
      default: return true;
    }
    setLocationError('');
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

  // ✅ Submit data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      form.append("title", formData.issueType);
      form.append("description", formData.description);
      form.append("location", JSON.stringify({
        coordinates: formData.position || [0,0],
        address: formData.address || ""
      }));
      if (formData.image) form.append("image", formData.image);

      const { data } = await axios.post(
        "http://localhost:5000/api/user/createissue",
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (data.success) {
        toast.success(data.message || "Issue reported successfully!");
        setFormData({
          issueType: '',
          description: '',
          image: null,
          imagePreview: null,
          address: '',
          position: null,
          contactInfo: ''
        });
        setActiveStep(0);
        navigate('/submission-success');
      } else {
        toast.error(data.message || "Failed to report issue");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch(step){
      case 0:
        return (
          <Box component="form" noValidate sx={{ mt:2 }}>
            <FormControl fullWidth margin="normal" required error={!formData.issueType && locationError}>
              <InputLabel id="issue-type-label">Issue Type</InputLabel>
              <Select
                labelId="issue-type-label"
                value={formData.issueType}
                onChange={(e) => setFormData({...formData, issueType: e.target.value})}
              >
                <MenuItem value="Pothole">Pothole</MenuItem>
                <MenuItem value="Garbage Dumping">Garbage Dumping</MenuItem>
                <MenuItem value="Street Light Issue">Street Light Issue</MenuItem>
                <MenuItem value="Water Leakage">Water Leakage</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
              {!formData.issueType && locationError && <FormHelperText>{locationError}</FormHelperText>}
            </FormControl>

            <TextField
              margin="normal"
              required
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              error={!formData.description && !!locationError}
              helperText={!formData.description && locationError ? locationError : 'Provide detailed description'}
            />

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
              error={!!locationError}
              helperText={locationError || 'Click location icon to detect current location'}
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
              <Typography><strong>Type:</strong> {formData.issueType}</Typography>
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
              <TextField
                margin="normal"
                fullWidth
                label="Contact Information (Optional)"
                value={formData.contactInfo}
                onChange={(e) => setFormData({...formData, contactInfo:e.target.value})}
                helperText="Email or phone number for updates (optional)"
              />
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
