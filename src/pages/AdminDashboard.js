import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Users, CreditCard, Scan, Activity, 
    Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight,
    UserCheck, UserX, Crown, AlertCircle, CheckCircle, XCircle, Sun, Moon,
    ChevronDown, Loader2, Users2, FileSearch2, Building2, Shield, BarChart3
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { formatDistanceToNow } from 'date-fns';
import { useDebounce, useFormValidation } from '../hooks/useAdmin';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const theme = isDark ? {
        bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        bgCard: 'rgba(255,255,255,0.05)',
        border: 'rgba(255,255,255,0.1)',
        text: '#f1f5f9',
        textSecondary: '#94a3b8',
        codeBg: 'rgba(0,0,0,0.4)',
    } : {
        bg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        bgCard: '#ffffff',
        border: 'rgba(0,0,0,0.08)',
        text: '#0f172a',
        textSecondary: '#475569',
        codeBg: 'rgba(15, 23, 42, 0.05)',
    };

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
            toast.error('Failed to load dashboard stats');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingScreen theme={theme} />;
    }

    return (
        <div style={{ minHeight: '100vh', background: theme.bg }}>
            <div style={{ background: theme.bgCard, borderBottom: `1px solid ${theme.border}`, padding: '24px 0' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: '700', color: theme.text, marginBottom: '4px' }}>Admin Dashboard</h1>
                        <p style={{ color: theme.textSecondary }}>Manage users, subscriptions, and system settings</p>
                    </div>
                    <button 
                        onClick={toggleTheme} 
                        style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '12px', cursor: 'pointer', display: 'flex' }}
                        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {isDark ? <Sun size={20} style={{ color: '#fbbf24' }} /> : <Moon size={20} style={{ color: '#6366f1' }} />}
                    </button>
                </div>
            </div>

            <div className="container" style={{ padding: '24px 0' }}>
                <nav style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: `1px solid ${theme.border}`, paddingBottom: '16px', flexWrap: 'wrap' }} role="tablist" aria-label="Admin sections">
                    <TabButton theme={theme} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<Activity size={18} />} label="Dashboard" />
                    <TabButton theme={theme} active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={18} />} label="Users" />
                    <TabButton theme={theme} active={activeTab === 'subscriptions'} onClick={() => setActiveTab('subscriptions')} icon={<CreditCard size={18} />} label="Subscriptions" />
                    <TabButton theme={theme} active={activeTab === 'tiers'} onClick={() => setActiveTab('tiers')} icon={<Crown size={18} />} label="Pricing Tiers" />
                    <TabButton theme={theme} active={activeTab === 'scans'} onClick={() => setActiveTab('scans')} icon={<Scan size={18} />} label="Scans" />
                </nav>

                {activeTab === 'dashboard' && <DashboardOverview stats={stats} theme={theme} />}
                {activeTab === 'users' && <UsersManagement onUpdate={fetchStats} theme={theme} toast={toast} />}
                {activeTab === 'subscriptions' && <SubscriptionsManagement theme={theme} toast={toast} />}
                {activeTab === 'tiers' && <PricingTiersManagement theme={theme} />}
                {activeTab === 'scans' && <ScansManagement theme={theme} toast={toast} />}
            </div>
        </div>
    );
};

const LoadingScreen = ({ theme }) => (
    <div style={{ minHeight: '100vh', background: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
            <Loader2 size={48} style={{ color: '#6366f1', animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: theme.textSecondary, marginTop: '16px' }}>Loading admin dashboard...</p>
        </div>
    </div>
);

const TabButton = ({ theme, active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        role="tab"
        aria-selected={active}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: active ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
            color: active ? 'white' : theme.textSecondary,
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'all 0.2s'
        }}
    >
        {icon}
        {label}
    </button>
);

const DashboardOverview = ({ stats, theme }) => (
    <div>
        <div className="grid grid-4" style={{ marginBottom: '32px' }}>
            <StatCard theme={theme} icon={<Users2 size={24} />} value={stats?.totalUsers || 0} label="Total Users" color="#3b82f6" />
            <StatCard theme={theme} icon={<UserCheck size={24} />} value={stats?.activeUsers || 0} label="Active Users" color="#10b981" />
            <StatCard theme={theme} icon={<Scan size={24} />} value={stats?.totalScans || 0} label="Total Scans" color="#8b5cf6" />
            <StatCard theme={theme} icon={<AlertCircle size={24} />} value={stats?.totalVulnerabilities || 0} label="Vulnerabilities" color="#ef4444" />
        </div>

        <div className="grid grid-2" style={{ marginBottom: '32px' }}>
            <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '20px' }}>
                <h3 style={{ marginBottom: '20px', color: theme.text }}>Subscription Distribution</h3>
                {stats?.subscriptionsByTier?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {stats.subscriptionsByTier.map(tier => (
                            <div key={tier.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: theme.text }}>
                                <span>{tier.name}</span>
                                <span style={{ fontWeight: 600, color: '#6366f1' }}>{tier.count}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState message="No subscription data available" theme={theme} />
                )}
            </div>

            <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '20px' }}>
                <h3 style={{ marginBottom: '20px', color: theme.text }}>Recent Users</h3>
                {stats?.recentUsers?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {stats.recentUsers.map(user => (
                            <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 500, color: theme.text }}>{user.username}</div>
                                    <div style={{ fontSize: '12px', color: theme.textSecondary }}>{user.email}</div>
                                </div>
                                <span style={{ fontSize: '12px', color: theme.textSecondary }}>
                                    {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState message="No recent users" theme={theme} />
                )}
            </div>
        </div>

        <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '20px' }}>
            <h3 style={{ marginBottom: '20px', color: theme.text }}>Recent Scans</h3>
            {stats?.recentScans?.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '12px', borderBottom: `1px solid ${theme.border}`, color: theme.textSecondary, fontSize: '13px' }}>User</th>
                                <th style={{ textAlign: 'left', padding: '12px', borderBottom: `1px solid ${theme.border}`, color: theme.textSecondary, fontSize: '13px' }}>Target URL</th>
                                <th style={{ textAlign: 'left', padding: '12px', borderBottom: `1px solid ${theme.border}`, color: theme.textSecondary, fontSize: '13px' }}>Status</th>
                                <th style={{ textAlign: 'left', padding: '12px', borderBottom: `1px solid ${theme.border}`, color: theme.textSecondary, fontSize: '13px' }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentScans.map(scan => (
                                <tr key={scan.scan_id}>
                                    <td style={{ padding: '12px', borderBottom: `1px solid ${theme.border}`, color: theme.text }}>{scan.username || 'Anonymous'}</td>
                                    <td style={{ padding: '12px', borderBottom: `1px solid ${theme.border}`, color: theme.text, maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{scan.target_url}</td>
                                    <td style={{ padding: '12px', borderBottom: `1px solid ${theme.border}` }}>
                                        <StatusBadge status={scan.status} />
                                    </td>
                                    <td style={{ padding: '12px', borderBottom: `1px solid ${theme.border}`, color: theme.textSecondary, fontSize: '13px' }}>{formatDistanceToNow(new Date(scan.created_at), { addSuffix: true })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <EmptyState message="No recent scans" theme={theme} />
            )}
        </div>
    </div>
);

const EmptyState = ({ message, theme, icon: Icon }) => (
    <div style={{ textAlign: 'center', padding: '32px', color: theme.textSecondary }}>
        {Icon && <Icon size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />}
        <p>{message}</p>
    </div>
);

const LoadingRow = ({ cols, theme }) => (
    <tr>
        {Array.from({ length: cols }).map((_, i) => (
            <td key={i} style={{ padding: '12px', borderBottom: `1px solid ${theme.border}` }}>
                <div style={{ 
                    height: '16px', 
                    background: theme.border, 
                    borderRadius: '4px',
                    animation: 'pulse 1.5s infinite'
                }} />
            </td>
        ))}
    </tr>
);

const UsersManagement = ({ onUpdate, theme, toast }) => {
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

    const { values, errors, handleChange, handleBlur, reset, validateAll, setValues } = useFormValidation(
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
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Search size={18} style={{ color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        className="input"
                        style={{ width: '300px' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        aria-label="Search users"
                    />
                </div>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <Plus size={18} /> Add User
                </button>
            </div>

            <div className="card">
                <div className="table-container">
                    <table className="table" role="table" aria-label="Users table">
                        <thead>
                            <tr>
                                <th scope="col">User</th>
                                <th scope="col">Email</th>
                                <th scope="col">Role</th>
                                <th scope="col">Status</th>
                                <th scope="col">Scans</th>
                                <th scope="col">Subscription</th>
                                <th scope="col">Joined</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <>
                                    <LoadingRow cols={8} theme={theme} />
                                    <LoadingRow cols={8} theme={theme} />
                                    <LoadingRow cols={8} theme={theme} />
                                </>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: theme.textSecondary }}>
                                        <Users2 size={48} style={{ opacity: 0.3, marginBottom: '8px' }} />
                                        <p>No users found</p>
                                        {search && <p style={{ fontSize: '13px' }}>Try adjusting your search criteria</p>}
                                    </td>
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id}>
                                        <td>
                                            <div style={{ fontWeight: 500 }}>{user.username}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{user.full_name || 'No name'}</div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                background: user.role === 'admin' ? '#fef3c7' : '#e0e7ff',
                                                color: user.role === 'admin' ? '#d97706' : '#4f46e5'
                                            }}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            {user.is_active ? (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981' }}>
                                                    <CheckCircle size={16} /> Active
                                                </span>
                                            ) : (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444' }}>
                                                    <XCircle size={16} /> Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td>{user.scans_count || 0}</td>
                                        <td>
                                            {user.subscription ? (
                                                <span style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    background: '#dcfce7',
                                                    color: '#166534'
                                                }}>
                                                    {user.subscription.tier_name}
                                                </span>
                                            ) : (
                                                <span style={{ color: 'var(--text-secondary)' }}>Free</span>
                                            )}
                                        </td>
                                        <td>{formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button 
                                                    className="btn-icon" 
                                                    onClick={() => openModal(user)}
                                                    aria-label={`Edit ${user.username}`}
                                                    disabled={actionLoading === user.id}
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button 
                                                    className="btn-icon" 
                                                    onClick={() => handleToggleActive(user)}
                                                    title={user.is_active ? 'Deactivate' : 'Activate'}
                                                    aria-label={user.is_active ? `Deactivate ${user.username}` : `Activate ${user.username}`}
                                                    disabled={actionLoading === user.id}
                                                >
                                                    {user.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
                                                </button>
                                                <button 
                                                    className="btn-icon" 
                                                    onClick={() => handleToggleRole(user)}
                                                    title="Toggle Admin"
                                                    aria-label={`Toggle admin role for ${user.username}`}
                                                    disabled={actionLoading === user.id}
                                                >
                                                    <Crown size={16} />
                                                </button>
                                                <button 
                                                    className="btn-icon" 
                                                    onClick={() => handleDelete(user.id)}
                                                    style={{ color: '#ef4444' }}
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                            Page {page} of {totalPages}
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                                className="btn btn-secondary" 
                                disabled={page === 1} 
                                onClick={() => setPage(p => p - 1)}
                                aria-label="Previous page"
                            >
                                <ChevronLeft size={16} /> Previous
                            </button>
                            <button 
                                className="btn btn-secondary" 
                                disabled={page === totalPages} 
                                onClick={() => setPage(p => p + 1)}
                                aria-label="Next page"
                            >
                                Next <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={closeModal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3 id="modal-title">{editingUser ? 'Edit User' : 'Add New User'}</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                            <FormField 
                                label="Username" 
                                name="username" 
                                value={values.username} 
                                onChange={handleChange} 
                                onBlur={handleBlur}
                                error={errors.username}
                                required
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
                            />
                            <FormField 
                                label="Full Name" 
                                name="fullName" 
                                value={values.fullName} 
                                onChange={handleChange}
                            />
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', color: theme.text }}>Role</label>
                                <select 
                                    name="role" 
                                    className="input" 
                                    value={values.role} 
                                    onChange={handleChange}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary">
                                    {editingUser ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const FormField = ({ label, name, type = 'text', value, onChange, onBlur, error, required }) => {
    const { isDark } = useTheme();
    const theme = isDark ? { text: '#f1f5f9', textSecondary: '#94a3b8', border: 'rgba(255,255,255,0.1)', bgCard: 'rgba(255,255,255,0.05)' } : { text: '#0f172a', textSecondary: '#475569', border: 'rgba(0,0,0,0.08)', bgCard: '#ffffff' };
    
    return (
        <div>
            <label style={{ display: 'block', marginBottom: '6px', color: theme.text }}>
                {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
            </label>
            <input
                type={type}
                name={name}
                className="input"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                style={{ 
                    width: '100%',
                    borderColor: error ? '#ef4444' : theme.border
                }}
                aria-invalid={!!error}
                aria-describedby={error ? `${name}-error` : undefined}
            />
            {error && (
                <p id={`${name}-error`} style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                    {error}
                </p>
            )}
        </div>
    );
};

const SubscriptionsManagement = ({ theme, toast }) => {
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
        <div>
            <div className="card">
                <div className="table-container">
                    <table className="table" role="table" aria-label="Subscriptions table">
                        <thead>
                            <tr>
                                <th scope="col">User</th>
                                <th scope="col">Tier</th>
                                <th scope="col">Billing</th>
                                <th scope="col">Status</th>
                                <th scope="col">Scans Used</th>
                                <th scope="col">Start Date</th>
                                <th scope="col">End Date</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <>
                                    <LoadingRow cols={8} theme={theme} />
                                    <LoadingRow cols={8} theme={theme} />
                                    <LoadingRow cols={8} theme={theme} />
                                </>
                            ) : subscriptions.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: theme.textSecondary }}>
                                        <CreditCard size={48} style={{ opacity: 0.3, marginBottom: '8px' }} />
                                        <p>No subscriptions found</p>
                                    </td>
                                </tr>
                            ) : (
                                subscriptions.map(sub => (
                                    <tr key={sub.id}>
                                        <td>
                                            <div style={{ fontWeight: 500 }}>{sub.username}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{sub.email}</div>
                                        </td>
                                        <td>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                background: sub.tier_id === 'enterprise' ? '#fef3c7' : 
                                                           sub.tier_id === 'professional' ? '#e0e7ff' : 
                                                           sub.tier_id === 'starter' ? '#dbeafe' : '#f3f4f6',
                                                color: sub.tier_id === 'enterprise' ? '#d97706' : 
                                                       sub.tier_id === 'professional' ? '#4f46e5' : 
                                                       sub.tier_id === 'starter' ? '#2563eb' : '#6b7280'
                                            }}>
                                                {sub.tier_name}
                                            </span>
                                        </td>
                                        <td>{sub.billing_cycle}</td>
                                        <td>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                background: sub.status === 'active' ? '#dcfce7' : 
                                                           sub.status === 'cancelled' ? '#fef2f2' : '#fef3c7',
                                                color: sub.status === 'active' ? '#166534' : 
                                                       sub.status === 'cancelled' ? '#dc2626' : '#d97706'
                                            }}>
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td>{sub.scans_used_this_month}</td>
                                        <td>{new Date(sub.start_date).toLocaleDateString()}</td>
                                        <td>{sub.end_date ? new Date(sub.end_date).toLocaleDateString() : 'N/A'}</td>
                                        <td>
                                            <select
                                                className="input"
                                                style={{ padding: '6px 12px', fontSize: '13px' }}
                                                value={sub.status}
                                                onChange={(e) => handleUpdateStatus(sub.id, e.target.value)}
                                                disabled={actionLoading === sub.id}
                                                aria-label={`Update status for ${sub.username}`}
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                            Page {page} of {totalPages}
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn btn-secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                                <ChevronLeft size={16} /> Previous
                            </button>
                            <button className="btn btn-secondary" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                                Next <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const PricingTiersManagement = ({ theme }) => {
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

    return (
        <div>
            {loading ? (
                <div className="grid grid-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '20px', height: '200px' }}>
                            <div style={{ height: '20px', background: theme.border, borderRadius: '4px', marginBottom: '16px', animation: 'pulse 1.5s infinite' }} />
                            <div style={{ height: '40px', background: theme.border, borderRadius: '4px', marginBottom: '8px', width: '60%', animation: 'pulse 1.5s infinite' }} />
                        </div>
                    ))}
                </div>
            ) : tiers.length === 0 ? (
                <EmptyState message="No pricing tiers available" theme={theme} icon={Crown} />
            ) : (
                <div className="grid grid-4">
                    {tiers.map(tier => (
                        <div key={tier.tier_id} style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ color: theme.text }}>{tier.name}</h3>
                                <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    background: tier.is_active ? '#dcfce7' : '#fef2f2',
                                    color: tier.is_active ? '#166534' : '#dc2626'
                                }}>
                                    {tier.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: theme.text }}>
                                ${parseFloat(tier.price_monthly).toFixed(2)}<span style={{ fontSize: '14px', fontWeight: 'normal', color: theme.textSecondary }}>/mo</span>
                            </div>
                            <div style={{ fontSize: '14px', color: theme.textSecondary, marginBottom: '16px' }}>
                                ${parseFloat(tier.price_yearly).toFixed(2)}/year
                            </div>
                            <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: theme.text }}>
                                    <span>Subscribers</span>
                                    <strong>{tier.subscriberCount}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: theme.text }}>
                                    <span>Scan Limit</span>
                                    <strong>{tier.scan_limit_monthly === -1 ? 'Unlimited' : tier.scan_limit_monthly}/mo</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: theme.text }}>
                                    <span>Concurrent Scans</span>
                                    <strong>{tier.concurrent_scans}</strong>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const ScansManagement = ({ theme, toast }) => {
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
        <div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
                <Search size={18} style={{ color: 'var(--text-secondary)' }} />
                <input
                    type="text"
                    placeholder="Search by URL or username..."
                    className="input"
                    style={{ width: '300px' }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search scans"
                />
            </div>

            <div className="card">
                <div className="table-container">
                    <table className="table" role="table" aria-label="Scans table">
                        <thead>
                            <tr>
                                <th scope="col">User</th>
                                <th scope="col">Target URL</th>
                                <th scope="col">Status</th>
                                <th scope="col">Vulnerabilities</th>
                                <th scope="col">Date</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <>
                                    <LoadingRow cols={6} theme={theme} />
                                    <LoadingRow cols={6} theme={theme} />
                                    <LoadingRow cols={6} theme={theme} />
                                </>
                            ) : scans.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '48px', color: theme.textSecondary }}>
                                        <FileSearch2 size={48} style={{ opacity: 0.3, marginBottom: '8px' }} />
                                        <p>No scans found</p>
                                        {search && <p style={{ fontSize: '13px' }}>Try adjusting your search criteria</p>}
                                    </td>
                                </tr>
                            ) : (
                                scans.map(scan => (
                                    <tr key={scan.scan_id}>
                                        <td>{scan.username || 'Anonymous'}</td>
                                        <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{scan.target_url}</td>
                                        <td><StatusBadge status={scan.status} /></td>
                                        <td>{scan.total_vulnerabilities || 0}</td>
                                        <td>{formatDistanceToNow(new Date(scan.created_at), { addSuffix: true })}</td>
                                        <td>
                                            <button 
                                                className="btn-icon" 
                                                onClick={() => handleDelete(scan.scan_id)}
                                                style={{ color: '#ef4444' }}
                                                aria-label={`Delete scan ${scan.scan_id}`}
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                            Page {page} of {totalPages}
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn btn-secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                                <ChevronLeft size={16} /> Previous
                            </button>
                            <button className="btn btn-secondary" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                                Next <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ theme, icon, value, label, color }) => (
    <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
        <div style={{ width: '48px', height: '48px', margin: '0 auto 12px', background: `${color}20`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color, marginBottom: '12px' }}>
            {icon}
        </div>
        <div style={{ fontSize: '28px', fontWeight: '700', color: theme.text }}>{value}</div>
        <div style={{ fontSize: '13px', color: theme.textSecondary }}>{label}</div>
    </div>
);

const StatusBadge = ({ status }) => {
    const colors = {
        completed: '#10b981',
        running: '#3b82f6',
        pending: '#f59e0b',
        failed: '#ef4444'
    };

    return (
        <span style={{
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            background: `${colors[status] || '#6b7280'}20`,
            color: colors[status] || '#6b7280'
        }}>
            {status}
        </span>
    );
};

export default AdminDashboard;
