import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCheck, Trash2, RefreshCw, AlertTriangle, Info, AlertCircle, X, Filter, Settings } from 'lucide-react';
import { notificationApi } from '../../services/api';
import { Button, Card, Modal } from '../../components/ui';
import { PageContainer } from '../../components/layout';
import { useToast } from '../../contexts/ToastContext';
import './Notifications.css';

const Notifications = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({
        emailScanComplete: true,
        emailCriticalVuln: true,
        emailWeeklyDigest: false,
        pushScanComplete: true,
        pushCriticalVuln: true,
        inAppAll: true
    });

    useEffect(() => {
        loadNotifications();
        loadSettings();
    }, []);

    const loadNotifications = async () => {
        try {
            const response = await notificationApi.getAll({ filter });
            setNotifications(response.data);
        } catch (error) {
            console.error('Failed to load notifications:', error);
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const loadSettings = async () => {
        try {
            const response = await notificationApi.getSettings();
            if (response.data) {
                setSettings(response.data);
            }
        } catch (error) {
            console.error('Failed to load notification settings:', error);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await notificationApi.markRead(id);
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, is_read: true } : n
            ));
        } catch (error) {
            toast.error('Failed to mark as read');
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationApi.markAllRead();
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
            toast.success('All notifications marked as read');
        } catch (error) {
            toast.error('Failed to mark all as read');
        }
    };

    const handleDelete = async (id) => {
        try {
            await notificationApi.delete(id);
            setNotifications(notifications.filter(n => n.id !== id));
            toast.success('Notification deleted');
        } catch (error) {
            toast.error('Failed to delete notification');
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm('Delete all notifications?')) return;
        
        try {
            await notificationApi.clearAll();
            setNotifications([]);
            toast.success('All notifications cleared');
        } catch (error) {
            toast.error('Failed to clear notifications');
        }
    };

    const handleSaveSettings = async () => {
        try {
            await notificationApi.updateSettings(settings);
            setShowSettings(false);
            toast.success('Notification settings saved');
        } catch (error) {
            toast.error('Failed to save settings');
        }
    };

    const handleNotificationClick = async (notification) => {
        if (!notification.is_read) {
            await handleMarkRead(notification.id);
        }
        
        if (notification.action_url) {
            navigate(notification.action_url);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'scan_complete':
                return <Check size={18} />;
            case 'critical_vulnerability':
                return <AlertTriangle size={18} />;
            case 'security_alert':
                return <AlertCircle size={18} />;
            default:
                return <Info size={18} />;
        }
    };

    const getIconClass = (type) => {
        switch (type) {
            case 'scan_complete':
                return 'icon-success';
            case 'critical_vulnerability':
            case 'security_alert':
                return 'icon-danger';
            default:
                return 'icon-info';
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <PageContainer
            title="Notifications"
            subtitle="Stay updated with scan results and security alerts"
        >
            <div className="notifications-page">
                <Card className="notifications-header">
                    <div className="header-content">
                        <div className="header-left">
                            <h2>
                                <Bell size={20} />
                                Notifications
                                {unreadCount > 0 && (
                                    <span className="unread-badge">{unreadCount}</span>
                                )}
                            </h2>
                        </div>
                        <div className="header-actions">
                            <Button
                                variant="secondary"
                                size="small"
                                leftIcon={<Settings size={14} />}
                                onClick={() => setShowSettings(true)}
                            >
                                Settings
                            </Button>
                            <Button
                                variant="secondary"
                                size="small"
                                leftIcon={<CheckCheck size={14} />}
                                onClick={handleMarkAllRead}
                                disabled={unreadCount === 0}
                            >
                                Mark All Read
                            </Button>
                            <Button
                                variant="danger"
                                size="small"
                                leftIcon={<Trash2 size={14} />}
                                onClick={handleClearAll}
                                disabled={notifications.length === 0}
                            >
                                Clear All
                            </Button>
                        </div>
                    </div>
                    <div className="filter-tabs">
                        <button
                            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => { setFilter('all'); loadNotifications(); }}
                        >
                            All
                        </button>
                        <button
                            className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
                            onClick={() => { setFilter('unread'); loadNotifications(); }}
                        >
                            Unread
                        </button>
                        <button
                            className={`filter-tab ${filter === 'scan_complete' ? 'active' : ''}`}
                            onClick={() => { setFilter('scan_complete'); loadNotifications(); }}
                        >
                            Scan Complete
                        </button>
                        <button
                            className={`filter-tab ${filter === 'critical_vulnerability' ? 'active' : ''}`}
                            onClick={() => { setFilter('critical_vulnerability'); loadNotifications(); }}
                        >
                            Critical
                        </button>
                        <button
                            className={`filter-tab ${filter === 'security_alert' ? 'active' : ''}`}
                            onClick={() => { setFilter('security_alert'); loadNotifications(); }}
                        >
                            Security
                        </button>
                    </div>
                </Card>

                <Card className="notifications-list-card">
                    {loading ? (
                        <div className="loading-state">
                            <RefreshCw className="animate-spin" size={24} />
                            <p>Loading notifications...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="empty-state">
                            <Bell size={48} />
                            <h3>No notifications</h3>
                            <p>You're all caught up! New notifications will appear here.</p>
                        </div>
                    ) : (
                        <div className="notifications-list">
                            {notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className={`notification-icon ${getIconClass(notification.type)}`}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="notification-content">
                                        <div className="notification-header">
                                            <span className="notification-title">{notification.title}</span>
                                            <span className="notification-time">{formatTime(notification.created_at)}</span>
                                        </div>
                                        <p className="notification-message">{notification.message}</p>
                                        {notification.metadata && (
                                            <div className="notification-meta">
                                                {notification.metadata.target && (
                                                    <span className="meta-item">Target: {notification.metadata.target}</span>
                                                )}
                                                {notification.metadata.vulnerability_count && (
                                                    <span className="meta-item">
                                                        {notification.metadata.vulnerability_count} vulnerabilities
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="notification-actions">
                                        {!notification.is_read && (
                                            <button
                                                className="action-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMarkRead(notification.id);
                                                }}
                                                title="Mark as read"
                                            >
                                                <Check size={16} />
                                            </button>
                                        )}
                                        <button
                                            className="action-btn danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(notification.id);
                                            }}
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

                <Card className="notifications-info">
                    <h3>Notification Preferences</h3>
                    <p>Configure how you receive notifications about scan results, security alerts, and system updates.</p>
                    <div className="preference-summary">
                        <div className="preference-item">
                            <Bell size={16} />
                            <span>Email notifications for scan completion and critical findings</span>
                        </div>
                        <div className="preference-item">
                            <AlertTriangle size={16} />
                            <span>Instant alerts for critical vulnerabilities</span>
                        </div>
                        <div className="preference-item">
                            <Settings size={16} />
                            <span>Customizable notification settings</span>
                        </div>
                    </div>
                </Card>
            </div>

            <Modal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                title="Notification Settings"
            >
                <div className="notification-settings">
                    <div className="settings-section">
                        <h4>Email Notifications</h4>
                        <label className="setting-option">
                            <input
                                type="checkbox"
                                checked={settings.emailScanComplete}
                                onChange={(e) => setSettings({ ...settings, emailScanComplete: e.target.checked })}
                            />
                            <span>Notify when scans complete</span>
                        </label>
                        <label className="setting-option">
                            <input
                                type="checkbox"
                                checked={settings.emailCriticalVuln}
                                onChange={(e) => setSettings({ ...settings, emailCriticalVuln: e.target.checked })}
                            />
                            <span>Alert for critical vulnerabilities</span>
                        </label>
                        <label className="setting-option">
                            <input
                                type="checkbox"
                                checked={settings.emailWeeklyDigest}
                                onChange={(e) => setSettings({ ...settings, emailWeeklyDigest: e.target.checked })}
                            />
                            <span>Send weekly security digest</span>
                        </label>
                    </div>

                    <div className="settings-section">
                        <h4>Push Notifications</h4>
                        <label className="setting-option">
                            <input
                                type="checkbox"
                                checked={settings.pushScanComplete}
                                onChange={(e) => setSettings({ ...settings, pushScanComplete: e.target.checked })}
                            />
                            <span>Notify when scans complete</span>
                        </label>
                        <label className="setting-option">
                            <input
                                type="checkbox"
                                checked={settings.pushCriticalVuln}
                                onChange={(e) => setSettings({ ...settings, pushCriticalVuln: e.target.checked })}
                            />
                            <span>Alert for critical vulnerabilities</span>
                        </label>
                    </div>

                    <div className="settings-section">
                        <h4>In-App Notifications</h4>
                        <label className="setting-option">
                            <input
                                type="checkbox"
                                checked={settings.inAppAll}
                                onChange={(e) => setSettings({ ...settings, inAppAll: e.target.checked })}
                            />
                            <span>Show all notifications in-app</span>
                        </label>
                    </div>

                    <div className="form-actions">
                        <Button variant="secondary" onClick={() => setShowSettings(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveSettings}>
                            Save Settings
                        </Button>
                    </div>
                </div>
            </Modal>
        </PageContainer>
    );
};

export default Notifications;
