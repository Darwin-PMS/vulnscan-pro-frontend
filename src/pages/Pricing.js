import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Check, X, Star, Zap, Shield, Users, FileText, Clock, ChevronRight, Lock } from 'lucide-react';

const Pricing = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tiers, setTiers] = useState([]);
    const [currentSubscription, setCurrentSubscription] = useState(null);
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [tiersRes, subRes] = await Promise.all([
                api.get('/subscriptions/tiers'),
                user ? api.get('/subscriptions/current') : Promise.resolve({ data: { tier: 'free' } })
            ]);
            setTiers(tiersRes.data.tiers);
            setCurrentSubscription(subRes.data);
        } catch (error) {
            console.error('Error fetching pricing data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async (tierId) => {
        if (!user) {
            navigate('/register', { state: { from: '/pricing', subscribe: tierId } });
            return;
        }

        setSubscribing(tierId);
        try {
            await api.post('/subscriptions/subscribe', {
                tierId,
                billingCycle
            });
            alert('Subscription activated! Welcome to VulnScan Pro.');
            fetchData();
        } catch (error) {
            console.error('Subscription error:', error);
            alert(error.response?.data?.error || 'Failed to subscribe');
        } finally {
            setSubscribing(null);
        }
    };

    const handleCancel = async () => {
        if (!window.confirm('Are you sure you want to cancel your subscription?')) {
            return;
        }

        try {
            await api.post('/subscriptions/cancel');
            alert('Subscription cancelled. You\'ll retain access until the end of your billing period.');
            fetchData();
        } catch (error) {
            console.error('Cancel error:', error);
            alert('Failed to cancel subscription');
        }
    };

    const features = [
        { key: 'basic_scans', label: 'Basic Vulnerability Scans', icon: Shield },
        { key: 'owasp_top10', label: 'OWASP Top 10 Coverage', icon: Star },
        { key: 'ghdb_patterns', label: 'GHDB Dork Patterns', icon: Zap },
        { key: 'pdf_reports', label: 'PDF Export Reports', icon: FileText },
        { key: 'api_access', label: 'API Access', icon: Lock },
        { key: 'ai_assistant', label: 'AI Security Assistant', icon: Zap },
        { key: 'scheduled_scans', label: 'Scheduled Scans', icon: Clock },
        { key: 'custom_dorks', label: 'Custom Dork Patterns', icon: Search },
        { key: 'team_collaboration', label: 'Team Collaboration', icon: Users },
        { key: 'advanced_payloads', label: 'Advanced Payloads', icon: Zap },
        { key: 'retest_vulnerabilities', label: 'Vulnerability Retesting', icon: RefreshCw },
        { key: 'priority_support', label: 'Priority Support', icon: HeadphonesIcon },
    ];

    const currentTierId = currentSubscription?.tier || 'free';
    const isCurrentPlan = (tierId) => currentTierId === tierId;
    const isUpgrade = (tierId) => {
        const tierOrder = ['free', 'starter', 'professional', 'enterprise'];
        return tierOrder.indexOf(tierId) > tierOrder.indexOf(currentTierId);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                        Choose Your Security Plan
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        Protect your applications with professional-grade vulnerability scanning
                    </p>

                    <div className="mt-8 flex justify-center">
                        <div className="relative bg-white rounded-full p-1 flex">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                                    billingCycle === 'monthly'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingCycle('yearly')}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                                    billingCycle === 'yearly'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Yearly
                                <span className="ml-2 text-green-600 text-xs">Save 17%</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-16 grid gap-8 lg:grid-cols-4 lg:gap-6">
                    {tiers.map((tier, index) => {
                        const price = parseFloat(billingCycle === 'yearly' ? tier.price_yearly : tier.price_monthly);
                        const isActive = isCurrentPlan(tier.tier_id);
                        const isPro = tier.tier_id === 'professional';
                        const tierFeatures = tier.features || {};

                        return (
                            <div
                                key={tier.tier_id}
                                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                                    isPro ? 'ring-2 ring-blue-600 lg:-mt-4 lg:mb-4' : ''
                                } ${isActive ? 'ring-2 ring-green-500' : ''}`}
                            >
                                {isPro && (
                                    <div className="bg-blue-600 text-white text-center py-1 text-sm font-medium">
                                        Most Popular
                                    </div>
                                )}
                                {isActive && (
                                    <div className="bg-green-500 text-white text-center py-1 text-sm font-medium">
                                        Current Plan
                                    </div>
                                )}

                                <div className="p-8">
                                    <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
                                    <p className="mt-2 text-gray-600 text-sm">{tier.description}</p>

                                    <div className="mt-6">
                                        <span className="text-5xl font-bold text-gray-900">
                                            ${price.toFixed(2)}
                                        </span>
                                        <span className="text-gray-600">
                                            /{billingCycle === 'yearly' ? 'year' : 'month'}
                                        </span>
                                    </div>

                                    {tier.scan_limit_monthly === -1 ? (
                                        <p className="mt-2 text-sm text-green-600 font-medium">
                                            Unlimited Scans
                                        </p>
                                    ) : (
                                        <p className="mt-2 text-sm text-gray-600">
                                            {tier.scan_limit_monthly} scans/month
                                        </p>
                                    )}

                                    <button
                                        onClick={() => handleSubscribe(tier.tier_id)}
                                        disabled={isActive || subscribing === tier.tier_id || tier.tier_id === 'free'}
                                        className={`mt-6 w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center ${
                                            isActive
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : isPro
                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                : 'bg-gray-900 text-white hover:bg-gray-800'
                                        } transition disabled:opacity-50`}
                                    >
                                        {subscribing === tier.tier_id ? (
                                            'Processing...'
                                        ) : isActive ? (
                                            'Current Plan'
                                        ) : tier.tier_id === 'free' ? (
                                            'Free Forever'
                                        ) : (
                                            <>
                                                {isUpgrade(tier.tier_id) ? 'Upgrade' : 'Downgrade'}
                                                <ChevronRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="px-8 pb-8">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-4">
                                        Features included:
                                    </h4>
                                    <ul className="space-y-3">
                                        {features.map((feature) => {
                                            const hasFeature = tierFeatures[feature.key];
                                            const FeatureIcon = feature.icon;
                                            return (
                                                <li key={feature.key} className="flex items-start">
                                                    {hasFeature ? (
                                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                                    ) : (
                                                        <X className="h-5 w-5 text-gray-300 flex-shrink-0" />
                                                    )}
                                                    <span className={`ml-3 text-sm ${
                                                        hasFeature ? 'text-gray-700' : 'text-gray-400'
                                                    }`}>
                                                        {feature.label}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {currentSubscription && currentSubscription.tier !== 'free' && (
                    <div className="mt-12 text-center">
                        <button
                            onClick={handleCancel}
                            className="text-gray-500 hover:text-gray-700 underline"
                        >
                            Cancel Subscription
                        </button>
                    </div>
                )}

                <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                        Frequently Asked Questions
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Can I change plans anytime?
                            </h3>
                            <p className="text-gray-600">
                                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                                What happens when I cancel?
                            </h3>
                            <p className="text-gray-600">
                                You'll keep access to your current plan until the end of your billing period.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Do you offer refunds?
                            </h3>
                            <p className="text-gray-600">
                                We offer a 14-day money-back guarantee for all paid plans.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                                What payment methods do you accept?
                            </h3>
                            <p className="text-gray-600">
                                We accept all major credit cards, PayPal, and bank transfers for annual plans.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Search = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const RefreshCw = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 2v6h-6"></path>
        <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
        <path d="M3 22v-6h6"></path>
        <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
    </svg>
);

const HeadphonesIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
    </svg>
);

export default Pricing;
