import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Users, CreditCard, Scan, Activity, 
    Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight,
    UserCheck, UserX, Crown, AlertCircle, CheckCircle, XCircle, Sun, Moon,
    ChevronDown, Loader2, Users2, FileSearch2, Building2, Shield, BarChart3,
    LayoutDashboard, TrendingUp, TrendingDown, Minus, Menu, X, Bell, LogOut,
    Settings, PieChart, List, Grid3X3, ChevronRight as ChevronRightIcon, Home,
    Server, Database, Code, Globe, Lock, Key, FileText, Download, Upload,
    RefreshCw, Play, Pause, StopCircle, Cpu, HardDrive, Wifi, ShieldCheck,
    AlertTriangle, Clock, Globe2, Mail, Phone, MapPin, Calendar, DollarSign,
    BarChart, LineChart, PieChart as PieChartIcon, Activity as ActivityIcon,
    Zap, Bug, FileCode, Terminal, Network, Cloud, Container, Fingerprint,
    Eye, EyeOff, Trash, Edit2, Save, XCircle as XCircleIcon, CheckCircle2,
    PlusCircle, MinusCircle, ArrowUpCircle, ArrowDownCircle, Link2, Unlink,
    Package, Boxes, Layers, Building, Briefcase, UserCog, ShieldAlert,
    HardDriveDownload, ExternalLink, Copy, Check, RefreshCw as ReloadIcon,
    BuildingIcon
} from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart as RechartsBar, Bar, LineChart as RechartsLine, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { formatDistanceToNow, format } from 'date-fns';
import Drawer from '../../components/Drawer';

const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'users', label: 'Users', icon: Users, badge: stats?.totalUsers },
        { id: 'admins', label: 'Admins', icon: UserCog },
        { id: 'tenants', label: 'Tenants', icon: BuildingIcon },
        { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, badge: stats?.activeSubscriptions },
        { id: 'tiers', label: 'Pricing Tiers', icon: Crown },
        { id: 'scans', label: 'Scans', icon: Scan, badge: stats?.totalScans },
        { id: 'analytics', label: 'Analytics', icon: BarChart },
        { id: 'system', label: 'System', icon: Server },
        { id: 'api', label: 'API Manager', icon: Code },
        { id: 'security', label: 'Security', icon: ShieldAlert },
        { id: 'audit', label: 'Audit Logs', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const handleLogout = () => {
        localStorage.removeItem('superAdminToken');
        localStorage.removeItem('isSuperAdmin');
        localStorage.removeItem('superAdminEmail');
        if (logout) {
            logout();
        }
        navigate('/super-admin');
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/super-admin/dashboard', {
                headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
            });
            setStats(res.data);
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
        } finally {
            setStatsLoading(false);
        }
    };

    if (statsLoading) {
        return <LoadingScreen isDark={isDark} />;
    }

    return (
        <div className={`super-admin-layout ${isDark ? 'super-admin-dark' : 'super-admin-light'}`}>
            <aside className={`super-admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <Shield className="logo-icon" />
                        {!sidebarCollapsed && <span className="logo-text">VulnScan Pro</span>}
                    </div>
                    <span className="super-admin-badge">
                        <Crown size={12} />
                        {!sidebarCollapsed && 'Super Admin'}
                    </span>
                    <button 
                        className="sidebar-toggle"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        aria-label="Toggle sidebar"
                    >
                        <Menu size={20} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setMobileSidebarOpen(false);
                            }}
                            title={sidebarCollapsed ? tab.label : undefined}
                        >
                            <tab.icon size={20} />
                            {!sidebarCollapsed && (
                                <>
                                    <span className="nav-label">{tab.label}</span>
                                    {tab.badge !== undefined && (
                                        <span className="nav-badge">{tab.badge}</span>
                                    )}
                                </>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button 
                        className="nav-item theme-toggle"
                        onClick={toggleTheme}
                        title={isDark ? 'Light mode' : 'Dark mode'}
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        {!sidebarCollapsed && <span className="nav-label">{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
                    </button>
                    <button className="nav-item" onClick={handleLogout} title="Logout">
                        <LogOut size={20} />
                        {!sidebarCollapsed && <span className="nav-label">Logout</span>}
                    </button>
                </div>
            </aside>

            <div className="super-admin-main">
                <header className="super-admin-header">
                    <div className="header-left">
                        <button 
                            className="mobile-menu-btn"
                            onClick={() => setMobileSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <div className="breadcrumbs">
                            <span className="breadcrumb-item">
                                <Home size={14} />
                            </span>
                            <ChevronRightIcon size={14} className="breadcrumb-separator" />
                            <span className="breadcrumb-item active">
                                {tabs.find(t => t.id === activeTab)?.label || 'Super Admin'}
                            </span>
                        </div>
                    </div>
                    <div className="header-right">
                        <button className="header-btn" aria-label="Refresh" onClick={fetchStats}>
                            <RefreshCw size={20} />
                        </button>
                        <button className="header-btn" aria-label="Notifications">
                            <Bell size={20} />
                            <span className="notification-dot"></span>
                        </button>
                        <div className="user-info">
                            <div className="user-avatar super-admin-avatar">
                                <Crown size={16} />
                            </div>
                            <div className="user-details">
                                <span className="user-name">Super Admin</span>
                                <span className="user-role">System Administrator</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="super-admin-content">
                    {activeTab === 'dashboard' && <DashboardOverview stats={stats} isDark={isDark} toast={toast} />}
                    {activeTab === 'users' && <UsersManagement onUpdate={fetchStats} isDark={isDark} toast={toast} />}
                    {activeTab === 'admins' && <AdminsManagement isDark={isDark} toast={toast} />}
                    {activeTab === 'tenants' && <TenantsManagement isDark={isDark} toast={toast} />}
                    {activeTab === 'subscriptions' && <SubscriptionsManagement isDark={isDark} toast={toast} />}
                    {activeTab === 'tiers' && <PricingTiersManagement isDark={isDark} toast={toast} />}
                    {activeTab === 'scans' && <ScansManagement isDark={isDark} toast={toast} />}
                    {activeTab === 'analytics' && <AnalyticsDashboard stats={stats} isDark={isDark} />}
                    {activeTab === 'system' && <SystemMonitoring isDark={isDark} toast={toast} />}
                    {activeTab === 'api' && <APIManager isDark={isDark} toast={toast} />}
                    {activeTab === 'security' && <SecurityCenter isDark={isDark} toast={toast} />}
                    {activeTab === 'audit' && <AuditLogs isDark={isDark} toast={toast} />}
                    {activeTab === 'settings' && <SystemSettings isDark={isDark} toast={toast} />}
                </main>
            </div>

            {mobileSidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setMobileSidebarOpen(false)} />
            )}
        </div>
    );
};

const LoadingScreen = ({ isDark }) => (
    <div className={`loading-screen ${isDark ? 'dark' : 'light'}`}>
        <div className="loading-content">
            <div className="loading-spinner">
                <Loader2 size={48} />
            </div>
            <p>Loading Super Admin Portal...</p>
        </div>
    </div>
);

const DashboardOverview = ({ stats, isDark, toast }) => {
    const chartColors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    
    const subscriptionData = Array.isArray(stats?.subscriptionsByTier) 
        ? stats.subscriptionsByTier.map((tier, i) => ({
            name: tier.name,
            value: tier.count,
            color: chartColors[i % chartColors.length]
        }))
        : [];

    const revenueData = Array.isArray(stats?.monthlyRevenueData) 
        ? stats.monthlyRevenueData.map(item => ({
            month: item.month,
            revenue: item.revenue,
            users: item.newUsers
        }))
        : [
            { month: 'Jan', revenue: 12000, users: 45 },
            { month: 'Feb', revenue: 15000, users: 52 },
            { month: 'Mar', revenue: 18000, users: 48 },
            { month: 'Apr', revenue: 21000, users: 61 },
            { month: 'May', revenue: 25000, users: 55 },
            { month: 'Jun', revenue: 30000, users: 70 },
        ];

    const scanStats = Array.isArray(stats?.scanStats) ? stats.scanStats : [];
    const recentUsers = Array.isArray(stats?.recentUsers) ? stats.recentUsers : [];
    const recentScans = Array.isArray(stats?.recentScans) ? stats.recentScans : [];

    const statCards = [
        { 
            icon: <Users2 size={24} />, 
            value: stats?.totalUsers || 0, 
            label: 'Total Users', 
            color: '#3b82f6',
            trend: '+12%',
            trendUp: true
        },
        { 
            icon: <UserCheck size={24} />, 
            value: stats?.activeUsers || 0, 
            label: 'Active Users', 
            color: '#10b981',
            trend: '+8%',
            trendUp: true
        },
        { 
            icon: <Scan size={24} />, 
            value: stats?.totalScans || 0, 
            label: 'Total Scans', 
            color: '#8b5cf6',
            trend: '+24%',
            trendUp: true
        },
        { 
            icon: <DollarSign size={24} />, 
            value: `$${(stats?.monthlyRevenue || 0).toLocaleString()}`, 
            label: 'Monthly Revenue', 
            color: '#f59e0b',
            trend: '+15%',
            trendUp: true
        },
        { 
            icon: <AlertCircle size={24} />, 
            value: stats?.totalVulnerabilities || 0, 
            label: 'Vulnerabilities', 
            color: '#ef4444',
            trend: '-5%',
            trendUp: false
        },
        { 
            icon: <ShieldCheck size={24} />, 
            value: stats?.secureEndpoints || 0, 
            label: 'Secure Endpoints', 
            color: '#10b981',
            trend: '+20%',
            trendUp: true
        },
    ];

    return (
        <div className="dashboard-overview">
            <div className="section-header">
                <h2>Welcome back, Super Admin</h2>
                <p>Complete system overview and control center</p>
            </div>

            <div className="stats-grid">
                {statCards.map((stat, i) => (
                    <div key={i} className="stat-card" style={{ '--accent-color': stat.color }}>
                        <div className="stat-header">
                            <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                                {stat.icon}
                            </div>
                            <div className={`stat-trend ${stat.trendUp ? 'up' : 'down'}`}>
                                {stat.trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                {stat.trend}
                            </div>
                        </div>
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card chart-card">
                    <div className="card-header">
                        <h3>
                            <PieChartIcon size={18} />
                            Subscription Distribution
                        </h3>
                    </div>
                    <div className="chart-content">
                        {subscriptionData.length > 0 ? (
                            <>
                                <div className="pie-chart-container">
                                    <ResponsiveContainer width="100%" height={200}>
                                        <RechartsPie>
                                            <Pie
                                                data={subscriptionData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {subscriptionData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                        </RechartsPie>
                                    </ResponsiveContainer>
                                </div>
                                <div className="chart-legend">
                                    {subscriptionData.map((item, i) => (
                                        <div key={i} className="legend-item">
                                            <span className="legend-color" style={{ background: item.color }}></span>
                                            <span className="legend-label">{item.name}</span>
                                            <span className="legend-value">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <EmptyState message="No subscription data available" isDark={isDark} />
                        )}
                    </div>
                </div>

                <div className="dashboard-card chart-card">
                    <div className="card-header">
                        <h3>
                            <LineChart size={18} />
                            Revenue & Growth
                        </h3>
                    </div>
                    <div className="chart-content">
                        {revenueData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <RechartsLine data={revenueData}>
                                    <XAxis dataKey="month" stroke={isDark ? '#888' : '#666'} />
                                    <YAxis stroke={isDark ? '#888' : '#666'} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
                                    <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                                </RechartsLine>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyState message="No revenue data available" isDark={isDark} />
                        )}
                    </div>
                </div>

                <div className="dashboard-card activity-card">
                    <div className="card-header">
                        <h3>
                            <ActivityIcon size={18} />
                            Recent Users
                        </h3>
                        <span className="view-all">Last 7 days</span>
                    </div>
                    <div className="activity-list">
                        {recentUsers.length > 0 ? (
                            recentUsers.map((user, i) => (
                                <div key={user.id || i} className="activity-item">
                                    <div className="activity-avatar">
                                        {user.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="activity-info">
                                        <span className="activity-name">{user.username}</span>
                                        <span className="activity-meta">{user.email}</span>
                                    </div>
                                    <span className="activity-time">
                                        {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <EmptyState message="No recent users" isDark={isDark} />
                        )}
                    </div>
                </div>

                <div className="dashboard-card scans-card">
                    <div className="card-header">
                        <h3>
                            <Scan size={18} />
                            Recent Scans
                        </h3>
                        <span className="view-all">View all scans</span>
                    </div>
                    <div className="table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Target URL</th>
                                    <th>Status</th>
                                    <th>Vulnerabilities</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentScans.length > 0 ? (
                                    recentScans.map(scan => (
                                        <tr key={scan.scan_id}>
                                            <td>
                                                <div className="table-user">
                                                    <div className="table-avatar">
                                                        {scan.username?.charAt(0).toUpperCase() || 'A'}
                                                    </div>
                                                    {scan.username || 'Anonymous'}
                                                </div>
                                            </td>
                                            <td className="url-cell">{scan.target_url}</td>
                                            <td><StatusBadge status={scan.status} /></td>
                                            <td>
                                                <span className="vuln-count">
                                                    {scan.total_vulnerabilities || 0}
                                                </span>
                                            </td>
                                            <td className="date-cell">
                                                {format(new Date(scan.created_at), 'MMM d, yyyy')}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5}>
                                            <EmptyState message="No recent scans" isDark={isDark} />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const UsersManagement = ({ onUpdate, isDark, toast }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [bulkAction, setBulkAction] = useState('');
    const [tiers, setTiers] = useState([]);
    const [formData, setFormData] = useState({
        username: '', email: '', password: '', role: 'member', tier_id: '', is_active: true
    });
    const [saving, setSaving] = useState(false);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get(`/super-admin/users?page=${page}&limit=20&search=${search}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
            });
            setUsers(res.data.users || []);
            setTotalPages(res.data.totalPages || 1);
        } catch (error) {
            setUsers([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    const fetchTiers = async () => {
        try {
            const res = await api.get('/super-admin/tiers', {
                headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
            });
            setTiers(res.data.tiers || []);
        } catch (error) {
            setTiers([]);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchTiers();
    }, [fetchUsers]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(users.map(u => u.id));
            setShowBulkActions(true);
        } else {
            setSelectedUsers([]);
            setShowBulkActions(false);
        }
    };

    const handleSelectUser = (userId) => {
        const newSelected = selectedUsers.includes(userId)
            ? selectedUsers.filter(id => id !== userId)
            : [...selectedUsers, userId];
        setSelectedUsers(newSelected);
        setShowBulkActions(newSelected.length > 0);
    };

    const handleBulkAction = async () => {
        if (!bulkAction || selectedUsers.length === 0) return;
        
        if (bulkAction === 'delete') {
            if (!window.confirm(`Delete ${selectedUsers.length} users? This cannot be undone.`)) return;
        }
        
        try {
            await api.post(`/super-admin/users/bulk-action`, {
                action: bulkAction,
                userIds: selectedUsers
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
            });
            
            if (bulkAction === 'activate') toast.success(`${selectedUsers.length} users activated`);
            else if (bulkAction === 'deactivate') toast.success(`${selectedUsers.length} users deactivated`);
            else if (bulkAction === 'delete') toast.success(`${selectedUsers.length} users deleted`);
            
            setSelectedUsers([]);
            setShowBulkActions(false);
            setBulkAction('');
            fetchUsers();
            if (onUpdate) onUpdate();
        } catch (error) {
            toast.error('Bulk action failed');
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/super-admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
            });
            toast.success('User deleted successfully');
            fetchUsers();
            if (onUpdate) onUpdate();
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    const handleToggleActive = async (user) => {
        try {
            await api.put(`/super-admin/users/${user.id}`, { is_active: !user.is_active }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
            });
            toast.success(`User ${user.is_active ? 'deactivated' : 'activated'}`);
            fetchUsers();
            if (onUpdate) onUpdate();
        } catch (error) {
            toast.error('Failed to update user');
        }
    };

    const openModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                username: user.username || '',
                email: user.email || '',
                password: '',
                role: user.role || 'member',
                tier_id: user.tier_id || '',
                is_active: user.is_active ?? true
            });
        } else {
            setEditingUser(null);
            setFormData({ username: '', email: '', password: '', role: 'member', tier_id: '', is_active: true });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editingUser && !formData.password) {
            toast.error('Password is required for new users');
            return;
        }
        try {
            setSaving(true);
            if (editingUser) {
                await api.put(`/super-admin/users/${editingUser.id}`, formData, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
                });
                toast.success('User updated successfully');
            } else {
                await api.post('/super-admin/users', formData, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
                });
                toast.success('User created successfully');
            }
            setShowModal(false);
            fetchUsers();
            if (onUpdate) onUpdate();
        } catch (error) {
            toast.error(editingUser ? 'Failed to update user' : 'Failed to create user');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="management-section">
            <div className="section-header">
                <div>
                    <h2>User Management</h2>
                    <p>Manage all users across the platform</p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <Plus size={18} /> Add User
                </button>
            </div>

            <div className="filters-bar">
                <div className="search-wrapper">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {showBulkActions && (
                <div className="bulk-actions-bar">
                    <span className="bulk-selected">{selectedUsers.length} selected</span>
                    <select 
                        className="bulk-action-select"
                        value={bulkAction}
                        onChange={(e) => setBulkAction(e.target.value)}
                    >
                        <option value="">Select action...</option>
                        <option value="activate">Activate Selected</option>
                        <option value="deactivate">Deactivate Selected</option>
                        <option value="delete">Delete Selected</option>
                    </select>
                    <button 
                        className="btn btn-primary btn-sm"
                        onClick={handleBulkAction}
                        disabled={!bulkAction}
                    >
                        Apply
                    </button>
                    <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => { setSelectedUsers([]); setShowBulkActions(false); }}
                    >
                        Cancel
                    </button>
                </div>
            )}

            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th style={{ width: '40px' }}>
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.length === users.length && users.length > 0}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th>User</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Scans</th>
                            <th>Subscription</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={8}>Loading...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan={8}><EmptyState message="No users found" isDark={isDark} /></td></tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.id} className={selectedUsers.includes(user.id) ? 'selected' : ''}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => handleSelectUser(user.id)}
                                        />
                                    </td>
                                    <td>
                                        <div className="table-user">
                                            <div className="table-avatar">{user.username?.charAt(0).toUpperCase()}</div>
                                            <div className="user-info">
                                                <span className="user-name">{user.username}</span>
                                                <span className="user-email">{user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                                    <td>
                                        <span className={`status-indicator ${user.is_active ? 'active' : 'inactive'}`}>
                                            <span className="status-dot"></span>
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>{user.scans_count || 0}</td>
                                    <td>{user.subscription?.tier_name || 'Free'}</td>
                                    <td>{format(new Date(user.created_at), 'MMM d, yyyy')}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn edit" onClick={() => openModal(user)}>
                                                <Edit size={16} />
                                            </button>
                                            <button className="action-btn toggle" onClick={() => handleToggleActive(user)}>
                                                {user.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
                                            </button>
                                            <button className="action-btn delete" onClick={() => handleDelete(user.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {users.length > 0 && (
                <div className="pagination">
                    <button className="btn btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                        <ChevronLeft size={16} /> Previous
                    </button>
                    <span>Page {page} of {totalPages}</span>
                    <button className="btn btn-secondary btn-sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                        Next <ChevronRight size={16} />
                    </button>
                </div>
            )}

            <Drawer
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingUser ? 'Edit User' : 'Add New User'}
                icon={Users}
                footer={
                    <>
                        <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
                            {saving ? 'Saving...' : (editingUser ? 'Update User' : 'Create User')}
                        </button>
                    </>
                }
            >
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <div className="form-field">
                        <label>Username</label>
                        <input type="text" className="form-input" value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
                    </div>
                    <div className="form-field">
                        <label>Email</label>
                        <input type="email" className="form-input" value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                    <div className="form-field">
                        <label>{editingUser ? 'New Password (leave blank to keep current)' : 'Password'}</label>
                        <input type="password" className="form-input" value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required={!editingUser} />
                    </div>
                    <div className="form-field">
                        <label>Role</label>
                        <select className="form-input" value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                            <option value="member">Member</option>
                            <option value="analyst">Analyst</option>
                            <option value="supervisor">Supervisor</option>
                            <option value="billing">Billing</option>
                            <option value="client">Client</option>
                        </select>
                    </div>
                    <div className="form-field">
                        <label>Subscription Tier</label>
                        <select className="form-input" value={formData.tier_id}
                            onChange={(e) => setFormData({ ...formData, tier_id: e.target.value })}>
                            <option value="">Free</option>
                            {tiers.map(tier => (
                                <option key={tier.tier_id} value={tier.tier_id}>{tier.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-field checkbox">
                        <input type="checkbox" id="userActive" checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} />
                        <label htmlFor="userActive">Active</label>
                    </div>
                </form>
            </Drawer>
        </div>
    );
};

const TenantsManagement = ({ isDark, toast }) => {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTenant, setEditingTenant] = useState(null);
    const [search, setSearch] = useState('');
    const [tiers, setTiers] = useState([]);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '', domain: '', plan: 'starter', status: 'active', contact_email: '', max_users: 10
    });

    useEffect(() => {
        fetchTenants();
        fetchTiers();
    }, []);

    const fetchTenants = async () => {
        try {
            setLoading(true);
            const res = await api.get('/super-admin/tenants', {
                headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
            });
            setTenants(res.data.tenants || []);
        } catch (error) {
            setTenants([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchTiers = async () => {
        try {
            const res = await api.get('/super-admin/tiers', {
                headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
            });
            setTiers(res.data.tiers || []);
        } catch (error) {
            setTiers([]);
        }
    };

    const handleDelete = async (tenantId) => {
        if (!window.confirm('Are you sure you want to delete this tenant? This cannot be undone.')) return;
        try {
            await api.delete(`/super-admin/tenants/${tenantId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
            });
            toast.success('Tenant deleted successfully');
            setTenants(tenants.filter(t => t.id !== tenantId));
        } catch (error) {
            toast.error('Failed to delete tenant');
        }
    };

    const handleToggleStatus = async (tenant) => {
        const newStatus = tenant.status === 'active' ? 'inactive' : 'active';
        try {
            await api.put(`/super-admin/tenants/${tenant.id}`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
            });
            toast.success(`Tenant ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
            setTenants(tenants.map(t => t.id === tenant.id ? { ...t, status: newStatus } : t));
        } catch (error) {
            toast.error('Failed to update tenant');
        }
    };

    const openModal = (tenant = null) => {
        if (tenant) {
            setEditingTenant(tenant);
            setFormData({
                name: tenant.name || '',
                domain: tenant.domain || '',
                plan: tenant.plan || 'starter',
                status: tenant.status || 'active',
                contact_email: tenant.contact_email || '',
                max_users: tenant.max_users || 10
            });
        } else {
            setEditingTenant(null);
            setFormData({ name: '', domain: '', plan: 'starter', status: 'active', contact_email: '', max_users: 10 });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            if (editingTenant) {
                await api.put(`/super-admin/tenants/${editingTenant.id}`, formData, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
                });
                toast.success('Tenant updated successfully');
            } else {
                await api.post('/super-admin/tenants', formData, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
                });
                toast.success('Tenant created successfully');
            }
            setShowModal(false);
            fetchTenants();
        } catch (error) {
            toast.error(editingTenant ? 'Failed to update tenant' : 'Failed to create tenant');
        } finally {
            setSaving(false);
        }
    };

    const filteredTenants = tenants.filter(t => 
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        (t.domain && t.domain.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="management-section">
            <div className="section-header">
                <div>
                    <h2>Tenant Management</h2>
                    <p>Manage all organizations and their subscriptions</p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <Plus size={18} /> Create Tenant
                </button>
            </div>

            <div className="filters-bar">
                <div className="search-wrapper">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search tenants..."
                        className="search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="results-count">
                    {filteredTenants.length} tenants
                </div>
            </div>

            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Tenant</th>
                            <th>Plan</th>
                            <th>Users</th>
                            <th>Scans</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7}>Loading...</td></tr>
                        ) : filteredTenants.length === 0 ? (
                            <tr><td colSpan={7}><EmptyState message="No tenants found" isDark={isDark} /></td></tr>
                        ) : (
                            filteredTenants.map(tenant => (
                                <tr key={tenant.id}>
                                    <td>
                                        <div className="table-user">
                                            <div className="table-avatar" style={{ background: '#8b5cf6' }}>
                                                <BuildingIcon size={16} />
                                            </div>
                                            <div className="user-info">
                                                <span className="user-name">{tenant.name}</span>
                                                <span className="user-email">{tenant.domain}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className={`tier-badge tier-${(tenant.plan || 'free').toLowerCase()}`}>{tenant.plan || 'Free'}</span></td>
                                    <td>{tenant.users || 0}</td>
                                    <td>{(tenant.scans || 0).toLocaleString()}</td>
                                    <td>
                                        <span className={`status-indicator ${tenant.status}`}>
                                            <span className="status-dot"></span>
                                            {tenant.status === 'active' ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>{tenant.created ? format(new Date(tenant.created), 'MMM d, yyyy') : 'N/A'}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn edit" title="Edit" onClick={() => openModal(tenant)}>
                                                <Edit size={16} />
                                            </button>
                                            <button className="action-btn toggle" title={tenant.status === 'active' ? 'Deactivate' : 'Activate'} onClick={() => handleToggleStatus(tenant)}>
                                                {tenant.status === 'active' ? <XCircle size={16} /> : <CheckCircle size={16} />}
                                            </button>
                                            <button className="action-btn delete" title="Delete" onClick={() => handleDelete(tenant.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingTenant ? 'Edit Tenant' : 'Create New Tenant'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-field">
                                    <label>Organization Name</label>
                                    <input type="text" className="form-input" value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                </div>
                                <div className="form-field">
                                    <label>Domain</label>
                                    <input type="text" className="form-input" value={formData.domain}
                                        onChange={(e) => setFormData({ ...formData, domain: e.target.value })} placeholder="example.com" />
                                </div>
                                <div className="form-field">
                                    <label>Contact Email</label>
                                    <input type="email" className="form-input" value={formData.contact_email}
                                        onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })} />
                                </div>
                                <div className="form-field">
                                    <label>Subscription Plan</label>
                                    <select className="form-input" value={formData.plan}
                                        onChange={(e) => setFormData({ ...formData, plan: e.target.value })}>
                                        <option value="">Free</option>
                                        {tiers.map(tier => (
                                            <option key={tier.tier_id} value={tier.tier_id}>{tier.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-field">
                                    <label>Max Users</label>
                                    <input type="number" className="form-input" value={formData.max_users}
                                        onChange={(e) => setFormData({ ...formData, max_users: parseInt(e.target.value) })} min="1" />
                                </div>
                                <div className="form-field checkbox">
                                    <input type="checkbox" id="tenantActive" checked={formData.status === 'active'}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'active' : 'inactive' })} />
                                    <label htmlFor="tenantActive">Active</label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : (editingTenant ? 'Update Tenant' : 'Create Tenant')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const AdminsManagement = ({ isDark, toast }) => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        username: '', email: '', password: '', role: 'admin', permissions: []
    });

    const allPermissions = [
        'users.view', 'users.create', 'users.edit', 'users.delete',
        'tenants.view', 'tenants.create', 'tenants.edit', 'tenants.delete',
        'subscriptions.view', 'subscriptions.edit',
        'scans.view', 'scans.delete',
        'analytics.view',
        'audit.view',
        'settings.view', 'settings.edit'
    ];

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const res = await api.get('/super-admin/admins', {
                headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
            });
            setAdmins(res.data.admins || []);
        } catch (error) {
            setAdmins([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (adminId) => {
        if (!window.confirm('Are you sure you want to remove this admin?')) return;
        try {
            await api.delete(`/super-admin/admins/${adminId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
            });
            toast.success('Admin removed successfully');
            setAdmins(admins.filter(a => a.id !== adminId));
        } catch (error) {
            toast.error('Failed to remove admin');
        }
    };

    const openModal = (admin = null) => {
        if (admin) {
            setEditingAdmin(admin);
            setFormData({
                username: admin.username || '',
                email: admin.email || '',
                password: '',
                role: admin.role || 'admin',
                permissions: admin.permissions || []
            });
        } else {
            setEditingAdmin(null);
            setFormData({ username: '', email: '', password: '', role: 'admin', permissions: [] });
        }
        setShowModal(true);
    };

    const togglePermission = (perm) => {
        setFormData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(perm)
                ? prev.permissions.filter(p => p !== perm)
                : [...prev.permissions, perm]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editingAdmin && !formData.password) {
            toast.error('Password is required for new admins');
            return;
        }
        try {
            setSaving(true);
            if (editingAdmin) {
                await api.put(`/super-admin/admins/${editingAdmin.id}`, formData, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
                });
                toast.success('Admin updated successfully');
            } else {
                await api.post('/super-admin/admins', formData, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
                });
                toast.success('Admin created successfully');
            }
            setShowModal(false);
            fetchAdmins();
        } catch (error) {
            toast.error(editingAdmin ? 'Failed to update admin' : 'Failed to create admin');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="management-section">
            <div className="section-header">
                <div>
                    <h2>Admin Management</h2>
                    <p>Manage platform administrators</p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <Plus size={18} /> Add Admin
                </button>
            </div>

            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Admin</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Last Active</th>
                            <th>Permissions</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6}>Loading...</td></tr>
                        ) : admins.length === 0 ? (
                            <tr><td colSpan={6}><EmptyState message="No admins found" isDark={isDark} icon={UserCog} /></td></tr>
                        ) : (
                            admins.map(admin => (
                                <tr key={admin.id}>
                                    <td>
                                        <div className="table-user">
                                            <div className="table-avatar admin-avatar"><UserCog size={16} /></div>
                                            <div className="user-info">
                                                <span className="user-name">{admin.username}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{admin.email}</td>
                                    <td><span className={`role-badge ${admin.role}`}>{admin.role}</span></td>
                                    <td>{admin.last_active ? formatDistanceToNow(new Date(admin.last_active), { addSuffix: true }) : 'Never'}</td>
                                    <td><span className="permission-count">{admin.permissions?.length || 0} permissions</span></td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn edit" onClick={() => openModal(admin)}><Edit size={16} /></button>
                                            <button className="action-btn delete" onClick={() => handleDelete(admin.id)}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingAdmin ? 'Edit Admin' : 'Add New Admin'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-field">
                                    <label>Username</label>
                                    <input type="text" className="form-input" value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
                                </div>
                                <div className="form-field">
                                    <label>Email</label>
                                    <input type="email" className="form-input" value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                                </div>
                                <div className="form-field">
                                    <label>{editingAdmin ? 'New Password (leave blank to keep current)' : 'Password'}</label>
                                    <input type="password" className="form-input" value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required={!editingAdmin} />
                                </div>
                                <div className="form-field">
                                    <label>Role</label>
                                    <select className="form-input" value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                                        <option value="admin">Admin</option>
                                        <option value="super_admin">Super Admin</option>
                                    </select>
                                </div>
                                <div className="form-field">
                                    <label>Permissions</label>
                                    <div className="permissions-grid">
                                        {allPermissions.map(perm => (
                                            <div key={perm} className="permission-item">
                                                <input type="checkbox" id={`perm-${perm}`} checked={formData.permissions.includes(perm)}
                                                    onChange={() => togglePermission(perm)} />
                                                <label htmlFor={`perm-${perm}`}>{perm}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : (editingAdmin ? 'Update Admin' : 'Create Admin')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const SubscriptionsManagement = ({ isDark, toast }) => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                setLoading(true);
                const res = await api.get('/super-admin/subscriptions', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
                });
                setSubscriptions(res.data.subscriptions || []);
            } catch (error) {
                console.error('Failed to fetch subscriptions:', error);
                setSubscriptions([]);
            } finally {
                setLoading(false);
            }
        };
        fetchSubscriptions();
    }, []);

    const handleUpdateStatus = async (subId, status) => {
        try {
            await api.put(`/super-admin/subscriptions/${subId}`, { status }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
            });
            toast.success('Subscription updated');
            setSubscriptions(subscriptions.map(s => s.id === subId ? { ...s, status } : s));
        } catch (error) {
            toast.error('Failed to update subscription');
        }
    };

    return (
        <div className="management-section">
            <div className="section-header">
                <div>
                    <h2>Subscriptions</h2>
                    <p>Manage all platform subscriptions</p>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Tier</th>
                            <th>Billing</th>
                            <th>Status</th>
                            <th>Period</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6}>Loading...</td></tr>
                        ) : subscriptions.length === 0 ? (
                            <tr><td colSpan={6}><EmptyState message="No subscriptions" isDark={isDark} /></td></tr>
                        ) : (
                            subscriptions.map(sub => (
                                <tr key={sub.id}>
                                    <td>
                                        <div className="table-user">
                                            <div className="table-avatar">{sub.username?.charAt(0).toUpperCase()}</div>
                                            <span>{sub.username}</span>
                                        </div>
                                    </td>
                                    <td><span className={`tier-badge tier-${sub.tier_id}`}>{sub.tier_name}</span></td>
                                    <td>{sub.billing_cycle}</td>
                                    <td><span className={`status-badge status-${sub.status}`}>{sub.status}</span></td>
                                    <td>{format(new Date(sub.start_date), 'MMM d')} - {sub.end_date ? format(new Date(sub.end_date), 'MMM d, yyyy') : 'Ongoing'}</td>
                                    <td>
                                        <select className="status-select" value={sub.status} onChange={(e) => handleUpdateStatus(sub.id, e.target.value)}>
                                            <option value="active">Active</option>
                                            <option value="cancelled">Cancelled</option>
                                            <option value="expired">Expired</option>
                                            <option value="trial">Trial</option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const PricingTiersManagement = ({ isDark, toast }) => {
    const [tiers, setTiers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTier, setEditingTier] = useState(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        tier_id: '', name: '', price_monthly: '', price_yearly: '', scan_limit_monthly: '', concurrent_scans: '', is_active: true
    });

    useEffect(() => {
        const fetchTiers = async () => {
            try {
                setLoading(true);
                const res = await api.get('/super-admin/tiers', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
                });
                setTiers(res.data.tiers || []);
            } catch (error) {
                console.error('Failed to fetch tiers:', error);
                setTiers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchTiers();
    }, []);

    const tierColors = {
        starter: '#3b82f6',
        professional: '#8b5cf6',
        enterprise: '#f59e0b',
        default: '#6366f1'
    };

    const handleDelete = async (tierId) => {
        if (!window.confirm('Are you sure you want to delete this tier?')) return;
        try {
            await api.delete(`/super-admin/tiers/${tierId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
            });
            toast.success('Tier deleted successfully');
            setTiers(tiers.filter(t => t.tier_id !== tierId));
        } catch (error) {
            toast.error('Failed to delete tier');
        }
    };

    const handleToggleActive = async (tier) => {
        try {
            await api.put(`/super-admin/tiers/${tier.tier_id}`, { is_active: !tier.is_active }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
            });
            toast.success(`Tier ${tier.is_active ? 'deactivated' : 'activated'}`);
            setTiers(tiers.map(t => t.tier_id === tier.tier_id ? { ...t, is_active: !t.is_active } : t));
        } catch (error) {
            toast.error('Failed to update tier');
        }
    };

    const openModal = (tier = null) => {
        if (tier) {
            setEditingTier(tier);
            setFormData({
                tier_id: tier.tier_id || '',
                name: tier.name || '',
                price_monthly: tier.price_monthly || '',
                price_yearly: tier.price_yearly || '',
                scan_limit_monthly: tier.scan_limit_monthly || '',
                concurrent_scans: tier.concurrent_scans || '',
                is_active: tier.is_active ?? true
            });
        } else {
            setEditingTier(null);
            setFormData({ tier_id: '', name: '', price_monthly: '', price_yearly: '', scan_limit_monthly: '', concurrent_scans: '', is_active: true });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const data = {
                ...formData,
                price_monthly: parseFloat(formData.price_monthly),
                price_yearly: parseFloat(formData.price_yearly),
                scan_limit_monthly: parseInt(formData.scan_limit_monthly),
                concurrent_scans: parseInt(formData.concurrent_scans)
            };
            if (editingTier) {
                await api.put(`/super-admin/tiers/${editingTier.tier_id}`, data, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
                });
                toast.success('Tier updated successfully');
            } else {
                await api.post('/super-admin/tiers', data, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
                });
                toast.success('Tier created successfully');
            }
            setShowModal(false);
            const res = await api.get('/super-admin/tiers', {
                headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
            });
            setTiers(res.data.tiers || []);
        } catch (error) {
            toast.error(editingTier ? 'Failed to update tier' : 'Failed to create tier');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="management-section">
            <div className="section-header">
                <div>
                    <h2>Pricing Tiers</h2>
                    <p>Configure subscription plans and pricing</p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <Plus size={18} /> Add Tier
                </button>
            </div>

            {loading ? (
                <div className="tiers-grid">
                    {[1, 2, 3].map(i => <div key={i} className="tier-card skeleton-card"><div className="skeleton-title"></div><div className="skeleton-price"></div></div>)}
                </div>
            ) : (
                <div className="tiers-grid">
                    {tiers.map(tier => (
                        <div key={tier.tier_id} className="tier-card" style={{ '--tier-color': tierColors[tier.tier_id] || tierColors.default }}>
                            <div className="tier-header">
                                <h3 className="tier-name">{tier.name}</h3>
                                <span className={`tier-status ${tier.is_active ? 'active' : 'inactive'}`}>
                                    {tier.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="tier-price">
                                <span className="price-amount">${parseFloat(tier.price_monthly || 0).toFixed(2)}</span>
                                <span className="price-period">/month</span>
                            </div>
                            <div className="tier-yearly">${parseFloat(tier.price_yearly || 0).toFixed(2)}/year</div>
                            <div className="tier-divider"></div>
                            <div className="tier-stats">
                                <div className="tier-stat">
                                    <span className="stat-value">{tier.subscriberCount || 0}</span>
                                    <span className="stat-label">Subscribers</span>
                                </div>
                                <div className="tier-stat">
                                    <span className="stat-value">{tier.scan_limit_monthly === -1 ? '∞' : (tier.scan_limit_monthly || 0)}</span>
                                    <span className="stat-label">Scans/mo</span>
                                </div>
                                <div className="tier-stat">
                                    <span className="stat-value">{tier.concurrent_scans || 0}</span>
                                    <span className="stat-label">Concurrent</span>
                                </div>
                            </div>
                            <div className="tier-actions">
                                <button className="btn btn-secondary btn-sm" onClick={() => openModal(tier)}>
                                    <Edit size={14} /> Edit
                                </button>
                                <button className="btn btn-sm" onClick={() => handleToggleActive(tier)}>
                                    {tier.is_active ? <XCircle size={14} /> : <CheckCircle size={14} />}
                                    {tier.is_active ? 'Disable' : 'Enable'}
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(tier.tier_id)}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingTier ? 'Edit Pricing Tier' : 'Create New Pricing Tier'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-field">
                                    <label>Tier ID (slug)</label>
                                    <input type="text" className="form-input" value={formData.tier_id}
                                        onChange={(e) => setFormData({ ...formData, tier_id: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                                        required disabled={!!editingTier} />
                                </div>
                                <div className="form-field">
                                    <label>Tier Name</label>
                                    <input type="text" className="form-input" value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                </div>
                                <div className="form-row">
                                    <div className="form-field">
                                        <label>Monthly Price ($)</label>
                                        <input type="number" className="form-input" value={formData.price_monthly}
                                            onChange={(e) => setFormData({ ...formData, price_monthly: e.target.value })} step="0.01" required />
                                    </div>
                                    <div className="form-field">
                                        <label>Yearly Price ($)</label>
                                        <input type="number" className="form-input" value={formData.price_yearly}
                                            onChange={(e) => setFormData({ ...formData, price_yearly: e.target.value })} step="0.01" required />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-field">
                                        <label>Scans per Month (-1 = unlimited)</label>
                                        <input type="number" className="form-input" value={formData.scan_limit_monthly}
                                            onChange={(e) => setFormData({ ...formData, scan_limit_monthly: e.target.value })} required />
                                    </div>
                                    <div className="form-field">
                                        <label>Concurrent Scans</label>
                                        <input type="number" className="form-input" value={formData.concurrent_scans}
                                            onChange={(e) => setFormData({ ...formData, concurrent_scans: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="form-field checkbox">
                                    <input type="checkbox" id="tierActive" checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} />
                                    <label htmlFor="tierActive">Active</label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : (editingTier ? 'Update Tier' : 'Create Tier')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const ScansManagement = ({ isDark, toast }) => {
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchScans = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/super-admin/scans?search=${search}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
                });
                setScans(res.data.scans || []);
            } catch (error) {
                console.error('Failed to fetch scans:', error);
                setScans([]);
            } finally {
                setLoading(false);
            }
        };
        fetchScans();
    }, [search]);

    const handleDelete = async (scanId) => {
        if (!window.confirm('Delete this scan?')) return;
        try {
            await api.delete(`/super-admin/scans/${scanId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
            });
            toast.success('Scan deleted');
            setScans(scans.filter(s => s.scan_id !== scanId));
        } catch (error) {
            toast.error('Failed to delete scan');
        }
    };

    return (
        <div className="management-section">
            <div className="section-header">
                <div>
                    <h2>Scan Management</h2>
                    <p>View and manage all platform scans</p>
                </div>
            </div>

            <div className="filters-bar">
                <div className="search-wrapper">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Search by URL or username..." className="search-input" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>

            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Target URL</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Vulnerabilities</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7}>Loading...</td></tr>
                        ) : scans.length === 0 ? (
                            <tr><td colSpan={7}><EmptyState message="No scans found" isDark={isDark} /></td></tr>
                        ) : (
                            scans.map(scan => (
                                <tr key={scan.scan_id}>
                                    <td><div className="table-user"><div className="table-avatar">{scan.username?.charAt(0).toUpperCase()}</div>{scan.username || 'Anonymous'}</div></td>
                                    <td className="url-cell">{scan.target_url}</td>
                                    <td>{scan.scan_type || 'Full Scan'}</td>
                                    <td><StatusBadge status={scan.status} /></td>
                                    <td><span className="vuln-count">{scan.total_vulnerabilities || 0}</span></td>
                                    <td>{format(new Date(scan.created_at), 'MMM d, yyyy')}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn delete" onClick={() => handleDelete(scan.scan_id)}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AnalyticsDashboard = ({ stats, isDark }) => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const chartColors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const res = await api.get('/super-admin/analytics', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
                });
                setAnalyticsData(res.data);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
                setAnalyticsData(null);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const scanTrends = analyticsData?.scanTrends || [];
    const vulnerabilityBreakdown = analyticsData?.vulnerabilityBreakdown || [];
    const topVulnerableEndpoints = analyticsData?.topVulnerableEndpoints || [];

    return (
        <div className="management-section">
            <div className="section-header">
                <div>
                    <h2>Analytics Dashboard</h2>
                    <p>Platform-wide analytics and insights</p>
                </div>
                <button className="btn btn-secondary">
                    <Download size={18} /> Export Report
                </button>
            </div>

            {loading ? (
                <div className="loading-text">Loading analytics...</div>
            ) : (
                <div className="analytics-grid">
                    <div className="analytics-card">
                        <h3>Scan Trends</h3>
                        {scanTrends.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <RechartsBar data={scanTrends}>
                                    <XAxis dataKey="month" stroke={isDark ? '#888' : '#666'} />
                                    <YAxis stroke={isDark ? '#888' : '#666'} />
                                    <Tooltip />
                                    <Bar dataKey="scans" fill="#6366f1" />
                                    <Bar dataKey="vulnerabilities" fill="#ef4444" />
                                </RechartsBar>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyState message="No scan trend data available" isDark={isDark} />
                        )}
                    </div>

                    <div className="analytics-card">
                        <h3>Vulnerability Breakdown</h3>
                        {vulnerabilityBreakdown.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <RechartsPie>
                                    <Pie data={vulnerabilityBreakdown} cx="50%" cy="50%" outerRadius={100} dataKey="count" label={({ name, count }) => `${name}: ${count}`}>
                                        {vulnerabilityBreakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color || chartColors[index % chartColors.length]} />
                                        ))}
                                    </Pie>
                                </RechartsPie>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyState message="No vulnerability data available" isDark={isDark} />
                        )}
                    </div>

                    <div className="analytics-card full-width">
                        <h3>Top Vulnerable Endpoints</h3>
                        <div className="table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Endpoint</th>
                                        <th>Vulnerabilities</th>
                                        <th>Severity</th>
                                        <th>Last Scanned</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topVulnerableEndpoints.length > 0 ? (
                                        topVulnerableEndpoints.map((ep, i) => (
                                            <tr key={i}>
                                                <td className="url-cell">{ep.url}</td>
                                                <td>{ep.count}</td>
                                                <td><span className={`severity-badge ${ep.severity}`}>{ep.severity}</span></td>
                                                <td>{formatDistanceToNow(new Date(ep.lastScanned), { addSuffix: true })}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan={4}><EmptyState message="No data available" isDark={isDark} /></td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SystemMonitoring = ({ isDark, toast }) => {
    const [systemStats, setSystemStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchSystemStats = async () => {
        try {
            setLoading(true);
            const res = await api.get('/super-admin/system', {
                headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
            });
            setSystemStats(res.data);
        } catch (error) {
            console.error('Failed to fetch system stats:', error);
            setSystemStats(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSystemStats();
    }, []);

    return (
        <div className="management-section">
            <div className="section-header">
                <div>
                    <h2>System Monitoring</h2>
                    <p>Server and infrastructure status</p>
                </div>
                <button className="btn btn-secondary" onClick={() => { fetchSystemStats(); toast.success('System stats refreshed'); }}>
                    <RefreshCw size={18} /> Refresh
                </button>
            </div>

            {loading ? (
                <div className="loading-text">Loading system stats...</div>
            ) : systemStats ? (
                <div className="system-grid">
                    <div className="system-card">
                        <div className="system-card-header">
                            <Server size={24} />
                            <h3>Server Status</h3>
                            <span className={`status-${systemStats.server?.status === 'online' ? 'online' : 'offline'}`}>
                                {systemStats.server?.status || 'Unknown'}
                            </span>
                        </div>
                        <div className="system-metrics">
                            <div className="metric">
                                <label>CPU Usage</label>
                                <div className="metric-bar">
                                    <div className="metric-fill" style={{ width: `${systemStats.server?.cpu || 0}%`, background: (systemStats.server?.cpu || 0) > 80 ? '#ef4444' : '#10b981' }}></div>
                                </div>
                                <span>{systemStats.server?.cpu || 0}%</span>
                            </div>
                            <div className="metric">
                                <label>Memory</label>
                                <div className="metric-bar">
                                    <div className="metric-fill" style={{ width: `${systemStats.server?.memory || 0}%`, background: (systemStats.server?.memory || 0) > 80 ? '#ef4444' : '#6366f1' }}></div>
                                </div>
                                <span>{systemStats.server?.memory || 0}%</span>
                            </div>
                            <div className="metric">
                                <label>Disk</label>
                                <div className="metric-bar">
                                    <div className="metric-fill" style={{ width: `${systemStats.server?.disk || 0}%`, background: (systemStats.server?.disk || 0) > 80 ? '#ef4444' : '#f59e0b' }}></div>
                                </div>
                                <span>{systemStats.server?.disk || 0}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="system-card">
                        <div className="system-card-header">
                            <Database size={24} />
                            <h3>Database</h3>
                            <span className={`status-${systemStats.database?.status || 'unknown'}`}>
                                {systemStats.database?.status || 'Unknown'}
                            </span>
                        </div>
                        <div className="system-stats">
                            <div className="system-stat">
                                <span className="stat-value">{systemStats.database?.connections || 0}</span>
                                <span className="stat-label">Connections</span>
                            </div>
                            <div className="system-stat">
                                <span className="stat-value">{(systemStats.database?.queries || 0).toLocaleString()}</span>
                                <span className="stat-label">Queries/min</span>
                            </div>
                            <div className="system-stat">
                                <span className="stat-value">{systemStats.database?.size || '0 GB'}</span>
                                <span className="stat-label">Size</span>
                            </div>
                        </div>
                    </div>

                    <div className="system-card">
                        <div className="system-card-header">
                            <Zap size={24} />
                            <h3>API Health</h3>
                            <span className={`status-${systemStats.api?.status || 'unknown'}`}>
                                {systemStats.api?.status || 'Unknown'}
                            </span>
                        </div>
                        <div className="system-stats">
                            <div className="system-stat">
                                <span className="stat-value">{(systemStats.api?.requests || 0).toLocaleString()}</span>
                                <span className="stat-label">Requests/min</span>
                            </div>
                            <div className="system-stat">
                                <span className="stat-value">{systemStats.api?.errors || 0}</span>
                                <span className="stat-label">Errors</span>
                            </div>
                            <div className="system-stat">
                                <span className="stat-value">{systemStats.api?.latency || 0}ms</span>
                                <span className="stat-label">Latency</span>
                            </div>
                        </div>
                    </div>

                    <div className="system-card">
                        <div className="system-card-header">
                            <ShieldCheck size={24} />
                            <h3>Uptime</h3>
                        </div>
                        <div className="uptime-display">
                            <span className="uptime-value">{systemStats.uptime || 0}%</span>
                            <span className="uptime-label">Last 30 days</span>
                        </div>
                        <div className="backup-info">
                            <HardDriveDownload size={16} />
                            <span>Last backup: {systemStats.lastBackup || 'Never'}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <EmptyState message="Failed to load system stats" isDark={isDark} />
            )}
        </div>
    );
};

const APIManager = ({ isDark, toast }) => {
    const [endpoints, setEndpoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEndpoint, setEditingEndpoint] = useState(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ method: 'GET', path: '', description: '', status: 'active' });

    useEffect(() => {
        const fetchEndpoints = async () => {
            try {
                setLoading(true);
                const res = await api.get('/super-admin/api/endpoints', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
                });
                setEndpoints(res.data.endpoints || []);
            } catch (error) {
                console.error('Failed to fetch API endpoints:', error);
                setEndpoints([]);
            } finally {
                setLoading(false);
            }
        };
        fetchEndpoints();
    }, []);

    const methodColors = { GET: '#10b981', POST: '#3b82f6', PUT: '#f59e0b', DELETE: '#ef4444', PATCH: '#8b5cf6' };

    const handleToggleStatus = async (endpoint) => {
        const newStatus = endpoint.status === 'active' ? 'inactive' : 'active';
        try {
            await api.put(`/super-admin/api/endpoints/${endpoint.id}`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
            });
            toast.success(`Endpoint ${newStatus === 'active' ? 'enabled' : 'disabled'}`);
            setEndpoints(endpoints.map(ep => ep.id === endpoint.id ? { ...ep, status: newStatus } : ep));
        } catch (error) {
            toast.error('Failed to update endpoint');
        }
    };

    const handleDelete = async (endpointId) => {
        if (!window.confirm('Are you sure you want to delete this endpoint?')) return;
        try {
            await api.delete(`/super-admin/api/endpoints/${endpointId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
            });
            toast.success('Endpoint deleted successfully');
            setEndpoints(endpoints.filter(ep => ep.id !== endpointId));
        } catch (error) {
            toast.error('Failed to delete endpoint');
        }
    };

    const openModal = (endpoint = null) => {
        if (endpoint) {
            setEditingEndpoint(endpoint);
            setFormData({
                method: endpoint.method || 'GET',
                path: endpoint.path || '',
                description: endpoint.description || '',
                status: endpoint.status || 'active'
            });
        } else {
            setEditingEndpoint(null);
            setFormData({ method: 'GET', path: '', description: '', status: 'active' });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            if (editingEndpoint) {
                await api.put(`/super-admin/api/endpoints/${editingEndpoint.id}`, formData, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
                });
                toast.success('Endpoint updated successfully');
            } else {
                await api.post('/super-admin/api/endpoints', formData, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
                });
                toast.success('Endpoint created successfully');
            }
            setShowModal(false);
            const res = await api.get('/super-admin/api/endpoints', {
                headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
            });
            setEndpoints(res.data.endpoints || []);
        } catch (error) {
            toast.error(editingEndpoint ? 'Failed to update endpoint' : 'Failed to create endpoint');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="management-section">
            <div className="section-header">
                <div>
                    <h2>API Manager</h2>
                    <p>Manage API endpoints and monitor usage</p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <Plus size={18} /> Add Endpoint
                </button>
            </div>

            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Method</th>
                            <th>Endpoint</th>
                            <th>Hits</th>
                            <th>Avg Latency</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6}>Loading...</td></tr>
                        ) : endpoints.length === 0 ? (
                            <tr><td colSpan={6}><EmptyState message="No endpoints found" isDark={isDark} icon={Code} /></td></tr>
                        ) : (
                            endpoints.map((ep, i) => (
                                <tr key={ep.id || i}>
                                    <td><span className="method-badge" style={{ background: methodColors[ep.method] || '#666' }}>{ep.method}</span></td>
                                    <td className="url-cell"><code>{ep.path}</code></td>
                                    <td>{(ep.hits || 0).toLocaleString()}</td>
                                    <td>{ep.latency || 0}ms</td>
                                    <td><span className={`status-indicator ${ep.status}`}><span className="status-dot"></span>{ep.status}</span></td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn edit" onClick={() => openModal(ep)}><Edit size={16} /></button>
                                            <button className="action-btn toggle" onClick={() => handleToggleStatus(ep)}>
                                                {ep.status === 'active' ? <XCircle size={16} /> : <CheckCircle size={16} />}
                                            </button>
                                            <button className="action-btn delete" onClick={() => handleDelete(ep.id)}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingEndpoint ? 'Edit API Endpoint' : 'Add New API Endpoint'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-field">
                                    <label>HTTP Method</label>
                                    <select className="form-input" value={formData.method}
                                        onChange={(e) => setFormData({ ...formData, method: e.target.value })}>
                                        <option value="GET">GET</option>
                                        <option value="POST">POST</option>
                                        <option value="PUT">PUT</option>
                                        <option value="DELETE">DELETE</option>
                                        <option value="PATCH">PATCH</option>
                                    </select>
                                </div>
                                <div className="form-field">
                                    <label>Endpoint Path</label>
                                    <input type="text" className="form-input" value={formData.path}
                                        onChange={(e) => setFormData({ ...formData, path: e.target.value })} placeholder="/api/v1/resource" required />
                                </div>
                                <div className="form-field">
                                    <label>Description</label>
                                    <input type="text" className="form-input" value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                </div>
                                <div className="form-field checkbox">
                                    <input type="checkbox" id="endpointActive" checked={formData.status === 'active'}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'active' : 'inactive' })} />
                                    <label htmlFor="endpointActive">Active</label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : (editingEndpoint ? 'Update Endpoint' : 'Create Endpoint')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const SecurityCenter = ({ isDark, toast }) => {
    const [securityData, setSecurityData] = useState({ alerts: [], stats: {} });
    const [loading, setLoading] = useState(true);
    const [runningScan, setRunningScan] = useState(false);

    useEffect(() => {
        const fetchSecurityData = async () => {
            try {
                setLoading(true);
                const res = await api.get('/super-admin/security', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
                });
                setSecurityData(res.data || { alerts: [], stats: {} });
            } catch (error) {
                console.error('Failed to fetch security data:', error);
                setSecurityData({ alerts: [], stats: {} });
            } finally {
                setLoading(false);
            }
        };
        fetchSecurityData();
    }, []);

    const handleDismissAlert = async (alertId) => {
        try {
            await api.delete(`/super-admin/security/alerts/${alertId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
            });
            toast.success('Alert dismissed');
            setSecurityData(prev => ({
                ...prev,
                alerts: prev.alerts.filter(a => a.id !== alertId)
            }));
        } catch (error) {
            toast.error('Failed to dismiss alert');
        }
    };

    const handleRunSecurityScan = async () => {
        try {
            setRunningScan(true);
            await api.post('/super-admin/security/scan', {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
            });
            toast.success('Security scan initiated');
            setTimeout(() => {
                fetchSecurityData();
                setRunningScan(false);
            }, 3000);
        } catch (error) {
            toast.error('Failed to run security scan');
            setRunningScan(false);
        }
    };

    const fetchSecurityData = async () => {
        try {
            const res = await api.get('/super-admin/security', {
                headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
            });
            setSecurityData(res.data || { alerts: [], stats: {} });
        } catch (error) {
            console.error('Failed to fetch security data:', error);
        }
    };

    return (
        <div className="management-section">
            <div className="section-header">
                <div>
                    <h2>Security Center</h2>
                    <p>Monitor security events and manage threats</p>
                </div>
                <button className="btn btn-secondary" onClick={handleRunSecurityScan} disabled={runningScan}>
                    <Shield size={18} /> {runningScan ? 'Running Scan...' : 'Run Security Scan'}
                </button>
            </div>

            {loading ? (
                <div className="loading-text">Loading security data...</div>
            ) : (
                <div className="security-grid">
                    <div className="security-card">
                        <h3><AlertTriangle size={20} /> Security Alerts ({securityData.alerts?.length || 0})</h3>
                        {securityData.alerts && securityData.alerts.length > 0 ? (
                            <div className="alerts-list">
                                {securityData.alerts.map(alert => (
                                    <div key={alert.id} className={`alert-item ${alert.type}`}>
                                        <div className="alert-content">
                                            <span className="alert-message">{alert.message}</span>
                                            <span className="alert-time">{alert.time || formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}</span>
                                        </div>
                                        <button className="alert-action" onClick={() => handleDismissAlert(alert.id)} title="Dismiss">
                                            {alert.type === 'critical' ? <Eye size={16} /> : <XCircle size={16} />}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState message="No security alerts" isDark={isDark} />
                        )}
                    </div>

                    <div className="security-card">
                        <h3><Lock size={20} /> Access Control</h3>
                        <div className="security-stats">
                            <div className="security-stat">
                                <ShieldCheck size={24} />
                                <div>
                                    <span className="stat-value">{securityData.stats?.activeSessions || 0}</span>
                                    <span className="stat-label">Active Sessions</span>
                                </div>
                            </div>
                            <div className="security-stat">
                                <UserCheck size={24} />
                                <div>
                                    <span className="stat-value">{securityData.stats?.mfaAdoption || 0}%</span>
                                    <span className="stat-label">MFA Adoption</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="security-card">
                        <h3><Key size={20} /> API Keys</h3>
                        <p className="security-desc">Manage API keys and access tokens</p>
                        <button className="btn btn-secondary">Manage Keys</button>
                    </div>

                    <div className="security-card">
                        <h3><Globe size={20} /> SSL Certificates</h3>
                        <p className="security-desc">Monitor SSL/TLS certificates</p>
                        <button className="btn btn-secondary">View Certificates</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const AuditLogs = ({ isDark, toast }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true);
                const res = await api.get('/super-admin/audit-logs', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
                });
                setLogs(res.data.logs || []);
            } catch (error) {
                console.error('Failed to fetch audit logs:', error);
                setLogs([]);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    return (
        <div className="management-section">
            <div className="section-header">
                <div>
                    <h2>Audit Logs</h2>
                    <p>Complete activity history and system events</p>
                </div>
                <button className="btn btn-secondary">
                    <Download size={18} /> Export Logs
                </button>
            </div>

            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Action</th>
                            <th>User</th>
                            <th>IP Address</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5}>Loading...</td></tr>
                        ) : logs.length === 0 ? (
                            <tr><td colSpan={5}><EmptyState message="No audit logs" isDark={isDark} /></td></tr>
                        ) : (
                            logs.map(log => (
                                <tr key={log.id}>
                                    <td>{format(new Date(log.time), 'MMM d, yyyy HH:mm:ss')}</td>
                                    <td><span className="action-badge">{log.action}</span></td>
                                    <td>{log.user}</td>
                                    <td><code>{log.ip}</code></td>
                                    <td><button className="btn btn-sm btn-secondary"><Eye size={14} /></button></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const SystemSettings = ({ isDark, toast }) => {
    const [settings, setSettings] = useState({
        siteName: '',
        siteUrl: '',
        supportEmail: '',
        maintenanceMode: false,
        registrationEnabled: true,
        emailVerification: true,
        maxScansPerDay: 100,
        scanTimeout: 3600,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true);
                const res = await api.get('/super-admin/settings', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
                });
                if (res.data) {
                    setSettings(res.data);
                }
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        try {
            setSaving(true);
            await api.put('/super-admin/settings', settings, {
                headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
            });
            toast.success('Settings saved successfully');
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="management-section"><div className="loading-text">Loading settings...</div></div>;
    }

    return (
        <div className="management-section">
            <div className="section-header">
                <div>
                    <h2>System Settings</h2>
                    <p>Configure platform-wide settings</p>
                </div>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                    <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="settings-grid">
                <div className="settings-card">
                    <h3><Globe size={20} /> General Settings</h3>
                    <div className="settings-form">
                        <div className="form-field">
                            <label>Site Name</label>
                            <input type="text" className="form-input" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
                        </div>
                        <div className="form-field">
                            <label>Site URL</label>
                            <input type="url" className="form-input" value={settings.siteUrl} onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })} />
                        </div>
                        <div className="form-field">
                            <label>Support Email</label>
                            <input type="email" className="form-input" value={settings.supportEmail} onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })} />
                        </div>
                    </div>
                </div>

                <div className="settings-card">
                    <h3><Settings size={20} /> Platform Settings</h3>
                    <div className="settings-form">
                        <div className="form-field checkbox">
                            <input type="checkbox" id="maintenance" checked={settings.maintenanceMode} onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })} />
                            <label htmlFor="maintenance">Maintenance Mode</label>
                        </div>
                        <div className="form-field checkbox">
                            <input type="checkbox" id="registration" checked={settings.registrationEnabled} onChange={(e) => setSettings({ ...settings, registrationEnabled: e.target.checked })} />
                            <label htmlFor="registration">Allow User Registration</label>
                        </div>
                        <div className="form-field checkbox">
                            <input type="checkbox" id="verification" checked={settings.emailVerification} onChange={(e) => setSettings({ ...settings, emailVerification: e.target.checked })} />
                            <label htmlFor="verification">Require Email Verification</label>
                        </div>
                    </div>
                </div>

                <div className="settings-card">
                    <h3><Scan size={20} /> Scan Settings</h3>
                    <div className="settings-form">
                        <div className="form-field">
                            <label>Max Scans Per Day</label>
                            <input type="number" className="form-input" value={settings.maxScansPerDay} onChange={(e) => setSettings({ ...settings, maxScansPerDay: parseInt(e.target.value) })} />
                        </div>
                        <div className="form-field">
                            <label>Scan Timeout (seconds)</label>
                            <input type="number" className="form-input" value={settings.scanTimeout} onChange={(e) => setSettings({ ...settings, scanTimeout: parseInt(e.target.value) })} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EmptyState = ({ message, isDark, icon: Icon }) => (
    <div className="empty-state">
        {Icon ? <Icon size={40} className="empty-icon" /> : <Search size={40} className="empty-icon" />}
        <p className="empty-message">{message}</p>
    </div>
);

const StatusBadge = ({ status }) => {
    const statusConfig = {
        completed: { class: 'success', icon: <CheckCircle size={12} /> },
        running: { class: 'info', icon: <Loader2 size={12} className="spin" /> },
        failed: { class: 'danger', icon: <XCircle size={12} /> },
        pending: { class: 'warning', icon: <Clock size={12} /> },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
        <span className={`status-badge ${config.class}`}>
            {config.icon}
            {status}
        </span>
    );
};

export default SuperAdminDashboard;
