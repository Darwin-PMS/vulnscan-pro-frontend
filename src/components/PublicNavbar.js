import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    Shield, Sun, Moon, ChevronDown, X, Menu, 
    CheckCircle, ArrowRight, Zap, Lock, Globe, ScanLine, Smartphone, Code
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const PublicNavbar = () => {
    const location = useLocation();
    const { isDark, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: '/#features', label: 'Features' },
        { path: '/#how-it-works', label: 'How It Works' },
        { path: '/pricing', label: 'Pricing' },
    ];

    const securityNav = [
        { path: '/web-security', label: 'Web Security', icon: Globe, desc: 'OWASP Top 10 coverage' },
        { path: '/mobile-security', label: 'Mobile Security', icon: Smartphone, desc: 'Android & iOS testing' },
        { path: '/api-security', label: 'API Security', icon: Code, desc: 'REST & GraphQL testing' },
    ];

    return (
        <nav className={`public-navbar ${isDark ? 'public-navbar-dark' : 'public-navbar-light'}`}>
            <div className="public-navbar-container">
                {/* Logo */}
                <Link to="/" className="public-nav-brand">
                    <div className="public-nav-brand-icon">
                        <Shield size={20} />
                    </div>
                    <span className="public-nav-brand-text">VulnScan Pro</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="public-nav-links">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`public-nav-link ${isActive(link.path) ? 'active' : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div 
                        className="public-nav-dropdown"
                        onMouseEnter={() => setActiveDropdown('security')}
                        onMouseLeave={() => setActiveDropdown(null)}
                    >
                        <button className={`public-nav-link public-nav-dropdown-trigger ${activeDropdown === 'security' ? 'active' : ''}`}>
                            Security <ChevronDown size={14} />
                        </button>
                        {activeDropdown === 'security' && (
                            <div className="public-nav-dropdown-menu">
                                {securityNav.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className="public-nav-dropdown-item"
                                            onClick={() => setActiveDropdown(null)}
                                        >
                                            <Icon size={16} />
                                            <div>
                                                <span className="dropdown-item-label">{item.label}</span>
                                                <span className="dropdown-item-desc">{item.desc}</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Section */}
                <div className="public-nav-right">
                    {/* Theme Toggle */}
                    <button 
                        className="public-nav-theme-toggle"
                        onClick={toggleTheme}
                        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {/* Auth Buttons */}
                    <div className="public-nav-auth">
                        <Link to="/login" className="public-nav-signin">
                            Sign In
                        </Link>
                        <Link to="/register" className="public-nav-signup">
                            <ScanLine size={16} />
                            Start Free Scan
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button 
                        className="public-nav-mobile-toggle"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`public-nav-mobile ${mobileMenuOpen ? 'open' : ''}`}>
                <div className="public-nav-mobile-content">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`public-nav-mobile-link ${isActive(link.path) ? 'active' : ''}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    
                    <div className="public-nav-mobile-divider" />
                    
                    <span className="public-nav-mobile-link">Security</span>
                    {securityNav.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="public-nav-mobile-link"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Icon size={16} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                    
                    <div className="public-nav-mobile-divider" />
                    
                    <Link 
                        to="/login" 
                        className="public-nav-mobile-link"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Sign In
                    </Link>
                    <Link 
                        to="/register" 
                        className="public-nav-mobile-cta"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <ScanLine size={18} />
                        Start Free Scan
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default PublicNavbar;
