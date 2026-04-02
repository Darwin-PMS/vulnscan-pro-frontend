import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    Shield, LayoutDashboard, ScanLine, List, Database, Smartphone, 
    BookOpen, Terminal, LogOut, User, Bot, Crown, DollarSign, 
    Settings, ChevronDown, X, Menu, Zap, Activity, Target,
    Layers, Globe, Code, Cloud, GitBranch, Lock, Bug, FileSearch,
    ArrowRight, Sun, Moon, BarChart3
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { SubscriptionBadge } from './SubscriptionComponents';

const AppNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

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
        { path: '/scans', label: 'Scan History', icon: List, desc: 'View past scans' },
        { path: '/tools', label: 'All Tools', icon: Zap, desc: 'Complete tool listing' },
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

                    {/* Admin/Enterprise Link */}
                    {(user?.role === 'admin' || user?.role === 'enterprise') && (
                        <Link to={user?.role === 'admin' ? '/admin' : '/enterprise'} className="app-nav-admin">
                            <Settings size={16} />
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
                            <Link to="/pricing" className="app-nav-user-dropdown-item">
                                <Crown size={16} />
                                <span>Upgrade Plan</span>
                            </Link>
                            <div className="app-nav-user-dropdown-divider" />
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
                        {resourceNav.map((item) => {
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
