import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Divider,
  IconButton,
  InputAdornment,
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

// Mock data - in a real app, this would come from an API
const mockIssues = [
  {
    id: 'REP-1001',
    title: 'Pothole on Main Street',
    description: 'Large pothole near the intersection of Main Street and 1st Avenue, causing traffic issues.',
    category: 'Pothole',
    status: 'In Progress',
    priority: 'High',
    dateReported: '2023-11-15T09:30:00',
    lastUpdated: '2023-11-16T14:20:00',
    location: 'Main Street & 1st Avenue',
    image: 'https://example.com/images/pothole.jpg',
  },
  {
    id: 'REP-1002',
    title: 'Broken Streetlight',
    description: 'Streetlight not working on Oak Street between 5th and 6th Avenue.',
    category: 'Broken Streetlight',
    status: 'Reported',
    priority: 'Medium',
    dateReported: '2023-11-16T18:45:00',
    lastUpdated: '2023-11-16T18:45:00',
    location: 'Oak Street, Block 5-6',
    image: 'https://example.com/images/streetlight.jpg',
  },
  {
    id: 'REP-1003',
    title: 'Garbage Overflow',
    description: 'Public trash bin is overflowing near Central Park entrance.',
    category: 'Garbage Collection',
    status: 'Completed',
    priority: 'Low',
    dateReported: '2023-11-14T11:15:00',
    lastUpdated: '2023-11-15T10:30:00',
    location: 'Central Park Main Entrance',
    image: 'https://example.com/images/trash.jpg',
  },
];

const statuses = ['All', 'Reported', 'In Progress', 'Resolved', 'Completed'];
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
  const itemsPerPage = 5;
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  // In a real app, this would be an API call
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setIssues(mockIssues);
      } catch (error) {
        console.error('Error fetching issues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to first page when searching
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
    // In a real app, this would refetch data
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'reported':
        return 'primary';
      case 'in progress':
        return 'secondary';
      case 'completed':
        return 'success';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  // Filter and sort issues
  const filteredIssues = issues
    .filter((issue) => {
      const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || issue.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.dateReported) - new Date(a.dateReported);
      } else if (sortBy === 'oldest') {
        return new Date(a.dateReported) - new Date(b.dateReported);
      } else if (sortBy === 'priority') {
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return 0;
    });

  // Pagination
  const count = Math.ceil(filteredIssues.length / itemsPerPage);
  const paginatedIssues = filteredIssues.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Track Issues
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/report-issue')}
          sx={{ ml: 2 }}
        >
          Report New Issue
        </Button>
      </Box>

      {/* Search and Filter Bar */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
          <TextField
            placeholder="Search issues..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            sx={{ flexGrow: 1, maxWidth: 500 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          
          {!isMobile && (
            <>
              <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  label="Status"
                >
                  <MenuItem value="All">All Statuses</MenuItem>
                  {statuses.filter(s => s !== 'All').map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priorityFilter}
                  onChange={handlePriorityFilterChange}
                  label="Priority"
                >
                  <MenuItem value="All">All Priorities</MenuItem>
                  {priorities.filter(p => p !== 'All').map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      {priority}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={handleSortChange}
                  label="Sort By"
                  startAdornment={
                    <InputAdornment position="start">
                      <SortIcon />
                    </InputAdornment>
                  }
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}

          {isMobile && (
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
          )}

          <IconButton onClick={handleRefresh} title="Refresh">
            <RefreshIcon />
          </IconButton>
        </Box>

        {/* Mobile Filters */}
        {isMobile && showFilters && (
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, mb: 2, border: '1px solid #eee' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small" variant="outlined">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    label="Status"
                  >
                    <MenuItem value="All">All Statuses</MenuItem>
                    {statuses.filter(s => s !== 'All').map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small" variant="outlined">
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={priorityFilter}
                    onChange={handlePriorityFilterChange}
                    label="Priority"
                  >
                    <MenuItem value="All">All Priorities</MenuItem>
                    {priorities.filter(p => p !== 'All').map((priority) => (
                      <MenuItem key={priority} value={priority}>
                        {priority}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size="small" variant="outlined">
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={handleSortChange}
                    label="Sort By"
                  >
                    {sortOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>

      {/* Results Count */}
      <Box mb={2}>
        <Typography variant="body2" color="textSecondary">
          Showing {paginatedIssues.length > 0 ? (page - 1) * itemsPerPage + 1 : 0} - 
          {Math.min(page * itemsPerPage, filteredIssues.length)} of {filteredIssues.length} issues
        </Typography>
      </Box>

      {/* Issues List */}
      <Box mb={4}>
        {paginatedIssues.length > 0 ? (
          paginatedIssues.map((issue) => (
            <Card key={issue.id} sx={{ mb: 2, '&:hover': { boxShadow: 3 } }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" flexWrap="wrap">
                  <Box>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {issue.title}
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mb={1.5}>
                      <Chip
                        label={issue.status}
                        size="small"
                        color={getStatusColor(issue.status)}
                        variant="outlined"
                      />
                      <Chip
                        label={issue.priority}
                        size="small"
                        color={getPriorityColor(issue.priority)}
                        variant="outlined"
                      />
                      <Chip
                        label={issue.category}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    #{issue.id}
                  </Typography>
                </Box>

                <Typography variant="body2" color="textSecondary" paragraph>
                  {issue.description.length > 200
                    ? `${issue.description.substring(0, 200)}...`
                    : issue.description}
                </Typography>

                <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
                  <Box display="flex" alignItems="center">
                    <LocationIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="caption" color="textSecondary">
                      {issue.location}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <CalendarIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="caption" color="textSecondary">
                      Reported on {format(new Date(issue.dateReported), 'MMM d, yyyy')}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                <Button 
                  size="small" 
                  onClick={() => navigate(`/issue/${issue.id}`)}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          ))
        ) : (
          <Box textAlign="center" py={6}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No issues found
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Try adjusting your search or filter criteria
            </Typography>
          </Box>
        )}
      </Box>

      {/* Pagination */}
      {filteredIssues.length > 0 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={count}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Container>
  );
};

export default IssueTracker;
