import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scan, Bug, Shield, Activity, Zap, Crown, User, ArrowRight } from 'lucide-react';
import { scanApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { UsageSummary } from '../components/SubscriptionComponents';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { formatDistanceToNow } from 'date-fns';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tier, setTier] = useState('free');

    useEffect(() => {
        fetchStats();
    }, []);

    // Refresh data when component comes into focus
    useEffect(() => {
        const handleFocus = () => fetchStats();
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    const fetchStats = async () => {
        try {
            const response = await scanApi.getDashboardStats();
            setStats(response.data);
        } catch (err) {
            setError('Failed to load dashboard stats');
            console.error('Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const getSeverityCount = (severity) => {
        if (!stats?.severityBreakdown) return 0;
        const item = stats.severityBreakdown.find(s => s.severity === severity);
        return item?.count || 0;
    };

    if (loading) {
        return (
            <div className="container page-header">
                <div className="empty-state">
                    <div className="spinner" style={{ margin: '0 auto 24px' }}></div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container page-header">
                <div className="empty-state">
                    <p style={{ color: 'var(--danger-color)' }}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="container page-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span>Welcome back,</span>
                            <span style={{ color: 'var(--primary-color)' }}>{user?.username || 'User'}</span>
                        </h1>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <User size={16} />
                            {user?.email}
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/scan')}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <Scan size={18} />
                            New Scan
                        </button>
                        {tier === 'free' && (
                            <div style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                padding: '12px 20px',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                cursor: 'pointer'
                            }} onClick={() => navigate('/pricing')}>
                                <Zap size={24} />
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                        Upgrade for More
                                    </div>
                                    <div style={{ fontSize: '12px', opacity: 0.9 }}>
                                        Unlock unlimited scans
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="container">
                {/* Subscription Usage */}
                <UsageSummary />

                {/* Overview Stats */}
                <div className="grid grid-4" style={{ marginBottom: '32px' }}>
                    <div className="card stat-card">
                        <div className="stat-card-icon" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc' }}>
                            <Scan size={24} />
                        </div>
                        <div className="stat-card-value">{stats?.totalScans || 0}</div>
                        <div className="stat-card-label">Total Scans</div>
                    </div>

                    <div className="card stat-card">
                        <div className="stat-card-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>
                            <Bug size={24} />
                        </div>
                        <div className="stat-card-value">{stats?.totalVulnerabilities || 0}</div>
                        <div className="stat-card-label">Total Vulnerabilities</div>
                    </div>

                    <div className="card stat-card">
                        <div className="stat-card-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7' }}>
                            <Shield size={24} />
                        </div>
                        <div className="stat-card-value">
                            {stats?.recentScans?.filter(s => s.status === 'completed').length || 0}
                        </div>
                        <div className="stat-card-label">Completed Scans</div>
                    </div>

                    <div className="card stat-card">
                        <div className="stat-card-icon" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd' }}>
                            <Activity size={24} />
                        </div>
                        <div className="stat-card-value">
                            {stats?.recentScans?.filter(s => s.status === 'running').length || 0}
                        </div>
                        <div className="stat-card-label">Active Scans</div>
                    </div>
                </div>

                {/* Severity Breakdown */}
                <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>
                    Vulnerability Severity Breakdown
                </h2>
                <div className="grid grid-4" style={{ marginBottom: '40px' }}>
                    <StatCard
                        severity="critical"
                        count={getSeverityCount('critical')}
                        label="Critical"
                    />
                    <StatCard
                        severity="high"
                        count={getSeverityCount('high')}
                        label="High"
                    />
                    <StatCard
                        severity="medium"
                        count={getSeverityCount('medium')}
                        label="Medium"
                    />
                    <StatCard
                        severity="low"
                        count={getSeverityCount('low')}
                        label="Low"
                    />
                </div>

                {/* Recent Scans */}
                <div className="card" style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Recent Scans</h2>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate('/scans')}
                        >
                            View All
                        </button>
                    </div>

                    {stats?.recentScans?.length > 0 ? (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>URL</th>
                                        <th>Status</th>
                                        <th>Vulnerabilities</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentScans.map((scan) => (
                                        <tr key={scan.scan_id}>
                                            <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {scan.target_url}
                                            </td>
                                            <td>
                                                <StatusBadge status={scan.status} />
                                            </td>
                                            <td>
                                                {scan.vuln_count || 0} found
                                            </td>
                                            <td>
                                                {formatDistanceToNow(new Date(scan.created_at), { addSuffix: true })}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-secondary"
                                                    style={{ padding: '8px 16px', fontSize: '13px' }}
                                                    onClick={() => navigate(`/scan/${scan.scan_id}`)}
                                                    disabled={scan.status === 'pending' || scan.status === 'running'}
                                                >
                                                    View Results
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state" style={{ padding: '40px 20px' }}>
                            <p>No scans yet. Start your first scan!</p>
                            <button
                                className="btn btn-primary"
                                style={{ marginTop: '16px' }}
                                onClick={() => navigate('/scan')}
                            >
                                Start Scan
                            </button>
                        </div>
                    )}
                </div>

                {/* Common Vulnerabilities */}
                {stats?.commonVulnerabilities?.length > 0 && (
                    <div className="card">
                        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
                            Most Common Vulnerability Types
                        </h2>
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Vulnerability Type</th>
                                        <th>Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.commonVulnerabilities.map((vuln, index) => (
                                        <tr key={index}>
                                            <td>{vuln.vulnerability_type}</td>
                                            <td>{vuln.count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;