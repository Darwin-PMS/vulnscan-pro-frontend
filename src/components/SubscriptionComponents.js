import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Crown, Zap, AlertCircle } from 'lucide-react';

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

    const tierColors = {
        free: 'bg-gray-100 text-gray-700',
        starter: 'bg-blue-100 text-blue-700',
        professional: 'bg-purple-100 text-purple-700',
        enterprise: 'bg-yellow-100 text-yellow-700'
    };

    const tierIcons = {
        free: null,
        starter: null,
        professional: <Zap className="h-3 w-3" />,
        enterprise: <Crown className="h-3 w-3" />
    };

    const tier = usage?.tier?.toLowerCase() || 'free';

    return (
        <button
            onClick={() => navigate('/pricing')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition hover:opacity-80 ${tierColors[tier]}`}
        >
            {tierIcons[tier]}
            <span>{usage?.tier || 'Free'}</span>
            {usage && !usage.isUnlimited && (
                <span className="text-gray-500">
                    ({usage.scansUsed}/{usage.scanLimit})
                </span>
            )}
            {usage?.percentageUsed > 80 && (
                <AlertCircle className="h-3 w-3 text-orange-500" />
            )}
        </button>
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

export { SubscriptionBadge, UsageProgress, FeatureGate, SubscriptionRequired };
