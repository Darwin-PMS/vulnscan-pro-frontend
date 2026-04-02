import React from 'react';
import './Skeleton.css';

export const Skeleton = ({ 
    width, 
    height, 
    variant = 'text', 
    className = '',
    style = {},
    ...props 
}) => {
    return (
        <div 
            className={`skeleton skeleton-${variant} ${className}`}
            style={{ width, height, ...style }}
            {...props}
        />
    );
};

export const SkeletonText = ({ lines = 3, className = '' }) => {
    return (
        <div className={`skeleton-text ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton 
                    key={i} 
                    variant="text"
                    width={i === lines - 1 ? '60%' : '100%'}
                />
            ))}
        </div>
    );
};

export const SkeletonCard = ({ className = '' }) => {
    return (
        <div className={`skeleton-card ${className}`}>
            <Skeleton variant="rectangular" height={160} />
            <div className="skeleton-card-content">
                <Skeleton variant="text" width="70%" height={20} />
                <Skeleton variant="text" width="40%" height={16} />
                <div className="skeleton-card-footer">
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton variant="text" width="50%" height={14} />
                </div>
            </div>
        </div>
    );
};

export const SkeletonTable = ({ rows = 5, cols = 4, className = '' }) => {
    return (
        <div className={`skeleton-table ${className}`}>
            <div className="skeleton-table-header">
                {Array.from({ length: cols }).map((_, i) => (
                    <Skeleton key={i} variant="text" height={16} />
                ))}
            </div>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="skeleton-table-row">
                    {Array.from({ length: cols }).map((_, colIndex) => (
                        <Skeleton 
                            key={colIndex} 
                            variant="text" 
                            height={14}
                            width={colIndex === 0 ? '80%' : '60%'}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export const SkeletonList = ({ items = 3, className = '' }) => {
    return (
        <div className={`skeleton-list ${className}`}>
            {Array.from({ length: items }).map((_, i) => (
                <div key={i} className="skeleton-list-item">
                    <Skeleton variant="circular" width={40} height={40} />
                    <div className="skeleton-list-content">
                        <Skeleton variant="text" width="60%" height={16} />
                        <Skeleton variant="text" width="40%" height={12} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export const SkeletonScanItem = ({ className = '' }) => {
    return (
        <div className={`skeleton-scan-item ${className}`}>
            <Skeleton variant="rectangular" width={48} height={48} />
            <div className="skeleton-scan-content">
                <Skeleton variant="text" width="50%" height={18} />
                <Skeleton variant="text" width="30%" height={14} />
            </div>
            <div className="skeleton-scan-status">
                <Skeleton variant="rectangular" width={80} height={24} />
            </div>
        </div>
    );
};

export const SkeletonVulnerabilityCard = ({ className = '' }) => {
    return (
        <div className={`skeleton-vuln-card ${className}`}>
            <div className="skeleton-vuln-header">
                <div className="skeleton-vuln-left">
                    <Skeleton variant="circular" width={36} height={36} />
                    <div>
                        <Skeleton variant="text" width={200} height={16} />
                        <Skeleton variant="text" width={150} height={12} />
                    </div>
                </div>
                <Skeleton variant="rectangular" width={70} height={24} />
            </div>
            <Skeleton variant="text" width="100%" height={14} />
            <Skeleton variant="text" width="80%" height={14} />
            <div className="skeleton-vuln-footer">
                <Skeleton variant="text" width={100} height={12} />
                <Skeleton variant="text" width={120} height={12} />
            </div>
        </div>
    );
};

export default Skeleton;
