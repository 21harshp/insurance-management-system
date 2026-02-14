import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PricingPage.css';

const PricingPage = () => {
    const [isAnnual, setIsAnnual] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    // Navbar scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="pricing-page">
            {/* Navigation */}
            <nav className={`pricing-nav ${scrolled ? 'scrolled' : ''}`}>
                <div className="pricing-nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <img src="/navbar.jpg" alt="Insurance Management System" />
                </div>
                <div className="pricing-nav-actions">
                    <button className="pricing-nav-btn" onClick={() => navigate('/')}>← Back to Home</button>
                    <button className="pricing-nav-cta" onClick={() => navigate('/login')}>Sign In →</button>
                </div>
            </nav>

            {/* Pricing Section */}
            <section className="pricing-section-wrapper">
                <div className="pricing-section-header">
                    {/* <span className="pricing-section-badge">💰 Pricing</span> */}
                    <h1 className="pricing-section-title" style={{ marginTop: '-50px' }}>Simple, Transparent Pricing</h1>
                    <p className="pricing-section-subtitle">
                        Choose the plan that fits your needs. Switch between monthly and annual billing to save more.
                    </p>
                </div>

                <div className="pricing-toggle">
                    <span className={`pricing-toggle-label ${!isAnnual ? 'active' : ''}`}>Monthly</span>
                    <div
                        className={`pricing-switch ${isAnnual ? 'annual' : ''}`}
                        onClick={() => setIsAnnual(!isAnnual)}
                    >
                        <div className="pricing-switch-knob" />
                    </div>
                    <span className={`pricing-toggle-label ${isAnnual ? 'active' : ''}`}>Annual</span>
                    <span className="pricing-save-badge">Save 18%</span>
                </div>

                <div className="pricing-grid">
                    {/* Professional Plan */}
                    <div className="pricing-card">
                        <div className="pricing-icon">
                            <img src="/Professional.png" alt="Professional Plan" />
                        </div>
                        <h3 className="pricing-plan-name">Professional</h3>
                        <p className="pricing-plan-desc">Ideal for teams and growing businesses with full coverage needs.</p>
                        <div className="pricing-price-wrapper">
                            <div className="pricing-price">
                                <span className="pricing-currency">₹</span>
                                <span className="pricing-amount">{isAnnual ? '819' : '999'}</span>
                                <span className="pricing-period">/mo</span>
                            </div>
                            {isAnnual && <div className="pricing-original">₹999/mo</div>}
                        </div>
                        <ul className="pricing-features">
                            <li><span className="pricing-check">✅</span> Unlimited policies</li>
                            <li><span className="pricing-check">✅</span> Health, Motor & Life</li>
                            <li><span className="pricing-check">✅</span> Advanced analytics</li>
                            <li><span className="pricing-check">✅</span> Priority support</li>
                            <li><span className="pricing-check">✅</span> Claim management</li>
                            <li><span className="pricing-check">✅</span> Team collaboration</li>
                        </ul>
                        <button className="pricing-btn pricing-btn-primary" onClick={() => navigate('/login')}>Get Started</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PricingPage;
