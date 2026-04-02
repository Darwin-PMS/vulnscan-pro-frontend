import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, ScanLine, AlertTriangle, CheckCircle, Activity, Eye, Bell,
    Clock, Globe, Users, Database, Lock, Key, Download, Play, RefreshCw,
    ChevronRight, Zap, Code, Cloud, GitBranch, Smartphone, Bot, Box, TrendingUp, TrendingDown
} from 'lucide-react';
import api, { scanApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { PageContainer } from '../components/layout';
import { Card, Button, Input, Badge } from '../components/ui';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, startScanMode } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentScans, setRecentScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scanModules, setScanModules] = useState([]);
    const [quickScanUrl, setQuickScanUrl] = useState('');
    const [scanning, setScanning] = useState(false);

    // Initial fetch only - no polling
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [statsRes, scansRes, modulesRes] = await Promise.all([
                scanApi.getDashboardStats().catch(() => ({ data: {} })),
                scanApi.getAllScans({ limit: 5 }).catch(() => ({ data: { scans: [] } })),
                api.get('/scan-modules/modules').catch(() => ({ data: { modules: {} } }))
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
            const res = await scanApi.startScan(quickScanUrl);
            startScanMode(); // Extend token expiry to 24 hours
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

    const statCards = [
        { title: 'Total Scans', value: stats?.totalScans || 0, icon: ScanLine, color: '#6366f1', trend: '+12%', positive: true },
        { title: 'Vulnerabilities', value: stats?.totalVulnerabilities || 0, icon: AlertTriangle, color: '#ef4444', trend: '-5%', positive: false },
        { title: 'Resolved', value: stats?.resolvedVulnerabilities || 0, icon: CheckCircle, color: '#10b981', trend: '+8%', positive: true },
        { title: 'Security Score', value: `${stats?.securityScore || 0}%`, icon: Shield, color: '#f59e0b', trend: '+3%', positive: true }
    ];

    if (loading) {
        return (
            <PageContainer showNavbar={false}>
                <div className="dashboard-loading">
                    <RefreshCw className="animate-spin" size={32} />
                    <p>Loading dashboard...</p>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer
            showNavbar={false}
            title={`Welcome back, ${user?.username || 'User'}`}
            subtitle="Here's your security overview"
            action={
                <Button leftIcon={<ScanLine size={18} />} onClick={() => navigate('/scan')}>
                    New Scan
                </Button>
            }
        >
            {/* Stats Grid */}
            <div className="stats-grid">
                {statCards.map((stat, index) => (
                    <DashboardStatCard key={index} {...stat} />
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-content-grid">
                {/* Main Column */}
                <div className="dashboard-main">
                    {/* Quick Scan */}
                    <Card className="quick-scan-card" padding="lg">
                        <Card.Title icon={<Zap size={20} />}>Quick Scan</Card.Title>
                        <Card.Content>
                            <form onSubmit={handleQuickScan} className="quick-scan-form">
                                <Input
                                    type="url"
                                    placeholder="https://example.com"
                                    value={quickScanUrl}
                                    onChange={(e) => setQuickScanUrl(e.target.value)}
                                    leftIcon={<Globe size={18} />}
                                    required
                                />
                                <Button type="submit" isLoading={scanning} leftIcon={!scanning && <Play size={18} />}>
                                    {scanning ? 'Scanning...' : 'Start Scan'}
                                </Button>
                            </form>
                        </Card.Content>
                    </Card>

                    {/* Scan Modules */}
                    <Card className="modules-card" padding="lg">
                        <Card.Header>
                            <Card.Title icon={<Shield size={20} />}>Security Scan Modules</Card.Title>
                            <Button variant="secondary" size="sm" onClick={() => navigate('/scan-modules')}>
                                View All
                            </Button>
                        </Card.Header>
                        <Card.Content>
                            <div className="modules-grid">
                                {Object.entries(scanModules).map(([id, module]) => {
                                    const Icon = moduleIcons[id] || Shield;
                                    const color = moduleColors[id] || '#6366f1';
                                    return (
                                        <div 
                                            key={id} 
                                            className="module-item"
                                            onClick={() => navigate('/scan-modules')}
                                            style={{ '--module-color': color }}
                                        >
                                            <div className="module-icon" style={{ background: `${color}15`, color }}>
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
                        </Card.Content>
                    </Card>

                    {/* Recent Scans */}
                    <Card className="recent-scans-card" padding="lg">
                        <Card.Header>
                            <Card.Title icon={<Clock size={20} />}>Recent Scans</Card.Title>
                            <Button variant="secondary" size="sm" onClick={() => navigate('/scans')}>
                                View All
                            </Button>
                        </Card.Header>
                        <Card.Content>
                            {recentScans.length === 0 ? (
                                <div className="empty-state">
                                    <ScanLine size={48} className="empty-icon" />
                                    <p className="empty-text">No scans yet. Start your first scan!</p>
                                    <Button onClick={() => navigate('/scan')}>Start Scan</Button>
                                </div>
                            ) : (
                                <div className="scans-list">
                                    {recentScans.map((scan) => (
                                        <div 
                                            key={scan.id || scan.scan_id} 
                                            className="scan-item"
                                            onClick={() => navigate(`/scan/${scan.scan_id}`)}
                                        >
                                            <div className="scan-info">
                                                <Globe size={16} className="scan-icon" />
                                                <span className="scan-url">{scan.target_url}</span>
                                            </div>
                                            <div className="scan-meta">
                                                <Badge.Status status={scan.status} />
                                                <span className="scan-date">
                                                    {new Date(scan.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="scan-vulns">
                                                {scan.critical_count > 0 && (
                                                    <span className="vuln-count critical">{scan.critical_count}</span>
                                                )}
                                                {scan.high_count > 0 && (
                                                    <span className="vuln-count high">{scan.high_count}</span>
                                                )}
                                                {scan.medium_count > 0 && (
                                                    <span className="vuln-count medium">{scan.medium_count}</span>
                                                )}
                                            </div>
                                            <ChevronRight size={16} className="scan-arrow" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card.Content>
                    </Card>
                </div>

                {/* Sidebar Column */}
                <div className="dashboard-sidebar">
                    {/* Security Overview */}
                    <Card className="overview-card" padding="lg">
                        <Card.Title icon={<Activity size={20} />}>Security Overview</Card.Title>
                        <Card.Content>
                            <div className="overview-stats">
                                <div className="overview-stat">
                                    <span className="overview-label">Critical</span>
                                    <span className="overview-value critical">{stats?.criticalVulnerabilities || 0}</span>
                                </div>
                                <div className="overview-stat">
                                    <span className="overview-label">High</span>
                                    <span className="overview-value high">{stats?.highVulnerabilities || 0}</span>
                                </div>
                                <div className="overview-stat">
                                    <span className="overview-label">Medium</span>
                                    <span className="overview-value medium">{stats?.mediumVulnerabilities || 0}</span>
                                </div>
                                <div className="overview-stat">
                                    <span className="overview-label">Low</span>
                                    <span className="overview-value low">{stats?.lowVulnerabilities || 0}</span>
                                </div>
                            </div>
                            <div className="overview-chart">
                                <div 
                                    className="chart-bar critical" 
                                    style={{ height: `${Math.max(5, ((stats?.criticalVulnerabilities || 0) / Math.max(stats?.totalVulnerabilities || 1, 1)) * 100)}%` }} 
                                />
                                <div 
                                    className="chart-bar high" 
                                    style={{ height: `${Math.max(5, ((stats?.highVulnerabilities || 0) / Math.max(stats?.totalVulnerabilities || 1, 1)) * 100)}%` }} 
                                />
                                <div 
                                    className="chart-bar medium" 
                                    style={{ height: `${Math.max(5, ((stats?.mediumVulnerabilities || 0) / Math.max(stats?.totalVulnerabilities || 1, 1)) * 100)}%` }} 
                                />
                                <div 
                                    className="chart-bar low" 
                                    style={{ height: `${Math.max(5, ((stats?.lowVulnerabilities || 0) / Math.max(stats?.totalVulnerabilities || 1, 1)) * 100)}%` }} 
                                />
                            </div>
                        </Card.Content>
                    </Card>

                    {/* Quick Links */}
                    <Card className="quick-links-card" padding="lg">
                        <Card.Title icon={<Zap size={20} />}>Quick Links</Card.Title>
                        <Card.Content>
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
                        </Card.Content>
                    </Card>

                    {/* Security Tips */}
                    <Card className="tips-card" padding="lg">
                        <Card.Title icon={<CheckCircle size={20} />}>Security Tips</Card.Title>
                        <Card.Content>
                            <div className="tips-list">
                                <div className="tip">
                                    <CheckCircle size={14} className="tip-icon" />
                                    <p>Enable MFA for enhanced account security</p>
                                </div>
                                <div className="tip">
                                    <CheckCircle size={14} className="tip-icon" />
                                    <p>Regularly scan for new vulnerabilities</p>
                                </div>
                                <div className="tip">
                                    <CheckCircle size={14} className="tip-icon" />
                                    <p>Review and resolve critical findings promptly</p>
                                </div>
                            </div>
                        </Card.Content>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
};

const DashboardStatCard = ({ title, value, icon: Icon, color, trend, positive }) => (
    <div className="dashboard-stat-card" style={{ '--stat-color': color }}>
        <div className="stat-icon-wrapper">
            <div className="stat-icon" style={{ background: `${color}15`, color }}>
                <Icon size={24} />
            </div>
        </div>
        <div className="stat-content">
            <span className="stat-value">{value}</span>
            <span className="stat-label">{title}</span>
        </div>
        {trend && (
            <div className={`stat-trend ${positive ? 'positive' : 'negative'}`}>
                {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {trend}
            </div>
        )}
    </div>
);

export default Dashboard;
