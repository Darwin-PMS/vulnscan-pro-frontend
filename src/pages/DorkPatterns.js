import React, { useEffect, useState } from 'react';
import { Database, Search, AlertCircle, FileText, Folder, Lock } from 'lucide-react';
import { dorkApi } from '../services/api';
import SeverityBadge from '../components/SeverityBadge';

const DorkPatterns = () => {
    const [patterns, setPatterns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');

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
            <div className="container page-header">
                <div className="empty-state">
                    <div className="spinner" style={{ margin: '0 auto 24px' }}></div>
                    <p>Loading GHDB patterns...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container page-header">
                <div className="empty-state">
                    <p style={{ color: 'var(--danger-color)' }}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="container page-header">
                <h1>Google Hacking Database (GHDB)</h1>
                <p>View all vulnerability detection patterns used by the scanner</p>
            </div>

            <div className="container">
                {/* Category Filter */}
                <div className="card" style={{ marginBottom: '32px' }}>
                    <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500' }}>
                        Filter by Category
                    </label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {categories.map((category) => (
                            <button
                                key={category}
                                className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-secondary'}`}
                                style={{ padding: '8px 16px', fontSize: '13px' }}
                                onClick={() => setSelectedCategory(category)}
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
                            <div key={pattern.id} className="card fade-in">
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <div style={{
                                        padding: '12px',
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        borderRadius: '12px',
                                        color: 'var(--primary-color)'
                                    }}>
                                        <Icon size={24} />
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                            <h3 style={{ fontSize: '16px', fontWeight: '600' }}>
                                                {pattern.title}
                                            </h3>
                                            <SeverityBadge severity={pattern.severity} />
                                        </div>

                                        <p style={{
                                            fontSize: '13px',
                                            color: 'var(--text-secondary)',
                                            marginBottom: '12px',
                                            lineHeight: '1.5'
                                        }}>
                                            {pattern.description}
                                        </p>

                                        <div style={{
                                            padding: '12px',
                                            background: 'rgba(15, 23, 42, 0.5)',
                                            borderRadius: '8px',
                                            marginBottom: '12px'
                                        }}>
                                            <div style={{
                                                fontSize: '11px',
                                                textTransform: 'uppercase',
                                                color: 'var(--text-secondary)',
                                                marginBottom: '4px'
                                            }}>
                                                Search Pattern
                                            </div>
                                            <code style={{
                                                fontSize: '13px',
                                                color: 'var(--primary-color)',
                                                wordBreak: 'break-all'
                                            }}>
                                                {pattern.search_pattern}
                                            </code>
                                        </div>

                                        <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
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
                    <div className="card empty-state">
                        <Search size={48} style={{ color: 'var(--text-secondary)', marginBottom: '16px' }} />
                        <h3 className="empty-state-title">No Patterns Found</h3>
                        <p className="empty-state-description">
                            No GHDB patterns match the selected category.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DorkPatterns;