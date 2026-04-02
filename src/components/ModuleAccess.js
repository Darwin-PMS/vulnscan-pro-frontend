import React from 'react';
import { useModuleAccess } from '../contexts/PermissionContext';
import { Shield, Eye, Edit, Lock } from 'lucide-react';

/**
 * ModuleAccess - Wrapper component for module-level access control
 * 
 * @param {string} moduleId - The module ID from moduleOwnership config
 * @param {React.ReactNode} children - Content to show if access granted
 * @param {React.ReactNode} fallback - Content to show if no access (default: null)
 * @param {boolean} showAccessLevel - Show access level badge
 * @param {string} fallbackType - 'hidden' (show nothing), 'locked' (show lock screen), 'readonly' (show read-only message)
 */
export const ModuleAccess = ({ 
    moduleId, 
    children, 
    fallback = null,
    showAccessLevel = false,
    fallbackType = 'locked',
    ...props 
}) => {
    const { accessLevel, canAccess, canView, isReadOnly } = useModuleAccess(moduleId);

    if (!canAccess) {
        if (fallbackType === 'hidden') {
            return null;
        }
        
        if (fallbackType === 'locked') {
            return (
                <div className="module-access-denied" {...props}>
                    <div className="access-denied-content">
                        <Lock size={48} />
                        <h3>Access Restricted</h3>
                        <p>You don't have permission to access this module.</p>
                        <span className="access-badge">Access Denied</span>
                    </div>
                </div>
            );
        }
        
        return fallback;
    }

    if (showAccessLevel) {
        return (
            <div className={`module-access-wrapper access-${accessLevel}`} {...props}>
                {accessLevel === 'readonly' && (
                    <div className="access-level-banner readonly">
                        <Eye size={16} />
                        <span>View Only - You have read-only access to this module</span>
                    </div>
                )}
                {children}
            </div>
        );
    }

    return children;
};

/**
 * ModuleActions - Wrapper for module-specific actions based on access level
 */
export const ModuleActions = ({ 
    moduleId, 
    actions = {}, 
    fallback = null,
    ...props 
}) => {
    const { accessLevel, canEdit } = useModuleAccess(moduleId);

    if (accessLevel === 'hidden') {
        return fallback;
    }

    const mappedActions = {
        create: canEdit || accessLevel === 'full',
        edit: canEdit || accessLevel === 'full',
        delete: accessLevel === 'full',
        approve: accessLevel === 'full',
        export: accessLevel !== 'hidden',
        ...actions
    };

    return (
        <div className="module-actions-wrapper" {...props}>
            {React.Children.map(children, (child) => {
                if (!child) return null;
                return React.cloneElement(child, { 
                    moduleActions: mappedActions,
                    accessLevel 
                });
            })}
        </div>
    );
};

/**
 * ModuleBadge - Shows the access level badge
 */
export const ModuleBadge = ({ moduleId, ...props }) => {
    const { accessLevel } = useModuleAccess(moduleId);

    const getBadgeConfig = () => {
        switch (accessLevel) {
            case 'full':
                return { label: 'Full Access', icon: Edit, className: 'full' };
            case 'partial':
                return { label: 'Partial Access', icon: Eye, className: 'partial' };
            case 'readonly':
                return { label: 'Read Only', icon: Eye, className: 'readonly' };
            default:
                return { label: 'No Access', icon: Lock, className: 'none' };
        }
    };

    const config = getBadgeConfig();
    const Icon = config.icon;

    return (
        <span className={`module-badge ${config.className}`} {...props}>
            <Icon size={12} />
            {config.label}
        </span>
    );
};

/**
 * ModuleHeader - Header with access level indicator
 */
export const ModuleHeader = ({ 
    moduleId, 
    title, 
    subtitle,
    actions,
    showBadge = true,
    ...props 
}) => {
    const { canEdit } = useModuleAccess(moduleId);

    return (
        <div className="module-header" {...props}>
            <div className="module-header-content">
                <h1>{title}</h1>
                {subtitle && <p>{subtitle}</p>}
            </div>
            <div className="module-header-actions">
                {showBadge && <ModuleBadge moduleId={moduleId} />}
                {actions}
            </div>
            {!canEdit && (
                <div className="module-readonly-notice">
                    <Eye size={14} />
                    <span>You have view-only access to this module</span>
                </div>
            )}
        </div>
    );
};

/**
 * ModuleSection - Conditional section based on access level
 */
export const ModuleSection = ({ 
    moduleId, 
    requiredAccess = 'readonly',
    children, 
    fallback = null,
    ...props 
}) => {
    const { accessLevel } = useModuleAccess(moduleId);

    const accessHierarchy = {
        'hidden': 0,
        'readonly': 1,
        'partial': 2,
        'full': 3
    };

    const hasAccess = accessHierarchy[accessLevel] >= accessHierarchy[requiredAccess];

    if (!hasAccess) {
        return fallback;
    }

    return (
        <div className={`module-section access-${accessLevel}`} {...props}>
            {children}
        </div>
    );
};

export default ModuleAccess;
