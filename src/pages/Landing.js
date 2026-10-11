import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    Activity,
    Bot,
    Bug,
    BookOpen,
    CheckCircle,
    ChevronRight,
    Database,
    Globe2,
    LockKeyhole,
    ScanLine,
    Send,
    ShieldCheck,
    Smartphone
} from 'lucide-react';
import api from '../services/api';

const features = [
    {
        icon: ScanLine,
        title: 'Web vulnerability scanning',
        description: 'Assess authorized websites for common exposure, security header gaps, and other web risks.'
    },
    {
        icon: Bug,
        title: 'Clear findings',
        description: 'Review discovered issues by severity, inspect evidence, and use remediation guidance to plan fixes.'
    },
    {
        icon: Smartphone,
        title: 'Mobile app testing',
        description: 'Explore mobile security checks and organize assessment notes for your application.'
    },
    {
        icon: Bot,
        title: 'AI security assistant',
        description: 'Get help understanding findings and security concepts from an in-workspace assistant.'
    },
    {
        icon: Database,
        title: 'GHDB patterns',
        description: 'Browse search patterns and learn how exposed files and pages can surface online.'
    },
    {
        icon: BookOpen,
        title: 'Hands-on learning',
        description: 'Build practical security knowledge with guided labs and an interactive terminal.'
    }
];

const articles = [
    {
        category: 'Web security',
        title: 'A practical guide to reviewing web security headers',
        description: 'Learn what common response headers do and how to prioritize missing protections.'
    },
    {
        category: 'Vulnerability management',
        title: 'From scan finding to remediation plan',
        description: 'A repeatable approach to validating findings, assessing impact, and tracking fixes.'
    },
    {
        category: 'Security fundamentals',
        title: 'Understanding exposed files and directories',
        description: 'Explore how accidental exposure happens and what teams can do to reduce the risk.'
    }
];

const Landing = () => {
    const [contact, setContact] = useState({ name: '', email: '', message: '' });
    const [contactStatus, setContactStatus] = useState({ type: '', message: '' });
    const [isSending, setIsSending] = useState(false);
    const landingRef = useRef(null);

    useEffect(() => {
        document.title = 'VulnScan Pro | Web & Mobile Security Testing';

        const landingPage = landingRef.current;
        if (!landingPage) return undefined;

        const revealItems = landingPage.querySelectorAll('[data-reveal]');
        if (!('IntersectionObserver' in window)) {
            revealItems.forEach((item) => item.classList.add('is-visible'));
            return undefined;
        }

        landingPage.classList.add('landing-reveal-enabled');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

        revealItems.forEach((item) => observer.observe(item));
        return () => {
            observer.disconnect();
            landingPage.classList.remove('landing-reveal-enabled');
        };
    }, []);

    const updateContact = (event) => {
        const { name, value } = event.target;
        setContact((current) => ({ ...current, [name]: value }));
    };

    const submitContact = async (event) => {
        event.preventDefault();
        setContactStatus({ type: '', message: '' });
        setIsSending(true);

        try {
            await api.post('/contact', contact);
            setContactStatus({ type: 'success', message: 'Thanks for reaching out. Your message has been sent.' });
            setContact({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Error sending contact message:', error);
            setContactStatus({
                type: 'error',
                message: error.response?.data?.error || 'We could not send your message. Please try again.'
            });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="landing-page" ref={landingRef}>
            <section id="intro" className="landing-hero">
                <div className="container landing-hero-layout">
                    <div className="landing-hero-copy">
                        <div className="landing-eyebrow">
                            <span className="landing-eyebrow-pulse" />
                            Security visibility for your applications
                        </div>
                        <h1>
                            See your security
                            <br />
                            <span>more clearly.</span>
                        </h1>
                        <p>
                            Find, understand, and prioritize vulnerabilities with one workspace built for practical
                            security testing.
                        </p>
                        <div className="landing-hero-actions">
                            <Link to="/login" className="btn btn-primary landing-cta">
                                Open your workspace
                                <ArrowRight size={18} />
                            </Link>
                            <a href="#features" className="landing-text-link">
                                Explore platform <ChevronRight size={17} />
                            </a>
                        </div>
                        <div className="landing-hero-highlights">
                            <span><CheckCircle size={16} /> Authorized testing</span>
                            <span><CheckCircle size={16} /> Prioritized findings</span>
                            <span><CheckCircle size={16} /> Guided remediation</span>
                        </div>
                    </div>

                    <div className="landing-console" aria-label="Illustrative security scan dashboard preview">
                        <div className="landing-console-topbar">
                            <div className="landing-console-brand">
                                <span className="landing-console-shield"><ShieldCheck size={16} /></span>
                                <span>Security overview</span>
                            </div>
                            <span className="landing-console-live"><span /> SAMPLE PREVIEW</span>
                        </div>
                        <div className="landing-console-body">
                            <div className="landing-console-target">
                                <span className="landing-console-target-icon"><Globe2 size={17} /></span>
                                <div>
                                    <small>ASSESSMENT TARGET</small>
                                    <strong>your-application.example</strong>
                                </div>
                                <span className="landing-console-complete"><CheckCircle size={15} /> Ready</span>
                            </div>
                            <div className="landing-console-metrics">
                                <div><small>SCAN STATUS</small><strong><span className="landing-status-dot" /> Complete</strong></div>
                                <div><small>FINDINGS</small><strong>Prioritized</strong></div>
                                <div><small>NEXT STEP</small><strong>Review report</strong></div>
                            </div>
                            <div className="landing-console-divider" />
                            <div className="landing-console-findings-title">
                                <span><Activity size={16} /> Finding overview</span>
                                <span>Sample data</span>
                            </div>
                            <div className="landing-console-finding">
                                <span className="landing-severity-mark high" />
                                <span><strong>Security configuration</strong><small>Review headers and policies</small></span>
                                <span className="landing-severity-label">REVIEW</span>
                            </div>
                            <div className="landing-console-finding">
                                <span className="landing-severity-mark medium" />
                                <span><strong>Exposure checks</strong><small>Validate discovered resources</small></span>
                                <span className="landing-severity-label">REVIEW</span>
                            </div>
                            <div className="landing-console-footer">
                                <LockKeyhole size={14} />
                                Example interface · Test only systems you’re authorized to assess
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="landing-section">
                <div className="container">
                    <div className="landing-section-heading" data-reveal>
                        <span className="landing-section-kicker">Platform features</span>
                        <h2>Everything you need to work through security findings</h2>
                        <p>Explore the tools available in the VulnScan Pro workspace.</p>
                    </div>
                    <div className="landing-feature-grid">
                        {features.map(({ icon: Icon, title, description }, index) => (
                            <article
                                className="card landing-feature-card"
                                data-reveal
                                style={{ '--reveal-delay': `${(index % 3) * 90}ms` }}
                                key={title}
                            >
                                <div className="landing-icon-wrap"><Icon size={22} /></div>
                                <h3>{title}</h3>
                                <p>{description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="landing-section landing-workflow">
                <div className="container">
                    <div className="landing-section-heading" data-reveal>
                        <span className="landing-section-kicker">How it works</span>
                        <h2>A clear path from target to next steps</h2>
                        <p>Keep your assessment focused, understand what the scanner reports, and decide what to review next.</p>
                    </div>
                    <div className="landing-workflow-grid">
                        {[
                            {
                                number: '01',
                                icon: Globe2,
                                title: 'Choose an authorized target',
                                description: 'Enter the website you own or have explicit permission to assess.'
                            },
                            {
                                number: '02',
                                icon: ScanLine,
                                title: 'Run your assessment',
                                description: 'Start a scan and follow its progress from your workspace.'
                            },
                            {
                                number: '03',
                                icon: ShieldCheck,
                                title: 'Review and take action',
                                description: 'Explore findings, inspect evidence, and use remediation guidance to plan what comes next.'
                            }
                        ].map(({ number, icon: Icon, title, description }, index) => (
                            <article
                                className="landing-workflow-step"
                                data-reveal
                                style={{ '--reveal-delay': `${index * 110}ms` }}
                                key={number}
                            >
                                <div className="landing-step-topline">
                                    <span className="landing-step-number">{number}</span>
                                    <span className="landing-step-icon"><Icon size={20} /></span>
                                </div>
                                <h3>{title}</h3>
                                <p>{description}</p>
                            </article>
                        ))}
                    </div>
                    <p className="landing-workflow-note" data-reveal>
                        VulnScan Pro supports your review; validate results and confirm fixes in your own environment.
                    </p>
                </div>
            </section>

            <section id="about" className="landing-section landing-about">
                <div className="container landing-about-layout" data-reveal>
                    <div>
                        <span className="landing-section-kicker">About VulnScan Pro</span>
                        <h2>Make security work easier to understand and act on.</h2>
                    </div>
                    <div className="landing-about-copy">
                        <p>
                            VulnScan Pro brings scanning workflows, vulnerability details, and security learning into
                            a single interface. It is designed to help teams and learners explore potential issues and
                            understand practical next steps.
                        </p>
                        <p>
                            Use the platform only to assess systems you own or have explicit permission to test.
                        </p>
                        <Link to="/login" className="landing-text-link">
                            Explore the workspace <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            <section id="blog" className="landing-section">
                <div className="container">
                    <div className="landing-section-heading landing-blog-heading" data-reveal>
                        <div>
                            <span className="landing-section-kicker">From the blog</span>
                            <h2>Notes for a safer web</h2>
                        </div>
                        <span className="landing-coming-soon">Articles coming soon</span>
                    </div>
                    <div className="landing-blog-grid">
                        {articles.map((article, index) => (
                            <article
                                className="card landing-blog-card"
                                data-reveal
                                style={{ '--reveal-delay': `${index * 90}ms` }}
                                key={article.title}
                            >
                                <span>{article.category}</span>
                                <h3>{article.title}</h3>
                                <p>{article.description}</p>
                                <span className="landing-read-label">Coming soon</span>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section id="faq" className="landing-section landing-faq">
                <div className="container landing-faq-layout">
                    <div data-reveal>
                        <span className="landing-section-kicker">Good to know</span>
                        <h2>Questions before you get started?</h2>
                        <p>Here are a few things to know before using the security workspace.</p>
                    </div>
                    <div className="landing-faq-list" data-reveal>
                        <details>
                            <summary>Can I scan any website?</summary>
                            <p>No. Only scan websites and systems you own or have explicit permission to assess.</p>
                        </details>
                        <details>
                            <summary>Does an automated scan replace a security review?</summary>
                            <p>No. Automated results are a starting point. Validate findings in context and use expert review where appropriate.</p>
                        </details>
                        <details>
                            <summary>What can I do after signing in?</summary>
                            <p>Access the available scan tools, review findings, explore learning labs, and use the other workspace features.</p>
                        </details>
                        <details>
                            <summary>Are all findings confirmed vulnerabilities?</summary>
                            <p>Not necessarily. Review the evidence and validate each result before treating it as a confirmed issue.</p>
                        </details>
                    </div>
                </div>
            </section>

            <section id="contact" className="landing-section landing-contact">
                <div className="container landing-contact-layout">
                    <div className="landing-contact-copy" data-reveal>
                        <span className="landing-section-kicker">Contact us</span>
                        <h2>Have a question or feedback?</h2>
                        <p>Send the team a message and we’ll get back to you.</p>
                        <div className="landing-contact-note">
                            <LockKeyhole size={18} />
                            <span>Only share information you are comfortable submitting through this form.</span>
                        </div>
                    </div>

                    <form className="card landing-contact-form" onSubmit={submitContact} data-reveal>
                        <label htmlFor="contact-name">Name</label>
                        <input
                            id="contact-name"
                            className="input"
                            name="name"
                            autoComplete="name"
                            value={contact.name}
                            onChange={updateContact}
                            required
                        />

                        <label htmlFor="contact-email">Email</label>
                        <input
                            id="contact-email"
                            className="input"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={contact.email}
                            onChange={updateContact}
                            required
                        />

                        <label htmlFor="contact-message">Message</label>
                        <textarea
                            id="contact-message"
                            className="input landing-contact-message"
                            name="message"
                            rows="5"
                            value={contact.message}
                            onChange={updateContact}
                            required
                        />

                        {contactStatus.message && (
                            <p className={`landing-form-status ${contactStatus.type}`} role="status">
                                {contactStatus.message}
                            </p>
                        )}

                        <button className="btn btn-primary landing-cta" type="submit" disabled={isSending}>
                            <Send size={16} />
                            {isSending ? 'Sending...' : 'Send message'}
                        </button>
                    </form>
                </div>
            </section>

            <section className="landing-final-cta">
                <div className="container landing-final-cta-content" data-reveal>
                    <div>
                        <h2>Ready to explore your security workspace?</h2>
                        <p>Sign in to access scanning, findings, and learning tools.</p>
                    </div>
                    <Link to="/login" className="btn btn-primary landing-cta">
                        Get started <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            <footer className="landing-footer" data-reveal>
                <div className="container landing-footer-content">
                    <Link to="/" className="nav-brand">
                        <ShieldCheck size={22} />
                        <span>VulnScan Pro</span>
                    </Link>
                    <span>Security testing for systems you are authorized to assess.</span>
                    <a href="#intro" className="landing-text-link">Back to top ↑</a>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
