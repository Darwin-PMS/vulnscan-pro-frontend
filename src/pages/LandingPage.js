import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Shield, Scan, Zap, Lock, Server, Smartphone, Terminal, 
    Code, Database, Globe, ChevronDown, ArrowRight, CheckCircle,
    AlertTriangle, Eye, Bot, Layers, Activity, Cpu, ShieldCheck,
    Play, Pause, Menu, X, Star, Users, Clock, Globe2, Award,
    BarChart3, Target, Bug, FileSearch, Terminal as TerminalIcon,
    Layers3, Sparkles, ArrowUpRight, Download, ExternalLink, 
    Brain, Search, ScanLine, KeyRound, Fingerprint, Wifi, Bug2,
    ScrollText, Terminal2, Hexagon
} from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [url, setUrl] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);
    const [scrollY, setScrollY] = useState(0);
    
    const featuresRef = useRef(null);
    const statsRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature(prev => (prev + 1) % 6);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const handleQuickScan = (e) => {
        e.preventDefault();
        if (url) {
            navigate(`/scan?target=${encodeURIComponent(url)}`);
        }
    };

    const features = [
        {
            icon: <ScanLine className="w-8 h-8" />,
            title: "Deep Vulnerability Scanning",
            description: "Advanced crawler technology discovers hidden endpoints, APIs, and potential entry points across your entire web application.",
            color: "#6366f1"
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "OWASP Top 10 Coverage",
            description: "Comprehensive detection of all OWASP Top 10 vulnerabilities including injection, broken authentication, and security misconfigurations.",
            color: "#10b981"
        },
        {
            icon: <Smartphone className="w-8 h-8" />,
            title: "Mobile App Security",
            description: "Specialized Android and iOS security testing with MASVS compliance. Analyze APKs, source code, and network traffic.",
            color: "#f59e0b"
        },
        {
            icon: <Bot className="w-8 h-8" />,
            title: "AI-Powered Analysis",
            description: "Groq-powered AI assistant provides detailed remediation guidance, CVE explanations, and security best practices.",
            color: "#ec4899"
        },
        {
            icon: <Terminal className="w-8 h-8" />,
            title: "Hands-on Labs",
            description: "Interactive Linux terminal and learning center with real-world security exercises. Master ethical hacking techniques.",
            color: "#14b8a6"
        },
        {
            icon: <Database className="w-8 h-8" />,
            title: "GHDB Dork Patterns",
            description: "Leverage Google Hacking Database patterns to discover exposed data, misconfigurations, and sensitive information leaks.",
            color: "#8b5cf6"
        }
    ];

    const stats = [
        { value: "50+", label: "Vulnerability Patterns", icon: <Bug className="w-6 h-6" /> },
        { value: "100K+", label: "Vulnerabilities Found", icon: <Target className="w-6 h-6" /> },
        { value: "99.9%", label: "Detection Rate", icon: <Activity className="w-6 h-6" /> },
        { value: "<3s", label: "Average Scan Time", icon: <Zap className="w-6 h-6" /> }
    ];

    const scanningFeatures = [
        { icon: <Server />, label: "Server Analysis" },
        { icon: <Globe />, label: "Web Apps" },
        { icon: <Smartphone />, label: "Mobile Apps" },
        { icon: <Code />, label: "APIs & APIs" },
        { icon: <Database />, label: "Databases" },
        { icon: <Lock />, label: "Auth Systems" }
    ];

    const testimonials = [
        {
            name: "Sarah Chen",
            role: "Security Engineer at Stripe",
            content: "VulnScan Pro has become an essential part of our security toolkit. The AI-powered remediation suggestions save hours of manual analysis.",
            avatar: "SC"
        },
        {
            name: "Marcus Johnson",
            role: "CTO at FinTech Startup",
            content: "The depth of vulnerability detection is impressive. We caught critical issues that other scanners missed during our pentest prep.",
            avatar: "MJ"
        },
        {
            name: "Emily Rodriguez",
            role: "DevSecOps Lead at Shopify",
            content: "Integrating VulnScan into our CI/CD pipeline was seamless. The detailed reports help developers understand and fix issues fast.",
            avatar: "ER"
        }
    ];

    const pricingPlans = [
        {
            name: "Starter",
            price: "Free",
            description: "Perfect for individual developers",
            features: ["5 scans/month", "Basic vulnerability detection", "Community support", "Standard reports"],
            popular: false
        },
        {
            name: "Professional",
            price: "$49",
            description: "For growing teams",
            features: ["Unlimited scans", "Advanced detection engine", "Priority support", "API access", "Team collaboration", "Custom reports"],
            popular: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "For organizations",
            features: ["Everything in Pro", "On-premise deployment", "SSO/SAML", "Dedicated support", "SLA guarantee", "Custom integrations"],
            popular: false
        }
    ];

    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="landing-nav" style={{ transform: `translateY(${scrollY > 50 ? '0' : '-100%'})` }}>
                <div className="nav-container">
                    <Link to="/" className="nav-logo">
                        <div className="logo-icon">
                            <Shield className="w-6 h-6" />
                        </div>
                        <span>VulnScan Pro</span>
                    </Link>
                    
                    <div className="nav-links-desktop">
                        <a href="#features">Features</a>
                        <a href="#scanning">Scanning</a>
                        <a href="#pricing">Pricing</a>
                        <a href="#testimonials">Reviews</a>
                    </div>

                    <div className="nav-actions">
                        <Link to="/login" className="btn-ghost">Sign In</Link>
                        <Link to="/register" className="btn-primary-gradient">Get Started Free</Link>
                    </div>

                    <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="mobile-menu">
                        <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
                        <a href="#scanning" onClick={() => setMobileMenuOpen(false)}>Scanning</a>
                        <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
                        <a href="#testimonials" onClick={() => setMobileMenuOpen(false)}>Reviews</a>
                        <div className="mobile-menu-actions">
                            <Link to="/login" className="btn-ghost" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                            <Link to="/register" className="btn-primary-gradient" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-background">
                    <div className="hero-grid"></div>
                    <div className="hero-glow hero-glow-1"></div>
                    <div className="hero-glow hero-glow-2"></div>
                    <div className="hero-particles">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="particle" style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${3 + Math.random() * 4}s`
                            }}></div>
                        ))}
                    </div>
                </div>

                <div className="hero-content">
                    <div className="hero-badge">
                        <Sparkles className="w-4 h-4" />
                        <span>AI-Powered Security Scanner</span>
                    </div>

                    <h1 className="hero-title">
                        Find Every Vulnerability
                        <br />
                        <span className="gradient-text">Before Hackers Do</span>
                    </h1>

                    <p className="hero-description">
                        The most comprehensive web and mobile application security scanner. 
                        Powered by advanced AI, it discovers OWASP Top 10 vulnerabilities, 
                        React/Node.js security issues, and mobile app flaws with unprecedented accuracy.
                    </p>

                    {/* Quick Scan Form */}
                    <div className="quick-scan-container">
                        <form onSubmit={handleQuickScan} className="quick-scan-form">
                            <div className="scan-input-wrapper">
                                <Globe className="scan-input-icon" />
                                <input
                                    type="url"
                                    placeholder="Enter target URL (e.g., https://example.com)"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="scan-input"
                                    required
                                />
                            </div>
                            <button type="submit" className="scan-btn">
                                <Scan className="w-5 h-5" />
                                Start Scan
                            </button>
                        </form>
                        <p className="scan-note">
                            <Lock className="w-4 h-4" />
                            Secure scanning • No credentials required • Instant results
                        </p>
                    </div>

                    {/* Trust Badges */}
                    <div className="trust-section">
                        <span className="trust-label">Trusted by security teams at</span>
                        <div className="trust-logos">
                            <span className="trust-logo">Google</span>
                            <span className="trust-logo">Microsoft</span>
                            <span className="trust-logo">Amazon</span>
                            <span className="trust-logo">Stripe</span>
                            <span className="trust-logo">Shopify</span>
                        </div>
                    </div>
                </div>

                {/* Hero Visual */}
                <div className="hero-visual">
                    <div className="scan-preview">
                        <div className="preview-header">
                            <div className="preview-dots">
                                <span></span><span></span><span></span>
                            </div>
                            <span className="preview-title">VulnScan Pro Scanner</span>
                        </div>
                        <div className="preview-content">
                            <div className="preview-scan-line">
                                <ScanLine className="w-4 h-4" />
                                <span>Scanning target...</span>
                                <div className="scan-progress-bar">
                                    <div className="scan-progress-fill" style={{ width: '65%' }}></div>
                                </div>
                            </div>
                            <div className="preview-vulns">
                                <div className="preview-vuln critical">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>SQL Injection detected</span>
                                    <span className="vuln-line"></span>
                                </div>
                                <div className="preview-vuln high">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>XSS vulnerability found</span>
                                    <span className="vuln-line"></span>
                                </div>
                                <div className="preview-vuln medium">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>Missing security headers</span>
                                    <span className="vuln-line"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="scroll-indicator">
                    <ChevronDown className="w-6 h-6 animate-bounce" />
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section" ref={statsRef}>
                <div className="stats-container">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-card-landing">
                            <div className="stat-icon">{stat.icon}</div>
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section" id="features">
                <div className="section-container">
                    <div className="section-header-center">
                        <span className="section-badge">
                            <Layers3 className="w-4 h-4" />
                            Features
                        </span>
                        <h2 className="section-title">
                            Everything You Need for
                            <br />
                            <span className="gradient-text">Complete Security</span>
                        </h2>
                        <p className="section-description">
                            From automated vulnerability scanning to hands-on security labs, 
                            VulnScan Pro provides the complete toolkit for securing your applications.
                        </p>
                    </div>

                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div 
                                key={index} 
                                className={`feature-card ${activeFeature === index ? 'active' : ''}`}
                                onMouseEnter={() => setActiveFeature(index)}
                            >
                                <div className="feature-icon" style={{ background: `${feature.color}20`, color: feature.color }}>
                                    {feature.icon}
                                </div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                                <div className="feature-indicator" style={{ background: feature.color }}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Scanning Capabilities */}
            <section className="scanning-section" id="scanning">
                <div className="section-container">
                    <div className="scanning-content">
                        <div className="scanning-text">
                            <span className="section-badge">
                                <Scan className="w-4 h-4" />
                                Scanning Engine
                            </span>
                            <h2 className="section-title-left">
                                Deep Scanning That
                                <br />
                                <span className="gradient-text">Never Misses</span>
                            </h2>
                            <p className="scanning-description">
                                Our advanced crawling engine maps your entire application surface, 
                                discovering hidden endpoints, APIs, and attack vectors that other scanners miss.
                            </p>

                            <div className="scanning-features">
                                {scanningFeatures.map((feature, index) => (
                                    <div key={index} className="scanning-feature">
                                        <div className="feature-check">
                                            <CheckCircle className="w-5 h-5" />
                                        </div>
                                        <div className="feature-info">
                                            <div className="feature-icon-small">{feature.icon}</div>
                                            <span>{feature.label}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="scanning-actions">
                                <Link to="/register" className="btn-primary-gradient">
                                    Start Free Scan
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link to="/dorks" className="btn-outline">
                                    <FileSearch className="w-5 h-5" />
                                    Explore Dork Patterns
                                </Link>
                            </div>
                        </div>

                        <div className="scanning-visual">
                            <div className="capabilities-list">
                                <div className="capability-item">
                                    <div className="capability-icon critical">
                                        <Bug className="w-5 h-5" />
                                    </div>
                                    <div className="capability-content">
                                        <h4>OWASP Top 10</h4>
                                        <p>Complete coverage of all critical web application risks</p>
                                    </div>
                                </div>
                                <div className="capability-item">
                                    <div className="capability-icon high">
                                        <Code className="w-5 h-5" />
                                    </div>
                                    <div className="capability-content">
                                        <h4>React & Node.js</h4>
                                        <p>Specialized patterns for modern JavaScript frameworks</p>
                                    </div>
                                </div>
                                <div className="capability-item">
                                    <div className="capability-icon medium">
                                        <Smartphone className="w-5 h-5" />
                                    </div>
                                    <div className="capability-content">
                                        <h4>Mobile Apps</h4>
                                        <p>Android & iOS security testing with MASVS</p>
                                    </div>
                                </div>
                                <div className="capability-item">
                                    <div className="capability-icon info">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <div className="capability-content">
                                        <h4>API Security</h4>
                                        <p>REST, GraphQL, and Microservices vulnerabilities</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Assistant Section */}
            <section className="ai-section">
                <div className="section-container">
                    <div className="ai-content">
                        <div className="ai-visual">
                            <div className="ai-chat-preview">
                                <div className="chat-header">
                                    <Bot className="w-5 h-5" />
                                    <span>AI Security Assistant</span>
                                </div>
                                <div className="chat-messages">
                                    <div className="chat-message bot">
                                        <div className="message-avatar">
                                            <Bot className="w-4 h-4" />
                                        </div>
                                        <div className="message-content">
                                            <p>I found a critical SQL injection vulnerability in the login form. Would you like me to explain the remediation steps?</p>
                                        </div>
                                    </div>
                                    <div className="chat-message user">
                                        <div className="message-content">
                                            <p>Yes, please provide detailed remediation guidance.</p>
                                        </div>
                                    </div>
                                    <div className="chat-message bot">
                                        <div className="message-avatar">
                                            <Bot className="w-4 h-4" />
                                        </div>
                                        <div className="message-content">
                                            <p>Here's how to fix the SQL injection:</p>
                                            <ul>
                                                <li>Use parameterized queries</li>
                                                <li>Implement input validation</li>
                                                <li>Use an ORM like Prisma</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="ai-text">
                            <span className="section-badge">
                                <Brain className="w-4 h-4" />
                                AI-Powered
                            </span>
                            <h2 className="section-title-left">
                                Security Intelligence
                                <br />
                                <span className="gradient-text">On Demand</span>
                            </h2>
                            <p className="ai-description">
                                Our Groq-powered AI assistant doesn't just find vulnerabilities—it helps you 
                                understand and fix them. Get instant explanations, remediation guidance, 
                                CVE analysis, and security best practices.
                            </p>

                            <div className="ai-features">
                                <div className="ai-feature">
                                    <ShieldCheck className="w-5 h-5" />
                                    <span>Detailed remediation steps</span>
                                </div>
                                <div className="ai-feature">
                                    <ScrollText className="w-5 h-5" />
                                    <span>CVE explanations</span>
                                </div>
                                <div className="ai-feature">
                                    <Target className="w-5 h-5" />
                                    <span>Attack scenario simulations</span>
                                </div>
                                <div className="ai-feature">
                                    <Code className="w-5 h-5" />
                                    <span>Secure code examples</span>
                                </div>
                            </div>

                            <Link to="/ai-assistant" className="btn-primary-gradient">
                                <Bot className="w-5 h-5" />
                                Try AI Assistant
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials-section" id="testimonials">
                <div className="section-container">
                    <div className="section-header-center">
                        <span className="section-badge">
                            <Star className="w-4 h-4" />
                            Testimonials
                        </span>
                        <h2 className="section-title">
                            Loved by Security
                            <br />
                            <span className="gradient-text">Professionals</span>
                        </h2>
                    </div>

                    <div className="testimonials-grid">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="testimonial-card">
                                <div className="testimonial-stars">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 filled" />
                                    ))}
                                </div>
                                <p className="testimonial-content">"{testimonial.content}"</p>
                                <div className="testimonial-author">
                                    <div className="author-avatar">{testimonial.avatar}</div>
                                    <div className="author-info">
                                        <h4>{testimonial.name}</h4>
                                        <p>{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="pricing-section" id="pricing">
                <div className="section-container">
                    <div className="section-header-center">
                        <span className="section-badge">
                            <BarChart3 className="w-4 h-4" />
                            Pricing
                        </span>
                        <h2 className="section-title">
                            Simple, Transparent
                            <br />
                            <span className="gradient-text">Pricing</span>
                        </h2>
                        <p className="section-description">
                            Start free, scale as you grow. No hidden fees, no surprises.
                        </p>
                    </div>

                    <div className="pricing-grid">
                        {pricingPlans.map((plan, index) => (
                            <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                                {plan.popular && <span className="popular-badge">Most Popular</span>}
                                <h3 className="plan-name">{plan.name}</h3>
                                <div className="plan-price">{plan.price}</div>
                                <p className="plan-description">{plan.description}</p>
                                <ul className="plan-features">
                                    {plan.features.map((feature, i) => (
                                        <li key={i}>
                                            <CheckCircle className="w-4 h-4" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Link 
                                    to="/register" 
                                    className={`plan-btn ${plan.popular ? 'btn-primary-gradient' : 'btn-outline'}`}
                                >
                                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-container">
                    <div className="cta-glow"></div>
                    <h2 className="cta-title">
                        Ready to Secure Your
                        <br />
                        <span className="gradient-text">Applications?</span>
                    </h2>
                    <p className="cta-description">
                        Join thousands of developers and security teams who trust VulnScan Pro 
                        to protect their applications from vulnerabilities.
                    </p>
                    <div className="cta-actions">
                        <Link to="/register" className="btn-primary-gradient large">
                            Start Free Today
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link to="/dorks" className="btn-outline large">
                            <Hexagon className="w-5 h-5" />
                            Explore Patterns
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-container">
                    <div className="footer-main">
                        <div className="footer-brand">
                            <Link to="/" className="nav-logo">
                                <div className="logo-icon">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <span>VulnScan Pro</span>
                            </Link>
                            <p>Advanced web and mobile application security scanning powered by AI.</p>
                        </div>
                        
                        <div className="footer-links">
                            <div className="footer-column">
                                <h4>Product</h4>
                                <a href="#features">Features</a>
                                <a href="#pricing">Pricing</a>
                                <Link to="/dorks">Dork Patterns</Link>
                                <Link to="/mobile">Mobile Security</Link>
                            </div>
                            <div className="footer-column">
                                <h4>Resources</h4>
                                <a href="#testimonials">Reviews</a>
                                <Link to="/learning">Learning Center</Link>
                                <Link to="/terminal">Terminal Labs</Link>
                                <a href="#">Documentation</a>
                            </div>
                            <div className="footer-column">
                                <h4>Company</h4>
                                <a href="#">About Us</a>
                                <a href="#">Blog</a>
                                <a href="#">Careers</a>
                                <a href="#">Contact</a>
                            </div>
                            <div className="footer-column">
                                <h4>Legal</h4>
                                <a href="#">Privacy Policy</a>
                                <a href="#">Terms of Service</a>
                                <a href="#">Security</a>
                                <a href="#">Compliance</a>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>&copy; 2026 VulnScan Pro. All rights reserved.</p>
                        <div className="footer-social">
                            <a href="#" aria-label="Twitter"><Globe2 className="w-5 h-5" /></a>
                            <a href="#" aria-label="GitHub"><Code className="w-5 h-5" /></a>
                            <a href="#" aria-label="LinkedIn"><Users className="w-5 h-5" /></a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
