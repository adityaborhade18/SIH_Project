import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent,
    Typography, Box, Divider,
    Button, IconButton, Alert, Chip,
    Stack, Tooltip, Paper
} from '@mui/material';
import {
    CalendarToday, LocationOn,
    CopyAll, Navigation, GpsFixed, Straighten,
    Close, Directions
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
    const [locationError, setLocationError] = useState('');
    const [copySuccess, setCopySuccess] = useState('');
    const [currentStatus, setCurrentStatus] = useState(issue?.status);
    const [loadingLocation, setLoadingLocation] = useState(false);

    useEffect(() => {
        if (issue) setCurrentStatus(issue.status);
    }, [issue]);

    const issueCoordinates = issue?.location?.coordinates || [];
    const issueLat = issueCoordinates[1];
    const issueLng = issueCoordinates[0];
    const issueAddress = issue?.location?.address || 'Unknown Location';

    const osmEmbedUrl = issueLat
        ? `https://www.openstreetmap.org/export/embed.html?bbox=${issueLng - 0.01},${issueLat - 0.01},${issueLng + 0.01},${issueLat + 0.01}&marker=${issueLat}%2C${issueLng}`
        : null;

    const getUserLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser');
            return;
        }
        setLocationError('');
        setLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setCopySuccess('✅ Location detected successfully!');
                setTimeout(() => setCopySuccess(''), 3000);
                setLoadingLocation(false);
            },
            (error) => {
                setLocationError('Unable to fetch your location: ' + error.message);
                setTimeout(() => setLocationError(''), 5000);
                setLoadingLocation(false);
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
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
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
            '_blank'
        );
    };

    const copyCoordinates = () => {
        navigator.clipboard.writeText(`${issueLat?.toFixed(6)}, ${issueLng?.toFixed(6)}`);
        setCopySuccess('Coordinates copied!');
        setTimeout(() => setCopySuccess(''), 2000);
    };

    const handleStatusClick = (newStatus) => {
        setCurrentStatus(newStatus);
        if (onStatusUpdate) onStatusUpdate(issue.id, newStatus);
    };

    if (!issue) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            scroll="paper"
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    maxHeight: '90vh',
                }
            }}
        >
            {/* Dialog Header */}
            <DialogTitle
                sx={{
                    m: 0,
                    px: 3,
                    py: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                }}
            >
                <Box>
                    <Typography variant="h5" component="div" fontWeight="bold">
                        Issue Details
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        #{issue.id?.slice(-8).toUpperCase()}
                    </Typography>
                </Box>
                <IconButton aria-label="close" onClick={onClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent
                dividers
                sx={{
                    p: 0,
                    bgcolor: '#f8fafc',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Two-column layout using CSS Grid */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' },
                        gap: 0,
                        flex: 1,
                        minHeight: 0,
                        overflow: { xs: 'auto', md: 'hidden' },
                    }}
                >
                    {/* ── LEFT COLUMN ── */}
                    <Box
                        sx={{
                            p: 3,
                            overflowY: 'auto',
                            borderRight: { md: '1px solid' },
                            borderColor: { md: 'divider' },
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2.5,
                        }}
                    >
                        {/* Title & Meta */}
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                {issue.title}
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                                <Chip
                                    label={currentStatus}
                                    color={statusColors[currentStatus] || 'default'}
                                    size="small"
                                />
                                <Chip
                                    label={`Priority: ${issue.priority || 'N/A'}`}
                                    color={
                                        issue.priority === 'Critical' ? 'error' :
                                            issue.priority === 'High' ? 'warning' : 'default'
                                    }
                                    variant="outlined"
                                    size="small"
                                />
                                {issue.category && (
                                    <Chip label={issue.category} variant="outlined" size="small" color="primary" />
                                )}
                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
                                    <CalendarToday fontSize="inherit" />
                                    {issue.date ? format(new Date(issue.date), 'PPpp') : 'N/A'}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                                Description
                            </Typography>
                            <Typography variant="body1" sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
                                {issue.description || 'No description provided.'}
                            </Typography>
                        </Paper>

                        {/* Status Update */}
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                                Update Status
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                                {statusOptions.map(status => (
                                    <Chip
                                        key={status}
                                        label={status}
                                        onClick={() => handleStatusClick(status)}
                                        variant={currentStatus === status ? 'filled' : 'outlined'}
                                        color={currentStatus === status ? (statusColors[status] || 'primary') : 'default'}
                                        sx={{ cursor: 'pointer', fontWeight: currentStatus === status ? 600 : 400 }}
                                    />
                                ))}
                            </Box>
                        </Paper>

                        {/* Attached Image */}
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                                Attached Image
                            </Typography>
                            {issue.images && issue.images.length > 0 ? (
                                <Box
                                    component="img"
                                    src={issue.images[0]}
                                    alt="Issue"
                                    sx={{
                                        width: '100%',
                                        borderRadius: 2,
                                        maxHeight: 360,
                                        objectFit: 'contain',
                                        bgcolor: '#00000008',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        mt: 1,
                                    }}
                                />
                            ) : (
                                <Alert severity="info" variant="outlined" sx={{ mt: 1 }}>
                                    No image attached to this issue.
                                </Alert>
                            )}
                        </Paper>
                    </Box>

                    {/* ── RIGHT COLUMN ── */}
                    <Box
                        sx={{
                            p: 3,
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2.5,
                            bgcolor: '#f8fafc',
                        }}
                    >
                        {/* Location Details */}
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="subtitle1" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationOn color="primary" fontSize="small" />
                                Location Details
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                ADDRESS
                            </Typography>
                            <Typography variant="body2" paragraph sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                                <LocationOn color="action" sx={{ fontSize: 16, mt: 0.3, flexShrink: 0 }} />
                                {issueAddress}
                            </Typography>

                            {issueLat && (
                                <>
                                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                        COORDINATES
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <Typography
                                            variant="body2"
                                            fontFamily="monospace"
                                            sx={{ bgcolor: 'grey.100', px: 1, py: 0.5, borderRadius: 1, flex: 1, fontSize: '0.75rem' }}
                                        >
                                            {issueLat.toFixed(6)}, {issueLng.toFixed(6)}
                                        </Typography>
                                        <Tooltip title="Copy coordinates">
                                            <IconButton size="small" onClick={copyCoordinates} color="primary">
                                                <CopyAll fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </>
                            )}

                            {distance && (
                                <Alert severity="success" icon={<Straighten />} sx={{ borderRadius: 2 }}>
                                    <Typography variant="body2" fontWeight="bold">
                                        {distance} from your location
                                    </Typography>
                                </Alert>
                            )}
                        </Paper>

                        {/* Quick Actions */}
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                                Quick Actions
                            </Typography>
                            <Stack spacing={1.5}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    startIcon={<GpsFixed />}
                                    onClick={getUserLocation}
                                    disabled={loadingLocation}
                                    size="medium"
                                >
                                    {loadingLocation
                                        ? 'Detecting...'
                                        : userLocation
                                            ? 'Update My Location'
                                            : 'Get My Location'}
                                </Button>

                                {issueLat && (
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        fullWidth
                                        startIcon={<Directions />}
                                        onClick={openDirections}
                                        size="medium"
                                    >
                                        Get Directions
                                    </Button>
                                )}
                            </Stack>
                        </Paper>

                        {/* Map */}
                        {osmEmbedUrl ? (
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    flex: 1,
                                    minHeight: 260,
                                }}
                            >
                                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                                    <Typography variant="subtitle1" fontWeight="600">
                                        Location Map
                                    </Typography>
                                </Box>
                                <iframe
                                    width="100%"
                                    height="260"
                                    frameBorder="0"
                                    src={osmEmbedUrl}
                                    title="Issue Location"
                                    style={{ display: 'block' }}
                                />
                            </Paper>
                        ) : (
                            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                                <Typography color="text.secondary" variant="body2">
                                    📍 No GPS data available for this issue.
                                </Typography>
                            </Paper>
                        )}
                    </Box>
                </Box>
            </DialogContent>

            {/* Toast Notifications */}
            <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {copySuccess && (
                    <Alert severity="success" sx={{ boxShadow: 4, borderRadius: 2 }}>
                        {copySuccess}
                    </Alert>
                )}
                {locationError && (
                    <Alert severity="error" sx={{ boxShadow: 4, borderRadius: 2 }}>
                        {locationError}
                    </Alert>
                )}
            </Box>
        </Dialog>
    );
};

export default AdminIssueDetailsDialog;
