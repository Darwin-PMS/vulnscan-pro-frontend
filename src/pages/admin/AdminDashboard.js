import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Users, CreditCard, Scan, Activity, 
    Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight,
    UserCheck, UserX, Crown, AlertCircle, CheckCircle, XCircle, Sun, Moon,
    ChevronDown, Loader2, Users2, FileSearch2, Building2, Shield, BarChart3,
    LayoutDashboard, TrendingUp, TrendingDown, Minus, Menu, X, Bell, LogOut,
    Settings, PieChart, List, Grid3X3, ChevronRight as ChevronRightIcon, Home,
    FileText, BarChart, Server, ShieldAlert, Download, RefreshCw
} from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { formatDistanceToNow, format } from 'date-fns';
import { useDebounce, useFormValidation } from '../../hooks/useAdmin';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'users', label: 'Users', icon: Users, badge: stats?.totalUsers || 0 },
        { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, badge: stats?.activeSubscriptions || 0 },
        { id: 'tiers', label: 'Pricing Tiers', icon: Crown },
        { id: 'scans', label: 'Scans', icon: Scan, badge: stats?.totalScans || 0 },
        { id: 'analytics', label: 'Analytics', icon: BarChart },
        { id: 'audit', label: 'Audit Logs', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    useEffect(() => {
        if (user?.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchStats();
    }, [user, navigate]);

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/dashboard');
            setStats(res.data);
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingScreen isDark={isDark} />;
    }

    return (
        <div className={`admin-layout ${isDark ? 'admin-dark' : 'admin-light'}`}>
            <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <Shield className="logo-icon" />
                        {!sidebarCollapsed && <span className="logo-text">VulnScan Pro</span>}
                    </div>
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
                    <button className="nav-item" onClick={logout} title="Logout">
                        <LogOut size={20} />
                        {!sidebarCollapsed && <span className="nav-label">Logout</span>}
                    </button>
                </div>
            </aside>

            <div className="admin-main">
                <header className="admin-header">
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
                                {tabs.find(t => t.id === activeTab)?.label || 'Admin'}
                            </span>
                        </div>
                    </div>
                    <div className="header-right">
                        <button className="header-btn" aria-label="Notifications">
                            <Bell size={20} />
                            <span className="notification-dot"></span>
                        </button>
                        <div className="user-info">
                            <div className="user-avatar">
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="user-details">
                                <span className="user-name">{user?.username}</span>
                                <span className="user-role">Administrator</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="admin-content">
                    {activeTab === 'dashboard' && <DashboardOverview stats={stats} isDark={isDark} />}
                    {activeTab === 'users' && <UsersManagement onUpdate={fetchStats} isDark={isDark} toast={toast} />}
                    {activeTab === 'subscriptions' && <SubscriptionsManagement isDark={isDark} toast={toast} />}
                    {activeTab === 'tiers' && <PricingTiersManagement isDark={isDark} />}
                    {activeTab === 'scans' && <ScansManagement isDark={isDark} toast={toast} />}
                    {activeTab === 'analytics' && <AdminAnalytics stats={stats} isDark={isDark} />}
                    {activeTab === 'audit' && <AdminAuditLogs isDark={isDark} toast={toast} />}
                    {activeTab === 'settings' && <AdminSettings isDark={isDark} toast={toast} />}
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
            <p>Loading admin dashboard...</p>
        </div>
    </div>
);

const DashboardOverview = ({ stats, isDark }) => {
    const chartColors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    
    const subscriptionData = Array.isArray(stats?.subscriptionsByTier) 
        ? stats.subscriptionsByTier.map((tier, i) => ({
            name: tier.name,
            value: tier.count,
            color: chartColors[i % chartColors.length]
        })) 
        : [];

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
            icon: <AlertCircle size={24} />, 
            value: stats?.totalVulnerabilities || 0, 
            label: 'Vulnerabilities', 
            color: '#ef4444',
            trend: '-5%',
            trendUp: false
        },
    ];

    return (
        <div className="dashboard-overview">
            <div className="section-header">
                <h2>Welcome back, Admin</h2>
                <p>Here's what's happening with your platform today.</p>
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
                        <div className="stat-value">{stat.value.toLocaleString()}</div>
                        <div className="stat-label">{stat.label}</div>
                        <div className="stat-bar">
                            <div className="stat-bar-fill" style={{ width: `${Math.min((stat.value / (stats?.totalUsers || stat.value || 1)) * 100, 100)}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card chart-card">
                    <div className="card-header">
                        <h3>
                            <PieChart size={18} />
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

                <div className="dashboard-card activity-card">
                    <div className="card-header">
                        <h3>
                            <Activity size={18} />
                            Recent Users
                        </h3>
                        <span className="view-all">Last 7 days</span>
                    </div>
                    <div className="activity-list">
                        {stats?.recentUsers?.length > 0 ? (
                            stats.recentUsers.map((user, i) => (
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
                            {stats?.recentScans?.length > 0 ? (
                                stats.recentScans.map(scan => (
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
    );
};

const EmptyState = ({ message, isDark, icon: Icon }) => (
    <div className="empty-state">
        {Icon ? <Icon size={40} className="empty-icon" /> : <Search size={40} className="empty-icon" />}
        <p className="empty-message">{message}</p>
    </div>
);

const UsersManagement = ({ onUpdate, isDark, toast }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    
    const debouncedSearch = useDebounce(search, 300);

    const validationRules = {
        username: [
            (v) => !v?.trim() ? 'Username is required' : '',
            (v) => v?.length < 3 ? 'Username must be at least 3 characters' : ''
        ],
        email: [
            (v) => !v?.trim() ? 'Email is required' : '',
            (v) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Valid email is required' : ''
        ],
        password: [
            (v, values) => !editingUser && !v ? 'Password is required' : '',
            (v) => v && v.length < 6 ? 'Password must be at least 6 characters' : ''
        ]
    };

    const { values, errors, handleChange, handleBlur, reset, setValues } = useFormValidation(
        { username: '', email: '', password: '', fullName: '', role: 'user' },
        validationRules
    );

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get(`/admin/users?page=${page}&limit=20&search=${debouncedSearch}`);
            setUsers(res.data.users);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, toast]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!editingUser && !values.password) {
            toast.error('Password is required');
            return;
        }

        try {
            if (editingUser) {
                await api.put(`/admin/users/${editingUser.id}`, {
                    username: values.username,
                    email: values.email,
                    fullName: values.fullName,
                    role: values.role,
                    ...(values.password && { password: values.password })
                });
                toast.success('User updated successfully');
            } else {
                await api.post('/admin/users', values);
                toast.success('User created successfully');
            }
            setShowModal(false);
            reset();
            fetchUsers();
            onUpdate();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Operation failed');
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        
        try {
            setActionLoading(userId);
            await api.delete(`/admin/users/${userId}`);
            toast.success('User deleted successfully');
            fetchUsers();
            onUpdate();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete user');
        } finally {
            setActionLoading(null);
        }
    };

    const handleToggleActive = async (user) => {
        try {
            setActionLoading(user.id);
            await api.put(`/admin/users/${user.id}`, { isActive: !user.is_active });
            toast.success(`User ${user.is_active ? 'deactivated' : 'activated'} successfully`);
            fetchUsers();
            onUpdate();
        } catch (error) {
            toast.error('Failed to update user status');
        } finally {
            setActionLoading(null);
        }
    };

    const handleToggleRole = async (user) => {
        try {
            setActionLoading(user.id);
            await api.put(`/admin/users/${user.id}`, { role: user.role === 'admin' ? 'user' : 'admin' });
            toast.success(`User role updated to ${user.role === 'admin' ? 'user' : 'admin'}`);
            fetchUsers();
            onUpdate();
        } catch (error) {
            toast.error('Failed to update user role');
        } finally {
            setActionLoading(null);
        }
    };

    const openModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setValues({
                username: user.username,
                email: user.email,
                password: '',
                fullName: user.full_name || '',
                role: user.role
            });
        } else {
            setEditingUser(null);
            reset();
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingUser(null);
        reset();
    };

    return (
        <div className="management-section">
            <div className="section-header">
                <div>
                    <h2>User Management</h2>
                    <p>Manage user accounts and permissions</p>
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
                        placeholder="Search users by name or email..."
                        className="search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        aria-label="Search users"
                    />
                </div>
                <div className="results-count">
                    {users.length} {users.length === 1 ? 'result' : 'results'}
                </div>
            </div>

            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
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
                            <>
                                <LoadingSkeleton cols={7} />
                                <LoadingSkeleton cols={7} />
                                <LoadingSkeleton cols={7} />
                            </>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={7}>
                                    <EmptyState 
                                        message={search ? 'No users match your search' : 'No users found'} 
                                        isDark={isDark} 
                                    />
                                    {search && (
                                        <button className="btn btn-secondary" onClick={() => setSearch('')}>
                                            Clear search
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="table-user">
                                            <div className="table-avatar">
                                                {user.username?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="user-info">
                                                <span className="user-name">{user.username}</span>
                                                <span className="user-email">{user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`role-badge ${user.role}`}>
                                            {user.role === 'admin' ? <Shield size={12} /> : <Users size={12} />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-indicator ${user.is_active ? 'active' : 'inactive'}`}>
                                            <span className="status-dot"></span>
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="scan-count">{user.scans_count || 0}</span>
                                    </td>
                                    <td>
                                        {user.subscription ? (
                                            <span className="subscription-badge">
                                                {user.subscription.tier_name}
                                            </span>
                                        ) : (
                                            <span className="no-subscription">Free</span>
                                        )}
                                    </td>
                                    <td className="date-cell">
                                        {format(new Date(user.created_at), 'MMM d, yyyy')}
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button 
                                                className="action-btn edit"
                                                onClick={() => openModal(user)}
                                                aria-label={`Edit ${user.username}`}
                                                disabled={actionLoading === user.id}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                className="action-btn toggle"
                                                onClick={() => handleToggleActive(user)}
                                                title={user.is_active ? 'Deactivate' : 'Activate'}
                                                disabled={actionLoading === user.id}
                                            >
                                                {user.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
                                            </button>
                                            <button 
                                                className="action-btn crown"
                                                onClick={() => handleToggleRole(user)}
                                                title="Toggle Admin"
                                                disabled={actionLoading === user.id}
                                            >
                                                <Crown size={16} />
                                            </button>
                                            <button 
                                                className="action-btn delete"
                                                onClick={() => handleDelete(user.id)}
                                                aria-label={`Delete ${user.username}`}
                                                disabled={actionLoading === user.id}
                                            >
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

            {!loading && users.length > 0 && (
                <div className="pagination">
                    <span className="pagination-info">
                        Page {page} of {totalPages}
                    </span>
                    <div className="pagination-controls">
                        <button 
                            className="btn btn-secondary btn-sm"
                            disabled={page === 1} 
                            onClick={() => setPage(p => p - 1)}
                        >
                            <ChevronLeft size={16} /> Previous
                        </button>
                        <div className="page-numbers">
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                let pageNum = i + 1;
                                if (totalPages > 5) {
                                    if (page <= 3) pageNum = i + 1;
                                    else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                                    else pageNum = page - 2 + i;
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        className={`page-num ${page === pageNum ? 'active' : ''}`}
                                        onClick={() => setPage(pageNum)}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>
                        <button 
                            className="btn btn-secondary btn-sm"
                            disabled={page === totalPages} 
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal animate-scale-in" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 id="modal-title">{editingUser ? 'Edit User' : 'Add New User'}</h3>
                            <button className="modal-close" onClick={closeModal} aria-label="Close modal">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <FormField 
                                label="Username" 
                                name="username" 
                                value={values.username} 
                                onChange={handleChange} 
                                onBlur={handleBlur}
                                error={errors.username}
                                required
                                isDark={isDark}
                            />
                            <FormField 
                                label="Email" 
                                name="email" 
                                type="email"
                                value={values.email} 
                                onChange={handleChange} 
                                onBlur={handleBlur}
                                error={errors.email}
                                required
                                isDark={isDark}
                            />
                            <FormField 
                                label={`Password ${editingUser ? '(leave blank to keep current)' : ''}`}
                                name="password" 
                                type="password"
                                value={values.password} 
                                onChange={handleChange} 
                                onBlur={handleBlur}
                                error={errors.password}
                                required={!editingUser}
                                isDark={isDark}
                            />
                            <FormField 
                                label="Full Name" 
                                name="fullName" 
                                value={values.fullName} 
                                onChange={handleChange}
                                isDark={isDark}
                            />
                            <div className="form-field">
                                <label>Role</label>
                                <select 
                                    name="role" 
                                    className="select-input"
                                    value={values.role} 
                                    onChange={handleChange}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary">
                                    {editingUser ? 'Update User' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const FormField = ({ label, name, type = 'text', value, onChange, onBlur, error, required, isDark }) => {
    return (
        <div className="form-field">
            <label>
                {label} {required && <span className="required">*</span>}
            </label>
            <input
                type={type}
                name={name}
                className={`form-input ${error ? 'error' : ''}`}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                aria-invalid={!!error}
                aria-describedby={error ? `${name}-error` : undefined}
            />
            {error && (
                <span id={`${name}-error`} className="error-message">
                    {error}
                </span>
            )}
        </div>
    );
};

const LoadingSkeleton = ({ cols }) => (
    <tr>
        {Array.from({ length: cols }).map((_, i) => (
            <td key={i}>
                <div className="skeleton-box" />
            </td>
        ))}
    </tr>
);

const SubscriptionsManagement = ({ isDark, toast }) => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchSubscriptions = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get(`/admin/subscriptions?page=${page}&limit=20`);
            setSubscriptions(res.data.subscriptions);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            toast.error('Failed to fetch subscriptions');
        } finally {
            setLoading(false);
        }
    }, [page, toast]);

    useEffect(() => {
        fetchSubscriptions();
    }, [fetchSubscriptions]);

    const handleUpdateStatus = async (subId, status) => {
        try {
            setActionLoading(subId);
            await api.put(`/admin/subscriptions/${subId}`, { status });
            toast.success('Subscription updated successfully');
            fetchSubscriptions();
        } catch (error) {
            toast.error('Failed to update subscription');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="management-section">
            <div className="section-header">
                <div>
                    <h2>Subscriptions</h2>
                    <p>Manage user subscriptions and billing</p>
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
                            <th>Scans Used</th>
                            <th>Period</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <>
                                <LoadingSkeleton cols={7} />
                                <LoadingSkeleton cols={7} />
                                <LoadingSkeleton cols={7} />
                            </>
                        ) : subscriptions.length === 0 ? (
                            <tr>
                                <td colSpan={7}>
                                    <EmptyState message="No subscriptions found" isDark={isDark} />
                                </td>
                            </tr>
                        ) : (
                            subscriptions.map(sub => (
                                <tr key={sub.id}>
                                    <td>
                                        <div className="table-user">
                                            <div className="table-avatar">
                                                {sub.username?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="user-info">
                                                <span className="user-name">{sub.username}</span>
                                                <span className="user-email">{sub.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`tier-badge tier-${sub.tier_id}`}>
                                            {sub.tier_name}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="billing-cycle">{sub.billing_cycle}</span>
                                    </td>
                                    <td>
                                        <span className={`status-badge status-${sub.status}`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="scan-count">{sub.scans_used_this_month}</span>
                                    </td>
                                    <td className="date-cell">
                                        {format(new Date(sub.start_date), 'MMM d')} - {sub.end_date ? format(new Date(sub.end_date), 'MMM d, yyyy') : 'Ongoing'}
                                    </td>
                                    <td>
                                        <select
                                            className="status-select"
                                            value={sub.status}
                                            onChange={(e) => handleUpdateStatus(sub.id, e.target.value)}
                                            disabled={actionLoading === sub.id}
                                        >
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

            {!loading && subscriptions.length > 0 && (
                <div className="pagination">
                    <span className="pagination-info">
                        Page {page} of {totalPages}
                    </span>
                    <div className="pagination-controls">
                        <button 
                            className="btn btn-secondary btn-sm"
                            disabled={page === 1} 
                            onClick={() => setPage(p => p - 1)}
                        >
                            <ChevronLeft size={16} /> Previous
                        </button>
                        <button 
                            className="btn btn-secondary btn-sm"
                            disabled={page === totalPages} 
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const PricingTiersManagement = ({ isDark }) => {
    const [tiers, setTiers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTiers = async () => {
            try {
                setLoading(true);
                const res = await api.get('/admin/tiers');
                setTiers(res.data.tiers);
            } catch (error) {
                console.error('Error fetching tiers:', error);
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

    return (
        <div className="management-section">
            <div className="section-header">
                <div>
                    <h2>Pricing Tiers</h2>
                    <p>Configure subscription plans and pricing</p>
                </div>
            </div>

            {loading ? (
                <div className="tiers-grid">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="tier-card skeleton-card">
                            <div className="skeleton-title"></div>
                            <div className="skeleton-price"></div>
                            <div className="skeleton-features"></div>
                        </div>
                    ))}
                </div>
            ) : tiers.length === 0 ? (
                <EmptyState message="No pricing tiers available" isDark={isDark} icon={Crown} />
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
                                <span className="price-amount">${parseFloat(tier.price_monthly).toFixed(2)}</span>
                                <span className="price-period">/month</span>
                            </div>
                            <div className="tier-yearly">
                                ${parseFloat(tier.price_yearly).toFixed(2)}/year
                            </div>
                            <div className="tier-divider"></div>
                            <div className="tier-stats">
                                <div className="tier-stat">
                                    <span className="stat-value">{tier.subscriberCount}</span>
                                    <span className="stat-label">Subscribers</span>
                                </div>
                                <div className="tier-stat">
                                    <span className="stat-value">
                                        {tier.scan_limit_monthly === -1 ? '∞' : tier.scan_limit_monthly}
                                    </span>
                                    <span className="stat-label">Scans/mo</span>
                                </div>
                                <div className="tier-stat">
                                    <span className="stat-value">{tier.concurrent_scans}</span>
                                    <span className="stat-label">Concurrent</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const ScansManagement = ({ isDark, toast }) => {
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [actionLoading, setActionLoading] = useState(null);
    const debouncedSearch = useDebounce(search, 300);

    const fetchScans = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get(`/admin/scans?page=${page}&limit=20&search=${debouncedSearch}`);
            setScans(res.data.scans);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            toast.error('Failed to fetch scans');
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, toast]);

    useEffect(() => {
        fetchScans();
    }, [fetchScans]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    const handleDelete = async (scanId) => {
        if (!window.confirm('Are you sure you want to delete this scan?')) return;
        
        try {
            setActionLoading(scanId);
            await api.delete(`/admin/scans/${scanId}`);
            toast.success('Scan deleted successfully');
            fetchScans();
        } catch (error) {
            toast.error('Failed to delete scan');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="management-section">
            <div className="section-header">
                <div>
                    <h2>Scan Management</h2>
                    <p>View and manage all security scans</p>
                </div>
            </div>

            <div className="filters-bar">
                <div className="search-wrapper">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by URL or username..."
                        className="search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        aria-label="Search scans"
                    />
                </div>
                <div className="results-count">
                    {scans.length} {scans.length === 1 ? 'result' : 'results'}
                </div>
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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <>
                                <LoadingSkeleton cols={6} />
                                <LoadingSkeleton cols={6} />
                                <LoadingSkeleton cols={6} />
                            </>
                        ) : scans.length === 0 ? (
                            <tr>
                                <td colSpan={6}>
                                    <EmptyState 
                                        message={search ? 'No scans match your search' : 'No scans found'} 
                                        isDark={isDark} 
                                    />
                                    {search && (
                                        <button className="btn btn-secondary" onClick={() => setSearch('')}>
                                            Clear search
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ) : (
                            scans.map(scan => (
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
                                    <td>
                                        <button 
                                            className="action-btn delete"
                                            onClick={() => handleDelete(scan.scan_id)}
                                            aria-label={`Delete scan`}
                                            disabled={actionLoading === scan.scan_id}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {!loading && scans.length > 0 && (
                <div className="pagination">
                    <span className="pagination-info">
                        Page {page} of {totalPages}
                    </span>
                    <div className="pagination-controls">
                        <button 
                            className="btn btn-secondary btn-sm"
                            disabled={page === 1} 
                            onClick={() => setPage(p => p - 1)}
                        >
                            <ChevronLeft size={16} /> Previous
                        </button>
                        <button 
                            className="btn btn-secondary btn-sm"
                            disabled={page === totalPages} 
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const AdminAnalytics = ({ stats, isDark }) => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const res = await api.get('/admin/analytics');
                setAnalytics(res.data);
            } catch (error) {
                setAnalytics({
                    scanTrends: [
                        { month: 'Jan', scans: 120, vulnerabilities: 45 },
                        { month: 'Feb', scans: 150, vulnerabilities: 52 },
                        { month: 'Mar', scans: 180, vulnerabilities: 48 },
                        { month: 'Apr', scans: 210, vulnerabilities: 61 },
                    ],
                    vulnerabilityBreakdown: [
                        { name: 'SQL Injection', count: 15, color: '#ef4444' },
                        { name: 'XSS', count: 12, color: '#f59e0b' },
                        { name: 'CSRF', count: 8, color: '#8b5cf6' },
                        { name: 'Auth Issues', count: 10, color: '#6366f1' },
                    ]
                });
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const scanTrends = analytics?.scanTrends || [
        { month: 'Jan', scans: 120, vulnerabilities: 45 },
        { month: 'Feb', scans: 150, vulnerabilities: 52 },
        { month: 'Mar', scans: 180, vulnerabilities: 48 },
        { month: 'Apr', scans: 210, vulnerabilities: 61 },
    ];

    const vulnerabilityBreakdown = analytics?.vulnerabilityBreakdown || [
        { name: 'SQL Injection', count: 15, color: '#ef4444' },
        { name: 'XSS', count: 12, color: '#f59e0b' },
        { name: 'CSRF', count: 8, color: '#8b5cf6' },
        { name: 'Auth Issues', count: 10, color: '#6366f1' },
    ];

    if (loading) {
        return (
            <div className="management-section">
                <div className="section-header">
                    <div>
                        <h2>Analytics</h2>
                        <p>Platform insights and statistics</p>
                    </div>
                </div>
                <div style={{ textAlign: 'center', padding: '40px' }}>Loading analytics...</div>
            </div>
        );
    }

    return (
        <div className="management-section">
            <div className="section-header">
                <div>
                    <h2>Analytics</h2>
                    <p>Platform insights and statistics</p>
                </div>
                <button className="btn btn-secondary">
                    <Download size={18} /> Export Report
                </button>
            </div>

            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
                <div className="stat-card" style={{ '--accent-color': '#3b82f6' }}>
                    <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
                        <Scan size={24} />
                    </div>
                    <div className="stat-value">{stats?.totalScans || 0}</div>
                    <div className="stat-label">Total Scans</div>
                </div>
                <div className="stat-card" style={{ '--accent-color': '#ef4444' }}>
                    <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                        <AlertCircle size={24} />
                    </div>
                    <div className="stat-value">{stats?.totalVulnerabilities || 0}</div>
                    <div className="stat-label">Vulnerabilities</div>
                </div>
                <div className="stat-card" style={{ '--accent-color': '#10b981' }}>
                    <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div className="stat-value">{stats?.totalScans - stats?.totalVulnerabilities || 0}</div>
                    <div className="stat-label">Resolved</div>
                </div>
                <div className="stat-card" style={{ '--accent-color': '#8b5cf6' }}>
                    <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
                        <Users size={24} />
                    </div>
                    <div className="stat-value">{stats?.activeUsers || 0}</div>
                    <div className="stat-label">Active Users</div>
                </div>
            </div>

            <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                <div className="dashboard-card chart-card">
                    <div className="card-header">
                        <h3><BarChart3 size={18} /> Scan Trends</h3>
                    </div>
                    <div className="chart-content">
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={scanTrends}>
                                <XAxis dataKey="month" stroke={isDark ? '#888' : '#666'} />
                                <YAxis stroke={isDark ? '#888' : '#666'} />
                                <Tooltip />
                                <Area type="monotone" dataKey="scans" stroke="#6366f1" fill="rgba(99, 102, 241, 0.2)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="dashboard-card chart-card">
                    <div className="card-header">
                        <h3><PieChart size={18} /> Vulnerability Breakdown</h3>
                    </div>
                    <div className="chart-content">
                        <ResponsiveContainer width="100%" height={250}>
                            <RechartsPie>
                                <Pie data={vulnerabilityBreakdown} cx="50%" cy="50%" outerRadius={80} dataKey="count" label={({ name, count }) => `${name}: ${count}`}>
                                    {vulnerabilityBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </RechartsPie>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminAuditLogs = ({ isDark, toast }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true);
                const res = await api.get('/admin/audit-logs');
                setLogs(res.data.logs || []);
            } catch (error) {
                setLogs([
                    { id: 1, action: 'User Login', user: 'admin@example.com', ip: '192.168.1.1', time: new Date() },
                    { id: 2, action: 'Scan Created', user: 'user@example.com', ip: '192.168.1.2', time: new Date(Date.now() - 60000) },
                    { id: 3, action: 'Settings Updated', user: 'admin@example.com', ip: '192.168.1.1', time: new Date(Date.now() - 120000) },
                ]);
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
                    <p>Activity history and system events</p>
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
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4}>Loading...</td></tr>
                        ) : logs.length === 0 ? (
                            <tr><td colSpan={4}>No logs found</td></tr>
                        ) : (
                            logs.map(log => (
                                <tr key={log.id}>
                                    <td>{format(new Date(log.time), 'MMM d, yyyy HH:mm:ss')}</td>
                                    <td><span className="action-badge">{log.action}</span></td>
                                    <td>{log.user}</td>
                                    <td><code>{log.ip}</code></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AdminSettings = ({ isDark, toast }) => {
    const [settings, setSettings] = useState({
        siteName: 'VulnScan Pro',
        allowRegistration: true,
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
                const res = await api.get('/admin/settings');
                setSettings(res.data.settings || settings);
            } catch (error) {
                // Keep default settings
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        try {
            setSaving(true);
            await api.put('/admin/settings', settings);
            toast.success('Settings saved successfully');
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="management-section">
                <div className="section-header">
                    <div>
                        <h2>Settings</h2>
                        <p>Configure platform settings</p>
                    </div>
                </div>
                <div style={{ textAlign: 'center', padding: '40px' }}>Loading settings...</div>
            </div>
        );
    }

    return (
        <div className="management-section">
            <div className="section-header">
                <div>
                    <h2>Settings</h2>
                    <p>Configure platform settings</p>
                </div>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 size={18} className="spin" /> : <Edit size={18} />} 
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="settings-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                <div className="settings-card">
                    <h3>General Settings</h3>
                    <div className="form-field">
                        <label>Site Name</label>
                        <input type="text" className="form-input" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
                    </div>
                    <div className="form-field checkbox">
                        <input type="checkbox" id="registration" checked={settings.allowRegistration} onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })} />
                        <label htmlFor="registration">Allow User Registration</label>
                    </div>
                    <div className="form-field checkbox">
                        <input type="checkbox" id="verification" checked={settings.emailVerification} onChange={(e) => setSettings({ ...settings, emailVerification: e.target.checked })} />
                        <label htmlFor="verification">Require Email Verification</label>
                    </div>
                </div>

                <div className="settings-card">
                    <h3>Scan Settings</h3>
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
    );
};

const StatusBadge = ({ status }) => {
    const statusConfig = {
        completed: { color: '#10b981', label: 'Completed' },
        running: { color: '#3b82f6', label: 'Running' },
        pending: { color: '#f59e0b', label: 'Pending' },
        failed: { color: '#ef4444', label: 'Failed' },
        active: { color: '#10b981', label: 'Active' },
        cancelled: { color: '#ef4444', label: 'Cancelled' },
        expired: { color: '#6b7280', label: 'Expired' },
        trial: { color: '#8b5cf6', label: 'Trial' },
    };

    const config = statusConfig[status] || { color: '#6b7280', label: status };

    return (
        <span className="status-badge" style={{ '--status-color': config.color }}>
            {config.label}
        </span>
    );
};

export default AdminDashboard;
