import React from 'react';
import { Clock, Loader2, CheckCircle, XCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
    const getStatusConfig = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return { class: 'status-pending', icon: Clock, label: 'Pending' };
            case 'running':
                return { class: 'status-running', icon: Loader2, label: 'Running' };
            case 'completed':
                return { class: 'status-completed', icon: CheckCircle, label: 'Completed' };
            case 'failed':
                return { class: 'status-failed', icon: XCircle, label: 'Failed' };
            default:
                return { class: 'status-pending', icon: Clock, label: status || 'Unknown' };
        }
    };

    const config = getStatusConfig(status);
    const Icon = config.icon;

    return (
        <span className={`status-badge ${config.class}`}>
            <Icon size={14} />
            {config.label}
        </span>
    );
};

export default StatusBadge;