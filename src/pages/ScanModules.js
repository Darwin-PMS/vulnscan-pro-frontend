import React, { useState, useEffect } from 'react';
import {
    Shield, Search, AlertTriangle, CheckCircle, Globe, Database as DatabaseIcon,
    FileText, Lock, Key, Eye, ChevronDown, ChevronUp, RefreshCw,
    Download, Copy, ExternalLink, Filter, BarChart2, Zap, Code,
    Cloud, GitBranch, Server, Database as DB, Smartphone, Bot, Box
} from 'lucide-react';
import api from '../services/api';

const ScanModules = () => {
    const [activeTab, setActiveTab] = useState('owasp');
    const [selectedModules, setSelectedModules] = useState(['owasp']);
    const [url, setUrl] = useState('');
    const [scanning, setScanning] = useState(false);
    const [results, setResults] = useState(null);
    const [modules, setModules] = useState(null);
    const [recentScans, setRecentScans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [modulesRes, scansRes] = await Promise.all([
                api.get('/api/scan-modules/modules'),
                api.get('/api/scan-modules/modules/scans?limit=5')
            ]);
            setModules(modulesRes.data.modules);
            setRecentScans(scansRes.data.scans || []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleScan = async () => {
        if (!url) return;
        
        setScanning(true);
        setResults(null);
        
        try {
            const res = await api.post('/api/scan-modules/modules/scan', { 
                url, 
                module: selectedModules.length === 1 ? selectedModules[0] : 'all'
            });
            setResults(res.data);
            fetchData();
        } catch (error) {
            console.error('Scan failed:', error);
            alert('Scan failed: ' + (error.response?.data?.error || error.message));
        } finally {
            setScanning(false);
        }
    };

    const toggleModule = (moduleId) => {
        if (selectedModules.includes(moduleId)) {
            if (selectedModules.length > 1) {
                setSelectedModules(selectedModules.filter(m => m !== moduleId));
            }
        } else {
            setSelectedModules([...selectedModules, moduleId]);
        }
    };

    const moduleIcons = {
        owasp: Shield,
        ghdb: DatabaseIcon,
        api: Code,
        cloud: Cloud,
        cicd: GitBranch,
        mobile: Smartphone,
        llm: Bot,
        container: Box
    };

    if (loading) {
        return (
            <div style={{ padding: '48px', textAlign: 'center' }}>
                <RefreshCw className="animate-spin" size={32} style={{ color: '#6366f1' }} />
                <p style={{ color: '#94a3b8', marginTop: '16px' }}>Loading scan modules...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>
                    Security Scan Modules
                </h1>
                <p style={{ color: '#94a3b8' }}>
                    Choose specialized security scanners for comprehensive vulnerability assessment
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                {Object.entries(modules || {}).map(([id, module]) => {
                    const Icon = moduleIcons[id] || Shield;
                    return (
                        <ModuleCard
                            key={id}
                            id={id}
                            name={module.name}
                            description={module.description}
                            icon={Icon}
                            color={module.color}
                            patternCount={module.categories?.totalPatterns || 0}
                            selected={selectedModules.includes(id)}
                            onToggle={() => toggleModule(id)}
                        />
                    );
                })}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <h3 style={{ color: '#f1f5f9', margin: 0 }}>Scan Target</h3>
                    <span style={{ fontSize: '12px', color: '#94a3b8', background: 'rgba(99, 102, 241, 0.2)', padding: '4px 8px', borderRadius: '4px' }}>
                        {selectedModules.length} module{selectedModules.length > 1 ? 's' : ''} selected
                    </span>
                    <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
                        {selectedModules.map(m => (
                            <span key={m} style={{ 
                                fontSize: '11px', padding: '2px 8px', borderRadius: '4px',
                                background: modules?.[m]?.color + '30', 
                                color: modules?.[m]?.color || '#94a3b8'
                            }}>
                                {modules?.[m]?.name || m}
                            </span>
                        ))}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        style={{
                            flex: 1,
                            padding: '12px 16px',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#f1f5f9',
                            fontSize: '14px'
                        }}
                    />
                    <button
                        onClick={handleScan}
                        disabled={scanning || !url}
                        style={{
                            padding: '12px 24px',
                            background: scanning ? '#4f46e5' : '#6366f1',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontWeight: '600',
                            cursor: scanning ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        {scanning ? (
                            <>
                                <RefreshCw className="animate-spin" size={18} />
                                Scanning...
                            </>
                        ) : (
                            <>
                                <Search size={18} />
                                Scan Now
                            </>
                        )}
                    </button>
                </div>
            </div>

            {scanning && <ScanProgress />}

            {results && !scanning && (
                <ScanResults results={results} selectedModules={selectedModules} />
            )}

            {recentScans.length > 0 && <RecentScans scans={recentScans} />}
        </div>
    );
};

const ModuleCard = ({ id, name, description, icon: Icon, color, patternCount, selected, onToggle }) => (
    <div
        onClick={onToggle}
        style={{
            background: selected ? `${color}15` : 'rgba(255,255,255,0.05)',
            border: `2px solid ${selected ? color : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '16px',
            padding: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative'
        }}
    >
        {selected && (
            <div style={{
                position: 'absolute', top: '12px', right: '12px',
                width: '24px', height: '24px', borderRadius: '50%',
                background: color, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <CheckCircle size={14} color="white" />
            </div>
        )}
        <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: `${color}20`, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            marginBottom: '12px'
        }}>
            <Icon size={24} color={color} />
        </div>
        <h3 style={{ color: '#f1f5f9', margin: '0 0 4px', fontSize: '15px' }}>{name}</h3>
        <p style={{ color: '#94a3b8', margin: '0 0 8px', fontSize: '11px', lineHeight: '1.4' }}>{description}</p>
        <span style={{ fontSize: '11px', color: color, fontWeight: '600' }}>{patternCount} patterns</span>
    </div>
);

const ScanProgress = () => (
    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
        <RefreshCw className="animate-spin" size={48} style={{ color: '#6366f1', marginBottom: '16px' }} />
        <h3 style={{ color: '#f1f5f9', marginBottom: '8px' }}>Scanning Target...</h3>
        <p style={{ color: '#94a3b8' }}>Analyzing vulnerabilities across all selected modules</p>
        <div style={{ marginTop: '24px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
                width: '60%',
                height: '100%',
                background: 'linear-gradient(90deg, #6366f1, #10b981)',
                borderRadius: '2px',
                animation: 'pulse 2s ease-in-out infinite'
            }} />
        </div>
    </div>
);

const ScanResults = ({ results, selectedModules }) => {
    const [selectedVuln, setSelectedVuln] = useState(null);
    const [filterSeverity, setFilterSeverity] = useState('all');

    const getSeverityColor = (severity) => {
        const colors = { critical: '#ef4444', high: '#f97316', medium: '#f59e0b', low: '#3b82f6', info: '#94a3b8' };
        return colors[severity] || '#94a3b8';
    };

    const filteredVulns = filterSeverity === 'all' 
        ? results.vulnerabilities 
        : results.vulnerabilities.filter(v => v.severity === filterSeverity);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ color: '#f1f5f9', margin: 0 }}>Scan Results</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {['all', 'critical', 'high', 'medium', 'low'].map(sev => (
                        <button
                            key={sev}
                            onClick={() => setFilterSeverity(sev)}
                            style={{
                                padding: '6px 12px',
                                background: filterSeverity === sev ? getSeverityColor(sev) : 'rgba(255,255,255,0.1)',
                                border: 'none',
                                borderRadius: '6px',
                                color: filterSeverity === sev ? 'white' : '#94a3b8',
                                fontSize: '12px',
                                cursor: 'pointer',
                                textTransform: 'capitalize'
                            }}
                        >
                            {sev}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
                {Object.entries(results.summary || {}).map(([severity, count]) => (
                    <div key={severity} style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        padding: '16px',
                        textAlign: 'center'
                    }}>
                        <span style={{ fontSize: '32px', fontWeight: '700', color: getSeverityColor(severity) }}>{count}</span>
                        <p style={{ color: '#94a3b8', margin: '4px 0 0', textTransform: 'uppercase', fontSize: '12px' }}>{severity}</p>
                    </div>
                ))}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px' }}>
                <h4 style={{ color: '#f1f5f9', marginBottom: '16px' }}>
                    Vulnerabilities ({filteredVulns.length})
                </h4>
                
                {filteredVulns.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px' }}>
                        <CheckCircle size={48} color="#10b981" style={{ marginBottom: '16px' }} />
                        <p style={{ color: '#94a3b8' }}>No vulnerabilities found!</p>
                    </div>
                ) : (
                    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        {filteredVulns.map((vuln, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedVuln(vuln)}
                                style={{
                                    padding: '16px',
                                    marginBottom: '8px',
                                    background: selectedVuln === vuln ? 'rgba(99, 102, 241, 0.2)' : 'rgba(0,0,0,0.2)',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    borderLeft: `4px solid ${getSeverityColor(vuln.severity)}`
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <h5 style={{ color: '#f1f5f9', margin: 0, fontSize: '14px' }}>{vuln.title}</h5>
                                            <span style={{ fontSize: '10px', color: '#94a3b8', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>{vuln.id}</span>
                                        </div>
                                        <p style={{ color: '#94a3b8', margin: '4px 0 0', fontSize: '12px' }}>
                                            {vuln.categoryName || vuln.category || vuln.provider || vuln.pipelineType || vuln.platform || 'General'}
                                        </p>
                                    </div>
                                    <span style={{
                                        padding: '4px 8px',
                                        background: `${getSeverityColor(vuln.severity)}20`,
                                        color: getSeverityColor(vuln.severity),
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        textTransform: 'uppercase'
                                    }}>
                                        {vuln.severity}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedVuln && (
                <VulnerabilityDetail vuln={selectedVuln} onClose={() => setSelectedVuln(null)} />
            )}
        </div>
    );
};

const VulnerabilityDetail = ({ vuln, onClose }) => (
    <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000
    }}>
        <div style={{
            background: '#1e293b',
            borderRadius: '16px',
            padding: '24px',
            width: '650px',
            maxHeight: '80vh',
            overflowY: 'auto'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                    <h3 style={{ color: '#f1f5f9', margin: 0 }}>{vuln.title}</h3>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{vuln.id}</span>
                </div>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '24px' }}>×</button>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Severity</span>
                <p style={{ color: '#f1f5f9', margin: '4px 0', textTransform: 'uppercase', fontWeight: '600' }}>{vuln.severity}</p>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Category</span>
                <p style={{ color: '#f1f5f9', margin: '4px 0' }}>{vuln.categoryName || vuln.category || vuln.provider || vuln.pipelineType || vuln.platform || 'General'}</p>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Description</span>
                <p style={{ color: '#f1f5f9', margin: '4px 0', lineHeight: '1.6' }}>{vuln.description}</p>
            </div>
            
            <div style={{ marginBottom: '16px', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}>Remediation</span>
                <p style={{ color: '#f1f5f9', margin: '8px 0 0', lineHeight: '1.6', fontSize: '14px' }}>{vuln.remediation}</p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{ flex: 1, padding: '12px', background: '#6366f1', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>
                    Mark as Resolved
                </button>
                <button style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: '#f1f5f9', cursor: 'pointer' }}>
                    Export Details
                </button>
            </div>
        </div>
    </div>
);

const RecentScans = ({ scans }) => (
    <div style={{ marginTop: '32px' }}>
        <h3 style={{ color: '#f1f5f9', marginBottom: '16px' }}>Recent Module Scans</h3>
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
            {scans.map((scan, idx) => (
                <div key={scan.id} style={{
                    padding: '16px',
                    borderBottom: idx < scans.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <p style={{ color: '#f1f5f9', margin: '0 0 4px', fontSize: '14px' }}>{scan.target_url}</p>
                        <p style={{ color: '#94a3b8', margin: 0, fontSize: '12px' }}>
                            {new Date(scan.created_at).toLocaleDateString()} • {scan.scan_type || 'Full'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ color: '#ef4444', fontWeight: '600' }}>{scan.critical_count}</span>
                            <span style={{ color: '#f97316', fontWeight: '600' }}> / {scan.high_count}</span>
                        </div>
                        <span style={{
                            padding: '4px 12px',
                            background: scan.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                            color: scan.status === 'completed' ? '#10b981' : '#f59e0b',
                            borderRadius: '4px',
                            fontSize: '12px'
                        }}>
                            {scan.status}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default ScanModules;
