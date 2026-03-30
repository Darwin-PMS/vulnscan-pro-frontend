import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Trash2, AlertTriangle, Clock } from 'lucide-react';
import { scanApi } from '../services/api';
import VulnerabilityCard from '../components/VulnerabilityCard';
import VulnerabilityDetailModal from '../components/VulnerabilityDetailModal';
import StatusBadge from '../components/StatusBadge';
import StatCard from '../components/StatCard';
import { formatDistanceToNow } from 'date-fns';

const ScanResults = () => {
    const { scanId } = useParams();
    const navigate = useNavigate();
    const [scan, setScan] = useState(null);
    const [vulnerabilities, setVulnerabilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSeverity, setSelectedSeverity] = useState('all');
    const [pollingInterval, setPollingInterval] = useState(null);
    const [selectedVulnerability, setSelectedVulnerability] = useState(null);

    useEffect(() => {
        fetchScanResults();

        // Cleanup polling on unmount
        return () => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [scanId]);

    useEffect(() => {
        // Poll for updates if scan is running
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
            const [scanResponse, resultsResponse] = await Promise.all([
                scanApi.getScanResults(scanId),
                scanApi.getScanStatus(scanId)
            ]);

            setScan(scanResponse.data.scan);
            setVulnerabilities(scanResponse.data.vulnerabilities);

            // Stop polling if completed or failed
            if (['completed', 'failed'].includes(scanResponse.data.scan.status)) {
                if (pollingInterval) {
                    clearInterval(pollingInterval);
                    setPollingInterval(null);
                }
            }
        } catch (err) {
            setError('Failed to load scan results');
            console.error('Error fetching scan results:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this scan?')) {
            return;
        }

        try {
            await scanApi.deleteScan(scanId);
            navigate('/scans');
        } catch (err) {
            setError('Failed to delete scan');
        }
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

    if (loading) {
        return (
            <div className="container page-header">
                <div className="empty-state">
                    <div className="spinner" style={{ margin: '0 auto 24px' }}></div>
                    <p>Loading scan results...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container page-header">
                <div className="empty-state">
                    <AlertTriangle size={48} style={{ color: 'var(--danger-color)', marginBottom: '16px' }} />
                    <p style={{ color: 'var(--danger-color)' }}>{error}</p>
                    <button className="btn btn-secondary" onClick={() => navigate('/scans')} style={{ marginTop: '16px' }}>
                        Back to Scans
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="container page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                    <button className="btn btn-secondary" onClick={() => navigate('/scans')}>
                        <ArrowLeft size={18} />
                    </button>
                    <h1>Scan Results</h1>
                </div>
                <p>{scan?.target_url}</p>
            </div>

            <div className="container">
                {/* Scan Info Card */}
                <div className="card" style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <StatusBadge status={scan?.status} />
                                <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                                    <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                    {scan?.created_at && formatDistanceToNow(new Date(scan.created_at), { addSuffix: true })}
                                </span>
                            </div>

                            {(scan?.status === 'running' || scan?.status === 'pending') && (
                                <div className="scan-progress" style={{ marginTop: '16px', padding: '16px' }}>
                                    <div className="scan-progress-icon">
                                        <RefreshCw size={24} className="spin" />
                                    </div>
                                    <div className="scan-progress-content">
                                        <div className="scan-progress-title">Scan in Progress</div>
                                        <div className="scan-progress-subtitle">
                                            Checking for vulnerabilities using GHDB patterns...
                                            Found {vulnerabilities.length} so far
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn btn-secondary" onClick={fetchScanResults}>
                                <RefreshCw size={18} />
                                Refresh
                            </button>
                            <button className="btn btn-danger" onClick={handleDelete}>
                                <Trash2 size={18} />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>

                {/* Summary Stats */}
                <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>
                    Vulnerability Summary
                </h2>
                <div className="grid grid-4" style={{ marginBottom: '40px' }}>
                    <StatCard severity="critical" count={severityCounts.critical} label="Critical" />
                    <StatCard severity="high" count={severityCounts.high} label="High" />
                    <StatCard severity="medium" count={severityCounts.medium} label="Medium" />
                    <StatCard severity="low" count={severityCounts.low + severityCounts.info} label="Low & Info" />
                </div>

                {/* Filter and Vulnerabilities */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '600' }}>
                        Vulnerabilities ({filteredVulnerabilities.length})
                    </h2>

                    <select
                        className="input"
                        style={{ width: 'auto', minWidth: '150px' }}
                        value={selectedSeverity}
                        onChange={(e) => setSelectedSeverity(e.target.value)}
                    >
                        <option value="all">All Severities</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                        <option value="info">Info</option>
                    </select>
                </div>

                {filteredVulnerabilities.length > 0 ? (
                    <div className="grid grid-2">
                        {filteredVulnerabilities.map((vulnerability) => (
                            <VulnerabilityCard
                                key={vulnerability.id}
                                vulnerability={vulnerability}
                                onClick={setSelectedVulnerability}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="card empty-state">
                        <AlertTriangle size={48} style={{ color: 'var(--text-secondary)', marginBottom: '16px' }} />
                        <h3 className="empty-state-title">
                            {scan?.status === 'running'
                                ? 'Scan in Progress'
                                : 'No Vulnerabilities Found'}
                        </h3>
                        <p className="empty-state-description">
                            {scan?.status === 'running'
                                ? 'We are still scanning the target. Check back in a moment.'
                                : selectedSeverity !== 'all'
                                    ? `No ${selectedSeverity} severity vulnerabilities found.`
                                    : 'Great news! No vulnerabilities were detected in this scan.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Vulnerability Detail Modal */}
            <VulnerabilityDetailModal
                vulnerability={selectedVulnerability}
                onClose={() => setSelectedVulnerability(null)}
            />
        </div>
    );
};

export default ScanResults;