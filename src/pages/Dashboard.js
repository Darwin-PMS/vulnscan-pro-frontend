import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scan, Bug, Shield, Activity, ArrowRight, RefreshCw, ScanLine, CalendarDays, ShieldAlert } from 'lucide-react';
import { scanApi } from '../services/api';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = useCallback(async () => {
        setError(null);
        try {
            const response = await scanApi.getDashboardStats();
            setStats(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'We could not load your dashboard right now. Check your connection and try again.');
            console.error('Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const retryStats = async () => {
        setLoading(true);
        await fetchStats();
    };

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const getSeverityCount = (severity) => {
        if (!stats?.severityBreakdown) return 0;
        const item = stats.severityBreakdown.find(s => s.severity === severity);
        return Number(item?.count) || 0;
    };

    const recentScans = Array.isArray(stats?.recentScans) ? stats.recentScans : [];
    const severityTotal = stats?.severityBreakdown?.reduce(
        (total, item) => total + (Number(item.count) || 0),
        0
    ) || 0;
    const highPriorityCount = getSeverityCount('critical') + getSeverityCount('high');
    const severitySegments = ['critical', 'high', 'medium', 'low', 'info'].map((severity) => ({
        severity,
        count: getSeverityCount(severity),
        width: severityTotal ? `${(getSeverityCount(severity) / severityTotal) * 100}%` : '0%'
    }));
    const overviewStats = [
        {
            label: 'Total scans',
            value: stats?.totalScans || 0,
            detail: 'Assessments in your workspace',
            icon: Scan,
            tone: 'indigo'
        },
        {
            label: 'Findings',
            value: stats?.totalVulnerabilities || 0,
            detail: 'Reported across your scans',
            icon: Bug,
            tone: 'rose'
        },
        {
            label: 'Completed',
            value: recentScans.filter((scan) => scan.status === 'completed').length,
            detail: 'Among your 5 most recent',
            icon: Shield,
            tone: 'emerald'
        },
        {
            label: 'In progress',
            value: recentScans.filter((scan) => scan.status === 'running' || scan.status === 'pending').length,
            detail: 'Among your 5 most recent',
            icon: Activity,
            tone: 'blue'
        }
    ];

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
            <div className="container dashboard-page">
                <div className="dashboard-error card" role="alert">
                    <div>
                        <h1>Dashboard unavailable</h1>
                        <p>{error}</p>
                    </div>
                    <button className="btn btn-primary" onClick={retryStats} disabled={loading}>
                        <RefreshCw size={16} />
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="container dashboard-heading">
                <div>
                    <span className="dashboard-eyebrow"><Activity size={15} /> Security workspace</span>
                    <h1>Welcome back{user?.username ? `, ${user.username}` : ''}</h1>
                    <p>Monitor your assessments and see what needs your attention.</p>
                </div>
                <div className="dashboard-heading-actions">
                    <span className="dashboard-date"><CalendarDays size={15} /> {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    <button
                        className="btn btn-secondary dashboard-refresh"
                        onClick={fetchStats}
                        disabled={loading}
                        aria-label="Refresh dashboard data"
                    >
                        <RefreshCw size={16} className={loading ? 'dashboard-refreshing' : ''} />
                        <span>Refresh</span>
                    </button>
                    <button className="btn btn-primary" onClick={() => navigate('/scan')}>
                        <ScanLine size={17} />
                        New scan
                    </button>
                </div>
            </div>

            <div className="container">
                <div className="grid grid-4 dashboard-overview-grid">
                    {overviewStats.map(({ label, value, detail, icon: Icon, tone }) => (
                        <div className={`card dashboard-metric-card ${tone}`} key={label}>
                            <div className="dashboard-metric-top">
                                <span className={`dashboard-metric-icon ${tone}`}><Icon size={19} /></span>
                                <span className="dashboard-metric-label">{label}</span>
                            </div>
                            <div className="dashboard-metric-value">{value}</div>
                            <div className="dashboard-metric-detail">{detail}</div>
                        </div>
                    ))}
                </div>

                <section className="dashboard-severity-section">
                    <div className="dashboard-section-heading">
                        <div>
                            <h2>Finding severity</h2>
                            <p>A quick view of reported findings across your scans</p>
                        </div>
                        <span className="dashboard-total-findings">{severityTotal.toLocaleString()} total</span>
                    </div>
                    <div className="dashboard-severity-meter" role="img" aria-label={`${severityTotal} findings grouped by severity`}>
                        {severitySegments.filter((segment) => segment.count > 0).map((segment) => (
                            <span
                                key={segment.severity}
                                className={`dashboard-severity-segment ${segment.severity}`}
                                style={{ width: segment.width }}
                            />
                        ))}
                    </div>
                    <div className="grid grid-4 dashboard-severity-grid">
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
                        <StatCard
                            severity="info"
                            count={getSeverityCount('info')}
                            label="Informational"
                        />
                    </div>
                    {highPriorityCount > 0 && (
                        <div className="dashboard-priority-note">
                            <span className="dashboard-priority-icon"><ShieldAlert size={17} /></span>
                            <span><strong>{highPriorityCount.toLocaleString()} high-priority findings</strong> are marked critical or high. Review and validate them in context.</span>
                            <button className="dashboard-inline-link" onClick={() => navigate('/scans')}>
                                Review scans <ArrowRight size={15} />
                            </button>
                        </div>
                    )}
                </section>

                <div className="card dashboard-recent-card">
                    <div className="dashboard-section-heading dashboard-recent-heading">
                        <div>
                            <h2>Recent scans</h2>
                            <p>Your latest assessment activity</p>
                        </div>
                        <button
                            className="btn btn-secondary dashboard-view-all"
                            onClick={() => navigate('/scans')}
                        >
                            View all <ArrowRight size={16} />
                        </button>
                    </div>

                    {recentScans.length > 0 ? (
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
                                    {recentScans.map((scan) => (
                                        <tr key={scan.scan_id}>
                                            <td className="dashboard-target-cell">
                                                {scan.target_url}
                                            </td>
                                            <td>
                                                <StatusBadge status={scan.status} />
                                            </td>
                                            <td>
                                                <span className="dashboard-vulnerability-count">{Number(scan.vuln_count) || 0}</span> found
                                            </td>
                                            <td>
                                                {formatDistanceToNow(new Date(scan.created_at), { addSuffix: true })}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-secondary dashboard-result-button"
                                                    onClick={() => navigate(`/scan/${scan.scan_id}`)}
                                                    disabled={scan.status === 'pending' || scan.status === 'running'}
                                                >
                                                    Results <ArrowRight size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="dashboard-empty-state">
                            <div className="dashboard-empty-icon"><ScanLine size={24} /></div>
                            <h3>Your workspace is ready</h3>
                            <p>Run your first assessment to start building a security overview.</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/scan')}
                            >
                                <ScanLine size={16} /> Start your first scan
                            </button>
                        </div>
                    )}
                </div>

                {/* Common Vulnerabilities */}
                {stats?.commonVulnerabilities?.length > 0 && (
                    <div className="card dashboard-common-card">
                        <div className="dashboard-section-heading">
                            <div>
                                <h2>Most common findings</h2>
                                <p>Types appearing most often in your assessments</p>
                            </div>
                        </div>
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