import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FileText, Search, Filter, Download, RefreshCw, 
    User, Clock, Shield, AlertTriangle, CheckCircle, 
    XCircle, ChevronDown, ChevronUp, Eye, Edit, Trash2,
    LogIn, LogOut, Plus, Settings, Key, Bell
} from 'lucide-react';
import { enterpriseApi } from '../../services/api';
import { Button, Card, Input } from '../../components/ui';
import { PageContainer } from '../../components/layout';
import { useToast } from '../../contexts/ToastContext';
import './AuditLogs.css';

const AuditLogs = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [expandedLog, setExpandedLog] = useState(null);
    const [filters, setFilters] = useState({
        action: '',
        userId: '',
        startDate: '',
        endDate: '',
        search: ''
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadLogs();
    }, [page, filters]);

    const loadLogs = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: 50,
                ...filters
            };
            Object.keys(params).forEach(key => {
                if (!params[key]) delete params[key];
            });
            
            const response = await enterpriseApi.getAuditLogs(params);
            setLogs(response.data.logs || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error('Failed to load audit logs:', error);
            toast.error('Failed to load audit logs');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const handleExport = async () => {
        try {
            const params = { ...filters, export: true };
            Object.keys(params).forEach(key => {
                if (!params[key]) delete params[key];
            });
            
            const response = await enterpriseApi.getAuditLogs(params);
            const csvContent = convertToCSV(response.data.logs || []);
            downloadCSV(csvContent, `audit-logs-${new Date().toISOString().split('T')[0]}.csv`);
            toast.success('Audit logs exported');
        } catch (error) {
            toast.error('Failed to export logs');
        }
    };

    const convertToCSV = (logs) => {
        const headers = ['Timestamp', 'User', 'Action', 'Resource', 'IP Address', 'Details'];
        const rows = logs.map(log => [
            new Date(log.created_at).toISOString(),
            log.user_email || 'System',
            log.action,
            log.resource_type || '',
            log.ip_address || '',
            JSON.stringify(log.details || {})
        ]);
        
        return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    };

    const downloadCSV = (content, filename) => {
        const blob = new Blob([content], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    const getActionIcon = (action) => {
        const actionLower = (action || '').toLowerCase();
        if (actionLower.includes('login') || actionLower.includes('auth')) return <LogIn size={16} />;
        if (actionLower.includes('logout')) return <LogOut size={16} />;
        if (actionLower.includes('create') || actionLower.includes('add')) return <Plus size={16} />;
        if (actionLower.includes('update') || actionLower.includes('edit')) return <Edit size={16} />;
        if (actionLower.includes('delete') || actionLower.includes('remove')) return <Trash2 size={16} />;
        if (actionLower.includes('scan')) return <Eye size={16} />;
        if (actionLower.includes('settings') || actionLower.includes('config')) return <Settings size={16} />;
        if (actionLower.includes('key')) return <Key size={16} />;
        if (actionLower.includes('mfa') || actionLower.includes('auth')) return <Shield size={16} />;
        if (actionLower.includes('notif')) return <Bell size={16} />;
        return <FileText size={16} />;
    };

    const getActionColor = (action) => {
        const actionLower = (action || '').toLowerCase();
        if (actionLower.includes('create') || actionLower.includes('login') || actionLower.includes('success')) return 'success';
        if (actionLower.includes('delete') || actionLower.includes('error') || actionLower.includes('fail')) return 'danger';
        if (actionLower.includes('update') || actionLower.includes('edit')) return 'warning';
        return 'info';
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    const formatRelativeTime = (timestamp) => {
        const now = new Date();
        const date = new Date(timestamp);
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    const actionTypes = [
        { value: '', label: 'All Actions' },
        { value: 'AUTH_LOGIN', label: 'Login' },
        { value: 'AUTH_LOGOUT', label: 'Logout' },
        { value: 'USER_CREATE', label: 'User Created' },
        { value: 'USER_UPDATE', label: 'User Updated' },
        { value: 'USER_DELETE', label: 'User Deleted' },
        { value: 'SCAN_CREATE', label: 'Scan Created' },
        { value: 'SCAN_COMPLETE', label: 'Scan Completed' },
        { value: 'SCAN_DELETE', label: 'Scan Deleted' },
        { value: 'SETTINGS_UPDATE', label: 'Settings Updated' },
        { value: 'MFA_ENABLE', label: 'MFA Enabled' },
        { value: 'MFA_DISABLE', label: 'MFA Disabled' },
        { value: 'API_KEY_CREATE', label: 'API Key Created' },
        { value: 'API_KEY_REVOKE', label: 'API Key Revoked' },
        { value: 'WEBHOOK_CREATE', label: 'Webhook Created' },
        { value: 'WEBHOOK_DELETE', label: 'Webhook Deleted' }
    ];

    return (
        <PageContainer
            title="Audit Logs"
            subtitle="Track all user actions and system events"
        >
            <div className="audit-logs-page">
                <Card className="audit-header">
                    <div className="header-content">
                        <div className="header-left">
                            <h2>
                                <FileText size={20} />
                                Audit Trail
                            </h2>
                            <p>Complete history of all actions performed in the system</p>
                        </div>
                        <div className="header-actions">
                            <Button
                                variant="secondary"
                                leftIcon={<Filter size={16} />}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                Filters
                            </Button>
                            <Button
                                variant="secondary"
                                leftIcon={<Download size={16} />}
                                onClick={handleExport}
                            >
                                Export
                            </Button>
                            <Button
                                variant="secondary"
                                leftIcon={<RefreshCw size={16} />}
                                onClick={loadLogs}
                            >
                                Refresh
                            </Button>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="filters-panel">
                            <div className="filter-row">
                                <div className="filter-group">
                                    <label>Action Type</label>
                                    <select
                                        value={filters.action}
                                        onChange={(e) => handleFilterChange('action', e.target.value)}
                                        className="filter-select"
                                    >
                                        {actionTypes.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="filter-group">
                                    <label>Search</label>
                                    <Input
                                        placeholder="Search in logs..."
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        icon={<Search size={16} />}
                                    />
                                </div>
                            </div>
                            <div className="filter-row">
                                <div className="filter-group">
                                    <label>Start Date</label>
                                    <input
                                        type="date"
                                        value={filters.startDate}
                                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                        className="filter-input"
                                    />
                                </div>
                                <div className="filter-group">
                                    <label>End Date</label>
                                    <input
                                        type="date"
                                        value={filters.endDate}
                                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                        className="filter-input"
                                    />
                                </div>
                                <Button
                                    variant="secondary"
                                    size="small"
                                    onClick={() => setFilters({ action: '', userId: '', startDate: '', endDate: '', search: '' })}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>

                <Card className="audit-logs-card">
                    {loading ? (
                        <div className="loading-state">
                            <RefreshCw className="animate-spin" size={24} />
                            <p>Loading audit logs...</p>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="empty-state">
                            <FileText size={48} />
                            <h3>No audit logs found</h3>
                            <p>Actions performed will appear here</p>
                        </div>
                    ) : (
                        <div className="logs-list">
                            {logs.map(log => (
                                <div
                                    key={log.id}
                                    className={`log-item action-${getActionColor(log.action)}`}
                                >
                                    <div
                                        className="log-header"
                                        onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                                    >
                                        <div className="log-icon">
                                            {getActionIcon(log.action)}
                                        </div>
                                        <div className="log-main">
                                            <div className="log-action">
                                                <span className={`action-badge action-${getActionColor(log.action)}`}>
                                                    {log.action}
                                                </span>
                                                <span className="log-resource">{log.resource_type || 'System'}</span>
                                            </div>
                                            <div className="log-meta">
                                                <span className="log-user">
                                                    <User size={14} />
                                                    {log.user_email || 'System'}
                                                </span>
                                                <span className="log-time">
                                                    <Clock size={14} />
                                                    {formatRelativeTime(log.created_at)}
                                                </span>
                                                {log.ip_address && (
                                                    <span className="log-ip">
                                                        {log.ip_address}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="log-expand">
                                            {expandedLog === log.id ? (
                                                <ChevronUp size={20} />
                                            ) : (
                                                <ChevronDown size={20} />
                                            )}
                                        </div>
                                    </div>

                                    {expandedLog === log.id && (
                                        <div className="log-details">
                                            <div className="detail-row">
                                                <span className="detail-label">Timestamp</span>
                                                <span className="detail-value">{formatTimestamp(log.created_at)}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">User</span>
                                                <span className="detail-value">{log.user_email || 'System'}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Action</span>
                                                <span className="detail-value">{log.action}</span>
                                            </div>
                                            {log.resource_type && (
                                                <div className="detail-row">
                                                    <span className="detail-label">Resource</span>
                                                    <span className="detail-value">{log.resource_type}</span>
                                                </div>
                                            )}
                                            {log.resource_id && (
                                                <div className="detail-row">
                                                    <span className="detail-label">Resource ID</span>
                                                    <span className="detail-value code">{log.resource_id}</span>
                                                </div>
                                            )}
                                            {log.ip_address && (
                                                <div className="detail-row">
                                                    <span className="detail-label">IP Address</span>
                                                    <span className="detail-value code">{log.ip_address}</span>
                                                </div>
                                            )}
                                            {log.user_agent && (
                                                <div className="detail-row">
                                                    <span className="detail-label">User Agent</span>
                                                    <span className="detail-value">{log.user_agent}</span>
                                                </div>
                                            )}
                                            {log.details && (
                                                <div className="detail-row">
                                                    <span className="detail-label">Details</span>
                                                    <pre className="detail-json">
                                                        {JSON.stringify(log.details, null, 2)}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="pagination">
                            <Button
                                variant="secondary"
                                size="small"
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                            >
                                Previous
                            </Button>
                            <span className="page-info">
                                Page {page} of {totalPages}
                            </span>
                            <Button
                                variant="secondary"
                                size="small"
                                disabled={page >= totalPages}
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </Card>

                <Card className="audit-info">
                    <h3>About Audit Logs</h3>
                    <p>Audit logs provide a complete record of all actions performed in VulnScan Pro. This includes:</p>
                    <ul>
                        <li>User authentication events (login, logout, MFA)</li>
                        <li>Scan operations (created, completed, deleted)</li>
                        <li>User management actions</li>
                        <li>API key and webhook changes</li>
                        <li>System configuration updates</li>
                    </ul>
                    <p>Logs are retained for compliance purposes and can be exported in CSV format.</p>
                </Card>
            </div>
        </PageContainer>
    );
};

export default AuditLogs;
