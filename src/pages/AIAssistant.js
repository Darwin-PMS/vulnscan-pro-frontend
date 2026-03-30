import React, { useState, useRef, useEffect } from 'react';
import {
    Bot, Send, User, Sparkles, Shield, AlertTriangle,
    BookOpen, Lightbulb, Code, Search, ChevronRight,
    RefreshCw, Copy, CheckCircle
} from 'lucide-react';
import { aiApi } from '../services/api';
import ReactMarkdown from 'react-markdown';

const AIAssistant = () => {
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            role: 'assistant',
            content: `👋 Hello! I'm your **AI Security Assistant** powered by Groq's ultra-fast LLM inference.

I can help you with:
• 🛡️ Explaining vulnerabilities (OWASP Top 10)
• 🔧 Security tools and commands (Nmap, Burp Suite, etc.)
• 📋 Penetration testing methodologies
• 🛠️ Remediation strategies
• 📚 CVE analysis
• 🔐 Security best practices

**Try asking:**
- "What is SQL Injection?"
- "How do I use Nmap?"
- "Explain XSS vulnerabilities"
- "OWASP Top 10 overview"

What would you like to learn about?`,
            timestamp: new Date().toISOString()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [dailyTip, setDailyTip] = useState(null);
    const [copiedId, setCopiedId] = useState(null);
    const messagesEndRef = useRef(null);

    // Quick action suggestions
    const quickActions = [
        { label: 'SQL Injection', icon: Code, prompt: 'What is SQL Injection and how to prevent it?' },
        { label: 'Nmap Basics', icon: Search, prompt: 'How do I use Nmap for network scanning?' },
        { label: 'XSS Attacks', icon: AlertTriangle, prompt: 'Explain Cross-Site Scripting (XSS) vulnerabilities' },
        { label: 'OWASP Top 10', icon: Shield, prompt: 'What are the OWASP Top 10 vulnerabilities?' }
    ];

    useEffect(() => {
        fetchDailyTip();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchDailyTip = async () => {
        try {
            const response = await aiApi.getSecurityTips();
            if (response.data.success) {
                setDailyTip(response.data.tip);
            }
        } catch (error) {
            console.error('Failed to fetch tip:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async (customInput = null) => {
        const messageText = customInput || input;
        if (!messageText.trim() || isLoading) return;

        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await aiApi.chat(messageText);

            const assistantMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.data.response || response.data.fallback?.response || 'I apologize, but I encountered an error processing your request.',
                timestamp: new Date().toISOString(),
                isMock: response.data.mock || response.data.fallback?.mock
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);

            const errorMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'I apologize, but I encountered an error. Please try again.',
                timestamp: new Date().toISOString(),
                isError: true
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickAction = (prompt) => {
        handleSend(prompt);
    };

    const handleCopy = (content, id) => {
        navigator.clipboard.writeText(content);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 70px)' }}>
            {/* Sidebar */}
            <div style={{
                width: '280px',
                background: 'var(--card-bg)',
                borderRight: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #F55036, #ff7a66)',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Bot size={24} color="white" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '16px', fontWeight: 600 }}>AI Assistant</h2>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Powered by Groq</p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div style={{ padding: '16px', flex: 1, overflow: 'auto' }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', fontWeight: 600 }}>
                        Quick Actions
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {quickActions.map((action, index) => {
                            const Icon = action.icon;
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleQuickAction(action.prompt)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '12px',
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        border: '1px solid transparent',
                                        borderRadius: '8px',
                                        color: 'var(--text-primary)',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        textAlign: 'left',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--primary-color)';
                                        e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'transparent';
                                        e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                                    }}
                                >
                                    <Icon size={16} style={{ color: 'var(--primary-color)' }} />
                                    {action.label}
                                    <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                                </button>
                            );
                        })}
                    </div>

                    {/* Daily Tip */}
                    {dailyTip && (
                        <div style={{
                            marginTop: '24px',
                            padding: '16px',
                            background: 'rgba(245, 158, 11, 0.1)',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            borderRadius: '8px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <Lightbulb size={16} style={{ color: 'var(--warning-color)' }} />
                                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--warning-color)' }}>
                                    Daily Security Tip
                                </span>
                            </div>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                                {dailyTip.tip}
                            </p>
                            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px', opacity: 0.7 }}>
                                Category: {dailyTip.category}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)' }}>
                    <button
                        onClick={() => setMessages([messages[0]])}
                        className="btn btn-secondary"
                        style={{ width: '100%', fontSize: '13px' }}
                    >
                        <RefreshCw size={14} />
                        New Conversation
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--dark-bg)' }}>
                {/* Messages */}
                <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            style={{
                                display: 'flex',
                                gap: '12px',
                                marginBottom: '20px',
                                alignItems: 'flex-start'
                            }}
                        >
                            {/* Avatar */}
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                background: message.role === 'assistant'
                                    ? 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))'
                                    : 'var(--card-bg)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                {message.role === 'assistant' ? (
                                    <Bot size={18} color="white" />
                                ) : (
                                    <User size={18} style={{ color: 'var(--text-secondary)' }} />
                                )}
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1, maxWidth: 'calc(100% - 60px)' }}>
                                <div style={{
                                    background: message.role === 'assistant' ? 'var(--card-bg)' : 'rgba(99, 102, 241, 0.1)',
                                    border: `1px solid ${message.role === 'assistant' ? 'var(--border-color)' : 'rgba(99, 102, 241, 0.3)'}`,
                                    borderRadius: '12px',
                                    padding: '16px',
                                    position: 'relative'
                                }}>
                                    {/* Copy button */}
                                    <button
                                        onClick={() => handleCopy(message.content, message.id)}
                                        style={{
                                            position: 'absolute',
                                            top: '8px',
                                            right: '8px',
                                            background: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            borderRadius: '4px',
                                            opacity: 0.6
                                        }}
                                    >
                                        {copiedId === message.id ? (
                                            <CheckCircle size={14} style={{ color: 'var(--secondary-color)' }} />
                                        ) : (
                                            <Copy size={14} style={{ color: 'var(--text-secondary)' }} />
                                        )}
                                    </button>

                                    {/* Message content */}
                                    <div style={{
                                        fontSize: '14px',
                                        lineHeight: '1.6',
                                        color: 'var(--text-primary)'
                                    }}>
                                        <ReactMarkdown>{message.content}</ReactMarkdown>
                                    </div>

                                    {/* Mock mode indicator */}
                                    {message.isMock && (
                                        <div style={{
                                            marginTop: '12px',
                                            padding: '8px 12px',
                                            background: 'rgba(245, 158, 11, 0.1)',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            color: 'var(--warning-color)'
                                        }}>
                                            <Sparkles size={12} style={{ display: 'inline', marginRight: '6px' }} />
                                            Running in demo mode (Groq API key not configured)
                                        </div>
                                    )}
                                </div>
                                <p style={{
                                    fontSize: '11px',
                                    color: 'var(--text-secondary)',
                                    marginTop: '4px',
                                    marginLeft: '4px'
                                }}>
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '16px' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Bot size={18} color="white" />
                            </div>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <span style={{ width: '8px', height: '8px', background: 'var(--primary-color)', borderRadius: '50%', animation: 'bounce 1s infinite' }}></span>
                                <span style={{ width: '8px', height: '8px', background: 'var(--primary-color)', borderRadius: '50%', animation: 'bounce 1s infinite 0.1s' }}></span>
                                <span style={{ width: '8px', height: '8px', background: 'var(--primary-color)', borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }}></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div style={{
                    padding: '20px',
                    borderTop: '1px solid var(--border-color)',
                    background: 'var(--card-bg)'
                }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask about security vulnerabilities, tools, or best practices..."
                            style={{
                                flex: 1,
                                padding: '12px 16px',
                                background: 'var(--dark-bg)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                color: 'var(--text-primary)',
                                fontSize: '14px',
                                resize: 'none',
                                minHeight: '50px',
                                maxHeight: '150px'
                            }}
                            rows={1}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={isLoading || !input.trim()}
                            style={{
                                padding: '12px 20px',
                                background: !input.trim() ? 'var(--border-color)' : 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                cursor: !input.trim() ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '14px',
                                fontWeight: 500
                            }}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <p style={{
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        marginTop: '8px',
                        textAlign: 'center'
                    }}>
                        AI Assistant can make mistakes. Always verify critical security information.
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes bounce {
                    0%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-8px); }
                }
            `}</style>
        </div>
    );
};

export default AIAssistant;
