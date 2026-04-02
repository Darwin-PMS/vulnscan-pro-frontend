import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ScanLine, Trash2, Eye, AlertTriangle, Search, Filter, Plus,
    Clock, Activity, CheckCircle, Shield, Zap,
    ArrowUpDown, LayoutGrid, List, X, RefreshCw
} from 'lucide-react';
import { scanApi } from '../services/api';
import { PageContainer } from '../components/layout';
import { Card, Button, Input, Badge } from '../components/ui';
import StatusBadge from '../components/StatusBadge';
import { formatDistanceToNow, format } from 'date-fns';

const ScanList = () => {
    const navigate = useNavigate();
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewMode, setViewMode] = useState('list');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        fetchScans();
    }, []);

    useEffect(() => {
        const handleFocus = () => fetchScans();
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    const fetchScans = async () => {
        try {
            setLoading(true);
            const response = await scanApi.getAllScans({ limit: 100 });
            setScans(response.data.scans);
        } catch (err) {
            setError('Failed to load scans');
            console.error('Error fetching scans:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (scanId, e) => {
        e?.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this scan?')) {
            return;
        }

        try {
            await scanApi.deleteScan(scanId);
            setScans(scans.filter(s => s.scan_id !== scanId));
        } catch (err) {
            setError('Failed to delete scan');
        }
    };

    const getStats = () => {
        const total = scans.length;
        const completed = scans.filter(s => s.status === 'completed').length;
        const running = scans.filter(s => s.status === 'running' || s.status === 'pending').length;
        const vulnerabilities = scans.reduce((sum, s) => sum + (s.total_vulnerabilities || 0), 0);
        return { total, completed, running, vulnerabilities };
    };

    const filteredScans = scans
        .filter(scan => {
            const matchesSearch = scan.target_url?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || scan.status === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'date') {
                comparison = new Date(b.created_at) - new Date(a.created_at);
            } else if (sortBy === 'vulns') {
                comparison = (b.total_vulnerabilities || 0) - (a.total_vulnerabilities || 0);
            } else if (sortBy === 'url') {
                comparison = a.target_url.localeCompare(b.target_url);
            }
            return sortOrder === 'desc' ? comparison : -comparison;
        });

    const stats = getStats();

    if (loading) {
        return (
            <PageContainer showNavbar={false}>
                <div className="scanlist-loading">
                    <RefreshCw className="animate-spin" size={32} />
                    <p>Loading scans...</p>
                </div>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer showNavbar={false}>
                <div className="scanlist-error">
                    <AlertTriangle size={64} />
                    <h2>Error Loading Scans</h2>
                    <p>{error}</p>
                    <Button onClick={fetchScans}>Retry</Button>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer
            showNavbar={false}
            title="Security Scans"
            subtitle="Monitor and manage all your vulnerability assessments"
            action={
                <Button leftIcon={<Plus size={18} />} onClick={() => navigate('/scan')}>
                    New Scan
                </Button>
            }
        >
            {/* Stats Cards */}
            <div className="scanlist-stats-grid">
                <Card className="scanlist-stat-card" padding="lg">
                    <div className="scanlist-stat-icon" style={{ background: 'var(--primary-alpha)' }}>
                        <ScanLine size={24} style={{ color: 'var(--primary-color)' }} />
                    </div>
                    <div className="scanlist-stat-content">
                        <span className="scanlist-stat-value">{stats.total}</span>
                        <span className="scanlist-stat-label">Total Scans</span>
                    </div>
                </Card>

                <Card className="scanlist-stat-card" padding="lg">
                    <div className="scanlist-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                        <CheckCircle size={24} style={{ color: 'var(--success-color)' }} />
                    </div>
                    <div className="scanlist-stat-content">
                        <span className="scanlist-stat-value">{stats.completed}</span>
                        <span className="scanlist-stat-label">Completed</span>
                    </div>
                </Card>

                <Card className="scanlist-stat-card" padding="lg">
                    <div className="scanlist-stat-icon" style={{ background: 'rgba(234, 88, 12, 0.15)' }}>
                        <Activity size={24} style={{ color: 'var(--high-color)' }} />
                    </div>
                    <div className="scanlist-stat-content">
                        <span className="scanlist-stat-value">{stats.running}</span>
                        <span className="scanlist-stat-label">In Progress</span>
                    </div>
                </Card>

                <Card className="scanlist-stat-card" padding="lg">
                    <div className="scanlist-stat-icon" style={{ background: 'rgba(220, 38, 38, 0.15)' }}>
                        <Shield size={24} style={{ color: 'var(--critical-color)' }} />
                    </div>
                    <div className="scanlist-stat-content">
                        <span className="scanlist-stat-value">{stats.vulnerabilities}</span>
                        <span className="scanlist-stat-label">Vulnerabilities Found</span>
                    </div>
                </Card>
            </div>

            {/* Filter Bar */}
            <Card className="scanlist-filter-card" padding="md">
                <div className="scanlist-filters">
                    <div className="scanlist-search">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by URL..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button className="scanlist-clear-btn" onClick={() => setSearchQuery('')}>
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <div className="scanlist-filter-group">
                        <Filter size={16} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="running">Running</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>

                    <div className="scanlist-filter-group">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="date">Sort by Date</option>
                            <option value="vulns">Sort by Vulnerabilities</option>
                            <option value="url">Sort by URL</option>
                        </select>
                        <button
                            className="scanlist-sort-btn"
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        >
                            <ArrowUpDown size={16} />
                        </button>
                    </div>

                    <div className="view-toggle">
                        <button
                            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <List size={18} />
                        </button>
                        <button
                            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <LayoutGrid size={18} />
                        </button>
                    </div>
                </div>
            </Card>

            {/* Results Count */}
            <div className="scanlist-results-info">
                <span>Showing {filteredScans.length} of {scans.length} scans</span>
                <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={14} />} onClick={fetchScans}>
                    Refresh
                </Button>
            </div>

            {/* Scans List */}
            {filteredScans.length > 0 ? (
                <div className={viewMode === 'grid' ? 'scanlist-grid' : 'scanlist-list'}>
                    {filteredScans.map((scan) => (
                        <Card 
                            key={scan.scan_id}
                            className="scanlist-card"
                            hoverable
                            onClick={() => navigate(`/scan/${scan.scan_id}`)}
                        >
                            <div className="scanlist-card-header">
                                <div className="scanlist-card-left">
                                    <StatusBadge status={scan.status} />
                                    <span className="scanlist-url">{scan.target_url}</span>
                                </div>
                                <div className="scanlist-card-actions">
                                    <button
                                        className="scanlist-action-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/scan/${scan.scan_id}`);
                                        }}
                                        title="View details"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        className="scanlist-action-btn danger"
                                        onClick={(e) => handleDelete(scan.scan_id, e)}
                                        title="Delete scan"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="scanlist-card-body">
                                <div className="scanlist-card-stats">
                                    <div className="scanlist-stat">
                                        <span className="scanlist-stat-number critical">{scan.critical_count || 0}</span>
                                        <span className="scanlist-stat-text">Critical</span>
                                    </div>
                                    <div className="scanlist-stat">
                                        <span className="scanlist-stat-number high">{scan.high_count || 0}</span>
                                        <span className="scanlist-stat-text">High</span>
                                    </div>
                                    <div className="scanlist-stat">
                                        <span className="scanlist-stat-number">{scan.total_vulnerabilities || 0}</span>
                                        <span className="scanlist-stat-text">Total</span>
                                    </div>
                                </div>
                                <div className="scanlist-card-date">
                                    <Clock size={14} />
                                    <span>{format(new Date(scan.created_at), 'MMM dd, yyyy HH:mm')}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="scanlist-empty-card" padding="lg">
                    <div className="scanlist-empty-icon">
                        <ScanLine size={64} />
                    </div>
                    <h3>
                        {searchQuery || statusFilter !== 'all' ? 'No Matching Scans' : 'No Scans Yet'}
                    </h3>
                    <p>
                        {searchQuery || statusFilter !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Start your first vulnerability scan to see results here'}
                    </p>
                    {!searchQuery && statusFilter === 'all' && (
                        <Button leftIcon={<Zap size={18} />} onClick={() => navigate('/scan')}>
                            Start First Scan
                        </Button>
                    )}
                </Card>
            )}
        </PageContainer>
    );
};

export default ScanList;
