import React, { useState } from 'react';
import { 
    AlertTriangle, Clock, Check, X, Shield, 
    Send, History, CheckCircle, XCircle
} from 'lucide-react';
import { Button, Modal, Card } from './ui';
import { usePermissions } from '../contexts/PermissionContext';
import { useToast } from '../contexts/ToastContext';
import api from '../services/api';
import './ApprovalWorkflow.css';

const APPROVAL_TYPES = {
    'risk_accept': {
        title: 'Risk Acceptance Request',
        description: 'This action requires approval from a supervisor or admin.',
        icon: AlertTriangle,
        color: 'warning'
    },
    'white_label': {
        title: 'White-label Configuration',
        description: 'Changes to white-label settings require admin approval.',
        icon: Shield,
        color: 'info'
    },
    'user:change_role': {
        title: 'Role Change Request',
        description: 'Changing user roles requires admin approval.',
        icon: Shield,
        color: 'info'
    },
    'billing:modify': {
        title: 'Billing Modification',
        description: 'Changes to billing require billing manager approval.',
        icon: Clock,
        color: 'warning'
    },
    'api_key:create': {
        title: 'API Key Creation',
        description: 'Creating API keys requires approval.',
        icon: Clock,
        color: 'info'
    },
    'scanner:manage': {
        title: 'Scanner Node Management',
        description: 'Managing scanner nodes requires admin approval.',
        icon: Shield,
        color: 'danger'
    }
};

export const ApprovalWorkflow = ({ 
    type,
    resourceId,
    resourceType,
    resourceName,
    requestedAction,
    onApprove,
    onReject,
    onSubmit,
    showModal = false,
    setShowModal,
    children,
    buttonLabel = 'Request Approval',
    buttonVariant = 'secondary'
}) => {
    const toast = useToast();
    const { role } = usePermissions();
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState('');
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState([]);

    const approvalConfig = APPROVAL_TYPES[type] || {
        title: 'Approval Required',
        description: 'This action requires approval from a higher-level user.',
        icon: Clock,
        color: 'info'
    };

    const Icon = approvalConfig.icon;

    const handleSubmitRequest = async () => {
        setLoading(true);
        try {
            const response = await api.post('/approvals/request', {
                type,
                resourceId,
                resourceType,
                resourceName,
                requestedAction,
                notes
            });

            toast.success('Approval request submitted successfully');
            setShowModal(false);
            setNotes('');
            
            if (onSubmit) onSubmit(response.data);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to submit approval request');
        } finally {
            setLoading(false);
        }
    };

    const canApprove = ['admin', 'super_admin', 'supervisor'].includes(role);

    return (
        <>
            {children ? (
                <div onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }}>
                    {children}
                </div>
            ) : (
                <Button
                    variant={buttonVariant}
                    onClick={() => setShowModal(true)}
                    leftIcon={<Send size={16} />}
                >
                    {buttonLabel}
                </Button>
            )}

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={approvalConfig.title}
            >
                <div className="approval-request-form">
                    <div className={`approval-icon ${approvalConfig.color}`}>
                        <Icon size={32} />
                    </div>

                    <p className="approval-description">{approvalConfig.description}</p>

                    <div className="approval-resource">
                        <span className="resource-label">Resource:</span>
                        <span className="resource-name">{resourceName || resourceId}</span>
                        <span className="resource-type">{resourceType}</span>
                    </div>

                    <div className="form-group">
                        <label>Additional Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Provide any additional context for the approval request..."
                            rows={3}
                        />
                    </div>

                    <div className="approval-actions">
                        <Button
                            variant="secondary"
                            onClick={() => setShowModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmitRequest}
                            loading={loading}
                            leftIcon={<Send size={16} />}
                        >
                            Submit Request
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export const ApprovalBadge = ({ status, ...props }) => {
    const getConfig = () => {
        switch (status) {
            case 'pending':
                return { label: 'Pending Approval', className: 'pending', icon: Clock };
            case 'approved':
                return { label: 'Approved', className: 'approved', icon: CheckCircle };
            case 'rejected':
                return { label: 'Rejected', className: 'rejected', icon: XCircle };
            case 'expired':
                return { label: 'Expired', className: 'expired', icon: X };
            default:
                return { label: status, className: 'pending', icon: Clock };
        }
    };

    const config = getConfig();
    const Icon = config.icon;

    return (
        <span className={`approval-badge ${config.className}`} {...props}>
            <Icon size={12} />
            {config.label}
        </span>
    );
};

export const ApprovalHistory = ({ approvals = [], ...props }) => {
    return (
        <div className="approval-history" {...props}>
            <h4>Approval History</h4>
            {approvals.length === 0 ? (
                <p className="no-history">No approval history</p>
            ) : (
                <div className="history-list">
                    {approvals.map((approval, index) => (
                        <div key={index} className={`history-item ${approval.status}`}>
                            <div className="history-icon">
                                <ApprovalBadge status={approval.status} />
                            </div>
                            <div className="history-content">
                                <span className="history-action">{approval.action}</span>
                                <span className="history-date">
                                    {new Date(approval.createdAt).toLocaleString()}
                                </span>
                                {approval.notes && (
                                    <p className="history-notes">{approval.notes}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const ApprovalRequired = ({ moduleId, action, children, fallback = null }) => {
    const { requiresApproval, canManageModulePage } = usePermissions();
    const [showRequest, setShowRequest] = useState(false);

    if (!requiresApproval(moduleId, action)) {
        return children;
    }

    if (canManageModulePage(moduleId)) {
        return children;
    }

    return (
        <ApprovalWorkflow
            type={action}
            requestedAction={action}
            showModal={showRequest}
            setShowModal={setShowRequest}
        >
            {fallback || (
                <div className="approval-required-wrapper">
                    {children}
                    <div className="approval-required-overlay">
                        <Shield size={24} />
                        <span>Approval Required</span>
                        <Button size="small" onClick={(e) => { e.stopPropagation(); setShowRequest(true); }}>
                            Request Approval
                        </Button>
                    </div>
                </div>
            )}
        </ApprovalWorkflow>
    );
};

export default ApprovalWorkflow;
