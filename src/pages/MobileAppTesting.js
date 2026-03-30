import React, { useState, useEffect } from 'react';
import { 
    Smartphone, Shield, AlertTriangle, CheckCircle, FileText, ChevronRight, 
    ExternalLink, Download, Lock, Eye, Wifi, HardDrive, Database, Code, 
    Upload, Search, RefreshCw, Zap, Terminal, Package, Network, FileCode,
    ChevronDown, AlertCircle, X, DownloadCloud, Trash2, Copy, File, Loader
} from 'lucide-react';
import { mobileApi } from '../services/api';
import ReactMarkdown from 'react-markdown';

const MobileAppTesting = () => {
    const [activeTab, setActiveTab] = useState('android');
    const [expandedCheck, setExpandedCheck] = useState(null);
    const [scanMode, setScanMode] = useState('checklist');
    const [scanResults, setScanResults] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [appContent, setAppContent] = useState('');
    const [appName, setAppName] = useState('');
    const [activeAnalysis, setActiveAnalysis] = useState('all');
    const [securityGuide, setSecurityGuide] = useState(null);
    const [patterns, setPatterns] = useState([]);
    const [selectedVuln, setSelectedVuln] = useState(null);

    useEffect(() => {
        loadPatterns();
        loadSecurityGuide();
    }, [activeTab]);

    const loadPatterns = async () => {
        try {
            const response = await mobileApi.getPatterns(activeTab);
            setPatterns(response.data.patterns || []);
        } catch (error) {
            console.error('Failed to load patterns:', error);
        }
    };

    const loadSecurityGuide = async () => {
        try {
            const response = await mobileApi.getSecurityGuide(activeTab);
            setSecurityGuide(response.data.guide);
        } catch (error) {
            console.error('Failed to load security guide:', error);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAppName(file.name.replace(/\.(apk|ipa|dex|java|xml|swift|m|h)$/i, ''));
            const reader = new FileReader();
            reader.onload = (event) => {
                setAppContent(event.target.result);
            };
            reader.readAsText(file);
        }
    };

    const handlePaste = () => {
        const text = window.prompt('Paste your code/manifest content here:');
        if (text) {
            setAppContent(text);
            setAppName('Pasted Content');
        }
    };

    const handleScan = async () => {
        if (!appContent.trim()) {
            alert('Please provide app content to scan (upload file or paste code)');
            return;
        }

        setIsScanning(true);
        setScanProgress(0);

        try {
            const progressInterval = setInterval(() => {
                setScanProgress(prev => Math.min(prev + 10, 90));
            }, 300);

            const response = await mobileApi.scanAPK(appContent, activeTab, appName);
            
            clearInterval(progressInterval);
            setScanProgress(100);
            
            setTimeout(() => {
                setScanResults(response.data);
                setIsScanning(false);
            }, 500);
        } catch (error) {
            console.error('Scan failed:', error);
            setIsScanning(false);
            alert('Scan failed. Please try again.');
        }
    };

    const resetScan = () => {
        setScanResults(null);
        setAppContent('');
        setAppName('');
        setScanProgress(0);
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'var(--critical-color)';
            case 'high': return 'var(--high-color)';
            case 'medium': return 'var(--medium-color)';
            default: return 'var(--low-color)';
        }
    };

    const getSeverityBg = (severity) => {
        switch (severity) {
            case 'critical': return 'rgba(239, 68, 68, 0.1)';
            case 'high': return 'rgba(249, 115, 22, 0.1)';
            case 'medium': return 'rgba(234, 179, 8, 0.1)';
            default: return 'rgba(59, 130, 246, 0.1)';
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Cryptography': return <Lock size={18} />;
            case 'Data Storage': return <HardDrive size={18} />;
            case 'Network Security': return <Wifi size={18} />;
            case 'Authentication': return <Shield size={18} />;
            case 'Platform Security': return <Code size={18} />;
            case 'Device Security': return <Eye size={18} />;
            case 'WebView Security': return <Network size={18} />;
            case 'IPC Security': return <Database size={18} />;
            case 'Code Security': return <FileCode size={18} />;
            case 'Build Security': return <Package size={18} />;
            case 'Input Security': return <Terminal size={18} />;
            case 'Privacy': return <Eye size={18} />;
            default: return <FileText size={18} />;
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const mobileChecks = {
        android: patterns,
        ios: patterns
    };

    return (
        <div>
            <div className="container page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                    <Smartphone size={32} style={{ color: 'var(--primary-color)' }} />
                    <h1>Mobile App Security Testing</h1>
                </div>
                <p>OWASP MASVS compliance with automated vulnerability scanning for Android and iOS</p>
            </div>

            <div className="container">
                {/* Mode Toggle */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
                    <button
                        className={`btn ${scanMode === 'checklist' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setScanMode('checklist')}
                    >
                        <CheckCircle size={18} />
                        OWASP Checklist
                    </button>
                    <button
                        className={`btn ${scanMode === 'scanner' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setScanMode('scanner')}
                    >
                        <Search size={18} />
                        Security Scanner
                    </button>
                    <button
                        className={`btn ${scanMode === 'guide' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setScanMode('guide')}
                    >
                        <FileText size={18} />
                        Security Guide
                    </button>
                </div>

                {scanMode === 'checklist' && (
                    <>
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
                                    <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                        <a href="https://mas.owasp.org/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: '14px', padding: '8px 16px' }}>
                                            <ExternalLink size={16} /> MASVS Documentation
                                        </a>
                                        <a href="https://github.com/OWASP/owasp-mstg" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: '14px', padding: '8px 16px' }}>
                                            <Download size={16} /> MSTG Guide
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Checks */}
                        <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 600 }}>
                            Security Checks ({mobileChecks[activeTab]?.length || 0})
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {mobileChecks[activeTab]?.map((check) => (
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
                                            <div style={{ marginBottom: '16px' }}>
                                                <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <AlertTriangle size={16} style={{ color: 'var(--warning-color)' }} />
                                                    Risk
                                                </h4>
                                                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                                    {check.risk}
                                                </p>
                                            </div>

                                            <div style={{ marginBottom: '16px' }}>
                                                <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                                                    Detection Keywords
                                                </h4>
                                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                    {check.detection?.map((keyword, idx) => (
                                                        <code key={idx} style={{
                                                            background: 'var(--bg-secondary)',
                                                            padding: '4px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: '12px',
                                                            color: 'var(--primary-color)'
                                                        }}>
                                                            {keyword}
                                                        </code>
                                                    ))}
                                                </div>
                                            </div>

                                            <div style={{
                                                background: 'rgba(16, 185, 129, 0.1)',
                                                borderRadius: '8px',
                                                padding: '16px',
                                                border: '1px solid rgba(16, 185, 129, 0.3)'
                                            }}>
                                                <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary-color)' }}>
                                                    <Shield size={16} /> Remediation
                                                </h4>
                                                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                                    {check.remediation}
                                                </p>
                                            </div>

                                            <div style={{ marginTop: '16px' }}>
                                                <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                                                    References
                                                </h4>
                                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                    {check.references?.map((ref, idx) => (
                                                        <span key={idx} style={{
                                                            background: 'var(--bg-secondary)',
                                                            padding: '4px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: '12px',
                                                            color: 'var(--text-secondary)'
                                                        }}>
                                                            {ref}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-4" style={{ marginTop: '40px' }}>
                            <div className="card stat-card">
                                <div className="stat-card-icon critical"><AlertTriangle size={24} /></div>
                                <div className="stat-card-value">{mobileChecks[activeTab]?.filter(c => c.severity === 'critical').length || 0}</div>
                                <div className="stat-card-label">Critical Checks</div>
                            </div>
                            <div className="card stat-card">
                                <div className="stat-card-icon high"><AlertTriangle size={24} /></div>
                                <div className="stat-card-value">{mobileChecks[activeTab]?.filter(c => c.severity === 'high').length || 0}</div>
                                <div className="stat-card-label">High Priority</div>
                            </div>
                            <div className="card stat-card">
                                <div className="stat-card-icon medium"><AlertTriangle size={24} /></div>
                                <div className="stat-card-value">{mobileChecks[activeTab]?.filter(c => c.severity === 'medium').length || 0}</div>
                                <div className="stat-card-label">Medium Priority</div>
                            </div>
                            <div className="card stat-card">
                                <div className="stat-card-icon info"><FileText size={24} /></div>
                                <div className="stat-card-value">{mobileChecks[activeTab]?.length || 0}</div>
                                <div className="stat-card-label">Total Checks</div>
                            </div>
                        </div>
                    </>
                )}

                {scanMode === 'scanner' && (
                    <>
                        {/* Scanner Interface */}
                        <div className="card" style={{ marginBottom: '32px' }}>
                            <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Search size={24} style={{ color: 'var(--primary-color)' }} />
                                Mobile App Security Scanner
                            </h2>

                            {/* Platform Selection */}
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                                <button
                                    className={`btn ${activeTab === 'android' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setActiveTab('android')}
                                >
                                    <Smartphone size={18} /> Android (APK/DEX)
                                </button>
                                <button
                                    className={`btn ${activeTab === 'ios' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setActiveTab('ios')}
                                >
                                    <Smartphone size={18} /> iOS (IPA/Swift)
                                </button>
                            </div>

                            {/* Input Options */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                                    Upload or Paste Code
                                </label>
                                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                    <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                                        <Upload size={18} /> Upload File
                                        <input
                                            type="file"
                                            accept=".apk,.ipa,.dex,.java,.xml,.swift,.m,.h,.plist"
                                            onChange={handleFileUpload}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                    <button className="btn btn-secondary" onClick={handlePaste}>
                                        <Terminal size={18} /> Paste Code
                                    </button>
                                </div>

                                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                    <input
                                        type="text"
                                        placeholder="App Name (optional)"
                                        value={appName}
                                        onChange={(e) => setAppName(e.target.value)}
                                        className="input"
                                        style={{ flex: 1 }}
                                    />
                                </div>

                                <textarea
                                    value={appContent}
                                    onChange={(e) => setAppContent(e.target.value)}
                                    placeholder="Paste your AndroidManifest.xml, Java/Kotlin source code, or iOS Info.plist, Swift/Objective-C code here..."
                                    className="input"
                                    style={{
                                        width: '100%',
                                        minHeight: '300px',
                                        fontFamily: 'monospace',
                                        fontSize: '13px'
                                    }}
                                />

                                <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                    {appContent ? `${appContent.length} characters` : 'No content loaded'}
                                </div>
                            </div>

                            {/* Scan Button */}
                            <button
                                className="btn btn-primary"
                                onClick={handleScan}
                                disabled={isScanning || !appContent.trim()}
                                style={{ padding: '14px 32px', fontSize: '16px' }}
                            >
                                {isScanning ? (
                                    <>
                                        <Loader size={18} className="spin" /> Scanning... {scanProgress}%
                                    </>
                                ) : (
                                    <>
                                        <Zap size={18} /> Start Security Scan
                                    </>
                                )}
                            </button>

                            {/* Progress Bar */}
                            {isScanning && (
                                <div style={{ marginTop: '16px' }}>
                                    <div style={{
                                        height: '8px',
                                        background: 'var(--bg-secondary)',
                                        borderRadius: '4px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${scanProgress}%`,
                                            background: 'var(--primary-color)',
                                            transition: 'width 0.3s ease'
                                        }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Scan Results */}
                        {scanResults && (
                            <div className="card" style={{ marginBottom: '32px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <Shield size={24} style={{ color: 'var(--primary-color)' }} />
                                        Scan Results
                                    </h2>
                                    <button className="btn btn-secondary" onClick={resetScan}>
                                        <RefreshCw size={18} /> New Scan
                                    </button>
                                </div>

                                {/* Summary */}
                                <div style={{
                                    padding: '20px',
                                    background: scanResults.summary?.risk_level === 'CRITICAL' ? 'rgba(239, 68, 68, 0.1)' :
                                               scanResults.summary?.risk_level === 'HIGH' ? 'rgba(249, 115, 22, 0.1)' :
                                               'rgba(16, 185, 129, 0.1)',
                                    borderRadius: '12px',
                                    border: `2px solid ${scanResults.summary?.risk_level === 'CRITICAL' ? 'var(--critical-color)' :
                                                         scanResults.summary?.risk_level === 'HIGH' ? 'var(--high-color)' :
                                                         'var(--secondary-color)'}`,
                                    marginBottom: '24px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                                        <span style={{
                                            fontSize: '32px',
                                            fontWeight: 700,
                                            color: scanResults.summary?.risk_level === 'CRITICAL' ? 'var(--critical-color)' :
                                                   scanResults.summary?.risk_level === 'HIGH' ? 'var(--high-color)' :
                                                   'var(--secondary-color)'
                                        }}>
                                            {scanResults.summary?.risk_level}
                                        </span>
                                        <span style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
                                            Risk Level
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                                        {scanResults.app_name} - {scanResults.platform?.toUpperCase()} Analysis
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-4" style={{ marginBottom: '24px' }}>
                                    <div className="card stat-card" style={{ borderLeft: '4px solid var(--critical-color)' }}>
                                        <div className="stat-card-value">{scanResults.summary?.critical || 0}</div>
                                        <div className="stat-card-label">Critical</div>
                                    </div>
                                    <div className="card stat-card" style={{ borderLeft: '4px solid var(--high-color)' }}>
                                        <div className="stat-card-value">{scanResults.summary?.high || 0}</div>
                                        <div className="stat-card-label">High</div>
                                    </div>
                                    <div className="card stat-card" style={{ borderLeft: '4px solid var(--medium-color)' }}>
                                        <div className="stat-card-value">{scanResults.summary?.medium || 0}</div>
                                        <div className="stat-card-label">Medium</div>
                                    </div>
                                    <div className="card stat-card" style={{ borderLeft: '4px solid var(--low-color)' }}>
                                        <div className="stat-card-value">{scanResults.summary?.low || 0}</div>
                                        <div className="stat-card-label">Low</div>
                                    </div>
                                </div>

                                {/* Analysis Tabs */}
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                                    <button
                                        className={`btn ${activeAnalysis === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => setActiveAnalysis('all')}
                                    >
                                        All Findings ({scanResults.findings?.length || 0})
                                    </button>
                                    <button
                                        className={`btn ${activeAnalysis === 'manifest' ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => setActiveAnalysis('manifest')}
                                    >
                                        Manifest
                                    </button>
                                    <button
                                        className={`btn ${activeAnalysis === 'code' ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => setActiveAnalysis('code')}
                                    >
                                        Code
                                    </button>
                                    <button
                                        className={`btn ${activeAnalysis === 'network' ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => setActiveAnalysis('network')}
                                    >
                                        Network
                                    </button>
                                </div>

                                {/* Findings */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {scanResults.findings
                                        ?.filter(f => activeAnalysis === 'all' || f.category?.toLowerCase().includes(activeAnalysis))
                                        .map((finding, idx) => (
                                            <div
                                                key={idx}
                                                className="card"
                                                style={{
                                                    borderLeft: `4px solid ${getSeverityColor(finding.severity)}`,
                                                    background: getSeverityBg(finding.severity)
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                                    <div style={{
                                                        padding: '8px',
                                                        background: 'var(--bg-primary)',
                                                        borderRadius: '8px'
                                                    }}>
                                                        {getCategoryIcon(finding.category)}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                            <span style={{
                                                                fontSize: '11px',
                                                                textTransform: 'uppercase',
                                                                fontWeight: 600,
                                                                color: getSeverityColor(finding.severity)
                                                            }}>
                                                                {finding.severity}
                                                            </span>
                                                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                                                {finding.vuln_id}
                                                            </span>
                                                        </div>
                                                        <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
                                                            {finding.title}
                                                        </h4>
                                                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                                                            {finding.description}
                                                        </p>
                                                        <div style={{
                                                            padding: '12px',
                                                            background: 'var(--bg-primary)',
                                                            borderRadius: '8px'
                                                        }}>
                                                            <h5 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--secondary-color)' }}>
                                                                Remediation
                                                            </h5>
                                                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                                                                {finding.remediation}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>

                                {/* Recommendations */}
                                {scanResults.recommendations?.length > 0 && (
                                    <div style={{ marginTop: '32px' }}>
                                        <h3 style={{ marginBottom: '16px' }}>Recommendations</h3>
                                        {scanResults.recommendations.map((rec, idx) => (
                                            <div key={idx} className="card" style={{ marginBottom: '12px' }}>
                                                <h4 style={{
                                                    fontSize: '14px',
                                                    fontWeight: 600,
                                                    color: rec.priority === 'CRITICAL' ? 'var(--critical-color)' :
                                                           rec.priority === 'HIGH' ? 'var(--high-color)' :
                                                           'var(--text-primary)',
                                                    marginBottom: '12px'
                                                }}>
                                                    {rec.priority === 'CATEGORY' ? rec.action : rec.priority}
                                                </h4>
                                                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                                    {rec.items.map((item, i) => (
                                                        <li key={i} style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Tools */}
                                {scanResults.tools?.length > 0 && (
                                    <div style={{ marginTop: '32px' }}>
                                        <h3 style={{ marginBottom: '16px' }}>Recommended Tools</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
                                            {scanResults.tools.map((tool, idx) => (
                                                <a
                                                    key={idx}
                                                    href={tool.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="card"
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '12px',
                                                        textDecoration: 'none',
                                                        color: 'inherit'
                                                    }}
                                                >
                                                    <Package size={20} style={{ color: 'var(--primary-color)' }} />
                                                    <div>
                                                        <div style={{ fontWeight: 600, marginBottom: '2px' }}>{tool.name}</div>
                                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{tool.description}</div>
                                                    </div>
                                                    <ExternalLink size={16} style={{ marginLeft: 'auto', color: 'var(--text-secondary)' }} />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                {scanMode === 'guide' && (
                    <>
                        {/* Security Guide */}
                        <div className="card" style={{ marginBottom: '32px' }}>
                            <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <FileText size={24} style={{ color: 'var(--primary-color)' }} />
                                {securityGuide?.title || 'Loading...'}
                            </h2>

                            {securityGuide?.categories?.map((category, idx) => (
                                <div key={idx} className="card" style={{ marginBottom: '16px' }}>
                                    <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Shield size={18} style={{ color: 'var(--primary-color)' }} />
                                        {category.name}
                                    </h3>
                                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                        {category.items.map((item, i) => (
                                            <li key={i} style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: '1.5' }}>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}

                            {securityGuide?.references && (
                                <div className="card" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
                                    <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>References</h3>
                                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                        {securityGuide.references.map((ref, idx) => (
                                            <li key={idx} style={{ fontSize: '14px', marginBottom: '8px' }}>
                                                <a href={ref.split(': ')[1]} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>
                                                    {ref}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MobileAppTesting;
