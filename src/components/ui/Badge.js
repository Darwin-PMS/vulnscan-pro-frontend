import React from 'react';
import { cn, severityColors, statusColors } from '../../lib/utils';
import './Badge.css';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  dot = false,
  className,
  ...props 
}) => {
  return (
    <span 
      className={cn('badge', `badge-${variant}`, `badge-${size}`, dot && 'badge-with-dot', className)} 
      {...props}
    >
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
};

const SeverityBadge = ({ severity, size = 'md', showLabel = true, className }) => {
  const normalizedSeverity = severity?.toLowerCase() || 'info';
  const colors = severityColors[normalizedSeverity] || severityColors.info;
  
  return (
    <span 
      className={cn('badge', 'badge-severity', `badge-${size}`, className)}
      style={{
        '--badge-bg': colors.bg,
        '--badge-color': colors.text,
        '--badge-border': colors.border,
      }}
    >
      {showLabel && <span className="badge-dot" />}
      {severity || 'Unknown'}
    </span>
  );
};

const StatusBadge = ({ status, size = 'md', className }) => {
  const normalizedStatus = status?.toLowerCase() || 'unknown';
  const colors = statusColors[normalizedStatus] || { bg: 'rgba(107, 114, 128, 0.15)', text: '#6b7280' };
  
  const labels = {
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    completed: 'Completed',
    running: 'Running',
    failed: 'Failed',
    cancelled: 'Cancelled',
    expired: 'Expired',
    trial: 'Trial',
  };
  
  return (
    <span 
      className={cn('badge', 'badge-status', `badge-${size}`, className)}
      style={{
        '--badge-bg': colors.bg,
        '--badge-color': colors.text,
      }}
    >
      <span className="badge-dot-animated" />
      {labels[normalizedStatus] || status}
    </span>
  );
};

const RoleBadge = ({ role, size = 'md', className }) => {
  const isAdmin = role?.toLowerCase() === 'admin';
  
  return (
    <span className={cn('badge', 'badge-role', isAdmin ? 'badge-admin' : 'badge-user', `badge-${size}`, className)}>
      {isAdmin ? 'Admin' : 'User'}
    </span>
  );
};

const SubscriptionBadge = ({ tier, size = 'md', className }) => {
  const tierStyles = {
    enterprise: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' },
    professional: { bg: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' },
    starter: { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' },
    free: { bg: 'rgba(107, 114, 128, 0.15)', color: '#6b7280' },
  };
  
  const style = tierStyles[tier?.toLowerCase()] || tierStyles.free;
  
  return (
    <span 
      className={cn('badge', 'badge-subscription', `badge-${size}`, className)}
      style={{
        '--badge-bg': style.bg,
        '--badge-color': style.color,
      }}
    >
      {tier || 'Free'}
    </span>
  );
};

Badge.Severity = SeverityBadge;
Badge.Status = StatusBadge;
Badge.Role = RoleBadge;
Badge.Subscription = SubscriptionBadge;

export default Badge;
