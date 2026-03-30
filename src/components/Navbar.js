import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, ScanLine, List, Database, Smartphone, BookOpen, Terminal, LogOut, User, Bot, Crown, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SubscriptionBadge } from './SubscriptionComponents';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/scan', label: 'New Scan', icon: ScanLine },
        { path: '/ai-assistant', label: 'AI Assistant', icon: Bot },
        { path: '/scans', label: 'All Scans', icon: List },
        { path: '/mobile', label: 'Mobile App', icon: Smartphone },
        { path: '/terminal', label: 'Terminal', icon: Terminal },
        { path: '/learning', label: 'Learning', icon: BookOpen },
        { path: '/dorks', label: 'GHDB Patterns', icon: Database }
    ];

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="nav-brand">
                    <Shield size={28} />
                    <span>VulnScan Pro</span>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="nav-links">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`nav-link ${isActive ? 'active' : ''}`}
                                >
                                    <Icon size={18} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* User Section */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        paddingLeft: '16px',
                        borderLeft: '1px solid var(--border-color)'
                    }}>
                        {/* Pricing Link */}
                        <Link
                            to="/pricing"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 10px',
                                background: 'transparent',
                                border: '1px solid var(--primary-color)',
                                borderRadius: '6px',
                                color: 'var(--primary-color)',
                                textDecoration: 'none',
                                fontSize: '12px',
                                fontWeight: 500,
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'var(--primary-color)';
                                e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.color = 'var(--primary-color)';
                            }}
                        >
                            <DollarSign size={14} />
                            Pricing
                        </Link>

                        {isAuthenticated && <SubscriptionBadge />}

                        {isAuthenticated ? (
                            <>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '14px',
                                    color: 'var(--text-secondary)'
                                }}>
                                    <User size={16} />
                                    <span>{user?.username}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '8px 12px',
                                        background: 'transparent',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '6px',
                                        color: 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'var(--danger-color)';
                                        e.target.style.color = 'white';
                                        e.target.style.borderColor = 'var(--danger-color)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'transparent';
                                        e.target.style.color = 'var(--text-secondary)';
                                        e.target.style.borderColor = 'var(--border-color)';
                                    }}
                                >
                                    <LogOut size={14} />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '8px 12px',
                                        background: 'transparent',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '6px',
                                        color: 'var(--text-secondary)',
                                        textDecoration: 'none',
                                        fontSize: '13px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '8px 16px',
                                        background: 'var(--primary-color)',
                                        border: 'none',
                                        borderRadius: '6px',
                                        color: 'white',
                                        textDecoration: 'none',
                                        fontSize: '13px',
                                        fontWeight: 500,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;