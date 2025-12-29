import React, { useState, useMemo } from 'react';
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
  Search,
  Assignment,
  Send,
  Notifications,
  BarChart as BarChartIcon,
  Map as MapIcon,
  Assessment,
  People,
  WaterDrop,
  Email,
  AttachFile,
  LocationOn
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
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

// Water-specific map issues
const waterMapIssues = [
  {
    id: 1,
    category: 'Water Supply',
    position: [18.4967, 73.8627],
    title: 'Water shortage',
    description: 'Low water pressure in Kothrud.',
  },
  {
    id: 2,
    category: 'Water Supply',
    position: [18.5821, 73.8931],
    title: 'Pipeline leakage',
    description: 'Water pipeline burst near Hadapsar.',
  },
  {
    id: 3,
    category: 'Water Supply',
    position: [18.5705, 73.8675],
    title: 'No water supply',
    description: 'Residents of Koregaon Park reporting no water.',
  },
  {
    id: 4,
    category: 'Water Supply',
    position: [18.4954, 73.8257],
    title: 'Contaminated water',
    description: 'Water smells bad in Parvati area.',
  },
  {
    id: 5,
    category: 'Water Supply',
    position: [18.5204, 73.8567],
    title: 'Low water pressure',
    description: 'Residents complaining about weak water flow.',
  },
  {
    id: 6,
    category: 'Water Supply',
    position: [18.5314, 73.8446],
    title: 'Water tanker required',
    description: 'Area facing acute water shortage.',
  },
  {
    id: 7,
    category: 'Water Supply',
    position: [18.5074, 73.8477],
    title: 'Broken water pipe',
    description: 'Water wastage on main road.',
  },
  {
    id: 8,
    category: 'Water Supply',
    position: [18.5603, 73.8165],
    title: 'Irregular water timings',
    description: 'Water supply timings not consistent.',
  },
  {
    id: 9,
    category: 'Water Supply',
    position: [18.6186, 73.8237],
    title: 'Water quality issue',
    description: 'Residents reporting muddy water.',
  },
  {
    id: 10,
    category: 'Water Supply',
    position: [18.6500, 73.7765],
    title: 'Overhead tank leakage',
    description: 'Society tank leaking continuously.',
  },
];

// Water icon for map
const waterIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/128/4497/4497450.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const WaterDashboard = () => {
  // Dummy water issues data
  const waterIssues = [
    {
      id: 1,
      title: 'Water shortage in Kothrud',
      description: 'Low water pressure in Kothrud area for 3 days.',
      location: { address: 'Kothrud, Pune', coordinates: [18.4967, 73.8627] },
      category: 'Water Supply',
      status: 'Pending',
      priority: 'High',
      date: new Date().toISOString(),
      reporter: { name: 'Rajesh Kumar', email: 'rajesh@example.com' },
      images: [],
    },
    {
      id: 2,
      title: 'Pipeline leakage',
      description: 'Water pipeline burst near Hadapsar market.',
      location: { address: 'Hadapsar, Pune', coordinates: [18.5821, 73.8931] },
      category: 'Water Supply',
      status: 'Assigned',
      priority: 'Critical',
      date: new Date().toISOString(),
      reporter: { name: 'Meena Sharma', email: 'meena@example.com' },
      images: [],
    },
    {
      id: 3,
      title: 'No water in Koregaon Park',
      description: 'Residents reporting no water supply since yesterday.',
      location: { address: 'Koregaon Park, Pune', coordinates: [18.5705, 73.8675] },
      category: 'Water Supply',
      status: 'In Process',
      priority: 'High',
      date: new Date().toISOString(),
      reporter: { name: 'Amit Patel', email: 'amit@example.com' },
      images: [],
    },
    {
      id: 4,
      title: 'Contaminated water in Parvati',
      description: 'Water has foul smell and color in Parvati area.',
      location: { address: 'Parvati, Pune', coordinates: [18.4954, 73.8257] },
      category: 'Water Supply',
      status: 'Solved',
      priority: 'Medium',
      date: new Date().toISOString(),
      reporter: { name: 'Priya Singh', email: 'priya@example.com' },
      images: [],
    },
    {
      id: 5,
      title: 'Low water pressure in FC Road',
      description: 'Weak water flow in apartment buildings.',
      location: { address: 'FC Road, Pune', coordinates: [18.5204, 73.8567] },
      category: 'Water Supply',
      status: 'Pending',
      priority: 'Medium',
      date: new Date().toISOString(),
      reporter: { name: 'Rahul Verma', email: 'rahul@example.com' },
      images: [],
    },
    {
      id: 6,
      title: 'Water tanker requirement',
      description: 'Area facing acute water shortage, needs immediate tanker.',
      location: { address: 'Shivajinagar, Pune', coordinates: [18.5314, 73.8446] },
      category: 'Water Supply',
      status: 'Assigned',
      priority: 'Critical',
      date: new Date().toISOString(),
      reporter: { name: 'Sneha Reddy', email: 'sneha@example.com' },
      images: [],
    },
  ];

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

  // Filter issues
  const filteredIssues = useMemo(() => {
    return waterIssues.filter(issue => {
      if (filters.searchQuery && !`${issue.title} ${issue.description} ${issue.location.address}`.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }
      if (filters.status.length > 0 && !filters.status.includes(issue.status)) {
        return false;
      }
      if (filters.priority.length > 0 && !filters.priority.includes(issue.priority)) {
        return false;
      }
      if (filters.dateRange[0] && new Date(issue.date) < filters.dateRange[0]) {
        return false;
      }
      if (filters.dateRange[1] && new Date(issue.date) > filters.dateRange[1]) {
        return false;
      }
      return true;
    });
  }, [waterIssues, filters]);

  const handleStatusChange = (id, newStatus) => {
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

  // Water department stats data
  const statusData = useMemo(() => [
    { name: 'Pending', value: waterIssues.filter(issue => issue.status === 'Pending').length },
    { name: 'In Process', value: waterIssues.filter(issue => issue.status === 'In Process').length },
    { name: 'Assigned', value: waterIssues.filter(issue => issue.status === 'Assigned').length },
    { name: 'Solved', value: waterIssues.filter(issue => issue.status === 'Solved').length },
    { name: 'Rejected', value: waterIssues.filter(issue => issue.status === 'Rejected').length },
  ], [waterIssues]);

  const priorityData = useMemo(() => [
    { priority: 'Critical', count: waterIssues.filter(i => i.priority === 'Critical').length },
    { priority: 'High', count: waterIssues.filter(i => i.priority === 'High').length },
    { priority: 'Medium', count: waterIssues.filter(i => i.priority === 'Medium').length },
    { priority: 'Low', count: waterIssues.filter(i => i.priority === 'Low').length },
  ], [waterIssues]);

  // Columns for DataGrid
  const columns = [
    { 
      field: 'date', 
      headerName: 'Date', 
      width: 120,
      renderCell: (params) => new Date(params.value).toLocaleDateString()
    },
    { 
      field: 'title', 
      headerName: 'Issue', 
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="500">{params.value}</Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.description.substring(0, 60)}...
          </Typography>
        </Box>
      )
    },
    { 
      field: 'priority', 
      headerName: 'Priority', 
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            backgroundColor: priorityColors[params.value] + '20',
            color: priorityColors[params.value],
            fontWeight: 500,
            width: '80px'
          }}
        />
      )
    },
    { 
      field: 'location', 
      headerName: 'Location', 
      width: 150,
      renderCell: (params) => params.value.address.split(',')[0]
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Select
          value={params.value}
          onChange={(e) => handleStatusChange(params.id, e.target.value)}
          size="small"
          sx={{ 
            width: '100%',
            '& .MuiSelect-select': { py: 0.5 }
          }}
        >
          {statusOptions.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      ),
    },
  ];

  // Water department stats
  const waterStats = [
    { title: 'Total Reports', value: waterIssues.length, icon: Warning, color: '#2196f3' },
    { title: 'Pending', value: waterIssues.filter(issue => issue.status === 'Pending').length, icon: PendingActions, color: '#ff9800' },
    { title: 'In Progress', value: waterIssues.filter(issue => issue.status === 'In Process').length, icon: Build, color: '#9c27b0' },
    { title: 'Resolved', value: waterIssues.filter(issue => issue.status === 'Solved').length, icon: CheckCircleOutline, color: '#4caf50' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Water Department Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage water supply, pipeline issues, and water quality complaints
        </Typography>
      </Box>

      {/* Search and Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          placeholder="Search water reports..."
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
        {waterStats.map((stat, index) => (
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
              <Typography variant="h6" gutterBottom>Water Issues by Status</Typography>
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
              <Typography variant="h6" gutterBottom>Priority Distribution</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="priority" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="count" fill="#2196f3" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Box>

          {/* Issues Table */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Recent Water Reports</Typography>
            <DataGrid
              rows={filteredIssues}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
              onSelectionModelChange={handleRowSelection}
              selectionModel={selectedIssues}
              onRowClick={(params) => {
                setSelectedIssue(params.row);
                setShowIssueDetails(true);
              }}
              sx={{ 
                border: 'none',
                '& .MuiDataGrid-row:hover': { cursor: 'pointer' }
              }}
            />
          </Paper>
        </>
      )}

      {activeTab === 'map' && (
        <Paper sx={{ p: 3, height: '70vh', minHeight: 500 }}>
          <Typography variant="h6" gutterBottom>Water Issues Map View (Pune)</Typography>
          <Box sx={{ width: '100%', height: '60vh', position: 'relative', borderRadius: 2, overflow: 'hidden', boxShadow: 1 }}>
            <MapContainer center={[18.5204, 73.8567]} zoom={12} style={{ width: '100%', height: '100%' }} scrollWheelZoom={true}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {waterMapIssues.map(issue => (
                <Marker key={issue.id} position={issue.position} icon={waterIcon}>
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
            <img src={waterIcon.options.iconUrl} alt="Water" style={{ width: 24, height: 24 }} />
            <Typography variant="body2">Water Supply Issues</Typography>
          </Box>
        </Paper>
      )}

      {activeTab === 'analytics' && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Water Department Analytics</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Response Time Trend</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={[
                    { month: 'Jan', time: 24 },
                    { month: 'Feb', time: 18 },
                    { month: 'Mar', time: 22 },
                    { month: 'Apr', time: 15 },
                    { month: 'May', time: 20 },
                  ]}
                >
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="time" fill="#2196f3" />
                </BarChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Monthly Reports</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={[
                    { month: 'Jan', reported: 8, resolved: 5 },
                    { month: 'Feb', reported: 6, resolved: 4 },
                    { month: 'Mar', reported: 10, resolved: 7 },
                    { month: 'Apr', reported: 7, resolved: 6 },
                    { month: 'May', reported: 9, resolved: 7 },
                  ]}
                >
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="reported" stroke="#2196f3" />
                  <Line type="monotone" dataKey="resolved" stroke="#4caf50" />
                </LineChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Issue Types</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={[
                    { type: 'Shortage', count: 12 },
                    { type: 'Pipeline', count: 8 },
                    { type: 'Quality', count: 5 },
                    { type: 'Pressure', count: 7 },
                    { type: 'Other', count: 3 },
                  ]}
                >
                  <XAxis dataKey="type" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="count" fill="#2196f3" />
                </BarChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Area-wise Distribution</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={[
                    { area: 'Kothrud', issues: 8 },
                    { area: 'Hadapsar', issues: 6 },
                    { area: 'Koregaon', issues: 5 },
                    { area: 'Shivaji', issues: 7 },
                    { area: 'FC Road', issues: 4 },
                  ]}
                >
                  <XAxis dataKey="area" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="issues" fill="#4caf50" />
                </BarChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </Paper>
      )}

      {activeTab === 'team' && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Water Department Team</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center' }}>
                  <People sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
                  <Typography variant="h5">32</Typography>
                  <Typography variant="body2">Team Members</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center' }}>
                  <WaterDrop sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
                  <Typography variant="h5">8</Typography>
                  <Typography variant="body2">Water Tankers</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center' }}>
                  <Build sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
                  <Typography variant="h5">15</Typography>
                  <Typography variant="body2">Repair Teams</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center' }}>
                  <CheckCircleOutline sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
                  <Typography variant="h5">92%</Typography>
                  <Typography variant="body2">Efficiency Rate</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>Team Contact</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>Emergency Contact</Typography>
                    <Typography variant="body1">+91 9876543210</Typography>
                    <Typography variant="body2" color="text.secondary">Available 24/7</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>Control Room</Typography>
                    <Typography variant="body1">020-12345678</Typography>
                    <Typography variant="body2" color="text.secondary">9 AM - 6 PM</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}

      {/* Bulk Action Dialog */}
      <Dialog open={showBulkDialog} onClose={() => setShowBulkDialog(false)}>
        <DialogTitle>Bulk Actions</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Apply action to {selectedIssues.length} selected water issues:
          </Typography>
          <FormControl fullWidth>
            <Select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Select Action</MenuItem>
              <MenuItem value="In Process">Mark as In Process</MenuItem>
              <MenuItem value="Assigned">Assign to Team</MenuItem>
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

export default WaterDashboard;