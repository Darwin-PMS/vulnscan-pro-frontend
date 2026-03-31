import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ScanLine, Trash2, Eye, AlertTriangle, Search, Filter, Plus,
    Clock, Activity, CheckCircle, XCircle, Shield, Zap,
    ArrowUpDown, LayoutGrid, List, X, Sun, Moon, RefreshCw
} from 'lucide-react';
import { scanApi } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { useTheme } from '../contexts/ThemeContext';
import { formatDistanceToNow, format } from 'date-fns';

const ScanList = () => {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
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

    const theme = isDark ? {
        bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        bgSecondary: 'rgba(255,255,255,0.05)',
        bgCard: 'rgba(255,255,255,0.05)',
        bgCardHover: 'rgba(255,255,255,0.08)',
        border: 'rgba(255,255,255,0.1)',
        borderLight: 'rgba(255,255,255,0.15)',
        text: '#f1f5f9',
        textSecondary: '#94a3b8',
        textMuted: '#64748b',
    } : {
        bg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        bgSecondary: 'rgba(0,0,0,0.03)',
        bgCard: '#ffffff',
        bgCardHover: '#f8fafc',
        border: 'rgba(0,0,0,0.08)',
        borderLight: 'rgba(0,0,0,0.12)',
        text: '#0f172a',
        textSecondary: '#475569',
        textMuted: '#94a3b8',
    };

    if (loading) {
        return (
            <div style={{ ...styles.pageContainer, background: theme.bg }}>
                <div style={styles.loadingSpinner}></div>
                <p style={{ ...styles.loadingText, color: theme.text }}>Loading scans...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ ...styles.errorContainer, background: theme.bg }}>
                <AlertTriangle size={64} style={{ color: '#ef4444', marginBottom: '16px' }} />
                <h2 style={{ ...styles.errorTitle, color: theme.text }}>Error Loading Scans</h2>
                <p style={{ ...styles.errorMessage, color: theme.textSecondary }}>{error}</p>
            </div>
        );
    }

    return (
        <div style={{ ...styles.pageContainer, background: theme.bg }}>
            {/* Header */}
            <header style={{ ...styles.header, borderBottom: `1px solid ${theme.border}` }}>
                <div style={styles.headerContent}>
                    <div>
                        <h1 style={{ ...styles.title, color: theme.text }}>Security Scans</h1>
                        <p style={{ ...styles.subtitle, color: theme.textSecondary }}>
                            Monitor and manage all your vulnerability assessments
                        </p>
                    </div>
                    <div style={styles.headerActions}>
                        <button style={{ ...styles.themeToggle, background: theme.bgCard, border: `1px solid ${theme.border}` }} onClick={toggleTheme}>
                            {isDark ? <Sun size={18} style={{ color: '#fbbf24' }} /> : <Moon size={18} style={{ color: '#6366f1' }} />}
                        </button>
                        <button style={{ ...styles.refreshBtn, background: theme.bgCard, border: `1px solid ${theme.border}`, color: theme.text }} onClick={fetchScans}>
                            <RefreshCw size={18} />
                        </button>
                        <button style={styles.newScanBtn} onClick={() => navigate('/scan')}>
                            <Plus size={18} />
                            New Scan
                        </button>
                    </div>
                </div>
            </header>

            <main style={styles.main}>
                {/* Stats Cards */}
                <div style={styles.statsGrid}>
                    <div style={{ ...styles.statCard, background: theme.bgCard, border: `1px solid ${theme.border}` }}>
                        <div style={{ ...styles.statIcon, background: 'rgba(99, 102, 241, 0.15)' }}>
                            <ScanLine size={24} style={{ color: '#6366f1' }} />
                        </div>
                        <div>
                            <span style={{ ...styles.statValue, color: theme.text }}>{stats.total}</span>
                            <span style={{ ...styles.statLabel, color: theme.textSecondary }}>Total Scans</span>
                        </div>
                    </div>
                    <div style={{ ...styles.statCard, background: theme.bgCard, border: `1px solid ${theme.border}` }}>
                        <div style={{ ...styles.statIcon, background: 'rgba(16, 185, 129, 0.15)' }}>
                            <CheckCircle size={24} style={{ color: '#22c55e' }} />
                        </div>
                        <div>
                            <span style={{ ...styles.statValue, color: theme.text }}>{stats.completed}</span>
                            <span style={{ ...styles.statLabel, color: theme.textSecondary }}>Completed</span>
                        </div>
                    </div>
                    <div style={{ ...styles.statCard, background: theme.bgCard, border: `1px solid ${theme.border}` }}>
                        <div style={{ ...styles.statIcon, background: 'rgba(234, 88, 12, 0.15)' }}>
                            <Activity size={24} style={{ color: '#f97316' }} />
                        </div>
                        <div>
                            <span style={{ ...styles.statValue, color: theme.text }}>{stats.running}</span>
                            <span style={{ ...styles.statLabel, color: theme.textSecondary }}>In Progress</span>
                        </div>
                    </div>
                    <div style={{ ...styles.statCard, background: theme.bgCard, border: `1px solid ${theme.border}` }}>
                        <div style={{ ...styles.statIcon, background: 'rgba(220, 38, 38, 0.15)' }}>
                            <Shield size={24} style={{ color: '#dc2626' }} />
                        </div>
                        <div>
                            <span style={{ ...styles.statValue, color: theme.text }}>{stats.vulnerabilities}</span>
                            <span style={{ ...styles.statLabel, color: theme.textSecondary }}>Vulnerabilities Found</span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div style={{ ...styles.filterBar, background: theme.bgCard, border: `1px solid ${theme.border}` }}>
                    <div style={styles.searchContainer}>
                        <Search size={18} style={{ color: theme.textMuted }} />
                        <input
                            type="text"
                            placeholder="Search by URL..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ ...styles.searchInput, color: theme.text, background: 'transparent', border: 'none', outline: 'none' }}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} style={{ ...styles.clearBtn, color: theme.textMuted }}>
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <div style={styles.filterGroup}>
                        <Filter size={16} style={{ color: theme.textMuted }} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ ...styles.filterSelect, color: theme.text, background: theme.bgSecondary, border: `1px solid ${theme.border}` }}
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="running">Running</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>

                    <div style={styles.filterGroup}>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{ ...styles.filterSelect, color: theme.text, background: theme.bgSecondary, border: `1px solid ${theme.border}` }}
                        >
                            <option value="date">Sort by Date</option>
                            <option value="vulns">Sort by Vulnerabilities</option>
                            <option value="url">Sort by URL</option>
                        </select>
                        <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            style={{ ...styles.sortBtn, background: theme.bgSecondary, border: `1px solid ${theme.border}`, color: theme.text }}
                        >
                            <ArrowUpDown size={16} />
                        </button>
                    </div>

                    <div style={{ ...styles.viewToggle, background: theme.border }}>
                        <button
                            onClick={() => setViewMode('list')}
                            style={{ ...styles.viewBtn, ...(viewMode === 'list' ? styles.viewBtnActive : {}), background: viewMode === 'list' ? '#6366f1' : 'transparent', color: viewMode === 'list' ? 'white' : theme.textSecondary }}
                        >
                            <List size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            style={{ ...styles.viewBtn, ...(viewMode === 'grid' ? styles.viewBtnActive : {}), background: viewMode === 'grid' ? '#6366f1' : 'transparent', color: viewMode === 'grid' ? 'white' : theme.textSecondary }}
                        >
                            <LayoutGrid size={18} />
                        </button>
                    </div>
                </div>

                {/* Results Count */}
                <div style={styles.resultsInfo}>
                    <span style={{ color: theme.textSecondary }}>
                        Showing {filteredScans.length} of {scans.length} scans
                    </span>
                </div>

                {/* Scans List */}
                {filteredScans.length > 0 ? (
                    <div style={viewMode === 'grid' ? styles.scansGrid : styles.scansList}>
                        {filteredScans.map((scan) => (
                            <div
                                key={scan.scan_id}
                                style={{
                                    ...styles.scanCard,
                                    background: theme.bgCard,
                                    border: `1px solid ${theme.border}`,
                                }}
                                onClick={() => navigate(`/scan/${scan.scan_id}`)}
                                onMouseEnter={(e) => e.currentTarget.style.background = theme.bgCardHover}
                                onMouseLeave={(e) => e.currentTarget.style.background = theme.bgCard}
                            >
                                <div style={styles.scanCardHeader}>
                                    <div style={styles.scanCardLeft}>
                                        <StatusBadge status={scan.status} />
                                        <span style={{ ...styles.scanUrl, color: theme.text }}>{scan.target_url}</span>
                                    </div>
                                    <div style={styles.scanCardActions}>
                                        <button
                                            style={{ ...styles.actionBtn, background: theme.bgSecondary, border: `1px solid ${theme.border}`, color: theme.text }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/scan/${scan.scan_id}`);
                                            }}
                                            title="View details"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            style={{ ...styles.actionBtn, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444' }}
                                            onClick={(e) => handleDelete(scan.scan_id, e)}
                                            title="Delete scan"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div style={styles.scanCardBody}>
                                    <div style={styles.scanCardStats}>
                                        <div style={styles.scanStat}>
                                            <span style={{ ...styles.scanStatValue, color: '#dc2626' }}>{scan.critical_count || 0}</span>
                                            <span style={{ ...styles.scanStatLabel, color: theme.textSecondary }}>Critical</span>
                                        </div>
                                        <div style={styles.scanStat}>
                                            <span style={{ ...styles.scanStatValue, color: '#f97316' }}>{scan.high_count || 0}</span>
                                            <span style={{ ...styles.scanStatLabel, color: theme.textSecondary }}>High</span>
                                        </div>
                                        <div style={styles.scanStat}>
                                            <span style={{ ...styles.scanStatValue, color: '#22c55e' }}>{scan.total_vulnerabilities || 0}</span>
                                            <span style={{ ...styles.scanStatLabel, color: theme.textSecondary }}>Total</span>
                                        </div>
                                    </div>
                                    <div style={styles.scanCardDate}>
                                        <Clock size={14} style={{ color: theme.textMuted }} />
                                        <span style={{ color: theme.textSecondary, fontSize: '13px' }}>
                                            {format(new Date(scan.created_at), 'MMM dd, yyyy HH:mm')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ ...styles.emptyState, background: theme.bgCard, border: `1px solid ${theme.border}` }}>
                        <div style={styles.emptyIcon}>
                            <ScanLine size={64} style={{ color: theme.textMuted }} />
                        </div>
                        <h3 style={{ ...styles.emptyTitle, color: theme.text }}>
                            {searchQuery || statusFilter !== 'all' ? 'No Matching Scans' : 'No Scans Yet'}
                        </h3>
                        <p style={{ ...styles.emptyText, color: theme.textSecondary }}>
                            {searchQuery || statusFilter !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'Start your first vulnerability scan to see results here'}
                        </p>
                        {!searchQuery && statusFilter === 'all' && (
                            <button style={styles.startBtn} onClick={() => navigate('/scan')}>
                                <Zap size={18} />
                                Start First Scan
                            </button>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

const styles = {
    pageContainer: {
        minHeight: '100vh',
        color: '#f1f5f9'
    },
    loadingSpinner: {
        width: '48px',
        height: '48px',
        border: '4px solid rgba(99, 102, 241, 0.2)',
        borderTopColor: '#6366f1',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto',
        marginTop: '20vh'
    },
    loadingText: { fontSize: '18px', textAlign: 'center', marginTop: '16px' },
    errorContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        padding: '24px'
    },
    errorTitle: { fontSize: '24px', marginBottom: '8px' },
    errorMessage: { marginBottom: '24px' },
    header: {
        padding: '24px 32px',
        background: 'rgba(0,0,0,0.2)',
        backdropFilter: 'blur(10px)'
    },
    headerContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1400px',
        margin: '0 auto'
    },
    title: { fontSize: '28px', fontWeight: '700', margin: '0 0 4px 0' },
    subtitle: { fontSize: '14px', margin: 0 },
    headerActions: { display: 'flex', gap: '12px', alignItems: 'center' },
    themeToggle: {
        padding: '10px',
        borderRadius: '10px',
        cursor: 'pointer',
        display: 'flex'
    },
    refreshBtn: {
        padding: '10px',
        borderRadius: '10px',
        cursor: 'pointer',
        display: 'flex'
    },
    newScanBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 20px',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        border: 'none',
        borderRadius: '10px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    main: { padding: '24px 32px', maxWidth: '1400px', margin: '0 auto' },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
    },
    statCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '20px',
        borderRadius: '12px'
    },
    statIcon: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    statValue: { display: 'block', fontSize: '28px', fontWeight: '700', lineHeight: 1 },
    statLabel: { display: 'block', fontSize: '13px', marginTop: '4px' },
    filterBar: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '12px 16px',
        borderRadius: '12px',
        marginBottom: '16px',
        flexWrap: 'wrap'
    },
    searchContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flex: 1,
        minWidth: '200px'
    },
    searchInput: { flex: 1, fontSize: '14px' },
    clearBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px' },
    filterGroup: { display: 'flex', alignItems: 'center', gap: '8px' },
    filterSelect: {
        padding: '8px 12px',
        borderRadius: '8px',
        fontSize: '13px',
        cursor: 'pointer',
        outline: 'none'
    },
    sortBtn: {
        padding: '8px 12px',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex'
    },
    viewToggle: {
        display: 'flex',
        padding: '4px',
        borderRadius: '8px'
    },
    viewBtn: {
        padding: '8px 12px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'flex'
    },
    viewBtnActive: {},
    resultsInfo: { marginBottom: '16px', fontSize: '13px' },
    scansList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    scansGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '16px'
    },
    scanCard: {
        padding: '20px',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    scanCardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
    },
    scanCardLeft: { display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 },
    scanUrl: {
        fontSize: '14px',
        fontWeight: '500',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    scanCardActions: { display: 'flex', gap: '8px' },
    actionBtn: {
        padding: '8px',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex'
    },
    scanCardBody: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    scanCardStats: { display: 'flex', gap: '24px' },
    scanStat: { textAlign: 'center' },
    scanStatValue: { display: 'block', fontSize: '18px', fontWeight: '700' },
    scanStatLabel: { display: 'block', fontSize: '11px', marginTop: '2px' },
    scanCardDate: { display: 'flex', alignItems: 'center', gap: '6px' },
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        borderRadius: '16px',
        textAlign: 'center'
    },
    emptyIcon: { marginBottom: '24px', opacity: 0.5 },
    emptyTitle: { fontSize: '20px', fontWeight: '600', marginBottom: '8px' },
    emptyText: { fontSize: '14px', maxWidth: '400px' },
    startBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginTop: '24px',
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        border: 'none',
        borderRadius: '10px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer'
    }
};

export default ScanList;
