import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanLine, Trash2, Eye, AlertTriangle } from 'lucide-react';
import { scanApi } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { formatDistanceToNow } from 'date-fns';

const ScanList = () => {
    const navigate = useNavigate();
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchScans();
    }, []);

    const fetchScans = async () => {
        try {
            const response = await scanApi.getAllScans({ limit: 100 });
            setScans(response.data.scans);
        } catch (err) {
            setError('Failed to load scans');
            console.error('Error fetching scans:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (scanId) => {
        if (!window.confirm('Are you sure you want to delete this scan?')) {
            return;
        }

        try {
            await scanApi.deleteScan(scanId);
            setScans(scans.filter(s => s.scan_id !== scanId));
        } catch (err) {
            setError('Failed to delete scan');
        }
    };

    if (loading) {
        return (
            <div className="container page-header">
                <div className="empty-state">
                    <div className="spinner" style={{ margin: '0 auto 24px' }}></div>
                    <p>Loading scans...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container page-header">
                <div className="empty-state">
                    <p style={{ color: 'var(--danger-color)' }}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="container page-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>All Scans</h1>
                        <p>View and manage all your vulnerability scans</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate('/scan')}>
                        <ScanLine size={18} />
                        New Scan
                    </button>
                </div>
            </div>

            <div className="container">
                <div className="card">
                    {scans.length > 0 ? (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>URL</th>
                                        <th>Status</th>
                                        <th>Vulnerabilities</th>
                                        <th>Critical</th>
                                        <th>High</th>
                                        <th>Started</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {scans.map((scan) => (
                                        <tr key={scan.scan_id}>
                                            <td style={{ maxWidth: '300px' }}>
                                                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {scan.target_url}
                                                </div>
                                            </td>
                                            <td>
                                                <StatusBadge status={scan.status} />
                                            </td>
                                            <td>
                                                <span style={{ fontWeight: '600' }}>
                                                    {scan.total_vulnerabilities || 0}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{
                                                    color: scan.critical_count > 0 ? '#fca5a5' : 'inherit',
                                                    fontWeight: scan.critical_count > 0 ? '600' : 'normal'
                                                }}>
                                                    {scan.critical_count || 0}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{
                                                    color: scan.high_count > 0 ? '#fdba74' : 'inherit',
                                                    fontWeight: scan.high_count > 0 ? '600' : 'normal'
                                                }}>
                                                    {scan.high_count || 0}
                                                </span>
                                            </td>
                                            <td>
                                                {formatDistanceToNow(new Date(scan.created_at), { addSuffix: true })}
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        className="btn btn-secondary"
                                                        style={{ padding: '8px 12px' }}
                                                        onClick={() => navigate(`/scan/${scan.scan_id}`)}
                                                        disabled={scan.status === 'pending' || scan.status === 'running'}
                                                        title={scan.status === 'pending' || scan.status === 'running' ? 'Scan in progress' : 'View results'}
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        className="btn btn-danger"
                                                        style={{ padding: '8px 12px' }}
                                                        onClick={() => handleDelete(scan.scan_id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <AlertTriangle size={48} style={{ color: 'var(--text-secondary)', marginBottom: '16px' }} />
                            <h3 className="empty-state-title">No Scans Yet</h3>
                            <p className="empty-state-description">
                                You haven't run any vulnerability scans yet. Start your first scan to detect security issues.
                            </p>
                            <button
                                className="btn btn-primary"
                                style={{ marginTop: '16px' }}
                                onClick={() => navigate('/scan')}
                            >
                                Start First Scan
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScanList;