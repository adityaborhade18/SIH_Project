import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Box,
  Card,
  CardContent,
  CardActions,
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
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Sort as SortIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const statuses = ['All', 'Pending', 'In Progress', 'Resolved', 'Completed'];
const priorities = ['All', 'Low', 'Medium', 'High'];
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'priority', label: 'Priority' },
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

  // Fetch issues from API
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/user/getallissue');
        setIssues(res.data.issues || []);
      } catch (err) {
        console.error('Error fetching issues:', err);
        setIssues([]);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(1);
  };

  const handlePriorityFilterChange = (event) => {
    setPriorityFilter(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRefresh = () => {
    setLoading(true);
    // Refetch data
    const fetchIssues = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/user/getallissue');
        setIssues(res.data.issues || []);
      } catch (err) {
        console.error('Error fetching issues:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  };

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

const parseLocationData = (location) => {
  if (!location) return {};

  if (location.type === 'Point' && Array.isArray(location.coordinates) && location.coordinates.length === 2) {
    const [lng, lat] = location.coordinates; // GeoJSON order
    return {
      ...location,
      lat,                 // latitude
      lng,                 // longitude
      latLng: [lat, lng],  // for maps
      address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`,
    };
  }
  return location;
};






  // Filter, search, sort
  const filteredIssues = issues
    .filter(issue => {
      const matchesSearch =
        issue.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || issue.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'priority') {
        const order = { High: 3, Medium: 2, Low: 1 };
        return (order[b.priority] || 0) - (order[a.priority] || 0);
      }
      return 0;
    });

  // Pagination
  const count = Math.ceil(filteredIssues.length / itemsPerPage);
  const paginatedIssues = filteredIssues.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
      <CircularProgress size={60} thickness={4} />
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Track Issues
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor and manage all reported issues in one place
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/report-issue')}
          sx={{
            minWidth: 180,
            height: 48,
            fontWeight: 600,
            boxShadow: 2,
            '&:hover': {
              boxShadow: 4,
            }
          }}
        >
          Report New Issue
        </Button>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ mb: 5 }}>
        <Box display="flex" flexWrap="wrap" gap={3} alignItems="center" mb={3}>
          <TextField
            placeholder="Search issues by title or description..."
            variant="outlined"
            size="medium"
            value={searchTerm}
            onChange={handleSearch}
            sx={{
              flexGrow: 1,
              maxWidth: 500,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              )
            }}
          />

          {!isMobile && (
            <Box display="flex" gap={2} alignItems="center">
              <FormControl size="medium" sx={{ minWidth: 180 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  label="Status"
                  sx={{ borderRadius: 2 }}
                >
                  {statuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl size="medium" sx={{ minWidth: 150 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priorityFilter}
                  onChange={handlePriorityFilterChange}
                  label="Priority"
                  sx={{ borderRadius: 2 }}
                >
                  {priorities.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl size="medium" sx={{ minWidth: 180 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={handleSortChange}
                  label="Sort By"
                  sx={{ borderRadius: 2 }}
                >
                  {sortOptions.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                </Select>
              </FormControl>

              <IconButton
                onClick={handleRefresh}
                title="Refresh"
                sx={{
                  bgcolor: 'background.default',
                  border: 1,
                  borderColor: 'divider',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          )}

          {isMobile && (
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={() => setShowFilters(!showFilters)}
                sx={{ minWidth: 120 }}
              >
                Filters
              </Button>
              <IconButton
                onClick={handleRefresh}
                title="Refresh"
                sx={{
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        {isMobile && showFilters && (
          <Box sx={{
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            mb: 3,
            border: 1,
            borderColor: 'divider',
            boxShadow: 1
          }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="medium">
                  <InputLabel>Status</InputLabel>
                  <Select value={statusFilter} onChange={handleStatusFilterChange} label="Status">
                    {statuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="medium">
                  <InputLabel>Priority</InputLabel>
                  <Select value={priorityFilter} onChange={handlePriorityFilterChange} label="Priority">
                    {priorities.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size="medium">
                  <InputLabel>Sort By</InputLabel>
                  <Select value={sortBy} onChange={handleSortChange} label="Sort By">
                    {sortOptions.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>

      {/* Result Count and Stats */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="body1" color="text.secondary" fontWeight={500}>
          Showing {paginatedIssues.length > 0 ? (page - 1) * itemsPerPage + 1 : 0} -
          {Math.min(page * itemsPerPage, filteredIssues.length)} of {filteredIssues.length} issues
        </Typography>
        {filteredIssues.length > 0 && (
          <Chip
            label={`${filteredIssues.length} total`}
            size="small"
            variant="outlined"
            color="primary"
          />
        )}
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Issues List */}
      <Box mb={6}>
        {paginatedIssues.length > 0 ? (
          <Grid container spacing={3}>
            {paginatedIssues.map(issue => {
              const loc = parseLocationData(issue.location);

              return (
                <Grid item xs={12} key={issue._id}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: 6,
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      {/* Header Section */}
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2.5}>
                        <Box flex={1}>
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            gutterBottom
                            sx={{
                              lineHeight: 1.3,
                              mb: 1.5
                            }}
                          >
                            {issue.title}
                          </Typography>

                          <Box display="flex" gap={1.5} flexWrap="wrap" mb={2}>
                            <Chip
                              label={issue.status}
                              size="medium"
                              color={getStatusColor(issue.status)}
                              variant="filled"
                              sx={{ fontWeight: 600 }}
                            />
                            <Chip
                              label={issue.priority}
                              size="medium"
                              color={getPriorityColor(issue.priority)}
                              variant="filled"
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                        </Box>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            bgcolor: 'background.default',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            fontWeight: 500,
                            ml: 2
                          }}
                        >
                          #{issue._id?.slice(-8).toUpperCase()}
                        </Typography>
                      </Box>

                      {/* Description */}
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        paragraph
                        sx={{
                          lineHeight: 1.6,
                          mb: 3
                        }}
                      >
                        {issue.description.length > 250
                          ? `${issue.description.substring(0, 250)}...`
                          : issue.description
                        }
                      </Typography>

                      {/* Metadata */}
                      <Box display="flex" flexWrap="wrap" gap={3} alignItems="center">
                       {loc.address && (
  <Box display="flex" alignItems="center">
    <LocationIcon fontSize="small" color="action" sx={{ mr: 1 }} />
    <Typography variant="body2" color="text.secondary">
      {loc.address}
    </Typography>
  </Box>
)}


                        <Box display="flex" alignItems="center">
                          <CalendarIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            Reported on {format(new Date(issue.createdAt), 'MMM d, yyyy')}
                          </Typography>
                        </Box>

                        {/* Optional: Display coordinates for verification */}
                        {process.env.NODE_ENV === 'development' && loc.coordinates && (
                          <Box display="flex" alignItems="center">
                            <LocationIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                            <Typography variant="caption" color="text.secondary">
                              Corrected: Lat: {loc.latitude?.toFixed(6)}, Lng: {loc.longitude?.toFixed(6)}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </CardContent>

                    <CardActions sx={{
                      px: 4,
                      pb: 3,
                      pt: 0,
                      justifyContent: 'flex-end'
                    }}>
                      <Button
                        variant="outlined"
                        size="medium"
                        onClick={() => navigate(`/issue/${issue._id}`)}
                        sx={{ minWidth: 120, fontWeight: 600, borderRadius: 2 }}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Box textAlign="center" py={10}>
            <Typography variant="h5" color="text.secondary" gutterBottom fontWeight={500}>
              No issues found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search or filter criteria
            </Typography>
          </Box>
        )}
      </Box>

      {/* Pagination */}
      {filteredIssues.length > itemsPerPage && (
        <Box display="flex" justifyContent="center" mt={6}>
          <Pagination
            count={count}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: 2,
                fontWeight: 600,
              }
            }}
          />
        </Box>
      )}
    </Container>
  );
};

export default IssueTracker;