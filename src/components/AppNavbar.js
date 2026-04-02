import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    Shield, LayoutDashboard, ScanLine, List, Database, Smartphone, 
    BookOpen, Terminal, LogOut, User, Bot, Crown, DollarSign, 
    Settings, ChevronDown, X, Menu, Zap, Activity, Target,
    Layers, Globe, Code, Cloud, GitBranch, Lock, Bug, FileSearch,
    ArrowRight, Sun, Moon, BarChart3, Key, ShieldCheck, Webhook, Bell, AlertTriangle, FileText, Book, Clock, Users, History, Server, Palette
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePermissions } from '../contexts/PermissionContext';
import { SubscriptionBadge } from './SubscriptionComponents';
import { notificationApi } from '../services/api';
import { MODULE_ROUTES_MAP, getVisibleModules } from '../config/moduleOwnership';

const AppNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const { role, canAccessModulePage, isSuperAdmin } = usePermissions();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [recentNotifications, setRecentNotifications] = useState([]);

    const visibleModules = getVisibleModules(role);

    const isModuleAccessible = (moduleId) => {
        return canAccessModulePage(moduleId);
    };

    useEffect(() => {
        loadUnreadCount();
        const interval = setInterval(loadUnreadCount, 60000);
        return () => clearInterval(interval);
    }, []);

    const loadUnreadCount = async () => {
        try {
            const response = await notificationApi.getUnreadCount();
            setUnreadCount(response.data.count);
        } catch (error) {
            console.error('Failed to load unread count:', error);
        }
    };

    const loadRecentNotifications = async () => {
        try {
            const response = await notificationApi.getAll({ limit: 5 });
            setRecentNotifications(response.data);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        }
    };

    const handleBellClick = () => {
        if (!showNotifications) {
            loadRecentNotifications();
        }
        setShowNotifications(!showNotifications);
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationApi.markAllRead();
            setUnreadCount(0);
            setRecentNotifications(recentNotifications.map(n => ({ ...n, is_read: true })));
        } catch (error) {
            console.error('Failed to mark all read:', error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'critical_vulnerability':
            case 'security_alert':
                return <AlertTriangle size={16} className="notif-icon danger" />;
            default:
                return <Bell size={16} className="notif-icon" />;
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    const quickNavItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/scan', label: 'New Scan', icon: ScanLine, highlight: true },
    ];

    const securityTestingNav = [
        { path: '/scan-modules', label: 'Scan Modules', icon: Layers, desc: 'Configure scan types' },
        { path: '/web-security', label: 'Web Security', icon: Globe, desc: 'OWASP Top 10 coverage' },
        { path: '/api-security', label: 'API Security', icon: Code, desc: 'REST & GraphQL testing' },
        { path: '/mobile', label: 'Mobile Security', icon: Smartphone, desc: 'Android & iOS testing' },
    ];

    const toolsNav = [
        { path: '/ai-assistant', label: 'AI Assistant', icon: Bot, desc: 'Groq-powered help' },
        { path: '/terminal', label: 'Terminal Lab', icon: Terminal, desc: 'Linux command practice' },
        { path: '/dorks', label: 'GHDB Patterns', icon: Database, desc: 'Google hacking database' },
        { path: '/learning', label: 'Learning Center', icon: BookOpen, desc: 'Security courses' },
    ];

    const resourceNav = [
        { path: '/scans', label: 'Scan History', icon: List, desc: 'View past scans', module: 'scanEngine' },
        { path: '/scheduled-scans', label: 'Scheduled Scans', icon: Clock, desc: 'Automated scans', module: 'scanEngine' },
        { path: '/plan-comparison', label: 'Compare Plans', icon: BarChart3, desc: 'View all plans', module: 'billing' },
        { path: '/compliance-reports', label: 'Compliance', icon: ShieldCheck, desc: 'Compliance reports', module: 'compliance' },
        { path: '/tools', label: 'All Tools', icon: Zap, desc: 'Complete tool listing', module: 'dashboard' },
    ];

    const adminNav = [
        { path: '/user-management', label: 'User Management', icon: Users, desc: 'Manage team members', module: 'teamManagement' },
        { path: '/permission-management', label: 'Permissions', icon: Shield, desc: 'Configure access control', module: 'permissionManagement' },
        { path: '/audit-logs', label: 'Audit Logs', icon: History, desc: 'View activity logs', module: 'auditLogs' },
        { path: '/api-docs', label: 'API Documentation', icon: Book, desc: 'API reference', module: 'apiTokens' },
        { path: '/notifications', label: 'Notifications', icon: Bell, desc: 'System notifications', module: 'notifications' },
        { path: '/sso', label: 'SSO Configuration', icon: Lock, desc: 'Configure SSO providers', module: 'integrations' },
        { path: '/mfa-enforcement', label: 'MFA Enforcement', icon: ShieldCheck, desc: 'Configure MFA requirements', module: 'settings' },
    ];

    const settingsNav = [
        { path: '/settings', label: 'Settings', icon: Settings, desc: 'Organization settings', module: 'settings' },
        { path: '/webhooks', label: 'Webhooks', icon: Webhook, desc: 'Webhook configuration', module: 'integrations' },
        { path: '/api-keys', label: 'API Keys', icon: Key, desc: 'Manage API keys', module: 'apiTokens' },
    ];

    return (
        <nav className={`app-navbar ${isDark ? 'app-navbar-dark' : 'app-navbar-light'}`}>
            <div className="app-navbar-container">
                {/* Logo */}
                <Link to="/dashboard" className="app-nav-brand">
                    <div className="app-nav-brand-icon">
                        <Shield size={20} />
                    </div>
                    <span className="app-nav-brand-text">VulnScan Pro</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="app-nav-main">
                    {/* Quick Links */}
                    <div className="app-nav-section">
                        {quickNavItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`app-nav-item ${isActive(item.path) ? 'active' : ''} ${item.highlight ? 'highlight' : ''}`}
                                >
                                    <Icon size={18} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Security Testing Dropdown */}
                    <div 
                        className="app-nav-dropdown"
                        onMouseEnter={() => setActiveDropdown('security')}
                        onMouseLeave={() => setActiveDropdown(null)}
                    >
                        <button className={`app-nav-item app-nav-dropdown-trigger ${activeDropdown === 'security' ? 'active' : ''}`}>
                            <Shield size={18} />
                            <span>Security Testing</span>
                            <ChevronDown size={14} className={`app-nav-chevron ${activeDropdown === 'security' ? 'open' : ''}`} />
                        </button>
                        <div className={`app-nav-dropdown-menu app-dropdown-mega ${activeDropdown === 'security' ? 'show' : ''}`}>
                            <div className="app-dropdown-mega-content">
                                <div className="app-dropdown-section">
                                    <h4 className="app-dropdown-section-title">Scan Types</h4>
                                    {securityTestingNav.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                className={`app-nav-dropdown-item ${isActive(item.path) ? 'active' : ''}`}
                                                onClick={() => setActiveDropdown(null)}
                                            >
                                                <Icon size={18} className="app-dropdown-item-icon" />
                                                <div className="app-dropdown-item-content">
                                                    <span className="app-dropdown-item-label">{item.label}</span>
                                                    <span className="app-dropdown-item-desc">{item.desc}</span>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                                <div className="app-dropdown-banner">
                                    <Bug size={32} className="app-dropdown-banner-icon" />
                                    <h3>Comprehensive Security</h3>
                                    <p>Cover all OWASP vulnerabilities with our advanced scanning engine</p>
                                    <Link to="/scan" className="app-dropdown-banner-btn">
                                        Start Free Scan <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tools Dropdown */}
                    <div 
                        className="app-nav-dropdown"
                        onMouseEnter={() => setActiveDropdown('tools')}
                        onMouseLeave={() => setActiveDropdown(null)}
                    >
                        <button className={`app-nav-item app-nav-dropdown-trigger ${activeDropdown === 'tools' ? 'active' : ''}`}>
                            <Zap size={18} />
                            <span>Tools</span>
                            <ChevronDown size={14} className={`app-nav-chevron ${activeDropdown === 'tools' ? 'open' : ''}`} />
                        </button>
                        <div className={`app-nav-dropdown-menu app-dropdown-mega ${activeDropdown === 'tools' ? 'show' : ''}`}>
                            <div className="app-dropdown-mega-content">
                                <div className="app-dropdown-section">
                                    <h4 className="app-dropdown-section-title">Security Tools</h4>
                                    {toolsNav.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                className={`app-nav-dropdown-item ${isActive(item.path) ? 'active' : ''}`}
                                                onClick={() => setActiveDropdown(null)}
                                            >
                                                <Icon size={18} className="app-dropdown-item-icon" />
                                                <div className="app-dropdown-item-content">
                                                    <span className="app-dropdown-item-label">{item.label}</span>
                                                    <span className="app-dropdown-item-desc">{item.desc}</span>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                                <div className="app-dropdown-section">
                                    <h4 className="app-dropdown-section-title">Resources</h4>
                                    {resourceNav.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                className={`app-nav-dropdown-item ${isActive(item.path) ? 'active' : ''}`}
                                                onClick={() => setActiveDropdown(null)}
                                            >
                                                <Icon size={18} className="app-dropdown-item-icon" />
                                                <div className="app-dropdown-item-content">
                                                    <span className="app-dropdown-item-label">{item.label}</span>
                                                    <span className="app-dropdown-item-desc">{item.desc}</span>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="app-nav-right">
                    {/* Theme Toggle */}
                    <button 
                        className="app-nav-theme-toggle"
                        onClick={toggleTheme}
                        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {/* Pricing */}
                    <Link to="/pricing" className={`app-nav-pricing ${isActive('/pricing') ? 'active' : ''}`}>
                        <DollarSign size={16} />
                        <span>Pricing</span>
                    </Link>

                    {/* Subscription Badge */}
                    <SubscriptionBadge />

                    {/* Notifications Bell */}
                    <div className="app-nav-notifications">
                        <button 
                            className="app-nav-bell"
                            onClick={handleBellClick}
                            title="Notifications"
                        >
                            <Bell size={18} />
                            {unreadCount > 0 && (
                                <span className="app-nav-bell-badge">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </button>
                        {showNotifications && (
                            <div className="app-nav-notif-dropdown">
                                <div className="app-nav-notif-header">
                                    <h4>Notifications</h4>
                                    {unreadCount > 0 && (
                                        <button onClick={handleMarkAllRead}>Mark all read</button>
                                    )}
                                </div>
                                <div className="app-nav-notif-list">
                                    {recentNotifications.length === 0 ? (
                                        <div className="app-nav-notif-empty">No notifications</div>
                                    ) : (
                                        recentNotifications.map(notif => (
                                            <div 
                                                key={notif.id} 
                                                className={`app-nav-notif-item ${!notif.is_read ? 'unread' : ''}`}
                                                onClick={() => {
                                                    navigate('/notifications');
                                                    setShowNotifications(false);
                                                }}
                                            >
                                                {getNotificationIcon(notif.type)}
                                                <div className="app-nav-notif-content">
                                                    <span className="app-nav-notif-title">{notif.title}</span>
                                                    <span className="app-nav-notif-time">
                                                        {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="app-nav-notif-footer">
                                    <Link to="/notifications" onClick={() => setShowNotifications(false)}>
                                        View all notifications
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Admin/Enterprise Link */}
                    {(user?.role === 'admin' || user?.role === 'enterprise' || isSuperAdmin()) && (
                        <Link to={isSuperAdmin() ? '/super-admin/dashboard' : user?.role === 'admin' ? '/admin' : '/enterprise'} className="app-nav-admin" title={isSuperAdmin() ? 'Super Admin Portal' : 'Admin Portal'}>
                            {isSuperAdmin() ? <Crown size={16} /> : <Settings size={16} />}
                        </Link>
                    )}

                    {/* User Menu */}
                    <div className="app-nav-user-menu">
                        <button className="app-nav-user-btn">
                            <div className="app-nav-user-avatar">
                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <span className="app-nav-user-name">{user?.username}</span>
                            <ChevronDown size={14} />
                        </button>
                        <div className="app-nav-user-dropdown">
                            <Link to="/profile" className="app-nav-user-dropdown-item">
                                <User size={16} />
                                <span>Profile</span>
                            </Link>
                            <Link to="/mfa-setup" className="app-nav-user-dropdown-item">
                                <ShieldCheck size={16} />
                                <span>Security Settings</span>
                            </Link>
                            {isModuleAccessible('apiTokens') && (
                                <Link to="/api-keys" className="app-nav-user-dropdown-item">
                                    <Key size={16} />
                                    <span>API Keys</span>
                                </Link>
                            )}
                            {isModuleAccessible('integrations') && (
                                <Link to="/webhooks" className="app-nav-user-dropdown-item">
                                    <Webhook size={16} />
                                    <span>Webhooks</span>
                                </Link>
                            )}
                            {isModuleAccessible('notifications') && (
                                <Link to="/notifications" className="app-nav-user-dropdown-item">
                                    <Bell size={16} />
                                    <span>Notifications</span>
                                    {unreadCount > 0 && <span className="user-dropdown-badge">{unreadCount}</span>}
                                </Link>
                            )}
                            {isModuleAccessible('auditLogs') && (
                                <Link to="/audit-logs" className="app-nav-user-dropdown-item">
                                    <FileText size={16} />
                                    <span>Audit Logs</span>
                                </Link>
                            )}
                            {isModuleAccessible('scanEngine') && (
                                <Link to="/scheduled-scans" className="app-nav-user-dropdown-item">
                                    <Clock size={16} />
                                    <span>Scheduled Scans</span>
                                </Link>
                            )}
                            {isModuleAccessible('apiTokens') && (
                                <Link to="/api-docs" className="app-nav-user-dropdown-item">
                                    <Book size={16} />
                                    <span>API Documentation</span>
                                </Link>
                            )}
                            {isModuleAccessible('teamManagement') && (
                                <>
                                    <div className="app-nav-user-dropdown-divider" />
                                    <Link to="/user-management" className="app-nav-user-dropdown-item">
                                        <Users size={16} />
                                        <span>User Management</span>
                                    </Link>
                                </>
                            )}
                            {isSuperAdmin() && (
                                <>
                                    <div className="app-nav-user-dropdown-divider" />
                                    <Link to="/super-admin/dashboard" className="app-nav-user-dropdown-item super-admin-link">
                                        <Crown size={16} />
                                        <span>Super Admin Portal</span>
                                    </Link>
                                </>
                            )}
                            {isModuleAccessible('permissionManagement') && (
                                <Link to="/permission-management" className="app-nav-user-dropdown-item">
                                    <Shield size={16} />
                                    <span>Permissions</span>
                                </Link>
                            )}
                            <div className="app-nav-user-dropdown-divider" />
                            <Link to="/pricing" className="app-nav-user-dropdown-item">
                                <Crown size={16} />
                                <span>Upgrade Plan</span>
                            </Link>
                            <button onClick={handleLogout} className="app-nav-user-dropdown-item logout">
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button 
                        className="app-nav-mobile-toggle"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`app-nav-mobile ${mobileMenuOpen ? 'open' : ''}`}>
                <div className="app-nav-mobile-content">
                    {quickNavItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`app-nav-mobile-item ${isActive(item.path) ? 'active' : ''}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}

                    <div className="app-nav-mobile-divider" />

                    <div className="app-nav-mobile-group">
                        <span className="app-nav-mobile-group-title">Security Testing</span>
                        {securityTestingNav.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`app-nav-mobile-item ${isActive(item.path) ? 'active' : ''}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="app-nav-mobile-group">
                        <span className="app-nav-mobile-group-title">Tools</span>
                        {toolsNav.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`app-nav-mobile-item ${isActive(item.path) ? 'active' : ''}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="app-nav-mobile-group">
                        <span className="app-nav-mobile-group-title">Resources</span>
                        {resourceNav
                            .filter(item => !item.module || isModuleAccessible(item.module))
                            .map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`app-nav-mobile-item ${isActive(item.path) ? 'active' : ''}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {(isModuleAccessible('teamManagement') || isModuleAccessible('auditLogs')) && (
                        <div className="app-nav-mobile-group">
                            <span className="app-nav-mobile-group-title">Administration</span>
                            {adminNav
                                .filter(item => isModuleAccessible(item.module))
                                .map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`app-nav-mobile-item ${isActive(item.path) ? 'active' : ''}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Icon size={20} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {isModuleAccessible('settings') && (
                        <div className="app-nav-mobile-group">
                            <span className="app-nav-mobile-group-title">Settings</span>
                            {settingsNav
                                .filter(item => isModuleAccessible(item.module))
                                .map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`app-nav-mobile-item ${isActive(item.path) ? 'active' : ''}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Icon size={20} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    <div className="app-nav-mobile-divider" />

                    <Link 
                        to="/pricing" 
                        className={`app-nav-mobile-item ${isActive('/pricing') ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <DollarSign size={20} />
                        <span>Pricing</span>
                    </Link>

                    <Link 
                        to="/profile" 
                        className="app-nav-mobile-item"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <User size={20} />
                        <span>Profile</span>
                    </Link>
                    <button 
                        onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                        className="app-nav-mobile-item logout"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default AppNavbar;
