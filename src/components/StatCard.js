import React from 'react';
import { AlertTriangle, AlertOctagon, AlertCircle, Info, Shield } from 'lucide-react';

const StatCard = ({ severity, count, label }) => {
    const getIcon = (severity) => {
        switch (severity) {
            case 'critical':
                return AlertOctagon;
            case 'high':
                return AlertTriangle;
            case 'medium':
                return AlertCircle;
            case 'low':
                return Shield;
            case 'info':
                return Info;
            default:
                return Shield;
        }
    };

    const Icon = getIcon(severity);

    return (
        <div className="card stat-card fade-in">
            <div className={`stat-card-icon ${severity}`}>
                <Icon size={24} />
            </div>
            <div className="stat-card-value">{count}</div>
            <div className="stat-card-label">{label}</div>
        </div>
    );
};

export default StatCard;