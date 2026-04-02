import React, { useEffect, useState } from 'react';
import { Database, Search, AlertCircle, FileText, Folder, Lock, Sun, Moon } from 'lucide-react';
import { dorkApi } from '../../services/api';
import SeverityBadge from '../../components/SeverityBadge';
import { useTheme } from '../../contexts/ThemeContext';

const DorkPatterns = () => {
    const { isDark, toggleTheme } = useTheme();
    const [patterns, setPatterns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const theme = isDark ? {
        bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        bgCard: 'rgba(255,255,255,0.05)',
        border: 'rgba(255,255,255,0.1)',
        text: '#f1f5f9',
        textSecondary: '#94a3b8',
        codeBg: 'rgba(0,0,0,0.4)',
    } : {
        bg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        bgCard: '#ffffff',
        border: 'rgba(0,0,0,0.08)',
        text: '#0f172a',
        textSecondary: '#475569',
        codeBg: 'rgba(15, 23, 42, 0.05)',
    };

    useEffect(() => {
        fetchPatterns();
    }, []);

    const fetchPatterns = async () => {
        try {
            const response = await dorkApi.getAllPatterns();
            setPatterns(response.data.patterns);
        } catch (err) {
            setError('Failed to load GHDB patterns');
            console.error('Error fetching patterns:', err);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryIcon = (category) => {
        switch (category?.toLowerCase()) {
            case 'files containing juicy info':
                return FileText;
            case 'sensitive directories':
                return Folder;
            case 'vulnerable files':
                return AlertCircle;
            case 'pages containing login portals':
                return Lock;
            default:
                return Database;
        }
    };

    const categories = ['all', ...new Set(patterns.map(p => p.category))];

    const filteredPatterns = selectedCategory === 'all'
        ? patterns
        : patterns.filter(p => p.category === selectedCategory);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="spinner" style={{ margin: '0 auto 24px' }}></div>
                    <p style={{ color: theme.textSecondary }}>Loading GHDB patterns...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ minHeight: '100vh', background: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#ef4444' }}>{error}</p>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: theme.bg }}>
            {/* Header */}
            <div style={{ 
                background: theme.bgCard, 
                borderBottom: `1px solid ${theme.border}`,
                padding: '24px 0'
            }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: '700', color: theme.text, marginBottom: '8px' }}>
                            Google Hacking Database (GHDB)
                        </h1>
                        <p style={{ color: theme.textSecondary }}>View all vulnerability detection patterns used by the scanner</p>
                    </div>
                    <button
                        onClick={toggleTheme}
                        style={{
                            background: theme.bgCard,
                            border: `1px solid ${theme.border}`,
                            borderRadius: '12px',
                            padding: '12px',
                            cursor: 'pointer',
                            display: 'flex'
                        }}
                    >
                        {isDark ? <Sun size={20} style={{ color: '#fbbf24' }} /> : <Moon size={20} style={{ color: '#6366f1' }} />}
                    </button>
                </div>
            </div>

            <div className="container" style={{ padding: '24px 0' }}>
                {/* Category Filter */}
                <div style={{ 
                    background: theme.bgCard, 
                    border: `1px solid ${theme.border}`,
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '32px'
                }}>
                    <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500', color: theme.text }}>
                        Filter by Category
                    </label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                style={{
                                    padding: '8px 16px',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    background: selectedCategory === category ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : theme.codeBg,
                                    color: selectedCategory === category ? 'white' : theme.textSecondary,
                                    transition: 'all 0.2s'
                                }}
                            >
                                {category === 'all' ? 'All Categories' : category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Patterns Grid */}
                <div className="grid grid-2">
                    {filteredPatterns.map((pattern) => {
                        const Icon = getCategoryIcon(pattern.category);

                        return (
                            <div key={pattern.id} style={{
                                background: theme.bgCard,
                                border: `1px solid ${theme.border}`,
                                borderRadius: '16px',
                                padding: '24px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <div style={{
                                        padding: '12px',
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        borderRadius: '12px',
                                        color: '#6366f1'
                                    }}>
                                        <Icon size={24} />
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                            <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.text }}>
                                                {pattern.title}
                                            </h3>
                                            <SeverityBadge severity={pattern.severity} />
                                        </div>

                                        <p style={{
                                            fontSize: '13px',
                                            color: theme.textSecondary,
                                            marginBottom: '12px',
                                            lineHeight: '1.5'
                                        }}>
                                            {pattern.description}
                                        </p>

                                        <div style={{
                                            padding: '12px',
                                            background: theme.codeBg,
                                            borderRadius: '8px',
                                            marginBottom: '12px'
                                        }}>
                                            <div style={{
                                                fontSize: '11px',
                                                textTransform: 'uppercase',
                                                color: theme.textSecondary,
                                                marginBottom: '4px'
                                            }}>
                                                Search Pattern
                                            </div>
                                            <code style={{
                                                fontSize: '13px',
                                                color: '#6366f1',
                                                wordBreak: 'break-all'
                                            }}>
                                                {pattern.search_pattern}
                                            </code>
                                        </div>

                                        <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: theme.textSecondary }}>
                                            <span>Category: {pattern.category}</span>
                                            <span>GHDB ID: {pattern.ghdb_id}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredPatterns.length === 0 && (
                    <div style={{
                        background: theme.bgCard,
                        border: `1px solid ${theme.border}`,
                        borderRadius: '16px',
                        padding: '60px 24px',
                        textAlign: 'center'
                    }}>
                        <Search size={48} style={{ color: theme.textSecondary, marginBottom: '16px' }} />
                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.text, marginBottom: '8px' }}>No Patterns Found</h3>
                        <p style={{ color: theme.textSecondary }}>
                            No GHDB patterns match the selected category.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DorkPatterns;