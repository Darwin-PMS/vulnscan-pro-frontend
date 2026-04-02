import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
    Check, X, Shield, Zap, Lock, Headphones, Award,
    ArrowRight, Sparkles, Star, Heart, ThumbsUp, RefreshCw, HelpCircle, Rocket,
    FileText, Users2, LockKeyhole, Package, ShieldCheck, Search,
    Plus, Minus, Calculator, TrendingUp, Users, Server, Mail, Phone, MessageCircle, Play, Pause
} from 'lucide-react';
import { SUBSCRIPTION_TIERS, PLAN_FEATURES, isUnlimited } from '../../config/subscriptionPlans';
import './PlanComparison.css';

const PlanComparison = () => {
    const navigate = useNavigate();
    const [currentTier, setCurrentTier] = useState('free');
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [viewMode, setViewMode] = useState('cards');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [showCalculator, setShowCalculator] = useState(false);
    const [calculatorValues, setCalculatorValues] = useState({ scans: 100, users: 5, assets: 50 });
    const [recommendedPlan, setRecommendedPlan] = useState(null);
    const [showVideoTour, setShowVideoTour] = useState(false);
    const [activeCategory, setActiveCategory] = useState('all');

    useEffect(() => {
        fetchCurrentSubscription();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            recommendPlan();
        }, 1000);
        return () => clearTimeout(timer);
    }, [calculatorValues]);

    const fetchCurrentSubscription = async () => {
        try {
            const response = await api.get('/subscriptions/current');
            setCurrentTier(response.data?.tier || 'free');
        } catch (error) {
            console.error('Error fetching subscription:', error);
        } finally {
            setLoading(false);
        }
    };

    const recommendPlan = () => {
        const { scans, users, assets } = calculatorValues;
        if (scans > 500 || users > 10 || assets > 1000) {
            setRecommendedPlan('enterprise');
        } else if (scans > 200 || users > 5 || assets > 100) {
            setRecommendedPlan('business');
        } else if (scans > 50 || users > 2 || assets > 10) {
            setRecommendedPlan('professional');
        } else {
            setRecommendedPlan('starter');
        }
    };

    const plans = [
        { id: 'starter', name: 'Starter', description: 'Perfect for small teams getting started', monthlyPrice: 49 },
        { id: 'professional', name: 'Professional', description: 'For growing businesses that need more', monthlyPrice: 149, popular: true },
        { id: 'business', name: 'Business', description: 'Enterprise-grade security at scale', monthlyPrice: 399 },
        { id: 'enterprise', name: 'Enterprise', description: 'Custom solutions for large organizations', monthlyPrice: null }
    ];

    const getPrice = (tierId) => {
        const tier = SUBSCRIPTION_TIERS[tierId];
        if (!tier) return null;
        if (billingCycle === 'yearly' && tier.annualPrice) {
            return { 
                price: tier.annualPrice, 
                period: '/mo', 
                original: tier.price,
                billed: tier.annualPrice * 12,
                savings: Math.round((1 - tier.annualPrice / tier.price) * 100)
            };
        }
        return { price: tier.price, period: '/mo', original: null, billed: tier.price, savings: null };
    };

    const handleSelectPlan = (tierId) => {
        navigate('/pricing', { state: { subscribe: tierId } });
    };

    const isCurrentPlan = (tierId) => currentTier === tierId;
    const isUpgrade = (tierId) => {
        const order = ['free', 'starter', 'professional', 'business', 'enterprise', 'msp'];
        return order.indexOf(tierId) > order.indexOf(currentTier);
    };

    const getFeatureValue = (tierId, featureKey) => {
        const tier = SUBSCRIPTION_TIERS[tierId];
        if (!tier) return null;
        const features = tier.features;
        for (const category of Object.keys(features)) {
            if (features[category] && typeof features[category] === 'object' && featureKey in features[category]) {
                return features[category][featureKey];
            }
        }
        return null;
    };

    const formatValue = (value, format) => {
        if (isUnlimited(value)) return <span className="unlimited-text">Unlimited</span>;
        if (value === true) return <Check size={14} className="check-icon" />;
        if (value === false) return <X size={14} className="x-icon" />;
        if (value === 'limited') return <span className="limited-badge">Limited</span>;
        switch (format) {
            case 'boolean': return value ? <Check size={14} className="check-icon" /> : <X size={14} className="x-icon" />;
            case 'days': return `${value} days`;
            case 'hours': return `${value}h`;
            case 'number': return typeof value === 'number' ? value.toLocaleString() : value;
            case 'array': return Array.isArray(value) ? value.join(', ') : value;
            case 'access':
                if (value === true) return <Check size={14} className="check-icon" />;
                if (value === false) return <X size={14} className="x-icon" />;
                return <span className="limited-badge">{value}</span>;
            case 'frameworks': return Array.isArray(value) && value.length > 0 ? value.join(', ') : <X size={14} className="x-icon" />;
            case 'support': return value?.charAt(0).toUpperCase() + value?.slice(1) || value;
            default: return value;
        }
    };

    const getFeatureFormat = (category, key) => {
        const categoryConfig = PLAN_FEATURES[category];
        if (!categoryConfig) return 'text';
        const item = categoryConfig.items?.find(i => i.key === key);
        return item?.format || 'text';
    };

    const getCategoryFeatures = (categoryKey) => {
        const category = PLAN_FEATURES[categoryKey];
        if (!category) return [];
        return category.items?.map(item => ({ key: item.key, label: item.label })) || [];
    };

    const filteredFeatures = () => {
        if (!searchQuery) return featureCategories;
        return featureCategories.filter(cat => 
            cat.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            getCategoryFeatures(cat.key).some(f => f.label.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    };

    const featureCategories = [
        { key: 'scans', icon: Shield, label: 'Scanning', description: 'Vulnerability scanning capabilities' },
        { key: 'users', icon: Users2, label: 'Team', description: 'Team collaboration features' },
        { key: 'security', icon: LockKeyhole, label: 'Security', description: 'Security modules included' },
        { key: 'compliance', icon: Award, label: 'Compliance', description: 'Reporting and compliance' },
        { key: 'access', icon: Lock, label: 'Access', description: 'API and integrations' },
        { key: 'storage', icon: Package, label: 'Storage', description: 'Data retention' },
        { key: 'support', icon: Headphones, label: 'Support', description: 'Customer support' }
    ];

    const trustSignals = [
        { icon: Star, text: '4.9/5 rating', subtext: 'G2 Crowd', color: '#f59e0b' },
        { icon: Heart, text: '10,000+', subtext: 'Happy Users', color: '#ef4444' },
        { icon: ThumbsUp, text: '99.9% SLA', subtext: 'Uptime', color: '#10b981' },
        { icon: ShieldCheck, text: 'SOC 2', subtext: 'Certified', color: '#6366f1' }
    ];

    const testimonials = [
        { name: 'Sarah Chen', role: 'CTO, TechFlow', text: 'VulnScan Pro transformed our security workflow. The AI assistant alone saved us 20+ hours weekly.', avatar: 'SC' },
        { name: 'Marcus Johnson', role: 'CISO, SecureBank', text: 'Enterprise-grade scanning at a fraction of the cost. Best ROI we\'ve seen in security tools.', avatar: 'MJ' },
        { name: 'Emily Rodriguez', role: 'VP Security, CloudTech', text: 'The compliance reports are game-changing. We passed our audit in half the time.', avatar: 'ER' }
    ];

    const faqs = [
        { q: 'Can I switch plans anytime?', a: 'Yes! You can upgrade or downgrade your plan at any time. Changes are effective immediately and billing is prorated.' },
        { q: 'Is there a free trial?', a: 'Absolutely. All paid plans come with a 14-day free trial. No credit card required to start.' },
        { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and wire transfers for enterprise plans. Annual plans get extra discount.' },
        { q: 'How does the pricing work?', a: 'Pricing is per organization. You can add more team members, scans, and assets as you grow. All plans include core features.' },
        { q: 'Do you offer refunds?', a: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied, contact us for a full refund.' },
        { q: 'Can I get a custom plan?', a: 'For Enterprise needs, we offer custom pricing. Contact our sales team for a tailored solution.' }
    ];

    const customerLogos = ['TechCorp', 'SecureBank', 'CloudTech', 'DataFlow', 'NetSafe', 'CyberGuard'];

    if (loading) {
        return (
            <div className="pricing-loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="pricing-page">
            <div className="pricing-hero">
                <div className="hero-badge">
                    <Sparkles size={14} />
                    Special: Get 2 months free on annual plans
                </div>
                <h1 className="hero-title">Choose Your <span className="gradient-text">Perfect Plan</span></h1>
                <p className="hero-subtitle">Start securing your applications today. No credit card required for trial.</p>
                
                <div className="pricing-controls">
                    <div className="billing-toggle">
                        <span className={billingCycle === 'monthly' ? 'active' : ''} onClick={() => setBillingCycle('monthly')}>Monthly</span>
                        <button className={`toggle-switch ${billingCycle === 'yearly' ? 'yearly' : ''}`} onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}>
                            <span className="toggle-knob"></span>
                        </button>
                        <span className={billingCycle === 'yearly' ? 'active' : ''} onClick={() => setBillingCycle('yearly')}>
                            Yearly
                            <span className="save-tag">Save 17%</span>
                        </span>
                    </div>
                </div>

                <div className="calculator-toggle">
                    <button onClick={() => setShowCalculator(!showCalculator)}>
                        <Calculator size={16} />
                        {showCalculator ? 'Hide' : 'Calculate'} Your Plan
                        {showCalculator ? <Minus size={16} /> : <Plus size={16} />}
                    </button>
                </div>

                {showCalculator && (
                    <div className="plan-calculator">
                        <div className="calc-header">
                            <TrendingUp size={20} />
                            <h3>Find Your Perfect Plan</h3>
                        </div>
                        <div className="calc-inputs">
                            <div className="calc-input">
                                <label><Shield size={14} /> Monthly Scans</label>
                                <input 
                                    type="range" 
                                    min="10" 
                                    max="1000" 
                                    value={calculatorValues.scans}
                                    onChange={(e) => setCalculatorValues({...calculatorValues, scans: parseInt(e.target.value)})}
                                />
                                <span className="calc-value">{calculatorValues.scans} scans/mo</span>
                            </div>
                            <div className="calc-input">
                                <label><Users size={14} /> Team Members</label>
                                <input 
                                    type="range" 
                                    min="1" 
                                    max="50" 
                                    value={calculatorValues.users}
                                    onChange={(e) => setCalculatorValues({...calculatorValues, users: parseInt(e.target.value)})}
                                />
                                <span className="calc-value">{calculatorValues.users} users</span>
                            </div>
                            <div className="calc-input">
                                <label><Server size={14} /> Assets</label>
                                <input 
                                    type="range" 
                                    min="10" 
                                    max="5000" 
                                    value={calculatorValues.assets}
                                    onChange={(e) => setCalculatorValues({...calculatorValues, assets: parseInt(e.target.value)})}
                                />
                                <span className="calc-value">{calculatorValues.assets} assets</span>
                            </div>
                        </div>
                        <div className="calc-recommendation">
                            <span>Recommended:</span>
                            <button 
                                className={`recommended-plan ${recommendedPlan}`}
                                onClick={() => handleSelectPlan(recommendedPlan)}
                            >
                                {plans.find(p => p.id === recommendedPlan)?.name}
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="trust-signals">
                {trustSignals.map((signal, idx) => (
                    <div key={idx} className="trust-item" style={{'--accent-color': signal.color}}>
                        <signal.icon size={20} />
                        <div>
                            <span className="trust-value">{signal.text}</span>
                            <span className="trust-label">{signal.subtext}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pricing-toolbar">
                <div className="search-box">
                    <Search size={16} />
                    <input 
                        type="text" 
                        placeholder="Search features..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="pricing-view-toggle">
                    <button className={viewMode === 'cards' ? 'active' : ''} onClick={() => setViewMode('cards')}>
                        <Zap size={16} /> Cards
                    </button>
                    <button className={viewMode === 'table' ? 'active' : ''} onClick={() => setViewMode('table')}>
                        <FileText size={16} /> Compare
                    </button>
                </div>
            </div>

            {viewMode === 'cards' ? (
                <div className="pricing-cards">
                    {plans.map((plan, index) => {
                        const tier = SUBSCRIPTION_TIERS[plan.id];
                        const price = getPrice(plan.id);
                        
                        return (
                            <div 
                                key={plan.id} 
                                className={`pricing-card ${plan.popular ? 'popular' : ''} ${isCurrentPlan(plan.id) ? 'current' : ''} ${recommendedPlan === plan.id ? 'recommended' : ''}`}
                                style={{animationDelay: `${index * 0.1}s`}}
                            >
                                {plan.popular && (
                                    <div className="best-value-badge">
                                        <Sparkles size={12} /> Best Value
                                    </div>
                                )}
                                {isCurrentPlan(plan.id) && (
                                    <div className="current-badge">Current Plan</div>
                                )}
                                {recommendedPlan === plan.id && !isCurrentPlan(plan.id) && (
                                    <div className="recommend-badge">
                                        <TrendingUp size={12} /> Recommended
                                    </div>
                                )}
                                
                                <div className="card-header">
                                    <h3 className="plan-name">{plan.name}</h3>
                                    <p className="plan-description">{plan.description}</p>
                                </div>
                                
                                <div className="card-pricing">
                                    {price.price !== null ? (
                                        <>
                                            <span className="currency">$</span>
                                            <span className="price">{price.price}</span>
                                            <span className="period">{price.period}</span>
                                            {price.savings && (
                                                <span className="savings-badge">Save {price.savings}%</span>
                                            )}
                                        </>
                                    ) : (
                                        <span className="custom-price">Custom Pricing</span>
                                    )}
                                </div>

                                {price.price !== null && billingCycle === 'yearly' && (
                                    <div className="yearly-note">
                                        Billed ${price.billed}/year
                                    </div>
                                )}
                                
                                <button 
                                    className={`cta-button ${plan.popular ? 'primary' : 'secondary'} ${isCurrentPlan(plan.id) ? 'current-btn' : ''}`}
                                    onClick={() => handleSelectPlan(plan.id)}
                                >
                                    {isCurrentPlan(plan.id) ? 'Current Plan' : isUpgrade(plan.id) ? 'Get Started' : 'Downgrade'}
                                    <ArrowRight size={16} />
                                </button>
                                
                                <div className="card-features">
                                    <h4>What's Included</h4>
                                    {getCategoryFeatures('scans').slice(0, 3).map((feature) => {
                                        const value = getFeatureValue(plan.id, feature.key);
                                        const format = getFeatureFormat('scans', feature.key);
                                        return (
                                            <div key={feature.key} className={`feature-item ${value ? 'included' : 'not-included'}`}>
                                                {formatValue(value, format)}
                                                <span>{feature.label}</span>
                                            </div>
                                        );
                                    })}
                                    {getCategoryFeatures('security').slice(0, 3).map((feature) => {
                                        const value = getFeatureValue(plan.id, feature.key);
                                        const format = getFeatureFormat('security', feature.key);
                                        return (
                                            <div key={feature.key} className={`feature-item ${value ? 'included' : 'not-included'}`}>
                                                {formatValue(value, format)}
                                                <span>{feature.label}</span>
                                            </div>
                                        );
                                    })}
                                    <div className="view-more">
                                        <Link to="/plan-comparison">View all {getCategoryFeatures('scans').length + getCategoryFeatures('security').length}+ features</Link>
                                    </div>
                                </div>

                                {plan.id === 'enterprise' && (
                                    <div className="enterprise-perks">
                                        <h4>Enterprise Perks</h4>
                                        <ul>
                                            <li><Check size={14} /> Dedicated account manager</li>
                                            <li><Check size={14} /> Custom integrations</li>
                                            <li><Check size={14} /> SLA guarantees</li>
                                            <li><Check size={14} /> On-premise deployment</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="pricing-table-container">
                    <div className="category-filter">
                        <button className={activeCategory === 'all' ? 'active' : ''} onClick={() => setActiveCategory('all')}>All</button>
                        {featureCategories.map(cat => (
                            <button 
                                key={cat.key} 
                                className={activeCategory === cat.key ? 'active' : ''} 
                                onClick={() => setActiveCategory(cat.key)}
                            >
                                <cat.icon size={14} /> {cat.label}
                            </button>
                        ))}
                    </div>
                    <table className="pricing-table">
                        <thead>
                            <tr>
                                <th className="feature-col">Features</th>
                                {plans.map(plan => (
                                    <th key={plan.id} className={plan.popular ? 'popular-col' : ''}>
                                        {plan.name}
                                        {plan.popular && <span className="popular-tag">Popular</span>}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {(activeCategory === 'all' ? featureCategories : featureCategories.filter(c => c.key === activeCategory)).map(category => (
                                <React.Fragment key={category.key}>
                                    <tr className="category-row">
                                        <td colSpan={5}>
                                            <category.icon size={18} />
                                            <div className="category-info">
                                                <span>{category.label}</span>
                                                <small>{category.description}</small>
                                            </div>
                                        </td>
                                    </tr>
                                    {getCategoryFeatures(category.key).map(feature => (
                                        <tr key={feature.key} className="feature-row">
                                            <td className="feature-name">{feature.label}</td>
                                            {plans.map(plan => {
                                                const value = getFeatureValue(plan.id, feature.key);
                                                const format = getFeatureFormat(category.key, feature.key);
                                                return (
                                                    <td key={plan.id} className={plan.popular ? 'popular-col' : ''}>
                                                        {formatValue(value, format)}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="customer-logos">
                <p>Trusted by security teams at</p>
                <div className="logo-grid">
                    {customerLogos.map((logo, idx) => (
                        <div key={idx} className="logo-item">{logo}</div>
                    ))}
                </div>
            </div>

            <div className="testimonials-section">
                <h2>Trusted by Security Teams Worldwide</h2>
                <div className="testimonials-grid">
                    {testimonials.map((testimonial, idx) => (
                        <div key={idx} className="testimonial-card">
                            <div className="testimonial-stars">
                                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />)}
                            </div>
                            <p className="testimonial-text">"{testimonial.text}"</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">{testimonial.avatar}</div>
                                <div>
                                    <strong>{testimonial.name}</strong>
                                    <span>{testimonial.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="video-section">
                <div className="video-content">
                    <h2>See VulnScan Pro in Action</h2>
                    <p>Watch a 2-minute overview of how we help secure applications</p>
                    <button className="video-play-btn" onClick={() => setShowVideoTour(!showVideoTour)}>
                        {showVideoTour ? <><Pause size={20} /> Pause Tour</> : <><Play size={20} /> Watch Tour</>}
                    </button>
                </div>
                <div className={`video-placeholder ${showVideoTour ? 'playing' : ''}`}>
                    <Play size={48} />
                    <span>2:15</span>
                </div>
            </div>

            <div className="guarantee-section">
                <div className="guarantee-icon">
                    <RefreshCw size={32} />
                </div>
                <h3>30-Day Money-Back Guarantee</h3>
                <p>Try risk-free. If you're not satisfied, get a full refund within 30 days. No questions asked.</p>
            </div>

            <div className="contact-section">
                <h2>Need Help Choosing?</h2>
                <div className="contact-options">
                    <div className="contact-card">
                        <MessageCircle size={24} />
                        <h4>Live Chat</h4>
                        <p>Chat with our team</p>
                        <button>Start Chat</button>
                    </div>
                    <div className="contact-card">
                        <Mail size={24} />
                        <h4>Email Support</h4>
                        <p>Get answers within 24h</p>
                        <button>Send Email</button>
                    </div>
                    <div className="contact-card">
                        <Phone size={24} />
                        <h4>Book a Call</h4>
                        <p>Talk to sales</p>
                        <button>Schedule Call</button>
                    </div>
                </div>
            </div>

            <div className="faq-section">
                <h2>Frequently Asked Questions</h2>
                <div className="faq-grid">
                    {faqs.map((faq, idx) => (
                        <div 
                            key={idx} 
                            className={`faq-item ${expandedFaq === idx ? 'expanded' : ''}`}
                            onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                        >
                            <h4>
                                <HelpCircle size={16} /> 
                                {faq.q}
                                {expandedFaq === idx ? <Minus size={16} /> : <Plus size={16} />}
                            </h4>
                            {expandedFaq === idx && <p>{faq.a}</p>}
                        </div>
                    ))}
                </div>
            </div>

            <div className="cta-banner">
                <div className="cta-banner-content">
                    <Rocket size={28} />
                    <div>
                        <h3>Ready to Secure Your Applications?</h3>
                        <p>Start your free trial today. No credit card required.</p>
                    </div>
                </div>
                <button className="cta-banner-button" onClick={() => handleSelectPlan('professional')}>
                    Start Free Trial <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default PlanComparison;
