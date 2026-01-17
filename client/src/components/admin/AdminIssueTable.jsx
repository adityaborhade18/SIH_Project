import React, { useState } from 'react';
import { format } from 'date-fns';
import { MapPin, Calendar, Search } from 'lucide-react';

const AdminIssueTable = ({ issues, onViewDetails }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [page, setPage] = useState(1);
    const itemsPerPage = 7;

    const statuses = ['All', 'Pending', 'In Process', 'Resolved', 'Rejected'];
    const priorities = ['All', 'Low', 'Medium', 'High', 'Critical'];

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-orange-100 text-orange-800';
            case 'in process': return 'bg-blue-100 text-blue-800';
            case 'assigned': return 'bg-purple-100 text-purple-800';
            case 'solved':
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityStyles = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'bg-orange-100 text-orange-800';
            case 'critical': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
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

    const filteredIssues = issues
        .filter((issue) => {
            const matchText =
                issue.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                issue.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchStatus = statusFilter === 'All' || issue.status === statusFilter;
            const matchPriority = priorityFilter === 'All' || issue.priority === priorityFilter;
            return matchText && matchStatus && matchPriority;
        });

    const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
    const paginatedIssues = filteredIssues.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            {/* Search and Filters Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-wrap gap-4 items-center justify-between">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search issues..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>

                <div className="flex gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer hover:border-blue-400 transition-colors"
                    >
                        {statuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer hover:border-blue-400 transition-colors"
                    >
                        {priorities.map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Issue ID</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Priority</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {paginatedIssues.map((issue) => {
                            const loc = parseLocationData(issue.location);
                            return (
                                <tr
                                    key={issue.id || issue._id}
                                    onClick={() => onViewDetails(issue)}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                        #{(issue.id || issue._id).slice(-6).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {issue.title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyles(issue.status)}`}>
                                            {issue.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityStyles(issue.priority)}`}>
                                            {issue.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="flex items-center space-x-2 max-w-[200px]">
                                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                            <span className="truncate" title={loc.address}>{loc.address}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span>{issue.date ? format(new Date(issue.date), "MMM d, yyyy") : 'N/A'}</span>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        {paginatedIssues.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                    No issues found matching your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <span className="text-sm text-gray-600">
                        Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filteredIssues.length)} of {filteredIssues.length} entries
                    </span>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        <div className="flex space-x-1">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setPage(i + 1)}
                                    className={`w-8 h-8 rounded-md text-xs font-medium transition-colors ${page === i + 1
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminIssueTable;
