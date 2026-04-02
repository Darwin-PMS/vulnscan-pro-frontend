import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import api from '../../services/api';
import { Check, X, Star, Zap, Shield, Users, FileText, Clock, ChevronRight, Lock, Search, RefreshCw, Headphones, ChevronDown, ShieldCheck, Globe, Cpu, Award, Sparkles } from 'lucide-react';

const Pricing = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const [tiers, setTiers] = useState([]);
    const [currentSubscription, setCurrentSubscription] = useState(null);
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState(null);
    const [openFaq, setOpenFaq] = useState(null);

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
            toast.success('Subscription activated! Welcome to VulnScan Pro.');
            fetchData();
        } catch (error) {
            console.error('Subscription error:', error);
            toast.error(error.response?.data?.error || 'Failed to subscribe');
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
            toast.success('Subscription cancelled. You\'ll retain access until the end of your billing period.');
            fetchData();
        } catch (error) {
            console.error('Cancel error:', error);
            toast.error('Failed to cancel subscription');
        }
    };

    const features = [
        { key: 'basic_scans', label: 'Basic Vulnerability Scans', icon: Shield },
        { key: 'owasp_top10', label: 'OWASP Top 10 Coverage', icon: Star },
        { key: 'ghdb_patterns', label: 'GHDB Dork Patterns', icon: Zap },
        { key: 'pdf_reports', label: 'PDF Export Reports', icon: FileText },
        { key: 'api_access', label: 'API Access', icon: Lock },
        { key: 'ai_assistant', label: 'AI Security Assistant', icon: Sparkles },
        { key: 'scheduled_scans', label: 'Scheduled Scans', icon: Clock },
        { key: 'custom_dorks', label: 'Custom Dork Patterns', icon: Search },
        { key: 'team_collaboration', label: 'Team Collaboration', icon: Users },
        { key: 'advanced_payloads', label: 'Advanced Payloads', icon: Zap },
        { key: 'retest_vulnerabilities', label: 'Vulnerability Retesting', icon: RefreshCw },
        { key: 'priority_support', label: 'Priority Support', icon: Headphones },
    ];

    const benefits = [
        { icon: ShieldCheck, title: 'Enterprise Security', desc: 'Bank-grade encryption and security protocols' },
        { icon: Globe, title: 'Global Infrastructure', desc: 'Servers across 12 regions worldwide' },
        { icon: Cpu, title: 'AI-Powered', desc: 'Machine learning for accurate vulnerability detection' },
        { icon: Award, title: 'Compliance Ready', desc: 'SOC 2, HIPAA, and GDPR compliant reports' },
    ];

    const testimonials = [
        { name: 'Sarah Chen', role: 'CTO at TechFlow', text: 'VulnScan Pro cut our security audits from weeks to hours. Essential tool for our DevSecOps workflow.' },
        { name: 'Marcus Johnson', role: 'Security Lead at FinSecure', text: 'The AI assistant is a game-changer. It caught vulnerabilities our previous tools missed entirely.' },
        { name: 'Elena Rodriguez', role: 'VP Engineering at CloudScale', text: 'Team collaboration features made coordinating security across 50+ developers seamless.' },
    ];

    const faqs = [
        { q: 'Can I change plans anytime?', a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.' },
        { q: 'What happens when I cancel?', a: "You'll keep access to your current plan until the end of your billing period." },
        { q: 'Do you offer refunds?', a: 'We offer a 14-day money-back guarantee for all paid plans.' },
        { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.' },
        { q: 'Is there a free trial?', a: 'Yes! Start with our Free plan forever, or try any paid plan with our 14-day money-back guarantee.' },
        { q: 'How does team pricing work?', a: 'Professional and Enterprise plans include team collaboration. Enterprise offers custom per-seat pricing.' },
    ];

    const currentTierId = currentSubscription?.tier || 'free';
    const isCurrentPlan = (tierId) => currentTierId === tierId;
    const isUpgrade = (tierId) => {
        const tierOrder = ['free', 'starter', 'professional', 'enterprise'];
        return tierOrder.indexOf(tierId) > tierOrder.indexOf(currentTierId);
    };

    if (loading) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <div className="spinner" style={{ width: 48, height: 48 }}></div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', paddingTop: '80px' }}>
            <div className="container">
                <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto', paddingBottom: '60px' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        border: '1px solid var(--primary-color)',
                        padding: '8px 16px',
                        borderRadius: '100px',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: 'var(--primary-color)',
                        marginBottom: '20px'
                    }}>
                        <ShieldCheck size={16} />
                        Trusted by 10,000+ Security Teams
                    </div>
                    <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2' }}>
                        Enterprise-Grade Security,
                        <span style={{ background: 'linear-gradient(135deg, var(--primary-color), #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> Transparent Pricing</span>
                    </h1>
                    <p style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                        Protect your applications with professional vulnerability scanning.
                        Choose the plan that scales with your security needs.
                    </p>

                    <div style={{
                        display: 'inline-flex',
                        background: 'var(--card-bg)',
                        borderRadius: '12px',
                        padding: '4px',
                        marginTop: '32px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '8px',
                                border: 'none',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                background: billingCycle === 'monthly' ? 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))' : 'transparent',
                                color: billingCycle === 'monthly' ? 'white' : 'var(--text-secondary)'
                            }}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '8px',
                                border: 'none',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                background: billingCycle === 'yearly' ? 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))' : 'transparent',
                                color: billingCycle === 'yearly' ? 'white' : 'var(--text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            Yearly
                            <span style={{
                                background: 'var(--secondary-color)',
                                color: 'white',
                                fontSize: '11px',
                                padding: '2px 8px',
                                borderRadius: '100px'
                            }}>
                                Save 17%
                            </span>
                        </button>
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '24px',
                    marginBottom: '60px'
                }}>
                    {tiers.map((tier) => {
                        const price = parseFloat(billingCycle === 'yearly' ? tier.price_yearly : tier.price_monthly);
                        const isActive = isCurrentPlan(tier.tier_id);
                        const isPro = tier.tier_id === 'professional';
                        const tierFeatures = tier.features || {};

                        return (
                            <div
                                key={tier.tier_id}
                                className="card fade-in"
                                style={{
                                    padding: '0',
                                    overflow: 'hidden',
                                    border: isPro ? '2px solid var(--primary-color)' : isActive ? '2px solid var(--secondary-color)' : undefined,
                                    position: 'relative'
                                }}
                            >
                                {isPro && (
                                    <div style={{
                                        background: 'linear-gradient(135deg, var(--primary-color), #8b5cf6)',
                                        color: 'white',
                                        textAlign: 'center',
                                        padding: '10px',
                                        fontSize: '13px',
                                        fontWeight: '600'
                                    }}>
                                        Most Popular
                                    </div>
                                )}
                                {isActive && !isPro && (
                                    <div style={{
                                        background: 'linear-gradient(135deg, var(--secondary-color), #059669)',
                                        color: 'white',
                                        textAlign: 'center',
                                        padding: '10px',
                                        fontSize: '13px',
                                        fontWeight: '600'
                                    }}>
                                        Current Plan
                                    </div>
                                )}

                                <div style={{ padding: '28px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            background: isPro ? 'linear-gradient(135deg, var(--primary-color), #8b5cf6)' : 'var(--dark-bg)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {isPro ? (
                                                <Star size={24} color="white" />
                                            ) : (
                                                <Shield size={24} color="var(--text-secondary)" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>{tier.name}</h3>
                                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{tier.description}</p>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '16px' }}>
                                        <span style={{
                                            fontSize: '40px',
                                            fontWeight: '800',
                                            background: 'linear-gradient(135deg, var(--text-primary), var(--text-secondary))',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}>
                                            ${price.toFixed(0)}
                                        </span>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                                            /{billingCycle === 'yearly' ? 'year' : 'month'}
                                        </span>
                                    </div>

                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '6px 12px',
                                        borderRadius: '100px',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        background: tier.scan_limit_monthly === -1 ? 'rgba(16, 185, 129, 0.1)' : 'var(--dark-bg)',
                                        color: tier.scan_limit_monthly === -1 ? 'var(--secondary-color)' : 'var(--text-secondary)'
                                    }}>
                                        {tier.scan_limit_monthly === -1 ? (
                                            <>
                                                <Zap size={14} />
                                                Unlimited Scans
                                            </>
                                        ) : (
                                            <>
                                                <Shield size={14} />
                                                {tier.scan_limit_monthly} scans/month
                                            </>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleSubscribe(tier.tier_id)}
                                        disabled={isActive || subscribing === tier.tier_id || tier.tier_id === 'free'}
                                        className="btn"
                                        style={{
                                            width: '100%',
                                            marginTop: '24px',
                                            padding: '14px',
                                            fontSize: '15px',
                                            background: isActive ? 'var(--dark-bg)' : isPro ? 'linear-gradient(135deg, var(--primary-color), #8b5cf6)' : 'var(--dark-bg)',
                                            color: isActive ? 'var(--text-secondary)' : 'white',
                                            border: isActive ? '1px solid var(--border-color)' : 'none',
                                            opacity: (isActive || subscribing === tier.tier_id || tier.tier_id === 'free') ? 0.6 : 1
                                        }}
                                    >
                                        {subscribing === tier.tier_id ? (
                                            <>
                                                <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></div>
                                                Processing...
                                            </>
                                        ) : isActive ? (
                                            <>
                                                <Check size={18} />
                                                Current Plan
                                            </>
                                        ) : tier.tier_id === 'free' ? (
                                            'Free Forever'
                                        ) : (
                                            <>
                                                {isUpgrade(tier.tier_id) ? 'Upgrade' : 'Downgrade'}
                                                <ChevronRight size={18} />
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div style={{ padding: '0 28px 28px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                                    <h4 style={{
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        color: 'var(--text-secondary)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        marginBottom: '16px'
                                    }}>
                                        Features included
                                    </h4>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {features.slice(0, 6).map((feature) => {
                                            const hasFeature = tierFeatures[feature.key];
                                            const Icon = feature.icon;
                                            return (
                                                <li key={feature.key} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                    marginBottom: '12px'
                                                }}>
                                                    <div style={{
                                                        width: '24px',
                                                        height: '24px',
                                                        borderRadius: '50%',
                                                        background: hasFeature ? 'rgba(16, 185, 129, 0.1)' : 'var(--dark-bg)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0
                                                    }}>
                                                        {hasFeature ? (
                                                            <Check size={14} style={{ color: 'var(--secondary-color)' }} />
                                                        ) : (
                                                            <X size={14} style={{ color: 'var(--text-secondary)' }} />
                                                        )}
                                                    </div>
                                                    <span style={{
                                                        fontSize: '14px',
                                                        color: hasFeature ? 'var(--text-primary)' : 'var(--text-secondary)'
                                                    }}>
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
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <button
                            onClick={handleCancel}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                padding: '8px 16px',
                                fontSize: '14px',
                                transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.color = 'var(--danger-color)'}
                            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                        >
                            Cancel Subscription
                        </button>
                    </div>
                )}

                <div style={{ marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: '700', textAlign: 'center', marginBottom: '40px' }}>
                        Why Security Teams Choose VulnScan Pro
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '24px'
                    }}>
                        {benefits.map((benefit, i) => (
                            <div key={i} className="card" style={{ padding: '24px' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '16px'
                                }}>
                                    <benefit.icon size={24} style={{ color: 'var(--primary-color)' }} />
                                </div>
                                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{benefit.title}</h3>
                                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: '700', textAlign: 'center', marginBottom: '40px' }}>
                        What Our Customers Say
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '24px'
                    }}>
                        {testimonials.map((testimonial, i) => (
                            <div key={i} className="card" style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} size={16} fill="#fbbf24" color="#fbbf24" />
                                    ))}
                                </div>
                                <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
                                    "{testimonial.text}"
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, var(--primary-color), #8b5cf6)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: '600',
                                        fontSize: '14px'
                                    }}>
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: '600', fontSize: '14px' }}>{testimonial.name}</p>
                                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: '700', textAlign: 'center', marginBottom: '40px' }}>
                        Frequently Asked Questions
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className="card"
                                style={{
                                    padding: 0,
                                    overflow: 'hidden',
                                    border: openFaq === i ? '1px solid var(--primary-color)' : undefined
                                }}
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '20px',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left'
                                    }}
                                >
                                    <span style={{ fontWeight: '600', fontSize: '15px', paddingRight: '16px' }}>{faq.q}</span>
                                    <ChevronDown
                                        size={20}
                                        style={{
                                            color: 'var(--text-secondary)',
                                            flexShrink: 0,
                                            transform: openFaq === i ? 'rotate(180deg)' : 'none',
                                            transition: 'transform 0.2s'
                                        }}
                                    />
                                </button>
                                {openFaq === i && (
                                    <div style={{ padding: '0 20px 20px' }}>
                                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '14px' }}>{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ textAlign: 'center', paddingBottom: '40px' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        gap: '32px',
                        fontSize: '14px',
                        color: 'var(--text-secondary)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShieldCheck size={18} style={{ color: 'var(--secondary-color)' }} />
                            <span>256-bit SSL</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Check size={18} style={{ color: 'var(--secondary-color)' }} />
                            <span>No credit card required</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <RefreshCw size={18} style={{ color: 'var(--secondary-color)' }} />
                            <span>14-day refund policy</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
