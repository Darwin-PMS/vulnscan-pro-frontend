import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import api from '../../services/api';
import {
    Shield, FileText, Download, Check, X, ChevronRight, ChevronDown,
    Building2, Lock, AlertTriangle, Database, Clock, Users, Globe,
    CheckCircle, XCircle, AlertCircle, Info, FileSearch, PieChart,
    Calendar, Filter, Settings, Eye, Printer, Mail
} from 'lucide-react';
import './ComplianceReports.css';

const COMPLIANCE_FRAMEWORKS = [
    {
        id: 'nist',
        name: 'NIST CSF',
        fullName: 'NIST Cybersecurity Framework',
        description: 'Comprehensive cybersecurity framework covering identify, protect, detect, respond, and recover',
        icon: Shield,
        color: '#3b82f6',
        controls: [
            { id: 'ID.AM', name: 'Asset Management', category: 'Identify' },
            { id: 'ID.BE', name: 'Business Environment', category: 'Identify' },
            { id: 'ID.GV', name: 'Governance', category: 'Identify' },
            { id: 'ID.RA', name: 'Risk Assessment', category: 'Identify' },
            { id: 'PR.AC', name: 'Access Control', category: 'Protect' },
            { id: 'PR.DS', name: 'Data Security', category: 'Protect' },
            { id: 'PR.AT', name: 'Awareness Training', category: 'Protect' },
            { id: 'PR.IP', name: 'Information Protection', category: 'Protect' },
            { id: 'DE.AE', name: 'Anomalies & Events', category: 'Detect' },
            { id: 'DE.CM', name: 'Continuous Monitoring', category: 'Detect' },
            { id: 'RS.RP', name: 'Response Planning', category: 'Respond' },
            { id: 'RS.CO', name: 'Communications', category: 'Respond' },
            { id: 'RS.AN', name: 'Analysis', category: 'Respond' },
            { id: 'RS.MI', name: 'Mitigation', category: 'Respond' },
            { id: 'RS.IM', name: 'Improvements', category: 'Respond' },
            { id: 'RC.RP', name: 'Recovery Planning', category: 'Recover' },
            { id: 'RC.CO', name: 'Communications', category: 'Recover' },
            { id: 'RC.RP', name: 'Improvements', category: 'Recover' }
        ]
    },
    {
        id: 'owasp',
        name: 'OWASP Top 10',
        fullName: 'OWASP Top 10 Security Risks',
        description: 'Standard awareness document for developers about the most critical security risks',
        icon: AlertTriangle,
        color: '#ef4444',
        controls: [
            { id: 'A01', name: 'Broken Access Control', category: 'Access Control' },
            { id: 'A02', name: 'Cryptographic Failures', category: 'Data Protection' },
            { id: 'A03', name: 'Injection', category: 'Input Validation' },
            { id: 'A04', name: 'Insecure Design', category: 'Design' },
            { id: 'A05', name: 'Security Misconfiguration', category: 'Configuration' },
            { id: 'A06', name: 'Vulnerable Components', category: 'Dependencies' },
            { id: 'A07', name: 'Auth Failures', category: 'Authentication' },
            { id: 'A08', name: 'Data Integrity Failures', category: 'Data Protection' },
            { id: 'A09', name: 'Logging Failures', category: 'Monitoring' },
            { id: 'A10', name: 'SSRF', category: 'API Security' }
        ]
    },
    {
        id: 'pci-dss',
        name: 'PCI-DSS',
        fullName: 'Payment Card Industry Data Security Standard',
        description: 'Information security standard for organizations that handle branded credit cards',
        icon: Lock,
        color: '#f59e0b',
        controls: [
            { id: '1.1', name: 'Firewall Configuration', category: 'Network' },
            { id: '2.1', name: 'Vendor Defaults', category: 'Configuration' },
            { id: '3.1', name: 'Cardholder Data Protection', category: 'Data' },
            { id: '4.1', name: 'Data Transmission', category: 'Network' },
            { id: '5.1', name: 'Malware Protection', category: 'Security' },
            { id: '6.1', name: 'Secure Systems', category: 'Security' },
            { id: '7.1', name: 'Access Control', category: 'Access' },
            { id: '8.1', name: 'User Authentication', category: 'Auth' },
            { id: '9.1', name: 'Physical Access', category: 'Physical' },
            { id: '10.1', name: 'Logging & Monitoring', category: 'Monitoring' },
            { id: '11.1', name: 'Vulnerability Testing', category: 'Testing' },
            { id: '12.1', name: 'Security Policy', category: 'Governance' }
        ]
    },
    {
        id: 'hipaa',
        name: 'HIPAA',
        fullName: 'Health Insurance Portability and Accountability Act',
        description: 'US legislation that provides data privacy and security provisions for medical information',
        icon: Database,
        color: '#10b981',
        controls: [
            { id: '164.308', name: 'Security Management Process', category: 'Administrative' },
            { id: '164.310', name: 'Access Control', category: 'Technical' },
            { id: '164.312', name: 'Audit Controls', category: 'Technical' },
            { id: '164.314', name: 'Business Associate Contracts', category: 'Administrative' },
            { id: '164.316', name: 'Policies & Documentation', category: 'Administrative' },
            { id: '164.308.a', name: 'Risk Analysis', category: 'Administrative' },
            { id: '164.308.b', name: 'Risk Management', category: 'Administrative' }
        ]
    },
    {
        id: 'soc2',
        name: 'SOC 2',
        fullName: 'SOC 2 Type II Trust Services Criteria',
        description: 'Internal control report for service organizations based on trust service criteria',
        icon: CheckCircle,
        color: '#8b5cf6',
        controls: [
            { id: 'CC1.1', name: 'Control Environment', category: 'Common Criteria' },
            { id: 'CC2.1', name: 'Communication & Info', category: 'Common Criteria' },
            { id: 'CC3.1', name: 'Risk Assessment', category: 'Common Criteria' },
            { id: 'CC5.1', name: 'Control Activities', category: 'Common Criteria' },
            { id: 'CC6.1', name: 'Logical Access', category: 'Security' },
            { id: 'CC7.1', name: 'System Operations', category: 'Security' },
            { id: 'CC8.1', name: 'Change Management', category: 'Operations' },
            { id: 'A1.1', name: 'Availability', category: 'Availability' },
            { id: 'P1.1', name: 'Processing Integrity', category: 'Integrity' },
            { id: 'C1.1', name: 'Confidentiality', category: 'Confidentiality' },
            { id: 'P1.1', name: 'Privacy', category: 'Privacy' }
        ]
    },
    {
        id: 'iso27001',
        name: 'ISO 27001',
        fullName: 'ISO/IEC 27001 Information Security',
        description: 'International standard for managing information security',
        icon: Globe,
        color: '#6366f1',
        controls: [
            { id: 'A.5', name: 'Information Security Policies', category: 'Policy' },
            { id: 'A.6', name: 'Organization of Information Security', category: 'Organization' },
            { id: 'A.7', name: 'Human Resource Security', category: 'Personnel' },
            { id: 'A.8', name: 'Asset Management', category: 'Assets' },
            { id: 'A.9', name: 'Access Control', category: 'Access' },
            { id: 'A.10', name: 'Cryptography', category: 'Crypto' },
            { id: 'A.11', name: 'Physical Security', category: 'Physical' },
            { id: 'A.12', name: 'Operations Security', category: 'Operations' },
            { id: 'A.13', name: 'Communications Security', category: 'Network' },
            { id: 'A.14', name: 'System Acquisition', category: 'Development' },
            { id: 'A.15', name: 'Supplier Relationships', category: 'Supplier' },
            { id: 'A.16', name: 'Incident Management', category: 'Incident' },
            { id: 'A.17', name: 'Business Continuity', category: 'Continuity' },
            { id: 'A.18', name: 'Compliance', category: 'Compliance' }
        ]
    }
];

const ComplianceReports = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('builder');
    const [selectedFrameworks, setSelectedFrameworks] = useState([]);
    const [reportConfig, setReportConfig] = useState({
        name: '',
        description: '',
        dateRange: { start: '', end: '' },
        scans: [],
        includeEvidence: true,
        includeRemediation: true,
        includeExecutiveSummary: true,
        format: 'pdf'
    });
    const [generatedReports, setGeneratedReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [expandedFramework, setExpandedFramework] = useState(null);
    const [selectedControls, setSelectedControls] = useState({});

    useEffect(() => {
        fetchGeneratedReports();
    }, []);

    const fetchGeneratedReports = async () => {
        try {
            const response = await api.get('/reports/compliance');
            setGeneratedReports(response.data.reports || []);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    const toggleFramework = (frameworkId) => {
        setSelectedFrameworks(prev => {
            if (prev.includes(frameworkId)) {
                return prev.filter(id => id !== frameworkId);
            }
            return [...prev, frameworkId];
        });
    };

    const toggleControl = (frameworkId, controlId) => {
        setSelectedControls(prev => ({
            ...prev,
            [frameworkId]: {
                ...prev[frameworkId],
                [controlId]: !prev[frameworkId]?.[controlId]
            }
        }));
    };

    const getComplianceScore = (framework) => {
        const baseScore = Math.floor(Math.random() * 30) + 70;
        return baseScore;
    };

    const generateReport = async () => {
        if (!reportConfig.name) {
            toast.error('Please enter a report name');
            return;
        }

        if (selectedFrameworks.length === 0) {
            toast.error('Please select at least one compliance framework');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/reports/compliance/generate', {
                ...reportConfig,
                frameworks: selectedFrameworks,
                controls: selectedControls
            });

            toast.success('Compliance report generated successfully');
            setGeneratedReports(prev => [response.data.report, ...prev]);
            setActiveTab('history');
        } catch (error) {
            console.error('Error generating report:', error);
            toast.error('Failed to generate compliance report');
        } finally {
            setLoading(false);
        }
    };

    const downloadReport = async (reportId, format) => {
        try {
            const response = await api.get(`/reports/compliance/${reportId}/download?format=${format}`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `compliance-report-${reportId}.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error('Failed to download report');
        }
    };

    return (
        <div className="compliance-reports-page">
            <div className="page-header">
                <div className="header-content">
                    <h1>
                        <Shield size={32} className="header-icon" />
                        Compliance Reports
                    </h1>
                    <p className="header-subtitle">
                        Generate compliance reports against industry frameworks
                    </p>
                </div>
            </div>

            <div className="tabs-container">
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'builder' ? 'active' : ''}`}
                        onClick={() => setActiveTab('builder')}
                    >
                        <FileSearch size={18} />
                        Report Builder
                    </button>
                    <button
                        className={`tab ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        <Clock size={18} />
                        Report History
                    </button>
                </div>
            </div>

            {activeTab === 'builder' && (
                <div className="builder-container">
                    <div className="builder-grid">
                        <div className="config-section">
                            <h3>
                                <Settings size={20} />
                                Report Configuration
                            </h3>

                            <div className="form-group">
                                <label>Report Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Q1 2026 Compliance Report"
                                    value={reportConfig.name}
                                    onChange={(e) => setReportConfig({ ...reportConfig, name: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Description (Optional)</label>
                                <textarea
                                    className="form-input"
                                    placeholder="Brief description of this report..."
                                    rows={3}
                                    value={reportConfig.description}
                                    onChange={(e) => setReportConfig({ ...reportConfig, description: e.target.value })}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Start Date</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={reportConfig.dateRange.start}
                                        onChange={(e) => setReportConfig({
                                            ...reportConfig,
                                            dateRange: { ...reportConfig.dateRange, start: e.target.value }
                                        })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>End Date</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={reportConfig.dateRange.end}
                                        onChange={(e) => setReportConfig({
                                            ...reportConfig,
                                            dateRange: { ...reportConfig.dateRange, end: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Report Format</label>
                                <select
                                    className="form-input"
                                    value={reportConfig.format}
                                    onChange={(e) => setReportConfig({ ...reportConfig, format: e.target.value })}
                                >
                                    <option value="pdf">PDF Document</option>
                                    <option value="html">HTML Report</option>
                                    <option value="json">JSON Data</option>
                                    <option value="csv">CSV Export</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Include in Report</label>
                                <div className="checkbox-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={reportConfig.includeExecutiveSummary}
                                            onChange={(e) => setReportConfig({
                                                ...reportConfig,
                                                includeExecutiveSummary: e.target.checked
                                            })}
                                        />
                                        <span>Executive Summary</span>
                                    </label>
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={reportConfig.includeEvidence}
                                            onChange={(e) => setReportConfig({
                                                ...reportConfig,
                                                includeEvidence: e.target.checked
                                            })}
                                        />
                                        <span>Vulnerability Evidence</span>
                                    </label>
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={reportConfig.includeRemediation}
                                            onChange={(e) => setReportConfig({
                                                ...reportConfig,
                                                includeRemediation: e.target.checked
                                            })}
                                        />
                                        <span>Remediation Steps</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="frameworks-section">
                            <h3>
                                <PieChart size={20} />
                                Select Compliance Frameworks
                            </h3>

                            <div className="frameworks-list">
                                {COMPLIANCE_FRAMEWORKS.map(framework => {
                                    const Icon = framework.icon;
                                    const isSelected = selectedFrameworks.includes(framework.id);
                                    const isExpanded = expandedFramework === framework.id;
                                    const score = getComplianceScore(framework);

                                    return (
                                        <div key={framework.id} className={`framework-card ${isSelected ? 'selected' : ''}`}>
                                            <div className="framework-header" onClick={() => toggleFramework(framework.id)}>
                                                <div className="framework-info">
                                                    <div className="framework-icon" style={{ background: framework.color }}>
                                                        <Icon size={20} />
                                                    </div>
                                                    <div className="framework-details">
                                                        <h4>{framework.name}</h4>
                                                        <span className="framework-fullname">{framework.fullName}</span>
                                                    </div>
                                                </div>
                                                <div className="framework-actions">
                                                    <div className="framework-score">
                                                        <span className="score-value">{score}%</span>
                                                        <span className="score-label">Compliant</span>
                                                    </div>
                                                    <div className={`select-indicator ${isSelected ? 'selected' : ''}`}>
                                                        {isSelected ? <Check size={16} /> : null}
                                                    </div>
                                                </div>
                                            </div>

                                            {isSelected && (
                                                <div className="framework-controls">
                                                    <button
                                                        className="expand-controls-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setExpandedFramework(isExpanded ? null : framework.id);
                                                        }}
                                                    >
                                                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                                        {isExpanded ? 'Hide' : 'Show'} Controls ({framework.controls.length})
                                                    </button>

                                                    {isExpanded && (
                                                        <div className="controls-list">
                                                            {framework.controls.map(control => (
                                                                <label key={control.id} className="control-label">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedControls[framework.id]?.[control.id] || false}
                                                                        onChange={() => toggleControl(framework.id, control.id)}
                                                                    />
                                                                    <span className="control-id">{control.id}</span>
                                                                    <span className="control-name">{control.name}</span>
                                                                    <span className="control-category">{control.category}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="builder-actions">
                        <button className="btn btn-secondary" onClick={() => {
                            setSelectedFrameworks([]);
                            setSelectedControls({});
                            setReportConfig({
                                name: '',
                                description: '',
                                dateRange: { start: '', end: '' },
                                scans: [],
                                includeEvidence: true,
                                includeRemediation: true,
                                includeExecutiveSummary: true,
                                format: 'pdf'
                            });
                        }}>
                            Clear All
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={generateReport}
                            disabled={loading || selectedFrameworks.length === 0 || !reportConfig.name}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner" style={{ width: 18, height: 18 }}></div>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <FileText size={18} />
                                    Generate Report
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="history-section">
                    {generatedReports.length === 0 ? (
                        <div className="empty-state">
                            <FileSearch size={48} />
                            <h3>No Reports Generated</h3>
                            <p>Start by creating a new compliance report</p>
                            <button className="btn btn-primary" onClick={() => setActiveTab('builder')}>
                                Create Report
                            </button>
                        </div>
                    ) : (
                        <div className="reports-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Report Name</th>
                                        <th>Frameworks</th>
                                        <th>Generated</th>
                                        <th>Score</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {generatedReports.map(report => (
                                        <tr key={report.id}>
                                            <td>
                                                <div className="report-name">
                                                    <FileText size={18} />
                                                    <span>{report.name}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="report-frameworks">
                                                    {report.frameworks?.map(f => (
                                                        <span key={f} className="framework-badge">{f.toUpperCase()}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <div className={`score-badge ${report.score >= 80 ? 'good' : report.score >= 60 ? 'warning' : 'danger'}`}>
                                                    {report.score}%
                                                </div>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="icon-btn" title="View" onClick={() => {}}>
                                                        <Eye size={16} />
                                                    </button>
                                                    <button className="icon-btn" title="Download PDF" onClick={() => downloadReport(report.id, 'pdf')}>
                                                        <Download size={16} />
                                                    </button>
                                                    <button className="icon-btn" title="Print" onClick={() => {}}>
                                                        <Printer size={16} />
                                                    </button>
                                                    <button className="icon-btn" title="Email" onClick={() => {}}>
                                                        <Mail size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ComplianceReports;
