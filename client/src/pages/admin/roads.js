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
  Email,
  AttachFile,
  LocationOn,
  Road,
  Traffic,
  Streetview,
  Construction,
  Warning as WarningIcon
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

// Roads-specific map issues
const roadsMapIssues = [
  {
    id: 1,
    category: 'Roads & Transport',
    position: [18.5074, 73.8077],
    title: 'Potholes on road',
    description: 'Large potholes on Baner Road causing accidents.',
  },
  {
    id: 2,
    category: 'Roads & Transport',
    position: [18.5603, 73.8065],
    title: 'Broken streetlight',
    description: 'Streetlights not working on Aundh Road.',
  },
  {
    id: 3,
    category: 'Roads & Transport',
    position: [18.4965, 73.9447],
    title: 'Traffic light not working',
    description: 'Signal broken at Magarpatta crossing.',
  },
  {
    id: 4,
    category: 'Roads & Transport',
    position: [18.4751, 73.8680],
    title: 'Damaged bridge',
    description: 'Small bridge near Bibwewadi unsafe.',
  },
  {
    id: 5,
    category: 'Roads & Transport',
    position: [18.5300, 73.8050],
    title: 'Streetlights fused',
    description: 'Dark streets in Shivaji Nagar due to fused lights.',
  },
  {
    id: 6,
    category: 'Roads & Transport',
    position: [18.5204, 73.8567],
    title: 'Road cave-in',
    description: 'Road sinking near FC Road junction.',
  },
  {
    id: 7,
    category: 'Roads & Transport',
    position: [18.5310, 73.8446],
    title: 'Traffic congestion',
    description: 'Heavy traffic near Shivajinagar station.',
  },
  {
    id: 8,
    category: 'Roads & Transport',
    position: [18.5145, 73.8451],
    title: 'Damaged speed breaker',
    description: 'Speed breaker damaged causing vehicle damage.',
  },
  {
    id: 9,
    category: 'Roads & Transport',
    position: [18.4954, 73.8257],
    title: 'Missing road signs',
    description: 'No traffic signs in Parvati area.',
  },
  {
    id: 10,
    category: 'Roads & Transport',
    position: [18.5382, 73.8800],
    title: 'Road divider damaged',
    description: 'Concrete divider broken on Viman Nagar road.',
  },
];

// Roads icon for map
const roadsIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/128/2554/2554922.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const RoadsTransportDashboard = () => {
  // Dummy roads and transport issues data
  const roadsIssues = [
    {
      id: 1,
      title: 'Potholes on Baner Road',
      description: 'Large potholes causing accidents and vehicle damage.',
      location: { address: 'Baner Road, Pune', coordinates: [18.5074, 73.8077] },
      category: 'Road Damage',
      status: 'Pending',
      priority: 'Critical',
      date: new Date().toISOString(),
      reporter: { name: 'Vikram Singh', email: 'vikram@example.com' },
      images: [],
    },
    {
      id: 2,
      title: 'Broken streetlights on Aundh Road',
      description: 'Streetlights not working for 500 meters.',
      location: { address: 'Aundh Road, Pune', coordinates: [18.5603, 73.8065] },
      category: 'Street Lights',
      status: 'Assigned',
      priority: 'High',
      date: new Date().toISOString(),
      reporter: { name: 'Priya Sharma', email: 'priya@example.com' },
      images: [],
    },
    {
      id: 3,
      title: 'Traffic light malfunction',
      description: 'Signal not working at busy crossing.',
      location: { address: 'Magarpatta, Pune', coordinates: [18.4965, 73.9447] },
      category: 'Traffic Signals',
      status: 'In Process',
      priority: 'Critical',
      date: new Date().toISOString(),
      reporter: { name: 'Rahul Mehta', email: 'rahul@example.com' },
      images: [],
    },
    {
      id: 4,
      title: 'Damaged bridge near Bibwewadi',
      description: 'Bridge unsafe for heavy vehicles.',
      location: { address: 'Bibwewadi, Pune', coordinates: [18.4751, 73.8680] },
      category: 'Infrastructure',
      status: 'Solved',
      priority: 'High',
      date: new Date().toISOString(),
      reporter: { name: 'Anjali Patil', email: 'anjali@example.com' },
      images: [],
    },
    {
      id: 5,
      title: 'Streetlights fused in Shivaji Nagar',
      description: 'Area completely dark after 8 PM.',
      location: { address: 'Shivaji Nagar, Pune', coordinates: [18.5300, 73.8050] },
      category: 'Street Lights',
      status: 'Pending',
      priority: 'Medium',
      date: new Date().toISOString(),
      reporter: { name: 'Mohan Kumar', email: 'mohan@example.com' },
      images: [],
    },
    {
      id: 6,
      title: 'Road cave-in near FC Road',
      description: 'Road sinking, dangerous for commuters.',
      location: { address: 'FC Road, Pune', coordinates: [18.5204, 73.8567] },
      category: 'Road Damage',
      status: 'Assigned',
      priority: 'Critical',
      date: new Date().toISOString(),
      reporter: { name: 'Sneha Reddy', email: 'sneha@example.com' },
      images: [],
    },
    {
      id: 7,
      title: 'Heavy traffic congestion',
      description: 'Traffic jam near Shivajinagar station.',
      location: { address: 'Shivajinagar, Pune', coordinates: [18.5310, 73.8446] },
      category: 'Traffic Management',
      status: 'In Process',
      priority: 'High',
      date: new Date().toISOString(),
      reporter: { name: 'Rajesh Nair', email: 'rajesh@example.com' },
      images: [],
    },
    {
      id: 8,
      title: 'Damaged speed breaker',
      description: 'Speed breaker damaged causing vehicle damage.',
      location: { address: 'Swargate, Pune', coordinates: [18.5145, 73.8451] },
      category: 'Road Safety',
      status: 'Solved',
      priority: 'Medium',
      date: new Date().toISOString(),
      reporter: { name: 'Arun Joshi', email: 'arun@example.com' },
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
    return roadsIssues.filter(issue => {
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
  }, [roadsIssues, filters]);

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

  // Roads department stats data
  const statusData = useMemo(() => [
    { name: 'Pending', value: roadsIssues.filter(issue => issue.status === 'Pending').length },
    { name: 'In Process', value: roadsIssues.filter(issue => issue.status === 'In Process').length },
    { name: 'Assigned', value: roadsIssues.filter(issue => issue.status === 'Assigned').length },
    { name: 'Solved', value: roadsIssues.filter(issue => issue.status === 'Solved').length },
    { name: 'Rejected', value: roadsIssues.filter(issue => issue.status === 'Rejected').length },
  ], [roadsIssues]);

  const categoryData = useMemo(() => {
    const categories = {};
    roadsIssues.forEach(issue => {
      categories[issue.category] = (categories[issue.category] || 0) + 1;
    });
    return Object.keys(categories).map(cat => ({
      name: cat,
      count: categories[cat]
    }));
  }, [roadsIssues]);

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
            {params.row.category}
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

  // Roads department stats
  const roadsStats = [
    { title: 'Total Reports', value: roadsIssues.length, icon: Warning, color: '#ff5722' },
    { title: 'Pending', value: roadsIssues.filter(issue => issue.status === 'Pending').length, icon: PendingActions, color: '#ff9800' },
    { title: 'In Progress', value: roadsIssues.filter(issue => issue.status === 'In Process').length, icon: Build, color: '#2196f3' },
    { title: 'Resolved', value: roadsIssues.filter(issue => issue.status === 'Solved').length, icon: CheckCircleOutline, color: '#4caf50' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Roads & Transport Department Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage road repairs, traffic systems, street lights, and transport infrastructure
        </Typography>
      </Box>

      {/* Search and Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          placeholder="Search road and transport reports..."
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
        {roadsStats.map((stat, index) => (
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
              <Typography variant="h6" gutterBottom>Road Issues by Status</Typography>
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
                  <Bar dataKey="count" fill="#ff5722" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Box>

          {/* Issues Table */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Recent Road & Transport Reports</Typography>
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
          <Typography variant="h6" gutterBottom>Road Issues Map View (Pune)</Typography>
          <Box sx={{ width: '100%', height: '60vh', position: 'relative', borderRadius: 2, overflow: 'hidden', boxShadow: 1 }}>
            <MapContainer center={[18.5204, 73.8567]} zoom={12} style={{ width: '100%', height: '100%' }} scrollWheelZoom={true}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {roadsMapIssues.map(issue => (
                <Marker key={issue.id} position={issue.position} icon={roadsIcon}>
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
            <img src={roadsIcon.options.iconUrl} alt="Roads" style={{ width: 24, height: 24 }} />
            <Typography variant="body2">Roads & Transport Issues</Typography>
          </Box>
        </Paper>
      )}

      {activeTab === 'analytics' && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Roads Department Analytics</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Repair Time Analysis</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={[
                    { month: 'Jan', time: 48 },
                    { month: 'Feb', time: 36 },
                    { month: 'Mar', time: 42 },
                    { month: 'Apr', time: 24 },
                    { month: 'May', time: 30 },
                  ]}
                >
                  <XAxis dataKey="month" />
                  <YAxis label="Hours" />
                  <RechartsTooltip formatter={(value) => [`${value} hours`, 'Average Repair Time']} />
                  <Bar dataKey="time" fill="#ff5722" />
                </BarChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Monthly Reports Trend</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={[
                    { month: 'Jan', potholes: 8, lights: 5, traffic: 3 },
                    { month: 'Feb', potholes: 6, lights: 4, traffic: 2 },
                    { month: 'Mar', potholes: 10, lights: 7, traffic: 4 },
                    { month: 'Apr', potholes: 7, lights: 6, traffic: 3 },
                    { month: 'May', potholes: 9, lights: 5, traffic: 5 },
                  ]}
                >
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="potholes" stroke="#ff5722" name="Potholes" />
                  <Line type="monotone" dataKey="lights" stroke="#2196f3" name="Street Lights" />
                  <Line type="monotone" dataKey="traffic" stroke="#4caf50" name="Traffic Issues" />
                </LineChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Priority Distribution</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={[
                    { priority: 'Critical', count: 3 },
                    { priority: 'High', count: 4 },
                    { priority: 'Medium', count: 6 },
                    { priority: 'Low', count: 2 },
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
              <Typography variant="subtitle1" gutterBottom>Area-wise Issues</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={[
                    { area: 'Baner', issues: 8 },
                    { area: 'Aundh', issues: 6 },
                    { area: 'Shivaji Nagar', issues: 5 },
                    { area: 'FC Road', issues: 7 },
                    { area: 'Magarpatta', issues: 4 },
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
          <Typography variant="h6" gutterBottom>Roads & Transport Department Team</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center' }}>
                  <People sx={{ fontSize: 40, color: '#ff5722', mb: 1 }} />
                  <Typography variant="h5">52</Typography>
                  <Typography variant="body2">Team Members</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center' }}>
                  <Construction sx={{ fontSize: 40, color: '#ff5722', mb: 1 }} />
                  <Typography variant="h5">18</Typography>
                  <Typography variant="body2">Repair Teams</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center' }}>
                  <Road sx={{ fontSize: 40, color: '#ff5722', mb: 1 }} />
                  <Typography variant="h5">25</Typography>
                  <Typography variant="body2">Vehicles</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center' }}>
                  <CheckCircleOutline sx={{ fontSize: 40, color: '#ff5722', mb: 1 }} />
                  <Typography variant="h5">88%</Typography>
                  <Typography variant="body2">Efficiency Rate</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>Team Contact & Resources</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>Emergency Contact</Typography>
                    <Typography variant="body1">+91 9876543211</Typography>
                    <Typography variant="body2" color="text.secondary">Road Emergency 24/7</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>Control Room</Typography>
                    <Typography variant="body1">020-12345679</Typography>
                    <Typography variant="body2" color="text.secondary">7 AM - 10 PM</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>Active Projects</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" fontWeight="bold">Road Widening</Typography>
                      <Typography variant="caption">Baner to Hinjewadi</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Progress: 65%</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" fontWeight="bold">Smart Signals</Typography>
                      <Typography variant="caption">Installation in City Center</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Progress: 40%</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" fontWeight="bold">LED Street Lights</Typography>
                      <Typography variant="caption">Replacement Project</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Progress: 85%</Typography>
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
            Apply action to {selectedIssues.length} selected road issues:
          </Typography>
          <FormControl fullWidth>
            <Select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Select Action</MenuItem>
              <MenuItem value="In Process">Mark as In Process</MenuItem>
              <MenuItem value="Assigned">Assign to Repair Team</MenuItem>
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

export default RoadsTransportDashboard;