import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, RefreshCw, Trash2, AlertTriangle, Clock, FileDown, 
    Shield, AlertOctagon, Filter, LayoutGrid, List, Download, X, ExternalLink, FileText, Link, Target, Copy,
    Check, Wifi, Activity, ChevronRight
} from 'lucide-react';
import { scanApi } from '../services/api';
import { PageContainer } from '../components/layout';
import { Card, Button, Badge, Modal } from '../components/ui';
import StatusBadge from '../components/StatusBadge';
import SeverityBadge from '../components/SeverityBadge';
import { formatDistanceToNow } from 'date-fns';
import { exportScanToPDFWithWatermark, exportScanToPDFWithoutWatermark } from '../utils/exportPdf';

const ScanResults = () => {
    const { scanId } = useParams();
    const navigate = useNavigate();
    const [scan, setScan] = useState(null);
    const [vulnerabilities, setVulnerabilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSeverity, setSelectedSeverity] = useState('all');
    const [selectedVuln, setSelectedVuln] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [copiedId, setCopiedId] = useState(null);

    const fetchScanResults = async () => {
        try {
            const response = await scanApi.getScanResults(scanId);
            setScan(response.data.scan);
            setVulnerabilities(response.data.vulnerabilities);
            return response.data;
        } catch (err) {
            setError('Failed to load scan results');
            console.error('Error fetching scan results:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setLoading(true);
        await fetchScanResults();
    };

    useEffect(() => {
        fetchScanResults();
    }, [scanId]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this scan?')) return;
        try {
            await scanApi.deleteScan(scanId);
            navigate('/scans');
        } catch (err) {
            setError('Failed to delete scan');
        }
    };

    const handleExportPDFWithWatermark = () => {
        if (scan && vulnerabilities.length > 0) {
            exportScanToPDFWithWatermark(scan, vulnerabilities);
        }
    };

    const handleExportPDFWithoutWatermark = () => {
        if (scan && vulnerabilities.length > 0) {
            exportScanToPDFWithoutWatermark(scan, vulnerabilities);
        }
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredVulnerabilities = selectedSeverity === 'all'
        ? vulnerabilities
        : vulnerabilities.filter(v => v.severity === selectedSeverity);

    const severityCounts = {
        critical: vulnerabilities.filter(v => v.severity === 'critical').length,
        high: vulnerabilities.filter(v => v.severity === 'high').length,
        medium: vulnerabilities.filter(v => v.severity === 'medium').length,
        low: vulnerabilities.filter(v => v.severity === 'low').length,
        info: vulnerabilities.filter(v => v.severity === 'info').length
    };

    const severityFilters = [
        { key: 'all', label: 'All', count: vulnerabilities.length, color: 'var(--primary-color)' },
        { key: 'critical', label: 'Critical', count: severityCounts.critical, color: 'var(--critical-color)' },
        { key: 'high', label: 'High', count: severityCounts.high, color: 'var(--high-color)' },
        { key: 'medium', label: 'Medium', count: severityCounts.medium, color: 'var(--warning-color)' },
        { key: 'low', label: 'Low', count: severityCounts.low, color: 'var(--success-color)' },
        { key: 'info', label: 'Info', count: severityCounts.info, color: 'var(--info-color)' },
    ];

    if (loading) {
        return (
            <PageContainer showNavbar={false}>
                <div className="results-loading">
                    <RefreshCw className="animate-spin" size={32} />
                    <p>Analyzing vulnerabilities...</p>
                </div>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer showNavbar={false}>
                <div className="results-error">
                    <AlertTriangle size={64} />
                    <h2>Error Loading Results</h2>
                    <p>{error}</p>
                    <Button onClick={() => navigate('/scans')}>Back to Scans</Button>
                </div>
            </PageContainer>
        );
    }

    const isScanActive = scan?.status === 'running' || scan?.status === 'pending';

    return (
        <PageContainer
            showNavbar={false}
            title="Vulnerability Assessment"
            subtitle={
                <span className="results-meta">
                    <Link size={14} /> {scan?.target_url}
                    <span className="meta-sep">|</span>
                    <Clock size={14} /> {scan?.created_at && formatDistanceToNow(new Date(scan.created_at), { addSuffix: true })}
                </span>
            }
            action={
                <div className="results-actions">
                    {(scan?.status === 'running' || scan?.status === 'pending') && (
                        <Badge variant="info" className="scan-progress-badge">
                            <Activity size={14} className="spin" /> Scanning...
                        </Badge>
                    )}
                    <Button variant="secondary" size="sm" leftIcon={<RefreshCw size={16} />} onClick={handleRefresh}>
                        Refresh
                    </Button>
                    <Button variant="danger" size="sm" leftIcon={<Trash2 size={16} />} onClick={handleDelete}>
                        Delete
                    </Button>
                </div>
            }
        >
            <div className="results-layout">
                {/* Stats Overview */}
                <Card className="results-stats-card" padding="lg">
                    <div className="total-vulns">
                        <AlertOctagon size={32} className="vuln-icon" />
                        <div>
                            <span className="total-count">{vulnerabilities.length}</span>
                            <span className="total-label">Total Findings</span>
                        </div>
                    </div>
                    <div className="severity-bars">
                        {severityFilters.slice(1).map((sev) => (
                            <div key={sev.key} className="severity-bar-item">
                                <div className="severity-bar-header">
                                    <span className="severity-dot" style={{ background: sev.color }}></span>
                                    <span className="severity-name">{sev.label}</span>
                                    <span className="severity-count">{sev.count}</span>
                                </div>
                                <div className="severity-bar-bg">
                                    <div 
                                        className="severity-bar-fill" 
                                        style={{ 
                                            width: vulnerabilities.length ? `${(sev.count / vulnerabilities.length) * 100}%` : '0%',
                                            background: sev.color
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Quick Actions */}
                <Card className="results-export-card" padding="lg">
                    <Button 
                        leftIcon={<Download size={16} />} 
                        onClick={handleExportPDFWithWatermark}
                        disabled={vulnerabilities.length === 0}
                    >
                        Branded PDF
                    </Button>
                    <Button 
                        variant="secondary" 
                        leftIcon={<Download size={16} />} 
                        onClick={handleExportPDFWithoutWatermark}
                        disabled={vulnerabilities.length === 0}
                    >
                        Clean PDF
                    </Button>
                </Card>
            </div>

            {/* Filter Bar */}
            <Card className="results-filter-card" padding="md">
                <div className="filter-tabs">
                    {severityFilters.map((filter) => (
                        <button
                            key={filter.key}
                            className={`filter-tab ${selectedSeverity === filter.key ? 'active' : ''}`}
                            style={{ 
                                '--tab-color': filter.color,
                                borderColor: selectedSeverity === filter.key ? filter.color : 'transparent',
                                color: selectedSeverity === filter.key ? filter.color : 'var(--text-secondary)'
                            }}
                            onClick={() => setSelectedSeverity(filter.key)}
                        >
                            <span className="filter-dot" style={{ background: filter.color }}></span>
                            {filter.label}
                            <span className="filter-count">{filter.count}</span>
                        </button>
                    ))}
                </div>
                <div className="view-toggle">
                    <button
                        className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                    >
                        <List size={18} />
                    </button>
                </div>
            </Card>

            {/* Vulnerabilities List */}
            {filteredVulnerabilities.length > 0 ? (
                <div className={viewMode === 'grid' ? 'vuln-grid' : 'vuln-list'}>
                    {filteredVulnerabilities.map((vuln, index) => (
                        <Card 
                            key={vuln.id} 
                            className="vuln-card"
                            hoverable
                            onClick={() => setSelectedVuln(vuln)}
                        >
                            <div className="vuln-card-header">
                                <div className="vuln-card-left">
                                    <span className="vuln-number">#{index + 1}</span>
                                    <SeverityBadge severity={vuln.severity} />
                                    <h3 className="vuln-title">{vuln.title}</h3>
                                </div>
                                <button
                                    className="copy-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        copyToClipboard(vuln.vulnerability_type, vuln.id);
                                    }}
                                >
                                    {copiedId === vuln.id ? <Check size={14} /> : <Copy size={14} />}
                                </button>
                            </div>

                            <div className="vuln-card-meta">
                                <span className="vuln-meta-item">
                                    <FileText size={14} />
                                    {vuln.vulnerability_type}
                                </span>
                                {vuln.owasp_category && (
                                    <span className="vuln-meta-item">
                                        <Shield size={14} />
                                        {vuln.owasp_category}
                                    </span>
                                )}
                            </div>

                            {viewMode === 'grid' && (
                                <p className="vuln-description">
                                    {vuln.description?.substring(0, 120)}...
                                </p>
                            )}

                            {viewMode === 'list' && vuln.description && (
                                <p className="vuln-description-full">{vuln.description}</p>
                            )}

                            <div className="vuln-card-footer">
                                <span className="vuln-url">{vuln.url}</span>
                                <span className="view-details">
                                    View Details <ChevronRight size={14} />
                                </span>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="results-empty-card" padding="lg">
                    {scan?.status === 'running' ? (
                        <>
                            <Activity size={64} className="spin pulse" />
                            <h3>Scan in Progress</h3>
                            <p>We're still analyzing the target. Found {vulnerabilities.length} potential issues so far...</p>
                        </>
                    ) : (
                        <>
                            <Shield size={64} style={{ color: 'var(--success-color)' }} />
                            <h3>No Vulnerabilities Found</h3>
                            <p>
                                {selectedSeverity !== 'all'
                                    ? `No ${selectedSeverity} severity vulnerabilities were detected.`
                                    : 'Great news! No security vulnerabilities were detected in this scan.'}
                            </p>
                        </>
                    )}
                </Card>
            )}

            {/* Detail Modal */}
            <Modal
                isOpen={!!selectedVuln}
                onClose={() => setSelectedVuln(null)}
                title={selectedVuln?.title}
                header={
                    selectedVuln && (
                        <div className="modal-header-content">
                            <SeverityBadge severity={selectedVuln.severity} />
                        </div>
                    )
                }
                footer={
                    selectedVuln && (
                        <div className="modal-footer-content">
                            <Button variant="secondary" onClick={() => setSelectedVuln(null)}>
                                Close
                            </Button>
                            <a
                                href={selectedVuln.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                            >
                                <ExternalLink size={16} />
                                Visit URL
                            </a>
                        </div>
                    )
                }
            >
                {selectedVuln && (
                    <div className="vuln-detail">
                        <div className="detail-meta">
                            <div className="meta-chip">
                                <FileText size={14} />
                                {selectedVuln.vulnerability_type}
                            </div>
                            {selectedVuln.owasp_category && (
                                <div className="meta-chip">
                                    <Shield size={14} />
                                    {selectedVuln.owasp_category}
                                </div>
                            )}
                            {selectedVuln.ghdb_id && (
                                <div className="meta-chip">
                                    <Wifi size={14} />
                                    GHDB: {selectedVuln.ghdb_id}
                                </div>
                            )}
                        </div>

                        <div className="detail-section">
                            <div className="section-header">
                                <Target size={18} />
                                <h3>Affected URL</h3>
                            </div>
                            <div className="url-box">
                                <span className="url-text">{selectedVuln.url}</span>
                                <a
                                    href={selectedVuln.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="url-link"
                                >
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>

                        <div className="detail-section">
                            <div className="section-header">
                                <FileText size={18} />
                                <h3>Description</h3>
                            </div>
                            <p className="section-text">
                                {selectedVuln.description || 'No description available for this vulnerability.'}
                            </p>
                        </div>

                        {selectedVuln.evidence && (
                            <div className="detail-section">
                                <div className="section-header">
                                    <AlertTriangle size={18} />
                                    <h3>Evidence</h3>
                                </div>
                                <pre className="code-block">{selectedVuln.evidence}</pre>
                            </div>
                        )}

                        {selectedVuln.remediation && (
                            <div className="detail-section">
                                <div className="section-header">
                                    <Shield size={18} />
                                    <h3>Remediation Steps</h3>
                                </div>
                                <p className="section-text">{selectedVuln.remediation}</p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </PageContainer>
    );
};

export default ScanResults;
