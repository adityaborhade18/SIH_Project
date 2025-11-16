import React, { useState, useEffect } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
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
  Divider,
  IconButton,
  Tooltip,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  Tabs,
  Tab,
  Badge,
  Snackbar,
  Alert,
  Grid,
  Menu,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  CheckCircleOutline, 
  PendingActions, 
  Build, 
  Warning, 
  Refresh, 
  FilterList,
  MoreVert,
  LocationOn,
  Category,
  CalendarToday,
  Search,
  Assignment,
  Send,
  Notifications,
  BarChart as BarChartIcon,
  Person,
  Security,
  Settings,
  Delete,
  Edit,
  Visibility,
  Email,
  Sms,
  Notifications as NotificationsIcon,
  Map as MapIcon,
  Timeline,
  PieChart as PieChartIcon,
  FilterAlt,
  Sort,
  GroupWork,
  Route,
  PriorityHigh,
  Chat,
  Assessment,
  People,
  AdminPanelSettings,
  History,
  Image,
  VideoLibrary,
  AttachFile,
  CleaningServices,    // Sanitation icon
  LocalHospital,       // Public Health icon
  DirectionsCar,       // Roads & Transport icon
  WaterDrop,           // Water Supply icon
  Lightbulb            // Electricity icon
} from '@mui/icons-material';
import { useIssues } from '../../context/IssueContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const statusOptions = ['Pending', 'In Process', 'Assigned', 'Solved', 'Rejected'];
const priorityLevels = ['Low', 'Medium', 'High', 'Critical'];
const departments = ['Sanitation', 'Public Health', 'Roads & Transport', 'Water Supply & Sewerage', 'Electricity & Street Lighting'];

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

const mapIssues = [
  {
    id: 1,
    category: 'Sanitation',
    position: [18.5204, 73.8567],
    title: 'Garbage not collected',
    description: 'Overflowing bins near FC Road.',
  },
  {
    id: 2,
    category: 'Public Health',
    position: [18.5310, 73.8446],
    title: 'Mosquito breeding',
    description: 'Stagnant water near Shivajinagar.',
  },
  {
    id: 3,
    category: 'Roads & Transport',
    position: [18.5074, 73.8077],
    title: 'Potholes on road',
    description: 'Large potholes on Baner Road.',
  },
  {
    id: 4,
    category: 'Water Supply',
    position: [18.4967, 73.8627],
    title: 'Water shortage',
    description: 'Low water pressure in Kothrud.',
  },
  {
    id: 5,
    category: 'Electricity',
    position: [18.5382, 73.8800],
    title: 'Power outage',
    description: 'No electricity in Viman Nagar.',
  },
];

const categoryIcons = {
  'Sanitation': new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/616/616494.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  'Public Health': new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/2965/2965567.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  'Roads & Transport': new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/684/684908.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  'Water Supply': new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/728/728093.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  'Electricity': new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/1041/1041916.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
};

const AdminDashboard = () => {
  const theme = useTheme();
  const { issues, updateIssueStatus } = useIssues();
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [filters, setFilters] = useState({
    status: [],
    priority: [],
    department: [],
    dateRange: [null, null],
    searchQuery: ''
  });
  const [sortModel, setSortModel] = useState([{ field: 'date', sort: 'desc' }]);
  const [bulkAction, setBulkAction] = useState('');
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState('sanitation');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showIssueDetails, setShowIssueDetails] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('email');

  // Filter and sort issues
  const filteredIssues = React.useMemo(() => {
    return issues.filter(issue => {
      // Apply search query
      if (filters.searchQuery && !`${issue.title} ${issue.description} ${issue.location} ${issue.category}`.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }
      
      // Apply status filter
      if (filters.status.length > 0 && !filters.status.includes(issue.status)) {
        return false;
      }
      
      // Apply priority filter
      if (filters.priority.length > 0 && !filters.priority.includes(issue.priority)) {
        return false;
      }
      
      // Apply department filter
      if (filters.department.length > 0 && (!issue.department || !filters.department.includes(issue.department))) {
        return false;
      }
      
      // Apply date range filter
      if (filters.dateRange[0] && new Date(issue.date) < filters.dateRange[0]) {
        return false;
      }
      if (filters.dateRange[1] && new Date(issue.date) > filters.dateRange[1]) {
        return false;
      }
      
      return true;
    }).sort((a, b) => {
      // Apply sorting
      for (let sort of sortModel) {
        const { field, sort: sortOrder } = sort;
        if (a[field] < b[field]) {
          return sortOrder === 'asc' ? -1 : 1;
        }
        if (a[field] > b[field]) {
          return sortOrder === 'asc' ? 1 : -1;
        }
      }
      return 0;
    });
  }, [issues, filters, sortModel]);

  // Handle status change for single issue
  const handleStatusChange = (id, newStatus) => {
    updateIssueStatus(id, newStatus);
    showSnackbar('Status updated successfully', 'success');
  };

  // Handle bulk actions
  const handleBulkAction = () => {
    if (!bulkAction || selectedIssues.length === 0) return;
    
    // In a real app, you would make an API call here
    selectedIssues.forEach(id => {
      updateIssueStatus(id, bulkAction);
    });
    
    setShowBulkDialog(false);
    setSelectedIssues([]);
    showSnackbar(`Updated status for ${selectedIssues.length} issues`, 'success');
  };

  // Show snackbar notification
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Handle row selection
  const handleRowSelection = (newSelection) => {
    setSelectedIssues(newSelection);
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Prepare data for charts
  const categoryData = React.useMemo(() => {
    return issues.reduce((acc, issue) => {
      const existing = acc.find(item => item.name === issue.category);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ name: issue.category, count: 1 });
      }
      return acc;
    }, []);
  }, [issues]);

  const statusData = React.useMemo(() => [
    { name: 'Pending', value: issues.filter(issue => issue.status === 'Pending').length },
    { name: 'In Process', value: issues.filter(issue => issue.status === 'In Process').length },
    { name: 'Assigned', value: issues.filter(issue => issue.status === 'Assigned').length },
    { name: 'Solved', value: issues.filter(issue => issue.status === 'Solved').length },
    { name: 'Rejected', value: issues.filter(issue => issue.status === 'Rejected').length },
  ], [issues]);

  const departmentData = React.useMemo(() => {
    return departments.map(dept => ({
      name: dept,
      count: issues.filter(issue => issue.department === dept).length
    }));
  }, [issues]);

  // Columns configuration
  const columns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 80,
      renderCell: (params) => `#${params.value}` 
    },
    { 
      field: 'date', 
      headerName: 'Date', 
      width: 120,
      renderCell: (params) => new Date(params.value).toLocaleDateString()
    },
    { 
      field: 'title', 
      headerName: 'Title', 
      flex: 1, 
      minWidth: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="500">{params.value}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <Category fontSize="small" color="action" sx={{ fontSize: 14, mr: 0.5 }} />
            <Typography variant="caption" color="text.secondary">
              {params.row.category}
            </Typography>
          </Box>
        </Box>
      )
    },
    { 
      field: 'priority', 
      headerName: 'Priority', 
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value || 'Medium'}
          size="small"
          sx={{
            backgroundColor: priorityColors[params.value || 'Medium'] + '20',
            color: priorityColors[params.value || 'Medium'],
            fontWeight: 500,
            width: '100%',
            '& .MuiChip-label': {
              px: 1,
            },
          }}
        />
      )
    },
    { 
      field: 'location', 
      headerName: 'Location', 
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocationOn color="action" fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body2" noWrap>
            {params.value?.address?.split(',').slice(0, 2).join(',') || 'N/A'}
          </Typography>
        </Box>
      )
    },
    {
      field: 'department',
      headerName: 'Department',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value || 'Unassigned'}
          size="small"
          variant="outlined"
          sx={{
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            '& .MuiChip-label': {
              px: 1,
            },
          }}
        />
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 160,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            backgroundColor: statusColors[params.value] + '1a',
            color: statusColors[params.value],
            fontWeight: 500,
            minWidth: '80px',
            maxWidth: '140px',
            '& .MuiChip-label': {
              px: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'block',
            },
          }}
        />
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params) => [
        <Tooltip title="View Details" key="view">
          <IconButton onClick={() => {
            setSelectedIssue(params.row);
            setShowIssueDetails(true);
          }}>
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>,
        <Tooltip title="Change Status" key="status">
          <FormControl variant="standard" size="small" sx={{ minWidth: 120 }}>
            <Select
              value={params.row.status}
              onChange={(e) => handleStatusChange(params.id, e.target.value)}
              sx={{
                '&:before, &:after': { border: 'none !important' },
                '& .MuiSelect-select': { py: 0.5, px: 1, fontSize: '0.8125rem' }
              }}
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Tooltip>,
      ],
    },
  ];

  // Stats cards
  const stats = [
    { 
      title: 'Total Reports', 
      value: issues.length,
      icon: Warning,
      color: theme.palette.primary.main,
      trend: '+12%',
      trendColor: 'success.main'
    },
    { 
      title: 'Pending', 
      value: issues.filter(issue => issue.status === 'Pending').length,
      icon: PendingActions,
      color: '#ff9800',
      trend: '+5%',
      trendColor: 'error.main'
    },
    { 
      title: 'In Progress', 
      value: issues.filter(issue => issue.status === 'In Process').length,
      icon: Build,
      color: '#2196f3',
      trend: '+8%',
      trendColor: 'success.main'
    },
    { 
      title: 'Resolved', 
      value: issues.filter(issue => issue.status === 'Solved').length,
      icon: CheckCircleOutline,
      color: '#4caf50',
      trend: '+15%',
      trendColor: 'success.main'
    },
  ];

  // Department-specific content
  const departmentContent = {
    sanitation: {
      title: "Sanitation Department",
      description: "Garbage collection, street cleaning, waste management services",
      icon: CleaningServices,
      color: "#795548"
    },
    'public-health': {
      title: "Public Health Department", 
      description: "Health services, disease control, public health initiatives",
      icon: LocalHospital,
      color: "#e91e63"
    },
    'roads-transport': {
      title: "Roads & Transport Department",
      description: "Road maintenance, traffic management, public transportation",
      icon: DirectionsCar,
      color: "#ff9800"
    },
    'water-supply': {
      title: "Water Supply & Sewerage Department",
      description: "Water distribution, sewer systems, drainage management",
      icon: WaterDrop,
      color: "#2196f3"
    },
    electricity: {
      title: "Electricity & Street Lighting Department",
      description: "Power supply, street lighting, electrical infrastructure",
      icon: Lightbulb,
      color: "#ffc107"
    }
  };

  // Render the component
  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Municipal Corporation Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back! Here's what's happening with municipal services.
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button 
            variant="outlined" 
            startIcon={<Refresh />}
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<FilterList />}
            onClick={() => setAnchorEl(document.getElementById('filter-button'))}
            id="filter-button"
          >
            Filters
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Box sx={{ p: 2, width: 300 }}>
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
              
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Department</InputLabel>
                <Select
                  multiple
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      <Checkbox checked={filters.department.includes(dept)} />
                      <ListItemText primary={dept} />
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
                    department: [],
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
        </Box>
      </Box>

      {/* Search and Bulk Actions */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          placeholder="Search reports..."
          variant="outlined"
          size="small"
          value={filters.searchQuery}
          onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          InputProps={{
            startAdornment: <Search color="action" sx={{ mr: 1 }} />,
            sx: { width: 300 }
          }}
        />
        
        <Box>
          {selectedIssues.length > 0 && (
            <>
              <Typography variant="body2" color="text.secondary" display="inline" mr={2}>
                {selectedIssues.length} selected
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Assignment />}
                onClick={() => setShowBulkDialog(true)}
                sx={{ mr: 1 }}
              >
                Bulk Actions
              </Button>
            </>
          )}
          <Button
            variant="contained"
            color="primary"
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

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          aria-label="municipal department tabs"
        >
          <Tab 
            icon={<CleaningServices fontSize="small" />} 
            iconPosition="start"
            label="Sanitation" 
            value="sanitation" 
          />
          <Tab 
            icon={<LocalHospital fontSize="small" />}
            iconPosition="start"
            label="Public Health" 
            value="public-health" 
          />
          <Tab 
            icon={<DirectionsCar fontSize="small" />}
            iconPosition="start"
            label="Roads & Transport" 
            value="roads-transport" 
          />
          <Tab 
            icon={<WaterDrop fontSize="small" />}
            iconPosition="start"
            label="Water Supply" 
            value="water-supply" 
          />
          <Tab 
            icon={<Lightbulb fontSize="small" />}
            iconPosition="start"
            label="Electricity" 
            value="electricity" 
          />
          <Tab 
            icon={<MapIcon fontSize="small" />}
            iconPosition="start"
            label="Map View" 
            value="map" 
          />
        </Tabs>
      </Box>

      {/* Main Content */}
      {Object.keys(departmentContent).map(deptKey => (
        activeTab === deptKey && (
          <Box key={deptKey}>
            {/* Department Header */}
            <Box sx={{ mb: 4, p: 3, bgcolor: departmentContent[deptKey].color + '10', borderRadius: 2 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: departmentContent[deptKey].color, mr: 2 }}>
                 {React.createElement(departmentContent[deptKey].icon)}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {departmentContent[deptKey].title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {departmentContent[deptKey].description}
                  </Typography>
                </Box>
              </Box>
              
              {/* Department-specific stats */}
              <Box sx={{ 
                display: 'grid', 
                gap: 2, 
                gridTemplateColumns: { 
                  xs: '1fr', 
                  sm: 'repeat(2, 1fr)', 
                  md: 'repeat(4, 1fr)' 
                } 
              }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="textSecondary" variant="subtitle2">
                      Total Issues
                    </Typography>
                    <Typography variant="h4">
                      {issues.filter(issue => issue.department === departments.find(d => d.toLowerCase().includes(deptKey))).length}
                    </Typography>
                  </CardContent>
                </Card>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="textSecondary" variant="subtitle2">
                      Pending
                    </Typography>
                    <Typography variant="h4" color="#ff9800">
                      {issues.filter(issue => issue.department === departments.find(d => d.toLowerCase().includes(deptKey)) && issue.status === 'Pending').length}
                    </Typography>
                  </CardContent>
                </Card>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="textSecondary" variant="subtitle2">
                      In Progress
                    </Typography>
                    <Typography variant="h4" color="#2196f3">
                      {issues.filter(issue => issue.department === departments.find(d => d.toLowerCase().includes(deptKey)) && issue.status === 'In Process').length}
                    </Typography>
                  </CardContent>
                </Card>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="textSecondary" variant="subtitle2">
                      Resolved
                    </Typography>
                    <Typography variant="h4" color="#4caf50">
                      {issues.filter(issue => issue.department === departments.find(d => d.toLowerCase().includes(deptKey)) && issue.status === 'Solved').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {/* Department-specific charts and table */}
            <Box sx={{ 
              display: 'grid', 
              gap: 3, 
              gridTemplateColumns: { 
                xs: '1fr', 
                lg: '1fr 1fr' 
              }, 
              mb: 4 
            }}>
              <Paper sx={{ p: 2, height: 300 }}>
                <Typography variant="h6" gutterBottom>Issues by Status</Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={statusData.filter(data => 
                        issues.some(issue => 
                          issue.department === departments.find(d => d.toLowerCase().includes(deptKey)) && 
                          issue.status === data.name
                        )
                      )}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={statusColors[entry.name]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>

              <Paper sx={{ p: 2, height: 300 }}>
                <Typography variant="h6" gutterBottom>Monthly Trend</Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart
                    data={[
                      { month: 'Jan', issues: 12 },
                      { month: 'Feb', issues: 19 },
                      { month: 'Mar', issues: 15 },
                      { month: 'Apr', issues: 8 },
                      { month: 'May', issues: 14 },
                      { month: 'Jun', issues: 21 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="issues" fill={departmentContent[deptKey].color} />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Box>

            {/* Department Issues Table */}
            <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2">
                  Recent {departmentContent[deptKey].title} Issues
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total: {issues.filter(issue => issue.department === departments.find(d => d.toLowerCase().includes(deptKey))).length} issues
                </Typography>
              </Box>
              
              <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={filteredIssues.filter(issue => issue.department === departments.find(d => d.toLowerCase().includes(deptKey)))}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10, 15]}
                  checkboxSelection
                  disableSelectionOnClick
                  onSelectionModelChange={handleRowSelection}
                  selectionModel={selectedIssues}
                  getRowHeight={() => 'auto'}
                  onSortModelChange={(model) => setSortModel(model)}
                  sortModel={sortModel}
                  sx={{
                    border: 'none',
                    '& .MuiDataGrid-cell': {
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: theme.palette.mode === 'light' ? '#f8f9fa' : '#1e1e1e',
                      borderRadius: '8px 8px 0 0',
                      borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                      fontWeight: 600,
                    },
                    '& .MuiDataGrid-row:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                />
              </div>
            </Paper>
          </Box>
        )
      ))}

      {/* Map View Tab */}
      {activeTab === 'map' && (
        <Paper sx={{ p: 3, height: '70vh', minHeight: 500 }}>
          <Typography variant="h6" gutterBottom>Interactive Map View (Pune)</Typography>
          <Box sx={{ width: '100%', height: '60vh', position: 'relative', borderRadius: 2, overflow: 'hidden', boxShadow: 1 }}>
            <MapContainer center={[18.5204, 73.8567]} zoom={12} style={{ width: '100%', height: '100%' }} scrollWheelZoom={true}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {mapIssues.map(issue => (
                <Marker key={issue.id} position={issue.position} icon={categoryIcons[issue.category]}>
                  <Popup>
                    <Typography variant="subtitle2">{issue.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{issue.description}</Typography>
                    <Typography variant="caption" color="primary">Category: {issue.category}</Typography>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Box>
          <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {Object.keys(categoryIcons).map(cat => (
              <Box key={cat} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <img src={categoryIcons[cat].options.iconUrl} alt={cat} style={{ width: 24, height: 24 }} />
                <Typography variant="body2">{cat}</Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      )}

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
              <MenuItem value="">
                <em>Select an action</em>
              </MenuItem>
              <MenuItem value="In Process">Mark as In Process</MenuItem>
              <MenuItem value="Assigned">Assign to Department</MenuItem>
              <MenuItem value="Solved">Mark as Solved</MenuItem>
              <MenuItem value="Rejected">Reject Selected</MenuItem>
            </Select>
          </FormControl>
          
          {bulkAction === 'Assigned' && (
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Department</InputLabel>
              <Select
                value={filters.department[0] || ''}
                onChange={(e) => handleFilterChange('department', [e.target.value])}
                label="Department"
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBulkDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleBulkAction} 
            variant="contained" 
            color="primary"
            disabled={!bulkAction || (bulkAction === 'Assigned' && !filters.department.length)}
          >
            Apply to {selectedIssues.length} Issues
          </Button>
        </DialogActions>
      </Dialog>

      {/* Issue Details Dialog */}
      <Dialog 
        open={showIssueDetails} 
        onClose={() => setShowIssueDetails(false)} 
        maxWidth="md" 
        fullWidth
      >
        {selectedIssue && (
          <>
            <DialogTitle>Issue Details</DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom>{selectedIssue.title}</Typography>
                  <Typography variant="body1" paragraph>{selectedIssue.description}</Typography>
                  
                  <Box sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>Location</Typography>
                    <Typography>{selectedIssue.location?.address || 'Location not specified'}</Typography>
                    
                    <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Chip 
                        label={selectedIssue.status} 
                        size="small" 
                        sx={{ 
                          backgroundColor: statusColors[selectedIssue.status] + '1a',
                          color: statusColors[selectedIssue.status],
                          fontWeight: 500,
                          minWidth: '80px',
                          '& .MuiChip-label': {
                            px: 1,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: 'block',
                          },
                        }} 
                      />
                      <Chip 
                        label={selectedIssue.priority || 'Medium'} 
                        size="small" 
                        variant="outlined"
                        sx={{ 
                          borderColor: priorityColors[selectedIssue.priority || 'Medium'], 
                          color: priorityColors[selectedIssue.priority || 'Medium'] 
                        }} 
                      />
                      {selectedIssue.department && (
                        <Chip 
                          label={selectedIssue.department} 
                          size="small" 
                          variant="outlined"
                          color="primary"
                        />
                      )}
                    </Box>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>Attachments</Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      {selectedIssue.images?.length > 0 ? (
                        selectedIssue.images.map((img, idx) => (
                          <Box 
                            key={idx} 
                            sx={{ 
                              width: 100, 
                              height: 100, 
                              borderRadius: 1, 
                              overflow: 'hidden',
                              border: '1px solid',
                              borderColor: 'divider'
                            }}
                          >
                            <img 
                              src={img} 
                              alt={`Attachment ${idx + 1}`} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">No attachments</Typography>
                      )}
                    </Box>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Update Status</Typography>
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
                          sx={{ 
                            textTransform: 'none',
                            ...(selectedIssue.status === status && {
                              bgcolor: statusColors[status],
                              '&:hover': { bgcolor: statusColors[status] }
                            })
                          }}
                        >
                          {status}
                        </Button>
                      ))}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>Details</Typography>
                      <Box sx={{ '& > div': { mb: 1 } }}>
                        <div><strong>Reported:</strong> {new Date(selectedIssue.date).toLocaleDateString()}</div>
                        <div><strong>Category:</strong> {selectedIssue.category || 'N/A'}</div>
                        <div><strong>Department:</strong> {selectedIssue.department || 'Unassigned'}</div>
                        <div><strong>Priority:</strong> {selectedIssue.priority || 'Medium'}</div>
                      </Box>
                    </CardContent>
                  </Card>
                  
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>Reporter</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ width: 40, height: 40, mr: 1.5 }}>
                          {selectedIssue.reporter?.name?.[0] || 'U'}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {selectedIssue.reporter?.name || 'Anonymous User'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {selectedIssue.reporter?.email || 'No contact information'}
                          </Typography>
                        </Box>
                      </Box>
                      <Button 
                        fullWidth 
                        variant="outlined" 
                        size="small" 
                        startIcon={<Email />}
                        onClick={() => {
                          setShowMessageDialog(true);
                          setMessageType('email');
                          setShowIssueDetails(false);
                        }}
                      >
                        Send Message
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowIssueDetails(false)}>Close</Button>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => {
                  setShowIssueDetails(false);
                  setSelectedIssues([selectedIssue.id]);
                  setShowBulkDialog(true);
                }}
              >
                Take Action
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Message Dialog */}
      <Dialog 
        open={showMessageDialog} 
        onClose={() => setShowMessageDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          {messageType === 'email' ? 'Send Email Update' : 'Send Notification'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, mb: 3 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Recipients</InputLabel>
              <Select
                multiple
                value={selectedIssues.length > 0 ? ['selected'] : ['all']}
                renderValue={(selected) => {
                  if (selected.includes('selected')) {
                    return `${selectedIssues.length} selected issues`;
                  }
                  return 'All users';
                }}
              >
                <MenuItem value="all">All Users</MenuItem>
                <MenuItem value="selected" disabled={selectedIssues.length === 0}>
                  {selectedIssues.length} Selected Issues
                </MenuItem>
                <MenuItem value="department">By Department</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Subject"
              fullWidth
              margin="normal"
              variant="outlined"
            />
            
            <TextField
              label="Message"
              fullWidth
              multiline
              rows={6}
              margin="normal"
              variant="outlined"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Type your ${messageType === 'email' ? 'email' : 'notification'} message here...`}
            />
            
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachFile fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Attach files (optional)
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMessageDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              setShowMessageDialog(false);
              showSnackbar(
                messageType === 'email' 
                  ? 'Email sent successfully' 
                  : 'Notification sent successfully',
                'success'
              );
            }}
          >
            {messageType === 'email' ? 'Send Email' : 'Send Notification'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;

