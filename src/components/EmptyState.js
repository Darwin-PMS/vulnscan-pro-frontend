import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Search, Shield, FileText, Users, Key, Bell, Webhook,
    ScanLine, AlertTriangle, CheckCircle, Database, Lock, Settings,
    Plus, ArrowRight, RefreshCw, Download, Mail
} from 'lucide-react';
import { Button } from './ui';
import './EmptyState.css';

const iconMap = {
    scan: ScanLine,
    search: Search,
    shield: Shield,
    file: FileText,
    users: Users,
    key: Key,
    bell: Bell,
    webhook: Webhook,
    alert: AlertTriangle,
    check: CheckCircle,
    database: Database,
    lock: Lock,
    settings: Settings,
    plus: Plus,
    download: Download,
    mail: Mail,
    refresh: RefreshCw,
};

export const EmptyState = ({
    icon = 'search',
    title,
    description,
    action = null,
    secondaryAction = null,
    className = '',
    compact = false,
}) => {
    const IconComponent = iconMap[icon] || Search;

    if (compact) {
        return (
            <div className={`empty-state compact ${className}`}>
                <div className="empty-state-icon-wrapper compact">
                    <IconComponent size={24} />
                </div>
                <div className="empty-state-content">
                    <h4 className="empty-state-title">{title}</h4>
                    {description && (
                        <p className="empty-state-description">{description}</p>
                    )}
                </div>
                {(action || secondaryAction) && (
                    <div className="empty-state-actions">
                        {action && (
                            <Button size="small" onClick={action.onClick}>
                                {action.icon && <action.icon size={14} />}
                                {action.label}
                            </Button>
                        )}
                        {secondaryAction && (
                            <Button 
                                size="small" 
                                variant="secondary" 
                                onClick={secondaryAction.onClick}
                            >
                                {secondaryAction.label}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`empty-state ${className}`}>
            <div className="empty-state-icon-wrapper">
                <IconComponent size={48} />
            </div>
            <h3 className="empty-state-title">{title}</h3>
            {description && (
                <p className="empty-state-description">{description}</p>
            )}
            {(action || secondaryAction) && (
                <div className="empty-state-actions">
                    {action && (
                        <Button 
                            onClick={action.onClick}
                            leftIcon={action.icon ? <action.icon size={16} /> : <Plus size={16} />}
                        >
                            {action.label}
                        </Button>
                    )}
                    {secondaryAction && (
                        <Button 
                            variant="secondary" 
                            onClick={secondaryAction.onClick}
                        >
                            {secondaryAction.label}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export const EmptyStateWithLink = ({
    icon,
    title,
    description,
    linkTo,
    linkLabel = 'Get Started',
    className = '',
}) => {
    return (
        <EmptyState
            icon={icon}
            title={title}
            description={description}
            action={{
                label: linkLabel,
                onClick: () => {},
                as: Link,
                to: linkTo,
            }}
            className={className}
        />
    );
};

export const ScanEmptyState = ({ onStartScan }) => (
    <EmptyState
        icon="scan"
        title="No scans yet"
        description="Start your first vulnerability scan to discover security issues in your applications."
        action={{
            label: 'Start First Scan',
            icon: ScanLine,
            onClick: onStartScan,
        }}
    />
);

export const VulnerabilityEmptyState = ({ onRunScan }) => (
    <EmptyState
        icon="shield"
        title="No vulnerabilities found"
        description="Great news! No security vulnerabilities were detected in this scan."
        action={onRunScan ? {
            label: 'Run Another Scan',
            icon: ScanLine,
            onClick: onRunScan,
        } : null}
    />
);

export const NotificationEmptyState = () => (
    <EmptyState
        icon="bell"
        title="No notifications"
        description="You're all caught up! New notifications will appear here."
        compact
    />
);

export const APIKeyEmptyState = ({ onCreate }) => (
    <EmptyState
        icon="key"
        title="No API keys"
        description="Create an API key to access VulnScan Pro programmatically."
        action={{
            label: 'Create API Key',
            icon: Plus,
            onClick: onCreate,
        }}
    />
);

export const WebhookEmptyState = ({ onCreate }) => (
    <EmptyState
        icon="webhook"
        title="No webhooks configured"
        description="Set up webhooks to receive real-time notifications about scan events."
        action={{
            label: 'Add Webhook',
            icon: Plus,
            onClick: onCreate,
        }}
    />
);

export const AuditLogEmptyState = () => (
    <EmptyState
        icon="file"
        title="No audit logs"
        description="Audit logs will appear here as actions are performed."
        compact
    />
);

export default EmptyState;
