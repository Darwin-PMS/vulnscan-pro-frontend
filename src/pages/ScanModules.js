import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, Search, AlertTriangle, CheckCircle, Clock, Zap, Code,
    Cloud, GitBranch, Smartphone, Bot, Box, Play, ArrowRight, X, ExternalLink, Target, FileText
} from 'lucide-react';
import api from '../services/api';
import { PageContainer } from '../components/layout';
import { Card, Button, Badge, Modal } from '../components/ui';
import StatusBadge from '../components/StatusBadge';

const ScanModules = () => {
    const navigate = useNavigate();
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
                api.get('/scan-modules/modules'),
                api.get('/scan-modules/modules/scans?limit=5')
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
            const res = await api.post('/scan-modules/modules/scan', { 
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
        ghdb: Bot,
        api: Code,
        cloud: Cloud,
        cicd: GitBranch,
        mobile: Smartphone,
        llm: Zap,
        container: Box
    };

    if (loading) {
        return (
            <PageContainer showNavbar={false}>
                <div className="modules-loading">
                    <div className="spinner" />
                    <p>Loading scan modules...</p>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer
            showNavbar={false}
            title="Security Scan Modules"
            subtitle="Choose specialized security scanners for comprehensive vulnerability assessment"
        >
            {/* Module Selection Grid */}
            <div className="modules-grid">
                {Object.entries(modules || {}).map(([id, module]) => {
                    const Icon = moduleIcons[id] || Shield;
                    return (
                        <div
                            key={id}
                            className={`module-card ${selectedModules.includes(id) ? 'selected' : ''}`}
                            style={{ '--module-color': module.color || '#6366f1' }}
                            onClick={() => toggleModule(id)}
                        >
                            {selectedModules.includes(id) && (
                                <div className="module-check">
                                    <CheckCircle size={16} />
                                </div>
                            )}
                            <div className="module-icon">
                                <Icon size={24} />
                            </div>
                            <h3 className="module-name">{module.name}</h3>
                            <p className="module-desc">{module.description}</p>
                            <div className="module-meta">
                                <span className="module-patterns">{module.categories?.totalPatterns || 0} patterns</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Scan Target Section */}
            <Card className="scan-target-card" padding="lg">
                <div className="scan-target-header">
                    <div className="scan-target-title">
                        <h3>Scan Target</h3>
                        <Badge variant="primary" size="sm">
                            {selectedModules.length} module{selectedModules.length > 1 ? 's' : ''} selected
                        </Badge>
                    </div>
                    <div className="selected-modules">
                        {selectedModules.map(m => (
                            <span 
                                key={m} 
                                className="selected-module-tag"
                                style={{ '--tag-color': modules?.[m]?.color || '#6366f1' }}
                            >
                                {modules?.[m]?.name || m}
                            </span>
                        ))}
                    </div>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleScan(); }} className="scan-form">
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="scan-input"
                        disabled={scanning}
                    />
                    <Button 
                        type="submit"
                        disabled={scanning || !url}
                        isLoading={scanning}
                        leftIcon={!scanning && <Play size={18} />}
                        className="scan-button"
                    >
                        {scanning ? 'Scanning...' : 'Scan Now'}
                    </Button>
                </form>
            </Card>

            {/* Progress Indicator */}
            {scanning && (
                <Card className="scan-progress-card" padding="lg">
                    <div className="scan-progress">
                        <div className="progress-icon">
                            <Search size={32} className="animate-pulse" />
                        </div>
                        <div className="progress-content">
                            <h3>Scanning Target...</h3>
                            <p>Analyzing vulnerabilities across selected modules</p>
                        </div>
                        <div className="progress-bar-container">
                            <div className="progress-bar-track">
                                <div className="progress-bar-fill" style={{ width: '60%' }} />
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Results Section */}
            {results && !scanning && (
                <ScanResults results={results} selectedModules={selectedModules} modules={modules} />
            )}

            {/* Recent Scans */}
            {recentScans.length > 0 && (
                <RecentScans scans={recentScans} navigate={navigate} />
            )}
        </PageContainer>
    );
};

const ScanResults = ({ results, selectedModules, modules }) => {
    const [selectedVuln, setSelectedVuln] = useState(null);
    const [filterSeverity, setFilterSeverity] = useState('all');

    const filteredVulns = filterSeverity === 'all' 
        ? results.vulnerabilities 
        : results.vulnerabilities.filter(v => v.severity === filterSeverity);

    const summary = results.summary || {};
    const totalCount = Object.values(summary).reduce((a, b) => a + b, 0);

    const severityFilters = [
        { key: 'all', label: 'All', count: totalCount, color: '#6366f1' },
        { key: 'critical', label: 'Critical', count: summary.critical || 0, color: 'var(--critical-color)' },
        { key: 'high', label: 'High', count: summary.high || 0, color: 'var(--high-color)' },
        { key: 'medium', label: 'Medium', count: summary.medium || 0, color: 'var(--warning-color)' },
        { key: 'low', label: 'Low', count: summary.low || 0, color: 'var(--success-color)' },
    ];

    return (
        <div className="modules-results">
            <div className="results-header">
                <h2>Scan Results</h2>
                <div className="filter-tabs">
                    {severityFilters.map((sev) => (
                        <button
                            key={sev.key}
                            className={`filter-tab ${filterSeverity === sev.key ? 'active' : ''}`}
                            style={{ 
                                '--tab-color': sev.color,
                                borderColor: filterSeverity === sev.key ? sev.color : 'transparent',
                                color: filterSeverity === sev.key ? sev.color : 'var(--text-secondary)'
                            }}
                            onClick={() => setFilterSeverity(sev.key)}
                        >
                            {sev.label}
                            <span className="filter-count">{sev.count}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Stats */}
            <div className="results-summary">
                <div className="summary-stat total">
                    <span className="summary-value">{totalCount}</span>
                    <span className="summary-label">Total Findings</span>
                </div>
                {Object.entries(summary).map(([severity, count]) => (
                    <div key={severity} className={`summary-stat ${severity}`}>
                        <span className="summary-value">{count}</span>
                        <span className="summary-label">{severity}</span>
                    </div>
                ))}
            </div>

            {/* Vulnerabilities List */}
            <Card className="vuln-list-card" padding="lg">
                <h4 className="vuln-list-title">Vulnerabilities ({filteredVulns.length})</h4>
                
                {filteredVulns.length === 0 ? (
                    <div className="vuln-empty">
                        <CheckCircle size={48} />
                        <h4>No vulnerabilities found!</h4>
                        <p>Great news - your target appears to be secure.</p>
                    </div>
                ) : (
                    <div className="vuln-list">
                        {filteredVulns.map((vuln, idx) => (
                            <div
                                key={idx}
                                className="vuln-item"
                                onClick={() => setSelectedVuln(vuln)}
                                style={{ '--vuln-color': getSeverityColor(vuln.severity) }}
                            >
                                <div className="vuln-severity-indicator" />
                                <div className="vuln-content">
                                    <div className="vuln-header">
                                        <h5 className="vuln-title">{vuln.title}</h5>
                                        <Badge 
                                            variant={getSeverityVariant(vuln.severity)} 
                                            size="sm"
                                        >
                                            {vuln.severity}
                                        </Badge>
                                    </div>
                                    <div className="vuln-meta">
                                        <span className="vuln-category">
                                            {vuln.categoryName || vuln.category || vuln.provider || vuln.pipelineType || vuln.platform || 'General'}
                                        </span>
                                        <span className="vuln-id">{vuln.id}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Vulnerability Detail Modal */}
            <Modal
                isOpen={!!selectedVuln}
                onClose={() => setSelectedVuln(null)}
                title={selectedVuln?.title}
                size="lg"
            >
                {selectedVuln && (
                    <div className="vuln-detail">
                        <div className="detail-meta">
                            <Badge variant={getSeverityVariant(selectedVuln.severity)}>
                                {selectedVuln.severity}
                            </Badge>
                            <span className="detail-id">{selectedVuln.id}</span>
                        </div>

                        <div className="detail-section">
                            <div className="detail-section-header">
                                <Target size={18} />
                                <h4>Affected URL</h4>
                            </div>
                            <div className="detail-url-box">
                                <code>{selectedVuln.url || 'N/A'}</code>
                                {selectedVuln.url && (
                                    <a href={selectedVuln.url} target="_blank" rel="noopener noreferrer" className="url-external">
                                        <ExternalLink size={14} />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="detail-section">
                            <div className="detail-section-header">
                                <FileText size={18} />
                                <h4>Description</h4>
                            </div>
                            <p className="detail-text">{selectedVuln.description || 'No description available.'}</p>
                        </div>

                        {selectedVuln.remediation && (
                            <div className="detail-section remediation">
                                <div className="detail-section-header">
                                    <CheckCircle size={18} />
                                    <h4>Remediation Steps</h4>
                                </div>
                                <p className="detail-text">{selectedVuln.remediation}</p>
                            </div>
                        )}

                        <div className="detail-actions">
                            <Button variant="secondary" onClick={() => setSelectedVuln(null)}>
                                Close
                            </Button>
                            <Button leftIcon={<ExternalLink size={16} />}>
                                <a href={selectedVuln.url} target="_blank" rel="noopener noreferrer" className="btn-link">
                                    Visit URL
                                </a>
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

const RecentScans = ({ scans, navigate }) => (
    <Card className="recent-scans-card" padding="lg">
        <h3 className="recent-title">Recent Module Scans</h3>
        <div className="recent-list">
            {scans.map((scan) => (
                <div 
                    key={scan.id} 
                    className="recent-item"
                    onClick={() => navigate(`/scan/${scan.scan_id}`)}
                >
                    <div className="recent-info">
                        <span className="recent-url">{scan.target_url}</span>
                        <span className="recent-date">
                            <Clock size={12} /> {new Date(scan.created_at).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="recent-stats">
                        <span className="recent-vulns">
                            <span className="critical">{scan.critical_count || 0}</span>
                            <span className="separator">/</span>
                            <span className="high">{scan.high_count || 0}</span>
                        </span>
                        <StatusBadge status={scan.status} />
                    </div>
                </div>
            ))}
        </div>
    </Card>
);

const getSeverityColor = (severity) => {
    const colors = {
        critical: 'var(--critical-color)',
        high: 'var(--high-color)',
        medium: 'var(--warning-color)',
        low: 'var(--success-color)',
        info: 'var(--info-color)'
    };
    return colors[severity?.toLowerCase()] || 'var(--info-color)';
};

const getSeverityVariant = (severity) => {
    const variants = {
        critical: 'danger',
        high: 'warning',
        medium: 'warning',
        low: 'success',
        info: 'info'
    };
    return variants[severity?.toLowerCase()] || 'info';
};

export default ScanModules;
