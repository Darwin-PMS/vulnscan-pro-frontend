import React, { useState } from 'react';
import { Terminal as TerminalIcon, PlayCircle, CheckCircle, BookOpen, ChevronRight, Lock, Shield, Eye, Globe, AlertTriangle } from 'lucide-react';
import Terminal from '../components/Terminal';

const LinuxCommandLab = () => {
    const [activeSection, setActiveSection] = useState('basic');
    const [completedExercises, setCompletedExercises] = useState([]);
    const [currentExercise, setCurrentExercise] = useState(null);

    const sections = {
        basic: {
            title: 'Basic Linux Commands',
            description: 'Learn essential Linux commands for navigation and file management',
            icon: TerminalIcon,
            exercises: [
                {
                    id: 'basic-1',
                    title: 'Who Am I?',
                    description: 'Check your current user identity',
                    command: 'whoami',
                    expectedOutput: 'kali',
                    explanation: 'The whoami command displays the current username. In penetration testing, knowing your privilege level is crucial.',
                    hints: ['Simply type: whoami', 'Press Enter to execute'],
                    difficulty: 'beginner'
                },
                {
                    id: 'basic-2',
                    title: 'Current Directory',
                    description: 'Display your current working directory',
                    command: 'pwd',
                    expectedOutput: '/home/kali/lab',
                    explanation: 'pwd (Print Working Directory) shows your current location in the filesystem.',
                    hints: ['Type: pwd'],
                    difficulty: 'beginner'
                },
                {
                    id: 'basic-3',
                    title: 'List Files',
                    description: 'List all files in the current directory',
                    command: 'ls',
                    expectedOutput: 'Shows directory listing',
                    explanation: 'ls lists directory contents. Try ls -la for detailed view including hidden files.',
                    hints: ['Type: ls', 'For more details try: ls -la'],
                    difficulty: 'beginner'
                },
                {
                    id: 'basic-4',
                    title: 'View File Contents',
                    description: 'Display the contents of notes.txt',
                    command: 'cat notes.txt',
                    expectedOutput: 'File contents displayed',
                    explanation: 'cat concatenates and displays file contents. Essential for reading configuration files and logs.',
                    hints: ['Type: cat notes.txt'],
                    difficulty: 'beginner'
                }
            ]
        },
        recon: {
            title: 'Reconnaissance Tools',
            description: 'Network scanning and information gathering commands',
            icon: Eye,
            exercises: [
                {
                    id: 'recon-1',
                    title: 'Network Scan with Nmap',
                    description: 'Scan target for open ports',
                    command: 'nmap 192.168.1.100',
                    expectedOutput: 'Port scan results',
                    explanation: 'Nmap is the most popular network scanner. It discovers hosts and services on a network.',
                    hints: ['Type: nmap 192.168.1.100', 'Wait for scan to complete'],
                    difficulty: 'intermediate'
                },
                {
                    id: 'recon-2',
                    title: 'Service Version Detection',
                    description: 'Scan with service version detection',
                    command: 'nmap -sV 192.168.1.100',
                    expectedOutput: 'Detailed service info',
                    explanation: 'The -sV flag enables version detection, crucial for finding vulnerable software versions.',
                    hints: ['Type: nmap -sV 192.168.1.100'],
                    difficulty: 'intermediate'
                },
                {
                    id: 'recon-3',
                    title: 'Directory Brute Force',
                    description: 'Find hidden directories with Gobuster',
                    command: 'gobuster dir -u http://192.168.1.100 -w /usr/share/wordlists/dirb/common.txt',
                    expectedOutput: 'Directory listing',
                    explanation: 'Gobuster brute-forces URLs to find hidden directories and files on web servers.',
                    hints: ['Type the full gobuster command', 'Wait for enumeration to complete'],
                    difficulty: 'advanced'
                }
            ]
        },
        web: {
            title: 'Web Application Testing',
            description: 'Commands for testing web applications',
            icon: Globe,
            exercises: [
                {
                    id: 'web-1',
                    title: 'Check HTTP Response',
                    description: 'Fetch web page using curl',
                    command: 'curl http://192.168.1.100',
                    expectedOutput: 'HTML content',
                    explanation: 'curl transfers data from/to servers. Useful for testing APIs and web pages.',
                    hints: ['Type: curl http://192.168.1.100'],
                    difficulty: 'intermediate'
                },
                {
                    id: 'web-2',
                    title: 'Web Vulnerability Scan',
                    description: 'Scan with Nikto',
                    command: 'nikto -h http://192.168.1.100',
                    expectedOutput: 'Vulnerability findings',
                    explanation: 'Nikto scans web servers for dangerous files, outdated software, and misconfigurations.',
                    hints: ['Type: nikto -h http://192.168.1.100'],
                    difficulty: 'advanced'
                },
                {
                    id: 'web-3',
                    title: 'Directory Enumeration',
                    description: 'Enumerate with Dirb',
                    command: 'dirb http://192.168.1.100',
                    expectedOutput: 'Found directories',
                    explanation: 'Dirb is a web content scanner that looks for existing (hidden) web objects.',
                    hints: ['Type: dirb http://192.168.1.100'],
                    difficulty: 'intermediate'
                }
            ]
        },
        network: {
            title: 'Network Commands',
            description: 'Network configuration and testing',
            icon: Shield,
            exercises: [
                {
                    id: 'net-1',
                    title: 'Network Configuration',
                    description: 'Display network interface information',
                    command: 'ifconfig',
                    expectedOutput: 'Interface details',
                    explanation: 'ifconfig shows network interface configuration including IP addresses.',
                    hints: ['Type: ifconfig', 'Alternative: ip addr'],
                    difficulty: 'beginner'
                },
                {
                    id: 'net-2',
                    title: 'Ping Test',
                    description: 'Test connectivity to target',
                    command: 'ping -c 4 192.168.1.100',
                    expectedOutput: 'Ping responses',
                    explanation: 'Ping tests network connectivity by sending ICMP echo requests.',
                    hints: ['Type: ping -c 4 192.168.1.100'],
                    difficulty: 'beginner'
                }
            ]
        },
        files: {
            title: 'File Operations',
            description: 'Advanced file and text processing',
            icon: Lock,
            exercises: [
                {
                    id: 'file-1',
                    title: 'Search in Files',
                    description: 'Search for patterns using grep',
                    command: 'grep -i apache notes.txt',
                    expectedOutput: 'Matching lines',
                    explanation: 'grep searches for patterns in files. The -i flag makes it case-insensitive.',
                    hints: ['Type: grep -i apache notes.txt'],
                    difficulty: 'intermediate'
                },
                {
                    id: 'file-2',
                    title: 'System Information',
                    description: 'Display system information',
                    command: 'uname -a',
                    expectedOutput: 'Kernel info',
                    explanation: 'uname -a shows kernel version and system architecture.',
                    hints: ['Type: uname -a'],
                    difficulty: 'beginner'
                }
            ]
        }
    };

    const markComplete = (exerciseId) => {
        if (!completedExercises.includes(exerciseId)) {
            setCompletedExercises([...completedExercises, exerciseId]);
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'beginner': return '#0dbc79';
            case 'intermediate': return '#e5e510';
            case 'advanced': return '#cd3131';
            default: return '#0dbc79';
        }
    };

    const runExercise = (exercise) => {
        setCurrentExercise(exercise);
    };

    return (
        <div>
            <div className="container page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                    <TerminalIcon size={32} style={{ color: 'var(--primary-color)' }} />
                    <h1>Linux Command Lab</h1>
                </div>
                <p>Interactive terminal for learning penetration testing commands</p>
            </div>

            <div className="container">
                {/* Progress Stats */}
                <div className="grid grid-4" style={{ marginBottom: '32px' }}>
                    <div className="card stat-card">
                        <div className="stat-card-icon info">
                            <BookOpen size={24} />
                        </div>
                        <div className="stat-card-value">
                            {Object.values(sections).reduce((acc, s) => acc + s.exercises.length, 0)}
                        </div>
                        <div className="stat-card-label">Total Exercises</div>
                    </div>
                    <div className="card stat-card">
                        <div className="stat-card-icon low">
                            <CheckCircle size={24} />
                        </div>
                        <div className="stat-card-value">{completedExercises.length}</div>
                        <div className="stat-card-label">Completed</div>
                    </div>
                    <div className="card stat-card">
                        <div className="stat-card-icon medium">
                            <PlayCircle size={24} />
                        </div>
                        <div className="stat-card-value">
                            {Math.round((completedExercises.length /
                                Object.values(sections).reduce((acc, s) => acc + s.exercises.length, 0)) * 100) || 0}%
                        </div>
                        <div className="stat-card-label">Progress</div>
                    </div>
                    <div className="card stat-card">
                        <div className="stat-card-icon high">
                            <TerminalIcon size={24} />
                        </div>
                        <div className="stat-card-value">{Object.keys(sections).length}</div>
                        <div className="stat-card-label">Sections</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '24px' }}>
                    {/* Sidebar */}
                    <div style={{ width: '300px', flexShrink: 0 }}>
                        <div className="card" style={{ padding: '16px' }}>
                            <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Learning Modules</h3>
                            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {Object.entries(sections).map(([key, section]) => {
                                    const Icon = section.icon;
                                    const isActive = activeSection === key;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => setActiveSection(key)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                padding: '12px',
                                                borderRadius: '8px',
                                                border: 'none',
                                                background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                                color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                fontSize: '14px',
                                                fontWeight: isActive ? 600 : 400,
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <Icon size={18} />
                                            <div style={{ flex: 1 }}>
                                                <div>{section.title}</div>
                                                <div style={{ fontSize: '12px', opacity: 0.7 }}>
                                                    {section.exercises.length} exercises
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div style={{ flex: 1 }}>
                        {/* Section Header */}
                        <div className="card" style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                                {React.createElement(sections[activeSection].icon, {
                                    size: 28,
                                    style: { color: 'var(--primary-color)' }
                                })}
                                <h2>{sections[activeSection].title}</h2>
                            </div>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                {sections[activeSection].description}
                            </p>
                        </div>

                        {/* Terminal */}
                        <div className="card" style={{ marginBottom: '24px', padding: '0', overflow: 'hidden' }}>
                            <Terminal height="350px" />
                        </div>

                        {/* Exercises */}
                        <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Exercises</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {sections[activeSection].exercises.map((exercise) => (
                                <div
                                    key={exercise.id}
                                    className="card"
                                    style={{
                                        borderLeft: `4px solid ${getDifficultyColor(exercise.difficulty)}`,
                                        opacity: currentExercise?.id === exercise.id ? 1 : 0.9
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                                <h4 style={{ fontSize: '16px', fontWeight: 600 }}>
                                                    {exercise.title}
                                                </h4>
                                                <span style={{
                                                    fontSize: '11px',
                                                    textTransform: 'uppercase',
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    background: getDifficultyColor(exercise.difficulty),
                                                    color: 'white',
                                                    fontWeight: 600
                                                }}>
                                                    {exercise.difficulty}
                                                </span>
                                                {completedExercises.includes(exercise.id) && (
                                                    <CheckCircle size={16} style={{ color: 'var(--secondary-color)' }} />
                                                )}
                                            </div>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px' }}>
                                                {exercise.description}
                                            </p>

                                            {/* Command Preview */}
                                            <div style={{
                                                background: 'var(--dark-bg)',
                                                padding: '12px',
                                                borderRadius: '6px',
                                                fontFamily: 'monospace',
                                                fontSize: '13px',
                                                marginBottom: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}>
                                                <span style={{ color: '#0dbc79' }}>$</span>
                                                <span>{exercise.command}</span>
                                            </div>

                                            {/* Explanation */}
                                            <div style={{
                                                background: 'rgba(99, 102, 241, 0.05)',
                                                padding: '12px',
                                                borderRadius: '6px',
                                                marginBottom: '12px'
                                            }}>
                                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                                    <strong style={{ color: 'var(--text-primary)' }}>Why this matters: </strong>
                                                    {exercise.explanation}
                                                </p>
                                            </div>

                                            {/* Hints */}
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                                                {exercise.hints.map((hint, index) => (
                                                    <span
                                                        key={index}
                                                        style={{
                                                            fontSize: '12px',
                                                            color: 'var(--text-secondary)',
                                                            background: 'var(--dark-bg)',
                                                            padding: '4px 8px',
                                                            borderRadius: '4px'
                                                        }}
                                                    >
                                                        💡 {hint}
                                                    </span>
                                                ))}
                                            </div>

                                            <div style={{ display: 'flex', gap: '12px' }}>
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ fontSize: '13px', padding: '8px 16px' }}
                                                    onClick={() => runExercise(exercise)}
                                                >
                                                    <PlayCircle size={14} />
                                                    Try in Terminal
                                                </button>
                                                <button
                                                    className="btn btn-secondary"
                                                    style={{ fontSize: '13px', padding: '8px 16px' }}
                                                    onClick={() => markComplete(exercise.id)}
                                                >
                                                    <CheckCircle size={14} />
                                                    Mark Complete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Current Exercise Info */}
                        {currentExercise && (
                            <div className="card" style={{
                                marginTop: '24px',
                                background: 'rgba(99, 102, 241, 0.1)',
                                border: '1px solid var(--primary-color)'
                            }}>
                                <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <PlayCircle size={18} style={{ color: 'var(--primary-color)' }} />
                                    Active Exercise
                                </h4>
                                <p style={{ fontSize: '14px', marginBottom: '8px' }}>
                                    <strong>{currentExercise.title}</strong>
                                </p>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                                    Try running: <code style={{ background: 'var(--dark-bg)', padding: '2px 6px', borderRadius: '4px' }}>{currentExercise.command}</code>
                                </p>
                                <button
                                    className="btn btn-secondary"
                                    style={{ fontSize: '12px' }}
                                    onClick={() => setCurrentExercise(null)}
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LinuxCommandLab;
