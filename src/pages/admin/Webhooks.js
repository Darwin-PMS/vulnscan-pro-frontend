import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Webhook as WebhookIcon, Plus, Trash2, RefreshCw, Send, Check, AlertCircle, ExternalLink, Bell } from 'lucide-react';
import { webhookApi } from '../../services/api';
import { Button, Card, Input, Modal } from '../../components/ui';
import { PageContainer } from '../../components/layout';
import { useToast } from '../../contexts/ToastContext';
import './Webhooks.css';

const Webhooks = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [webhooks, setWebhooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [showNewWebhook, setShowNewWebhook] = useState(null);
    const [availableEvents, setAvailableEvents] = useState([]);
    const [creating, setCreating] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [selectedEvents, setSelectedEvents] = useState([]);

    useEffect(() => {
        loadWebhooks();
        loadEvents();
    }, []);

    const loadWebhooks = async () => {
        try {
            const response = await webhookApi.getAll();
            setWebhooks(response.data);
        } catch (error) {
            console.error('Failed to load webhooks:', error);
            toast.error('Failed to load webhooks');
        } finally {
            setLoading(false);
        }
    };

    const loadEvents = async () => {
        try {
            const response = await webhookApi.getEvents();
            setAvailableEvents(response.data);
        } catch (error) {
            console.error('Failed to load events:', error);
        }
    };

    const handleCreate = async () => {
        if (!name.trim() || !url.trim() || selectedEvents.length === 0) {
            toast.error('Please fill in all fields');
            return;
        }

        setCreating(true);
        try {
            const response = await webhookApi.create({
                name: name.trim(),
                url: url.trim(),
                events: selectedEvents
            });

            setShowCreate(false);
            setShowNewWebhook(response.data);
            setName('');
            setUrl('');
            setSelectedEvents([]);
            toast.success('Webhook created successfully');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to create webhook');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id, webhookName) => {
        if (!window.confirm(`Delete webhook "${webhookName}"?`)) return;

        try {
            await webhookApi.delete(id);
            setWebhooks(webhooks.filter(w => w.id !== id));
            toast.success('Webhook deleted');
        } catch (error) {
            toast.error('Failed to delete webhook');
        }
    };

    const handleTest = async (id) => {
        try {
            await webhookApi.test(id);
            toast.success('Test webhook sent');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to send test webhook');
        }
    };

    const toggleEvent = (event) => {
        setSelectedEvents(prev =>
            prev.includes(event)
                ? prev.filter(e => e !== event)
                : [...prev, event]
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleString();
    };

    return (
        <PageContainer
            title="Webhooks"
            subtitle="Receive notifications when events occur"
        >
            <div className="webhooks-page">
                <Card className="webhooks-header">
                    <div className="header-content">
                        <div>
                            <h2>Webhooks</h2>
                            <p>Get real-time notifications when scans complete or vulnerabilities are found</p>
                        </div>
                        <Button leftIcon={<Plus size={16} />} onClick={() => setShowCreate(true)}>
                            Add Webhook
                        </Button>
                    </div>
                </Card>

                <Card className="webhooks-list-card">
                    {loading ? (
                        <div className="loading-state">
                            <RefreshCw className="animate-spin" size={24} />
                            <p>Loading webhooks...</p>
                        </div>
                    ) : webhooks.length === 0 ? (
                        <div className="empty-state">
                            <WebhookIcon size={48} />
                            <h3>No webhooks yet</h3>
                            <p>Create your first webhook to receive notifications</p>
                            <Button onClick={() => setShowCreate(true)}>
                                Create Webhook
                            </Button>
                        </div>
                    ) : (
                        <div className="webhooks-list">
                            {webhooks.map(webhook => (
                                <div key={webhook.id} className="webhook-item">
                                    <div className="webhook-info">
                                        <div className="webhook-header">
                                            <WebhookIcon size={18} />
                                            <span className="webhook-name">{webhook.name}</span>
                                            <span className={`webhook-status ${webhook.is_active ? 'active' : 'inactive'}`}>
                                                {webhook.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="webhook-url">
                                            <code>{webhook.url}</code>
                                        </div>
                                        <div className="webhook-events">
                                            {JSON.parse(webhook.events || '[]').map(event => (
                                                <span key={event} className="event-badge">{event}</span>
                                            ))}
                                        </div>
                                        <div className="webhook-meta">
                                            <span>Last triggered: {formatDate(webhook.last_triggered_at)}</span>
                                            {webhook.failure_count > 0 && (
                                                <span className="failure-count">
                                                    <AlertCircle size={14} />
                                                    {webhook.failure_count} failures
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="webhook-actions">
                                        <button 
                                            className="action-btn"
                                            onClick={() => handleTest(webhook.id)}
                                            title="Send test"
                                        >
                                            <Send size={16} />
                                        </button>
                                        <button 
                                            className="action-btn danger"
                                            onClick={() => handleDelete(webhook.id, webhook.name)}
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                <Card className="webhooks-info">
                    <h3>About Webhooks</h3>
                    <p>Webhooks allow you to receive real-time notifications about events in VulnScan Pro. When an event occurs, we'll send an HTTP POST request to your configured URL.</p>
                    <div className="signature-info">
                        <h4>Verifying Webhook Signatures</h4>
                        <p>Each webhook includes a signature in the <code>X-Webhook-Signature</code> header. Verify this signature to ensure the request came from VulnScan Pro.</p>
                        <pre>
{`const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
    const expected = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expected)
    );
}`}
                        </pre>
                    </div>
                </Card>
            </div>

            <Modal
                isOpen={showCreate}
                onClose={() => setShowCreate(false)}
                title="Create Webhook"
            >
                <div className="create-webhook-form">
                    <Input
                        label="Name"
                        placeholder="My Webhook"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <Input
                        label="URL"
                        placeholder="https://example.com/webhook"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />

                    <div className="form-group">
                        <label>Events</label>
                        <div className="events-list">
                            {availableEvents.map(event => (
                                <label key={event.event} className="event-option">
                                    <input
                                        type="checkbox"
                                        checked={selectedEvents.includes(event.event)}
                                        onChange={() => toggleEvent(event.event)}
                                    />
                                    <div>
                                        <strong>{event.event}</strong>
                                        <span>{event.description}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-actions">
                        <Button variant="secondary" onClick={() => setShowCreate(false)}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleCreate} 
                            loading={creating}
                            disabled={!name || !url || selectedEvents.length === 0}
                        >
                            Create Webhook
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={!!showNewWebhook}
                onClose={() => setShowNewWebhook(null)}
                title="Webhook Created"
            >
                <div className="new-webhook-display">
                    <div className="warning-banner">
                        <AlertCircle size={20} />
                        <p>Save the webhook secret now. You won't be able to see it again!</p>
                    </div>

                    <div className="webhook-secret">
                        <label>Webhook Secret</label>
                        <div className="secret-value">
                            <code>{showNewWebhook?.secret}</code>
                        </div>
                    </div>

                    <div className="webhook-details">
                        <p><strong>Name:</strong> {showNewWebhook?.name}</p>
                        <p><strong>URL:</strong> {showNewWebhook?.url}</p>
                        <p><strong>Events:</strong> {showNewWebhook?.events?.join(', ')}</p>
                    </div>

                    <Button onClick={() => setShowNewWebhook(null)} className="done-btn">
                        Done
                    </Button>
                </div>
            </Modal>
        </PageContainer>
    );
};

export default Webhooks;
