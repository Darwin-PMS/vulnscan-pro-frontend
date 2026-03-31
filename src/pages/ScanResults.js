import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, RefreshCw, Trash2, AlertTriangle, Clock, FileDown, 
    Shield, AlertOctagon, AlertCircle, CheckCircle, Filter, LayoutGrid,
    List, Download, X, ExternalLink, FileText, Link, Target, Copy,
    Check, Wifi, WifiOff, Activity, XCircle, ChevronRight, Sun, Moon
} from 'lucide-react';
import { scanApi } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import SeverityBadge from '../components/SeverityBadge';
import { formatDistanceToNow, format } from 'date-fns';
import { exportScanToPDFWithWatermark, exportScanToPDFWithoutWatermark } from '../utils/exportPdf';
import { useTheme } from '../contexts/ThemeContext';

const ScanResults = () => {
    const { scanId } = useParams();
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
    const [scan, setScan] = useState(null);
    const [vulnerabilities, setVulnerabilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSeverity, setSelectedSeverity] = useState('all');
    const [pollingInterval, setPollingInterval] = useState(null);
    const [selectedVuln, setSelectedVuln] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        fetchScanResults();
        return () => {
            if (pollingInterval) clearInterval(pollingInterval);
        };
    }, [scanId]);

    useEffect(() => {
        if (scan?.status === 'running' || scan?.status === 'pending') {
            const interval = setInterval(fetchScanResults, 3000);
            setPollingInterval(interval);
        } else if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
        }
    }, [scan?.status]);

    const fetchScanResults = async () => {
        try {
            const [scanResponse] = await Promise.all([
                scanApi.getScanResults(scanId)
            ]);
            setScan(scanResponse.data.scan);
            setVulnerabilities(scanResponse.data.vulnerabilities);
        } catch (err) {
            setError('Failed to load scan results');
            console.error('Error fetching scan results:', err);
        } finally {
            setLoading(false);
        }
    };

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
        { key: 'all', label: 'All', count: vulnerabilities.length, color: '#6366f1' },
        { key: 'critical', label: 'Critical', count: severityCounts.critical, color: '#dc2626' },
        { key: 'high', label: 'High', count: severityCounts.high, color: '#f97316' },
        { key: 'medium', label: 'Medium', count: severityCounts.medium, color: '#eab308' },
        { key: 'low', label: 'Low', count: severityCounts.low, color: '#22c55e' },
        { key: 'info', label: 'Info', count: severityCounts.info, color: '#3b82f6' },
    ];

    const theme = isDark ? {
        bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        bgSecondary: 'rgba(255,255,255,0.05)',
        bgCard: 'rgba(255,255,255,0.05)',
        bgCardHover: 'rgba(255,255,255,0.08)',
        border: 'rgba(255,255,255,0.1)',
        borderLight: 'rgba(255,255,255,0.15)',
        text: '#f1f5f9',
        textSecondary: '#94a3b8',
        textMuted: '#64748b',
    } : {
        bg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        bgSecondary: 'rgba(0,0,0,0.03)',
        bgCard: '#ffffff',
        bgCardHover: '#f8fafc',
        border: 'rgba(0,0,0,0.08)',
        borderLight: 'rgba(0,0,0,0.12)',
        text: '#0f172a',
        textSecondary: '#475569',
        textMuted: '#94a3b8',
    };

    if (loading) {
        return (
            <div style={{ ...styles.pageContainer, background: theme.bg }}>
                <div style={styles.loadingSpinner}></div>
                <p style={{ ...styles.loadingText, color: theme.text }}>Analyzing vulnerabilities...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ ...styles.errorContainer, background: theme.bg }}>
                <XCircle size={64} style={{ color: '#ef4444', marginBottom: '16px' }} />
                <h2 style={{ ...styles.errorTitle, color: theme.text }}>Error Loading Results</h2>
                <p style={{ ...styles.errorMessage, color: theme.textSecondary }}>{error}</p>
                <button style={styles.errorButton} onClick={() => navigate('/scans')}>
                    Back to Scans
                </button>
            </div>
        );
    }

    return (
        <div style={{ ...styles.pageContainer, background: theme.bg }}>
            {/* Header */}
            <header style={{ ...styles.header, ...{ borderBottom: `1px solid ${theme.border}`, background: theme.bgSecondary } }}>
                <div style={styles.headerLeft}>
                    <button style={{ ...styles.backButton, background: theme.bgCard, border: `1px solid ${theme.border}`, color: theme.text }} onClick={() => navigate('/scans')}>
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div style={styles.headerTitle}>
                            <h1 style={{ ...styles.title, color: theme.text }}>Vulnerability Assessment</h1>
                            <StatusBadge status={scan?.status} />
                        </div>
                        <div style={{ ...styles.headerMeta, color: theme.textSecondary }}>
                            <span style={styles.metaItem}>
                                <Link size={14} />
                                {scan?.target_url}
                            </span>
                            <span style={styles.metaItem}>
                                <Clock size={14} />
                                {scan?.created_at && formatDistanceToNow(new Date(scan.created_at), { addSuffix: true })}
                            </span>
                        </div>
                    </div>
                </div>
                <div style={styles.headerActions}>
                    <button 
                        style={{ ...styles.themeToggle, background: theme.bgCard, border: `1px solid ${theme.border}` }} 
                        onClick={toggleTheme}
                        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {isDark ? <Sun size={18} style={{ color: '#fbbf24' }} /> : <Moon size={18} style={{ color: '#6366f1' }} />}
                    </button>
                    {(scan?.status === 'running' || scan?.status === 'pending') && (
                        <div style={styles.progressBadge}>
                            <Activity size={16} className="spin" />
                            Scanning...
                        </div>
                    )}
                    <button style={{ ...styles.actionButton, background: theme.bgCard, border: `1px solid ${theme.border}`, color: theme.text }} onClick={fetchScanResults}>
                        <RefreshCw size={18} />
                    </button>
                    <button style={{ ...styles.dangerButton }} onClick={handleDelete}>
                        <Trash2 size={18} />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main style={styles.main}>
                {/* Stats Overview */}
                <section style={styles.statsSection}>
                    <div style={{ ...styles.statsCard, background: theme.bgCard, border: `1px solid ${theme.border}` }}>
                        <div style={styles.totalVulns}>
                            <AlertOctagon size={32} style={{ color: '#6366f1' }} />
                            <div>
                                <span style={{ ...styles.totalCount, color: theme.text }}>{vulnerabilities.length}</span>
                                <span style={{ ...styles.totalLabel, color: theme.textSecondary }}>Total Findings</span>
                            </div>
                        </div>
                        <div style={styles.severityBars}>
                            {severityFilters.slice(1).map((sev) => (
                                <div key={sev.key} style={styles.severityBarItem}>
                                    <div style={styles.severityBarHeader}>
                                        <span style={{ ...styles.severityDot, background: sev.color }}></span>
                                        <span style={{ ...styles.severityName, color: theme.textSecondary }}>{sev.label}</span>
                                        <span style={{ ...styles.severityCount, color: theme.text }}>{sev.count}</span>
                                    </div>
                                    <div style={{ ...styles.severityBarBg, background: theme.border }}>
                                        <div style={{
                                            ...styles.severityBarFill,
                                            width: vulnerabilities.length ? `${(sev.count / vulnerabilities.length) * 100}%` : '0%',
                                            background: sev.color
                                        }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div style={styles.quickActions}>
                        <button 
                            style={{ ...styles.exportButton, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }} 
                            onClick={handleExportPDFWithWatermark} 
                            disabled={vulnerabilities.length === 0}
                        >
                            <Download size={18} />
                            <span>Branded PDF</span>
                        </button>
                        <button 
                            style={{ ...styles.exportButtonSecondary, background: theme.bgCard, border: `1px solid ${theme.border}`, color: theme.text }} 
                            onClick={handleExportPDFWithoutWatermark} 
                            disabled={vulnerabilities.length === 0}
                        >
                            <Download size={18} />
                            <span>Clean PDF</span>
                        </button>
                    </div>
                </section>

                {/* Filter Bar */}
                <section style={{ ...styles.filterSection, background: theme.bgCard, border: `1px solid ${theme.border}` }}>
                    <div style={styles.filterTabs}>
                        {severityFilters.map((filter) => (
                            <button
                                key={filter.key}
                                style={{
                                    ...styles.filterTab,
                                    ...(selectedSeverity === filter.key ? styles.filterTabActive : {}),
                                    ...(selectedSeverity === filter.key ? { borderColor: filter.color, color: filter.color } : { color: theme.textSecondary }),
                                    background: selectedSeverity === filter.key ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)') : 'transparent'
                                }}
                                onClick={() => setSelectedSeverity(filter.key)}
                            >
                                <span style={{ ...styles.filterDot, background: filter.color }}></span>
                                {filter.label}
                                <span style={{ ...styles.filterCount, background: theme.border }}>{filter.count}</span>
                            </button>
                        ))}
                    </div>
                    <div style={{ ...styles.viewToggle, background: theme.border }}>
                        <button
                            style={{ ...styles.viewButton, ...(viewMode === 'grid' ? styles.viewButtonActive : {}), color: viewMode === 'grid' ? 'white' : theme.textSecondary }}
                            onClick={() => setViewMode('grid')}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            style={{ ...styles.viewButton, ...(viewMode === 'list' ? styles.viewButtonActive : {}), color: viewMode === 'list' ? 'white' : theme.textSecondary }}
                            onClick={() => setViewMode('list')}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </section>

                {/* Vulnerabilities List */}
                <section style={styles.vulnSection}>
                    {filteredVulnerabilities.length > 0 ? (
                        <div style={viewMode === 'grid' ? styles.vulnGrid : styles.vulnList}>
                            {filteredVulnerabilities.map((vuln, index) => (
                                <div
                                    key={vuln.id}
                                    style={{
                                        ...styles.vulnCard,
                                        ...(viewMode === 'list' ? styles.vulnCardList : {}),
                                        background: theme.bgCard,
                                        border: `1px solid ${theme.border}`,
                                    }}
                                    onClick={() => setSelectedVuln(vuln)}
                                    onMouseEnter={(e) => e.currentTarget.style.background = theme.bgCardHover}
                                    onMouseLeave={(e) => e.currentTarget.style.background = theme.bgCard}
                                >
                                    <div style={styles.vulnCardHeader}>
                                        <div style={styles.vulnCardLeft}>
                                            <span style={{ ...styles.vulnNumber, color: theme.textMuted }}>#{index + 1}</span>
                                            <SeverityBadge severity={vuln.severity} />
                                            <h3 style={{ ...styles.vulnTitle, color: theme.text }}>{vuln.title}</h3>
                                        </div>
                                        <div style={styles.vulnCardRight}>
                                            <button
                                                style={{ ...styles.copyButton, background: theme.bgSecondary, border: `1px solid ${theme.border}`, color: theme.textMuted }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    copyToClipboard(vuln.vulnerability_type, vuln.id);
                                                }}
                                            >
                                                {copiedId === vuln.id ? <Check size={14} /> : <Copy size={14} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ ...styles.vulnCardMeta, color: theme.textSecondary }}>
                                        <span style={styles.vulnMetaItem}>
                                            <FileText size={14} />
                                            {vuln.vulnerability_type}
                                        </span>
                                        {vuln.owasp_category && (
                                            <span style={styles.vulnMetaItem}>
                                                <Shield size={14} />
                                                {vuln.owasp_category}
                                            </span>
                                        )}
                                    </div>

                                    {viewMode === 'grid' && (
                                        <p style={{ ...styles.vulnDescription, color: theme.textSecondary }}>
                                            {vuln.description?.substring(0, 120)}...
                                        </p>
                                    )}

                                    {viewMode === 'list' && vuln.description && (
                                        <p style={{ ...styles.vulnDescriptionList, color: theme.textSecondary }}>{vuln.description}</p>
                                    )}

                                    <div style={styles.vulnCardFooter}>
                                        <span style={{ ...styles.vulnUrl, color: theme.textMuted }}>{vuln.url}</span>
                                        <span style={{ ...styles.viewDetails, color: theme.textSecondary }}>
                                            View Details <ChevronRight size={14} />
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ ...styles.emptyState, background: theme.bgCard, border: `1px solid ${theme.border}` }}>
                            {scan?.status === 'running' ? (
                                <>
                                    <Activity size={64} style={{ color: '#6366f1', marginBottom: '16px' }} className="spin" />
                                    <h3 style={{ ...styles.emptyTitle, color: theme.text }}>Scan in Progress</h3>
                                    <p style={{ ...styles.emptyText, color: theme.textSecondary }}>
                                        We're still analyzing the target. Found {vulnerabilities.length} potential issues so far...
                                    </p>
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={64} style={{ color: '#22c55e', marginBottom: '16px' }} />
                                    <h3 style={{ ...styles.emptyTitle, color: theme.text }}>No Vulnerabilities Found</h3>
                                    <p style={{ ...styles.emptyText, color: theme.textSecondary }}>
                                        {selectedSeverity !== 'all'
                                            ? `No ${selectedSeverity} severity vulnerabilities were detected.`
                                            : 'Great news! No security vulnerabilities were detected in this scan.'}
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </section>
            </main>

            {/* Detail Modal */}
            {selectedVuln && (
                <div style={styles.modalOverlay} onClick={() => setSelectedVuln(null)}>
                    <div style={{ ...styles.modal, background: isDark ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : '#ffffff' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ ...styles.modalHeader, borderBottom: `1px solid ${theme.border}` }}>
                            <div style={styles.modalHeaderLeft}>
                                <SeverityBadge severity={selectedVuln.severity} />
                                <h2 style={{ ...styles.modalTitle, color: theme.text }}>{selectedVuln.title}</h2>
                            </div>
                            <button style={{ ...styles.modalClose, color: theme.textSecondary }} onClick={() => setSelectedVuln(null)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ ...styles.modalMeta, background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)' }}>
                            <div style={{ ...styles.metaChip, background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
                                <FileText size={14} />
                                {selectedVuln.vulnerability_type}
                            </div>
                            {selectedVuln.owasp_category && (
                                <div style={{ ...styles.metaChip, background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
                                    <Shield size={14} />
                                    {selectedVuln.owasp_category}
                                </div>
                            )}
                            {selectedVuln.ghdb_id && (
                                <div style={{ ...styles.metaChip, background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
                                    <Wifi size={14} />
                                    GHDB: {selectedVuln.ghdb_id}
                                </div>
                            )}
                        </div>

                        <div style={{ ...styles.modalBody, background: isDark ? 'transparent' : '#f8fafc' }}>
                            <div style={styles.modalSection}>
                                <div style={styles.sectionHeader}>
                                    <Target size={18} />
                                    <h3 style={{ color: theme.text }}>Affected URL</h3>
                                </div>
                                <div style={{ ...styles.urlBox, background: isDark ? 'rgba(0,0,0,0.3)' : '#e2e8f0' }}>
                                    <span style={{ ...styles.urlText, color: isDark ? '#94a3b8' : '#475569' }}>{selectedVuln.url}</span>
                                    <a
                                        href={selectedVuln.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ ...styles.urlLink, color: '#6366f1' }}
                                    >
                                        <ExternalLink size={14} />
                                    </a>
                                </div>
                            </div>

                            <div style={styles.modalSection}>
                                <div style={styles.sectionHeader}>
                                    <FileText size={18} />
                                    <h3 style={{ color: theme.text }}>Description</h3>
                                </div>
                                <p style={{ ...styles.sectionText, color: theme.textSecondary }}>
                                    {selectedVuln.description || 'No description available for this vulnerability.'}
                                </p>
                            </div>

                            {selectedVuln.evidence && (
                                <div style={styles.modalSection}>
                                    <div style={styles.sectionHeader}>
                                        <AlertTriangle size={18} />
                                        <h3 style={{ color: theme.text }}>Evidence</h3>
                                    </div>
                                    <pre style={{ ...styles.codeBlock, background: isDark ? 'rgba(0,0,0,0.4)' : '#e2e8f0', color: isDark ? '#94a3b8' : '#475569' }}>
                                        {selectedVuln.evidence}
                                    </pre>
                                </div>
                            )}

                            {selectedVuln.remediation && (
                                <div style={styles.modalSection}>
                                    <div style={styles.sectionHeader}>
                                        <Shield size={18} />
                                        <h3 style={{ color: theme.text }}>Remediation Steps</h3>
                                    </div>
                                    <p style={{ ...styles.sectionText, color: theme.textSecondary }}>{selectedVuln.remediation}</p>
                                </div>
                            )}
                        </div>

                        <div style={{ ...styles.modalFooter, borderTop: `1px solid ${theme.border}`, background: isDark ? 'rgba(0,0,0,0.2)' : '#ffffff' }}>
                            <button style={{ ...styles.closeButton, border: `1px solid ${theme.border}`, color: theme.text }} onClick={() => setSelectedVuln(null)}>
                                Close
                            </button>
                            <a
                                href={selectedVuln.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ ...styles.visitButton, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                            >
                                <ExternalLink size={16} />
                                Visit URL
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    pageContainer: {
        minHeight: '100vh',
        color: '#f1f5f9'
    },
    loadingSpinner: {
        width: '48px',
        height: '48px',
        border: '4px solid rgba(99, 102, 241, 0.2)',
        borderTopColor: '#6366f1',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 16px',
        marginTop: '20vh'
    },
    loadingText: { fontSize: '18px', textAlign: 'center' },
    errorContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: '#f1f5f9',
        textAlign: 'center',
        padding: '24px'
    },
    errorTitle: { fontSize: '24px', marginBottom: '8px' },
    errorMessage: { marginBottom: '24px' },
    errorButton: {
        padding: '12px 24px',
        background: '#6366f1',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '24px 32px',
        backdropFilter: 'blur(10px)'
    },
    headerLeft: { display: 'flex', alignItems: 'flex-start', gap: '16px' },
    backButton: {
        padding: '10px',
        borderRadius: '10px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerTitle: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' },
    title: { fontSize: '24px', fontWeight: '700', margin: 0 },
    headerMeta: { display: 'flex', gap: '20px', fontSize: '14px' },
    metaItem: { display: 'flex', alignItems: 'center', gap: '6px' },
    headerActions: { display: 'flex', alignItems: 'center', gap: '12px' },
    themeToggle: {
        padding: '10px',
        borderRadius: '10px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    progressBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        background: 'rgba(99, 102, 241, 0.2)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '100px',
        color: '#818cf8',
        fontSize: '14px',
        fontWeight: '500'
    },
    actionButton: {
        padding: '10px',
        borderRadius: '10px',
        cursor: 'pointer'
    },
    dangerButton: {
        padding: '10px',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '10px',
        color: '#ef4444',
        cursor: 'pointer'
    },
    main: { padding: '32px' },
    statsSection: { display: 'flex', gap: '24px', marginBottom: '32px' },
    statsCard: {
        flex: 1,
        padding: '24px',
        borderRadius: '16px'
    },
    totalVulns: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
    totalCount: { display: 'block', fontSize: '48px', fontWeight: '800', lineHeight: 1 },
    totalLabel: { display: 'block', fontSize: '14px', marginTop: '4px' },
    severityBars: { display: 'flex', flexDirection: 'column', gap: '12px' },
    severityBarItem: {},
    severityBarHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontSize: '13px' },
    severityDot: { width: '8px', height: '8px', borderRadius: '50%' },
    severityName: { flex: 1 },
    severityCount: { fontWeight: '600' },
    severityBarBg: { height: '6px', borderRadius: '3px', overflow: 'hidden' },
    severityBarFill: { height: '100%', borderRadius: '3px', transition: 'width 0.3s ease' },
    quickActions: { display: 'flex', flexDirection: 'column', gap: '12px' },
    exportButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '14px 24px',
        border: 'none',
        borderRadius: '12px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        minWidth: '160px'
    },
    exportButtonSecondary: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '14px 24px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        minWidth: '160px'
    },
    filterSection: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        padding: '16px 20px',
        borderRadius: '12px'
    },
    filterTabs: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
    filterTab: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 14px',
        border: '1px solid transparent',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    filterTabActive: {},
    filterDot: { width: '6px', height: '6px', borderRadius: '50%' },
    filterCount: {
        padding: '2px 8px',
        borderRadius: '100px',
        fontSize: '11px'
    },
    viewToggle: { display: 'flex', gap: '4px', padding: '4px', borderRadius: '8px' },
    viewButton: {
        padding: '8px 12px',
        background: 'transparent',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
    },
    viewButtonActive: { background: '#6366f1' },
    vulnSection: {},
    vulnGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
        gap: '20px'
    },
    vulnList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    vulnCard: {
        padding: '20px',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    vulnCardList: { display: 'flex', gap: '20px', alignItems: 'flex-start' },
    vulnCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
    vulnCardLeft: { display: 'flex', alignItems: 'center', gap: '12px', flex: 1 },
    vulnNumber: { fontSize: '13px', minWidth: '24px' },
    vulnTitle: { fontSize: '15px', fontWeight: '600', margin: 0 },
    vulnCardRight: {},
    copyButton: {
        padding: '6px',
        borderRadius: '6px',
        cursor: 'pointer'
    },
    vulnCardMeta: { display: 'flex', gap: '16px', marginBottom: '12px', fontSize: '13px' },
    vulnMetaItem: { display: 'flex', alignItems: 'center', gap: '6px' },
    vulnDescription: { fontSize: '14px', lineHeight: 1.5, marginBottom: '12px' },
    vulnDescriptionList: { display: 'none' },
    vulnCardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' },
    vulnUrl: { maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    viewDetails: { display: 'flex', alignItems: 'center', gap: '4px' },
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        borderRadius: '16px',
        textAlign: 'center'
    },
    emptyTitle: { fontSize: '20px', fontWeight: '600', marginBottom: '8px' },
    emptyText: { maxWidth: '400px' },
    modalOverlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        zIndex: 1000
    },
    modal: {
        width: '100%',
        maxWidth: '700px',
        maxHeight: '90vh',
        borderRadius: '20px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '24px',
    },
    modalHeaderLeft: { display: 'flex', flexDirection: 'column', gap: '12px' },
    modalTitle: { fontSize: '20px', fontWeight: '700', margin: 0 },
    modalClose: {
        padding: '8px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer'
    },
    modalMeta: { display: 'flex', gap: '10px', padding: '12px 24px', flexWrap: 'wrap' },
    metaChip: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '100px',
        fontSize: '12px'
    },
    modalBody: { padding: '24px', overflowY: 'auto', flex: 1 },
    modalSection: { marginBottom: '24px' },
    sectionHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' },
    urlBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '13px',
        fontFamily: 'monospace'
    },
    urlText: { wordBreak: 'break-all' },
    urlLink: {
        padding: '6px',
        display: 'flex',
        textDecoration: 'none'
    },
    sectionText: { fontSize: '14px', lineHeight: 1.7 },
    codeBlock: {
        padding: '16px',
        borderRadius: '8px',
        fontSize: '12px',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        overflowX: 'auto'
    },
    modalFooter: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        padding: '20px 24px',
    },
    closeButton: {
        padding: '10px 20px',
        background: 'transparent',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer'
    },
    visitButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '500',
        textDecoration: 'none',
        cursor: 'pointer'
    }
};

export default ScanResults;
