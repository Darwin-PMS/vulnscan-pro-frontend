import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Users, CreditCard, Scan, Shield, Activity, TrendingUp,
    Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight,
    UserCheck, UserX, Crown, AlertCircle, CheckCircle, XCircle
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

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
            console.error('Error fetching admin stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container page-header">
                <div className="empty-state">
                    <div className="spinner" style={{ margin: '0 auto 24px' }}></div>
                    <p>Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="container page-header">
                <h1>Admin Dashboard</h1>
                <p>Manage users, subscriptions, and system settings</p>
            </div>

            <div className="container">
                {/* Admin Navigation */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                    <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<Activity size={18} />} label="Dashboard" />
                    <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={18} />} label="Users" />
                    <TabButton active={activeTab === 'subscriptions'} onClick={() => setActiveTab('subscriptions')} icon={<CreditCard size={18} />} label="Subscriptions" />
                    <TabButton active={activeTab === 'tiers'} onClick={() => setActiveTab('tiers')} icon={<Crown size={18} />} label="Pricing Tiers" />
                    <TabButton active={activeTab === 'scans'} onClick={() => setActiveTab('scans')} icon={<Scan size={18} />} label="Scans" />
                </div>

                {activeTab === 'dashboard' && <DashboardOverview stats={stats} />}
                {activeTab === 'users' && <UsersManagement onUpdate={fetchStats} />}
                {activeTab === 'subscriptions' && <SubscriptionsManagement />}
                {activeTab === 'tiers' && <PricingTiersManagement />}
                {activeTab === 'scans' && <ScansManagement />}
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: active ? 'var(--primary-color)' : 'transparent',
            color: active ? 'white' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '6px',
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

const DashboardOverview = ({ stats }) => (
    <div>
        {/* Stats Cards */}
        <div className="grid grid-4" style={{ marginBottom: '32px' }}>
            <StatCard icon={<Users size={24} />} value={stats?.totalUsers || 0} label="Total Users" color="#3b82f6" />
            <StatCard icon={<UserCheck size={24} />} value={stats?.activeUsers || 0} label="Active Users" color="#10b981" />
            <StatCard icon={<Scan size={24} />} value={stats?.totalScans || 0} label="Total Scans" color="#8b5cf6" />
            <StatCard icon={<AlertCircle size={24} />} value={stats?.totalVulnerabilities || 0} label="Vulnerabilities" color="#ef4444" />
        </div>

        {/* Subscription Distribution */}
        <div className="grid grid-2" style={{ marginBottom: '32px' }}>
            <div className="card">
                <h3 style={{ marginBottom: '20px' }}>Subscription Distribution</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {stats?.subscriptionsByTier?.map(tier => (
                        <div key={tier.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{tier.name}</span>
                            <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{tier.count}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '20px' }}>Recent Users</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {stats?.recentUsers?.map(user => (
                        <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: 500 }}>{user.username}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{user.email}</div>
                            </div>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Recent Scans */}
        <div className="card">
            <h3 style={{ marginBottom: '20px' }}>Recent Scans</h3>
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Target URL</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats?.recentScans?.map(scan => (
                            <tr key={scan.scan_id}>
                                <td>{scan.username || 'Anonymous'}</td>
                                <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{scan.target_url}</td>
                                <td>
                                    <StatusBadge status={scan.status} />
                                </td>
                                <td>{formatDistanceToNow(new Date(scan.created_at), { addSuffix: true })}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const UsersManagement = ({ onUpdate }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ username: '', email: '', password: '', fullName: '', role: 'user' });

    useEffect(() => {
        fetchUsers();
    }, [page, search]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/admin/users?page=${page}&limit=20&search=${search}`);
            setUsers(res.data.users);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            await api.post('/admin/users', formData);
            setShowModal(false);
            setFormData({ username: '', email: '', password: '', fullName: '', role: 'user' });
            fetchUsers();
            onUpdate();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to create user');
        }
    };

    const handleUpdate = async () => {
        try {
            await api.put(`/admin/users/${editingUser.id}`, formData);
            setShowModal(false);
            setEditingUser(null);
            setFormData({ username: '', email: '', password: '', fullName: '', role: 'user' });
            fetchUsers();
            onUpdate();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to update user');
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/admin/users/${userId}`);
            fetchUsers();
            onUpdate();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to delete user');
        }
    };

    const handleToggleActive = async (user) => {
        try {
            await api.put(`/admin/users/${user.id}`, { isActive: !user.is_active });
            fetchUsers();
            onUpdate();
        } catch (error) {
            alert('Failed to update user status');
        }
    };

    const handleToggleRole = async (user) => {
        try {
            await api.put(`/admin/users/${user.id}`, { role: user.role === 'admin' ? 'user' : 'admin' });
            fetchUsers();
            onUpdate();
        } catch (error) {
            alert('Failed to update user role');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Search size={18} style={{ color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="input"
                        style={{ width: '300px' }}
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
                <button className="btn btn-primary" onClick={() => { setEditingUser(null); setShowModal(true); }}>
                    <Plus size={18} /> Add User
                </button>
            </div>

            <div className="card">
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Scans</th>
                                <th>Subscription</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <div style={{ fontWeight: 500 }}>{user.username}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{user.full_name}</div>
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
                                    <td>{user.scans_count}</td>
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
                                            <button className="btn-icon" onClick={() => { setEditingUser(user); setFormData({ username: user.username, email: user.email, password: '', fullName: user.full_name || '', role: user.role }); setShowModal(true); }}>
                                                <Edit size={16} />
                                            </button>
                                            <button className="btn-icon" onClick={() => handleToggleActive(user)} title={user.is_active ? 'Deactivate' : 'Activate'}>
                                                {user.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
                                            </button>
                                            <button className="btn-icon" onClick={() => handleToggleRole(user)} title="Toggle Admin">
                                                <Crown size={16} />
                                            </button>
                                            <button className="btn-icon" onClick={() => handleDelete(user.id)} style={{ color: '#ef4444' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
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
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                            <div>
                                <label>Username</label>
                                <input type="text" className="input" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
                            </div>
                            <div>
                                <label>Email</label>
                                <input type="email" className="input" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div>
                                <label>Password {editingUser && '(leave blank to keep current)'}</label>
                                <input type="password" className="input" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                            <div>
                                <label>Full Name</label>
                                <input type="text" className="input" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                            </div>
                            <div>
                                <label>Role</label>
                                <select className="input" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={editingUser ? handleUpdate : handleCreate}>
                                    {editingUser ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SubscriptionsManagement = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchSubscriptions();
    }, [page]);

    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/admin/subscriptions?page=${page}&limit=20`);
            setSubscriptions(res.data.subscriptions);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (subId, status) => {
        try {
            await api.put(`/admin/subscriptions/${subId}`, { status });
            fetchSubscriptions();
        } catch (error) {
            alert('Failed to update subscription');
        }
    };

    return (
        <div>
            <div className="card">
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Tier</th>
                                <th>Billing</th>
                                <th>Status</th>
                                <th>Scans Used</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscriptions.map(sub => (
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
                                        >
                                            <option value="active">Active</option>
                                            <option value="cancelled">Cancelled</option>
                                            <option value="expired">Expired</option>
                                            <option value="trial">Trial</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

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
            </div>
        </div>
    );
};

const PricingTiersManagement = () => {
    const [tiers, setTiers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTiers();
    }, []);

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

    return (
        <div>
            <div className="grid grid-4">
                {tiers.map(tier => (
                    <div key={tier.tier_id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3>{tier.name}</h3>
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
                        <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
                            ${parseFloat(tier.price_monthly).toFixed(2)}<span style={{ fontSize: '14px', fontWeight: 'normal', color: 'var(--text-secondary)' }}>/mo</span>
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                            ${parseFloat(tier.price_yearly).toFixed(2)}/year
                        </div>
                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>Subscribers</span>
                                <strong>{tier.subscriberCount}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>Scan Limit</span>
                                <strong>{tier.scan_limit_monthly === -1 ? 'Unlimited' : tier.scan_limit_monthly}/mo</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Concurrent Scans</span>
                                <strong>{tier.concurrent_scans}</strong>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ScansManagement = () => {
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchScans();
    }, [page, search]);

    const fetchScans = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/admin/scans?page=${page}&limit=20&search=${search}`);
            setScans(res.data.scans);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Error fetching scans:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (scanId) => {
        if (!window.confirm('Are you sure you want to delete this scan?')) return;
        try {
            await api.delete(`/admin/scans/${scanId}`);
            fetchScans();
        } catch (error) {
            alert('Failed to delete scan');
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
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
            </div>

            <div className="card">
                <div className="table-container">
                    <table className="table">
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
                            {scans.map(scan => (
                                <tr key={scan.scan_id}>
                                    <td>{scan.username || 'Anonymous'}</td>
                                    <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{scan.target_url}</td>
                                    <td><StatusBadge status={scan.status} /></td>
                                    <td>{scan.total_vulnerabilities || 0}</td>
                                    <td>{formatDistanceToNow(new Date(scan.created_at), { addSuffix: true })}</td>
                                    <td>
                                        <button className="btn-icon" onClick={() => handleDelete(scan.scan_id)} style={{ color: '#ef4444' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

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
            </div>
        </div>
    );
};

const StatCard = ({ icon, value, label, color }) => (
    <div className="card stat-card">
        <div className="stat-card-icon" style={{ background: `${color}20`, color }}>
            {icon}
        </div>
        <div className="stat-card-value">{value}</div>
        <div className="stat-card-label">{label}</div>
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
