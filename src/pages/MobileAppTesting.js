import React, { useState } from 'react';
import { Smartphone, Shield, AlertTriangle, CheckCircle, FileText, ChevronRight, ExternalLink, Download, Lock, Eye, Wifi, HardDrive, Database, Code } from 'lucide-react';

const MobileAppTesting = () => {
    const [activeTab, setActiveTab] = useState('android');
    const [expandedCheck, setExpandedCheck] = useState(null);

    const mobileChecks = {
        android: [
            {
                id: 'mstg-arch-1',
                category: 'Architecture',
                title: 'Verify App Architecture',
                description: 'Validate that the app has a clear architecture with proper separation of concerns',
                severity: 'medium',
                checklist: [
                    'Review app architecture documentation',
                    'Verify separation between business logic and UI',
                    'Check for proper layer separation (data, domain, presentation)',
                    'Validate dependency injection implementation'
                ],
                remediation: 'Implement clean architecture pattern (MVVM, MVP, or MVI) with clear separation of concerns.'
            },
            {
                id: 'mstg-storage-1',
                category: 'Data Storage',
                title: 'Insecure Data Storage',
                description: 'Check for sensitive data stored in SharedPreferences, external storage, or unencrypted databases',
                severity: 'critical',
                checklist: [
                    'Check SharedPreferences for sensitive data',
                    'Verify no data is stored in external storage',
                    'Review SQLite databases for encryption',
                    'Check for hardcoded credentials in code',
                    'Verify sensitive data is not logged'
                ],
                remediation: 'Use EncryptedSharedPreferences, encrypted Room databases, and Keystore for sensitive data. Never store credentials in code.'
            },
            {
                id: 'mstg-storage-2',
                category: 'Data Storage',
                title: 'Insecure Logging',
                description: 'Verify that sensitive information is not logged to Logcat',
                severity: 'high',
                checklist: [
                    'Search for Log.d, Log.i, Log.e, Log.w, Log.v statements',
                    'Check for System.out.print statements',
                    'Verify no sensitive data in crash logs',
                    'Check for debug flags in production builds'
                ],
                remediation: 'Remove all logging statements containing sensitive data before production. Use ProGuard/R8 to strip logs.'
            },
            {
                id: 'mstg-crypto-1',
                category: 'Cryptography',
                title: 'Weak Cryptography',
                description: 'Check for use of weak cryptographic algorithms and improper key management',
                severity: 'critical',
                checklist: [
                    'Verify AES-256 is used for encryption',
                    'Check for hardcoded encryption keys',
                    'Verify proper key storage in Android Keystore',
                    'Check for use of deprecated algorithms (MD5, SHA1, DES)',
                    'Verify proper random number generation'
                ],
                remediation: 'Use strong algorithms (AES-256-GCM, RSA-2048+), store keys in Android Keystore, never hardcode keys.'
            },
            {
                id: 'mstg-auth-1',
                category: 'Authentication',
                title: 'Insecure Authentication',
                description: 'Verify proper implementation of authentication mechanisms',
                severity: 'critical',
                checklist: [
                    'Check for biometric authentication bypass',
                    'Verify local authentication is backed by server validation',
                    'Check for insecure session handling',
                    'Verify password policies are enforced',
                    'Check for account enumeration vulnerabilities'
                ],
                remediation: 'Implement biometric auth with CryptoObject, validate all authentication server-side, use secure tokens.'
            },
            {
                id: 'mstg-network-1',
                category: 'Network',
                title: 'Insecure Network Communication',
                description: 'Check for insecure network protocols and certificate validation issues',
                severity: 'critical',
                checklist: [
                    'Verify HTTPS is used for all network calls',
                    'Check for certificate pinning implementation',
                    'Verify hostname verification is not bypassed',
                    'Check for insecure TLS versions (1.0, 1.1)',
                    'Verify WebView uses secure settings'
                ],
                remediation: 'Enforce TLS 1.2+, implement certificate pinning, use Network Security Config, validate all certificates.'
            },
            {
                id: 'mstg-platform-1',
                category: 'Platform',
                title: 'Improper Platform Usage',
                description: 'Check for improper use of Android platform features and IPC mechanisms',
                severity: 'high',
                checklist: [
                    'Check exported Activities, Services, Receivers',
                    'Verify ContentProviders are not exported unless necessary',
                    'Check for insecure Intent handling',
                    'Verify proper use of PendingIntents',
                    'Check for deep link vulnerabilities'
                ],
                remediation: 'Minimize exported components, use explicit Intents, validate all inputs from IPC, implement proper permissions.'
            },
            {
                id: 'mstg-code-1',
                category: 'Code Quality',
                title: 'Insecure Code Practices',
                description: 'Check for common insecure coding practices',
                severity: 'high',
                checklist: [
                    'Check for SQL injection vulnerabilities',
                    'Verify no JavaScript injection in WebViews',
                    'Check for path traversal in file operations',
                    'Verify proper input validation',
                    'Check for reflection-based vulnerabilities'
                ],
                remediation: 'Use parameterized queries, validate all inputs, sanitize data before WebView rendering, avoid unsafe reflection.'
            },
            {
                id: 'mstg-resilience-1',
                category: 'Resilience',
                title: 'Lack of Anti-Tampering',
                description: 'Check for root detection, debug detection, and anti-tampering measures',
                severity: 'medium',
                checklist: [
                    'Verify root detection is implemented',
                    'Check for debug mode detection',
                    'Verify emulator detection',
                    'Check for code obfuscation (ProGuard/R8)',
                    'Verify integrity checks are in place'
                ],
                remediation: 'Implement root detection, use code obfuscation, implement runtime integrity checks, use SafetyNet/Play Integrity API.'
            }
        ],
        ios: [
            {
                id: 'mstg-ios-arch-1',
                category: 'Architecture',
                title: 'Verify App Architecture',
                description: 'Validate that the iOS app has proper architectural patterns',
                severity: 'medium',
                checklist: [
                    'Review app architecture (MVC, MVVM, VIPER)',
                    'Verify separation of concerns',
                    'Check for proper use of delegates and protocols',
                    'Validate dependency management'
                ],
                remediation: 'Use MVVM or VIPER architecture with clear separation between layers.'
            },
            {
                id: 'mstg-ios-storage-1',
                category: 'Data Storage',
                title: 'Insecure Data Storage',
                description: 'Check for sensitive data in UserDefaults, Keychain misuse, or unencrypted Core Data',
                severity: 'critical',
                checklist: [
                    'Verify sensitive data uses Keychain (not UserDefaults)',
                    'Check Core Data/SQLite encryption',
                    'Verify no sensitive data in plist files',
                    'Check for data in app backups',
                    'Verify keyboard cache is disabled for sensitive fields'
                ],
                remediation: 'Use Keychain for sensitive data, encrypt Core Data, disable backup for sensitive files, disable autocorrect for sensitive inputs.'
            },
            {
                id: 'mstg-ios-crypto-1',
                category: 'Cryptography',
                title: 'Weak Cryptography',
                description: 'Check for weak cryptographic implementations in iOS',
                severity: 'critical',
                checklist: [
                    'Verify use of iOS CryptoKit/CommonCrypto',
                    'Check for hardcoded keys in code',
                    'Verify proper key management in Keychain/Secure Enclave',
                    'Check for use of deprecated algorithms',
                    'Verify random number generation uses SecRandomCopyBytes'
                ],
                remediation: 'Use CryptoKit for iOS 13+, store keys in Secure Enclave when possible, never hardcode cryptographic keys.'
            },
            {
                id: 'mstg-ios-auth-1',
                category: 'Authentication',
                title: 'Insecure Authentication',
                description: 'Verify proper biometric and authentication implementation',
                severity: 'critical',
                checklist: [
                    'Verify Face ID/Touch ID implementation',
                    'Check LocalAuthentication framework usage',
                    'Verify server-side validation of authentication',
                    'Check for insecure session tokens',
                    'Verify OAuth implementation follows best practices'
                ],
                remediation: 'Use LocalAuthentication with proper fallback, validate auth server-side, use secure token storage.'
            },
            {
                id: 'mstg-ios-network-1',
                category: 'Network',
                title: 'Insecure Network Communication',
                description: 'Check for ATS compliance and certificate pinning',
                severity: 'critical',
                checklist: [
                    'Verify ATS (App Transport Security) is enabled',
                    'Check for certificate pinning implementation',
                    'Verify no insecure HTTP connections',
                    'Check TLS version requirements',
                    'Verify WebKit security settings'
                ],
                remediation: 'Keep ATS enabled, implement SSL pinning, use TrustKit or similar for pinning, enforce TLS 1.2+.'
            },
            {
                id: 'mstg-ios-platform-1',
                category: 'Platform',
                title: 'Improper Platform Usage',
                description: 'Check for proper use of iOS platform features',
                severity: 'high',
                checklist: [
                    'Check for Universal Links configuration',
                    'Verify URL scheme handling',
                    'Check for extension point vulnerabilities',
                    'Verify app groups security',
                    'Check for pasteboard data exposure'
                ],
                remediation: 'Validate all URL parameters, use Universal Links instead of custom schemes, clear pasteboard when appropriate.'
            },
            {
                id: 'mstg-ios-resilience-1',
                category: 'Resilience',
                title: 'Jailbreak Detection & Obfuscation',
                description: 'Check for jailbreak detection and code protection',
                severity: 'medium',
                checklist: [
                    'Verify jailbreak detection is implemented',
                    'Check for debug detection',
                    'Verify code obfuscation is applied',
                    'Check for anti-tampering measures',
                    'Verify integrity checks'
                ],
                remediation: 'Implement jailbreak detection, use LLVM obfuscation, implement runtime application security (RASP).'
            }
        ]
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'var(--critical-color)';
            case 'high': return 'var(--high-color)';
            case 'medium': return 'var(--medium-color)';
            default: return 'var(--low-color)';
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Cryptography': return <Lock size={18} />;
            case 'Data Storage': return <HardDrive size={18} />;
            case 'Network': return <Wifi size={18} />;
            case 'Authentication': return <Shield size={18} />;
            case 'Platform': return <Code size={18} />;
            case 'Resilience': return <Eye size={18} />;
            default: return <FileText size={18} />;
        }
    };

    return (
        <div>
            <div className="container page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                    <Smartphone size={32} style={{ color: 'var(--primary-color)' }} />
                    <h1>Mobile App Security Testing</h1>
                </div>
                <p>OWASP MASVS compliance checklist for Android and iOS applications</p>
            </div>

            <div className="container">
                {/* Platform Tabs */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                    <button
                        className={`btn ${activeTab === 'android' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('android')}
                    >
                        <Smartphone size={18} />
                        Android Testing
                    </button>
                    <button
                        className={`btn ${activeTab === 'ios' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('ios')}
                    >
                        <Smartphone size={18} />
                        iOS Testing
                    </button>
                </div>

                {/* Info Card */}
                <div className="card" style={{ marginBottom: '32px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--primary-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                        <Shield size={24} style={{ color: 'var(--primary-color)', flexShrink: 0 }} />
                        <div>
                            <h3 style={{ marginBottom: '8px' }}>OWASP MASVS Compliance</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                The Mobile Application Security Verification Standard (MASVS) provides a baseline for testing
                                mobile app security. Use this checklist to ensure your mobile applications meet security best practices.
                            </p>
                            <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                                <a
                                    href="https://mas.owasp.org/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary"
                                    style={{ fontSize: '14px', padding: '8px 16px' }}
                                >
                                    <ExternalLink size={16} />
                                    MASVS Documentation
                                </a>
                                <a
                                    href="https://github.com/OWASP/owasp-mstg"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary"
                                    style={{ fontSize: '14px', padding: '8px 16px' }}
                                >
                                    <Download size={16} />
                                    MSTG Guide
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Checks */}
                <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>
                    Security Checks ({mobileChecks[activeTab].length})
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {mobileChecks[activeTab].map((check) => (
                        <div
                            key={check.id}
                            className="card mobile-check-card"
                            style={{
                                borderLeft: `4px solid ${getSeverityColor(check.severity)}`,
                                cursor: 'pointer'
                            }}
                            onClick={() => setExpandedCheck(expandedCheck === check.id ? null : check.id)}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                <div style={{
                                    color: 'var(--primary-color)',
                                    padding: '8px',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    borderRadius: '8px'
                                }}>
                                    {getCategoryIcon(check.category)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                        <span style={{
                                            fontSize: '12px',
                                            textTransform: 'uppercase',
                                            fontWeight: 600,
                                            color: getSeverityColor(check.severity)
                                        }}>
                                            {check.severity}
                                        </span>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                                            {check.id}
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                                        {check.title}
                                    </h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                                        {check.description}
                                    </p>
                                </div>
                                <ChevronRight
                                    size={20}
                                    style={{
                                        color: 'var(--text-secondary)',
                                        transform: expandedCheck === check.id ? 'rotate(90deg)' : 'rotate(0)',
                                        transition: 'transform 0.2s'
                                    }}
                                />
                            </div>

                            {expandedCheck === check.id && (
                                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
                                    <div style={{ marginBottom: '20px' }}>
                                        <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <CheckCircle size={16} style={{ color: 'var(--secondary-color)' }} />
                                            Testing Checklist
                                        </h4>
                                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {check.checklist.map((item, index) => (
                                                <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                                    <span style={{ color: 'var(--primary-color)' }}>•</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div style={{
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        borderRadius: '8px',
                                        padding: '16px',
                                        border: '1px solid rgba(16, 185, 129, 0.3)'
                                    }}>
                                        <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary-color)' }}>
                                            <Shield size={16} />
                                            Remediation
                                        </h4>
                                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                            {check.remediation}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Summary Stats */}
                <div className="grid grid-4" style={{ marginTop: '40px' }}>
                    <div className="card stat-card">
                        <div className="stat-card-icon critical">
                            <AlertTriangle size={24} />
                        </div>
                        <div className="stat-card-value">
                            {mobileChecks[activeTab].filter(c => c.severity === 'critical').length}
                        </div>
                        <div className="stat-card-label">Critical Checks</div>
                    </div>
                    <div className="card stat-card">
                        <div className="stat-card-icon high">
                            <AlertTriangle size={24} />
                        </div>
                        <div className="stat-card-value">
                            {mobileChecks[activeTab].filter(c => c.severity === 'high').length}
                        </div>
                        <div className="stat-card-label">High Priority</div>
                    </div>
                    <div className="card stat-card">
                        <div className="stat-card-icon medium">
                            <AlertTriangle size={24} />
                        </div>
                        <div className="stat-card-value">
                            {mobileChecks[activeTab].filter(c => c.severity === 'medium').length}
                        </div>
                        <div className="stat-card-label">Medium Priority</div>
                    </div>
                    <div className="card stat-card">
                        <div className="stat-card-icon info">
                            <FileText size={24} />
                        </div>
                        <div className="stat-card-value">{mobileChecks[activeTab].length}</div>
                        <div className="stat-card-label">Total Checks</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileAppTesting;
