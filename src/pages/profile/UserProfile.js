import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Calendar, Shield, LogOut, Key, Bell, Activity, AlertTriangle, AlertOctagon, AlertCircle, Scan, Crown, Zap, Clock, ChevronRight, Edit, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api, { authApi, scanApi } from '../../services/api';
import { formatDistanceToNow, format } from 'date-fns';
import StatusBadge from '../../components/StatusBadge';

const UserProfile = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState({
        subscription: null,
        stats: { totalScans: 0, totalVulnerabilities: 0, criticalCount: 0, highCount: 0 },
        recentScans: [],
        tier: 'Free'
    });
    const [editingField, setEditingField] = useState(null);
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            fetchProfileData();
        } else {
            navigate('/login', { state: { from: '/profile' } });
        }
    }, [isAuthenticated]);

    // Refresh data when component comes into focus
    useEffect(() => {
        const handleFocus = () => {
            if (isAuthenticated) {
                fetchProfileData();
            }
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [isAuthenticated]);

    // Also refresh when navigating back from other pages
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && isAuthenticated) {
                fetchProfileData();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [isAuthenticated]);

    const handleRefresh = () => {
        fetchProfileData();
    };

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            
            // Get subscription info
            let subscription = null;
            let tierName = 'Free';
            let usageData = null;
            try {
                const subRes = await api.get('/subscriptions/current');
                subscription = subRes.data;
                tierName = subscription?.tier 
                    ? subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)
                    : 'Free';
            } catch (e) {
                console.log('No subscription data:', e.message);
            }

            // Get usage data for scan counts
            try {
                const usageRes = await api.get('/subscriptions/usage');
                usageData = usageRes.data;
            } catch (e) {
                console.log('No usage data:', e.message);
            }

            // Get user stats - using dashboard stats endpoint for consistency
            let stats = { totalScans: 0, totalVulnerabilities: 0, criticalCount: 0, highCount: 0, recentScans: [] };
            try {
                const statsRes = await scanApi.getDashboardStats();
                const data = statsRes.data;
                stats = {
                    totalScans: data?.totalScans || 0,
                    totalVulnerabilities: data?.totalVulnerabilities || 0,
                    criticalCount: data?.severityBreakdown?.find(s => s.severity === 'critical')?.count || 0,
                    highCount: data?.severityBreakdown?.find(s => s.severity === 'high')?.count || 0,
                    recentScans: data?.recentScans || []
                };
            } catch (e) {
                console.log('No stats data:', e.message);
            }

            setProfileData(prev => ({
                ...prev,
                subscription: subscription ? { ...usageData, ...subscription } : usageData,
                stats,
                recentScans: stats.recentScans.length > 0 ? stats.recentScans : prev.recentScans,
                tier: tierName
            }));
        } catch (error) {
            console.error('Error fetching profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const getInitials = (name) => {
        if (!name) return user?.username?.charAt(0).toUpperCase() || 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getTierColor = (tier) => {
        switch (tier.toLowerCase()) {
            case 'enterprise': return { bg: 'linear-gradient(135deg, #6366f1, #8b5cf6)', text: 'white' };
            case 'professional': return { bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', text: 'white' };
            case 'starter': return { bg: 'linear-gradient(135deg, #10b981, #059669)', text: 'white' };
            default: return { bg: 'rgba(99, 102, 241, 0.1)', text: 'var(--primary-color)' };
        }
    };

    const tierColors = getTierColor(profileData.tier);

    const handleEditClick = (field, currentValue) => {
        setEditingField(field);
        setEditValue(currentValue || '');
    };

    const handleSaveEdit = async () => {
        try {
            const result = await authApi.updateProfile({ [editingField]: editValue });
            // Update user context
            if (result.data?.user) {
                // Update local storage
                localStorage.setItem('user', JSON.stringify(result.data.user));
            }
            // Refresh profile data
            fetchProfileData();
            setEditingField(null);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    if (loading) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div className="spinner" style={{ width: 48, height: 48 }}></div>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '1000px', marginTop: '40px', paddingBottom: '60px' }}>
            {/* Profile Header */}
            <div className="card fade-in" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '36px',
                        fontWeight: '700',
                        color: 'white',
                        flexShrink: 0,
                        boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)'
                    }}>
                        {getInitials(user?.fullName || user?.username)}
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                            <h1 style={{ fontSize: '28px', margin: 0 }}>
                                {user?.fullName || user?.username}
                            </h1>
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 14px',
                                borderRadius: '100px',
                                fontSize: '13px',
                                fontWeight: '600',
                                background: tierColors.bg,
                                color: tierColors.text
                            }}>
                                {profileData.tier === 'Enterprise' || profileData.tier === 'Professional' ? (
                                    <Crown size={14} />
                                ) : (
                                    <Zap size={14} />
                                )}
                                {profileData.tier} Plan
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', color: 'var(--text-secondary)', fontSize: '14px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Mail size={16} /> {user?.email}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Calendar size={16} /> Joined {format(new Date(user?.createdAt || Date.now()), 'MMMM yyyy')}
                            </span>
                            {user?.lastLogin && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Clock size={16} /> Last login {formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true })}
                                </span>
                            )}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={handleRefresh}
                            className="btn btn-secondary"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '12px 16px'
                            }}
                            title="Refresh data"
                        >
                            <RefreshCw size={18} />
                        </button>
                        <button
                            onClick={handleLogout}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 20px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '8px',
                                color: '#ef4444',
                                cursor: 'pointer',
                                fontWeight: '500',
                                transition: 'all 0.2s'
                            }}
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div className="card fade-in" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '14px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary-color)'
                    }}>
                        <Shield size={28} />
                    </div>
                    <div>
                        <p style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>{profileData.tier}</p>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>Subscription Plan</p>
                        <button
                            onClick={() => navigate('/pricing')}
                            style={{
                                marginTop: '8px',
                                padding: '4px 12px',
                                background: 'var(--primary-color)',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}
                        >
                            {profileData.tier === 'Free' ? 'Upgrade' : 'Manage'}
                        </button>
                    </div>
                </div>

                <div className="card fade-in" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '14px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--secondary-color)'
                    }}>
                        <Scan size={28} />
                    </div>
                    <div>
                        <p style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>{profileData.stats.totalScans}</p>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>Total Scans</p>
                        <button
                            onClick={() => navigate('/scans')}
                            style={{
                                marginTop: '8px',
                                padding: '4px 12px',
                                background: 'var(--dark-bg)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '6px',
                                color: 'var(--text-primary)',
                                fontSize: '12px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}
                        >
                            View All
                        </button>
                    </div>
                </div>

                <div className="card fade-in" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '14px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ef4444'
                    }}>
                        <AlertOctagon size={28} />
                    </div>
                    <div>
                        <p style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>{profileData.stats.totalVulnerabilities}</p>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>Vulnerabilities Found</p>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px', fontSize: '11px' }}>
                            <span style={{ color: '#ef4444', fontWeight: '600' }}>{profileData.stats.criticalCount} Critical</span>
                            <span style={{ color: '#f97316', fontWeight: '600' }}>{profileData.stats.highCount} High</span>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: '24px' }}>
                {/* Recent Scans */}
                <div className="card fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '18px', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Activity size={20} style={{ color: 'var(--primary-color)' }} />
                            Recent Scans
                        </h2>
                        <button
                            onClick={() => navigate('/scans')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '6px 12px',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--primary-color)',
                                fontSize: '13px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}
                        >
                            View All <ChevronRight size={16} />
                        </button>
                    </div>

                    {profileData.recentScans.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {profileData.recentScans.map((scan) => (
                                <div
                                    key={scan.scan_id}
                                    onClick={() => navigate(`/scan/${scan.scan_id}`)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '14px',
                                        background: 'var(--dark-bg)',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        border: '1px solid transparent'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--primary-color)';
                                        e.currentTarget.style.transform = 'translateX(4px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'transparent';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }}
                                >
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: scan.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' :
                                                    scan.status === 'running' ? 'rgba(59, 130, 246, 0.1)' :
                                                    'rgba(245, 158, 11, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: scan.status === 'completed' ? 'var(--secondary-color)' :
                                               scan.status === 'running' ? '#3b82f6' : '#f59e0b'
                                    }}>
                                        <Scan size={20} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{
                                            margin: 0,
                                            fontWeight: '500',
                                            fontSize: '14px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {scan.target_url}
                                        </p>
                                        <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                            {formatDistanceToNow(new Date(scan.created_at), { addSuffix: true })}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        {scan.total_vulnerabilities > 0 && (
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                background: 'rgba(239, 68, 68, 0.1)',
                                                color: '#ef4444'
                                            }}>
                                                {scan.total_vulnerabilities} vulns
                                            </span>
                                        )}
                                        <StatusBadge status={scan.status} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
                            <Scan size={48} style={{ marginBottom: '12px', opacity: 0.5 }} />
                            <p style={{ margin: 0, fontSize: '14px' }}>No scans yet</p>
                            <button
                                onClick={() => navigate('/scan')}
                                className="btn btn-primary"
                                style={{ marginTop: '16px' }}
                            >
                                Start Your First Scan
                            </button>
                        </div>
                    )}
                </div>

                {/* Account Settings */}
                <div className="card fade-in">
                    <h2 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <User size={20} style={{ color: 'var(--primary-color)' }} />
                        Account Settings
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '16px',
                            background: 'var(--dark-bg)',
                            borderRadius: '10px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <User size={20} style={{ color: 'var(--text-secondary)' }} />
                                <div>
                                    <p style={{ fontWeight: '500', fontSize: '14px', margin: 0 }}>Username</p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>{user?.username}</p>
                                </div>
                            </div>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Cannot change</span>
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '16px',
                            background: 'var(--dark-bg)',
                            borderRadius: '10px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Mail size={20} style={{ color: 'var(--text-secondary)' }} />
                                <div>
                                    <p style={{ fontWeight: '500', fontSize: '14px', margin: 0 }}>Email Address</p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>{user?.email}</p>
                                </div>
                            </div>
                            <button style={{
                                padding: '6px 12px',
                                background: 'var(--primary-color)',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <Edit size={12} /> Change
                            </button>
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '16px',
                            background: 'var(--dark-bg)',
                            borderRadius: '10px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Key size={20} style={{ color: 'var(--text-secondary)' }} />
                                <div>
                                    <p style={{ fontWeight: '500', fontSize: '14px', margin: 0 }}>Password</p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>Last changed: Never</p>
                                </div>
                            </div>
                            <button style={{
                                padding: '6px 12px',
                                background: 'transparent',
                                border: '1px solid var(--border-color)',
                                borderRadius: '6px',
                                color: 'var(--text-primary)',
                                fontSize: '12px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}>
                                Change
                            </button>
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '16px',
                            background: 'var(--dark-bg)',
                            borderRadius: '10px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Bell size={20} style={{ color: 'var(--text-secondary)' }} />
                                <div>
                                    <p style={{ fontWeight: '500', fontSize: '14px', margin: 0 }}>Notifications</p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>Email & push notifications</p>
                                </div>
                            </div>
                            <button style={{
                                padding: '6px 12px',
                                background: 'transparent',
                                border: '1px solid var(--border-color)',
                                borderRadius: '6px',
                                color: 'var(--text-primary)',
                                fontSize: '12px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}>
                                Configure
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subscription Details */}
            {profileData.subscription && (
                <div className="card fade-in" style={{ marginTop: '24px' }}>
                    <h2 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Zap size={20} style={{ color: 'var(--primary-color)' }} />
                        Usage Summary
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 4px' }}>Billing Cycle</p>
                            <p style={{ fontWeight: '600', margin: 0, textTransform: 'capitalize' }}>
                                {profileData.subscription.billing_cycle || 'Monthly'}
                            </p>
                        </div>
                        <div>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 4px' }}>Status</p>
                            <p style={{ fontWeight: '600', margin: 0, color: 'var(--secondary-color)' }}>
                                {profileData.subscription.status || 'Active'}
                            </p>
                        </div>
                        <div>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 4px' }}>Next Billing Date</p>
                            <p style={{ fontWeight: '600', margin: 0 }}>
                                {profileData.subscription.end_date ? format(new Date(profileData.subscription.end_date), 'MMM dd, yyyy') : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 4px' }}>Scans This Month</p>
                            <p style={{ fontWeight: '600', margin: 0 }}>
                                {profileData.subscription.isUnlimited 
                                    ? 'Unlimited' 
                                    : `${profileData.subscription.scansUsed || 0} / ${profileData.subscription.scanLimit || 0}`
                                }
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
