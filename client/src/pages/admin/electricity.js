import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DirectionsCar from '@mui/icons-material/DirectionsCar';

import AdminIssueTable from '../../components/admin/AdminIssueTable';
import AdminIssueDetailsDialog from '../../components/admin/AdminIssueDetailsDialog';

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
  CleaningServices,
  ElectricBike,
  Logout
} from '@mui/icons-material';
import { useIssues } from '../../context/IssueContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const statusOptions = ['Pending', 'In Process', 'Assigned', 'Solved', 'Rejected'];
const priorityLevels = ['Low', 'Medium', 'High', 'Critical'];
const department = 'Electricity'; // Single department focus

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



const Electricitydepartment = ({ onLogout }) => {
  const theme = useTheme();
  // const { issues, updateIssueStatus } = useIssues(); // Removed context usage
  const { updateIssueStatus } = useIssues(); // Keep updateIssueStatus if needed, or implement it locally. 

  const [electricityIssues, setElectricityIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/user/getallissue?department=Electricity');
      if (data.success) {
        const mappedIssues = data.issues.map(issue => ({
          id: issue._id,
          title: issue.title,
          description: issue.description,
          location: {
            address: issue.address || "No address",
            coordinates: issue.location?.coordinates || [0, 0]
          },
          category: issue.department || 'Electricity',
          status: issue.status,
          priority: issue.priority,
          date: issue.createdAt,
          reporter: issue.createdBy || { name: 'Unknown', email: '' },
          images: issue.image ? [issue.image] : []
        }));
        setElectricityIssues(mappedIssues);
      }
    } catch (error) {
      console.error("Failed to fetch issues", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const [selectedIssues, setSelectedIssues] = useState([]);
  const [filters, setFilters] = useState({
    status: [],
    priority: [],
    dateRange: [null, null],
    searchQuery: ''
  });
  const [sortModel, setSortModel] = useState([{ field: 'date', sort: 'desc' }]);
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
  // const sanitationIssues = React.useMemo(() => { ... }); // Removed this block

  // Filter and sort issues
  const filteredIssues = React.useMemo(() => {
    return electricityIssues.filter(issue => { // Updated variable name
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
  }, [electricityIssues, filters, sortModel]);

  // Handle status change for single issue
  const handleStatusChange = (id, newStatus) => {
    updateIssueStatus(id, newStatus);
    showSnackbar('Status updated successfully', 'success');
  };

  // Handle bulk actions
  const handleBulkAction = () => {
    if (!bulkAction || selectedIssues.length === 0) return;

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
    return electricityIssues.reduce((acc, issue) => {
      const existing = acc.find(item => item.name === issue.category);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ name: issue.category, count: 1 });
      }
      return acc;
    }, []);
  }, [electricityIssues]);

  const statusData = React.useMemo(() => [
    { name: 'Pending', value: electricityIssues.filter(issue => issue.status === 'Pending').length },
    { name: 'In Process', value: electricityIssues.filter(issue => issue.status === 'In Process').length },
    { name: 'Assigned', value: electricityIssues.filter(issue => issue.status === 'Assigned').length },
    { name: 'Solved', value: electricityIssues.filter(issue => issue.status === 'Solved').length },
    { name: 'Rejected', value: electricityIssues.filter(issue => issue.status === 'Rejected').length },
  ], [electricityIssues]);

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

  // Stats cards for Electricity department
  const stats = [
    {
      title: 'Total Reports',
      value: electricityIssues.length,
      icon: Warning,
      color: theme.palette.primary.main,
      trend: '+12%',
      trendColor: 'success.main'
    },
    {
      title: 'Pending',
      value: electricityIssues.filter(issue => issue.status === 'Pending').length,
      icon: PendingActions,
      color: '#ff9800',
      trend: '+5%',
      trendColor: 'error.main'
    },
    {
      title: 'In Progress',
      value: electricityIssues.filter(issue => issue.status === 'In Process').length,
      icon: Build,
      color: '#2196f3',
      trend: '+8%',
      trendColor: 'success.main'
    },
    {
      title: 'Resolved',
      value: electricityIssues.filter(issue => issue.status === 'Solved').length,
      icon: CheckCircleOutline,
      color: '#4caf50',
      trend: '+15%',
      trendColor: 'success.main'
    },
  ];

  // Render the component
  return (
    <Box sx={{ p: 3, py: 8 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Electricity Department Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back! Here's what's happening with electricity services.
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchIssues}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Logout />}
            onClick={onLogout}
            sx={{ ml: 1 }}
          >
            Logout
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
        </Box>
      </Box>

      {/* Search and Bulk Actions */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          placeholder="Search electricity reports..."
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

      {/* Department Header */}
      <Box sx={{ mb: 4, p: 3, bgcolor: '#79554810', borderRadius: 2 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: '#795548', mr: 2 }}>
            <CleaningServices />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Electricity Department
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Power outages, street light repairs, and electrical maintenance
            </Typography>
          </Box>
        </Box>

        {/* Department stats */}
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
                {electricityIssues.length}
              </Typography>
            </CardContent>
          </Card>
          <Card variant="outlined">
            <CardContent>
              <Typography color="textSecondary" variant="subtitle2">
                Pending
              </Typography>
              <Typography variant="h4" color="#ff9800">
                {electricityIssues.filter(issue => issue.status === 'Pending').length}
              </Typography>
            </CardContent>
          </Card>
          <Card variant="outlined">
            <CardContent>
              <Typography color="textSecondary" variant="subtitle2">
                In Progress
              </Typography>
              <Typography variant="h4" color="#2196f3">
                {electricityIssues.filter(issue => issue.status === 'In Process').length}
              </Typography>
            </CardContent>
          </Card>
          <Card variant="outlined">
            <CardContent>
              <Typography color="textSecondary" variant="subtitle2">
                Resolved
              </Typography>
              <Typography variant="h4" color="#4caf50">
                {electricityIssues.filter(issue => issue.status === 'Solved').length}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Tabs for different views within the department */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          aria-label="electricity department tabs"
        >
          <Tab
            icon={<BarChartIcon fontSize="small" />}
            iconPosition="start"
            label="Overview"
            value="overview"
          />
          <Tab
            icon={<MapIcon fontSize="small" />}
            iconPosition="start"
            label="Map View"
            value="map"
          />
          <Tab
            icon={<Assessment fontSize="small" />}
            iconPosition="start"
            label="Analytics"
            value="analytics"
          />
          <Tab
            icon={<People fontSize="small" />}
            iconPosition="start"
            label="Team"
            value="team"
          />
        </Tabs>
      </Box>

      {/* Main Content */}
      {/* Replaced DataGrid with AdminIssueTable */}
      {activeTab === 'overview' && (
        <>
          {/* Stats Cards */}
          <Box sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)'
            },
            mb: 4
          }}>
            {stats.map((stat, index) => (
              <Card key={index} variant="outlined" sx={{
                borderLeft: `4px solid ${stat.color}`,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden'
              }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        color="textSecondary"
                        variant="subtitle2"
                        gutterBottom
                        noWrap
                        sx={{
                          textOverflow: 'ellipsis',
                          overflow: 'hidden'
                        }}
                      >
                        {stat.title}
                      </Typography>
                      <Typography variant="h5" noWrap>{stat.value}</Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: stat.trendColor,
                          display: 'flex',
                          alignItems: 'center',
                          mt: 0.5,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {stat.trend} from last week
                      </Typography>
                    </Box>
                    <Avatar sx={{
                      bgcolor: stat.color + '20',
                      color: stat.color,
                      ml: 1,
                      flexShrink: 0
                    }}>
                      <stat.icon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Charts Row */}
          <Box sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: '1fr',
              lg: '1fr 1fr'
            },
            mb: 4
          }}>
            <Paper sx={{ p: 2, height: 350, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>Electricity Issues by Status</Typography>
              <Box sx={{ flex: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      innerRadius={0}
                      paddingAngle={1}
                      dataKey="value"
                      label={({ name, percent, cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = 25 + outerRadius * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                        // Simple label positioning
                        return (
                          <text
                            x={x}
                            y={y}
                            fill="#333"
                            textAnchor={x > cx ? 'start' : 'end'}
                            dominantBaseline="central"
                            style={{ fontSize: '12px' }}
                          >
                            {`${name} (${(percent * 100).toFixed(0)}%)`}
                          </text>
                        );
                      }}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={statusColors[entry.name]} />
                      ))}
                    </Pie>
                    <Legend />
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>

            <Paper sx={{ p: 2, height: 300 }}>
              <Typography variant="h6" gutterBottom>Issues by Category</Typography>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart
                  data={categoryData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <RechartsTooltip />
                  <Bar dataKey="count" fill="#795548" name="Reports" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Box>

          {/* New Custom Table */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>Recent Reports</Typography>
            <AdminIssueTable
              issues={electricityIssues}
              onViewDetails={(issue) => {
                setSelectedIssue(issue);
                setShowIssueDetails(true);
              }}
            />
          </Box>
        </>
      )}

      {/* Other Tabs content... (Map, Analytics, Team - kept as is) */}
      {activeTab === 'map' && (
        <Paper sx={{ p: 3, height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box textAlign="center">
            <MapIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Electricity Issues Map
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              View grid infrastructure, maintenance schedules, and outage hotspots.
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Analytics Tab (kept as is) */}
      {activeTab === 'analytics' && (
        <Box>
          {/* Same content as before */}
        </Box>
      )}

      {/* Team Tab (kept as is) */}
      {activeTab === 'team' && (
        <Paper sx={{ p: 3, minHeight: '60vh' }}>
          <Typography variant="h6" gutterBottom>Electricity Team</Typography>
        </Paper>
      )}

      {/* Bulk Action Dialog */}
      <Dialog open={showBulkDialog} onClose={() => setShowBulkDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Bulk Actions</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            You have selected {selectedIssues.length} electricity issues. What would you like to do with them?
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
              <MenuItem value="Assigned">Assign to Team</MenuItem>
              <MenuItem value="Solved">Mark as Solved</MenuItem>
              <MenuItem value="Rejected">Reject Selected</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBulkDialog(false)}>Cancel</Button>
          <Button
            onClick={handleBulkAction}
            variant="contained"
            color="primary"
            disabled={!bulkAction}
          >
            Apply to {selectedIssues.length} Issues
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Admin Issue Details Dialog */}
      <AdminIssueDetailsDialog
        open={showIssueDetails}
        onClose={() => setShowIssueDetails(false)}
        issue={selectedIssue}
        onStatusUpdate={(id, newStatus) => {
          handleStatusChange(id, newStatus);
          // Optionally update local state if needed immediately, though handleStatusChange might handle it
          // Also update selectedIssue status for the dialog to reflect change
          setSelectedIssue({ ...selectedIssue, status: newStatus });
        }}
      />


      {/* Message Dialog */}
      <Dialog
        open={showMessageDialog}
        onClose={() => setShowMessageDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {messageType === 'email' ? 'Send Email Update' : 'Send Team Notification'}
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
                  return 'All team members';
                }}
              >
                <MenuItem value="all">All Team Members</MenuItem>
                <MenuItem value="selected" disabled={selectedIssues.length === 0}>
                  {selectedIssues.length} Selected Issues
                </MenuItem>
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

export default Electricitydepartment;