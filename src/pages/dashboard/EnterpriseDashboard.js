/**
 * Enterprise Security Dashboard Component
 * NIST CSF Aligned UI with Real-time Monitoring
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, AlertTriangle, Activity, Users, Database, Lock,
    Eye, Bell, FileText, CheckCircle, XCircle, Clock,
    TrendingUp, TrendingDown, ChevronRight, RefreshCw, Download,
    Filter, Search, Calendar, MapPin, Monitor, Smartphone,
    Key, ShieldCheck, AlertOctagon, EyeOff, History, Settings,
    AlertCircle
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';

const EnterpriseDashboard = () => {
    const navigate = useNavigate();
    const { user, isLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [compliance, setCompliance] = useState(null);
    const [exporting, setExporting] = useState(false);
    const toast = useToast();
    
    const ALLOWED_ROLES = ['enterprise', 'admin', 'super_admin'];
    
    useEffect(() => {
        if (isLoading) return;
        
        if (!user) {
            navigate('/login', { replace: true });
            return;
        }
        
        if (!ALLOWED_ROLES.includes(user.role)) {
            navigate('/dashboard', { replace: true });
            toast.error('Access denied. Enterprise dashboard requires enterprise or admin role.');
            return;
        }
        
        fetchDashboardData();
    }, [user, isLoading, navigate]);
    
    const theme = {
        dark: {
            bg: '#0f172a',
            card: 'rgba(255,255,255,0.05)',
            border: 'rgba(255,255,255,0.1)',
            text: '#f1f5f9',
            muted: '#94a3b8'
        },
        light: {
            bg: '#f8fafc',
            card: '#ffffff',
            border: 'rgba(0,0,0,0.08)',
            text: '#0f172a',
            muted: '#64748b'
        }
    };
    
    const currentTheme = theme.dark;
    
    if (isLoading) {
        return <LoadingState theme={currentTheme} />;
    }
    
    if (!user || !ALLOWED_ROLES.includes(user.role)) {
        return <AccessDenied theme={currentTheme} />;
    }
    
    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [statsRes, alertsRes, complianceRes] = await Promise.all([
                api.get('/api/admin/enterprise/stats'),
                api.get('/api/admin/enterprise/alerts'),
                api.get('/api/admin/enterprise/compliance')
            ]);
            setStats(statsRes.data);
            setAlerts(alertsRes.data.alerts);
            setCompliance(complianceRes.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) {
        return <LoadingState theme={currentTheme} />;
    }
    
    return (
        <div style={{ minHeight: '100vh', background: currentTheme.bg, padding: '24px' }}>
            <DashboardHeader theme={currentTheme} onRefresh={fetchDashboardData} />
            
            <div style={{ display: 'flex', gap: '24px', marginTop: '24px' }}>
                <Sidebar 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    theme={currentTheme} 
                />
                
                <main style={{ flex: 1 }}>
                    {activeTab === 'overview' && (
                        <OverviewTab stats={stats} alerts={alerts} theme={currentTheme} />
                    )}
                    {activeTab === 'nist' && (
                        <NistCSFComplianceTab compliance={compliance} theme={currentTheme} />
                    )}
                    {activeTab === 'threats' && (
                        <ThreatIntelligenceTab theme={currentTheme} />
                    )}
                    {activeTab === 'privacy' && (
                        <PrivacyDashboardTab theme={currentTheme} />
                    )}
                    {activeTab === 'incidents' && (
                        <IncidentManagementTab theme={currentTheme} />
                    )}
                    {activeTab === 'reports' && (
                        <ComplianceReportsTab theme={currentTheme} />
                    )}
                </main>
            </div>
        </div>
    );
};

const DashboardHeader = ({ theme, onRefresh }) => (
    <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 24px',
        background: theme.card,
        borderRadius: '16px',
        border: `1px solid ${theme.border}`
    }}>
        <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: theme.text, margin: 0 }}>
                Enterprise Security Operations Center
            </h1>
            <p style={{ color: theme.muted, margin: '4px 0 0 0', fontSize: '14px' }}>
                Real-time monitoring • Threat intelligence • Compliance
            </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
            <button 
                onClick={onRefresh}
                style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 16px', background: 'transparent',
                    border: `1px solid ${theme.border}`, borderRadius: '8px',
                    color: theme.text, cursor: 'pointer'
                }}
            >
                <RefreshCw size={16} /> Refresh
            </button>
            <button style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 16px', background: '#6366f1',
                border: 'none', borderRadius: '8px',
                color: 'white', cursor: 'pointer', fontWeight: '500'
            }}>
                <Download size={16} /> Export Report
            </button>
        </div>
    </header>
);

const Sidebar = ({ activeTab, setActiveTab, theme }) => {
    const menuItems = [
        { id: 'overview', icon: Activity, label: 'Overview' },
        { id: 'nist', icon: Shield, label: 'NIST CSF' },
        { id: 'threats', icon: AlertTriangle, label: 'Threat Intel' },
        { id: 'privacy', icon: EyeOff, label: 'Privacy' },
        { id: 'incidents', icon: AlertOctagon, label: 'Incidents' },
        { id: 'reports', icon: FileText, label: 'Reports' }
    ];
    
    return (
        <aside style={{
            width: '240px',
            background: theme.card,
            borderRadius: '16px',
            border: `1px solid ${theme.border}`,
            padding: '16px'
        }}>
            {menuItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        width: '100%', padding: '12px 16px', marginBottom: '8px',
                        background: activeTab === item.id ? '#6366f1' : 'transparent',
                        border: 'none', borderRadius: '8px',
                        color: activeTab === item.id ? 'white' : theme.muted,
                        cursor: 'pointer', textAlign: 'left', fontSize: '14px',
                        fontWeight: activeTab === item.id ? '500' : '400'
                    }}
                >
                    <item.icon size={18} />
                    {item.label}
                </button>
            ))}
        </aside>
    );
};

const OverviewTab = ({ stats, alerts, theme }) => (
    <div>
        {/* Security Score */}
        <SecurityScoreCard score={stats?.securityScore || 0} theme={theme} />
        
        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '24px' }}>
            <QuickStatCard
                title="Active Users"
                value={stats?.activeUsers || 0}
                trend="+12%"
                positive
                icon={Users}
                theme={theme}
            />
            <QuickStatCard
                title="Open Incidents"
                value={stats?.openIncidents || 0}
                trend="-5%"
                positive={false}
                icon={AlertOctagon}
                theme={theme}
            />
            <QuickStatCard
                title="Compliance Score"
                value={`${stats?.complianceScore || 0}%`}
                trend="+3%"
                positive
                icon={ShieldCheck}
                theme={theme}
            />
            <QuickStatCard
                title="Threats Blocked"
                value={stats?.threatsBlocked || 0}
                trend="+25%"
                positive
                icon={Lock}
                theme={theme}
            />
        </div>
        
        {/* NIST CSF Overview */}
        <div style={{ marginTop: '24px' }}>
            <h3 style={{ color: theme.text, marginBottom: '16px' }}>NIST CSF Functions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {['IDENTIFY', 'PROTECT', 'DETECT', 'RESPOND', 'RECOVER', 'GOVERN'].map(func => (
                    <NISTFunctionCard
                        key={func}
                        function={func}
                        score={stats?.nistScores?.[func] || 0}
                        theme={theme}
                    />
                ))}
            </div>
        </div>
        
        {/* Recent Alerts */}
        <div style={{ marginTop: '24px' }}>
            <h3 style={{ color: theme.text, marginBottom: '16px' }}>Recent Security Alerts</h3>
            <AlertsList alerts={alerts} theme={theme} />
        </div>
    </div>
);

const SecurityScoreCard = ({ score, theme }) => {
    const getScoreColor = (s) => {
        if (s >= 90) return '#10b981';
        if (s >= 70) return '#f59e0b';
        return '#ef4444';
    };
    
    return (
        <div style={{
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '32px'
        }}>
            <div style={{
                width: '120px', height: '120px',
                borderRadius: '50%',
                background: `conic-gradient(${getScoreColor(score)} ${score * 3.6}deg, ${theme.border} 0deg)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <div style={{
                    width: '100px', height: '100px',
                    borderRadius: '50%',
                    background: theme.card,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column'
                }}>
                    <span style={{ fontSize: '28px', fontWeight: '700', color: getScoreColor(score) }}>{score}</span>
                    <span style={{ fontSize: '12px', color: theme.muted }}>Score</span>
                </div>
            </div>
            <div style={{ flex: 1 }}>
                <h3 style={{ color: theme.text, margin: '0 0 8px 0' }}>Overall Security Score</h3>
                <p style={{ color: theme.muted, margin: '0 0 16px 0' }}>
                    Based on NIST Cybersecurity Framework assessment
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <StatusBadge label="Compliance" status="good" theme={theme} />
                    <StatusBadge label="Vulnerabilities" status="warning" theme={theme} />
                    <StatusBadge label="Access Control" status="good" theme={theme} />
                </div>
            </div>
        </div>
    );
};

const QuickStatCard = ({ title, value, trend, positive, icon: Icon, theme }) => (
    <div style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: '12px',
        padding: '20px'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{
                width: '40px', height: '40px',
                background: 'rgba(99, 102, 241, 0.15)',
                borderRadius: '10px', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
            }}>
                <Icon size={20} color="#6366f1" />
            </div>
            <span style={{
                fontSize: '12px',
                color: positive ? '#10b981' : '#ef4444',
                fontWeight: '500'
            }}>
                {trend}
            </span>
        </div>
        <div style={{ marginTop: '12px' }}>
            <span style={{ fontSize: '28px', fontWeight: '700', color: theme.text }}>{value}</span>
            <p style={{ color: theme.muted, margin: '4px 0 0 0', fontSize: '13px' }}>{title}</p>
        </div>
    </div>
);

const NISTFunctionCard = ({ function: func, score, theme }) => {
    const colors = {
        IDENTIFY: '#3b82f6',
        PROTECT: '#10b981',
        DETECT: '#f59e0b',
        RESPOND: '#ef4444',
        RECOVER: '#8b5cf6',
        GOVERN: '#6366f1'
    };
    
    return (
        <div style={{
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: '12px',
            padding: '20px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: colors[func] }}>
                    NIST CSF
                </span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: theme.text }}>
                    {score}%
                </span>
            </div>
            <h4 style={{ color: theme.text, margin: '0 0 8px 0', fontSize: '16px' }}>{func}</h4>
            <div style={{
                height: '6px',
                background: theme.border,
                borderRadius: '3px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${score}%`,
                    height: '100%',
                    background: colors[func],
                    transition: 'width 0.3s ease'
                }} />
            </div>
        </div>
    );
};

const AlertsList = ({ alerts, theme }) => (
    <div style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: '12px',
        overflow: 'hidden'
    }}>
        {alerts.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: theme.muted }}>
                <ShieldCheck size={48} style={{ opacity: 0.3, marginBottom: '8px' }} />
                <p>No active alerts</p>
            </div>
        ) : (
            alerts.map((alert, index) => (
                <AlertItem key={alert.id} alert={alert} theme={theme} isLast={index === alerts.length - 1} />
            ))
        )}
    </div>
);

const AlertItem = ({ alert, theme, isLast }) => {
    const severityColors = {
        critical: '#ef4444',
        high: '#f97316',
        medium: '#f59e0b',
        low: '#3b82f6'
    };
    
    return (
        <div style={{
            padding: '16px 20px',
            borderBottom: isLast ? 'none' : `1px solid ${theme.border}`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
        }}>
            <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: severityColors[alert.severity],
                marginTop: '6px'
            }} />
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: theme.text, fontWeight: '500' }}>{alert.title}</span>
                    <span style={{ fontSize: '12px', color: theme.muted }}>{alert.time}</span>
                </div>
                <p style={{ color: theme.muted, margin: '4px 0 0 0', fontSize: '13px' }}>
                    {alert.description}
                </p>
            </div>
            <button style={{
                padding: '6px 12px',
                background: 'rgba(99, 102, 241, 0.1)',
                border: 'none', borderRadius: '6px',
                color: '#6366f1', fontSize: '12px', cursor: 'pointer'
            }}>
                Review
            </button>
        </div>
    );
};

const StatusBadge = ({ label, status, theme }) => {
    const colors = {
        good: '#10b981',
        warning: '#f59e0b',
        bad: '#ef4444'
    };
    
    return (
        <span style={{
            padding: '4px 10px',
            background: `${colors[status]}20`,
            color: colors[status],
            borderRadius: '6px',
            fontSize: '12px', fontWeight: '500'
        }}>
            {label}
        </span>
    );
};

const NistCSFComplianceTab = ({ compliance, theme }) => (
    <div>
        <h2 style={{ color: theme.text, marginBottom: '24px' }}>NIST CSF Compliance Dashboard</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {Object.entries(compliance || {}).map(([func, data]) => (
                <NISTDetailCard key={func} function={func} data={data} theme={theme} />
            ))}
        </div>
    </div>
);

const NISTDetailCard = ({ function: func, data, theme }) => (
    <div style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: '12px',
        padding: '20px'
    }}>
        <h3 style={{ color: theme.text, marginBottom: '16px' }}>{func}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div>
                <span style={{ fontSize: '24px', fontWeight: '700', color: '#6366f1' }}>
                    {data.controlsImplemented || 0}
                </span>
                <p style={{ color: theme.muted, margin: '4px 0 0 0', fontSize: '12px' }}>Controls</p>
            </div>
            <div>
                <span style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>
                    {data.score || 0}%
                </span>
                <p style={{ color: theme.muted, margin: '4px 0 0 0', fontSize: '12px' }}>Score</p>
            </div>
        </div>
    </div>
);

const ThreatIntelligenceTab = ({ theme }) => {
    const [threats, setThreats] = useState([]);
    const [cves, setCves] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetchThreatData();
    }, []);
    
    const fetchThreatData = async () => {
        setLoading(true);
        try {
            const [threatsRes, auditRes] = await Promise.all([
                api.get('/api/admin/enterprise/audit/security-events'),
                api.get('/api/admin/enterprise/audit/anomalies')
            ]);
            setThreats(threatsRes.data.events || []);
            setCves(auditRes.data.anomalies || []);
        } catch (error) {
            console.error('Failed to fetch threat data:', error);
            setThreats([]);
            setCves([]);
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) return <LoadingState theme={theme} />;
    
    return (
        <div>
            <h2 style={{ color: theme.text, marginBottom: '24px' }}>Threat Intelligence</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <ThreatStatCard title="Active Threats" value={threats.filter(t => t.severity === 'critical').length} icon={AlertTriangle} color="#ef4444" theme={theme} />
                <ThreatStatCard title="Blocked Today" value={threats.length} icon={ShieldCheck} color="#10b981" theme={theme} />
                <ThreatStatCard title="Anomalies" value={cves.length} icon={Activity} color="#f59e0b" theme={theme} />
                <ThreatStatCard title="Risk Score" value="72" icon={TrendingUp} color="#6366f1" theme={theme} />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '20px' }}>
                    <h3 style={{ color: theme.text, marginBottom: '16px' }}>Recent Security Events</h3>
                    <ThreatEventList events={threats.slice(0, 5)} theme={theme} />
                </div>
                <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '20px' }}>
                    <h3 style={{ color: theme.text, marginBottom: '16px' }}>Detected Anomalies</h3>
                    <AnomalyList anomalies={cves.slice(0, 5)} theme={theme} />
                </div>
            </div>
        </div>
    );
};

const ThreatStatCard = ({ title, value, icon: Icon, color, theme }) => (
    <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={24} color={color} />
            </div>
            <div>
                <span style={{ fontSize: '28px', fontWeight: '700', color: theme.text }}>{value}</span>
                <p style={{ color: theme.muted, margin: 0, fontSize: '13px' }}>{title}</p>
            </div>
        </div>
    </div>
);

const ThreatEventList = ({ events, theme }) => (
    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {events.length === 0 ? (
            <p style={{ color: theme.muted, textAlign: 'center', padding: '24px' }}>No recent events</p>
        ) : (
            events.map((event, i) => (
                <div key={event.id || i} style={{ padding: '12px 0', borderBottom: `1px solid ${theme.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: theme.text, fontSize: '14px' }}>{event.action || 'Security Event'}</span>
                        <SeverityBadge severity={event.severity} theme={theme} />
                    </div>
                    <p style={{ color: theme.muted, margin: '4px 0 0', fontSize: '12px' }}>
                        {event.description || event.details || 'No details available'}
                    </p>
                </div>
            ))
        )}
    </div>
);

const AnomalyList = ({ anomalies, theme }) => (
    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {anomalies.length === 0 ? (
            <p style={{ color: theme.muted, textAlign: 'center', padding: '24px' }}>No anomalies detected</p>
        ) : (
            anomalies.map((anomaly, i) => (
                <div key={anomaly.id || i} style={{ padding: '12px 0', borderBottom: `1px solid ${theme.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: theme.text, fontSize: '14px' }}>{anomaly.type || 'Anomaly'}</span>
                        <span style={{ fontSize: '12px', color: anomaly.riskLevel === 'high' ? '#ef4444' : '#f59e0b' }}>
                            {anomaly.riskLevel || 'medium'} risk
                        </span>
                    </div>
                    <p style={{ color: theme.muted, margin: '4px 0 0', fontSize: '12px' }}>
                        Detected: {new Date(anomaly.detected_at || anomaly.created_at || Date.now()).toLocaleString()}
                    </p>
                </div>
            ))
        )}
    </div>
);

const SeverityBadge = ({ severity, theme }) => {
    const colors = { critical: '#ef4444', high: '#f97316', medium: '#f59e0b', low: '#3b82f6' };
    return (
        <span style={{ padding: '4px 8px', background: `${colors[severity] || '#94a3b8'}20`, color: colors[severity] || '#94a3b8', borderRadius: '4px', fontSize: '11px', fontWeight: '500' }}>
            {severity?.toUpperCase() || 'UNKNOWN'}
        </span>
    );
};

const PrivacyDashboardTab = ({ theme }) => (
    <div>
        <h2 style={{ color: theme.text, marginBottom: '24px' }}>Privacy Engineering</h2>
        <PrivacyScoreCard theme={theme} />
        <ConsentOverview theme={theme} />
    </div>
);

const PrivacyScoreCard = ({ theme }) => (
    <div style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: '12px',
        padding: '20px',
        marginTop: '16px'
    }}>
        <h3 style={{ color: theme.text, marginBottom: '16px' }}>Privacy Risk Score</h3>
        <div style={{ display: 'flex', gap: '24px' }}>
            <PrivacyMetric label="Data Minimization" score={95} theme={theme} />
            <PrivacyMetric label="Consent Management" score={88} theme={theme} />
            <PrivacyMetric label="PII Protection" score={92} theme={theme} />
        </div>
    </div>
);

const PrivacyMetric = ({ label, score, theme }) => (
    <div style={{ textAlign: 'center' }}>
        <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            border: `4px solid ${score >= 90 ? '#10b981' : '#f59e0b'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 8px'
        }}>
            <span style={{ fontSize: '20px', fontWeight: '700', color: theme.text }}>{score}</span>
        </div>
        <span style={{ fontSize: '12px', color: theme.muted }}>{label}</span>
    </div>
);

const ConsentOverview = ({ theme }) => (
    <div style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: '12px',
        padding: '20px',
        marginTop: '16px'
    }}>
        <h3 style={{ color: theme.text, marginBottom: '16px' }}>Consent Status</h3>
        <div style={{ display: 'flex', gap: '16px' }}>
            <ConsentStat label="Marketing" granted={45} denied={5} theme={theme} />
            <ConsentStat label="Analytics" granted={60} denied={10} theme={theme} />
            <ConsentStat label="Essential" granted={100} denied={0} theme={theme} />
        </div>
    </div>
);

const ConsentStat = ({ label, granted, denied, theme }) => (
    <div style={{ flex: 1, textAlign: 'center' }}>
        <span style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>{granted}%</span>
        <p style={{ color: theme.muted, margin: '4px 0 0 0', fontSize: '12px' }}>{label}</p>
    </div>
);

const IncidentManagementTab = ({ theme }) => {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    
    useEffect(() => {
        fetchIncidents();
    }, [filter]);
    
    const fetchIncidents = async () => {
        setLoading(true);
        try {
            const params = filter !== 'all' ? `?status=${filter}` : '';
            const res = await api.get(`/api/admin/enterprise/incidents${params}`);
            setIncidents(res.data.incidents || []);
        } catch (error) {
            console.error('Failed to fetch incidents:', error);
            setIncidents([]);
        } finally {
            setLoading(false);
        }
    };
    
    const handleEscalate = async (ticketId) => {
        try {
            await api.put(`/api/admin/enterprise/incidents/${ticketId}/escalate`, { level: 2, reason: 'Manual escalation from dashboard' });
            fetchIncidents();
        } catch (error) {
            console.error('Failed to escalate:', error);
        }
    };
    
    if (loading) return <LoadingState theme={theme} />;
    
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ color: theme.text, margin: 0 }}>Incident Management</h2>
                <button 
                    onClick={() => setShowCreateModal(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#6366f1', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '14px' }}
                >
                    + Create Incident
                </button>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                {['all', 'open', 'investigating', 'resolved'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{ padding: '8px 16px', background: filter === f ? '#6366f1' : theme.card, border: `1px solid ${theme.border}`, borderRadius: '8px', color: filter === f ? 'white' : theme.muted, cursor: 'pointer', fontSize: '13px' }}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>
            
            <IncidentTable incidents={incidents} onEscalate={handleEscalate} theme={theme} />
            
            {showCreateModal && (
                <CreateIncidentModal onClose={() => setShowCreateModal(false)} onCreated={fetchIncidents} theme={theme} />
            )}
        </div>
    );
};

const IncidentTable = ({ incidents, onEscalate, theme }) => (
    <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', overflow: 'hidden' }}>
        {incidents.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
                <AlertOctagon size={48} color={theme.muted} style={{ opacity: 0.3 }} />
                <p style={{ color: theme.muted, marginTop: '8px' }}>No incidents found</p>
            </div>
        ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: theme.muted, fontSize: '12px', fontWeight: '600' }}>ID</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: theme.muted, fontSize: '12px', fontWeight: '600' }}>Type</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: theme.muted, fontSize: '12px', fontWeight: '600' }}>Severity</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: theme.muted, fontSize: '12px', fontWeight: '600' }}>Status</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: theme.muted, fontSize: '12px', fontWeight: '600' }}>Created</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: theme.muted, fontSize: '12px', fontWeight: '600' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {incidents.map(incident => (
                        <tr key={incident.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                            <td style={{ padding: '12px 16px', color: theme.text, fontSize: '14px' }}>#{incident.id}</td>
                            <td style={{ padding: '12px 16px', color: theme.text, fontSize: '14px' }}>{incident.type}</td>
                            <td style={{ padding: '12px 16px' }}>
                                <SeverityBadge severity={incident.severity} theme={theme} />
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                                <IncidentStatusBadge status={incident.status} theme={theme} />
                            </td>
                            <td style={{ padding: '12px 16px', color: theme.muted, fontSize: '13px' }}>
                                {new Date(incident.created_at).toLocaleDateString()}
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                                <button 
                                    onClick={() => onEscalate(incident.id)}
                                    style={{ padding: '6px 12px', background: 'rgba(99, 102, 241, 0.1)', border: 'none', borderRadius: '6px', color: '#6366f1', fontSize: '12px', cursor: 'pointer' }}
                                >
                                    Escalate
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
    </div>
);

const IncidentStatusBadge = ({ status, theme }) => {
    const colors = { open: '#ef4444', investigating: '#f59e0b', resolved: '#10b981', closed: '#94a3b8' };
    return (
        <span style={{ padding: '4px 8px', background: `${colors[status] || '#94a3b8'}20`, color: colors[status] || '#94a3b8', borderRadius: '4px', fontSize: '11px', fontWeight: '500' }}>
            {status?.toUpperCase() || 'UNKNOWN'}
        </span>
    );
};

const CreateIncidentModal = ({ onClose, onCreated, theme }) => {
    const [formData, setFormData] = useState({ type: 'security', severity: 'medium', description: '' });
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/admin/enterprise/incidents', formData);
            onCreated();
            onClose();
        } catch (error) {
            console.error('Failed to create incident:', error);
        }
    };
    
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '24px', width: '400px' }}>
                <h3 style={{ color: theme.text, marginBottom: '20px' }}>Create Incident</h3>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ color: theme.muted, fontSize: '13px', display: 'block', marginBottom: '6px' }}>Type</label>
                        <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} style={{ width: '100%', padding: '10px', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.text }}>
                            <option value="security">Security</option>
                            <option value="technical">Technical</option>
                            <option value="compliance">Compliance</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ color: theme.muted, fontSize: '13px', display: 'block', marginBottom: '6px' }}>Severity</label>
                        <select value={formData.severity} onChange={(e) => setFormData({ ...formData, severity: e.target.value })} style={{ width: '100%', padding: '10px', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.text }}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ color: theme.muted, fontSize: '13px', display: 'block', marginBottom: '6px' }}>Description</label>
                        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} style={{ width: '100%', padding: '10px', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.text, resize: 'none' }} required />
                    </div>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose} style={{ padding: '10px 16px', background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.text, cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" style={{ padding: '10px 16px', background: '#6366f1', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ComplianceReportsTab = ({ theme }) => {
    const toast = useToast();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    
    useEffect(() => {
        fetchReport();
    }, []);
    
    const fetchReport = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/admin/enterprise/audit/compliance-report');
            setReport(res.data);
        } catch (error) {
            console.error('Failed to fetch compliance report:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleExport = async (format) => {
        setExporting(true);
        try {
            if (format === 'pdf') {
                toast.info('PDF export would be implemented with a library like jsPDF');
            } else {
                const csvContent = [
                    ['Framework', 'Status', 'Controls', 'Last Audit'],
                    ['NIST CSF', report?.frameworks?.NIST || 'N/A', report?.totalControls || 0, new Date().toLocaleDateString()],
                    ['ISO 27001', 'Partial', '12/40', '2024-01-15'],
                    ['SOC2', 'Pending', '0/45', 'N/A']
                ].map(row => row.join(',')).join('\n');
                
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `compliance-report-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
            }
        } finally {
            setExporting(false);
        }
    };
    
    if (loading) return <LoadingState theme={theme} />;
    
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ color: theme.text, margin: 0 }}>Compliance Reports</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => handleExport('csv')} disabled={exporting} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.text, cursor: 'pointer', fontSize: '14px' }}>
                        <Download size={16} /> Export CSV
                    </button>
                    <button onClick={() => handleExport('pdf')} disabled={exporting} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#6366f1', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '14px' }}>
                        <FileText size={16} /> Export PDF
                    </button>
                </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <ReportCard framework="NIST CSF" status="compliant" score={report?.overallScore || 85} controls="30/30" theme={theme} />
                <ReportCard framework="ISO 27001" status="partial" score={72} controls="12/40" theme={theme} />
                <ReportCard framework="SOC2" status="pending" score={45} controls="0/45" theme={theme} />
            </div>
            
            <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ color: theme.text, marginBottom: '16px' }}>Audit Log Summary</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    <AuditMetric label="Total Events" value={report?.totalEvents || 0} theme={theme} />
                    <AuditMetric label="Security Events" value={report?.securityEvents || 0} theme={theme} />
                    <AuditMetric label="Privacy Events" value={report?.privacyEvents || 0} theme={theme} />
                    <AuditMetric label="User Actions" value={report?.userActions || 0} theme={theme} />
                </div>
            </div>
        </div>
    );
};

const ReportCard = ({ framework, status, score, controls, theme }) => {
    const statusColors = { compliant: '#10b981', partial: '#f59e0b', pending: '#94a3b8' };
    const statusLabels = { compliant: 'Compliant', partial: 'Partial', pending: 'Pending Review' };
    
    return (
        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h4 style={{ color: theme.text, margin: 0 }}>{framework}</h4>
                <span style={{ padding: '4px 8px', background: `${statusColors[status]}20`, color: statusColors[status], borderRadius: '4px', fontSize: '11px', fontWeight: '500' }}>
                    {statusLabels[status]}
                </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                <span style={{ fontSize: '32px', fontWeight: '700', color: theme.text }}>{score}</span>
                <span style={{ color: theme.muted, fontSize: '14px' }}>%</span>
            </div>
            <div style={{ height: '4px', background: theme.border, borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${score}%`, height: '100%', background: statusColors[status] }} />
            </div>
            <p style={{ color: theme.muted, margin: '8px 0 0', fontSize: '12px' }}>{controls} controls implemented</p>
        </div>
    );
};

const AuditMetric = ({ label, value, theme }) => (
    <div style={{ textAlign: 'center' }}>
        <span style={{ fontSize: '28px', fontWeight: '700', color: '#6366f1' }}>{value}</span>
        <p style={{ color: theme.muted, margin: '4px 0 0', fontSize: '13px' }}>{label}</p>
    </div>
);

const LoadingState = ({ theme }) => (
    <div style={{
        minHeight: '100vh', background: theme.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
        <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto' }}></div>
            <p style={{ color: theme.muted, marginTop: '16px' }}>Loading security dashboard...</p>
        </div>
    </div>
);

const AccessDenied = ({ theme }) => (
    <div style={{
        minHeight: '100vh', background: theme.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
        <div style={{
            textAlign: 'center', maxWidth: '400px', padding: '40px',
            background: theme.card, borderRadius: '16px', border: `1px solid ${theme.border}`
        }}>
            <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.1)', margin: '0 auto 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <AlertCircle size={40} style={{ color: '#ef4444' }} />
            </div>
            <h2 style={{ color: theme.text, marginBottom: '12px' }}>Access Denied</h2>
            <p style={{ color: theme.muted, marginBottom: '24px' }}>
                You don't have permission to access the Enterprise Dashboard. 
                This feature is available for Enterprise plan users only.
            </p>
            <button
                onClick={() => window.location.href = '/dashboard'}
                style={{
                    padding: '12px 24px', background: '#6366f1', color: 'white',
                    border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px'
                }}
            >
                Return to Dashboard
            </button>
        </div>
    </div>
);

export default EnterpriseDashboard;
