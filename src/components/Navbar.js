import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    Shield, LayoutDashboard, ScanLine, List, Database, Smartphone, 
    BookOpen, Terminal, LogOut, User, Bot, Crown, DollarSign, 
    Settings, ChevronDown, X, Menu, Zap, Activity, Target, Sun, Moon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { SubscriptionBadge } from './SubscriptionComponents';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const mainNavItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/scan', label: 'New Scan', icon: ScanLine, highlight: true },
    ];

    const scanNavItems = [
        { path: '/scans', label: 'All Scans', icon: List },
        { path: '/dorks', label: 'GHDB Patterns', icon: Database },
    ];

    const toolsNavItems = [
        { path: '/ai-assistant', label: 'AI Assistant', icon: Bot },
        { path: '/terminal', label: 'Terminal Lab', icon: Terminal },
        { path: '/mobile', label: 'Mobile Testing', icon: Smartphone },
        { path: '/learning', label: 'Learning Center', icon: BookOpen },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`navbar ${isDark ? 'navbar-dark' : 'navbar-light'}`}>
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="nav-brand">
                    <div className="nav-brand-icon">
                        <Shield size={20} />
                    </div>
                    <span className="nav-brand-text">VulnScan Pro</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="nav-main">
                    {/* Main Items */}
                    <div className="nav-section">
                        {mainNavItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`nav-item ${isActive(item.path) ? 'active' : ''} ${item.highlight ? 'highlight' : ''}`}
                                >
                                    <Icon size={18} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Scans Dropdown */}
                    <div 
                        className="nav-dropdown"
                        onMouseEnter={() => setActiveDropdown('scans')}
                        onMouseLeave={() => setActiveDropdown(null)}
                    >
                        <button className={`nav-item nav-dropdown-trigger ${activeDropdown === 'scans' ? 'active' : ''}`}>
                            <Target size={18} />
                            <span>Scans</span>
                            <ChevronDown size={14} className={`chevron ${activeDropdown === 'scans' ? 'open' : ''}`} />
                        </button>
                        <div className={`nav-dropdown-menu ${activeDropdown === 'scans' ? 'show' : ''}`}>
                            {scanNavItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`nav-dropdown-item ${isActive(item.path) ? 'active' : ''}`}
                                        onClick={() => setActiveDropdown(null)}
                                    >
                                        <Icon size={16} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tools Dropdown */}
                    <div 
                        className="nav-dropdown"
                        onMouseEnter={() => setActiveDropdown('tools')}
                        onMouseLeave={() => setActiveDropdown(null)}
                    >
                        <button className={`nav-item nav-dropdown-trigger ${activeDropdown === 'tools' ? 'active' : ''}`}>
                            <Zap size={18} />
                            <span>Tools</span>
                            <ChevronDown size={14} className={`chevron ${activeDropdown === 'tools' ? 'open' : ''}`} />
                        </button>
                        <div className={`nav-dropdown-menu ${activeDropdown === 'tools' ? 'show' : ''}`}>
                            {toolsNavItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`nav-dropdown-item ${isActive(item.path) ? 'active' : ''}`}
                                        onClick={() => setActiveDropdown(null)}
                                    >
                                        <Icon size={16} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="nav-right">
                    {/* Theme Toggle */}
                    <button 
                        className="nav-theme-toggle"
                        onClick={toggleTheme}
                        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {/* Pricing */}
                    <Link to="/pricing" className="nav-pricing">
                        <DollarSign size={16} />
                        <span>Pricing</span>
                    </Link>

                    {/* Subscription Badge */}
                    {isAuthenticated && <SubscriptionBadge />}

                    {/* Admin Link */}
                    {isAuthenticated && user?.role === 'admin' && (
                        <Link to="/admin" className="nav-admin">
                            <Settings size={16} />
                        </Link>
                    )}

                    {/* User Menu */}
                    {isAuthenticated ? (
                        <div className="nav-user-menu">
                            <Link to="/profile" className="nav-user-btn">
                                <div className="nav-user-avatar">
                                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <span className="nav-user-name">{user?.username}</span>
                                <ChevronDown size={14} />
                            </Link>
                            <div className="nav-user-dropdown">
                                <Link to="/profile" className="nav-user-dropdown-item">
                                    <User size={16} />
                                    <span>Profile</span>
                                </Link>
                                <Link to="/pricing" className="nav-user-dropdown-item">
                                    <Crown size={16} />
                                    <span>Upgrade Plan</span>
                                </Link>
                                <div className="nav-user-dropdown-divider" />
                                <button onClick={handleLogout} className="nav-user-dropdown-item logout">
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="nav-auth">
                            <Link to="/login" className="btn btn-ghost">
                                Sign In
                            </Link>
                            <Link to="/register" className="btn btn-primary btn-sm">
                                Sign Up
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button 
                        className="nav-mobile-toggle"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`nav-mobile ${mobileMenuOpen ? 'open' : ''}`}>
                <div className="nav-mobile-content">
                    {mainNavItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-mobile-item ${isActive(item.path) ? 'active' : ''}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}

                    <div className="nav-mobile-divider" />

                    <div className="nav-mobile-group">
                        <span className="nav-mobile-group-title">Scans</span>
                        {scanNavItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`nav-mobile-item ${isActive(item.path) ? 'active' : ''}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="nav-mobile-group">
                        <span className="nav-mobile-group-title">Tools</span>
                        {toolsNavItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`nav-mobile-item ${isActive(item.path) ? 'active' : ''}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="nav-mobile-divider" />

                    <Link 
                        to="/pricing" 
                        className="nav-mobile-item"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <DollarSign size={20} />
                        <span>Pricing</span>
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link 
                                to="/profile" 
                                className="nav-mobile-item"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <User size={20} />
                                <span>Profile</span>
                            </Link>
                            <button 
                                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                className="nav-mobile-item logout"
                            >
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <div className="nav-mobile-auth">
                            <Link to="/login" className="btn btn-secondary" onClick={() => setMobileMenuOpen(false)}>
                                Sign In
                            </Link>
                            <Link to="/register" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
