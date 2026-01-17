import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent,
    Typography, Box, Grid, Card, Divider,
    Button, IconButton, Alert, Chip,
    Stack, Tooltip
} from '@mui/material';
import {
    ArrowBack, Share, CalendarToday, LocationOn,
    CopyAll, Navigation, GpsFixed, Straighten,
    Close, Directions, Edit
} from '@mui/icons-material';
import { format } from 'date-fns';

const statusOptions = ['Pending', 'In Process', 'Assigned', 'Solved', 'Rejected'];

const statusColors = {
    'Pending': 'warning',
    'In Process': 'info',
    'Assigned': 'secondary',
    'Solved': 'success',
    'Rejected': 'error'
};

const AdminIssueDetailsDialog = ({ open, onClose, issue, onStatusUpdate }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [distance, setDistance] = useState(null);
    const [locationError, setLocationError] = useState("");
    const [copySuccess, setCopySuccess] = useState("");
    const [currentStatus, setCurrentStatus] = useState(issue?.status);

    useEffect(() => {
        if (issue) setCurrentStatus(issue.status);
    }, [issue]);

    // if (!issue) return null; // Removed early return to prevent hook errors

    const issueCoordinates = issue?.location?.coordinates || [];
    const issueLat = issueCoordinates[1];
    const issueLng = issueCoordinates[0];
    const issueAddress = issue?.location?.address || 'Unknown Location';

    const parseLocationData = (loc) => {
        return { lat: issueLat, lng: issueLng, address: issueAddress };
    };

    const issueLocation = parseLocationData(issue?.location);

    const osmEmbedUrl = issueLat
        ? `https://www.openstreetmap.org/export/embed.html?bbox=${issueLng - 0.01},${issueLat - 0.01},${issueLng + 0.01},${issueLat + 0.01}&marker=${issueLat}%2C${issueLng}`
        : null;

    const getUserLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser');
            return;
        }
        setLocationError('');
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
                setLocationError("Unable to fetch your location: " + error.message);
                setTimeout(() => setLocationError(""), 5000);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
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
        return km < 1 ? `${(km * 1000).toFixed(0)} meters` : `${km.toFixed(1)} km`;
    };

    useEffect(() => {
        if (userLocation && issueLat && issueLng) {
            setDistance(calculateDistance(userLocation.lat, userLocation.lng, issueLat, issueLng));
        }
    }, [userLocation, issueLat, issueLng]);

    const openDirections = () => {
        window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${issueLat},${issueLng}`,
            "_blank"
        );
    };

    const copyCoordinates = () => {
        navigator.clipboard.writeText(`${issueLat?.toFixed(6)}, ${issueLng?.toFixed(6)}`);
        setCopySuccess("Coordinates copied!");
        setTimeout(() => setCopySuccess(""), 2000);
    };

    const handleStatusClick = (newStatus) => {
        setCurrentStatus(newStatus);
        if (onStatusUpdate) onStatusUpdate(issue.id, newStatus);
    };

    if (!issue) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth scroll="body">
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" component="div" fontWeight="bold">
                    Issue Details #{issue.id?.slice(-6).toUpperCase()}
                </Typography>
                <IconButton aria-label="close" onClick={onClose}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 4, bgcolor: '#f8fafc' }}>
                <Grid container spacing={4}>
                    {/* Left Column: Info & Image */}
                    <Grid item xs={12} md={7}>
                        <Stack spacing={3}>
                            <Card sx={{ p: 3, borderRadius: 3, boxShadow: 1 }}>
                                <Typography variant="h4" fontWeight="bold" gutterBottom>
                                    {issue.title}
                                </Typography>
                                <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2, flexWrap: 'wrap' }}>
                                    <Chip label={currentStatus} color={statusColors[currentStatus] || 'default'} />
                                    <Chip label={`Priority: ${issue.priority}`} color={issue.priority === 'Critical' ? 'error' : issue.priority === 'High' ? 'warning' : 'default'} variant="outlined" />
                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                                        <CalendarToday fontSize="small" sx={{ mr: 0.5 }} />
                                        {issue.date ? format(new Date(issue.date), "PPpp") : 'N/A'}
                                    </Typography>
                                </Box>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" gutterBottom>Description</Typography>
                                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                                    {issue.description}
                                </Typography>

                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="subtitle2" gutterBottom>Update Status</Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {statusOptions.map(status => (
                                            <Chip
                                                key={status}
                                                label={status}
                                                onClick={() => handleStatusClick(status)}
                                                variant={currentStatus === status ? "filled" : "outlined"}
                                                color={currentStatus === status ? (statusColors[status] || 'primary') : 'default'}
                                                sx={{ cursor: 'pointer' }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            </Card>

                            {issue.images && issue.images.length > 0 ? (
                                <Card sx={{ p: 3, borderRadius: 3, boxShadow: 1 }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>Attached Image</Typography>
                                    <Box
                                        component="img"
                                        src={issue.images[0]}
                                        alt="Issue"
                                        sx={{
                                            width: "100%",
                                            borderRadius: 2,
                                            maxHeight: 500,
                                            objectFit: "contain",
                                            bgcolor: '#00000005'
                                        }}
                                    />
                                </Card>
                            ) : (
                                <Alert severity="info" variant="outlined">No image attached to this issue.</Alert>
                            )}
                        </Stack>
                    </Grid>

                    {/* Right Column: Location & Actions */}
                    <Grid item xs={12} md={5}>
                        <Stack spacing={3}>
                            <Card sx={{ p: 3, borderRadius: 3, boxShadow: 1 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <LocationOn color="primary" sx={{ mr: 1 }} />
                                    Location Details
                                </Typography>
                                <Divider sx={{ mb: 2 }} />

                                <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                                <Typography variant="body1" paragraph>{issueAddress}</Typography>

                                {issueLat && (
                                    <>
                                        <Typography variant="subtitle2" color="text.secondary">Coordinates</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                            <Typography variant="body2" fontFamily="monospace" sx={{ bgcolor: 'grey.100', p: 0.5, borderRadius: 1 }}>
                                                {issueLat.toFixed(6)}, {issueLng.toFixed(6)}
                                            </Typography>
                                            <Tooltip title="Copy">
                                                <IconButton size="small" onClick={copyCoordinates}><CopyAll fontSize="small" /></IconButton>
                                            </Tooltip>
                                        </Box>
                                    </>
                                )}

                                {distance && (
                                    <Alert severity="success" icon={<Straighten />} sx={{ mb: 0 }}>
                                        <Typography fontWeight="bold">
                                            {distance} from your location
                                        </Typography>
                                    </Alert>
                                )}
                            </Card>

                            <Card sx={{ p: 3, borderRadius: 3, boxShadow: 1 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>Actions</Typography>
                                <Stack spacing={2}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<GpsFixed />}
                                        onClick={getUserLocation}
                                        disabled={loadingLocation}
                                    >
                                        {userLocation ? "Update My Location" : "Get My Location"}
                                    </Button>

                                    {issueLat && (
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            fullWidth
                                            startIcon={<Directions />}
                                            onClick={openDirections}
                                        >
                                            Get Directions
                                        </Button>
                                    )}
                                </Stack>
                            </Card>

                            {/* Mini Map */}
                            {osmEmbedUrl && (
                                <Card sx={{ borderRadius: 3, overflow: 'hidden', height: 300, boxShadow: 1 }}>
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        src={osmEmbedUrl}
                                        title="Issue Location"
                                    />
                                </Card>
                            )}
                        </Stack>
                    </Grid>
                </Grid>
            </DialogContent>

            {/* Notifications */}
            <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}>
                {copySuccess && <Alert severity="success" sx={{ mb: 1, boxShadow: 3 }}>{copySuccess}</Alert>}
                {locationError && <Alert severity="error" sx={{ boxShadow: 3 }}>{locationError}</Alert>}
            </Box>

        </Dialog>
    );
};

let loadingLocation = false;

export default AdminIssueDetailsDialog;
