import React, { useState, useMemo } from 'react';
import axios from 'axios';
import AdminIssueTable from '../../components/admin/AdminIssueTable';
import AdminIssueDetailsDialog from '../../components/admin/AdminIssueDetailsDialog';
import {
  Box,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Chip,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  Tabs,
  Tab,
  Alert,
  Grid,
  Menu,
  ListItemText
} from '@mui/material';
import {
  CheckCircleOutline,
  PendingActions,
  Build,
  Warning,
  FilterList,
  Refresh,
  Logout,
  Search,
  Assignment,
  Send,
  Notifications,
  BarChart as BarChartIcon,
  Map as MapIcon,
  Assessment,
  People,
  Email,
  AttachFile,
  LocationOn,
  MedicalServices,
  LocalHospital,
  HealthAndSafety,
  Coronavirus,
  Sanitizer,
  Vaccine
} from '@mui/icons-material';
// import { DataGrid } from '@mui/x-data-grid'; // Removed
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const statusOptions = ['Pending', 'In Process', 'Assigned', 'Solved', 'Rejected'];
const priorityLevels = ['Low', 'Medium', 'High', 'Critical'];

const statusColors = {
  'Pending': '#ff9800',
  'In Process': '#2196f3',
  'Assigned': '#9c27b0',
  'Solved': '#4caf50',
  'Rejected': '#f44336'
};

const priorityColors = {
  'Low': '#4caf50',
  'Medium': '#ffc107',
  'High': '#ff9800',
  'Critical': '#f44336'
};

// Health-specific map issues
const healthMapIssues = [
  {
    id: 1,
    category: 'Public Health',
    position: [18.5310, 73.8446],
    title: 'Mosquito breeding',
    description: 'Stagnant water near Shivajinagar causing dengue risk.',
  },
  {
    id: 2,
    category: 'Public Health',
    position: [18.5402, 73.8555],
    title: 'Clinic shortage',
    description: 'No doctors available in Deccan clinic.',
  },
  {
    id: 3,
    category: 'Public Health',
    position: [18.5910, 73.8215],
    title: 'Dengue cases rising',
    description: 'High mosquito density near Yerwada.',
  },
  {
    id: 4,
    category: 'Public Health',
    position: [18.5201, 73.9125],
    title: 'Sewage overflow',
    description: 'Open sewage water in Kalyani Nagar.',
  },
  {
    id: 5,
    category: 'Public Health',
    position: [18.5145, 73.8451],
    title: 'Garbage pile up',
    description: 'Uncollected garbage causing health hazards.',
  },
  {
    id: 6,
    category: 'Public Health',
    position: [18.5603, 73.8065],
    title: 'Water contamination',
    description: 'Residents reporting water-borne diseases.',
  },
  {
    id: 7,
    category: 'Public Health',
    position: [18.4967, 73.8627],
    title: 'Flu outbreak',
    description: 'Multiple cases reported in Kothrud area.',
  },
  {
    id: 8,
    category: 'Public Health',
    position: [18.5074, 73.8077],
    title: 'Sanitation issue',
    description: 'Poor sanitation in slum area.',
  },
  {
    id: 9,
    category: 'Public Health',
    position: [18.6186, 73.8037],
    title: 'Medical camp needed',
    description: 'Remote area lacks healthcare access.',
  },
  {
    id: 10,
    category: 'Public Health',
    position: [18.6500, 73.7665],
    title: 'Vaccination drive',
    description: 'Low vaccination rates in Baner area.',
  },
];

// Health icon for map
const healthIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/128/2382/2382461.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const HealthDashboard = ({ onLogout }) => {
  const [healthIssues, setHealthIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/user/getallissue?department=PublicHealth');
      if (data.success) {
        const mappedIssues = data.issues.map(issue => ({
          id: issue._id,
          title: issue.title,
          description: issue.description,
          location: {
            address: issue.address || "No address",
            coordinates: issue.location?.coordinates || [0, 0]
          },
          category: issue.department || 'PublicHealth',
          status: issue.status,
          priority: issue.priority,
          date: issue.createdAt,
          reporter: issue.createdBy || { name: 'Unknown', email: '' },
          images: issue.image ? [issue.image] : []
        }));
        setHealthIssues(mappedIssues);
      }
    } catch (error) {
      console.error("Failed to fetch issues", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchIssues();
  }, []);

  const [selectedIssues, setSelectedIssues] = useState([]);
  const [filters, setFilters] = useState({
    status: [],
    priority: [],
    dateRange: [null, null],
    searchQuery: ''
  });
  const [bulkAction, setBulkAction] = useState('');
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState('overview');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showIssueDetails, setShowIssueDetails] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('email');



  const handleStatusChange = (id, newStatus) => {
    // In a real app you'd call an API here.
    showSnackbar('Status updated successfully', 'success');
  };

  const handleBulkAction = () => {
    if (!bulkAction || selectedIssues.length === 0) return;
    setShowBulkDialog(false);
    setSelectedIssues([]);
    showSnackbar(`Updated status for ${selectedIssues.length} issues`, 'success');
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleRowSelection = (newSelection) => {
    setSelectedIssues(newSelection);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Health department stats data
  const statusData = useMemo(() => [
    { name: 'Pending', value: healthIssues.filter(issue => issue.status === 'Pending').length },
    { name: 'In Process', value: healthIssues.filter(issue => issue.status === 'In Process').length },
    { name: 'Assigned', value: healthIssues.filter(issue => issue.status === 'Assigned').length },
    { name: 'Solved', value: healthIssues.filter(issue => issue.status === 'Solved').length },
    { name: 'Rejected', value: healthIssues.filter(issue => issue.status === 'Rejected').length },
  ], [healthIssues]);

  const categoryData = useMemo(() => {
    const categories = {};
    healthIssues.forEach(issue => {
      categories[issue.category] = (categories[issue.category] || 0) + 1;
    });
    return Object.keys(categories).map(cat => ({
      name: cat,
      count: categories[cat]
    }));
  }, [healthIssues]);

  // Health department stats
  const healthStats = [
    { title: 'Total Reports', value: healthIssues.length, icon: Warning, color: '#d32f2f' },
    { title: 'Pending', value: healthIssues.filter(issue => issue.status === 'Pending').length, icon: PendingActions, color: '#ff9800' },
    { title: 'In Progress', value: healthIssues.filter(issue => issue.status === 'In Process').length, icon: Build, color: '#2196f3' },
    { title: 'Resolved', value: healthIssues.filter(issue => issue.status === 'Solved').length, icon: CheckCircleOutline, color: '#4caf50' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Public Health Department Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage disease control, healthcare access, sanitation, and public health emergencies
        </Typography>
      </Box>

      {/* Search and Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          placeholder="Search health reports..."
          variant="outlined"
          size="small"
          value={filters.searchQuery}
          onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          InputProps={{
            startAdornment: <Search color="action" sx={{ mr: 1 }} />,
            sx: { width: 300 }
          }}
        />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            Filters
          </Button>
          {selectedIssues.length > 0 && (
            <Button
              variant="outlined"
              startIcon={<Assignment />}
              onClick={() => setShowBulkDialog(true)}
            >
              Bulk Actions ({selectedIssues.length})
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={() => {
              setShowMessageDialog(true);
              setMessageType('email');
            }}
          >
            Send Update
          </Button>
        </Box>
      </Box>

      {/* Filter Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <Box sx={{ p: 2, width: 250 }}>
          <Typography variant="subtitle1" gutterBottom>Filters</Typography>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              multiple
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              renderValue={(selected) => selected.join(', ')}
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  <Checkbox checked={filters.status.includes(status)} />
                  <ListItemText primary={status} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              multiple
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              renderValue={(selected) => selected.join(', ')}
            >
              {priorityLevels.map((level) => (
                <MenuItem key={level} value={level}>
                  <Checkbox checked={filters.priority.includes(level)} />
                  <ListItemText primary={level} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="From Date"
              value={filters.dateRange[0]}
              onChange={(date) => handleFilterChange('dateRange', [date, filters.dateRange[1]])}
              renderInput={(params) => <TextField {...params} size="small" fullWidth sx={{ mb: 2 }} />}
            />
            <DatePicker
              label="To Date"
              value={filters.dateRange[1]}
              onChange={(date) => handleFilterChange('dateRange', [filters.dateRange[0], date])}
              renderInput={(params) => <TextField {...params} size="small" fullWidth />}
            />
          </LocalizationProvider>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              size="small"
              onClick={() => setFilters({
                status: [],
                priority: [],
                dateRange: [null, null],
                searchQuery: ''
              })}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => setAnchorEl(null)}
              sx={{ ml: 1 }}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Menu>

      {/* Stats Cards */}
      <Box sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        mb: 3
      }}>
        {healthStats.map((stat, index) => (
          <Card key={index} variant="outlined">
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h5">{stat.value}</Typography>
                  <Typography variant="body2" color="text.secondary">{stat.title}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: stat.color + '20', color: stat.color }}>
                  <stat.icon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Overview" value="overview" />
        <Tab label="Map View" value="map" />
        <Tab label="Analytics" value="analytics" />
        <Tab label="Team" value="team" />
      </Tabs>

      {/* Main Content */}
      {activeTab === 'overview' && (
        <>
          {/* Charts */}
          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, mb: 3 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Health Issues by Status</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={(entry) => `${entry.name}: ${entry.value}`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={statusColors[entry.name]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Issue Categories</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="count" fill="#d32f2f" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Box>

          {/* Issues Table */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>Recent Health Reports</Typography>
            <AdminIssueTable
              issues={healthIssues}
              onViewDetails={(issue) => {
                setSelectedIssue(issue);
                setShowIssueDetails(true);
              }}
            />
          </Box>

          <AdminIssueDetailsDialog
            open={showIssueDetails}
            onClose={() => setShowIssueDetails(false)}
            issue={selectedIssue}
            onStatusUpdate={(id, newStatus) => {
              handleStatusChange(id, newStatus);
              // Update local state if needed
              const updatedIssues = healthIssues.map(issue =>
                issue.id === id ? { ...issue, status: newStatus } : issue
              );
              setHealthIssues(updatedIssues);
              if (selectedIssue && selectedIssue.id === id) {
                setSelectedIssue({ ...selectedIssue, status: newStatus });
              }
            }}
          />

          {/* Bulk Action Dialog */}
          <Dialog open={showBulkDialog} onClose={() => setShowBulkDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Bulk Actions</DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                You have selected {selectedIssues.length} issues. What would you like to do with them?
              </Typography>
              <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
                <InputLabel>Action</InputLabel>
                <Select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  label="Action"
                >
                  <MenuItem value=""><em>Select an action</em></MenuItem>
                  <MenuItem value="In Process">Mark as In Process</MenuItem>
                  <MenuItem value="Assigned">Assign to Team</MenuItem>
                  <MenuItem value="Solved">Mark as Solved</MenuItem>
                  <MenuItem value="Rejected">Reject Selected</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowBulkDialog(false)}>Cancel</Button>
              <Button onClick={handleBulkAction} variant="contained" color="primary" disabled={!bulkAction}>
                Apply
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      {activeTab === 'map' && (
        <Paper sx={{ p: 3, height: '70vh', minHeight: 500 }}>
          <Typography variant="h6" gutterBottom>Health Issues Map View (Pune)</Typography>
          <Box sx={{ width: '100%', height: '60vh', position: 'relative', borderRadius: 2, overflow: 'hidden', boxShadow: 1 }}>
            <MapContainer center={[18.5204, 73.8567]} zoom={12} style={{ width: '100%', height: '100%' }} scrollWheelZoom={true}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {healthMapIssues.map(issue => (
                <Marker key={issue.id} position={issue.position} icon={healthIcon}>
                  <Popup>
                    <Typography variant="subtitle2">{issue.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{issue.description}</Typography>
                    <Typography variant="caption" color="primary">Category: {issue.category}</Typography>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Box>
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <img src={healthIcon.options.iconUrl} alt="Health" style={{ width: 24, height: 24 }} />
            <Typography variant="body2">Public Health Issues</Typography>
          </Box>
        </Paper>
      )}

      {activeTab === 'analytics' && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Health Department Analytics</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Response Time Analysis</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={[
                    { month: 'Jan', time: 36 },
                    { month: 'Feb', time: 24 },
                    { month: 'Mar', time: 48 },
                    { month: 'Apr', time: 18 },
                    { month: 'May', time: 30 },
                  ]}
                >
                  <XAxis dataKey="month" />
                  <YAxis label="Hours" />
                  <RechartsTooltip formatter={(value) => [`${value} hours`, 'Average Response Time']} />
                  <Bar dataKey="time" fill="#d32f2f" />
                </BarChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Monthly Health Reports</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={[
                    { month: 'Jan', disease: 8, sanitation: 5, access: 3 },
                    { month: 'Feb', disease: 6, sanitation: 4, access: 2 },
                    { month: 'Mar', disease: 10, sanitation: 7, access: 4 },
                    { month: 'Apr', disease: 7, sanitation: 6, access: 3 },
                    { month: 'May', disease: 9, sanitation: 5, access: 5 },
                  ]}
                >
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="disease" stroke="#d32f2f" name="Disease Control" />
                  <Line type="monotone" dataKey="sanitation" stroke="#2196f3" name="Sanitation" />
                  <Line type="monotone" dataKey="access" stroke="#4caf50" name="Healthcare Access" />
                </LineChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Priority Distribution</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={[
                    { priority: 'Critical', count: 4 },
                    { priority: 'High', count: 5 },
                    { priority: 'Medium', count: 3 },
                    { priority: 'Low', count: 1 },
                  ]}
                >
                  <XAxis dataKey="priority" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="count" fill="#ff9800" />
                </BarChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Area-wise Health Issues</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={[
                    { area: 'Shivajinagar', issues: 8 },
                    { area: 'Yerwada', issues: 6 },
                    { area: 'Kalyani Nagar', issues: 5 },
                    { area: 'Deccan', issues: 7 },
                    { area: 'Kothrud', issues: 4 },
                  ]}
                >
                  <XAxis dataKey="area" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="issues" fill="#9c27b0" />
                </BarChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </Paper>
      )}

      {activeTab === 'team' && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Public Health Department Team</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center' }}>
                  <People sx={{ fontSize: 40, color: '#d32f2f', mb: 1 }} />
                  <Typography variant="h5">68</Typography>
                  <Typography variant="body2">Health Workers</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center' }}>
                  <LocalHospital sx={{ fontSize: 40, color: '#d32f2f', mb: 1 }} />
                  <Typography variant="h5">15</Typography>
                  <Typography variant="body2">Health Centers</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center' }}>
                  <MedicalServices sx={{ fontSize: 40, color: '#d32f2f', mb: 1 }} />
                  <Typography variant="h5">28</Typography>
                  <Typography variant="body2">Doctors</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center' }}>
                  <CheckCircleOutline sx={{ fontSize: 40, color: '#d32f2f', mb: 1 }} />
                  <Typography variant="h5">94%</Typography>
                  <Typography variant="body2">Success Rate</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>Emergency Contacts & Resources</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>Health Emergency</Typography>
                    <Typography variant="body1">+91 9876543212</Typography>
                    <Typography variant="body2" color="text.secondary">24/7 Emergency Line</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>Control Room</Typography>
                    <Typography variant="body1">020-12345680</Typography>
                    <Typography variant="body2" color="text.secondary">8 AM - 8 PM</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>Active Health Programs</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" fontWeight="bold">Vaccination Drive</Typography>
                      <Typography variant="caption">COVID-19 & Influenza</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Coverage: 85%</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" fontWeight="bold">Mosquito Control</Typography>
                      <Typography variant="caption">Fogging & Larva Control</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Progress: 70%</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" fontWeight="bold">Health Camps</Typography>
                      <Typography variant="caption">Remote Area Coverage</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Progress: 60%</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Bulk Action Dialog */}
      <Dialog open={showBulkDialog} onClose={() => setShowBulkDialog(false)}>
        <DialogTitle>Bulk Actions</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Apply action to {selectedIssues.length} selected health issues:
          </Typography>
          <FormControl fullWidth>
            <Select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Select Action</MenuItem>
              <MenuItem value="In Process">Mark as In Process</MenuItem>
              <MenuItem value="Assigned">Assign to Health Team</MenuItem>
              <MenuItem value="Solved">Mark as Solved</MenuItem>
              <MenuItem value="Rejected">Reject Issues</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBulkDialog(false)}>Cancel</Button>
          <Button
            onClick={handleBulkAction}
            variant="contained"
            disabled={!bulkAction}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Issue Details Dialog */}
      <Dialog open={showIssueDetails} onClose={() => setShowIssueDetails(false)} maxWidth="sm" fullWidth>
        {selectedIssue && (
          <>
            <DialogTitle>{selectedIssue.title}</DialogTitle>
            <DialogContent>
              <Typography gutterBottom>{selectedIssue.description}</Typography>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip
                    label={selectedIssue.status}
                    size="small"
                    sx={{
                      bgcolor: statusColors[selectedIssue.status] + '20',
                      color: statusColors[selectedIssue.status]
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Priority</Typography>
                  <Chip
                    label={selectedIssue.priority}
                    size="small"
                    sx={{
                      bgcolor: priorityColors[selectedIssue.priority] + '20',
                      color: priorityColors[selectedIssue.priority]
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Location</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography>{selectedIssue.location.address}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Category</Typography>
                  <Typography>{selectedIssue.category}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Reporter</Typography>
                  <Typography>{selectedIssue.reporter.name} ({selectedIssue.reporter.email})</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Reported Date</Typography>
                  <Typography>{new Date(selectedIssue.date).toLocaleDateString()}</Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>Update Status</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {statusOptions.map((status) => (
                    <Button
                      key={status}
                      variant={selectedIssue.status === status ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => {
                        handleStatusChange(selectedIssue.id, status);
                        setSelectedIssue({ ...selectedIssue, status });
                      }}
                    >
                      {status}
                    </Button>
                  ))}
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowIssueDetails(false)}>Close</Button>
              <Button
                variant="contained"
                onClick={() => {
                  setShowMessageDialog(true);
                  setMessageType('email');
                  setShowIssueDetails(false);
                }}
              >
                Contact Reporter
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={showMessageDialog} onClose={() => setShowMessageDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Message</DialogTitle>
        <DialogContent>
          <TextField
            label="Subject"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Message"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMessageDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              setShowMessageDialog(false);
              showSnackbar('Message sent successfully', 'success');
            }}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      {snackbar.open && (
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ position: 'fixed', bottom: 20, right: 20, minWidth: 300 }}
        >
          {snackbar.message}
        </Alert>
      )}
    </Box>
  );
};

export default HealthDashboard;