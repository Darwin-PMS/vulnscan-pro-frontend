import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { RotateCcw, Copy, Check, AlertTriangle, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Terminal = ({ height = '400px', readOnly = false }) => {
    const terminalRef = useRef(null);
    const xtermRef = useRef(null);
    const fitAddonRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const [commandHistory, setCommandHistory] = useState([]);
    const [copied, setCopied] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const inputRef = useRef('');
    const navigate = useNavigate();

    const {
        isAuthenticated,
        canUseTerminal,
        incrementTerminalAttempt,
        terminalAttempts
    } = useAuth();

    const terminalAccess = canUseTerminal();

    // Simulated command responses
    const commandResponses = {
        'help': `Available commands:
  whoami       - Display current user
  pwd          - Print working directory
  ls           - List directory contents
  cd [dir]     - Change directory
  cat [file]   - Display file contents
  grep [pattern] [file] - Search for patterns
  nmap [host]  - Network scanner (simulated)
  gobuster [url] - Directory brute forcer (simulated)
  clear        - Clear terminal
  help         - Show this help message`,
        'whoami': 'kali',
        'pwd': '/home/kali/lab',
        'ls': `total 32
drwxr-xr-x 4 kali kali 4096 Jan 15 10:00 .
drwxr-xr-x 18 kali kali 4096 Jan 15 09:00 ..
-rw-r--r-- 1 kali kali  220 Jan 15 09:00 .bash_logout
-rw-r--r-- 1 kali kali 3771 Jan 15 09:00 .bashrc
-rw-r--r-- 1 kali kali  807 Jan 15 09:00 .profile
drwxr-xr-x 2 kali kali 4096 Jan 15 10:00 target
drwxr-xr-x 2 kali kali 4096 Jan 15 10:00 tools
-rw-r--r-- 1 kali kali  156 Jan 15 10:30 notes.txt`,
        'ls -la': `total 32
drwxr-xr-x 4 kali kali 4096 Jan 15 10:00 .
drwxr-xr-x 18 kali kali 4096 Jan 15 09:00 ..
-rw-r--r-- 1 kali kali  220 Jan 15 09:00 .bash_logout
-rw-r--r-- 1 kali kali 3771 Jan 15 09:00 .bashrc
-rw-r--r-- 1 kali kali  807 Jan 15 09:00 .profile
drwxr-xr-x 2 kali kali 4096 Jan 15 10:00 target
drwxr-xr-x 2 kali kali 4096 Jan 15 10:00 tools
-rw-r--r-- 1 kali kali  156 Jan 15 10:30 notes.txt`,
        'cat notes.txt': `# Pentest Notes
Target: 192.168.1.100
Start Time: 10:00 AM

Findings:
- Open ports: 22, 80, 443
- Web server: Apache 2.4.41
- OS: Ubuntu 20.04`,
        'clear': '',
        'nmap -sV 192.168.1.100': `Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for 192.168.1.100
Host is up (0.00032s latency).
Not shown: 997 closed ports
PORT    STATE SERVICE VERSION
22/tcp  open  ssh     OpenSSH 8.2p1
80/tcp  open  http    Apache httpd 2.4.41
443/tcp open  https   Apache httpd 2.4.41

Service detection performed.
Nmap done: 1 IP address (1 host up) scanned`,
        'nmap 192.168.1.100': `Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for 192.168.1.100
Host is up (0.00032s latency).
Not shown: 997 closed ports
PORT    STATE SERVICE
22/tcp  open  ssh
80/tcp  open  http
443/tcp open  https

Nmap done: 1 IP address (1 host up) scanned`,
        'gobuster dir -u http://192.168.1.100 -w common.txt': `===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://192.168.1.100
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                common.txt
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/admin                (Status: 301) [Size: 313]
/login                (Status: 200) [Size: 1523]
/backup                (Status: 301) [Size: 315]
===============================================================
Finished`,
        'curl http://192.168.1.100': `<!DOCTYPE html>
<html>
<head><title>Apache2 Ubuntu Default Page</title></head>
<body><h1>It works!</h1></body>
</html>`,
        'dirb http://192.168.1.100': `-----------------
DIRB v2.22
-----------------
+ http://192.168.1.100/admin (CODE:301)
+ http://192.168.1.100/backup (CODE:301)
+ http://192.168.1.100/login (CODE:200)
-----------------`,
        'nikto -h http://192.168.1.100': `- Nikto v2.1.6
+ Target IP: 192.168.1.100
+ Target Port: 80
+ Server: Apache/2.4.41
+ X-Frame-Options header not present
+ X-XSS-Protection header not defined
+ /admin/: Admin login page found`,
        'echo': '',
        'echo $PATH': '/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/local/sbin',
        'uname -a': 'Linux kali 5.18.0-kali5-amd64 #1 SMP PREEMPT_DYNAMIC Debian 5.18.5-1kali6 x86_64 GNU/Linux',
        'ifconfig': `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.50  netmask 255.255.255.0
        ether 00:0c:29:b9:7c:30  txqueuelen 1000
        RX packets 1234  bytes 123456`,
        'ping -c 4 192.168.1.100': `PING 192.168.1.100 56(84) bytes of data.
64 bytes from 192.168.1.100: icmp_seq=1 ttl=64 time=0.320 ms
64 bytes from 192.168.1.100: icmp_seq=2 ttl=64 time=0.312 ms
64 bytes from 192.168.1.100: icmp_seq=3 ttl=64 time=0.298 ms
64 bytes from 192.168.1.100: icmp_seq=4 ttl=64 time=0.305 ms

--- 192.168.1.100 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss`,
        'grep': 'Usage: grep [OPTION]... PATTERN [FILE]...',
        'grep -i apache notes.txt': 'Web server: Apache 2.4.41'
    };

    const prompt = useCallback((term) => {
        term.write('\r\n\x1b[32mkali@lab\x1b[0m:\x1b[34m~/lab\x1b[0m$ ');
    }, []);

    const executeCommand = useCallback((command, term) => {
        if (!command.trim()) {
            prompt(term);
            return;
        }

        // Track attempt for non-authenticated users
        if (!isAuthenticated) {
            const attempts = incrementTerminalAttempt();
            if (attempts >= 2) {
                setShowLoginPrompt(true);
            }
        }

        setCommandHistory(prev => [...prev, command]);
        const cmd = command.toLowerCase().trim();

        if (cmd === 'clear') {
            term.clear();
            term.writeln('\x1b[32m┌──────────────────────────────────────────────┐\x1b[0m');
            term.writeln('\x1b[32m│\x1b[0m  \x1b[1;36mKali Linux Terminal\x1b[0m                       \x1b[32m│\x1b[0m');
            term.writeln('\x1b[32m└──────────────────────────────────────────────┘\x1b[0m');
        } else if (commandResponses[cmd]) {
            term.writeln('');
            term.writeln(commandResponses[cmd]);
        } else {
            let found = false;
            for (const [key, response] of Object.entries(commandResponses)) {
                if (cmd.startsWith(key.split(' ')[0])) {
                    term.writeln('');
                    term.writeln(response);
                    found = true;
                    break;
                }
            }
            if (!found) {
                term.writeln('');
                term.writeln(`\x1b[31mCommand not found: ${command}\x1b[0m`);
                term.writeln(`Type \x1b[33mhelp\x1b[0m to see available commands`);
            }
        }

        // Show attempt warning for non-authenticated users
        if (!isAuthenticated && terminalAccess.attemptsLeft <= 1) {
            term.writeln('');
            term.writeln('\x1b[33m⚠️  Warning: You have used ' + terminalAttempts + ' of 2 free attempts.\x1b[0m');
            term.writeln('\x1b[33m   Sign in for unlimited access.\x1b[0m');
        }

        prompt(term);
    }, [prompt, isAuthenticated, incrementTerminalAttempt, terminalAccess.attemptsLeft, terminalAttempts]);

    useEffect(() => {
        if (!terminalRef.current) return;

        const timer = setTimeout(() => {
            try {
                const term = new XTerm({
                    cursorBlink: true,
                    fontSize: 14,
                    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
                    theme: {
                        background: '#1e1e1e',
                        foreground: '#d4d4d4',
                        cursor: '#d4d4d4',
                        selectionBackground: '#264f78',
                        black: '#000000',
                        red: '#cd3131',
                        green: '#0dbc79',
                        yellow: '#e5e510',
                        blue: '#2472c8',
                        magenta: '#bc3fbc',
                        cyan: '#11a8cd',
                        white: '#e5e5e5'
                    },
                    cols: 80,
                    rows: 24,
                    convertEol: true,
                    scrollback: 1000
                });

                const fitAddon = new FitAddon();
                term.loadAddon(fitAddon);

                term.open(terminalRef.current);

                setTimeout(() => {
                    try {
                        fitAddon.fit();
                    } catch (e) {
                        console.warn('Fit addon error:', e);
                    }
                }, 100);

                xtermRef.current = term;
                fitAddonRef.current = fitAddon;

                // Welcome message
                term.writeln('\x1b[32m┌──────────────────────────────────────────────┐\x1b[0m');
                term.writeln('\x1b[32m│\x1b[0m  \x1b[1;36mKali Linux Terminal - Learning Environment\x1b[0m  \x1b[32m│\x1b[0m');

                if (!isAuthenticated) {
                    term.writeln(`\x1b[32m│\x1b[0m  \x1b[33mFree attempts remaining: ${terminalAccess.attemptsLeft}\x1b[0m                      \x1b[32m│\x1b[0m`);
                } else {
                    term.writeln('\x1b[32m│\x1b[0m  \x1b[32m✓ Unlimited access (Logged in)\x1b[0m               \x1b[32m│\x1b[0m');
                }

                term.writeln('\x1b[32m│\x1b[0m  Type \x1b[33mhelp\x1b[0m to see available commands         \x1b[32m│\x1b[0m');
                term.writeln('\x1b[32m└──────────────────────────────────────────────┘\x1b[0m');
                prompt(term);
                setIsReady(true);

                if (!readOnly && terminalAccess.allowed) {
                    term.onData((data) => {
                        const code = data.charCodeAt(0);

                        if (code === 13) { // Enter
                            executeCommand(inputRef.current, term);
                            inputRef.current = '';
                        } else if (code === 127) { // Backspace
                            if (inputRef.current.length > 0) {
                                inputRef.current = inputRef.current.slice(0, -1);
                                term.write('\b \b');
                            }
                        } else if (code >= 32 && code !== 127) {
                            inputRef.current += data;
                            term.write(data);
                        }
                    });
                }

                const handleResize = () => {
                    if (fitAddonRef.current) {
                        try {
                            fitAddonRef.current.fit();
                        } catch (e) {
                            console.warn('Resize error:', e);
                        }
                    }
                };

                window.addEventListener('resize', handleResize);

                return () => {
                    window.removeEventListener('resize', handleResize);
                    term.dispose();
                };
            } catch (error) {
                console.error('Terminal initialization error:', error);
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [readOnly, prompt, executeCommand, isAuthenticated, terminalAccess.allowed, terminalAccess.attemptsLeft]);

    const handleReset = () => {
        const term = xtermRef.current;
        if (term) {
            term.clear();
            term.writeln('\x1b[32m┌──────────────────────────────────────────────┐\x1b[0m');
            term.writeln('\x1b[32m│\x1b[0m  \x1b[1;36mTerminal Reset\x1b[0m                            \x1b[32m│\x1b[0m');
            term.writeln('\x1b[32m└──────────────────────────────────────────────┘\x1b[0m');
            inputRef.current = '';
            setCommandHistory([]);
            prompt(term);
        }
    };

    const handleCopy = () => {
        const text = commandHistory.join('\n');
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLoginRedirect = () => {
        navigate('/login', { state: { from: { pathname: '/terminal' } } });
    };

    // If access is denied, show login prompt
    if (!terminalAccess.allowed && !isAuthenticated) {
        return (
            <div style={{ height, display: 'flex', flexDirection: 'column', background: '#1e1e1e', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 16px',
                    background: 'var(--card-bg)',
                    borderBottom: '1px solid var(--border-color)'
                }}>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>Kali Linux Terminal</span>
                </div>
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px',
                    background: '#1e1e1e'
                }}>
                    <Lock size={48} style={{ color: 'var(--danger-color)', marginBottom: '16px' }} />
                    <h3 style={{ marginBottom: '8px' }}>Access Limit Reached</h3>
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '24px' }}>
                        You have used all 2 free terminal attempts.<br />
                        Sign in to get unlimited access.
                    </p>
                    <button className="btn btn-primary" onClick={handleLoginRedirect}>
                        Sign In to Continue
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ height, display: 'flex', flexDirection: 'column', background: '#1e1e1e', borderRadius: '8px', overflow: 'hidden' }}>
            {/* Toolbar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 16px',
                background: 'var(--card-bg)',
                borderBottom: '1px solid var(--border-color)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>Kali Linux Terminal</span>
                    {!isAuthenticated && (
                        <span style={{
                            fontSize: '12px',
                            color: terminalAccess.attemptsLeft === 1 ? 'var(--warning-color)' : 'var(--text-secondary)',
                            background: 'rgba(245, 158, 11, 0.1)',
                            padding: '2px 8px',
                            borderRadius: '4px'
                        }}>
                            <AlertTriangle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                            {terminalAccess.attemptsLeft} attempt{terminalAccess.attemptsLeft !== 1 ? 's' : ''} left
                        </span>
                    )}
                    {!isReady && (
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Loading...</span>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {!isAuthenticated && (
                        <button
                            className="btn btn-primary"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                            onClick={handleLoginRedirect}
                        >
                            <Lock size={14} style={{ marginRight: '4px' }} />
                            Sign In
                        </button>
                    )}
                    <button
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                        onClick={handleCopy}
                        disabled={!isReady}
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                    <button
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                        onClick={handleReset}
                        disabled={!isReady}
                    >
                        <RotateCcw size={14} />
                    </button>
                </div>
            </div>

            {/* Login Prompt Overlay */}
            {showLoginPrompt && !isAuthenticated && (
                <div style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderBottom: '1px solid var(--warning-color)',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <AlertTriangle size={14} style={{ display: 'inline', marginRight: '8px', color: 'var(--warning-color)' }} />
                        You have used 1 of 2 free attempts. Sign in for unlimited access.
                    </span>
                    <button
                        className="btn btn-primary"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                        onClick={handleLoginRedirect}
                    >
                        Sign In
                    </button>
                </div>
            )}

            {/* Terminal */}
            <div
                ref={terminalRef}
                style={{
                    flex: 1,
                    background: '#1e1e1e',
                    padding: '8px',
                    overflow: 'hidden'
                }}
            />
        </div>
    );
};

export default Terminal;
