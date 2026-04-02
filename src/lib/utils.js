import { clsx } from 'clsx';

export function cn(...inputs) {
  return clsx(inputs);
}

export function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num?.toString() || '0';
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getInitials(name) {
  return name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';
}

export const severityColors = {
  critical: { bg: 'rgba(220, 38, 38, 0.15)', text: '#dc2626', border: 'rgba(220, 38, 38, 0.3)' },
  high: { bg: 'rgba(234, 88, 12, 0.15)', text: '#ea580c', border: 'rgba(234, 88, 12, 0.3)' },
  medium: { bg: 'rgba(217, 119, 6, 0.15)', text: '#d97706', border: 'rgba(217, 119, 6, 0.3)' },
  low: { bg: 'rgba(101, 163, 13, 0.15)', text: '#65a30d', border: 'rgba(101, 163, 13, 0.3)' },
  info: { bg: 'rgba(8, 145, 178, 0.15)', text: '#0891b2', border: 'rgba(8, 145, 178, 0.3)' },
};

export const statusColors = {
  active: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' },
  inactive: { bg: 'rgba(107, 114, 128, 0.15)', text: '#6b7280' },
  pending: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' },
  completed: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' },
  running: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6' },
  failed: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' },
};
