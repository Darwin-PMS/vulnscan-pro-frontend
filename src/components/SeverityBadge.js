import React from 'react';

const SeverityBadge = ({ severity }) => {
    const getSeverityClass = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'critical':
                return 'severity-critical';
            case 'high':
                return 'severity-high';
            case 'medium':
                return 'severity-medium';
            case 'low':
                return 'severity-low';
            case 'info':
                return 'severity-info';
            default:
                return 'severity-info';
        }
    };

    return (
        <span className={`severity-badge ${getSeverityClass(severity)}`}>
            {severity || 'Unknown'}
        </span>
    );
};

export default SeverityBadge;