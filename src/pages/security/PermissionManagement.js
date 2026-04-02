import React, { useState, useEffect } from 'react';
import { 
    Shield, Users, Key, Check, X, Search, Filter, 
    ChevronDown, ChevronRight, Edit, Trash2, Plus,
    AlertTriangle, Crown, RefreshCw, Save, RotateCcw
} from 'lucide-react';
import api from '../../services/api';
import { Button, Card, Input, Modal } from '../../components/ui';
import { PageContainer } from '../../components/layout';
import { useToast } from '../../contexts/ToastContext';
import './PermissionManagement.css';

const ROLES = [
    { id: 'super_admin', name: 'Super Admin', color: '#dc2626', icon: Crown },
    { id: 'admin', name: 'Admin', color: '#7c3aed', icon: Shield },
    { id: 'supervisor', name: 'Supervisor', color: '#2563eb', icon: Shield },
    { id: 'analyst', name: 'Analyst', color: '#16a34a', icon: Shield },
    { id: 'member', name: 'Member', color: '#ca8a04', icon: Shield },
    { id: 'client', name: 'Client', color: '#64748b', icon: Shield },
    { id: 'billing', name: 'Billing', color: '#0891b2', icon: Shield },
];

const PERMISSIONS = {
    dashboard: {
        name: 'Dashboard',
        icon: 'LayoutDashboard',
        permissions: [
            { id: 'dashboard:view_own', name: 'View own dashboard', description: 'View personal scan results' },
            { id: 'dashboard:view_team', name: 'View team dashboard', description: 'View team member activities' },
            { id: 'dashboard:view_all_tenants', name: 'View all tenants', description: 'Cross-tenant visibility' },
            { id: 'dashboard:customize', name: 'Customize dashboard', description: 'Modify dashboard layout' },
        ]
    },
    scans: {
        name: 'Scans',
        icon: 'Search',
        permissions: [
            { id: 'scan:create', name: 'Create scans', description: 'Start new vulnerability scans' },
            { id: 'scan:view_all', name: 'View all scans', description: 'See all team scans' },
            { id: 'scan:stop', name: 'Stop/Cancel scans', description: 'Cancel running scans' },
            { id: 'scan:pause', name: 'Pause/Resume scans', description: 'Pause and resume scans' },
            { id: 'scan:delete', name: 'Delete scans', description: 'Remove scan data' },
            { id: 'scan:retry', name: 'Retry failed scans', description: 'Retry failed scans' },
            { id: 'scan:schedule', name: 'Schedule scans', description: 'Create scan schedules' },
        ]
    },
    findings: {
        name: 'Findings',
        icon: 'AlertTriangle',
        permissions: [
            { id: 'finding:view', name: 'View findings', description: 'View vulnerability findings' },
            { id: 'finding:triage', name: 'Triage findings', description: 'Change finding status' },
            { id: 'finding:false_positive', name: 'Mark false positive', description: 'Mark as false positive' },
            { id: 'finding:suppress', name: 'Suppress findings', description: 'Hide from reports' },
            { id: 'finding:assign', name: 'Assign remediation', description: 'Assign fixes to users' },
            { id: 'finding:risk_accept', name: 'Accept risk', description: 'Accept residual risk' },
        ]
    },
    reports: {
        name: 'Reports',
        icon: 'FileText',
        permissions: [
            { id: 'report:generate', name: 'Generate reports', description: 'Create new reports' },
            { id: 'report:download', name: 'Download reports', description: 'Export PDF/CSV' },
            { id: 'report:white_label', name: 'White-label reports', description: 'Custom branding' },
            { id: 'report:schedule', name: 'Schedule reports', description: 'Auto-generate reports' },
        ]
    },
    users: {
        name: 'User Management',
        icon: 'Users',
        permissions: [
            { id: 'user:invite', name: 'Invite users', description: 'Send team invitations' },
            { id: 'user:remove', name: 'Remove users', description: 'Remove team members' },
            { id: 'user:change_role', name: 'Change roles', description: 'Modify user roles' },
            { id: 'user:view_audit', name: 'View audit log', description: 'See activity logs' },
        ]
    },
    billing: {
        name: 'Billing',
        icon: 'DollarSign',
        permissions: [
            { id: 'billing:view', name: 'View billing', description: 'See subscription details' },
            { id: 'billing:modify', name: 'Modify plan', description: 'Change subscription tier' },
            { id: 'billing:cancel', name: 'Cancel subscription', description: 'End subscription' },
            { id: 'billing:invoice', name: 'Access invoices', description: 'View/download invoices' },
        ]
    },
    integrations: {
        name: 'Integrations',
        icon: 'Zap',
        permissions: [
            { id: 'integration:configure', name: 'Configure integrations', description: 'Setup webhooks/API' },
            { id: 'integration:webhook', name: 'Webhook setup', description: 'Manage webhooks' },
            { id: 'integration:oauth', name: 'OAuth apps', description: 'Create OAuth apps' },
        ]
    },
    api_keys: {
        name: 'API Keys',
        icon: 'Key',
        permissions: [
            { id: 'api_key:create', name: 'Create API keys', description: 'Generate new keys' },
            { id: 'api_key:revoke', name: 'Revoke keys', description: 'Delete existing keys' },
        ]
    },
    scanner: {
        name: 'Scanner Nodes',
        icon: 'Server',
        permissions: [
            { id: 'scanner:manage', name: 'Manage nodes', description: 'Configure scanner nodes' },
            { id: 'scanner:view_status', name: 'View status', description: 'Monitor node health' },
        ]
    },
    settings: {
        name: 'Settings',
        icon: 'Settings',
        permissions: [
            { id: 'settings:tenant', name: 'Tenant settings', description: 'Modify organization settings' },
            { id: 'settings:security', name: 'Security settings', description: 'Configure security options' },
            { id: 'settings:mfa_enforce', name: 'Enforce MFA', description: 'Require MFA for users' },
        ]
    },
    compliance: {
        name: 'Compliance',
        icon: 'ShieldCheck',
        permissions: [
            { id: 'compliance:view', name: 'View frameworks', description: 'See compliance status' },
            { id: 'compliance:export', name: 'Export evidence', description: 'Download compliance data' },
        ]
    },
    tenant: {
        name: 'Tenant Management',
        icon: 'Building',
        permissions: [
            { id: 'tenant:create', name: 'Create tenant', description: 'Create new organization' },
            { id: 'tenant:delete', name: 'Delete tenant', description: 'Remove organization' },
            { id: 'tenant:impersonate', name: 'Impersonate', description: 'Login as tenant user' },
            { id: 'tenant:export', name: 'Export data', description: 'Export all tenant data' },
        ]
    },
};

const DEFAULT_ROLE_PERMISSIONS = {
    super_admin: Object.keys(PERMISSIONS).flatMap(module => 
        PERMISSIONS[module].permissions.map(p => p.id)
    ),
    admin: [
        'dashboard:view_own', 'dashboard:view_team', 'dashboard:customize',
        'scan:create', 'scan:view_all', 'scan:stop', 'scan:delete', 'scan:retry', 'scan:schedule',
        'finding:view', 'finding:triage', 'finding:false_positive', 'finding:suppress', 'finding:assign', 'finding:risk_accept',
        'report:generate', 'report:download', 'report:white_label', 'report:schedule',
        'user:invite', 'user:remove', 'user:change_role', 'user:view_audit',
        'billing:view', 'billing:modify',
        'integration:configure', 'integration:webhook',
        'api_key:create', 'api_key:revoke',
        'scanner:view_status',
        'settings:tenant', 'settings:security', 'settings:mfa_enforce',
        'compliance:view', 'compliance:export',
        'tenant:export',
    ],
    supervisor: [
        'dashboard:view_own', 'dashboard:view_team', 'dashboard:customize',
        'scan:create', 'scan:view_all', 'scan:stop', 'scan:pause', 'scan:retry', 'scan:schedule',
        'finding:view', 'finding:triage', 'finding:false_positive', 'finding:assign',
        'report:generate', 'report:download',
        'user:invite', 'user:remove', 'user:view_audit',
        'integration:configure', 'integration:webhook',
        'api_key:create', 'api_key:revoke',
        'scanner:view_status',
        'compliance:view', 'compliance:export',
    ],
    analyst: [
        'dashboard:view_own', 'dashboard:view_team',
        'scan:create', 'scan:view_all', 'scan:stop', 'scan:retry',
        'finding:view', 'finding:triage', 'finding:false_positive', 'finding:assign',
        'report:generate', 'report:download',
        'compliance:view',
    ],
    member: [
        'dashboard:view_own',
        'scan:create',
        'finding:view',
        'report:generate', 'report:download',
    ],
    client: [
        'dashboard:view_own',
        'scan:create',
        'finding:view',
        'report:generate', 'report:download',
    ],
    billing: [
        'dashboard:view_own',
        'billing:view', 'billing:modify', 'billing:cancel', 'billing:invoice',
    ],
};

const PermissionManagement = () => {
    const toast = useToast();
    const [selectedRole, setSelectedRole] = useState(null);
    const [rolePermissions, setRolePermissions] = useState({});
    const [expandedModules, setExpandedModules] = useState(Object.keys(PERMISSIONS));
    const [hasChanges, setHasChanges] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadPermissions();
    }, []);

    const loadPermissions = async () => {
        try {
            const response = await api.get('/admin/permissions');
            if (response.data.permissions) {
                setRolePermissions(response.data.permissions);
            }
        } catch (error) {
            console.error('Failed to load permissions:', error);
            setRolePermissions(DEFAULT_ROLE_PERMISSIONS);
        }
    };

    const handleRoleSelect = (roleId) => {
        setSelectedRole(roleId);
        if (!rolePermissions[roleId]) {
            setRolePermissions({
                ...rolePermissions,
                [roleId]: DEFAULT_ROLE_PERMISSIONS[roleId] || []
            });
        }
        setHasChanges(false);
    };

    const togglePermission = (permissionId) => {
        if (!selectedRole) return;

        const currentPermissions = rolePermissions[selectedRole] || [];
        const newPermissions = currentPermissions.includes(permissionId)
            ? currentPermissions.filter(p => p !== permissionId)
            : [...currentPermissions, permissionId];

        setRolePermissions({
            ...rolePermissions,
            [selectedRole]: newPermissions
        });
        setHasChanges(true);
    };

    const toggleModule = (moduleId) => {
        setExpandedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(m => m !== moduleId)
                : [...prev, moduleId]
        );
    };

    const handleSave = async () => {
        if (!selectedRole) return;
        
        setSaving(true);
        try {
            await api.put(`/admin/permissions/${selectedRole}`, {
                permissions: rolePermissions[selectedRole]
            });
            toast.success('Permissions saved successfully');
            setHasChanges(false);
        } catch (error) {
            toast.error('Failed to save permissions');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        if (!selectedRole || !window.confirm('Reset to default permissions?')) return;
        
        setRolePermissions({
            ...rolePermissions,
            [selectedRole]: DEFAULT_ROLE_PERMISSIONS[selectedRole] || []
        });
        setHasChanges(true);
    };

    const grantAllInModule = (moduleId) => {
        if (!selectedRole) return;
        
        const modulePermissions = PERMISSIONS[moduleId].permissions.map(p => p.id);
        const currentPermissions = rolePermissions[selectedRole] || [];
        
        setRolePermissions({
            ...rolePermissions,
            [selectedRole]: [...new Set([...currentPermissions, ...modulePermissions])]
        });
        setHasChanges(true);
    };

    const revokeAllInModule = (moduleId) => {
        if (!selectedRole) return;
        
        const modulePermissions = PERMISSIONS[moduleId].permissions.map(p => p.id);
        const currentPermissions = rolePermissions[selectedRole] || [];
        
        setRolePermissions({
            ...rolePermissions,
            [selectedRole]: currentPermissions.filter(p => !modulePermissions.includes(p))
        });
        setHasChanges(true);
    };

    const hasPermission = (permissionId) => {
        if (!selectedRole) return false;
        return (rolePermissions[selectedRole] || []).includes(permissionId);
    };

    const getModulePermissionCount = (moduleId) => {
        if (!selectedRole) return { granted: 0, total: 0 };
        const modulePermissions = PERMISSIONS[moduleId].permissions.map(p => p.id);
        const granted = modulePermissions.filter(p => hasPermission(p)).length;
        return { granted, total: modulePermissions.length };
    };

    return (
        <PageContainer title="Permission Management" subtitle="Configure role-based access control">
            <div className="permission-management">
                <div className="permission-sidebar">
                    <Card className="roles-list">
                        <h3>Roles</h3>
                        <div className="roles-list-items">
                            {ROLES.map(role => {
                                const Icon = role.icon;
                                const isSelected = selectedRole === role.id;
                                const permissionCount = rolePermissions[role.id]?.length || 0;
                                const totalCount = Object.values(PERMISSIONS).flatMap(m => m.permissions).length;

                                return (
                                    <button
                                        key={role.id}
                                        className={`role-item ${isSelected ? 'selected' : ''}`}
                                        onClick={() => handleRoleSelect(role.id)}
                                        style={{ '--role-color': role.color }}
                                    >
                                        <div className="role-icon">
                                            <Icon size={18} />
                                        </div>
                                        <div className="role-info">
                                            <span className="role-name">{role.name}</span>
                                            <span className="role-count">{permissionCount}/{totalCount}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </Card>
                </div>

                <div className="permission-content">
                    {selectedRole ? (
                        <>
                            <Card className="permission-header">
                                <div className="header-info">
                                    <h2>
                                        <Shield size={24} style={{ color: ROLES.find(r => r.id === selectedRole)?.color }} />
                                        {ROLES.find(r => r.id === selectedRole)?.name} Permissions
                                    </h2>
                                    <p>Configure permissions for this role</p>
                                </div>
                                <div className="header-actions">
                                    <Button
                                        variant="secondary"
                                        leftIcon={<RotateCcw size={16} />}
                                        onClick={handleReset}
                                    >
                                        Reset to Default
                                    </Button>
                                    <Button
                                        leftIcon={<Save size={16} />}
                                        onClick={handleSave}
                                        loading={saving}
                                        disabled={!hasChanges}
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </Card>

                            <div className="permission-modules">
                                {Object.entries(PERMISSIONS).map(([moduleId, module]) => {
                                    const isExpanded = expandedModules.includes(moduleId);
                                    const counts = getModulePermissionCount(moduleId);

                                    return (
                                        <Card key={moduleId} className="permission-module">
                                            <div 
                                                className="module-header"
                                                onClick={() => toggleModule(moduleId)}
                                            >
                                                <div className="module-toggle">
                                                    {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                                </div>
                                                <div className="module-info">
                                                    <h4>{module.name}</h4>
                                                    <span className="module-count">
                                                        {counts.granted}/{counts.total} permissions
                                                    </span>
                                                </div>
                                                <div className="module-actions">
                                                    <button
                                                        className="module-action-btn grant"
                                                        onClick={(e) => { e.stopPropagation(); grantAllInModule(moduleId); }}
                                                        title="Grant all"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                    <button
                                                        className="module-action-btn revoke"
                                                        onClick={(e) => { e.stopPropagation(); revokeAllInModule(moduleId); }}
                                                        title="Revoke all"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            {isExpanded && (
                                                <div className="module-permissions">
                                                    {module.permissions.map(permission => (
                                                        <div 
                                                            key={permission.id}
                                                            className={`permission-item ${hasPermission(permission.id) ? 'granted' : ''}`}
                                                        >
                                                            <label className="permission-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={hasPermission(permission.id)}
                                                                    onChange={() => togglePermission(permission.id)}
                                                                />
                                                                <span className="checkmark">
                                                                    {hasPermission(permission.id) && <Check size={14} />}
                                                                </span>
                                                            </label>
                                                            <div className="permission-info">
                                                                <span className="permission-name">{permission.name}</span>
                                                                <span className="permission-desc">{permission.description}</span>
                                                            </div>
                                                            <code className="permission-id">{permission.id}</code>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </Card>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <Card className="no-selection">
                            <Shield size={48} />
                            <h3>Select a Role</h3>
                            <p>Choose a role from the sidebar to manage its permissions</p>
                        </Card>
                    )}
                </div>
            </div>
        </PageContainer>
    );
};

export default PermissionManagement;
