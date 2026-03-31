import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Scan, Bug, Shield, Activity, Zap, Crown, User, ArrowRight, 
    TrendingUp, Clock, Target, CheckCircle, XCircle, Sun, Moon,
    RefreshCw, AlertOctagon, AlertTriangle, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { scanApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import StatusBadge from '../components/StatusBadge';
import { formatDistanceToNow, format } from 'date-fns';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

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

    const theme = isDark ? {
        bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        bgSecondary: 'rgba(255,255,255,0.05)',
        bgCard: 'rgba(255,255,255,0.05)',
        bgCardHover: 'rgba(255,255,255,0.08)',
        border: 'rgba(255,255,255,0.1)',
        text: '#f1f5f9',
        textSecondary: '#94a3b8',
        textMuted: '#64748b',
    } : {
        bg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        bgSecondary: 'rgba(0,0,0,0.03)',
        bgCard: '#ffffff',
        bgCardHover: '#f8fafc',
        border: 'rgba(0,0,0,0.08)',
        text: '#0f172a',
        textSecondary: '#475569',
        textMuted: '#94a3b8',
    };

    if (loading) {
        return (
            <div style={{ ...styles.pageContainer, background: theme.bg }}>
                <div style={styles.loadingSpinner}></div>
                <p style={{ ...styles.loadingText, color: theme.text }}>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div style={{ ...styles.pageContainer, background: theme.bg }}>
            {/* Header */}
            <header style={{ ...styles.header, borderBottom: `1px solid ${theme.border}` }}>
                <div style={styles.headerContent}>
                    <div>
                        <h1 style={{ ...styles.title, color: theme.text }}>
                            Welcome back, <span style={{ color: '#6366f1' }}>{user?.username || 'User'}</span>
                        </h1>
                        <p style={{ ...styles.subtitle, color: theme.textSecondary }}>
                            <User size={14} style={{ display: 'inline', marginRight: '6px' }} />
                            {user?.email}
                        </p>
                    </div>
                    <div style={styles.headerActions}>
                        <button 
                            style={{ ...styles.themeToggle, background: theme.bgCard, border: `1px solid ${theme.border}` }} 
                            onClick={toggleTheme}
                        >
                            {isDark ? <Sun size={18} style={{ color: '#fbbf24' }} /> : <Moon size={18} style={{ color: '#6366f1' }} />}
                        </button>
                        <button 
                            style={{ ...styles.refreshBtn, background: theme.bgCard, border: `1px solid ${theme.border}`, color: theme.text }} 
                            onClick={fetchStats}
                        >
                            <RefreshCw size={18} />
                        </button>
                        <button style={styles.newScanBtn} onClick={() => navigate('/scan')}>
                            <Scan size={18} />
                            New Scan
                        </button>
                    </div>
                </div>
            </header>

            <main style={styles.main}>
                {/* Quick Stats */}
                <div style={styles.statsGrid}>
                    <div style={{ ...styles.statCard, background: theme.bgCard, border: `1px solid ${theme.border}` }}>
                        <div style={styles.statCardHeader}>
                            <div style={{ ...styles.statIcon, background: 'rgba(99, 102, 241, 0.15)' }}>
                                <Scan size={24} style={{ color: '#6366f1' }} />
                            </div>
                            <span style={{ ...styles.statTrend, color: '#22c55e' }}>
                                <TrendingUp size={14} /> Active
                            </span>
                        </div>
                        <span style={{ ...styles.statValue, color: theme.text }}>{stats?.totalScans || 0}</span>
                        <span style={{ ...styles.statLabel, color: theme.textSecondary }}>Total Scans</span>
                    </div>

                    <div style={{ ...styles.statCard, background: theme.bgCard, border: `1px solid ${theme.border}` }}>
                        <div style={styles.statCardHeader}>
                            <div style={{ ...styles.statIcon, background: 'rgba(239, 68, 68, 0.15)' }}>
                                <Bug size={24} style={{ color: '#dc2626' }} />
                            </div>
                        </div>
                        <span style={{ ...styles.statValue, color: theme.text }}>{stats?.totalVulnerabilities || 0}</span>
                        <span style={{ ...styles.statLabel, color: theme.textSecondary }}>Vulnerabilities Found</span>
                    </div>

                    <div style={{ ...styles.statCard, background: theme.bgCard, border: `1px solid ${theme.border}` }}>
                        <div style={styles.statCardHeader}>
                            <div style={{ ...styles.statIcon, background: 'rgba(16, 185, 129, 0.15)' }}>
                                <CheckCircle size={24} style={{ color: '#22c55e' }} />
                            </div>
                        </div>
                        <span style={{ ...styles.statValue, color: theme.text }}>
                            {stats?.recentScans?.filter(s => s.status === 'completed').length || 0}
                        </span>
                        <span style={{ ...styles.statLabel, color: theme.textSecondary }}>Completed</span>
                    </div>

                    <div style={{ ...styles.statCard, background: theme.bgCard, border: `1px solid ${theme.border}` }}>
                        <div style={styles.statCardHeader}>
                            <div style={{ ...styles.statIcon, background: 'rgba(249, 115, 22, 0.15)' }}>
                                <Activity size={24} style={{ color: '#f97316' }} />
                            </div>
                        </div>
                        <span style={{ ...styles.statValue, color: theme.text }}>
                            {stats?.recentScans?.filter(s => s.status === 'running' || s.status === 'pending').length || 0}
                        </span>
                        <span style={{ ...styles.statLabel, color: theme.textSecondary }}>In Progress</span>
                    </div>
                </div>

                {/* Severity Breakdown */}
                <section style={{ marginBottom: '32px' }}>
                    <h2 style={{ ...styles.sectionTitle, color: theme.text }}>
                        <Shield size={20} style={{ color: '#6366f1' }} />
                        Vulnerability Breakdown
                    </h2>
                    <div style={styles.severityGrid}>
                        {[
                            { key: 'critical', label: 'Critical', color: '#dc2626', count: getSeverityCount('critical'), icon: AlertOctagon },
                            { key: 'high', label: 'High', color: '#f97316', count: getSeverityCount('high'), icon: AlertTriangle },
                            { key: 'medium', label: 'Medium', color: '#eab308', count: getSeverityCount('medium'), icon: AlertCircle },
                            { key: 'low', label: 'Low', color: '#22c55e', count: getSeverityCount('low'), icon: Shield },
                        ].map((sev) => (
                            <div 
                                key={sev.key} 
                                style={{ 
                                    ...styles.severityCard, 
                                    background: theme.bgCard, 
                                    border: `1px solid ${theme.border}` 
                                }}
                            >
                                <div style={{ ...styles.severityCardHeader }}>
                                    <sev.icon size={20} style={{ color: sev.color }} />
                                    <span style={{ color: sev.color }}>{sev.count}</span>
                                </div>
                                <div style={{ ...styles.severityBar, background: theme.border }}>
                                    <div style={{ 
                                        ...styles.severityBarFill, 
                                        width: stats?.totalVulnerabilities ? `${(sev.count / stats.totalVulnerabilities) * 100}%` : '0%',
                                        background: sev.color 
                                    }}></div>
                                </div>
                                <span style={{ ...styles.severityLabel, color: theme.textSecondary }}>{sev.label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recent Scans */}
                <section style={{ marginBottom: '32px' }}>
                    <div style={styles.sectionHeader}>
                        <h2 style={{ ...styles.sectionTitle, color: theme.text }}>
                            <Clock size={20} style={{ color: '#6366f1' }} />
                            Recent Scans
                        </h2>
                        <button 
                            style={{ ...styles.viewAllBtn, border: `1px solid ${theme.border}`, color: theme.textSecondary }}
                            onClick={() => navigate('/scans')}
                        >
                            View All <ArrowUpRight size={16} />
                        </button>
                    </div>

                    {stats?.recentScans?.length > 0 ? (
                        <div style={styles.scansGrid}>
                            {stats.recentScans.map((scan) => (
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
                                        <StatusBadge status={scan.status} />
                                        <span style={{ ...styles.scanDate, color: theme.textMuted }}>
                                            {formatDistanceToNow(new Date(scan.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <div style={styles.scanUrl}>
                                        <Target size={14} style={{ color: theme.textMuted }} />
                                        <span style={{ color: theme.text }}>{scan.target_url}</span>
                                    </div>
                                    <div style={styles.scanStats}>
                                        <div style={styles.scanStat}>
                                            <Bug size={14} style={{ color: '#dc2626' }} />
                                            <span style={{ color: theme.text }}>{scan.vuln_count || 0}</span>
                                            <span style={{ color: theme.textMuted }}>vulns</span>
                                        </div>
                                        <button style={{ ...styles.viewBtn, color: '#6366f1' }}>
                                            View <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ ...styles.emptyState, background: theme.bgCard, border: `1px solid ${theme.border}` }}>
                            <Scan size={64} style={{ color: theme.textMuted, marginBottom: '16px' }} />
                            <h3 style={{ ...styles.emptyTitle, color: theme.text }}>No Scans Yet</h3>
                            <p style={{ ...styles.emptyText, color: theme.textSecondary }}>
                                Start your first vulnerability scan to see results here
                            </p>
                            <button style={styles.startBtn} onClick={() => navigate('/scan')}>
                                <Zap size={18} />
                                Start First Scan
                            </button>
                        </div>
                    )}
                </section>

                {/* Common Vulnerabilities */}
                {stats?.commonVulnerabilities?.length > 0 && (
                    <section>
                        <h2 style={{ ...styles.sectionTitle, color: theme.text }}>
                            <AlertOctagon size={20} style={{ color: '#6366f1' }} />
                            Common Vulnerability Types
                        </h2>
                        <div style={{ ...styles.vulnList, background: theme.bgCard, border: `1px solid ${theme.border}` }}>
                            {stats.commonVulnerabilities.map((vuln, index) => (
                                <div 
                                    key={index} 
                                    style={{ 
                                        ...styles.vulnItem, 
                                        borderBottom: index < stats.commonVulnerabilities.length - 1 ? `1px solid ${theme.border}` : 'none' 
                                    }}
                                >
                                    <span style={{ ...styles.vulnRank, color: '#6366f1' }}>#{index + 1}</span>
                                    <span style={{ ...styles.vulnType, color: theme.text }}>{vuln.vulnerability_type}</span>
                                    <span style={{ ...styles.vulnCount, color: theme.textSecondary }}>{vuln.count} occurrences</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

const styles = {
    pageContainer: { minHeight: '100vh', color: '#f1f5f9' },
    loadingSpinner: {
        width: '48px', height: '48px',
        border: '4px solid rgba(99, 102, 241, 0.2)',
        borderTopColor: '#6366f1',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto',
        marginTop: '20vh'
    },
    loadingText: { fontSize: '18px', textAlign: 'center', marginTop: '16px' },
    header: { padding: '24px 32px', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' },
    headerContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' },
    title: { fontSize: '28px', fontWeight: '700', margin: '0 0 4px 0' },
    subtitle: { fontSize: '14px', margin: 0 },
    headerActions: { display: 'flex', gap: '12px', alignItems: 'center' },
    themeToggle: { padding: '10px', borderRadius: '10px', cursor: 'pointer', display: 'flex' },
    refreshBtn: { padding: '10px', borderRadius: '10px', cursor: 'pointer', display: 'flex' },
    newScanBtn: {
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '12px 20px',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        border: 'none', borderRadius: '10px',
        color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
    },
    main: { padding: '24px 32px', maxWidth: '1400px', margin: '0 auto' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' },
    statCard: { padding: '20px', borderRadius: '16px' },
    statCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
    statIcon: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    statTrend: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '500' },
    statValue: { display: 'block', fontSize: '32px', fontWeight: '800', lineHeight: 1 },
    statLabel: { display: 'block', fontSize: '13px', marginTop: '4px' },
    sectionTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
    viewAllBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'transparent', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
    severityGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' },
    severityCard: { padding: '20px', borderRadius: '12px' },
    severityCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
    severityBar: { height: '6px', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' },
    severityBarFill: { height: '100%', borderRadius: '3px', transition: 'width 0.3s ease' },
    severityLabel: { fontSize: '13px' },
    scansGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' },
    scanCard: { padding: '20px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' },
    scanCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
    scanDate: { fontSize: '12px' },
    scanUrl: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', marginBottom: '12px' },
    scanStats: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    scanStat: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' },
    viewBtn: { display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
    emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 24px', borderRadius: '16px', textAlign: 'center' },
    emptyTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '8px' },
    emptyText: { fontSize: '14px', maxWidth: '300px' },
    startBtn: {
        display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px',
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        border: 'none', borderRadius: '10px',
        color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
    },
    vulnList: { borderRadius: '12px', overflow: 'hidden' },
    vulnItem: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px' },
    vulnRank: { fontSize: '14px', fontWeight: '600', minWidth: '30px' },
    vulnType: { flex: 1, fontSize: '14px' },
    vulnCount: { fontSize: '13px' },
};

export default Dashboard;
