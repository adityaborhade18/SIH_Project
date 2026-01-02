import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  Container,
  Typography,
  TextField,
  Box,
  Button,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  useMediaQuery,
  useTheme,
  IconButton,
  InputAdornment,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip
} from '@mui/material';

import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

import { format } from 'date-fns';

// Filters
const statuses = ['All', 'Pending', 'In Progress', 'Resolved', 'Completed'];
const priorities = ['All', 'Low', 'Medium', 'High'];
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'priority', label: 'Priority' }
];

const IssueTracker = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 6;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  // Fetch issues
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/user/myissues');
        console.log("API Response:", res.data);
        setIssues(res.data.userIssues || []);
      } catch (err) {
        console.error('Error fetching issues:', err);
        setIssues([]);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  // Helpers
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'primary';
      case 'in progress': return 'secondary';
      case 'resolved':
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const parseLocationData = (loc) => {
    if (!loc) return { address: 'Unknown', coordinates: [] };
    if (loc.address) return loc;
    if (Array.isArray(loc.coordinates)) {
      const [lng, lat] = loc.coordinates;
      return {
        ...loc,
        address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`
      };
    }
    return { address: 'Unknown', coordinates: [] };
  };

  // Filter + Search + Sort
  const filteredIssues = issues
    .filter((issue) => {
      const matchText =
        issue.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'All' || issue.status === statusFilter;
      const matchPriority = priorityFilter === 'All' || issue.priority === priorityFilter;

      return matchText && matchStatus && matchPriority;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'priority') {
        const weight = { High: 3, Medium: 2, Low: 1 };
        return (weight[b.priority] || 0) - (weight[a.priority] || 0);
      }
      return 0;
    });

  const count = Math.ceil(filteredIssues.length / itemsPerPage);
  const paginatedIssues = filteredIssues.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Loading screen
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  // No issues found
   // No issues found
// No issues found
if (!loading && issues.length === 0) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex items-center justify-center px-4 py-16 sm:py-24">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden mx-auto">
          <div className="p-8 sm:p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
              <svg 
                className="w-14 h-14 text-blue-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="1.5" 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No Issues Found</h2>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              You haven't reported any issues yet. Let's get started by reporting your first issue!
            </p>
            <button
              onClick={() => navigate('/report-issue')}
              className="relative inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span className="mr-2">Report New Issue</span>
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          </div>
          <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Having trouble? <span className="text-blue-600 hover:underline cursor-pointer">View our help guide</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      {/* Header */}
   <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 3,
    py: 6,              // similar to py-10 (tailwind)
    px: 1,
  }}
>
  {/* Left Text Section */}
  <Box sx={{ flex: 1, minWidth: 250 }}>
    <Typography
      variant="h4"
      fontWeight={800}
      sx={{
        letterSpacing: "0.5px",
        color: "#1f2937",
      }}
    >
      Track Issues
    </Typography>

    <Typography
      color="text.secondary"
      sx={{ mt: 0.5, fontSize: "1rem" }}
    >
      Manage and monitor all reported issues easily
    </Typography>
  </Box>

  {/* Right Button */}
  <Button
    variant="contained"
    size="large"
    onClick={() => navigate("/report-issue")}
    sx={{
      px: 4,
      py: 1.4,
      borderRadius: 3,
      fontWeight: 700,
      fontSize: "1rem",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      textTransform: "none",
      whiteSpace: "nowrap",
    }}
  >
    + Report New Issue
  </Button>
</Box>


{/* Search + Filters */}
<Box
  sx={{
    mb: 4,
    p: 3,
    borderRadius: 3,
    background: "#ffffff",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    border: "1px solid #e5e7eb"
  }}
>
  {/* Search Row */}
  <Box
    display="flex"
    gap={2}
    flexWrap="wrap"
    alignItems="center"
    mb={2}
  >
    <TextField
      placeholder="Search issues..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      size="medium"
      fullWidth={isMobile}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
        sx: {
          borderRadius: 3,
        }
      }}
      sx={{ flexGrow: 1, maxWidth: isMobile ? "100%" : 450 }}
    />

    {/* Desktop Filters */}
    {!isMobile && (
      <>
        <FormControl size="medium" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ borderRadius: 3 }}
          >
            {statuses.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="medium" sx={{ minWidth: 150 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={priorityFilter}
            label="Priority"
            onChange={(e) => setPriorityFilter(e.target.value)}
            sx={{ borderRadius: 3 }}
          >
            {priorities.map((p) => (
              <MenuItem key={p} value={p}>{p}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="medium" sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
            sx={{ borderRadius: 3 }}
          >
            {sortOptions.map((o) => (
              <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <IconButton
          onClick={() => window.location.reload()}
          sx={{
            bgcolor: "#f3f4f6",
            borderRadius: 2,
            "&:hover": { bgcolor: "#e5e7eb" }
          }}
        >
          <RefreshIcon />
        </IconButton>
      </>
    )}

    {/* Mobile Filters Button */}
    {isMobile && (
      <Button
        variant="outlined"
        startIcon={<FilterListIcon />}
        onClick={() => setShowFilters(!showFilters)}
        sx={{
          borderRadius: 3,
          px: 2.5,
          py: 1.1,
          fontWeight: 600
        }}
      >
        Filters
      </Button>
    )}
  </Box>

  {/* Mobile Expand Filters */}
  {isMobile && showFilters && (
    <Box
      mt={2}
      p={2.5}
      borderRadius={3}
      sx={{
        border: "1px solid #e5e7eb",
        background: "#fafafa",
        transition: "0.3s",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ borderRadius: 3 }}
            >
              {statuses.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priorityFilter}
              label="Priority"
              onChange={(e) => setPriorityFilter(e.target.value)}
              sx={{ borderRadius: 3 }}
            >
              {priorities.map((p) => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
              sx={{ borderRadius: 3 }}
            >
              {sortOptions.map((o) => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  )}
</Box>


      <Divider sx={{ my: 3 }} />

      {/* TABLE LIST */}
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f1f1f1" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Issue ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Priority</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Location</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Created</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedIssues.map((issue) => {
              const loc = parseLocationData(issue.location);

              return (
                <TableRow
                  key={issue._id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate(`/issue/${issue._id}`)}
                >
                  <TableCell>
                    <Tooltip title={issue._id}>
                      #{issue._id.slice(-8).toUpperCase()}
                    </Tooltip>
                  </TableCell>

                  <TableCell>{issue.title}</TableCell>

                  <TableCell>
                    <Chip
                      label={issue.status}
                      color={getStatusColor(issue.status)}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={issue.priority}
                      color={getPriorityColor(issue.priority)}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <LocationIcon sx={{ mr: 1 }} fontSize="small" />
                      {loc.address}
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <CalendarIcon sx={{ mr: 1 }} fontSize="small" />
                      {format(new Date(issue.createdAt), "MMM d, yyyy")}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={count}
          page={page}
          color="primary"
          onChange={(e, value) => setPage(value)}
        />
      </Box>
    </Container>
  );
};

export default IssueTracker;
