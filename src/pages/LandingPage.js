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
    ScrollText, Terminal2, Hexagon, Sun, Moon, Menu as MenuIcon, 
    Eye as EyeIcon, ArrowUp, ChevronRight, Plus, Minus, Mail,
    Github, Twitter, Linkedin, Sparkle, Rocket, Shield2, User, LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [url, setUrl] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);
    const [scrollY, setScrollY] = useState(0);
    const [visibleSections, setVisibleSections] = useState({});

    const handleLogout = () => {
        logout();
    };
    
    const statsRef = useRef(null);
    const featuresRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setVisibleSections(prev => ({
                            ...prev,
                            [entry.target.id]: true
                        }));
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
        return () => observer.disconnect();
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
            icon: <ScanLine className="w-7 h-7" />,
            title: "Deep Vulnerability Scanning",
            description: "Advanced crawler technology discovers hidden endpoints, APIs, and potential entry points across your entire web application.",
            color: "#6366f1",
            colorLight: "#eef2ff"
        },
        {
            icon: <Shield className="w-7 h-7" />,
            title: "OWASP Top 10 Coverage",
            description: "Comprehensive detection of all OWASP Top 10 vulnerabilities including injection, broken authentication, and security misconfigurations.",
            color: "#10b981",
            colorLight: "#ecfdf5"
        },
        {
            icon: <Smartphone className="w-7 h-7" />,
            title: "Mobile App Security",
            description: "Specialized Android and iOS security testing with MASVS compliance. Analyze APKs, source code, and network traffic.",
            color: "#f59e0b",
            colorLight: "#fffbeb"
        },
        {
            icon: <Bot className="w-7 h-7" />,
            title: "AI-Powered Analysis",
            description: "Groq-powered AI assistant provides detailed remediation guidance, CVE explanations, and security best practices.",
            color: "#ec4899",
            colorLight: "#fdf2f8"
        },
        {
            icon: <Terminal className="w-7 h-7" />,
            title: "Hands-on Labs",
            description: "Interactive Linux terminal and learning center with real-world security exercises. Master ethical hacking techniques.",
            color: "#14b8a6",
            colorLight: "#f0fdfa"
        },
        {
            icon: <Database className="w-7 h-7" />,
            title: "GHDB Dork Patterns",
            description: "Leverage Google Hacking Database patterns to discover exposed data, misconfigurations, and sensitive information leaks.",
            color: "#8b5cf6",
            colorLight: "#f5f3ff"
        }
    ];

    const stats = [
        { value: "50+", label: "Vulnerability Patterns", icon: <Bug className="w-5 h-5" /> },
        { value: "100K+", label: "Vulnerabilities Found", icon: <Target className="w-5 h-5" /> },
        { value: "99.9%", label: "Detection Rate", icon: <Activity className="w-5 h-5" /> },
        { value: "<3s", label: "Average Scan Time", icon: <Zap className="w-5 h-5" /> }
    ];

    const scanningFeatures = [
        { icon: <Server className="w-5 h-5" />, label: "Server Analysis" },
        { icon: <Globe className="w-5 h-5" />, label: "Web Apps" },
        { icon: <Smartphone className="w-5 h-5" />, label: "Mobile Apps" },
        { icon: <Code className="w-5 h-5" />, label: "APIs" },
        { icon: <Database className="w-5 h-5" />, label: "Databases" },
        { icon: <Lock className="w-5 h-5" />, label: "Auth Systems" }
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

    const howItWorks = [
        {
            step: "01",
            icon: <Search className="w-8 h-8" />,
            title: "Enter Target URL",
            description: "Simply enter the URL of the web application you want to scan"
        },
        {
            step: "02",
            icon: <Scan className="w-8 h-8" />,
            title: "Start Scanning",
            description: "Our advanced crawler maps your entire application surface"
        },
        {
            step: "03",
            icon: <Shield className="w-8 h-8" />,
            title: "Get Results",
            description: "Receive detailed vulnerability reports with remediation steps"
        }
    ];

    return (
        <div className="landing-page-light">
            {/* Navigation */}
            <nav className="light-nav" style={{ transform: `translateY(${scrollY > 50 ? '-100%' : '0'})` }}>
                <div className="nav-container-light">
                    <Link to="/" className="nav-logo-light">
                        <div className="logo-icon-light">
                            <Shield className="w-5 h-5" />
                        </div>
                        <span>VulnScan Pro</span>
                    </Link>
                    
                    <div className="nav-links-desktop-light">
                        <a href="#features">Features</a>
                        <a href="#how-it-works">How It Works</a>
                        <a href="#pricing">Pricing</a>
                        <a href="#testimonials">Reviews</a>
                    </div>

                    <div className="nav-actions-light">
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="btn-light-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <User className="w-4 h-4" />
                                    {user?.username}
                                </Link>
                                <button onClick={handleLogout} className="btn-light-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn-light-ghost">Sign In</Link>
                                <Link to="/register" className="btn-light-primary">Get Started Free</Link>
                            </>
                        )}
                    </div>

                    <button className="mobile-menu-btn-light" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="mobile-menu-light">
                        <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
                        <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
                        <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
                        <a href="#testimonials" onClick={() => setMobileMenuOpen(false)}>Reviews</a>
                        <div className="mobile-menu-actions-light">
                            {isAuthenticated ? (
                                <>
                                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                        <User className="w-4 h-4 mr-2" />
                                        {user?.username}
                                    </Link>
                                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="btn-primary-light-fill">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                                    <Link to="/register" className="btn-primary-light-fill" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="hero-section-light">
                <div className="hero-bg-light">
                    <div className="hero-grid-light"></div>
                    <div className="hero-blob hero-blob-1"></div>
                    <div className="hero-blob hero-blob-2"></div>
                    <div className="hero-blob hero-blob-3"></div>
                </div>

                <div className="hero-content-light">
                    <div className="hero-badge-light animate-fade-up">
                        <Sparkle className="w-4 h-4" />
                        <span>AI-Powered Security Scanner</span>
                    </div>

                    <h1 className="hero-title-light animate-fade-up" style={{ animationDelay: '0.1s' }}>
                        Find Every Vulnerability
                        <br />
                        <span className="gradient-text-light">Before Hackers Do</span>
                    </h1>

                    <p className="hero-description-light animate-fade-up" style={{ animationDelay: '0.2s' }}>
                        The most comprehensive web and mobile application security scanner. 
                        Powered by advanced AI, it discovers OWASP Top 10 vulnerabilities, 
                        React/Node.js security issues, and mobile app flaws with unprecedented accuracy.
                    </p>

                    {/* Quick Scan Form */}
                    <div className="quick-scan-light animate-fade-up" style={{ animationDelay: '0.3s' }}>
                        <form onSubmit={handleQuickScan} className="quick-scan-form-light">
                            <div className="scan-input-wrapper-light">
                                <Globe className="scan-icon-light" />
                                <input
                                    type="url"
                                    placeholder="Enter target URL (e.g., https://example.com)"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="scan-input-light"
                                    required
                                />
                            </div>
                            <button type="submit" className="scan-btn-light">
                                <Scan className="w-5 h-5" />
                                Start Scan
                            </button>
                        </form>
                        <div className="scan-features-light">
                            <span><Shield className="w-4 h-4" /> Secure scanning</span>
                            <span><Zap className="w-4 h-4" /> No credentials required</span>
                            <span><Rocket className="w-4 h-4" /> Instant results</span>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="trust-section-light animate-fade-up" style={{ animationDelay: '0.4s' }}>
                        <span className="trust-label-light">Trusted by security teams at</span>
                        <div className="trust-logos-light">
                            <span className="trust-logo-light">Google</span>
                            <span className="trust-logo-light">Microsoft</span>
                            <span className="trust-logo-light">Amazon</span>
                            <span className="trust-logo-light">Stripe</span>
                            <span className="trust-logo-light">Shopify</span>
                        </div>
                    </div>
                </div>

                {/* Hero Visual */}
                <div className="hero-visual-light animate-fade-up" style={{ animationDelay: '0.5s' }}>
                    <div className="scan-preview-light">
                        <div className="preview-header-light">
                            <div className="preview-dots-light">
                                <span></span><span></span><span></span>
                            </div>
                            <span className="preview-title-light">VulnScan Pro Scanner</span>
                        </div>
                        <div className="preview-content-light">
                            <div className="preview-scan-animation">
                                <div className="scan-animation-row">
                                    <ScanLine className="w-4 h-4 text-primary" />
                                    <span>Scanning target...</span>
                                    <div className="mini-progress">
                                        <div className="mini-progress-fill"></div>
                                    </div>
                                    <span className="scan-percent">65%</span>
                                </div>
                            </div>
                            <div className="preview-findings">
                                <div className="finding-item critical">
                                    <div className="finding-icon"><AlertTriangle className="w-4 h-4" /></div>
                                    <div className="finding-info">
                                        <span className="finding-title">SQL Injection detected</span>
                                        <span className="finding-path">login.php?id=</span>
                                    </div>
                                    <div className="finding-severity">Critical</div>
                                </div>
                                <div className="finding-item high">
                                    <div className="finding-icon"><AlertTriangle className="w-4 h-4" /></div>
                                    <div className="finding-info">
                                        <span className="finding-title">XSS vulnerability found</span>
                                        <span className="finding-path">search?q=</span>
                                    </div>
                                    <div className="finding-severity">High</div>
                                </div>
                                <div className="finding-item medium">
                                    <div className="finding-icon"><AlertTriangle className="w-4 h-4" /></div>
                                    <div className="finding-info">
                                        <span className="finding-title">Missing security headers</span>
                                        <span className="finding-path">CSP, X-Frame-Options</span>
                                    </div>
                                    <div className="finding-severity">Medium</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="scroll-indicator-light">
                    <ChevronDown className="w-6 h-6 animate-bounce" />
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section-light">
                <div className="stats-container-light">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-card-light animate-on-scroll" ref={statsRef}>
                            <div className="stat-icon-light">{stat.icon}</div>
                            <div className="stat-value-light">{stat.value}</div>
                            <div className="stat-label-light">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section-light" id="features">
                <div className="section-container-light">
                    <div className="section-header-light text-center">
                        <span className="section-badge-light">
                            <Layers3 className="w-4 h-4" />
                            Features
                        </span>
                        <h2 className="section-title-light">
                            Everything You Need for
                            <br />
                            <span className="gradient-text-light">Complete Security</span>
                        </h2>
                        <p className="section-description-light">
                            From automated vulnerability scanning to hands-on security labs, 
                            VulnScan Pro provides the complete toolkit for securing your applications.
                        </p>
                    </div>

                    <div className="features-grid-light">
                        {features.map((feature, index) => (
                            <div 
                                key={index} 
                                className={`feature-card-light ${activeFeature === index ? 'active' : ''}`}
                                onMouseEnter={() => setActiveFeature(index)}
                            >
                                <div 
                                    className="feature-icon-light" 
                                    style={{ background: feature.colorLight, color: feature.color }}
                                >
                                    {feature.icon}
                                </div>
                                <h3 className="feature-title-light">{feature.title}</h3>
                                <p className="feature-description-light">{feature.description}</p>
                                <div className="feature-link-light">
                                    Learn more <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-section-light" id="how-it-works">
                <div className="section-container-light">
                    <div className="section-header-light text-center">
                        <span className="section-badge-light">
                            <Rocket className="w-4 h-4" />
                            How It Works
                        </span>
                        <h2 className="section-title-light">
                            Scan in Minutes,
                            <br />
                            <span className="gradient-text-light">Not Hours</span>
                        </h2>
                    </div>

                    <div className="how-steps-light">
                        {howItWorks.map((step, index) => (
                            <div key={index} className="how-step-light">
                                <div className="step-number-light">{step.step}</div>
                                <div className="step-icon-light">{step.icon}</div>
                                <h3 className="step-title-light">{step.title}</h3>
                                <p className="step-description-light">{step.description}</p>
                                {index < howItWorks.length - 1 && (
                                    <div className="step-connector">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Scanning Capabilities */}
            <section className="capabilities-section-light">
                <div className="section-container-light">
                    <div className="capabilities-grid-light">
                        <div className="capabilities-text-light">
                            <span className="section-badge-light">
                                <Scan className="w-4 h-4" />
                                Scanning Engine
                            </span>
                            <h2 className="section-title-light text-left">
                                Deep Scanning That
                                <br />
                                <span className="gradient-text-light">Never Misses</span>
                            </h2>
                            <p className="capabilities-description-light">
                                Our advanced crawling engine maps your entire application surface, 
                                discovering hidden endpoints, APIs, and attack vectors that other scanners miss.
                            </p>

                            <div className="capabilities-list-light">
                                {scanningFeatures.map((feature, index) => (
                                    <div key={index} className="capability-item-light">
                                        <div className="capability-check">
                                            <CheckCircle className="w-5 h-5" />
                                        </div>
                                        <div className="capability-icon-sm">{feature.icon}</div>
                                        <span>{feature.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="capabilities-actions-light">
                                <Link to="/register" className="btn-primary-light-fill">
                                    Start Free Scan
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link to="/dorks" className="btn-light-outline">
                                    <FileSearch className="w-5 h-5" />
                                    Explore Dork Patterns
                                </Link>
                            </div>
                        </div>

                        <div className="capabilities-visual-light">
                            <div className="capability-cards-light">
                                <div className="cap-card-light">
                                    <div className="cap-card-icon critical">
                                        <Bug className="w-6 h-6" />
                                    </div>
                                    <h4>OWASP Top 10</h4>
                                    <p>Complete coverage of all critical web application risks</p>
                                </div>
                                <div className="cap-card-light">
                                    <div className="cap-card-icon high">
                                        <Code className="w-6 h-6" />
                                    </div>
                                    <h4>React & Node.js</h4>
                                    <p>Specialized patterns for modern JavaScript frameworks</p>
                                </div>
                                <div className="cap-card-light">
                                    <div className="cap-card-icon medium">
                                        <Smartphone className="w-6 h-6" />
                                    </div>
                                    <h4>Mobile Apps</h4>
                                    <p>Android & iOS security testing with MASVS</p>
                                </div>
                                <div className="cap-card-light">
                                    <div className="cap-card-icon info">
                                        <Lock className="w-6 h-6" />
                                    </div>
                                    <h4>API Security</h4>
                                    <p>REST, GraphQL, and Microservices vulnerabilities</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Section */}
            <section className="ai-section-light">
                <div className="section-container-light">
                    <div className="ai-grid-light">
                        <div className="ai-visual-light">
                            <div className="ai-chat-light">
                                <div className="chat-header-light">
                                    <Bot className="w-5 h-5" />
                                    <span>AI Security Assistant</span>
                                    <div className="ai-status">Online</div>
                                </div>
                                <div className="chat-messages-light">
                                    <div className="chat-msg-light bot">
                                        <div className="msg-avatar-light">
                                            <Bot className="w-4 h-4" />
                                        </div>
                                        <div className="msg-content-light">
                                            <p>I found a critical SQL injection vulnerability in the login form. Would you like me to explain the remediation steps?</p>
                                        </div>
                                    </div>
                                    <div className="chat-msg-light user">
                                        <div className="msg-content-light user-msg">
                                            <p>Yes, please provide detailed remediation guidance.</p>
                                        </div>
                                    </div>
                                    <div className="chat-msg-light bot">
                                        <div className="msg-avatar-light">
                                            <Bot className="w-4 h-4" />
                                        </div>
                                        <div className="msg-content-light">
                                            <p>Here's how to fix the SQL injection:</p>
                                            <ul className="remediation-list">
                                                <li>Use parameterized queries</li>
                                                <li>Implement input validation</li>
                                                <li>Use an ORM like Prisma</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="ai-text-light">
                            <span className="section-badge-light">
                                <Brain className="w-4 h-4" />
                                AI-Powered
                            </span>
                            <h2 className="section-title-light text-left">
                                Security Intelligence
                                <br />
                                <span className="gradient-text-light">On Demand</span>
                            </h2>
                            <p className="ai-description-light">
                                Our Groq-powered AI assistant doesn't just find vulnerabilities—it helps you 
                                understand and fix them. Get instant explanations, remediation guidance, 
                                CVE analysis, and security best practices.
                            </p>

                            <div className="ai-features-light">
                                <div className="ai-feature-light">
                                    <ShieldCheck className="w-5 h-5" />
                                    <span>Detailed remediation steps</span>
                                </div>
                                <div className="ai-feature-light">
                                    <ScrollText className="w-5 h-5" />
                                    <span>CVE explanations</span>
                                </div>
                                <div className="ai-feature-light">
                                    <Target className="w-5 h-5" />
                                    <span>Attack scenario simulations</span>
                                </div>
                                <div className="ai-feature-light">
                                    <Code className="w-5 h-5" />
                                    <span>Secure code examples</span>
                                </div>
                            </div>

                            <Link to="/ai-assistant" className="btn-primary-light-fill">
                                <Bot className="w-5 h-5" />
                                Try AI Assistant
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials-section-light" id="testimonials">
                <div className="section-container-light">
                    <div className="section-header-light text-center">
                        <span className="section-badge-light">
                            <Star className="w-4 h-4" />
                            Testimonials
                        </span>
                        <h2 className="section-title-light">
                            Loved by Security
                            <br />
                            <span className="gradient-text-light">Professionals</span>
                        </h2>
                    </div>

                    <div className="testimonials-grid-light">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="testimonial-card-light">
                                <div className="testimonial-stars">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 filled" />
                                    ))}
                                </div>
                                <p className="testimonial-content-light">"{testimonial.content}"</p>
                                <div className="testimonial-author-light">
                                    <div className="author-avatar-light">{testimonial.avatar}</div>
                                    <div className="author-info-light">
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
            <section className="pricing-section-light" id="pricing">
                <div className="section-container-light">
                    <div className="section-header-light text-center">
                        <span className="section-badge-light">
                            <BarChart3 className="w-4 h-4" />
                            Pricing
                        </span>
                        <h2 className="section-title-light">
                            Simple, Transparent
                            <br />
                            <span className="gradient-text-light">Pricing</span>
                        </h2>
                        <p className="section-description-light">
                            Start free, scale as you grow. No hidden fees, no surprises.
                        </p>
                    </div>

                    <div className="pricing-grid-light">
                        {pricingPlans.map((plan, index) => (
                            <div key={index} className={`pricing-card-light ${plan.popular ? 'popular' : ''}`}>
                                {plan.popular && <span className="popular-badge-light">Most Popular</span>}
                                <h3 className="plan-name-light">{plan.name}</h3>
                                <div className="plan-price-light">{plan.price}</div>
                                <p className="plan-description-light">{plan.description}</p>
                                <ul className="plan-features-light">
                                    {plan.features.map((feature, i) => (
                                        <li key={i}>
                                            <CheckCircle className="w-4 h-4" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Link 
                                    to="/register" 
                                    className={`plan-btn-light ${plan.popular ? 'btn-primary-light-fill' : 'btn-light-outline'}`}
                                >
                                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section-light">
                <div className="cta-container-light">
                    <div className="cta-blob-light"></div>
                    <h2 className="cta-title-light">
                        Ready to Secure Your
                        <br />
                        <span className="gradient-text-light">Applications?</span>
                    </h2>
                    <p className="cta-description-light">
                        Join thousands of developers and security teams who trust VulnScan Pro 
                        to protect their applications from vulnerabilities.
                    </p>
                    <div className="cta-actions-light">
                        <Link to="/register" className="btn-primary-light-fill large">
                            Start Free Today
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link to="/dorks" className="btn-light-outline large">
                            <Hexagon className="w-5 h-5" />
                            Explore Patterns
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer-light">
                <div className="footer-container-light">
                    <div className="footer-main-light">
                        <div className="footer-brand-light">
                            <Link to="/" className="nav-logo-light">
                                <div className="logo-icon-light">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <span>VulnScan Pro</span>
                            </Link>
                            <p>Advanced web and mobile application security scanning powered by AI.</p>
                            <div className="footer-social-light">
                                <a href="#"><Twitter className="w-5 h-5" /></a>
                                <a href="#"><Github className="w-5 h-5" /></a>
                                <a href="#"><Linkedin className="w-5 h-5" /></a>
                            </div>
                        </div>
                        
                        <div className="footer-links-light">
                            <div className="footer-col-light">
                                <h4>Product</h4>
                                <a href="#features">Features</a>
                                <a href="#pricing">Pricing</a>
                                <Link to="/dorks">Dork Patterns</Link>
                                <Link to="/mobile">Mobile Security</Link>
                            </div>
                            <div className="footer-col-light">
                                <h4>Resources</h4>
                                <a href="#testimonials">Reviews</a>
                                <Link to="/learning">Learning Center</Link>
                                <Link to="/terminal">Terminal Labs</Link>
                                <a href="#">Documentation</a>
                            </div>
                            <div className="footer-col-light">
                                <h4>Company</h4>
                                <a href="#">About Us</a>
                                <a href="#">Blog</a>
                                <a href="#">Careers</a>
                                <a href="#">Contact</a>
                            </div>
                            <div className="footer-col-light">
                                <h4>Legal</h4>
                                <a href="#">Privacy Policy</a>
                                <a href="#">Terms of Service</a>
                                <a href="#">Security</a>
                                <a href="#">Compliance</a>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom-light">
                        <p>© 2026 VulnScan Pro. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
