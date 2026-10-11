import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Shield,
    LayoutDashboard,
    ScanLine,
    List,
    Database,
    Smartphone,
    BookOpen,
    Terminal,
    LogOut,
    User,
    Bot,
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const workspaceItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/scan', label: 'New Scan', icon: ScanLine },
    { path: '/scans', label: 'All Scans', icon: List },
    { path: '/ai-assistant', label: 'AI Assistant', icon: Bot },
    { path: '/mobile', label: 'Mobile App', icon: Smartphone },
    { path: '/terminal', label: 'Terminal', icon: Terminal },
    { path: '/learning', label: 'Learning', icon: BookOpen },
    { path: '/dorks', label: 'GHDB Patterns', icon: Database }
];

const landingItems = [
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How it works' },
    { id: 'about', label: 'About' },
    { id: 'blog', label: 'Blog' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' }
];

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    useEffect(() => {
        setMobileNavOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (!mobileNavOpen) return undefined;

        const closeOnEscape = (event) => {
            if (event.key === 'Escape') setMobileNavOpen(false);
        };

        window.addEventListener('keydown', closeOnEscape);
        return () => window.removeEventListener('keydown', closeOnEscape);
    }, [mobileNavOpen]);

    const handleLogout = () => {
        setMobileNavOpen(false);
        logout();
        navigate('/');
    };

    return (
        <nav className={`navbar ${isAuthenticated ? 'navbar-workspace' : 'navbar-public'}`}>
            <div className="container navbar-content">
                <Link to="/" className="nav-brand">
                    <Shield size={28} />
                    <span>VulnScan Pro</span>
                </Link>

                {isAuthenticated ? (
                    <div className="navbar-actions">
                        <div
                            id="workspace-navigation"
                            className={`nav-links workspace-nav-links ${mobileNavOpen ? 'mobile-open' : ''}`}
                        >
                            {workspaceItems.map(({ path, label, icon: Icon }) => {
                                const isActive = path === '/'
                                    ? location.pathname === '/'
                                    : path === '/scan'
                                        ? location.pathname === '/scan'
                                        : path === '/scans'
                                            ? location.pathname === '/scans' || location.pathname.startsWith('/scan/')
                                            : location.pathname === path || location.pathname.startsWith(`${path}/`);

                                return (
                                    <Link
                                        key={path}
                                        to={path}
                                        className={`nav-link ${isActive ? 'active' : ''}`}
                                        aria-current={isActive ? 'page' : undefined}
                                        onClick={() => setMobileNavOpen(false)}
                                    >
                                        <Icon size={18} />
                                        <span>{label}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="navbar-account">
                            <div className="navbar-user">
                                <span className="navbar-user-avatar" aria-hidden="true">
                                    {user?.username?.charAt(0)?.toUpperCase() || <User size={15} />}
                                </span>
                                <span className="navbar-user-name">{user?.username}</span>
                            </div>
                            <button
                                className="navbar-logout"
                                onClick={handleLogout}
                                aria-label="Log out"
                                title="Log out"
                            >
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>

                        <button
                            type="button"
                            className="workspace-menu-toggle"
                            onClick={() => setMobileNavOpen((open) => !open)}
                            aria-label={mobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
                            aria-expanded={mobileNavOpen}
                            aria-controls="workspace-navigation"
                        >
                            {mobileNavOpen ? <X size={21} /> : <Menu size={21} />}
                        </button>
                    </div>
                ) : (
                    <div className="navbar-actions public-navbar-actions">
                        {location.pathname === '/' && (
                            <div className="nav-links public-nav-links">
                                {landingItems.map((item) => (
                                    <a key={item.id} href={`#${item.id}`} className="nav-link">
                                        {item.label}
                                    </a>
                                ))}
                            </div>
                        )}
                        <Link to="/login" className="navbar-sign-in">
                            <User size={15} />
                            <span>Sign in</span>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
