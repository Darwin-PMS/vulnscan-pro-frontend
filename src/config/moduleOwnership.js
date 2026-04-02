/**
 * Module Ownership Configuration
 * Defines which roles can access which modules
 */

export const MODULE_OWNERSHIP = {
    dashboard: {
        id: 'dashboard',
        name: 'Dashboard',
        description: 'Overview of security metrics and scan results',
        icon: 'LayoutDashboard',
        ownerRole: 'analyst',
        secondaryRoles: ['member', 'client', 'billing'],
        readOnlyRoles: [],
        hiddenRoles: [],
        approvalRequired: [],
        routes: ['/dashboard'],
    },
    assetInventory: {
        id: 'assetInventory',
        name: 'Asset Inventory',
        description: 'Track and manage scan targets',
        icon: 'Database',
        ownerRole: 'supervisor',
        secondaryRoles: ['analyst'],
        readOnlyRoles: ['member'],
        hiddenRoles: ['client', 'billing'],
        approvalRequired: [],
        routes: ['/assets', '/targets'],
    },
    scanEngine: {
        id: 'scanEngine',
        name: 'Scan Engine',
        description: 'Configure and run vulnerability scans',
        icon: 'Scan',
        ownerRole: 'supervisor',
        secondaryRoles: ['analyst'],
        readOnlyRoles: [],
        hiddenRoles: ['member', 'client', 'billing'],
        approvalRequired: [],
        routes: ['/scans', '/scan', '/scheduled-scans', '/new-scan'],
    },
    findings: {
        id: 'findings',
        name: 'Vulnerability Findings',
        description: 'View and triage security vulnerabilities',
        icon: 'AlertTriangle',
        ownerRole: 'analyst',
        secondaryRoles: ['supervisor'],
        readOnlyRoles: ['member', 'client'],
        hiddenRoles: ['billing'],
        approvalRequired: ['finding:risk_accept'],
        routes: ['/findings', '/vulnerabilities'],
    },
    reports: {
        id: 'reports',
        name: 'Reports',
        description: 'Generate and export security reports',
        icon: 'FileText',
        ownerRole: 'analyst',
        secondaryRoles: ['supervisor'],
        readOnlyRoles: ['member', 'client', 'billing'],
        hiddenRoles: [],
        approvalRequired: ['report:white_label'],
        routes: ['/reports'],
    },
    notifications: {
        id: 'notifications',
        name: 'Notifications',
        description: 'View alerts and system notifications',
        icon: 'Bell',
        ownerRole: 'analyst',
        secondaryRoles: ['member', 'client', 'billing'],
        readOnlyRoles: [],
        hiddenRoles: [],
        approvalRequired: [],
        routes: ['/notifications'],
    },
    integrations: {
        id: 'integrations',
        name: 'Integrations',
        description: 'Manage webhooks and third-party integrations',
        icon: 'Zap',
        ownerRole: 'admin',
        secondaryRoles: ['supervisor'],
        readOnlyRoles: ['analyst'],
        hiddenRoles: ['member', 'client', 'billing'],
        approvalRequired: [],
        routes: ['/integrations', '/webhooks'],
    },
    billing: {
        id: 'billing',
        name: 'Billing',
        description: 'Manage subscription and payments',
        icon: 'DollarSign',
        ownerRole: 'billing',
        secondaryRoles: ['admin'],
        readOnlyRoles: [],
        hiddenRoles: ['supervisor', 'analyst', 'member', 'client'],
        approvalRequired: ['billing:modify', 'billing:cancel'],
        routes: ['/billing', '/subscription', '/pricing'],
    },
    teamManagement: {
        id: 'teamManagement',
        name: 'Team Management',
        description: 'Manage team members and roles',
        icon: 'Users',
        ownerRole: 'admin',
        secondaryRoles: ['supervisor'],
        readOnlyRoles: [],
        hiddenRoles: ['analyst', 'member', 'client', 'billing'],
        approvalRequired: ['user:change_role'],
        routes: ['/team', '/users', '/user-management'],
    },
    compliance: {
        id: 'compliance',
        name: 'Compliance',
        description: 'View compliance frameworks and status',
        icon: 'Shield',
        ownerRole: 'supervisor',
        secondaryRoles: ['analyst'],
        readOnlyRoles: ['member'],
        hiddenRoles: ['client', 'billing'],
        approvalRequired: [],
        routes: ['/compliance', '/frameworks'],
    },
    auditLogs: {
        id: 'auditLogs',
        name: 'Audit Logs',
        description: 'View system and user activity logs',
        icon: 'History',
        ownerRole: 'admin',
        secondaryRoles: ['supervisor'],
        readOnlyRoles: ['analyst'],
        hiddenRoles: ['member', 'client', 'billing'],
        approvalRequired: [],
        routes: ['/audit-logs', '/logs'],
    },
    apiTokens: {
        id: 'apiTokens',
        name: 'API Tokens',
        description: 'Manage API keys and access tokens',
        icon: 'Key',
        ownerRole: 'admin',
        secondaryRoles: ['supervisor'],
        readOnlyRoles: ['analyst'],
        hiddenRoles: ['member', 'client', 'billing'],
        approvalRequired: ['api_key:create'],
        routes: ['/api-keys', '/api-keys-management'],
    },
    scannerNodes: {
        id: 'scannerNodes',
        name: 'Scanner Nodes',
        description: 'Manage scan engine infrastructure',
        icon: 'Server',
        ownerRole: 'admin',
        secondaryRoles: ['supervisor'],
        readOnlyRoles: [],
        hiddenRoles: ['analyst', 'member', 'client', 'billing'],
        approvalRequired: ['scanner:manage'],
        routes: ['/scanner', '/nodes'],
    },
    settings: {
        id: 'settings',
        name: 'Settings',
        description: 'Configure organization and security settings',
        icon: 'Settings',
        ownerRole: 'admin',
        secondaryRoles: [],
        readOnlyRoles: [],
        hiddenRoles: ['supervisor', 'analyst', 'member', 'client', 'billing'],
        approvalRequired: [],
        routes: ['/settings', '/profile'],
    },
    whiteLabel: {
        id: 'whiteLabel',
        name: 'White-label Branding',
        description: 'Customize branding for client reports',
        icon: 'Palette',
        ownerRole: 'admin',
        secondaryRoles: [],
        readOnlyRoles: [],
        hiddenRoles: ['supervisor', 'analyst', 'member', 'client', 'billing'],
        approvalRequired: ['white_label:configure'],
        routes: ['/branding', '/white-label'],
    },
    permissionManagement: {
        id: 'permissionManagement',
        name: 'Permission Management',
        description: 'Configure role-based access control',
        icon: 'Shield',
        ownerRole: 'super_admin',
        secondaryRoles: ['admin'],
        readOnlyRoles: [],
        hiddenRoles: ['supervisor', 'analyst', 'member', 'client', 'billing'],
        approvalRequired: [],
        routes: ['/permission-management'],
    },
    superAdmin: {
        id: 'superAdmin',
        name: 'Super Admin',
        description: 'Cross-tenant administration',
        icon: 'Crown',
        ownerRole: 'super_admin',
        secondaryRoles: [],
        readOnlyRoles: [],
        hiddenRoles: ['admin', 'supervisor', 'analyst', 'member', 'client', 'billing'],
        approvalRequired: [],
        routes: ['/super-admin', '/admin'],
    },
};

export const ROLE_HIERARCHY = {
    super_admin: 100,
    admin: 90,
    supervisor: 70,
    analyst: 50,
    member: 30,
    client: 20,
    billing: 25,
};

export const getModuleAccessLevel = (moduleId, userRole) => {
    const module = MODULE_OWNERSHIP[moduleId];
    if (!module) return 'hidden';

    if (userRole === 'super_admin') return 'full';

    if (module.ownerRole === userRole) return 'full';
    if (module.secondaryRoles.includes(userRole)) return 'partial';
    if (module.readOnlyRoles.includes(userRole)) return 'readonly';
    if (module.hiddenRoles.includes(userRole)) return 'hidden';

    return 'partial';
};

export const canAccessModule = (moduleId, userRole) => {
    const accessLevel = getModuleAccessLevel(moduleId, userRole);
    return accessLevel !== 'hidden';
};

export const canManageModule = (moduleId, userRole) => {
    const accessLevel = getModuleAccessLevel(moduleId, userRole);
    return accessLevel === 'full';
};

export const getVisibleModules = (userRole) => {
    return Object.keys(MODULE_OWNERSHIP).filter(moduleId => {
        return canAccessModule(moduleId, userRole);
    });
};

export const requiresApproval = (moduleId, action) => {
    const module = MODULE_OWNERSHIP[moduleId];
    if (!module) return false;
    return module.approvalRequired.includes(action);
};

export const MODULE_ROUTES_MAP = Object.values(MODULE_OWNERSHIP).reduce((acc, module) => {
    module.routes.forEach(route => {
        acc[route] = module.id;
    });
    return acc;
}, {});

export default MODULE_OWNERSHIP;
