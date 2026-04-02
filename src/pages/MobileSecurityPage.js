import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Shield, Smartphone, CheckCircle, AlertTriangle, ArrowRight,
    ChevronRight, Plus, Minus, Sun, Moon, Menu as MenuIcon, X,
    ShieldCheck, Layers3, Code, Globe, Lock, Fingerprint, Wifi,
    Bug, Zap, Scan, Search
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const MobileSecurityPage = () => {
    const { isDark, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    const features = [
        {
            icon: <Fingerprint className="w-8 h-8" />,
            title: "MASVS Compliance",
            description: "Complete Mobile Application Security Verification Standard (MASVS) coverage. Meet app store security requirements.",
            color: "#6366f1"
        },
        {
            icon: <Smartphone className="w-8 h-8" />,
            title: "iOS & Android",
            description: "Comprehensive security testing for both iOS (IPA) and Android (APK) applications.",
            color: "#10b981"
        },
        {
            icon: <Code className="w-8 h-8" />,
            title: "Source Code Analysis",
            description: "Static analysis of Java, Kotlin, Swift, and Objective-C source code for security vulnerabilities.",
            color: "#f59e0b"
        },
        {
            icon: <Wifi className="w-8 h-8" />,
            title: "Network Traffic Analysis",
            description: "Capture and analyze HTTP/HTTPS traffic to identify insecure data transmission and API leaks.",
            color: "#ec4899"
        },
        {
            icon: <Lock className="w-8 h-8" />,
            title: "Data Storage Review",
            description: "Analyze local storage, SharedPreferences, SQLite databases, and Keychain for sensitive data exposure.",
            color: "#8b5cf6"
        },
        {
            icon: <Bug className="w-8 h-8" />,
            title: "Runtime Analysis",
            description: "Dynamic testing using Frida to hook into running applications and test security controls in real-time.",
            color: "#14b8a6"
        }
    ];

    const vulnerabilities = [
        { name: "Insecure Data Storage", severity: "High", icon: <Lock className="w-5 h-5" /> },
        { name: "Hardcoded Credentials", severity: "Critical", icon: <Key className="w-5 h-5" /> },
        { name: "Insufficient TLS/SSL", severity: "High", icon: <Wifi className="w-5 h-5" /> },
        { name: "Code Tampering Detection", severity: "Critical", icon: <Shield className="w-5 h-5" /> },
        { name: "Insecure IPC Components", severity: "Medium", icon: <Code className="w-5 h-5" /> },
        { name: "Debugging Enabled", severity: "Medium", icon: <Bug className="w-5 h-5" /> }
    ];

    const platforms = [
        { name: "Android", icon: "🤖", color: "#34a853", status: "Supported" },
        { name: "iOS", icon: "🍎", color: "#a2aaad", status: "Supported" },
        { name: "React Native", icon: "⚛️", color: "#61dafb", status: "Beta" },
        { name: "Flutter", icon: "🎨", color: "#02569b", status: "Beta" }
    ];

    const faqs = [
        {
            question: "What mobile platforms does VulnScan Pro support?",
            answer: "We support Android (APK, AAB, source code), iOS (IPA, source code), and cross-platform frameworks like React Native and Flutter. Our scanner detects platform automatically and applies appropriate security tests."
        },
        {
            question: "How does source code analysis work?",
            answer: "Upload your source code (or decompile APK/IPA), and our static analysis engine will scan for common vulnerability patterns, hardcoded secrets, insecure API calls, and compliance issues against OWASP MASVS."
        },
        {
            question: "Can I test both compiled apps and source code?",
            answer: "Yes! You can upload compiled APKs/IPA files for binary analysis, or provide source code for deeper static analysis. Both methods complement each other for comprehensive security coverage."
        },
        {
            question: "Does VulnScan Pro help with app store compliance?",
            answer: "Absolutely. Our reports map directly to MASVS (Mobile Application Security Verification Standard) requirements, helping you meet Google Play and Apple App Store security guidelines."
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
                        <Link to="/web-security" className="nav-link">Web Security</Link>
                        <Link to="/mobile-security" className="nav-link" style={{ color: '#6366f1' }}>Mobile Security</Link>
                        <Link to="/api-security" className="nav-link">API Security</Link>
                        <Link to="/tools" className="nav-link">Tools & Labs</Link>
                        <Link to="/#pricing" className="nav-link">Pricing</Link>
                    </div>

                    <div className="new-nav-actions">
                        <button onClick={toggleTheme} style={{
                            padding: '8px', background: 'transparent', border: 'none',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px'
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
                            <Smartphone className="w-4 h-4" />
                            <span>Mobile Application Security</span>
                        </div>

                        <h1 className="new-hero-title" style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}>
                            Secure Your Mobile Apps
                            <br />
                            <span className="gradient-text">Meet App Store Standards</span>
                        </h1>

                        <p className="new-hero-description" style={{ fontSize: '18px', maxWidth: '640px', margin: '0 auto 32px' }}>
                            Comprehensive security testing for iOS & Android. Detect vulnerabilities, 
                            ensure MASVS compliance, and get your apps approved faster.
                        </p>

                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/register" className="btn-primary-new" style={{ padding: '16px 32px' }}>
                                <Scan className="w-5 h-5" />
                                Scan Your App
                            </Link>
                            <Link to="/login" className="btn-outline-new" style={{ padding: '16px 32px' }}>
                                Book Demo
                            </Link>
                        </div>

                        <div className="new-hero-stats" style={{ justifyContent: 'center', marginTop: '48px' }}>
                            <div className="hero-stat">
                                <span className="hero-stat-value">100%</span>
                                <span className="hero-stat-label">MASVS Coverage</span>
                            </div>
                            <div className="hero-stat-divider"></div>
                            <div className="hero-stat">
                                <span className="hero-stat-value">2</span>
                                <span className="hero-stat-label">Platforms</span>
                            </div>
                            <div className="hero-stat-divider"></div>
                            <div className="hero-stat">
                                <span className="hero-stat-value">&lt; 5 min</span>
                                <span className="hero-stat-label">Scan Time</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Platform Support */}
            <section style={{ background: '#f8fafc', padding: '80px 24px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>
                            Supported <span style={{ color: '#6366f1' }}>Platforms</span>
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                        {platforms.map((platform, index) => (
                            <div key={index} style={{
                                padding: '32px',
                                background: 'white',
                                border: '1px solid #e2e8f0',
                                borderRadius: '16px',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{platform.icon}</div>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{platform.name}</h3>
                                <span style={{
                                    display: 'inline-block',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    background: platform.status === 'Supported' ? '#ecfdf5' : '#fef3c7',
                                    color: platform.status === 'Supported' ? '#059669' : '#d97706'
                                }}>
                                    {platform.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vulnerabilities */}
            <section style={{ padding: '100px 24px', background: 'white' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '800' }}>
                            What We <span className="gradient-text">Detect</span>
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        {vulnerabilities.map((vuln, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                padding: '20px 24px',
                                background: 'white',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px'
                            }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: vuln.severity === 'Critical' ? '#fef2f2' : '#fff7ed',
                                    color: vuln.severity === 'Critical' ? '#dc2626' : '#ea580c'
                                }}>
                                    {vuln.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <span style={{ fontWeight: '600', color: '#0f172a', display: 'block' }}>{vuln.name}</span>
                                    <span style={{
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: vuln.severity === 'Critical' ? '#dc2626' : '#ea580c'
                                    }}>{vuln.severity}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section style={{ background: '#f8fafc', padding: '100px 24px' }} id="features">
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <span style={{ 
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '8px 16px', background: '#eef2ff', border: '1px solid rgba(99, 102, 241, 0.2)',
                            borderRadius: '100px', fontSize: '13px', fontWeight: '500', color: '#6366f1', marginBottom: '20px'
                        }}>
                            <Layers3 className="w-4 h-4" /> Features
                        </span>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '800' }}>
                            Complete Mobile <span className="gradient-text">Security Suite</span>
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                        {features.map((feature, index) => (
                            <div key={index} style={{
                                padding: '32px', background: 'white', border: '1px solid #e2e8f0',
                                borderRadius: '16px', transition: 'all 0.3s'
                            }}>
                                <div style={{
                                    width: '56px', height: '56px', borderRadius: '12px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: `${feature.color}15`, color: feature.color, marginBottom: '20px'
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

            {/* CTA */}
            <section style={{ padding: '100px 24px', background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '800', color: 'white', marginBottom: '16px' }}>
                        Ready to Secure Your Mobile App?
                    </h2>
                    <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginBottom: '32px' }}>
                        Get app store ready with MASVS-compliant security testing.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/register" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '16px 32px', background: 'white', color: '#10b981',
                            textDecoration: 'none', fontSize: '16px', fontWeight: '600', borderRadius: '12px'
                        }}>
                            Start Free Scan <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section style={{ padding: '100px 24px', background: '#f8fafc' }} id="faq">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: '800' }}>
                            Frequently Asked <span className="gradient-text">Questions</span>
                        </h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {faqs.map((faq, index) => (
                            <div key={index} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                                <div 
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '20px 24px', cursor: 'pointer', fontWeight: '600', color: '#0f172a'
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
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                    <p style={{ fontSize: '13px', color: '#64748b' }}>© 2026 VulnScan Pro. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

// Add missing Key import
const Key = ({ className }) => <Lock className={className} />;

export default MobileSecurityPage;