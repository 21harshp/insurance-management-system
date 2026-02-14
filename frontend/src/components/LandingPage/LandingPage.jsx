import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const revealRefs = useRef([]);

    // Navbar scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll reveal (Intersection Observer)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
        );

        const elements = document.querySelectorAll('.reveal');
        elements.forEach((el) => observer.observe(el));
        return () => elements.forEach((el) => observer.unobserve(el));
    }, []);

    // Animated counter hook
    const useCounter = (end, duration = 2000) => {
        const [count, setCount] = useState(0);
        const ref = useRef(null);
        const counted = useRef(false);

        useEffect(() => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting && !counted.current) {
                        counted.current = true;
                        let start = 0;
                        const step = end / (duration / 16);
                        const timer = setInterval(() => {
                            start += step;
                            if (start >= end) {
                                setCount(end);
                                clearInterval(timer);
                            } else {
                                setCount(Math.floor(start));
                            }
                        }, 16);
                    }
                },
                { threshold: 0.5 }
            );

            if (ref.current) observer.observe(ref.current);
            return () => { if (ref.current) observer.unobserve(ref.current); };
        }, [end, duration]);

        return [count, ref];
    };

    const [policies, policiesRef] = useCounter(10000, 2200);
    const [satisfaction, satisfactionRef] = useCounter(99, 1800);
    const [claims, claimsRef] = useCounter(5000, 2000);
    const [support, supportRef] = useCounter(24, 1200);

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="landing-page">
            {/* ── Navigation ── */}
            <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <img src="/navbar.jpg" alt="Insurance Management System" />
                </div>
                <div className="nav-actions">
                    <a className="nav-link" onClick={() => scrollToSection('features')} href="#features">Features</a>
                    <a className="nav-link" onClick={() => navigate('/pricing')}>Pricing</a>
                    <a className="nav-link" onClick={() => scrollToSection('how-it-works')} href="#how-it-works">How It Works</a>
                    <a className="nav-link" onClick={() => scrollToSection('testimonials')} href="#testimonials">Testimonials</a>
                    <button className="nav-cta" onClick={() => navigate('/login')}>Sign In →</button>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section className="hero-section">
                <div className="hero-particles">
                    <div className="particle particle-1" />
                    <div className="particle particle-2" />
                    <div className="particle particle-3" />
                    <div className="particle particle-4" />
                    <div className="particle particle-5" />
                </div>

                <div className="hero-content">
                    <div className="hero-text">
                        <div className="hero-badge">
                            <span className="hero-badge-dot" />
                            Trusted Insurance Platform
                        </div>
                        <h1 className="hero-title">
                            Manage Your<br />
                            <span className="gradient-text">Insurance Policies</span><br />
                            With Confidence
                        </h1>
                        <p className="hero-subtitle">
                            Streamline your insurance operations with our powerful management system.
                            From health to motor and life insurance — everything in one place.
                        </p>
                        <div className="hero-buttons">
                            <button className="hero-btn-primary" onClick={() => navigate('/login')}>
                                Get Started →
                            </button>
                            <button className="hero-btn-secondary" onClick={() => scrollToSection('features')}>
                                Learn More ↓
                            </button>
                        </div>
                        <div className="hero-trust">
                            <span className="trust-item">
                                <span className="trust-icon">🔒</span> Secure & Encrypted
                            </span>
                            <span className="trust-item">
                                <span className="trust-icon">⚡</span> Lightning Fast
                            </span>
                            <span className="trust-item">
                                <span className="trust-icon">🌐</span> Cloud Based
                            </span>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="hero-logo-wrapper">
                            <div className="hero-logo-glow" />
                            <div className="hero-logo-ring" />
                            <div className="hero-logo-ring-2" />
                            <img src="/logo.jpg" alt="Insurance Management System" className="hero-logo" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section className="landing-section features-section" id="features">
                <div className="section-header reveal">
                    <span className="section-badge">✦ Our Services</span>
                    <h2 className="section-title">Comprehensive Insurance Coverage</h2>
                    <p className="section-subtitle">
                        We offer a wide range of insurance products designed to protect what matters most to you and your loved ones.
                    </p>
                </div>

                <div className="features-grid">
                    <div className="feature-card reveal reveal-delay-1">
                        <div className="feature-icon">🏥</div>
                        <h3 className="feature-title">Health Insurance</h3>
                        <p className="feature-desc">
                            Comprehensive healthcare coverage with cashless hospitalization, preventive care, and critical illness protection for your entire family.
                        </p>
                        <a className="feature-link" onClick={() => navigate('/login')}>
                            Explore Plans →
                        </a>
                    </div>

                    <div className="feature-card reveal reveal-delay-2">
                        <div className="feature-icon">🚗</div>
                        <h3 className="feature-title">Motor Insurance</h3>
                        <p className="feature-desc">
                            Complete protection for your vehicles with collision coverage, third-party liability, roadside assistance, and hassle-free claim settlement.
                        </p>
                        <a className="feature-link" onClick={() => navigate('/login')}>
                            Explore Plans →
                        </a>
                    </div>

                    <div className="feature-card reveal reveal-delay-3">
                        <div className="feature-icon">🛡️</div>
                        <h3 className="feature-title">Life Insurance</h3>
                        <p className="feature-desc">
                            Secure your family's future with term life, whole life, and endowment plans. Flexible premiums with guaranteed returns and tax benefits.
                        </p>
                        <a className="feature-link" onClick={() => navigate('/login')}>
                            Explore Plans →
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Stats ── */}
            <section className="landing-section stats-section">
                <div className="section-header reveal">
                    <span className="section-badge" style={{ color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.1)' }}>
                        📊 By The Numbers
                    </span>
                    <h2 className="section-title" style={{ color: 'white' }}>Trusted by Thousands</h2>
                    <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.7)' }}>
                        Our numbers speak for themselves — delivering excellence in insurance management every day.
                    </p>
                </div>

                <div className="stats-grid">
                    <div className="stat-item reveal reveal-delay-1" ref={policiesRef}>
                        <span className="stat-icon">📋</span>
                        <div className="stat-number">{policies.toLocaleString()}+</div>
                        <div className="stat-label">Policies Managed</div>
                    </div>
                    <div className="stat-item reveal reveal-delay-2" ref={satisfactionRef}>
                        <span className="stat-icon">⭐</span>
                        <div className="stat-number">{satisfaction}%</div>
                        <div className="stat-label">Client Satisfaction</div>
                    </div>
                    <div className="stat-item reveal reveal-delay-3" ref={claimsRef}>
                        <span className="stat-icon">✅</span>
                        <div className="stat-number">{claims.toLocaleString()}+</div>
                        <div className="stat-label">Claims Processed</div>
                    </div>
                    <div className="stat-item reveal reveal-delay-4" ref={supportRef}>
                        <span className="stat-icon">🕐</span>
                        <div className="stat-number">{support}/7</div>
                        <div className="stat-label">Customer Support</div>
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section className="landing-section how-section" id="how-it-works">
                <div className="section-header reveal">
                    <span className="section-badge">🚀 Simple Process</span>
                    <h2 className="section-title">How It Works</h2>
                    <p className="section-subtitle">
                        Get started with your insurance journey in three simple steps.
                    </p>
                </div>

                <div className="how-grid">
                    <div className="how-step reveal reveal-delay-1">
                        <div className="how-step-number">1</div>
                        <span className="how-step-icon">👤</span>
                        <h3 className="how-step-title">Create Account</h3>
                        <p className="how-step-desc">
                            Sign up with your credentials and get instant access to the management platform.
                        </p>
                    </div>

                    <div className="how-step reveal reveal-delay-2">
                        <div className="how-step-number">2</div>
                        <span className="how-step-icon">📝</span>
                        <h3 className="how-step-title">Choose Your Plan</h3>
                        <p className="how-step-desc">
                            Browse health, motor, and life insurance options and select the best plan for your needs.
                        </p>
                    </div>

                    <div className="how-step reveal reveal-delay-3">
                        <div className="how-step-number">3</div>
                        <span className="how-step-icon">🎉</span>
                        <h3 className="how-step-title">Get Covered</h3>
                        <p className="how-step-desc">
                            Submit your policy and enjoy comprehensive coverage with easy claim management.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className="landing-section testimonials-section" id="testimonials">
                <div className="section-header reveal">
                    <span className="section-badge">💬 Testimonials</span>
                    <h2 className="section-title">What Our Clients Say</h2>
                    <p className="section-subtitle">
                        Don't just take our word for it — hear from some of our satisfied policyholders.
                    </p>
                </div>

                <div className="testimonials-grid">
                    <div className="testimonial-card reveal reveal-delay-1">
                        <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                        <p className="testimonial-text">
                            "This platform has made managing our company's insurance policies incredibly simple. The dashboard is intuitive and the claim process is seamless."
                        </p>
                        <div className="testimonial-author">
                            <div className="testimonial-avatar">R</div>
                            <div>
                                <div className="testimonial-name">Rahul Sharma</div>
                                <div className="testimonial-role">Business Owner</div>
                            </div>
                        </div>
                    </div>

                    <div className="testimonial-card reveal reveal-delay-2">
                        <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                        <p className="testimonial-text">
                            "Switched to this system six months ago and it has transformed our workflow. The real-time tracking and reports save us hours every week."
                        </p>
                        <div className="testimonial-author">
                            <div className="testimonial-avatar">P</div>
                            <div>
                                <div className="testimonial-name">Priya Patel</div>
                                <div className="testimonial-role">Sales Manager</div>
                            </div>
                        </div>
                    </div>

                    <div className="testimonial-card reveal reveal-delay-3">
                        <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                        <p className="testimonial-text">
                            "Outstanding support and a clean interface. Filing and renewing policies takes minutes instead of days. Highly recommend for any insurance team."
                        </p>
                        <div className="testimonial-author">
                            <div className="testimonial-avatar">A</div>
                            <div>
                                <div className="testimonial-name">Amit Desai</div>
                                <div className="testimonial-role">Insurance Agent</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* ── CTA ── */}
            <section className="cta-section">
                <div className="cta-content reveal">
                    <h2 className="cta-title">Ready to Get Started?</h2>
                    <p className="cta-subtitle">
                        Join thousands of satisfied users and take control of your insurance management today.
                    </p>
                    <button className="cta-btn" onClick={() => navigate('/login')}>
                        Start Managing Policies →
                    </button>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <img src="/navbar.jpg" alt="Insurance Management System" />
                        <p>
                            A comprehensive platform for managing health, motor, and life insurance policies
                            with real-time tracking, analytics, and seamless claim processing.
                        </p>
                    </div>

                    <div className="footer-col">
                        <h4>Products</h4>
                        <a href="#features">Health Insurance</a>
                        <a href="#features">Motor Insurance</a>
                        <a href="#features">Life Insurance</a>
                    </div>

                    <div className="footer-col">
                        <h4>Company</h4>
                        <a href="#how-it-works">About Us</a>
                        <a href="#testimonials">Testimonials</a>
                        <a href="#features">Services</a>
                    </div>

                    <div className="footer-col">
                        <h4>Support</h4>
                        <a href="#features">Help Center</a>
                        <a href="#features">Contact Us</a>
                        <a href="#features">FAQs</a>
                    </div>
                </div>

                <div className="footer-bottom">
                    <span>© 2026 Insurance Management System. All rights reserved.</span>
                    <div className="footer-bottom-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
