import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Shield, Scan, Zap, Lock, Server, Smartphone, Terminal, 
    Code, Database, Globe, ChevronDown, ArrowRight, CheckCircle,
    AlertTriangle, Eye, Bot, Layers, Activity, Cpu, 
    Play, Pause, Menu, X, Star, Users, Clock, Globe2, Award,
    BarChart3, Target, Bug, FileSearch, Terminal as TerminalIcon,
    Layers3, Sparkles, ArrowUpRight, Download, ExternalLink, 
    Brain, Search, ScanLine, KeyRound, Fingerprint, Wifi, Bug2,
    ScrollText, Terminal2, Hexagon, Sun, Moon, Menu as MenuIcon, 
    Eye as EyeIcon, ArrowUp, ChevronRight, Plus, Minus, Mail,
    Github, Twitter, Linkedin, Sparkle, Rocket, Shield2, User, LogOut,
    Check, TrendingUp, Clock3, Award as AwardIcon, Building2,
    Lock as LockIcon, ShieldAlert, ShieldCheck, FingerprintIcon,
    Wifi as WifiIcon, Smartphone as SmartphoneIcon, Code2, Database as DatabaseIcon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import PublicNavbar from '../../components/PublicNavbar';

const LandingPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [url, setUrl] = useState('');
    const [activeFeature, setActiveFeature] = useState(0);
    const [scrollY, setScrollY] = useState(0);
    const [visibleSections, setVisibleSections] = useState({});
    const [openFaq, setOpenFaq] = useState(null);
    const [showStickyCTA, setShowStickyCTA] = useState(false);
    
    const statsRef = useRef(null);
    const featuresRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
            setShowStickyCTA(window.scrollY > 500);
        };
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
        { value: "99.9%", label: "Detection Accuracy", icon: <Target className="w-5 h-5" /> },
        { value: "< 3 min", label: "Average Scan Time", icon: <Zap className="w-5 h-5" /> },
        { value: "50+", label: "Vulnerability Types", icon: <Bug className="w-5 h-5" /> },
        { value: "2.4M+", label: "Scans Completed", icon: <Activity className="w-5 h-5" /> },
        { value: "10K+", label: "Active Users", icon: <Users className="w-5 h-5" /> }
    ];

    const problemStats = [
        { value: "60%", label: "of breaches target web applications" },
        { value: "$4.5M", label: "average cost of a data breach" },
        { value: "230%", label: "increase in attacks since 2020" }
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
            role: "Security Engineer",
            company: "Series B Fintech",
            content: "VulnScan Pro helped us identify critical SQL injection vulnerabilities that would have cost us $2M in remediation. The AI remediation guidance saved our team 3 weeks of research.",
            avatar: "SC"
        },
        {
            name: "Marcus Johnson",
            role: "CISO",
            company: "Enterprise SaaS",
            content: "We scanned 47 vulnerabilities that our previous scanner missed. The automated reporting made board presentations effortless.",
            avatar: "MJ"
        },
        {
            name: "Emily Rodriguez",
            role: "DevSecOps Lead",
            company: "YC-Backed Startup",
            content: "Integrating VulnScan into our CI/CD pipeline was seamless. The detailed reports help developers understand and fix issues 85% faster.",
            avatar: "ER"
        }
    ];

    const pricingPlans = [
        {
            name: "Starter",
            price: "$0",
            period: "/mo",
            description: "Perfect for individual developers",
            features: ["5 scans/month", "Basic vulnerability detection", "Community support", "Standard reports"],
            popular: false
        },
        {
            name: "Professional",
            price: "$49",
            period: "/mo",
            description: "For growing security teams",
            features: ["Unlimited scans", "Advanced detection engine", "Priority support", "API access", "Team collaboration", "Custom reports"],
            popular: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            period: "",
            description: "For large organizations",
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
            description: "Receive detailed vulnerability reports with AI-powered remediation"
        }
    ];

    const faqs = [
        {
            question: "Is VulnScan Pro safe to use on production applications?",
            answer: "Yes, absolutely. Our scanning is completely read-only and non-intrusive. We never modify or store your data, and we're SOC 2 Type II compliant. All scans are performed safely without affecting your application's performance."
        },
        {
            question: "How is VulnScan Pro different from other vulnerability scanners?",
            answer: "Unlike traditional scanners, VulnScan Pro provides AI-powered remediation guidance that tells you exactly how to fix each vulnerability. We also cover web apps, mobile apps (MASVS), APIs, and cloud infrastructure in a single platform - no need for multiple tools."
        },
        {
            question: "Can I integrate VulnScan into my CI/CD pipeline?",
            answer: "Yes! We offer API access, GitHub Actions integration, webhooks, and direct integrations with Jenkins, GitLab CI, and GitHub Actions for automated security scanning in your development workflow."
        },
        {
            question: "What types of vulnerabilities do you detect?",
            answer: "We detect 50+ vulnerability types including all OWASP Top 10 categories: SQL injection, XSS, CSRF, broken authentication, sensitive data exposure, XML external entities, broken access control, security misconfigurations, and more."
        },
        {
            question: "Do you offer on-premise deployment?",
            answer: "Yes, our Enterprise plan includes on-premise deployment options for organizations with strict data residency requirements. Contact our sales team for details."
        }
    ];

    const securityBadges = [
        { name: "SOC 2 Type II", icon: <ShieldCheck className="w-5 h-5" /> },
        { name: "ISO 27001", icon: <Lock className="w-5 h-5" /> },
        { name: "GDPR Compliant", icon: <Globe className="w-5 h-5" /> },
        { name: "OWASP Corporate", icon: <ShieldAlert className="w-5 h-5" /> }
    ];

    const comparisonData = [
        { feature: "Scan Time", vulnscan: "< 3 minutes", traditional: "2-4 weeks", others: "30-60 min" },
        { feature: "AI Remediation", vulnscan: "✓ Included", traditional: "✗ Manual", others: "✗ Limited" },
        { feature: "Mobile Testing", vulnscan: "✓ Full MASVS", traditional: "✓ Extra cost", others: "✗ Add-on" },
        { feature: "Cost per scan", vulnscan: "$0-49/mo", traditional: "$15K-50K", others: "$500-2K" },
        { feature: "API Access", vulnscan: "✓ Included", traditional: "✗", others: "✓ Paid" }
    ];

    return (
        <div className="landing-page-light">
            {/* Public Navigation */}
            <PublicNavbar />

            {/* Hero Section - New Design */}
            <section className="new-hero-section">
                <div className="new-hero-bg">
                    <div className="new-hero-grid"></div>
                    <div className="new-hero-blob blob-1"></div>
                    <div className="new-hero-blob blob-2"></div>
                    <div className="new-hero-blob blob-3"></div>
                </div>

                <div className="new-hero-container">
                    <div className="new-hero-content">
                        <div className="new-hero-badge animate-fade-up">
                            <Sparkles className="w-4 h-4" />
                            <span>🏆 #1 AI-Powered AppSec Platform</span>
                        </div>

                        <h1 className="new-hero-title animate-fade-up" style={{ animationDelay: '0.1s' }}>
                            Find & Fix Application Vulnerabilities
                            <br />
                            <span className="gradient-text">Before They Cost You Millions</span>
                        </h1>

                        <p className="new-hero-description animate-fade-up" style={{ animationDelay: '0.2s' }}>
                            Automated security scanning with AI remediation guidance. Scan web apps, 
                            mobile apps, APIs & cloud infrastructure in minutes—not weeks. Trusted by 
                            security teams at fintech unicorns and enterprises.
                        </p>

                        {/* Quick Scan Form */}
                        <div className="new-quick-scan animate-fade-up" style={{ animationDelay: '0.3s' }}>
                            <form onSubmit={handleQuickScan} className="new-scan-form">
                                <div className="new-scan-input-wrapper">
                                    <Globe className="new-scan-icon" />
                                    <input
                                        type="url"
                                        placeholder="Enter your app URL (e.g., https://yourapp.com)"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        className="new-scan-input"
                                        required
                                    />
                                </div>
                                <button type="submit" className="new-scan-btn">
                                    <ShieldCheck className="w-5 h-5" />
                                    Start Free Scan
                                </button>
                            </form>
                            <div className="new-scan-features">
                                <span><CheckCircle className="w-4 h-4" /> No credit card</span>
                                <span><Clock3 className="w-4 h-4" /> Results in &lt; 3 min</span>
                                <span><ShieldCheck className="w-4 h-4" /> SOC2 Compliant</span>
                            </div>
                        </div>

                        {/* Live Stats */}
                        <div className="new-hero-stats animate-fade-up" style={{ animationDelay: '0.4s' }}>
                            <div className="hero-stat">
                                <span className="hero-stat-value">99.9%</span>
                                <span className="hero-stat-label">Detection Rate</span>
                            </div>
                            <div className="hero-stat-divider"></div>
                            <div className="hero-stat">
                                <span className="hero-stat-value">50+</span>
                                <span className="hero-stat-label">Vulnerability Types</span>
                            </div>
                            <div className="hero-stat-divider"></div>
                            <div className="hero-stat">
                                <span className="hero-stat-value">2.4M+</span>
                                <span className="hero-stat-label">Scans Completed</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero Visual */}
                    <div className="new-hero-visual animate-fade-up" style={{ animationDelay: '0.5s' }}>
                        <div className="new-scan-preview">
                            <div className="preview-header">
                                <div className="preview-dots">
                                    <span></span><span></span><span></span>
                                </div>
                                <span className="preview-title">VulnScan Pro Scanner</span>
                            </div>
                            <div className="preview-content">
                                <div className="preview-scan-animation">
                                    <div className="scan-animation-row">
                                        <ScanLine className="w-4 h-4" style={{ color: '#6366f1' }} />
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
                </div>

                <div className="scroll-indicator">
                    <ChevronDown className="w-6 h-6 animate-bounce" />
                </div>
            </section>

            {/* Problem Agitation Section */}
            <section className="problem-section" id="problem">
                <div className="problem-container">
                    <div className="problem-header">
                        <span className="problem-badge">
                            <ShieldAlert className="w-4 h-4" />
                            Your Apps Are Under Attack
                        </span>
                        <h2 className="problem-title">
                            The Cost of <span className="gradient-text">Inaction</span>
                        </h2>
                        <p className="problem-description">
                            Cyber attacks on web applications are at an all-time high. 
                            Don't wait for a breach to take action.
                        </p>
                    </div>
                    
                    <div className="problem-stats">
                        {problemStats.map((stat, index) => (
                            <div key={index} className="problem-stat-card">
                                <div className="problem-stat-value">{stat.value}</div>
                                <div className="problem-stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="problem-cta">
                        <Link to="/register" className="btn-primary-new">
                            <ShieldCheck className="w-5 h-5" />
                            See How VulnScan Pro Helps
                        </Link>
                    </div>
                </div>
            </section>

            {/* Security Certifications */}
            <section className="security-badges-section">
                <div className="security-container">
                    <p className="security-label">Enterprise-Grade Security & Compliance</p>
                    <div className="security-badges">
                        {securityBadges.map((badge, index) => (
                            <div key={index} className="security-badge-item">
                                <div className="security-badge-icon">{badge.icon}</div>
                                <span>{badge.name}</span>
                            </div>
                        ))}
                    </div>
                    <div className="security-features">
                        <span><CheckCircle className="w-4 h-4" /> End-to-end encryption</span>
                        <span><CheckCircle className="w-4 h-4" /> No data retention</span>
                        <span><CheckCircle className="w-4 h-4" /> Audit logs available</span>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section-light" id="stats">
                <div className="stats-container-light">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-card-light" ref={statsRef}>
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
                            Built for Modern DevSecOps
                        </span>
                        <h2 className="section-title-light">
                            Complete Application Security
                            <br />
                            <span className="gradient-text-light">In One Platform</span>
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
            <section className="capabilities-section-light" id="capabilities">
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

            {/* Comparison Table */}
            <section className="comparison-section" id="comparison">
                <div className="section-container-light">
                    <div className="section-header-light text-center">
                        <span className="section-badge-light">
                            <BarChart3 className="w-4 h-4" />
                            Why Choose VulnScan Pro
                        </span>
                        <h2 className="section-title-light">
                            Security That <span className="gradient-text-light">Actually Works</span>
                        </h2>
                    </div>

                    <div className="comparison-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Feature</th>
                                    <th className="highlight-col">VulnScan Pro</th>
                                    <th>Traditional Pentest</th>
                                    <th>Other Scanners</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonData.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.feature}</td>
                                        <td className="highlight-col">{row.vulnscan}</td>
                                        <td>{row.traditional}</td>
                                        <td>{row.others}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="comparison-cta">
                        <Link to="/register" className="btn-primary-new">
                            Start Free Comparison →
                        </Link>
                    </div>
                </div>
            </section>

            {/* AI Section */}
            <section className="ai-section-light" id="ai">
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
                            Trusted by Security Teams
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
                                        <p>{testimonial.role}, {testimonial.company}</p>
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
                            Simple Pricing
                        </span>
                        <h2 className="section-title-light">
                            Start Free, Scale as You Grow
                        </h2>
                        <p className="section-description-light">
                            No hidden fees. No surprises. Choose the plan that fits your needs.
                        </p>
                    </div>

                    <div className="pricing-grid-light">
                        {pricingPlans.map((plan, index) => (
                            <div key={index} className={`pricing-card-light ${plan.popular ? 'popular' : ''}`}>
                                {plan.popular && <span className="popular-badge-light">Most Popular</span>}
                                <h3 className="plan-name-light">{plan.name}</h3>
                                <div className="plan-price-light">
                                    {plan.price}
                                    {plan.period && <span className="plan-period">{plan.period}</span>}
                                </div>
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
                                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section" id="faq">
                <div className="faq-container">
                    <div className="section-header-light text-center">
                        <span className="section-badge-light">
                            <ScrollText className="w-4 h-4" />
                            FAQ
                        </span>
                        <h2 className="section-title-light">
                            Frequently Asked <span className="gradient-text-light">Questions</span>
                        </h2>
                    </div>

                    <div className="faq-list">
                        {faqs.map((faq, index) => (
                            <div 
                                key={index} 
                                className={`faq-item ${openFaq === index ? 'open' : ''}`}
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                            >
                                <div className="faq-question">
                                    <span>{faq.question}</span>
                                    {openFaq === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                </div>
                                {openFaq === index && (
                                    <div className="faq-answer">
                                        <p>{faq.answer}</p>
                                    </div>
                                )}
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

            {/* Sticky CTA Bar */}
            {showStickyCTA && (
                <div className="sticky-cta-bar">
                    <div className="sticky-cta-content">
                        <span className="sticky-cta-text">
                            <strong>Ready to secure your applications?</strong>
                            Start your free scan in 30 seconds.
                        </span>
                        <div className="sticky-cta-buttons">
                            <Link to="/register" className="sticky-cta-primary">Start Free Scan →</Link>
                            <Link to="/login" className="sticky-cta-secondary">Book Demo</Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="footer-light">
                <div className="footer-container-light">
                    <div className="footer-main-light">
                        <div className="footer-brand-light">
                            <Link to="/" className="nav-logo-light">
                                <div className="logo-icon-light">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <span>VulnScan<span className="gradient-text-light">Pro</span></span>
                            </Link>
                            <p>Advanced web and mobile application security scanning powered by AI.</p>
                            <div className="security-badges-footer">
                                {securityBadges.map((badge, index) => (
                                    <span key={index} className="footer-badge">{badge.name}</span>
                                ))}
                            </div>
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
                                <a href="#testimonials">Case Studies</a>
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
                                <a href="#">Disclosure Policy</a>
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