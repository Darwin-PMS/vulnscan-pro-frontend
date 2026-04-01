import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, ScanLine, AlertTriangle, CheckCircle, TrendingUp, 
    Activity, Eye, Bell, FileText, Clock, Globe, Users,
    Database, Lock, Key, Download, Play, Pause, RefreshCw,
    ChevronRight, Zap, Server, Code, Cloud, GitBranch, Smartphone, Bot, Box
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentScans, setRecentScans] = useState([]);
    const [topVulnerabilities, setTopVulnerabilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scanModules, setScanModules] = useState([]);
    const [quickScanUrl, setQuickScanUrl] = useState('');
    const [scanning, setScanning] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [statsRes, scansRes, modulesRes] = await Promise.all([
                api.get('/api/scans/stats/dashboard'),
                api.get('/api/scans?limit=5'),
                api.get('/api/scan-modules/modules').catch(() => ({ data: { modules: {} } }))
            ]);
            
            setStats(statsRes.data);
            setRecentScans(scansRes.data.scans || []);
            setScanModules(modulesRes.data.modules || {});
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickScan = async (e) => {
        e.preventDefault();
        if (!quickScanUrl) return;
        
        setScanning(true);
        try {
            const res = await api.post('/api/scans/start', { url: quickScanUrl });
            navigate(`/scan/${res.data.scanId}`);
        } catch (error) {
            console.error('Scan failed:', error);
            alert('Scan failed. Please try again.');
        } finally {
            setScanning(false);
        }
    };

    const moduleIcons = {
        owasp: Shield,
        ghdb: Database,
        api: Code,
        cloud: Cloud,
        cicd: GitBranch,
        mobile: Smartphone,
        llm: Bot,
        container: Box
    };

    const moduleColors = {
        owasp: '#6366f1',
        ghdb: '#10b981',
        api: '#f59e0b',
        cloud: '#3b82f6',
        cicd: '#ec4899',
        mobile: '#8b5cf6',
        llm: '#06b6d4',
        container: '#14b8a6'
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <RefreshCw className="animate-spin" size={32} style={{ color: '#6366f1' }} />
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Welcome back, {user?.username || 'User'}</h1>
                    <p>Here is your security overview</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/scan')}>
                    <ScanLine size={18} /> New Scan
                </button>
            </div>

            <div className="stats-grid">
                <StatCard
                    title="Total Scans"
                    value={stats?.totalScans || 0}
                    icon={ScanLine}
                    color="#6366f1"
                    trend="+12%"
                    positive
                />
                <StatCard
                    title="Vulnerabilities"
                    value={stats?.totalVulnerabilities || 0}
                    icon={AlertTriangle}
                    color="#ef4444"
                    trend="-5%"
                    positive={false}
                />
                <StatCard
                    title="Resolved"
                    value={stats?.resolvedVulnerabilities || 0}
                    icon={CheckCircle}
                    color="#10b981"
                    trend="+8%"
                    positive
                />
                <StatCard
                    title="Security Score"
                    value={`${stats?.securityScore || 0}%`}
                    icon={Shield}
                    color="#f59e0b"
                    trend="+3%"
                    positive
                />
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-main">
                    <div className="card quick-scan-card">
                        <h3><Zap size={18} /> Quick Scan</h3>
                        <form onSubmit={handleQuickScan}>
                            <div className="quick-scan-form">
                                <input
                                    type="url"
                                    placeholder="https://example.com"
                                    value={quickScanUrl}
                                    onChange={(e) => setQuickScanUrl(e.target.value)}
                                    required
                                />
                                <button type="submit" className="btn btn-primary" disabled={scanning}>
                                    {scanning ? <RefreshCw className="animate-spin" size={18} /> : <Play size={18} />}
                                    {scanning ? 'Scanning...' : 'Scan'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="card scan-modules-card">
                        <div className="card-header">
                            <h3><Shield size={18} /> Security Scan Modules</h3>
                            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/scan-modules')}>
                                View All
                            </button>
                        </div>
                        <div className="modules-grid">
                            {Object.entries(scanModules).map(([id, module]) => {
                                const Icon = moduleIcons[id] || Shield;
                                const color = moduleColors[id] || '#6366f1';
                                return (
                                    <div 
                                        key={id} 
                                        className="module-item"
                                        onClick={() => navigate('/scan-modules')}
                                        style={{ borderColor: color }}
                                    >
                                        <div className="module-icon" style={{ background: `${color}20`, color }}>
                                            <Icon size={24} />
                                        </div>
                                        <div className="module-info">
                                            <h4>{module.name}</h4>
                                            <p>{module.categories?.totalPatterns || 0} patterns</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="card recent-scans-card">
                        <div className="card-header">
                            <h3><Clock size={18} /> Recent Scans</h3>
                            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/scans')}>
                                View All
                            </button>
                        </div>
                        {recentScans.length === 0 ? (
                            <div className="empty-state">
                                <ScanLine size={48} />
                                <p>No scans yet. Start your first scan!</p>
                                <button className="btn btn-primary" onClick={() => navigate('/scan')}>
                                    Start Scan
                                </button>
                            </div>
                        ) : (
                            <div className="scans-list">
                                {recentScans.map((scan) => (
                                    <div 
                                        key={scan.id} 
                                        className="scan-item"
                                        onClick={() => navigate(`/scan/${scan.scan_id}`)}
                                    >
                                        <div className="scan-info">
                                            <Globe size={16} />
                                            <span className="scan-url">{scan.target_url}</span>
                                        </div>
                                        <div className="scan-meta">
                                            <span className={`scan-status status-${scan.status}`}>
                                                {scan.status}
                                            </span>
                                            <span className="scan-date">
                                                {new Date(scan.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="scan-vulns">
                                            {scan.critical_count > 0 && (
                                                <span className="vuln-badge critical">{scan.critical_count}</span>
                                            )}
                                            {scan.high_count > 0 && (
                                                <span className="vuln-badge high">{scan.high_count}</span>
                                            )}
                                            {scan.medium_count > 0 && (
                                                <span className="vuln-badge medium">{scan.medium_count}</span>
                                            )}
                                        </div>
                                        <ChevronRight size={16} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="dashboard-sidebar">
                    <div className="card security-overview-card">
                        <h3><Activity size={18} /> Security Overview</h3>
                        <div className="overview-stats">
                            <div className="overview-stat">
                                <span className="stat-label">Critical</span>
                                <span className="stat-value critical">{stats?.criticalVulnerabilities || 0}</span>
                            </div>
                            <div className="overview-stat">
                                <span className="stat-label">High</span>
                                <span className="stat-value high">{stats?.highVulnerabilities || 0}</span>
                            </div>
                            <div className="overview-stat">
                                <span className="stat-label">Medium</span>
                                <span className="stat-value medium">{stats?.mediumVulnerabilities || 0}</span>
                            </div>
                            <div className="overview-stat">
                                <span className="stat-label">Low</span>
                                <span className="stat-value low">{stats?.lowVulnerabilities || 0}</span>
                            </div>
                        </div>
                        <div className="overview-chart">
                            <div 
                                className="chart-bar" 
                                style={{ 
                                    height: `${Math.max(5, ((stats?.criticalVulnerabilities || 0) / Math.max(stats?.totalVulnerabilities || 1, 1)) * 100)}%`,
                                    background: '#ef4444'
                                }} 
                            />
                            <div 
                                className="chart-bar" 
                                style={{ 
                                    height: `${Math.max(5, ((stats?.highVulnerabilities || 0) / Math.max(stats?.totalVulnerabilities || 1, 1)) * 100)}%`,
                                    background: '#f97316'
                                }} 
                            />
                            <div 
                                className="chart-bar" 
                                style={{ 
                                    height: `${Math.max(5, ((stats?.mediumVulnerabilities || 0) / Math.max(stats?.totalVulnerabilities || 1, 1)) * 100)}%`,
                                    background: '#f59e0b'
                                }} 
                            />
                            <div 
                                className="chart-bar" 
                                style={{ 
                                    height: `${Math.max(5, ((stats?.lowVulnerabilities || 0) / Math.max(stats?.totalVulnerabilities || 1, 1)) * 100)}%`,
                                    background: '#3b82f6'
                                }} 
                            />
                        </div>
                    </div>

                    <div className="card quick-links-card">
                        <h3><Zap size={18} /> Quick Links</h3>
                        <div className="quick-links">
                            <button onClick={() => navigate('/scan-modules')}>
                                <Shield size={18} /> Scan Modules
                            </button>
                            <button onClick={() => navigate('/dorks')}>
                                <Database size={18} /> GHDB Patterns
                            </button>
                            <button onClick={() => navigate('/ai-assistant')}>
                                <Bot size={18} /> AI Assistant
                            </button>
                            <button onClick={() => navigate('/mobile')}>
                                <Smartphone size={18} /> Mobile Testing
                            </button>
                            {user?.role === 'admin' && (
                                <>
                                    <button onClick={() => navigate('/admin')}>
                                        <Users size={18} /> Admin Panel
                                    </button>
                                    <button onClick={() => navigate('/enterprise')}>
                                        <Lock size={18} /> Enterprise
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="card security-tips-card">
                        <h3><CheckCircle size={18} /> Security Tips</h3>
                        <div className="tips-list">
                            <div className="tip">
                                <CheckCircle size={14} color="#10b981" />
                                <p>Enable MFA for enhanced account security</p>
                            </div>
                            <div className="tip">
                                <CheckCircle size={14} color="#10b981" />
                                <p>Regularly scan for new vulnerabilities</p>
                            </div>
                            <div className="tip">
                                <CheckCircle size={14} color="#10b981" />
                                <p>Review and resolve critical findings promptly</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, color, trend, positive }) => (
    <div className="stat-card">
        <div className="stat-icon" style={{ background: `${color}20`, color }}>
            <Icon size={24} />
        </div>
        <div className="stat-content">
            <span className="stat-value">{value}</span>
            <span className="stat-title">{title}</span>
        </div>
        {trend && (
            <span className={`stat-trend ${positive ? 'positive' : 'negative'}`}>
                {trend}
            </span>
        )}
    </div>
);

export default Dashboard;
