import React, { useState } from 'react';
import { Link, useLocation, Routes, Route, Outlet } from 'react-router-dom';
import { BookOpen, FlaskConical, ChevronRight, PlayCircle, CheckCircle, Lock, Globe, Shield, Terminal, FileCode, Activity, Eye, Database, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

// Lab Module Components
const LabOverview = ({ theme }) => (
    <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '24px' }}>
        <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px', color: theme.text }}>
            <FlaskConical size={24} style={{ color: '#6366f1' }} />
            WEB-200: Foundational Web Application Assessments
        </h2>
        <p style={{ color: theme.textSecondary, marginBottom: '24px', lineHeight: '1.6' }}>
            Welcome to the WEB-200 Learning Path. This course provides foundational knowledge and practical skills
            in web application security testing using Kali Linux. Work through each module to build your skills
            from basic reconnaissance to advanced exploitation techniques.
        </p>

        <div className="grid grid-2" style={{ marginBottom: '24px' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid #6366f1', borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ marginBottom: '12px', color: theme.text }}>Course Objectives</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', color: theme.textSecondary }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={16} style={{ color: '#22c55e' }} />
                        Understand web application architecture
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={16} style={{ color: '#22c55e' }} />
                        Master Burp Suite and web proxies
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={16} style={{ color: '#22c55e' }} />
                        Identify and exploit common vulnerabilities
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={16} style={{ color: '#22c55e' }} />
                        Document and report findings
                    </li>
                </ul>
            </div>
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ marginBottom: '12px', color: theme.text }}>Prerequisites</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', color: theme.textSecondary }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Lock size={16} style={{ color: '#ef4444' }} />
                        Basic Linux command line
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Lock size={16} style={{ color: '#ef4444' }} />
                        Understanding of HTTP/HTTPS
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Lock size={16} style={{ color: '#ef4444' }} />
                        Basic HTML/JavaScript knowledge
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Lock size={16} style={{ color: '#ef4444' }} />
                        Familiarity with Kali Linux
                    </li>
                </ul>
            </div>
        </div>

        <div style={{ background: theme.codeBg, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ marginBottom: '16px', color: theme.text }}>Lab Environment</h3>
            <p style={{ color: theme.textSecondary, marginBottom: '16px' }}>
                All labs are hands-on exercises in isolated environments. Make sure you have:
            </p>
            <div className="grid grid-3">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: theme.bgCard, borderRadius: '8px' }}>
                    <Terminal size={24} style={{ color: '#6366f1' }} />
                    <div>
                        <div style={{ fontWeight: 600, color: theme.text }}>Kali Linux</div>
                        <div style={{ fontSize: '12px', color: theme.textSecondary }}>Latest Version</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: theme.bgCard, borderRadius: '8px' }}>
                    <Globe size={24} style={{ color: '#6366f1' }} />
                    <div>
                        <div style={{ fontWeight: 600, color: theme.text }}>VPN Access</div>
                        <div style={{ fontSize: '12px', color: theme.textSecondary }}>Lab Connection</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: theme.bgCard, borderRadius: '8px' }}>
                    <Shield size={24} style={{ color: '#6366f1' }} />
                    <div>
                        <div style={{ fontWeight: 600, color: theme.text }}>Burp Suite</div>
                        <div style={{ fontSize: '12px', color: theme.textSecondary }}>Professional Edition</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ReconnaissanceLab = ({ theme }) => (
    <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px' }}>
                <Eye size={32} style={{ color: '#6366f1' }} />
            </div>
            <div>
                <h2 style={{ color: theme.text }}>Module 1: Information Gathering & Reconnaissance</h2>
                <p style={{ color: theme.textSecondary }}>Learn passive and active reconnaissance techniques</p>
            </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3].map((lab) => (
                <div key={lab} style={{ 
                    background: theme.codeBg, 
                    border: `1px solid ${theme.border}`, 
                    borderRadius: '12px', 
                    padding: '20px',
                    borderLeft: '4px solid #6366f1'
                }}>
                    <h3 style={{ marginBottom: '12px', color: '#6366f1' }}>Lab 1.{lab}: {[lab === 1 ? 'Passive Reconnaissance' : lab === 2 ? 'Active Scanning' : 'Web Technology Fingerprinting']}</h3>
                    <p style={{ color: theme.textSecondary, marginBottom: '16px' }}>
                        {[lab === 1 ? 'Gather information about target without direct interaction' : lab === 2 ? 'Perform active enumeration of web applications' : 'Identify technologies and frameworks used by web applications']}
                    </p>
                    <div style={{ background: theme.codeBg, padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                        <h4 style={{ fontSize: '14px', marginBottom: '8px', color: theme.text }}>Objectives:</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', color: theme.textSecondary }}>
                            {[lab === 1 ? ['Use whois to gather domain registration information', 'Perform DNS enumeration with dig and nslookup', 'Discover subdomains using various techniques', 'Gather information from search engines and public sources'] : lab === 2 ? ['Port scan with nmap to discover services', 'Identify web server technologies and versions', 'Directory enumeration with gobuster/dirb', 'Analyze robots.txt and sitemap.xml'] : ['Use Wappalyzer and builtwith for tech detection', 'Analyze HTTP headers for server information', 'Identify JavaScript frameworks and libraries', 'Detect content management systems']].map((item, i) => (
                                <li key={i}>• {item}</li>
                            ))}
                        </ul>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>
                            <PlayCircle size={16} />
                            Start Lab
                        </button>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: theme.codeBg, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.text, cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>
                            View Write-up
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const ProxyLab = ({ theme }) => (
    <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px' }}>
                <Activity size={32} style={{ color: '#6366f1' }} />
            </div>
            <div>
                <h2 style={{ color: theme.text }}>Module 2: Web Application Proxies</h2>
                <p style={{ color: theme.textSecondary }}>Master Burp Suite and web proxy techniques</p>
            </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3].map((lab) => (
                <div key={lab} style={{ background: theme.codeBg, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '20px', borderLeft: '4px solid #6366f1' }}>
                    <h3 style={{ marginBottom: '12px', color: '#6366f1' }}>Lab 2.{lab}: {[lab === 1 ? 'Burp Suite Basics' : lab === 2 ? 'Target Analysis with Burp' : 'Intruder Automation']}</h3>
                    <p style={{ color: theme.textSecondary, marginBottom: '16px' }}>{[lab === 1 ? 'Configure and use Burp Suite for intercepting HTTP traffic' : lab === 2 ? "Use Burp's target and spider functionality" : 'Automate attacks using Burp Intruder']}</p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}><PlayCircle size={16} /> Start Lab</button>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: theme.codeBg, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.text, cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>View Write-up</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const XSSLab = ({ theme }) => (
    <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px' }}>
                <FileCode size={32} style={{ color: '#ef4444' }} />
            </div>
            <div>
                <h2 style={{ color: theme.text }}>Module 3: Cross-Site Scripting (XSS)</h2>
                <p style={{ color: theme.textSecondary }}>Identify and exploit XSS vulnerabilities</p>
            </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3].map((lab) => (
                <div key={lab} style={{ background: theme.codeBg, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '20px', borderLeft: '4px solid #ef4444' }}>
                    <h3 style={{ marginBottom: '12px', color: '#ef4444' }}>Lab 3.{lab}: {[lab === 1 ? 'Reflected XSS' : lab === 2 ? 'Stored XSS' : 'DOM-based XSS']}</h3>
                    <p style={{ color: theme.textSecondary, marginBottom: '16px' }}>{[lab === 1 ? 'Find and exploit reflected Cross-Site Scripting vulnerabilities' : lab === 2 ? 'Exploit persistent/stored XSS vulnerabilities' : 'Identify and exploit DOM-based XSS vulnerabilities']}</p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}><PlayCircle size={16} /> Start Lab</button>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: theme.codeBg, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.text, cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>View Write-up</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const SQLILab = ({ theme }) => (
    <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px' }}>
                <Database size={32} style={{ color: '#ef4444' }} />
            </div>
            <div>
                <h2 style={{ color: theme.text }}>Module 4: SQL Injection</h2>
                <p style={{ color: theme.textSecondary }}>Exploit SQL injection vulnerabilities</p>
            </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3].map((lab) => (
                <div key={lab} style={{ background: theme.codeBg, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '20px', borderLeft: '4px solid #ef4444' }}>
                    <h3 style={{ marginBottom: '12px', color: '#ef4444' }}>Lab 4.{lab}: {[lab === 1 ? 'Basic SQL Injection' : lab === 2 ? 'Blind SQL Injection' : 'Advanced SQL Injection']}</h3>
                    <p style={{ color: theme.textSecondary, marginBottom: '16px' }}>{[lab === 1 ? 'Identify and exploit basic SQL injection points' : lab === 2 ? 'Exploit blind SQL injection vulnerabilities' : 'Advanced SQL injection techniques and evasion']}</p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}><PlayCircle size={16} /> Start Lab</button>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: theme.codeBg, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.text, cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>View Write-up</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const AuthenticationLab = ({ theme }) => (
    <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px' }}>
                <Lock size={32} style={{ color: '#f59e0b' }} />
            </div>
            <div>
                <h2 style={{ color: theme.text }}>Module 5: Authentication & Session Management</h2>
                <p style={{ color: theme.textSecondary }}>Test authentication mechanisms and session handling</p>
            </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2].map((lab) => (
                <div key={lab} style={{ background: theme.codeBg, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '20px', borderLeft: '4px solid #f59e0b' }}>
                    <h3 style={{ marginBottom: '12px', color: '#f59e0b' }}>Lab 5.{lab}: {[lab === 1 ? 'Authentication Bypass' : 'Session Management']}</h3>
                    <p style={{ color: theme.textSecondary, marginBottom: '16px' }}>{[lab === 1 ? 'Identify and exploit authentication weaknesses' : 'Test session handling and token security']}</p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}><PlayCircle size={16} /> Start Lab</button>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: theme.codeBg, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.text, cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>View Write-up</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const Learning = () => {
    const { isDark, toggleTheme } = useTheme();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    const theme = isDark ? {
        bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        bgCard: 'rgba(255,255,255,0.05)',
        border: 'rgba(255,255,255,0.1)',
        text: '#f1f5f9',
        textSecondary: '#94a3b8',
        codeBg: 'rgba(0,0,0,0.4)',
    } : {
        bg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        bgCard: '#ffffff',
        border: 'rgba(0,0,0,0.08)',
        text: '#0f172a',
        textSecondary: '#475569',
        codeBg: 'rgba(15, 23, 42, 0.05)',
    };

    const menuItems = [
        { path: '/learning', label: 'Course Overview', icon: BookOpen },
        { path: '/learning/recon', label: '1. Reconnaissance', icon: Eye },
        { path: '/learning/proxy', label: '2. Web Proxies', icon: Activity },
        { path: '/learning/xss', label: '3. XSS Attacks', icon: FileCode },
        { path: '/learning/sqli', label: '4. SQL Injection', icon: Database },
        { path: '/learning/auth', label: '5. Authentication', icon: Lock }
    ];

    const isActive = (path) => {
        if (path === '/learning') {
            return location.pathname === '/learning' || location.pathname === '/learning/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div style={{ minHeight: '100vh', background: theme.bg }}>
            {/* Header */}
            <div style={{ background: theme.bgCard, borderBottom: `1px solid ${theme.border}`, padding: '24px 0' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <BookOpen size={32} style={{ color: '#6366f1' }} />
                        <div>
                            <h1 style={{ fontSize: '28px', fontWeight: '700', color: theme.text, marginBottom: '4px' }}>Learning Center</h1>
                            <p style={{ color: theme.textSecondary }}>Offensive Security WEB-200: Foundational Web Application Assessments</p>
                        </div>
                    </div>
                    <button onClick={toggleTheme} style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '12px', cursor: 'pointer', display: 'flex' }}>
                        {isDark ? <Sun size={20} style={{ color: '#fbbf24' }} /> : <Moon size={20} style={{ color: '#6366f1' }} />}
                    </button>
                </div>
            </div>

            <div className="container" style={{ padding: '24px 0' }}>
                <div style={{ display: 'flex', gap: '24px' }}>
                    {/* Sidebar Menu */}
                    <div style={{ width: isMenuOpen ? '280px' : '60px', flexShrink: 0, transition: 'width 0.3s ease' }}>
                        <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '16px' }}>
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ChevronRight size={20} style={{ transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
                                {isMenuOpen && <span style={{ fontSize: '14px' }}>Menu</span>}
                            </button>
                            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.path);
                                    return (
                                        <Link key={item.path} to={item.path} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', textDecoration: 'none', color: active ? '#6366f1' : theme.textSecondary, background: active ? 'rgba(99, 102, 241, 0.1)' : 'transparent', fontWeight: active ? 600 : 400, fontSize: '14px', transition: 'all 0.2s' }}>
                                            <Icon size={18} />
                                            {isMenuOpen && <span>{item.label}</span>}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div style={{ flex: 1 }}>
                        <Routes>
                            <Route path="/" element={<LabOverview theme={theme} />} />
                            <Route path="/recon" element={<ReconnaissanceLab theme={theme} />} />
                            <Route path="/proxy" element={<ProxyLab theme={theme} />} />
                            <Route path="/xss" element={<XSSLab theme={theme} />} />
                            <Route path="/sqli" element={<SQLILab theme={theme} />} />
                            <Route path="/auth" element={<AuthenticationLab theme={theme} />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Learning;
