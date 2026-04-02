import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import {
    MODULE_OWNERSHIP,
    getModuleAccessLevel,
    canAccessModule,
    canManageModule,
    getVisibleModules,
    requiresApproval,
    ROLE_HIERARCHY
} from '../config/moduleOwnership';

const PermissionContext = createContext();

const DEFAULT_PERMISSIONS = {
    super_admin: [
        'dashboard:view_own', 'dashboard:view_team', 'dashboard:view_all_tenants', 'dashboard:customize',
        'scan:create', 'scan:view_all', 'scan:stop', 'scan:pause', 'scan:delete', 'scan:retry', 'scan:schedule',
        'finding:view', 'finding:triage', 'finding:false_positive', 'finding:suppress', 'finding:assign', 'finding:risk_accept',
        'report:generate', 'report:download', 'report:white_label', 'report:schedule',
        'user:invite', 'user:remove', 'user:change_role', 'user:view_audit',
        'billing:view', 'billing:modify', 'billing:cancel', 'billing:invoice',
        'integration:configure', 'integration:webhook', 'integration:oauth',
        'api_key:create', 'api_key:revoke',
        'scanner:manage', 'scanner:view_status',
        'settings:tenant', 'settings:security', 'settings:mfa_enforce',
        'compliance:view', 'compliance:export',
        'tenant:create', 'tenant:delete', 'tenant:impersonate', 'tenant:export',
    ],
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

export const PermissionProvider = ({ children, user }) => {
    const [permissions, setPermissions] = useState([]);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadPermissions();
        }
    }, [user]);

    const loadPermissions = async () => {
        setLoading(true);
        try {
            if (user?.isSuperAdmin) {
                setRole('super_admin');
                setPermissions(DEFAULT_PERMISSIONS.super_admin);
            } else if (user?.role) {
                setRole(user.role);
                
                if (user.customPermissions && user.customPermissions.length > 0) {
                    setPermissions(user.customPermissions);
                } else {
                    setPermissions(DEFAULT_PERMISSIONS[user.role] || []);
                }
            }
        } catch (error) {
            console.error('Failed to load permissions:', error);
            if (user?.role) {
                setPermissions(DEFAULT_PERMISSIONS[user.role] || []);
            }
        } finally {
            setLoading(false);
        }
    };

    const hasPermission = (permission) => {
        if (role === 'super_admin') return true;
        return permissions.includes(permission);
    };

    const hasAnyPermission = (permissionList) => {
        if (role === 'super_admin') return true;
        return permissionList.some(p => permissions.includes(p));
    };

    const hasAllPermissions = (permissionList) => {
        if (role === 'super_admin') return true;
        return permissionList.every(p => permissions.includes(p));
    };

    const isSuperAdmin = () => role === 'super_admin';
    const isAdmin = () => ['super_admin', 'admin'].includes(role);
    const isSupervisor = () => ['super_admin', 'admin', 'supervisor'].includes(role);
    const isAnalyst = () => ['super_admin', 'admin', 'supervisor', 'analyst'].includes(role);

    const getModuleAccess = (moduleId) => {
        return getModuleAccessLevel(moduleId, role);
    };

    const canAccessModulePage = (moduleId) => {
        return canAccessModule(moduleId, role);
    };

    const canManageModulePage = (moduleId) => {
        return canManageModule(moduleId, role);
    };

    const getUserAccessLevel = () => {
        return ROLE_HIERARCHY[role] || 0;
    };

    const isRoleAtLeast = (minimumRole) => {
        return getUserAccessLevel() >= (ROLE_HIERARCHY[minimumRole] || 0);
    };

    const value = {
        permissions,
        role,
        loading,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        isSuperAdmin,
        isAdmin,
        isSupervisor,
        isAnalyst,
        getModuleAccess,
        canAccessModulePage,
        canManageModulePage,
        getUserAccessLevel,
        isRoleAtLeast,
        getVisibleModules: () => getVisibleModules(role),
        requiresApproval: (moduleId, action) => requiresApproval(moduleId, action),
        modules: MODULE_OWNERSHIP,
        refreshPermissions: loadPermissions
    };

    return (
        <PermissionContext.Provider value={value}>
            {children}
        </PermissionContext.Provider>
    );
};

export const usePermissions = () => {
    const context = useContext(PermissionContext);
    if (!context) {
        throw new Error('usePermissions must be used within a PermissionProvider');
    }
    return context;
};

export const usePermission = (permission) => {
    const { hasPermission } = usePermissions();
    return hasPermission(permission);
};

export const useModuleAccess = (moduleId) => {
    const { getModuleAccess } = usePermissions();
    return {
        accessLevel: getModuleAccess(moduleId),
        canAccess: getModuleAccess(moduleId) !== 'hidden',
        canEdit: getModuleAccess(moduleId) === 'full',
        canView: ['full', 'partial', 'readonly'].includes(getModuleAccess(moduleId)),
        isReadOnly: getModuleAccess(moduleId) === 'readonly',
    };
};

export const Can = ({ permission, children, fallback = null }) => {
    const { hasPermission } = usePermissions();
    return hasPermission(permission) ? children : fallback;
};

export const CanAny = ({ permissions, children, fallback = null }) => {
    const { hasAnyPermission } = usePermissions();
    return hasAnyPermission(permissions) ? children : fallback;
};

export const CanAll = ({ permissions, children, fallback = null }) => {
    const { hasAllPermissions } = usePermissions();
    return hasAllPermissions(permissions) ? children : fallback;
};

export const CanRole = ({ roles, children, fallback = null }) => {
    const { role } = usePermissions();
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(role) ? children : fallback;
};

export const CanAccessModule = ({ moduleId, children, fallback = null }) => {
    const { canAccessModulePage } = usePermissions();
    return canAccessModulePage(moduleId) ? children : fallback;
};

export const CanManageModule = ({ moduleId, children, fallback = null }) => {
    const { canManageModulePage } = usePermissions();
    return canManageModulePage(moduleId) ? children : fallback;
};

export default PermissionContext;
