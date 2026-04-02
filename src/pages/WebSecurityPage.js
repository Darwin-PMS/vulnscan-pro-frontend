import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Shield, Scan, Zap, Lock, Server, Smartphone, Terminal, 
    Code, Database, Globe, ChevronDown, ArrowRight, CheckCircle,
    AlertTriangle, Bot, Layers, Activity, BarChart3, Target, Bug, 
    FileSearch, Layers3, Sparkles, Brain, Search, ScanLine, 
    ChevronRight, Plus, Minus, Sun, Moon, Menu as MenuIcon, X,
    ShieldCheck, Globe2, Wifi, Fingerprint, Lock as LockIcon,
    AlertOctagon, ShieldAlert, Check, ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const WebSecurityPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    const features = [
        {
            icon: <Bug className="w-8 h-8" />,
            title: "OWASP Top 10 Coverage",
            description: "Complete detection of all OWASP Top 10 vulnerabilities including A01 Broken Access Control through A10 Server-Side Request Forgery.",
            color: "#ef4444"
        },
        {
            icon: <Code className="w-8 h-8" />,
            title: "Modern JS Frameworks",
            description: "Specialized scanning for React, Vue, Angular, Next.js, and Node.js applications with framework-specific vulnerability patterns.",
            color: "#6366f1"
        },
        {
            icon: <Database className="w-8 h-8" />,
            title: "API Endpoint Discovery",
            description: "Automatically discovers REST, GraphQL, and SOAP APIs, identifying exposed endpoints and potential attack vectors.",
            color: "#10b981"
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Authentication Testing",
            description: "Comprehensive testing for broken authentication, session management flaws, and credential vulnerabilities.",
            color: "#f59e0b"
        },
        {
            icon: <Wifi className="w-8 h-8" />,
            title: "SSL/TLS Analysis",
            description: "Deep SSL/TLS configuration analysis identifying weak ciphers, expired certificates, and security misconfigurations.",
            color: "#ec4899"
        },
        {
            icon: <Brain className="w-8 h-8" />,
            title: "AI-Powered Analysis",
            description: "Groq-powered AI provides detailed remediation guidance, CVE explanations, and secure code examples.",
            color: "#8b5cf6"
        }
    ];

    const vulnerabilities = [
        { name: "SQL Injection", severity: "Critical", count: "12,847" },
        { name: "Cross-Site Scripting (XSS)", severity: "High", count: "8,234" },
        { name: "Broken Authentication", severity: "Critical", count: "5,672" },
        { name: "Sensitive Data Exposure", severity: "High", count: "4,891" },
        { name: "XML External Entities", severity: "Medium", count: "3,456" },
        { name: "Security Misconfigurations", severity: "Medium", count: "7,234" }
    ];

    const faqs = [
        {
            question: "What web frameworks does VulnScan Pro support?",
            answer: "We support all major frameworks including React, Vue.js, Angular, Next.js, Nuxt.js, Node.js/Express, Django, Laravel, Ruby on Rails, and ASP.NET. Our scanner automatically detects the framework and applies specific vulnerability patterns."
        },
        {
            question: "How does the scanner handle authenticated scans?",
            answer: "VulnScan Pro supports various authentication methods including form-based login, OAuth, JWT tokens, API keys, and basic auth. You can configure authentication profiles to test authenticated areas of your application."
        },
        {
            question: "Can I integrate web security scanning into my CI/CD pipeline?",
            answer: "Yes! We offer API access, GitHub Actions integration, Jenkins plugins, and webhooks. Our CLI tool allows you to run security scans as part of your build process."
        },
        {
            question: "Is the scanning process safe for production applications?",
            answer: "Our scanner is designed to be non-intrusive and read-only. However, we recommend testing in staging environments first. The scanner has built-in safeguards to prevent damage to target applications."
        }
    ];

    return (
        <div className="landing-page-light">
            {/* Navigation */}
            <nav className="new-navbar" style={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
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
                        <Link to="/web-security" className="nav-link" style={{ color: '#6366f1' }}>Web Security</Link>
                        <Link to="/mobile-security" className="nav-link">Mobile Security</Link>
                        <Link to="/api-security" className="nav-link">API Security</Link>
                        <Link to="/tools" className="nav-link">Tools & Labs</Link>
                        <Link to="/#pricing" className="nav-link">Pricing</Link>
                    </div>

                    <div className="new-nav-actions">
                        <button onClick={toggleTheme} style={{
                            padding: '8px',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px'
                        }}>
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
                        <Link to="/web-security" onClick={() => setMobileMenuOpen(false)}>Web Security</Link>
                        <Link to="/mobile-security" onClick={() => setMobileMenuOpen(false)}>Mobile Security</Link>
                        <Link to="/api-security" onClick={() => setMobileMenuOpen(false)}>API Security</Link>
                        <Link to="/tools" onClick={() => setMobileMenuOpen(false)}>Tools & Labs</Link>
                        <Link to="/pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
                        <div className="mobile-menu-cta">
                            <Link to="/login" className="btn-outline-new">Log In</Link>
                            <Link to="/register" className="btn-primary-new">Start Free</Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="new-hero-section" style={{ paddingTop: '140px' }}>
                <div className="new-hero-bg">
                    <div className="new-hero-grid"></div>
                    <div className="new-hero-blob blob-1"></div>
                    <div className="new-hero-blob blob-2"></div>
                </div>

                <div className="new-hero-container">
                    <div className="new-hero-content" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                        <div className="new-hero-badge">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Web Application Security</span>
                        </div>

                        <h1 className="new-hero-title" style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}>
                            Comprehensive Web Security
                            <br />
                            <span className="gradient-text">That Finds Everything</span>
                        </h1>

                        <p className="new-hero-description" style={{ fontSize: '18px', maxWidth: '640px', margin: '0 auto 32px' }}>
                            Advanced vulnerability scanning for web applications. Detect OWASP Top 10, 
                            modern JS framework issues, and custom vulnerabilities with 99.9% accuracy.
                        </p>

                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/register" className="btn-primary-new" style={{ padding: '16px 32px' }}>
                                <Scan className="w-5 h-5" />
                                Start Free Scan
                            </Link>
                            <Link to="/login" className="btn-outline-new" style={{ padding: '16px 32px' }}>
                                Book Demo
                            </Link>
                        </div>

                        <div className="new-hero-stats" style={{ justifyContent: 'center', marginTop: '48px' }}>
                            <div className="hero-stat">
                                <span className="hero-stat-value">99.9%</span>
                                <span className="hero-stat-label">Detection Rate</span>
                            </div>
                            <div className="hero-stat-divider"></div>
                            <div className="hero-stat">
                                <span className="hero-stat-value">50+</span>
                                <span className="hero-stat-label">Vuln Types</span>
                            </div>
                            <div className="hero-stat-divider"></div>
                            <div className="hero-stat">
                                <span className="hero-stat-value">&lt; 3 min</span>
                                <span className="hero-stat-label">Scan Time</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vulnerabilities Covered */}
            <section style={{ background: '#f8fafc', padding: '80px 24px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>
                            Vulnerabilities We <span style={{ color: '#6366f1' }}>Detect</span>
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '16px' }}>
                            Comprehensive coverage of all critical web application security risks
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                        {vulnerabilities.map((vuln, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '20px 24px',
                                background: 'white',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: vuln.severity === 'Critical' ? '#fef2f2' : vuln.severity === 'High' ? '#fff7ed' : '#fefce8',
                                        color: vuln.severity === 'Critical' ? '#dc2626' : vuln.severity === 'High' ? '#ea580c' : '#ca8a04'
                                    }}>
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <span style={{ fontWeight: '600', color: '#0f172a' }}>{vuln.name}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ 
                                        display: 'inline-block',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        background: vuln.severity === 'Critical' ? '#fef2f2' : vuln.severity === 'High' ? '#fff7ed' : '#fefce8',
                                        color: vuln.severity === 'Critical' ? '#dc2626' : vuln.severity === 'High' ? '#ea580c' : '#ca8a04'
                                    }}>
                                        {vuln.severity}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section style={{ padding: '100px 24px', background: 'white' }} id="features">
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <span style={{ 
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            background: '#eef2ff',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                            borderRadius: '100px',
                            fontSize: '13px',
                            fontWeight: '500',
                            color: '#6366f1',
                            marginBottom: '20px'
                        }}>
                            <Layers3 className="w-4 h-4" /> Features
                        </span>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '800', marginBottom: '16px' }}>
                            Everything You Need for <span className="gradient-text">Complete Web Security</span>
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                        {features.map((feature, index) => (
                            <div key={index} style={{
                                padding: '32px',
                                background: 'white',
                                border: '1px solid #e2e8f0',
                                borderRadius: '16px',
                                transition: 'all 0.3s'
                            }}>
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: `${feature.color}15`,
                                    color: feature.color,
                                    marginBottom: '20px'
                                }}>
                                    {feature.icon}
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: '#0f172a' }}>
                                    {feature.title}
                                </h3>
                                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section style={{ background: '#f8fafc', padding: '100px 24px' }} id="how-it-works">
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <span style={{ 
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            background: '#eef2ff',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                            borderRadius: '100px',
                            fontSize: '13px',
                            fontWeight: '500',
                            color: '#6366f1',
                            marginBottom: '20px'
                        }}>
                            <Search className="w-4 h-4" /> How It Works
                        </span>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '800' }}>
                            Scan Your Web App in <span className="gradient-text">3 Simple Steps</span>
                        </h2>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
                        {[
                            { step: '01', title: 'Enter URL', desc: 'Provide your web application URL', icon: <Globe className="w-8 h-8" /> },
                            { step: '02', title: 'Auto Scan', desc: 'Our crawler maps your entire app', icon: <Scan className="w-8 h-8" /> },
                            { step: '03', title: 'Get Results', desc: 'Receive detailed vulnerability report', icon: <ShieldCheck className="w-8 h-8" /> }
                        ].map((item, index) => (
                            <div key={index} style={{ textAlign: 'center', maxWidth: '280px' }}>
                                <div style={{ 
                                    fontSize: '64px', 
                                    fontWeight: '800', 
                                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    lineHeight: '1',
                                    marginBottom: '16px'
                                }}>{item.step}</div>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: '#eef2ff',
                                    color: '#6366f1',
                                    margin: '0 auto 20px'
                                }}>{item.icon}</div>
                                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>{item.title}</h3>
                                <p style={{ fontSize: '14px', color: '#64748b' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ padding: '100px 24px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '800', color: 'white', marginBottom: '16px' }}>
                        Ready to Secure Your Web App?
                    </h2>
                    <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginBottom: '32px' }}>
                        Join thousands of developers who trust VulnScan Pro for their web application security.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/register" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '16px 32px',
                            background: 'white',
                            color: '#6366f1',
                            textDecoration: 'none',
                            fontSize: '16px',
                            fontWeight: '600',
                            borderRadius: '12px'
                        }}>
                            Start Free Scan <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link to="/login" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '16px 32px',
                            background: 'transparent',
                            color: 'white',
                            textDecoration: 'none',
                            fontSize: '16px',
                            fontWeight: '600',
                            border: '2px solid white',
                            borderRadius: '12px'
                        }}>
                            Book Demo
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section style={{ padding: '100px 24px', background: '#f8fafc' }} id="faq">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: '800' }}>
                            Frequently Asked <span className="gradient-text">Questions</span>
                        </h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {faqs.map((faq, index) => (
                            <div 
                                key={index}
                                style={{
                                    background: 'white',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '12px',
                                    overflow: 'hidden'
                                }}
                            >
                                <div 
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '20px 24px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        color: '#0f172a'
                                    }}
                                >
                                    <span>{faq.question}</span>
                                    {openFaq === index ? <Minus className="w-5 h-5" style={{ color: '#64748b' }} /> : <Plus className="w-5 h-5" style={{ color: '#64748b' }} />}
                                </div>
                                {openFaq === index && (
                                    <div style={{ padding: '0 24px 20px', fontSize: '15px', color: '#64748b', lineHeight: '1.7' }}>
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ background: 'white', padding: '60px 24px 30px', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '60px', marginBottom: '40px' }}>
                        <div>
                            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '16px' }}>
                                <div style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <Shield className="w-5 h-5" />
                                </div>
                                <span style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>VulnScan<span className="gradient-text">Pro</span></span>
                            </Link>
                            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
                                Advanced web and mobile application security scanning powered by AI.
                            </p>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <a href="#" style={{ color: '#64748b' }}><Globe2 className="w-5 h-5" /></a>
                                <a href="#" style={{ color: '#64748b' }}><Code className="w-5 h-5" /></a>
                                <a href="#" style={{ color: '#64748b' }}><Bot className="w-5 h-5" /></a>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px' }}>
                            <div>
                                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#0f172a' }}>Product</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <Link to="/web-security" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Web Security</Link>
                                    <Link to="/mobile-security" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Mobile Security</Link>
                                    <Link to="/api-security" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>API Security</Link>
                                    <Link to="/pricing" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Pricing</Link>
                                </div>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#0f172a' }}>Resources</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <Link to="/dorks" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Dork Patterns</Link>
                                    <Link to="/learning" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Learning Center</Link>
                                    <Link to="/terminal" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Terminal Labs</Link>
                                </div>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#0f172a' }}>Company</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <a href="#" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>About</a>
                                    <a href="#" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Blog</a>
                                    <a href="#" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Careers</a>
                                </div>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#0f172a' }}>Legal</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <a href="#" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Privacy</a>
                                    <a href="#" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Terms</a>
                                    <a href="#" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Security</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ paddingTop: '30px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <p style={{ fontSize: '13px', color: '#64748b' }}>© 2026 VulnScan Pro. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default WebSecurityPage;