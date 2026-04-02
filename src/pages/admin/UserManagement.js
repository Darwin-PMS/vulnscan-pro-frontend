import React, { useState, useEffect } from 'react';
import { 
    Users, Search, Filter, Plus, Edit, Trash2, 
    Shield, Crown, Key, Mail, MoreVertical,
    Check, X, ChevronDown, RefreshCw, UserX, UserCheck
} from 'lucide-react';
import api from '../../services/api';
import { Button, Card, Input, Modal, Badge } from '../../components/ui';
import { PageContainer } from '../../components/layout';
import { useToast } from '../../contexts/ToastContext';
import './UserManagement.css';

const ROLES = [
    { id: 'admin', name: 'Admin', color: '#7c3aed' },
    { id: 'supervisor', name: 'Supervisor', color: '#2563eb' },
    { id: 'analyst', name: 'Analyst', color: '#16a34a' },
    { id: 'member', name: 'Member', color: '#ca8a04' },
    { id: 'client', name: 'Client', color: '#64748b' },
    { id: 'billing', name: 'Billing', color: '#0891b2' },
];

const UserManagement = () => {
    const toast = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editForm, setEditForm] = useState({ role: '', isActive: true });
    const [inviteForm, setInviteForm] = useState({ email: '', role: 'member', message: '' });

    useEffect(() => {
        loadUsers();
    }, [roleFilter, statusFilter]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const params = {};
            if (roleFilter) params.role = roleFilter;
            if (statusFilter) params.status = statusFilter;
            
            const response = await api.get('/admin/users', { params });
            setUsers(response.data.users || []);
        } catch (error) {
            console.error('Failed to load users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setEditForm({ role: user.role, isActive: user.is_active !== false });
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        try {
            await api.put(`/admin/users/${selectedUser.id}`, {
                role: editForm.role,
                isActive: editForm.isActive
            });
            toast.success('User updated successfully');
            setShowEditModal(false);
            loadUsers();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update user');
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to remove this user?')) return;
        
        try {
            await api.delete(`/admin/users/${userId}`);
            toast.success('User removed successfully');
            loadUsers();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to remove user');
        }
    };

    const handleToggleActive = async (user) => {
        try {
            await api.put(`/admin/users/${user.id}`, {
                isActive: !user.is_active
            });
            toast.success(user.is_active ? 'User suspended' : 'User activated');
            loadUsers();
        } catch (error) {
            toast.error('Failed to update user status');
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        
        try {
            await api.post('/admin/users/invite', inviteForm);
            toast.success('Invitation sent');
            setShowInviteModal(false);
            setInviteForm({ email: '', role: 'member', message: '' });
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to send invitation');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = !searchQuery || 
            user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const getRoleBadge = (role) => {
        const roleConfig = ROLES.find(r => r.id === role);
        return (
            <Badge style={{ '--badge-color': roleConfig?.color || '#64748b' }}>
                {roleConfig?.name || role}
            </Badge>
        );
    };

    return (
        <PageContainer title="User Management" subtitle="Manage team members and roles">
            <div className="user-management">
                <Card className="users-header">
                    <div className="header-left">
                        <h2><Users size={20} /> Team Members</h2>
                        <p>{users.length} total members</p>
                    </div>
                    <div className="header-actions">
                        <Button
                            variant="secondary"
                            leftIcon={<RefreshCw size={16} />}
                            onClick={loadUsers}
                        >
                            Refresh
                        </Button>
                        <Button
                            leftIcon={<Plus size={16} />}
                            onClick={() => setShowInviteModal(true)}
                        >
                            Invite User
                        </Button>
                    </div>
                </Card>

                <Card className="users-filters">
                    <div className="filters-row">
                        <div className="search-input">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Roles</option>
                            {ROLES.map(role => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </Card>

                <Card className="users-table-card">
                    {loading ? (
                        <div className="loading-state">
                            <RefreshCw className="animate-spin" size={24} />
                            <p>Loading users...</p>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="empty-state">
                            <Users size={48} />
                            <h3>No users found</h3>
                            <p>Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Last Active</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className={user.is_active === false ? 'inactive' : ''}>
                                        <td>
                                            <div className="user-cell">
                                                <div className="user-avatar">
                                                    {user.username?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <div className="user-info">
                                                    <span className="user-name">{user.username}</span>
                                                    <span className="user-email">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{getRoleBadge(user.role)}</td>
                                        <td>
                                            <span className={`status-indicator ${user.is_active !== false ? 'active' : 'inactive'}`}>
                                                {user.is_active !== false ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="last-active">
                                                {user.last_active_at 
                                                    ? new Date(user.last_active_at).toLocaleDateString()
                                                    : 'Never'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="action-btn"
                                                    onClick={() => handleEdit(user)}
                                                    title="Edit user"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    className="action-btn"
                                                    onClick={() => handleToggleActive(user)}
                                                    title={user.is_active !== false ? 'Suspend user' : 'Activate user'}
                                                >
                                                    {user.is_active !== false ? <UserX size={16} /> : <UserCheck size={16} />}
                                                </button>
                                                <button
                                                    className="action-btn danger"
                                                    onClick={() => handleDelete(user.id)}
                                                    title="Remove user"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </Card>
            </div>

            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit User"
            >
                {selectedUser && (
                    <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="edit-user-form">
                        <div className="form-info">
                            <div className="user-avatar large">
                                {selectedUser.username?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div>
                                <h3>{selectedUser.username}</h3>
                                <p>{selectedUser.email}</p>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Role</label>
                            <select
                                value={editForm.role}
                                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                className="form-select"
                            >
                                {ROLES.map(role => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                            </select>
                            <span className="form-hint">
                                Changing role will affect user's permissions immediately
                            </span>
                        </div>

                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={editForm.isActive}
                                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                                />
                                <span>User is active</span>
                            </label>
                            <span className="form-hint">
                                Inactive users cannot log in but their data is preserved
                            </span>
                        </div>

                        <div className="form-actions">
                            <Button variant="secondary" type="button" onClick={() => setShowEditModal(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Save Changes
                            </Button>
                        </div>
                    </form>
                )}
            </Modal>

            <Modal
                isOpen={showInviteModal}
                onClose={() => setShowInviteModal(false)}
                title="Invite Team Member"
            >
                <form onSubmit={handleInvite} className="invite-form">
                    <div className="form-group">
                        <label>Email Address *</label>
                        <Input
                            type="email"
                            value={inviteForm.email}
                            onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                            placeholder="colleague@company.com"
                            icon={<Mail size={18} />}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Role</label>
                        <select
                            value={inviteForm.role}
                            onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                            className="form-select"
                        >
                            {ROLES.map(role => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                        <span className="form-hint">
                            Select the appropriate role for this user
                        </span>
                    </div>

                    <div className="form-group">
                        <label>Personal Message (Optional)</label>
                        <textarea
                            value={inviteForm.message}
                            onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })}
                            placeholder="Add a personal message to the invitation..."
                            rows={3}
                        />
                    </div>

                    <div className="form-actions">
                        <Button variant="secondary" type="button" onClick={() => setShowInviteModal(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" leftIcon={<Mail size={16} />}>
                            Send Invitation
                        </Button>
                    </div>
                </form>
            </Modal>
        </PageContainer>
    );
};

export default UserManagement;
