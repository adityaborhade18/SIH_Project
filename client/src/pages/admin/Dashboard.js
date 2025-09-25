// import React, { useState, useEffect } from 'react';
// import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
// // import { 
// //   DatePicker,
// //   LocalizationProvider,
// //   AdapterDateFns 
// // } from '@mui/x-date-pickers';
// import { 
//   Box, 
//   Typography, 
//   Paper, 
//   Select, 
//   MenuItem, 
//   FormControl, 
//   InputLabel, 
//   Avatar, 
//   Chip, 
//   Card, 
//   CardContent,
//   Divider,
//   IconButton,
//   Tooltip,
//   useTheme,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Checkbox,
//   FormControlLabel,
//   Tabs,
//   Tab,
//   Badge,
//   Snackbar,
//   Alert,
//   Grid,
//   Menu,
//   ListItemIcon,
//   ListItemText
// } from '@mui/material';
// import { 
//   CheckCircleOutline, 
//   PendingActions, 
//   Build, 
//   Warning, 
//   Refresh, 
//   FilterList,
//   MoreVert,
//   LocationOn,
//   Category,
//   CalendarToday,
//   Search,
//   Assignment,
//   Send,
//   Notifications,
//   BarChart as BarChartIcon,
//   Person,
//   Security,
//   Settings,
//   Delete,
//   Edit,
//   Visibility,
//   Email,
//   Sms,
//   Notifications as NotificationsIcon,
//   Map as MapIcon,
//   Timeline,
//   PieChart as PieChartIcon,
//   FilterAlt,
//   Sort,
//   GroupWork,
//   Route,
//   PriorityHigh,
//   Chat,
//   Assessment,
//   People,
//   AdminPanelSettings,
//   History,
//   Image,
//   VideoLibrary,
//   AttachFile
// } from '@mui/icons-material';
// import { useIssues } from '../../context/IssueContext';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// const statusOptions = ['Pending', 'In Process', 'Assigned', 'Solved', 'Rejected'];
// const priorityLevels = ['Low', 'Medium', 'High', 'Critical'];
// const departments = ['Sanitation', 'Public Works', 'Electricity', 'Water', 'Transportation'];

// const statusColors = {
//   'Pending': '#ff9800',
//   'In Process': '#2196f3',
//   'Assigned': '#9c27b0',
//   'Solved': '#4caf50',
//   'Rejected': '#f44336'
// };

// const priorityColors = {
//   'Low': '#4caf50',
//   'Medium': '#ffc107',
//   'High': '#ff9800',
//   'Critical': '#f44336'
// };

// const AdminDashboard = () => {
//   const theme = useTheme();
//   const { issues, updateIssueStatus } = useIssues();
//   const [selectedIssues, setSelectedIssues] = useState([]);
//   const [filters, setFilters] = useState({
//     status: [],
//     priority: [],
//     department: [],
//     dateRange: [null, null],
//     searchQuery: ''
//   });
//   const [sortModel, setSortModel] = useState([{ field: 'date', sort: 'desc' }]);
//   const [bulkAction, setBulkAction] = useState('');
//   const [showBulkDialog, setShowBulkDialog] = useState(false);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [activeTab, setActiveTab] = useState('overview');
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedIssue, setSelectedIssue] = useState(null);
//   const [showIssueDetails, setShowIssueDetails] = useState(false);
//   const [showMessageDialog, setShowMessageDialog] = useState(false);
//   const [message, setMessage] = useState('');
//   const [messageType, setMessageType] = useState('email');

//   // Filter and sort issues
//   const filteredIssues = React.useMemo(() => {
//     return issues.filter(issue => {
//       // Apply search query
//       if (filters.searchQuery && !`${issue.title} ${issue.description} ${issue.location} ${issue.category}`.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
//         return false;
//       }
      
//       // Apply status filter
//       if (filters.status.length > 0 && !filters.status.includes(issue.status)) {
//         return false;
//       }
      
//       // Apply priority filter
//       if (filters.priority.length > 0 && !filters.priority.includes(issue.priority)) {
//         return false;
//       }
      
//       // Apply department filter
//       if (filters.department.length > 0 && (!issue.department || !filters.department.includes(issue.department))) {
//         return false;
//       }
      
//       // Apply date range filter
//       if (filters.dateRange[0] && new Date(issue.date) < filters.dateRange[0]) {
//         return false;
//       }
//       if (filters.dateRange[1] && new Date(issue.date) > filters.dateRange[1]) {
//         return false;
//       }
      
//       return true;
//     }).sort((a, b) => {
//       // Apply sorting
//       for (let sort of sortModel) {
//         const { field, sort: sortOrder } = sort;
//         if (a[field] < b[field]) {
//           return sortOrder === 'asc' ? -1 : 1;
//         }
//         if (a[field] > b[field]) {
//           return sortOrder === 'asc' ? 1 : -1;
//         }
//       }
//       return 0;
//     });
//   }, [issues, filters, sortModel]);

//   // Handle status change for single issue
//   const handleStatusChange = (id, newStatus) => {
//     updateIssueStatus(id, newStatus);
//     showSnackbar('Status updated successfully', 'success');
//   };

//   // Handle bulk actions
//   const handleBulkAction = () => {
//     if (!bulkAction || selectedIssues.length === 0) return;
    
//     // In a real app, you would make an API call here
//     selectedIssues.forEach(id => {
//       updateIssueStatus(id, bulkAction);
//     });
    
//     setShowBulkDialog(false);
//     setSelectedIssues([]);
//     showSnackbar(`Updated status for ${selectedIssues.length} issues`, 'success');
//   };

//   // Show snackbar notification
//   const showSnackbar = (message, severity = 'success') => {
//     setSnackbar({ open: true, message, severity });
//   };

//   // Handle row selection
//   const handleRowSelection = (newSelection) => {
//     setSelectedIssues(newSelection);
//   };

//   // Handle filter changes
//   const handleFilterChange = (filterName, value) => {
//     setFilters(prev => ({
//       ...prev,
//       [filterName]: value
//     }));
//   };

//   // Prepare data for charts
//   const categoryData = React.useMemo(() => {
//     return issues.reduce((acc, issue) => {
//       const existing = acc.find(item => item.name === issue.category);
//       if (existing) {
//         existing.count += 1;
//       } else {
//         acc.push({ name: issue.category, count: 1 });
//       }
//       return acc;
//     }, []);
//   }, [issues]);

//   const statusData = React.useMemo(() => [
//     { name: 'Pending', value: issues.filter(issue => issue.status === 'Pending').length },
//     { name: 'In Process', value: issues.filter(issue => issue.status === 'In Process').length },
//     { name: 'Assigned', value: issues.filter(issue => issue.status === 'Assigned').length },
//     { name: 'Solved', value: issues.filter(issue => issue.status === 'Solved').length },
//     { name: 'Rejected', value: issues.filter(issue => issue.status === 'Rejected').length },
//   ], [issues]);

//   const departmentData = React.useMemo(() => {
//     return departments.map(dept => ({
//       name: dept,
//       count: issues.filter(issue => issue.department === dept).length
//     }));
//   }, [issues]);

//   // Columns configuration
//   const columns = [
//     { 
//       field: 'id', 
//       headerName: 'ID', 
//       width: 80,
//       renderCell: (params) => `#${params.value}` 
//     },
//     { 
//       field: 'date', 
//       headerName: 'Date', 
//       width: 120,
//       renderCell: (params) => new Date(params.value).toLocaleDateString()
//     },
//     { 
//       field: 'title', 
//       headerName: 'Title', 
//       flex: 1, 
//       minWidth: 200,
//       renderCell: (params) => (
//         <Box>
//           <Typography variant="body2" fontWeight="500">{params.value}</Typography>
//           <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
//             <Category fontSize="small" color="action" sx={{ fontSize: 14, mr: 0.5 }} />
//             <Typography variant="caption" color="text.secondary">
//               {params.row.category}
//             </Typography>
//           </Box>
//         </Box>
//       )
//     },
//     { 
//       field: 'priority', 
//       headerName: 'Priority', 
//       width: 120,
//       renderCell: (params) => (
//         <Chip
//           label={params.value || 'Medium'}
//           size="small"
//           sx={{
//             backgroundColor: priorityColors[params.value || 'Medium'] + '20',
//             color: priorityColors[params.value || 'Medium'],
//             fontWeight: 500,
//             width: '100%',
//             '& .MuiChip-label': {
//               px: 1,
//             },
//           }}
//         />
//       )
//     },
//     { 
//       field: 'location', 
//       headerName: 'Location', 
//       width: 180,
//       renderCell: (params) => (
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           <LocationOn color="action" fontSize="small" sx={{ mr: 0.5 }} />
//           <Typography variant="body2" noWrap>
//             {params.value?.address?.split(',').slice(0, 2).join(',') || 'N/A'}
//           </Typography>
//         </Box>
//       )
//     },
//     {
//       field: 'department',
//       headerName: 'Department',
//       width: 150,
//       renderCell: (params) => (
//         <Chip
//           label={params.value || 'Unassigned'}
//           size="small"
//           variant="outlined"
//           sx={{
//             borderColor: theme.palette.primary.main,
//             color: theme.palette.primary.main,
//             '& .MuiChip-label': {
//               px: 1,
//             },
//           }}
//         />
//       )
//     },
//     {
//       field: 'status',
//       headerName: 'Status',
//       width: 160,
//       renderCell: (params) => (
//         <Chip
//           label={params.value}
//           size="small"
//           sx={{
//             backgroundColor: statusColors[params.value] + '1a',
//             color: statusColors[params.value],
//             fontWeight: 500,
//             minWidth: '80px',
//             maxWidth: '140px',
//             '& .MuiChip-label': {
//               px: 1,
//               whiteSpace: 'nowrap',
//               overflow: 'hidden',
//               textOverflow: 'ellipsis',
//               display: 'block',
//             },
//           }}
//         />
//       ),
//     },
//     {
//       field: 'actions',
//       type: 'actions',
//       headerName: 'Actions',
//       width: 120,
//       getActions: (params) => [
//         <Tooltip title="View Details" key="view">
//           <IconButton onClick={() => {
//             setSelectedIssue(params.row);
//             setShowIssueDetails(true);
//           }}>
//             <Visibility fontSize="small" />
//           </IconButton>
//         </Tooltip>,
//         <Tooltip title="Change Status" key="status">
//           <FormControl variant="standard" size="small" sx={{ minWidth: 120 }}>
//             <Select
//               value={params.row.status}
//               onChange={(e) => handleStatusChange(params.id, e.target.value)}
//               sx={{
//                 '&:before, &:after': { border: 'none !important' },
//                 '& .MuiSelect-select': { py: 0.5, px: 1, fontSize: '0.8125rem' }
//               }}
//             >
//               {statusOptions.map((status) => (
//                 <MenuItem key={status} value={status}>
//                   {status}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Tooltip>,
//       ],
//     },
//   ];

//   // Stats cards
//   const stats = [
//     { 
//       title: 'Total Reports', 
//       value: issues.length,
//       icon: Warning,
//       color: theme.palette.primary.main,
//       trend: '+12%',
//       trendColor: 'success.main'
//     },
//     { 
//       title: 'Pending', 
//       value: issues.filter(issue => issue.status === 'Pending').length,
//       icon: PendingActions,
//       color: '#ff9800',
//       trend: '+5%',
//       trendColor: 'error.main'
//     },
//     { 
//       title: 'In Progress', 
//       value: issues.filter(issue => issue.status === 'In Process').length,
//       icon: Build,
//       color: '#2196f3',
//       trend: '+8%',
//       trendColor: 'success.main'
//     },
//     { 
//       title: 'Resolved', 
//       value: issues.filter(issue => issue.status === 'Solved').length,
//       icon: CheckCircleOutline,
//       color: '#4caf50',
//       trend: '+15%',
//       trendColor: 'success.main'
//     },
//   ];

//   // Render the component
//   return (
//     <Box sx={{ p: 3 }}>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//         <Box>
//           <Typography variant="h4" fontWeight="bold" gutterBottom>
//             Admin Dashboard
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Welcome back! Here's what's happening with your reports.
//           </Typography>
//         </Box>
//         <Box display="flex" gap={1}>
//           <Button 
//             variant="outlined" 
//             startIcon={<Refresh />}
//             onClick={() => window.location.reload()}
//           >
//             Refresh
//           </Button>
//           <Button 
//             variant="contained" 
//             color="primary"
//             startIcon={<FilterList />}
//             onClick={() => setAnchorEl(document.getElementById('filter-button'))}
//             id="filter-button"
//           >
//             Filters
//           </Button>
//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={() => setAnchorEl(null)}
//             anchorOrigin={{
//               vertical: 'bottom',
//               horizontal: 'right',
//             }}
//             transformOrigin={{
//               vertical: 'top',
//               horizontal: 'right',
//             }}
//           >
//             <Box sx={{ p: 2, width: 300 }}>
//               <Typography variant="subtitle1" gutterBottom>Filters</Typography>
//               <FormControl fullWidth size="small" sx={{ mb: 2 }}>
//                 <InputLabel>Status</InputLabel>
//                 <Select
//                   multiple
//                   value={filters.status}
//                   onChange={(e) => handleFilterChange('status', e.target.value)}
//                   renderValue={(selected) => selected.join(', ')}
//                 >
//                   {statusOptions.map((status) => (
//                     <MenuItem key={status} value={status}>
//                       <Checkbox checked={filters.status.includes(status)} />
//                       <ListItemText primary={status} />
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
              
//               <FormControl fullWidth size="small" sx={{ mb: 2 }}>
//                 <InputLabel>Priority</InputLabel>
//                 <Select
//                   multiple
//                   value={filters.priority}
//                   onChange={(e) => handleFilterChange('priority', e.target.value)}
//                   renderValue={(selected) => selected.join(', ')}
//                 >
//                   {priorityLevels.map((level) => (
//                     <MenuItem key={level} value={level}>
//                       <Checkbox checked={filters.priority.includes(level)} />
//                       <ListItemText primary={level} />
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
              
//               <FormControl fullWidth size="small" sx={{ mb: 2 }}>
//                 <InputLabel>Department</InputLabel>
//                 <Select
//                   multiple
//                   value={filters.department}
//                   onChange={(e) => handleFilterChange('department', e.target.value)}
//                   renderValue={(selected) => selected.join(', ')}
//                 >
//                   {departments.map((dept) => (
//                     <MenuItem key={dept} value={dept}>
//                       <Checkbox checked={filters.department.includes(dept)} />
//                       <ListItemText primary={dept} />
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
              
//               <LocalizationProvider dateAdapter={AdapterDateFns}>
//                 <DatePicker
//                   label="From Date"
//                   value={filters.dateRange[0]}
//                   onChange={(date) => handleFilterChange('dateRange', [date, filters.dateRange[1]])}
//                   renderInput={(params) => <TextField {...params} size="small" fullWidth sx={{ mb: 2 }} />}
//                 />
//                 <DatePicker
//                   label="To Date"
//                   value={filters.dateRange[1]}
//                   onChange={(date) => handleFilterChange('dateRange', [filters.dateRange[0], date])}
//                   renderInput={(params) => <TextField {...params} size="small" fullWidth />}
//                 />
//               </LocalizationProvider>
              
//               <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
//                 <Button 
//                   size="small" 
//                   onClick={() => setFilters({
//                     status: [],
//                     priority: [],
//                     department: [],
//                     dateRange: [null, null],
//                     searchQuery: ''
//                   })}
//                 >
//                   Reset
//                 </Button>
//                 <Button 
//                   variant="contained" 
//                   size="small" 
//                   onClick={() => setAnchorEl(null)}
//                   sx={{ ml: 1 }}
//                 >
//                   Apply
//                 </Button>
//               </Box>
//             </Box>
//           </Menu>
//         </Box>
//       </Box>

//       {/* Search and Bulk Actions */}
//       <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <TextField
//           placeholder="Search reports..."
//           variant="outlined"
//           size="small"
//           value={filters.searchQuery}
//           onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
//           InputProps={{
//             startAdornment: <Search color="action" sx={{ mr: 1 }} />,
//             sx: { width: 300 }
//           }}
//         />
        
//         <Box>
//           {selectedIssues.length > 0 && (
//             <>
//               <Typography variant="body2" color="text.secondary" display="inline" mr={2}>
//                 {selectedIssues.length} selected
//               </Typography>
//               <Button
//                 variant="outlined"
//                 size="small"
//                 startIcon={<Assignment />}
//                 onClick={() => setShowBulkDialog(true)}
//                 sx={{ mr: 1 }}
//               >
//                 Bulk Actions
//               </Button>
//             </>
//           )}
//           <Button
//             variant="contained"
//             color="primary"
//             startIcon={<Send />}
//             onClick={() => {
//               setShowMessageDialog(true);
//               setMessageType('email');
//             }}
//           >
//             Send Update
//           </Button>
//         </Box>
//       </Box>

//       {/* Tabs */}
//       <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
//         <Tabs 
//           value={activeTab} 
//           onChange={(e, newValue) => setActiveTab(newValue)}
//           aria-label="dashboard tabs"
//         >
//           <Tab 
//             icon={<BarChartIcon fontSize="small" />} 
//             iconPosition="start"
//             label="Overview" 
//             value="overview" 
//           />
//           <Tab 
//             icon={<MapIcon fontSize="small" />}
//             iconPosition="start"
//             label="Map View" 
//             value="map" 
//           />
//           <Tab 
//             icon={<Assessment fontSize="small" />}
//             iconPosition="start"
//             label="Analytics" 
//             value="analytics" 
//           />
//           <Tab 
//             icon={<People fontSize="small" />}
//             iconPosition="start"
//             label="Users" 
//             value="users" 
//           />
//           <Tab 
//             icon={<AdminPanelSettings fontSize="small" />}
//             iconPosition="start"
//             label="Admin" 
//             value="admin" 
//           />
//         </Tabs>
//       </Box>

//       {/* Main Content */}
//       {activeTab === 'overview' && (
//         <>
//           {/* Stats Cards */}
//           <Box sx={{ 
//             display: 'grid', 
//             gap: 3, 
//             gridTemplateColumns: { 
//               xs: '1fr', 
//               sm: 'repeat(2, 1fr)', 
//               lg: 'repeat(4, 1fr)' 
//             }, 
//             mb: 4 
//           }}>
//             {stats.map((stat, index) => (
//               <Card key={index} variant="outlined" sx={{ 
//                 borderLeft: `4px solid ${stat.color}`,
//                 height: '100%',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 justifyContent: 'space-between',
//                 overflow: 'hidden'
//               }}>
//                 <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
//                   <Box display="flex" justifyContent="space-between" alignItems="flex-start">
//                     <Box sx={{ minWidth: 0 }}>
//                       <Typography 
//                         color="textSecondary" 
//                         variant="subtitle2" 
//                         gutterBottom
//                         noWrap  
//                         sx={{
//                           textOverflow: 'ellipsis',
//                           overflow: 'hidden'
//                         }}
//                       >
//                         {stat.title}
//                       </Typography>
//                       <Typography variant="h5" noWrap>{stat.value}</Typography>
//                       <Typography 
//                         variant="caption" 
//                         sx={{ 
//                           color: stat.trendColor,
//                           display: 'flex',
//                           alignItems: 'center',
//                           mt: 0.5,
//                           whiteSpace: 'nowrap',
//                           overflow: 'hidden',
//                           textOverflow: 'ellipsis'
//                         }}
//                       >
//                         {stat.trend} from last week
//                       </Typography>
//                     </Box>
//                     <Avatar sx={{ 
//                       bgcolor: stat.color + '20', 
//                       color: stat.color,
//                       ml: 1,
//                       flexShrink: 0  
//                     }}>
//                       <stat.icon />
//                     </Avatar>
//                   </Box>
//                 </CardContent>
//               </Card>
//             ))}
//           </Box>

//           {/* Charts Row */}
//           <Box sx={{ 
//             display: 'grid', 
//             gap: 3, 
//             gridTemplateColumns: { 
//               xs: '1fr', 
//               lg: '1fr 1fr' 
//             }, 
//             mb: 4 
//           }}>
//             <Paper sx={{ p: 2, height: 350, display: 'flex', flexDirection: 'column' }}>
//               <Typography variant="h6" gutterBottom>Reports by Status</Typography>
//               <Box sx={{ flex: 1, minHeight: 0 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={statusData}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       outerRadius={100}
//                       innerRadius={0}
//                       paddingAngle={1}
//                       dataKey="value"
//                       label={({ name, percent, cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
//                         const RADIAN = Math.PI / 180;
//                         // Calculate position for label
//                         const radius = 25 + outerRadius * 0.5;
//                         const x = cx + radius * Math.cos(-midAngle * RADIAN);
//                         const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        
//                         // Calculate position for line end (at pie edge)
//                         const lineEndX = cx + (outerRadius + 5) * Math.cos(-midAngle * RADIAN);
//                         const lineEndY = cy + (outerRadius + 5) * Math.sin(-midAngle * RADIAN);
                        
//                         // Calculate position for line start (slightly inside pie)
//                         const lineStartX = cx + (outerRadius - 5) * Math.cos(-midAngle * RADIAN);
//                         const lineStartY = cy + (outerRadius - 5) * Math.sin(-midAngle * RADIAN);
                        
//                         // Determine text anchor and position adjustments
//                         const isLeftSide = x < cx;
//                         const textAnchor = isLeftSide ? 'end' : 'start';
//                         const xOffset = isLeftSide ? -10 : 10;
                        
//                         // Adjust y-position for specific labels to prevent overlap
//                         let yOffset = 0;
//                         if (name === 'In Process') yOffset = 8;
//                         if (name === 'Solved') yOffset = -8;
//                         if (name === 'Pending') yOffset = -5;
//                         if (name === 'Rejected') yOffset = 5;
                        
//                         return (
//                           <g>
//                             {/* Connector line */}
//                             <line
//                               x1={lineStartX}
//                               y1={lineStartY}
//                               x2={lineEndX}
//                               y2={lineEndY}
//                               stroke="#888"
//                               strokeWidth={1}
//                             />
//                             <text
//                               x={x + xOffset}
//                               y={y + yOffset}
//                               fill="#333"
//                               textAnchor={textAnchor}
//                               dominantBaseline="central"
//                               style={{
//                                 fontSize: '12px',
//                                 fontWeight: 500,
//                                 pointerEvents: 'none',
//                                 textShadow: '0 0 3px white, 0 0 3px white, 0 0 3px white' // White shadow for better readability
//                               }}
//                             >
//                               {`${name} (${(percent * 100).toFixed(0)}%)`}
//                             </text>
//                           </g>
//                         );
//                       }}
//                     >
//                       {statusData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={statusColors[entry.name]} />
//                       ))}
//                     </Pie>
//                     <Legend />
//                     <RechartsTooltip 
//                       formatter={(value, name) => [value, name]}
//                       labelFormatter={(name) => `Status: ${name}`}
//                     />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </Box>
//             </Paper>

//             <Paper sx={{ p: 2, height: 300 }}>
//               <Typography variant="h6" gutterBottom>Reports by Department</Typography>
//               <ResponsiveContainer width="100%" height="90%">
//                 <BarChart
//                   data={departmentData}
//                   margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//                   layout="vertical"
//                 >
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis type="number" />
//                   <YAxis dataKey="name" type="category" width={100} />
//                   <RechartsTooltip />
//                   <Bar dataKey="count" fill={theme.palette.primary.main} name="Reports" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </Paper>
//           </Box>

//           {/* Recent Reports Table */}
//           <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//               <Typography variant="h6" component="h2">
//                 Recent Reports
//               </Typography>
//               <Box>
//                 <Typography variant="body2" color="text.secondary" display="inline" mr={2}>
//                   Total: {filteredIssues.length} issues
//                 </Typography>
//                 <Button 
//                   size="small" 
//                   startIcon={<Notifications />}
//                   onClick={() => {
//                     setShowMessageDialog(true);
//                     setMessageType('notification');
//                   }}
//                 >
//                   Notify Users
//                 </Button>
//               </Box>
//             </Box>
            
//             <div style={{ height: 500, width: '100%' }}>
//               <DataGrid
//                 rows={filteredIssues}
//                 columns={columns}
//                 pageSize={7}
//                 rowsPerPageOptions={[7, 15, 25]}
//                 checkboxSelection
//                 disableSelectionOnClick
//                 onSelectionModelChange={handleRowSelection}
//                 selectionModel={selectedIssues}
//                 getRowHeight={() => 'auto'}
//                 onSortModelChange={(model) => setSortModel(model)}
//                 sortModel={sortModel}
//                 sx={{
//                   border: 'none',
//                   '& .MuiDataGrid-cell': {
//                     padding: '12px 16px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
//                   },
//                   '& .MuiDataGrid-columnHeaders': {
//                     backgroundColor: theme.palette.mode === 'light' ? '#f8f9fa' : '#1e1e1e',
//                     borderRadius: '8px 8px 0 0',
//                     borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
//                   },
//                   '& .MuiDataGrid-columnHeaderTitle': {
//                     fontWeight: 600,
//                   },
//                   '& .MuiDataGrid-row:hover': {
//                     backgroundColor: theme.palette.action.hover,
//                   },
//                 }}
//               />
//             </div>
//           </Paper>
//         </>
//       )}

//       {activeTab === 'map' && (
//         <Paper sx={{ p: 3, height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//           <Box textAlign="center">
//             <MapIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
//             <Typography variant="h6" color="text.secondary" gutterBottom>
//               Interactive Map View
//             </Typography>
//             <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//               This is where you would see a map with issue locations and hotspots.
//             </Typography>
//             <Button variant="outlined" startIcon={<Timeline />}>
//               View Hotspots
//             </Button>
//           </Box>
//         </Paper>
//       )}

//       {activeTab === 'analytics' && (
//         <Box>
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={6}>
//               <Paper sx={{ p: 3, height: 400 }}>
//                 <Typography variant="h6" gutterBottom>Response Times by Department</Typography>
//                 <ResponsiveContainer width="100%" height="90%">
//                   <BarChart
//                     data={[
//                       { name: 'Sanitation', avgTime: 12, target: 24 },
//                       { name: 'Public Works', avgTime: 18, target: 24 },
//                       { name: 'Electricity', avgTime: 8, target: 24 },
//                       { name: 'Water', avgTime: 30, target: 24 },
//                       { name: 'Transportation', avgTime: 15, target: 24 },
//                     ]}
//                     margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
//                     <RechartsTooltip />
//                     <Legend />
//                     <Bar dataKey="avgTime" name="Average Response Time" fill="#8884d8" />
//                     <Bar dataKey="target" name="Target" fill="#82ca9d" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </Paper>
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <Paper sx={{ p: 3, height: 400 }}>
//                 <Typography variant="h6" gutterBottom>Issues Trend (Last 30 Days)</Typography>
//                 <ResponsiveContainer width="100%" height="90%">
//                   <LineChart
//                     data={[
//                       { name: 'Day 1', reported: 4, resolved: 2 },
//                       { name: 'Day 2', reported: 3, resolved: 1 },
//                       { name: 'Day 3', reported: 6, resolved: 3 },
//                       { name: 'Day 4', reported: 2, resolved: 4 },
//                       { name: 'Day 5', reported: 5, resolved: 2 },
//                       { name: 'Day 6', reported: 3, resolved: 3 },
//                       { name: 'Day 7', reported: 4, resolved: 5 },
//                     ]}
//                     margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <RechartsTooltip />
//                     <Legend />
//                     <Line type="monotone" dataKey="reported" name="Reported" stroke="#8884d8" />
//                     <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#82ca9d" />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </Paper>
//             </Grid>
//             <Grid item xs={12}>
//               <Paper sx={{ p: 3 }}>
//                 <Typography variant="h6" gutterBottom>Category Distribution</Typography>
//                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
//                   {categoryData.map((category, index) => (
//                     <Box key={index} sx={{ flex: '1 1 200px' }}>
//                       <Box display="flex" justifyContent="space-between" mb={1}>
//                         <Typography variant="body2">{category.name}</Typography>
//                         <Typography variant="body2" fontWeight="500">
//                           {Math.round((category.count / issues.length) * 100)}%
//                         </Typography>
//                       </Box>
//                       <Box sx={{ width: '100%', height: 8, bgcolor: 'divider', borderRadius: 4, overflow: 'hidden' }}>
//                         <Box 
//                           sx={{ 
//                             height: '100%', 
//                             bgcolor: `hsl(${index * 70}, 70%, 50%)`,
//                             width: `${(category.count / Math.max(...categoryData.map(c => c.count))) * 100}%` 
//                           }} 
//                         />
//                       </Box>
//                       <Box display="flex" justifyContent="space-between" mt={0.5}>
//                         <Typography variant="caption" color="text.secondary">
//                           {category.count} issues
//                         </Typography>
//                         <Typography variant="caption" color="text.secondary">
//                           {Math.round((category.count / issues.length) * 100)}%
//                         </Typography>
//                       </Box>
//                     </Box>
//                   ))}
//                 </Box>
//               </Paper>
//             </Grid>
//           </Grid>
//         </Box>
//       )}

//       {activeTab === 'users' && (
//         <Paper sx={{ p: 3, minHeight: '60vh' }}>
//           <Typography variant="h6" gutterBottom>User Management</Typography>
//           <Typography color="text.secondary" paragraph>
//             User management functionality will be implemented here.
//           </Typography>
//           <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 3 }}>
//             <Card sx={{ p: 2, width: 200, textAlign: 'center' }}>
//               <People color="primary" sx={{ fontSize: 40, mb: 1 }} />
//               <Typography variant="h5">1,245</Typography>
//               <Typography variant="body2" color="text.secondary">Total Users</Typography>
//             </Card>
//             <Card sx={{ p: 2, width: 200, textAlign: 'center' }}>
//               <Person color="primary" sx={{ fontSize: 40, mb: 1 }} />
//               <Typography variant="h5">1,023</Typography>
//               <Typography variant="body2" color="text.secondary">Citizens</Typography>
//             </Card>
//             <Card sx={{ p: 2, width: 200, textAlign: 'center' }}>
//               <Security color="primary" sx={{ fontSize: 40, mb: 1 }} />
//               <Typography variant="h5">222</Typography>
//               <Typography variant="body2" color="text.secondary">Staff Members</Typography>
//             </Card>
//           </Box>
//         </Paper>
//       )}

//       {activeTab === 'admin' && (
//         <Paper sx={{ p: 3, minHeight: '60vh' }}>
//           <Typography variant="h6" gutterBottom>Administration</Typography>
//           <Typography color="text.secondary" paragraph>
//             Administrative controls and settings will be available here.
//           </Typography>
//           <Grid container spacing={3} sx={{ mt: 2 }}>
//             <Grid item xs={12} md={6} lg={4}>
//               <Card variant="outlined" sx={{ height: '100%' }}>
//                 <CardContent>
//                   <Box display="flex" alignItems="center" mb={2}>
//                     <Settings color="primary" sx={{ mr: 1 }} />
//                     <Typography variant="h6">System Settings</Typography>
//                   </Box>
//                   <Button fullWidth variant="outlined" sx={{ mb: 1 }}>General Settings</Button>
//                   <Button fullWidth variant="outlined" sx={{ mb: 1 }}>Email Templates</Button>
//                   <Button fullWidth variant="outlined">API Keys</Button>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={12} md={6} lg={4}>
//               <Card variant="outlined" sx={{ height: '100%' }}>
//                 <CardContent>
//                   <Box display="flex" alignItems="center" mb={2}>
//                     <AdminPanelSettings color="primary" sx={{ mr: 1 }} />
//                     <Typography variant="h6">User Roles</Typography>
//                   </Box>
//                   <Button fullWidth variant="outlined" sx={{ mb: 1 }}>Manage Roles</Button>
//                   <Button fullWidth variant="outlined" sx={{ mb: 1 }}>Permissions</Button>
//                   <Button fullWidth variant="outlined">Audit Logs</Button>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={12} md={6} lg={4}>
//               <Card variant="outlined" sx={{ height: '100%' }}>
//                 <CardContent>
//                   <Box display="flex" alignItems="center" mb={2}>
//                     <BarChartIcon color="primary" sx={{ mr: 1 }} />
//                     <Typography variant="h6">Reports</Typography>
//                   </Box>
//                   <Button fullWidth variant="outlined" sx={{ mb: 1 }}>Generate Report</Button>
//                   <Button fullWidth variant="outlined" sx={{ mb: 1 }}>Export Data</Button>
//                   <Button fullWidth variant="outlined">Backup Database</Button>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         </Paper>
//       )}

//       {/* Bulk Action Dialog */}
//       <Dialog open={showBulkDialog} onClose={() => setShowBulkDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>Bulk Actions</DialogTitle>
//         <DialogContent>
//           <Typography variant="body1" paragraph>
//             You have selected {selectedIssues.length} issues. What would you like to do with them?
//           </Typography>
          
//           <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
//             <InputLabel>Action</InputLabel>
//             <Select
//               value={bulkAction}
//               onChange={(e) => setBulkAction(e.target.value)}
//               label="Action"
//             >
//               <MenuItem value="">
//                 <em>Select an action</em>
//               </MenuItem>
//               <MenuItem value="In Process">Mark as In Process</MenuItem>
//               <MenuItem value="Assigned">Assign to Department</MenuItem>
//               <MenuItem value="Solved">Mark as Solved</MenuItem>
//               <MenuItem value="Rejected">Reject Selected</MenuItem>
//             </Select>
//           </FormControl>
          
//           {bulkAction === 'Assigned' && (
//             <FormControl fullWidth variant="outlined" size="small">
//               <InputLabel>Department</InputLabel>
//               <Select
//                 value={filters.department[0] || ''}
//                 onChange={(e) => handleFilterChange('department', [e.target.value])}
//                 label="Department"
//               >
//                 {departments.map((dept) => (
//                   <MenuItem key={dept} value={dept}>{dept}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setShowBulkDialog(false)}>Cancel</Button>
//           <Button 
//             onClick={handleBulkAction} 
//             variant="contained" 
//             color="primary"
//             disabled={!bulkAction || (bulkAction === 'Assigned' && !filters.department.length)}
//           >
//             Apply to {selectedIssues.length} Issues
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Issue Details Dialog */}
//       <Dialog 
//         open={showIssueDetails} 
//         onClose={() => setShowIssueDetails(false)} 
//         maxWidth="md" 
//         fullWidth
//       >
//         {selectedIssue && (
//           <>
//             <DialogTitle>Issue Details</DialogTitle>
//             <DialogContent>
//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={8}>
//                   <Typography variant="h6" gutterBottom>{selectedIssue.title}</Typography>
//                   <Typography variant="body1" paragraph>{selectedIssue.description}</Typography>
                  
//                   <Box sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
//                     <Typography variant="subtitle2" gutterBottom>Location</Typography>
//                     <Typography>{selectedIssue.location?.address || 'Location not specified'}</Typography>
                    
//                     <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
//                       <Chip 
//                         label={selectedIssue.status} 
//                         size="small" 
//                         sx={{ 
//                           backgroundColor: statusColors[selectedIssue.status] + '1a',
//                           color: statusColors[selectedIssue.status],
//                           fontWeight: 500,
//                           minWidth: '80px',
//                           '& .MuiChip-label': {
//                             px: 1,
//                             whiteSpace: 'nowrap',
//                             overflow: 'hidden',
//                             textOverflow: 'ellipsis',
//                             display: 'block',
//                           },
//                         }} 
//                       />
//                       <Chip 
//                         label={selectedIssue.priority || 'Medium'} 
//                         size="small" 
//                         variant="outlined"
//                         sx={{ 
//                           borderColor: priorityColors[selectedIssue.priority || 'Medium'], 
//                           color: priorityColors[selectedIssue.priority || 'Medium'] 
//                         }} 
//                       />
//                       {selectedIssue.department && (
//                         <Chip 
//                           label={selectedIssue.department} 
//                           size="small" 
//                           variant="outlined"
//                           color="primary"
//                         />
//                       )}
//                     </Box>
//                   </Box>
                  
//                   <Box sx={{ mb: 3 }}>
//                     <Typography variant="subtitle2" gutterBottom>Attachments</Typography>
//                     <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
//                       {selectedIssue.images?.length > 0 ? (
//                         selectedIssue.images.map((img, idx) => (
//                           <Box 
//                             key={idx} 
//                             sx={{ 
//                               width: 100, 
//                               height: 100, 
//                               borderRadius: 1, 
//                               overflow: 'hidden',
//                               border: '1px solid',
//                               borderColor: 'divider'
//                             }}
//                           >
//                             <img 
//                               src={img} 
//                               alt={`Attachment ${idx + 1}`} 
//                               style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
//                             />
//                           </Box>
//                         ))
//                       ) : (
//                         <Typography variant="body2" color="text.secondary">No attachments</Typography>
//                       )}
//                     </Box>
//                   </Box>
                  
//                   <Box>
//                     <Typography variant="subtitle2" gutterBottom>Update Status</Typography>
//                     <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
//                       {statusOptions.map((status) => (
//                         <Button
//                           key={status}
//                           variant={selectedIssue.status === status ? 'contained' : 'outlined'}
//                           size="small"
//                           onClick={() => {
//                             handleStatusChange(selectedIssue.id, status);
//                             setSelectedIssue({ ...selectedIssue, status });
//                           }}
//                           sx={{ 
//                             textTransform: 'none',
//                             ...(selectedIssue.status === status && {
//                               bgcolor: statusColors[status],
//                               '&:hover': { bgcolor: statusColors[status] }
//                             })
//                           }}
//                         >
//                           {status}
//                         </Button>
//                       ))}
//                     </Box>
//                   </Box>
//                 </Grid>
//                 <Grid item xs={12} md={4}>
//                   <Card variant="outlined" sx={{ mb: 2 }}>
//                     <CardContent>
//                       <Typography variant="subtitle2" gutterBottom>Details</Typography>
//                       <Box sx={{ '& > div': { mb: 1 } }}>
//                         <div><strong>Reported:</strong> {new Date(selectedIssue.date).toLocaleDateString()}</div>
//                         <div><strong>Category:</strong> {selectedIssue.category || 'N/A'}</div>
//                         <div><strong>Department:</strong> {selectedIssue.department || 'Unassigned'}</div>
//                         <div><strong>Priority:</strong> {selectedIssue.priority || 'Medium'}</div>
//                       </Box>
//                     </CardContent>
//                   </Card>
                  
//                   <Card variant="outlined">
//                     <CardContent>
//                       <Typography variant="subtitle2" gutterBottom>Reporter</Typography>
//                       <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                         <Avatar sx={{ width: 40, height: 40, mr: 1.5 }}>
//                           {selectedIssue.reporter?.name?.[0] || 'U'}
//                         </Avatar>
//                         <Box>
//                           <Typography variant="body2" fontWeight={500}>
//                             {selectedIssue.reporter?.name || 'Anonymous User'}
//                           </Typography>
//                           <Typography variant="caption" color="text.secondary">
//                             {selectedIssue.reporter?.email || 'No contact information'}
//                           </Typography>
//                         </Box>
//                       </Box>
//                       <Button 
//                         fullWidth 
//                         variant="outlined" 
//                         size="small" 
//                         startIcon={<Email />}
//                         onClick={() => {
//                           setShowMessageDialog(true);
//                           setMessageType('email');
//                           setShowIssueDetails(false);
//                         }}
//                       >
//                         Send Message
//                       </Button>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               </Grid>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setShowIssueDetails(false)}>Close</Button>
//               <Button 
//                 variant="contained" 
//                 color="primary"
//                 onClick={() => {
//                   setShowIssueDetails(false);
//                   setSelectedIssues([selectedIssue.id]);
//                   setShowBulkDialog(true);
//                 }}
//               >
//                 Take Action
//               </Button>
//             </DialogActions>
//           </>
//         )}
//       </Dialog>

//       {/* Message Dialog */}
//       <Dialog 
//         open={showMessageDialog} 
//         onClose={() => setShowMessageDialog(false)} 
//         maxWidth="sm" 
//         fullWidth
//       >
//         <DialogTitle>
//           {messageType === 'email' ? 'Send Email Update' : 'Send Notification'}
//         </DialogTitle>
//         <DialogContent>
//           <Box sx={{ mt: 2, mb: 3 }}>
//             <FormControl fullWidth sx={{ mb: 2 }}>
//               <InputLabel>Recipients</InputLabel>
//               <Select
//                 multiple
//                 value={selectedIssues.length > 0 ? ['selected'] : ['all']}
//                 renderValue={(selected) => {
//                   if (selected.includes('selected')) {
//                     return `${selectedIssues.length} selected issues`;
//                   }
//                   return 'All users';
//                 }}
//               >
//                 <MenuItem value="all">All Users</MenuItem>
//                 <MenuItem value="selected" disabled={selectedIssues.length === 0}>
//                   {selectedIssues.length} Selected Issues
//                 </MenuItem>
//                 <MenuItem value="department">By Department</MenuItem>
//               </Select>
//             </FormControl>
            
//             <TextField
//               label="Subject"
//               fullWidth
//               margin="normal"
//               variant="outlined"
//             />
            
//             <TextField
//               label="Message"
//               fullWidth
//               multiline
//               rows={6}
//               margin="normal"
//               variant="outlined"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder={`Type your ${messageType === 'email' ? 'email' : 'notification'} message here...`}
//             />
            
//             <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//               <AttachFile fontSize="small" color="action" />
//               <Typography variant="body2" color="text.secondary">
//                 Attach files (optional)
//               </Typography>
//             </Box>
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setShowMessageDialog(false)}>Cancel</Button>
//           <Button 
//             variant="contained" 
//             color="primary"
//             onClick={() => {
//               setShowMessageDialog(false);
//               showSnackbar(
//                 messageType === 'email' 
//                   ? 'Email sent successfully' 
//                   : 'Notification sent successfully',
//                 'success'
//               );
//             }}
//           >
//             {messageType === 'email' ? 'Send Email' : 'Send Notification'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar for notifications */}
//       <Snackbar 
//         open={snackbar.open} 
//         autoHideDuration={6000} 
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert 
//           onClose={() => setSnackbar({ ...snackbar, open: false })} 
//           severity={snackbar.severity}
//           sx={{ width: '100%' }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default AdminDashboard;



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

