import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Shield, Terminal, BookOpen, Search, Code, Brain, ArrowRight,
    ChevronRight, Plus, Minus, Sun, Moon, Menu as MenuIcon, X,
    ShieldCheck, Layers3, Database, Terminal as TerminalIcon,
    FileSearch, GraduationCap, Cpu, Terminal2
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ToolsPage = () => {
    const { isDark, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeTool, setActiveTool] = useState(0);

    const tools = [
        {
            id: 'dorks',
            icon: <FileSearch className="w-8 h-8" />,
            name: 'Dork Patterns',
            description: 'Google Hacking Database (GHDB) patterns to discover exposed data, misconfigurations, and sensitive information leaks.',
            color: '#6366f1',
            features: ['Exposed Databases', 'Sensitive Files', 'Configuration Files', 'Login Portals'],
            link: '/dorks'
        },
        {
            id: 'learning',
            icon: <GraduationCap className="w-8 h-8" />,
            name: 'Learning Center',
            description: 'Interactive security courses and hands-on exercises. Learn ethical hacking, penetration testing, and secure coding.',
            color: '#10b981',
            features: ['Video Tutorials', 'Lab Exercises', ' quizzes', 'Certificates'],
            link: '/learning'
        },
        {
            id: 'terminal',
            icon: <TerminalIcon className="w-8 h-8" />,
            name: 'Linux Terminal Lab',
            description: 'Practice Linux commands and security tools in a safe environment. Master the terminal like a pro.',
            color: '#f59e0b',
            features: ['Real Terminal', 'Kali Linux Tools', 'Custom Challenges', 'Progress Tracking'],
            link: '/terminal'
        },
        {
            id: 'ai',
            icon: <Brain className="w-8 h-8" />,
            name: 'AI Security Assistant',
            description: 'Get instant answers to security questions. Ask about vulnerabilities, remediation, CVE details, and best practices.',
            color: '#ec4899',
            features: ['CVE Explanations', 'Remediation Help', 'Code Examples', 'Best Practices'],
            link: '/ai-assistant'
        }
    ];

    const stats = [
        { value: '50+', label: 'Dork Categories' },
        { value: '100+', label: 'Lab Exercises' },
        { value: '200+', label: 'Linux Commands' },
        { value: '24/7', label: 'AI Assistant' }
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
                        <Link to="/api-security" className="nav-link">API Security</Link>
                        <Link to="/tools" className="nav-link" style={{ color: '#6366f1' }}>Tools & Labs</Link>
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
                            <TerminalIcon className="w-4 h-4" />
                            <span>Security Tools & Labs</span>
                        </div>

                        <h1 className="new-hero-title" style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}>
                            Level Up Your
                            <br />
                            <span className="gradient-text">Security Skills</span>
                        </h1>

                        <p className="new-hero-description" style={{ fontSize: '18px', maxWidth: '640px', margin: '0 auto 32px' }}>
                            Powerful security tools and hands-on labs. From dork patterns to Linux terminal, 
                            master the skills you need to secure applications.
                        </p>

                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/register" className="btn-primary-new" style={{ padding: '16px 32px' }}>
                                Access All Tools
                            </Link>
                            <Link to="/login" className="btn-outline-new" style={{ padding: '16px 32px' }}>
                                View Documentation
                            </Link>
                        </div>

                        <div className="new-hero-stats" style={{ justifyContent: 'center', marginTop: '48px' }}>
                            {stats.map((stat, index) => (
                                <React.Fragment key={index}>
                                    <div className="hero-stat">
                                        <span className="hero-stat-value">{stat.value}</span>
                                        <span className="hero-stat-label">{stat.label}</span>
                                    </div>
                                    {index < stats.length - 1 && <div className="hero-stat-divider"></div>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Tools Grid */}
            <section style={{ padding: '100px 24px', background: 'white' }} id="tools">
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#eef2ff', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '100px', fontSize: '13px', fontWeight: '500', color: '#6366f1', marginBottom: '20px' }}>
                            <Layers3 className="w-4 h-4" /> All Tools
                        </span>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '800' }}>
                            Security Tools <span className="gradient-text">At Your Fingertips</span>
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                        {tools.map((tool, index) => (
                            <div 
                                key={index}
                                onMouseEnter={() => setActiveTool(index)}
                                style={{ 
                                    padding: '32px', 
                                    background: 'white', 
                                    border: activeTool === index ? '2px solid #6366f1' : '1px solid #e2e8f0',
                                    borderRadius: '16px', 
                                    transition: 'all 0.3s',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                                    <div style={{
                                        width: '64px', height: '64px', borderRadius: '16px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: `${tool.color}15`, color: tool.color
                                    }}>
                                        {tool.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px', color: '#0f172a' }}>{tool.name}</h3>
                                        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px', lineHeight: '1.6' }}>{tool.description}</p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {tool.features.map((feature, i) => (
                                                <span key={i} style={{ padding: '4px 12px', background: '#f1f5f9', borderRadius: '20px', fontSize: '12px', color: '#64748b' }}>
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                                    <Link to={tool.link} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: tool.color, fontWeight: '600', textDecoration: 'none' }}>
                                        Open {tool.name} <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Highlights */}
            <section style={{ background: '#f8fafc', padding: '100px 24px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                        {[
                            { icon: <FileSearch className="w-6 h-6" />, title: 'Dork Patterns', desc: '50+ GHDB categories' },
                            { icon: <GraduationCap className="w-6 h-6" />, title: 'Learning', desc: '100+ exercises' },
                            { icon: <TerminalIcon className="w-6 h-6" />, title: 'Terminal', desc: 'Real Kali Linux' },
                            { icon: <Brain className="w-6 h-6" />, title: 'AI Assistant', desc: '24/7 Available' }
                        ].map((item, index) => (
                            <div key={index} style={{ textAlign: 'center', padding: '32px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eef2ff', color: '#6366f1', margin: '0 auto 16px' }}>
                                    {item.icon}
                                </div>
                                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>{item.title}</h3>
                                <p style={{ fontSize: '13px', color: '#64748b' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '100px 24px', background: 'linear-gradient(135deg, #14b8a6, #10b981)' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '800', color: 'white', marginBottom: '16px' }}>
                        Start Learning Today
                    </h2>
                    <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginBottom: '32px' }}>
                        Get access to all security tools and labs with your free account.
                    </p>
                    <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 32px', background: 'white', color: '#14b8a6', textDecoration: 'none', fontSize: '16px', fontWeight: '600', borderRadius: '12px' }}>
                        Create Free Account <ArrowRight className="w-5 h-5" />
                    </Link>
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

export default ToolsPage;