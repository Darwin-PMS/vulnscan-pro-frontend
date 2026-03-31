import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Crown, Zap, AlertCircle, Calendar, CreditCard, Activity } from 'lucide-react';

const SubscriptionBadge = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [usage, setUsage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchUsage();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchUsage = async () => {
        try {
            const res = await api.get('/subscriptions/usage');
            setUsage(res.data);
        } catch (error) {
            console.error('Error fetching usage:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;
    if (loading) return null;

    const tier = usage?.tier?.toLowerCase() || 'free';
    
    const tierStyles = {
        free: {
            bg: 'rgba(107, 114, 128, 0.2)',
            color: '#9ca3af',
            border: 'rgba(107, 114, 128, 0.3)'
        },
        starter: {
            bg: 'rgba(59, 130, 246, 0.2)',
            color: '#60a5fa',
            border: 'rgba(59, 130, 246, 0.3)'
        },
        professional: {
            bg: 'rgba(139, 92, 246, 0.2)',
            color: '#a78bfa',
            border: 'rgba(139, 92, 246, 0.3)'
        },
        enterprise: {
            bg: 'rgba(245, 158, 11, 0.2)',
            color: '#fbbf24',
            border: 'rgba(245, 158, 11, 0.3)'
        }
    };

    const style = tierStyles[tier] || tierStyles.free;

    return (
        <button
            onClick={() => navigate('/pricing')}
            className="nav-subscription-badge"
            style={{
                background: style.bg,
                color: style.color,
                border: `1px solid ${style.border}`
            }}
        >
            {tier === 'professional' && <Zap size={12} />}
            {tier === 'enterprise' && <Crown size={12} />}
            <span>{usage?.tier || 'Free'}</span>
            {usage && !usage.isUnlimited && (
                <span style={{ opacity: 0.7 }}>
                    {usage.scansUsed}/{usage.scanLimit}
                </span>
            )}
            {usage?.percentageUsed > 80 && (
                <AlertCircle size={12} style={{ color: '#fbbf24' }} />
            )}
        </button>
    );
};

const UsageSummary = () => {
    const { user } = useAuth();
    const [usage, setUsage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            api.get('/subscriptions/usage')
                .then(res => setUsage(res.data))
                .catch(console.error);
        }
    }, [user]);

    if (!user || !usage) return null;

    const percentage = usage.percentageUsed || 0;
    const isWarning = percentage > 80;
    const isCritical = percentage > 95;

    const getStatusColor = () => {
        if (isCritical) return 'var(--danger-color)';
        if (isWarning) return 'var(--warning-color)';
        return 'var(--secondary-color)';
    };

    const getStatusBg = () => {
        if (isCritical) return 'var(--critical-bg)';
        if (isWarning) return 'var(--medium-bg)';
        return 'var(--secondary-color)';
    };

    if (usage.isUnlimited) {
        return (
            <div className="card" style={{ marginBottom: '24px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Crown size={24} color="white" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontWeight: '600', fontSize: '16px' }}>{usage.tier}</span>
                            <span style={{ 
                                fontSize: '12px', 
                                padding: '2px 8px', 
                                borderRadius: '4px',
                                background: 'rgba(16, 185, 129, 0.2)',
                                color: '#34d399'
                            }}>
                                Unlimited
                            </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
                            You have unlimited scans available
                        </p>
                    </div>
                    <button 
                        className="btn btn-secondary"
                        onClick={() => navigate('/pricing')}
                    >
                        Manage Plan
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="card" style={{ marginBottom: '24px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Activity size={20} style={{ color: 'var(--primary-color)' }} />
                    <span style={{ fontWeight: '600', fontSize: '15px' }}>Usage Summary</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        {usage.billingCycle === 'yearly' ? 'Yearly' : 'Monthly'}
                    </span>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
                <div>
                    <div style={{ fontSize: '24px', fontWeight: '700' }}>{usage.scansUsed}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Scans Used</div>
                </div>
                <div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-secondary)' }}>{usage.scanLimit}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Limit</div>
                </div>
                <div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: getStatusColor() }}>
                        {usage.scanLimit - usage.scansUsed}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Remaining</div>
                </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
                <div style={{ 
                    height: '8px', 
                    background: 'var(--border-color)', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${Math.min(percentage, 100)}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${getStatusColor()}, ${isWarning ? '#f59e0b' : '#6366f1'})`,
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                    }} />
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ 
                    fontSize: '13px', 
                    color: isCritical ? 'var(--danger-color)' : isWarning ? 'var(--warning-color)' : 'var(--text-secondary)'
                }}>
                    {isCritical ? 'Limit reached - Upgrade now!' : 
                     isWarning ? `Only ${usage.scanLimit - usage.scansUsed} scans remaining` : 
                     `${percentage}% used this month`}
                </div>
                <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate('/pricing')}
                >
                    Upgrade Now
                </button>
            </div>
        </div>
    );
};

const UsageProgress = () => {
    const { user } = useAuth();
    const [usage, setUsage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            api.get('/subscriptions/usage')
                .then(res => setUsage(res.data))
                .catch(console.error);
        }
    }, [user]);

    if (!user || !usage || usage.isUnlimited) return null;

    const percentage = usage.percentageUsed;
    const colorClass = percentage > 80 ? 'bg-red-500' : percentage > 50 ? 'bg-yellow-500' : 'bg-green-500';

    return (
        <div 
            className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition"
            onClick={() => navigate('/pricing')}
        >
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Monthly Scans</span>
                <span className="text-sm font-medium">
                    {usage.scansUsed} / {usage.scanLimit}
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition ${colorClass}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>
            {percentage > 80 && (
                <p className="text-xs text-orange-600 mt-2">
                    Running low on scans.{' '}
                    <span className="underline cursor-pointer">Upgrade plan</span>
                </p>
            )}
        </div>
    );
};

const FeatureGate = ({ feature, children, fallback }) => {
    const [hasAccess, setHasAccess] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            const freeFeatures = ['basic_scans', 'owasp_top10', 'ghdb_patterns'];
            setHasAccess(freeFeatures.includes(feature));
            return;
        }

        api.get(`/subscriptions/features/${feature}`)
            .then(res => setHasAccess(res.data.hasAccess))
            .catch(() => setHasAccess(false));
    }, [user, feature]);

    if (hasAccess === null) return null;
    if (hasAccess) return children;

    return fallback || (
        <div className="bg-gray-100 rounded-lg p-6 text-center">
            <p className="text-gray-600 mb-4">
                This feature requires a premium subscription.
            </p>
            <button
                onClick={() => window.location.href = '/pricing'}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
                Upgrade Now
            </button>
        </div>
    );
};

const SubscriptionRequired = ({ feature, tier }) => {
    const navigate = useNavigate();

    const tierNames = {
        starter: 'Starter',
        professional: 'Professional',
        enterprise: 'Enterprise'
    };

    return (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                    <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">
                        {tierNames[tier] || 'Premium'} Feature
                    </h3>
                    <p className="text-sm text-gray-600">
                        Unlock this feature with a {tierNames[tier]} plan
                    </p>
                </div>
            </div>
            <button
                onClick={() => navigate('/pricing')}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
                Upgrade to {tierNames[tier]}
            </button>
        </div>
    );
};

export { SubscriptionBadge, UsageProgress, UsageSummary, FeatureGate, SubscriptionRequired };
