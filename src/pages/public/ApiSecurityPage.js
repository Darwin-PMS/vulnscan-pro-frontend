import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Shield, Code, CheckCircle, AlertTriangle, ArrowRight, Globe,
    ChevronRight, Plus, Minus, Sun, Moon, Menu as MenuIcon, X,
    ShieldCheck, Layers3, Database, Lock, Server, Zap, Scan, Search
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ApiSecurityPage = () => {
    const { isDark, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    const features = [
        {
            icon: <Globe className="w-8 h-8" />,
            title: "REST & GraphQL",
            description: "Comprehensive testing for REST APIs and GraphQL endpoints, including query injection and authorization bypass.",
            color: "#6366f1"
        },
        {
            icon: <Server className="w-8 h-8" />,
            title: "Microservices Security",
            description: "Test inter-service communication, API gateways, and service mesh configurations for security gaps.",
            color: "#10b981"
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Fuzzing & Validation",
            description: "Advanced fuzz testing to discover hidden vulnerabilities through malformed inputs and boundary conditions.",
            color: "#f59e0b"
        },
        {
            icon: <Lock className="w-8 h-8" />,
            title: "Authentication Bypass",
            description: "Detect broken authentication, JWT vulnerabilities, OAuth flaws, and session management issues.",
            color: "#ec4899"
        },
        {
            icon: <Database className="w-8 h-8" />,
            title: "Data Exposure",
            description: "Identify sensitive data leaks, improper headers, and excessive information in API responses.",
            color: "#8b5cf6"
        },
        {
            icon: <Code className="w-8 h-8" />,
            title: "Rate Limiting Tests",
            description: "Verify rate limiting and throttling controls to prevent abuse and DoS vulnerabilities.",
            color: "#14b8a6"
        }
    ];

    const vulnerabilities = [
        { name: "Injection Attacks", severity: "Critical", description: "SQL, NoSQL, Command injection" },
        { name: "Broken Authentication", severity: "Critical", description: "JWT bypass, session issues" },
        { name: "Excessive Data Exposure", severity: "High", description: "PII in responses" },
        { name: "Rate Limiting Bypass", severity: "Medium", description: "DoS through API abuse" },
        { name: "CORS Misconfiguration", severity: "Medium", description: "Unauthorized access" },
        { name: "Version/API Key Leak", severity: "High", description: "Credential exposure" }
    ];

    const faqs = [
        {
            question: "What API architectures does VulnScan Pro support?",
            answer: "We support REST APIs, GraphQL, SOAP, gRPC, and WebSocket endpoints. Our scanner automatically detects the API type and applies appropriate security testing methodologies."
        },
        {
            question: "How does API authentication testing work?",
            answer: "You can provide API keys, OAuth tokens, JWT tokens, or basic auth credentials. Our scanner will test authenticated endpoints and attempt to bypass authentication controls."
        },
        {
            question: "Can I test internal APIs behind a gateway?",
            answer: "Yes, for internal testing you can deploy our scanner within your network or use our agent-based approach. We also support API specification import (OpenAPI, Postman collections)."
        },
        {
            question: "Does it integrate with API documentation tools?",
            answer: "Absolutely! We support OpenAPI/Swagger, Postman collections, GraphQL schemas, and WSDL files for comprehensive API coverage."
        }
    ];

    return (
        <div className="landing-page-light">
            {/* Navigation */}
            <nav className="new-navbar" style={{ 
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
                background: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(20px)',
                borderBottom: '1px solid #e2e8f0'
            }}>
                <div className="new-nav-container">
                    <Link to="/" className="new-nav-logo">
                        <div className="new-logo-icon">
                            <Shield className="w-5 h-5" />
                        </div>
                        <span>VulnScan<span className="gradient-text">Pro</span></span>
                    </Link>
                    
                    <div className="new-nav-links">
                        <Link to="/web-security" className="nav-link">Web Security</Link>
                        <Link to="/mobile-security" className="nav-link">Mobile Security</Link>
                        <Link to="/api-security" className="nav-link" style={{ color: '#6366f1' }}>API Security</Link>
                        <Link to="/tools" className="nav-link">Tools & Labs</Link>
                        <Link to="/#pricing" className="nav-link">Pricing</Link>
                    </div>

                    <div className="new-nav-actions">
                        <button onClick={toggleTheme} style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                            {isDark ? <Sun size={20} style={{ color: '#fbbf24' }} /> : <Moon size={20} style={{ color: '#6366f1' }} />}
                        </button>
                        <Link to="/login" className="btn-ghost-new">Log In</Link>
                        <Link to="/register" className="btn-primary-new">Start Free →</Link>
                    </div>

                    <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="mobile-menu-new">
                        <Link to="/web-security">Web Security</Link>
                        <Link to="/mobile-security">Mobile Security</Link>
                        <Link to="/api-security">API Security</Link>
                        <Link to="/tools">Tools & Labs</Link>
                        <div className="mobile-menu-cta">
                            <Link to="/login" className="btn-outline-new">Log In</Link>
                            <Link to="/register" className="btn-primary-new">Start Free</Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero */}
            <section className="new-hero-section" style={{ paddingTop: '140px' }}>
                <div className="new-hero-bg">
                    <div className="new-hero-grid"></div>
                    <div className="new-hero-blob blob-1"></div>
                    <div className="new-hero-blob blob-2"></div>
                </div>

                <div className="new-hero-container">
                    <div className="new-hero-content" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                        <div className="new-hero-badge">
                            <Code className="w-4 h-4" />
                            <span>API Security</span>
                        </div>

                        <h1 className="new-hero-title" style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}>
                            Secure Your APIs
                            <br />
                            <span className="gradient-text">From Ground to Cloud</span>
                        </h1>

                        <p className="new-hero-description" style={{ fontSize: '18px', maxWidth: '640px', margin: '0 auto 32px' }}>
                            Comprehensive API security testing for REST, GraphQL, and microservices. 
                            Find vulnerabilities before attackers do.
                        </p>

                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/register" className="btn-primary-new" style={{ padding: '16px 32px' }}>
                                <Scan className="w-5 h-5" />
                                Scan Your API
                            </Link>
                            <Link to="/login" className="btn-outline-new" style={{ padding: '16px 32px' }}>
                                Book Demo
                            </Link>
                        </div>

                        <div className="new-hero-stats" style={{ justifyContent: 'center', marginTop: '48px' }}>
                            <div className="hero-stat">
                                <span className="hero-stat-value">30+</span>
                                <span className="hero-stat-label">API Vuln Types</span>
                            </div>
                            <div className="hero-stat-divider"></div>
                            <div className="hero-stat">
                                <span className="hero-stat-value">100%</span>
                                <span className="hero-stat-label">OpenAPI Support</span>
                            </div>
                            <div className="hero-stat-divider"></div>
                            <div className="hero-stat">
                                <span className="hero-stat-value">&lt; 2 min</span>
                                <span className="hero-stat-label">Scan Time</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vulnerabilities */}
            <section style={{ background: '#f8fafc', padding: '80px 24px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>
                            API Vulnerabilities <span style={{ color: '#6366f1' }}>We Detect</span>
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        {vulnerabilities.map((vuln, index) => (
                            <div key={index} style={{ padding: '24px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <span style={{ fontWeight: '700', color: '#0f172a' }}>{vuln.name}</span>
                                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: vuln.severity === 'Critical' ? '#fef2f2' : '#fff7ed', color: vuln.severity === 'Critical' ? '#dc2626' : '#ea580c' }}>
                                        {vuln.severity}
                                    </span>
                                </div>
                                <p style={{ fontSize: '13px', color: '#64748b' }}>{vuln.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section style={{ padding: '100px 24px', background: 'white' }} id="features">
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#eef2ff', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '100px', fontSize: '13px', fontWeight: '500', color: '#6366f1', marginBottom: '20px' }}>
                            <Layers3 className="w-4 h-4" /> Features
                        </span>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '800' }}>
                            Complete API <span className="gradient-text">Security Testing</span>
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                        {features.map((feature, index) => (
                            <div key={index} style={{ padding: '32px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', transition: 'all 0.3s' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${feature.color}15`, color: feature.color, marginBottom: '20px' }}>
                                    {feature.icon}
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: '#0f172a' }}>{feature.title}</h3>
                                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '100px 24px', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '800', color: 'white', marginBottom: '16px' }}>
                        Secure Your APIs Today
                    </h2>
                    <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginBottom: '32px' }}>
                        Start scanning and protect your API infrastructure.
                    </p>
                    <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 32px', background: 'white', color: '#8b5cf6', textDecoration: 'none', fontSize: '16px', fontWeight: '600', borderRadius: '12px' }}>
                        Start Free Scan <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* FAQ */}
            <section style={{ padding: '100px 24px', background: '#f8fafc' }} id="faq">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: '800' }}>Frequently Asked <span className="gradient-text">Questions</span></h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {faqs.map((faq, index) => (
                            <div key={index} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                                <div onClick={() => setOpenFaq(openFaq === index ? null : index)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', cursor: 'pointer', fontWeight: '600', color: '#0f172a' }}>
                                    <span>{faq.question}</span>
                                    {openFaq === index ? <Minus className="w-5 h-5" style={{ color: '#64748b' }} /> : <Plus className="w-5 h-5" style={{ color: '#64748b' }} />}
                                </div>
                                {openFaq === index && <div style={{ padding: '0 24px 20px', fontSize: '15px', color: '#64748b', lineHeight: '1.7' }}>{faq.answer}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ background: 'white', padding: '60px 24px 30px', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                    <p style={{ fontSize: '13px', color: '#64748b' }}>© 2026 VulnScan Pro. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default ApiSecurityPage;