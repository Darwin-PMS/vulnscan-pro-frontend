import React, { useState } from 'react';
import { Link, useLocation, Routes, Route, Outlet } from 'react-router-dom';
import { BookOpen, FlaskConical, ChevronRight, PlayCircle, CheckCircle, Lock, Globe, Shield, Terminal, FileCode, Activity, Eye, Database } from 'lucide-react';

// Lab Module Components
const LabOverview = () => (
    <div className="card">
        <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FlaskConical size={24} style={{ color: 'var(--primary-color)' }} />
            WEB-200: Foundational Web Application Assessments
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.6' }}>
            Welcome to the WEB-200 Learning Path. This course provides foundational knowledge and practical skills
            in web application security testing using Kali Linux. Work through each module to build your skills
            from basic reconnaissance to advanced exploitation techniques.
        </p>

        <div className="grid grid-2" style={{ marginBottom: '24px' }}>
            <div className="card" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
                <h3 style={{ marginBottom: '12px' }}>Course Objectives</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={16} style={{ color: 'var(--secondary-color)' }} />
                        Understand web application architecture
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={16} style={{ color: 'var(--secondary-color)' }} />
                        Master Burp Suite and web proxies
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={16} style={{ color: 'var(--secondary-color)' }} />
                        Identify and exploit common vulnerabilities
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={16} style={{ color: 'var(--secondary-color)' }} />
                        Document and report findings
                    </li>
                </ul>
            </div>
            <div className="card" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                <h3 style={{ marginBottom: '12px' }}>Prerequisites</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Lock size={16} style={{ color: 'var(--danger-color)' }} />
                        Basic Linux command line
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Lock size={16} style={{ color: 'var(--danger-color)' }} />
                        Understanding of HTTP/HTTPS
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Lock size={16} style={{ color: 'var(--danger-color)' }} />
                        Basic HTML/JavaScript knowledge
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Lock size={16} style={{ color: 'var(--danger-color)' }} />
                        Familiarity with Kali Linux
                    </li>
                </ul>
            </div>
        </div>

        <div className="card" style={{ background: 'var(--dark-bg)' }}>
            <h3 style={{ marginBottom: '16px' }}>Lab Environment</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                All labs are hands-on exercises in isolated environments. Make sure you have:
            </p>
            <div className="grid grid-3">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'var(--card-bg)', borderRadius: '8px' }}>
                    <Terminal size={24} style={{ color: 'var(--primary-color)' }} />
                    <div>
                        <div style={{ fontWeight: 600 }}>Kali Linux</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Latest Version</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'var(--card-bg)', borderRadius: '8px' }}>
                    <Globe size={24} style={{ color: 'var(--primary-color)' }} />
                    <div>
                        <div style={{ fontWeight: 600 }}>VPN Access</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Lab Connection</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'var(--card-bg)', borderRadius: '8px' }}>
                    <Shield size={24} style={{ color: 'var(--primary-color)' }} />
                    <div>
                        <div style={{ fontWeight: 600 }}>Burp Suite</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Professional Edition</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ReconnaissanceLab = () => (
    <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px' }}>
                <Eye size={32} style={{ color: 'var(--primary-color)' }} />
            </div>
            <div>
                <h2>Module 1: Information Gathering & Reconnaissance</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Learn passive and active reconnaissance techniques</p>
            </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card lab-exercise">
                <h3 style={{ marginBottom: '12px', color: 'var(--primary-color)' }}>Lab 1.1: Passive Reconnaissance</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Gather information about target without direct interaction
                </p>
                <div style={{ background: 'var(--dark-bg)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Objectives:</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        <li>• Use whois to gather domain registration information</li>
                        <li>• Perform DNS enumeration with dig and nslookup</li>
                        <li>• Discover subdomains using various techniques</li>
                        <li>• Gather information from search engines and public sources</li>
                    </ul>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary">
                        <PlayCircle size={16} />
                        Start Lab
                    </button>
                    <button className="btn btn-secondary">
                        View Write-up
                    </button>
                </div>
            </div>

            <div className="card lab-exercise">
                <h3 style={{ marginBottom: '12px', color: 'var(--primary-color)' }}>Lab 1.2: Active Scanning</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Perform active enumeration of web applications
                </p>
                <div style={{ background: 'var(--dark-bg)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Objectives:</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        <li>• Port scan with nmap to discover services</li>
                        <li>• Identify web server technologies and versions</li>
                        <li>• Directory enumeration with gobuster/dirb</li>
                        <li>• Analyze robots.txt and sitemap.xml</li>
                    </ul>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary">
                        <PlayCircle size={16} />
                        Start Lab
                    </button>
                    <button className="btn btn-secondary">
                        View Write-up
                    </button>
                </div>
            </div>

            <div className="card lab-exercise">
                <h3 style={{ marginBottom: '12px', color: 'var(--primary-color)' }}>Lab 1.3: Web Technology Fingerprinting</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Identify technologies and frameworks used by web applications
                </p>
                <div style={{ background: 'var(--dark-bg)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Objectives:</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        <li>• Use Wappalyzer and builtwith for tech detection</li>
                        <li>• Analyze HTTP headers for server information</li>
                        <li>• Identify JavaScript frameworks and libraries</li>
                        <li>• Detect content management systems</li>
                    </ul>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary">
                        <PlayCircle size={16} />
                        Start Lab
                    </button>
                    <button className="btn btn-secondary">
                        View Write-up
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const ProxyLab = () => (
    <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px' }}>
                <Activity size={32} style={{ color: 'var(--primary-color)' }} />
            </div>
            <div>
                <h2>Module 2: Web Application Proxies</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Master Burp Suite and web proxy techniques</p>
            </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card lab-exercise">
                <h3 style={{ marginBottom: '12px', color: 'var(--primary-color)' }}>Lab 2.1: Burp Suite Basics</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Configure and use Burp Suite for intercepting HTTP traffic
                </p>
                <div style={{ background: 'var(--dark-bg)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Objectives:</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        <li>• Configure browser proxy settings</li>
                        <li>• Intercept and modify HTTP requests</li>
                        <li>• Use Repeater to resend requests</li>
                        <li>• Analyze HTTP responses</li>
                    </ul>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary">
                        <PlayCircle size={16} />
                        Start Lab
                    </button>
                    <button className="btn btn-secondary">View Write-up</button>
                </div>
            </div>

            <div className="card lab-exercise">
                <h3 style={{ marginBottom: '12px', color: 'var(--primary-color)' }}>Lab 2.2: Target Analysis with Burp</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Use Burp's target and spider functionality
                </p>
                <div style={{ background: 'var(--dark-bg)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Objectives:</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        <li>• Map application structure with Spider</li>
                        <li>• Analyze site map and identify entry points</li>
                        <li>• Use Target Analyzer for scope management</li>
                        <li>• Identify hidden parameters</li>
                    </ul>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary">
                        <PlayCircle size={16} />
                        Start Lab
                    </button>
                    <button className="btn btn-secondary">View Write-up</button>
                </div>
            </div>

            <div className="card lab-exercise">
                <h3 style={{ marginBottom: '12px', color: 'var(--primary-color)' }}>Lab 2.3: Intruder Automation</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Automate attacks using Burp Intruder
                </p>
                <div style={{ background: 'var(--dark-bg)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Objectives:</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        <li>• Configure attack types (Sniper, Battering Ram, Pitchfork)</li>
                        <li>• Use payloads for fuzzing</li>
                        <li>• Analyze attack results</li>
                        <li>• Create custom payload lists</li>
                    </ul>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary">
                        <PlayCircle size={16} />
                        Start Lab
                    </button>
                    <button className="btn btn-secondary">View Write-up</button>
                </div>
            </div>
        </div>
    </div>
);

const XSSLab = () => (
    <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px' }}>
                <FileCode size={32} style={{ color: 'var(--danger-color)' }} />
            </div>
            <div>
                <h2>Module 3: Cross-Site Scripting (XSS)</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Identify and exploit XSS vulnerabilities</p>
            </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card lab-exercise">
                <h3 style={{ marginBottom: '12px', color: 'var(--danger-color)' }}>Lab 3.1: Reflected XSS</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Find and exploit reflected Cross-Site Scripting vulnerabilities
                </p>
                <div style={{ background: 'var(--dark-bg)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Objectives:</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        <li>• Identify reflected XSS entry points</li>
                        <li>• Bypass basic input filters</li>
                        <li>• Craft payloads for cookie stealing</li>
                        <li>• Use XSS to perform actions on behalf of users</li>
                    </ul>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary">
                        <PlayCircle size={16} />
                        Start Lab
                    </button>
                    <button className="btn btn-secondary">View Write-up</button>
                </div>
            </div>

            <div className="card lab-exercise">
                <h3 style={{ marginBottom: '12px', color: 'var(--danger-color)' }}>Lab 3.2: Stored XSS</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Exploit persistent/stored XSS vulnerabilities
                </p>
                <div style={{ background: 'var(--dark-bg)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Objectives:</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        <li>• Find stored XSS in comment fields</li>
                        <li>• Identify XSS in user profiles</li>
                        <li>• Create persistent backdoors via XSS</li>
                        <li>• Exploit stored XSS for session hijacking</li>
                    </ul>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary">
                        <PlayCircle size={16} />
                        Start Lab
                    </button>
                    <button className="btn btn-secondary">View Write-up</button>
                </div>
            </div>

            <div className="card lab-exercise">
                <h3 style={{ marginBottom: '12px', color: 'var(--danger-color)' }}>Lab 3.3: DOM-based XSS</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Identify and exploit DOM-based XSS vulnerabilities
                </p>
                <div style={{ background: 'var(--dark-bg)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Objectives:</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        <li>• Analyze JavaScript code for DOM XSS sinks</li>
                        <li>• Exploit document.write vulnerabilities</li>
                        <li>• Bypass Content Security Policy</li>
                        <li>• Use DOM XSS for keylogging</li>
                    </ul>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary">
                        <PlayCircle size={16} />
                        Start Lab
                    </button>
                    <button className="btn btn-secondary">View Write-up</button>
                </div>
            </div>
        </div>
    </div>
);

const SQLILab = () => (
    <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px' }}>
                <Database size={32} style={{ color: 'var(--danger-color)' }} />
            </div>
            <div>
                <h2>Module 4: SQL Injection</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Exploit SQL injection vulnerabilities</p>
            </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card lab-exercise">
                <h3 style={{ marginBottom: '12px', color: 'var(--danger-color)' }}>Lab 4.1: Basic SQL Injection</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Identify and exploit basic SQL injection points
                </p>
                <div style={{ background: 'var(--dark-bg)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Objectives:</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        <li>• Detect SQL injection vulnerabilities</li>
                        <li>• Use UNION-based attacks</li>
                        <li>• Extract database information</li>
                        <li>• Bypass authentication with SQLi</li>
                    </ul>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary">
                        <PlayCircle size={16} />
                        Start Lab
                    </button>
                    <button className="btn btn-secondary">View Write-up</button>
                </div>
            </div>

            <div className="card lab-exercise">
                <h3 style={{ marginBottom: '12px', color: 'var(--danger-color)' }}>Lab 4.2: Blind SQL Injection</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Exploit blind SQL injection vulnerabilities
                </p>
                <div style={{ background: 'var(--dark-bg)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Objectives:</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        <li>• Identify boolean-based blind SQLi</li>
                        <li>• Use time-based SQL injection</li>
                        <li>• Extract data through inference</li>
                        <li>• Automate blind SQLi with scripts</li>
                    </ul>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary">
                        <PlayCircle size={16} />
                        Start Lab
                    </button>
                    <button className="btn btn-secondary">View Write-up</button>
                </div>
            </div>

            <div className="card lab-exercise">
                <h3 style={{ marginBottom: '12px', color: 'var(--danger-color)' }}>Lab 4.3: Advanced SQL Injection</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Advanced SQL injection techniques and evasion
                </p>
                <div style={{ background: 'var(--dark-bg)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Objectives:</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        <li>• Bypass WAF filters</li>
                        <li>• Use stacked queries</li>
                        <li>• Perform out-of-band extraction</li>
                        <li>• Exploit second-order SQLi</li>
                    </ul>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary">
                        <PlayCircle size={16} />
                        Start Lab
                    </button>
                    <button className="btn btn-secondary">View Write-up</button>
                </div>
            </div>
        </div>
    </div>
);

const AuthenticationLab = () => (
    <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px' }}>
                <Lock size={32} style={{ color: 'var(--warning-color)' }} />
            </div>
            <div>
                <h2>Module 5: Authentication & Session Management</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Test authentication mechanisms and session handling</p>
            </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card lab-exercise">
                <h3 style={{ marginBottom: '12px', color: 'var(--warning-color)' }}>Lab 5.1: Authentication Bypass</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Identify and exploit authentication weaknesses
                </p>
                <div style={{ background: 'var(--dark-bg)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Objectives:</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        <li>• Exploit logic flaws in authentication</li>
                        <li>• Bypass 2FA mechanisms</li>
                        <li>• Abuse password reset functionality</li>
                        <li>• Test for weak password policies</li>
                    </ul>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary">
                        <PlayCircle size={16} />
                        Start Lab
                    </button>
                    <button className="btn btn-secondary">View Write-up</button>
                </div>
            </div>

            <div className="card lab-exercise">
                <h3 style={{ marginBottom: '12px', color: 'var(--warning-color)' }}>Lab 5.2: Session Management</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Test session handling and token security
                </p>
                <div style={{ background: 'var(--dark-bg)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Objectives:</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        <li>• Analyze session tokens for predictability</li>
                        <li>• Test for session fixation</li>
                        <li>• Exploit insecure session handling</li>
                        <li>• Test concurrent session handling</li>
                    </ul>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary">
                        <PlayCircle size={16} />
                        Start Lab
                    </button>
                    <button className="btn btn-secondary">View Write-up</button>
                </div>
            </div>
        </div>
    </div>
);

const Learning = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(true);

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
        <div>
            <div className="container page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                    <BookOpen size={32} style={{ color: 'var(--primary-color)' }} />
                    <h1>Learning Center</h1>
                </div>
                <p>Offensive Security WEB-200: Foundational Web Application Assessments</p>
            </div>

            <div className="container">
                <div style={{ display: 'flex', gap: '24px' }}>
                    {/* Sidebar Menu */}
                    <div style={{
                        width: isMenuOpen ? '280px' : '60px',
                        flexShrink: 0,
                        transition: 'width 0.3s ease'
                    }}>
                        <div className="card" style={{ padding: '16px' }}>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    marginBottom: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <ChevronRight size={20} style={{
                                    transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s'
                                }} />
                                {isMenuOpen && <span style={{ fontSize: '14px' }}>Menu</span>}
                            </button>

                            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.path);
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                padding: '12px',
                                                borderRadius: '8px',
                                                textDecoration: 'none',
                                                color: active ? 'var(--primary-color)' : 'var(--text-secondary)',
                                                background: active ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                                fontWeight: active ? 600 : 400,
                                                fontSize: '14px',
                                                transition: 'all 0.2s'
                                            }}
                                        >
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
                            <Route path="/" element={<LabOverview />} />
                            <Route path="/recon" element={<ReconnaissanceLab />} />
                            <Route path="/proxy" element={<ProxyLab />} />
                            <Route path="/xss" element={<XSSLab />} />
                            <Route path="/sqli" element={<SQLILab />} />
                            <Route path="/auth" element={<AuthenticationLab />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Learning;
