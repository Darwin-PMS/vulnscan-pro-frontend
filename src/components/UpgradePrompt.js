import React from 'react';
import { X, Zap, Lock, ArrowRight, Check } from 'lucide-react';
import { SUBSCRIPTION_TIERS } from '../config/subscriptionPlans';
import './UpgradePrompt.css';

const UpgradePrompt = ({ tierId, feature, description, onClose, onUpgrade }) => {
    const tier = SUBSCRIPTION_TIERS[tierId];
    const tierOrder = ['free', 'starter', 'professional', 'business', 'enterprise', 'msp'];
    const tierIndex = tierOrder.indexOf(tierId);

    const upgradePath = tierOrder.slice(0, tierIndex + 1);

    return (
        <div className="upgrade-prompt-overlay" onClick={onClose}>
            <div className="upgrade-prompt-modal" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="prompt-header">
                    <div className="icon-container">
                        <Lock size={24} />
                    </div>
                    <h2>Upgrade Required</h2>
                    <p>This feature requires a higher subscription plan.</p>
                </div>

                <div className="feature-info">
                    <div className="feature-label">Feature Requested</div>
                    <div className="feature-name">{feature.replace(/_/g, ' ')}</div>
                    {description && <p className="feature-description">{description}</p>}
                </div>

                <div className="recommended-plan">
                    <div className="plan-label">Recommended Plan</div>
                    <div className="plan-card" style={{ borderColor: tier?.color }}>
                        <div className="plan-header" style={{ background: tier?.color }}>
                            <Zap size={16} />
                            <span>{tier?.name}</span>
                        </div>
                        <div className="plan-price">
                            {tier?.price === null ? (
                                <span className="custom">Custom Pricing</span>
                            ) : (
                                <>
                                    <span className="price">${tier?.price}</span>
                                    <span className="period">/{tier?.billingCycle}</span>
                                </>
                            )}
                        </div>
                        <ul className="plan-features">
                            <li>
                                <Check size={14} />
                                {tier?.features?.scans?.monthly === -1 ? 'Unlimited' : tier?.features?.scans?.monthly} scans/month
                            </li>
                            <li>
                                <Check size={14} />
                                {tier?.features?.users?.max === -1 ? 'Unlimited' : tier?.features?.users?.max} team members
                            </li>
                            <li>
                                <Check size={14} />
                                {tier?.features?.scans?.depth} scan depth
                            </li>
                            <li>
                                <Check size={14} />
                                {tier?.features?.compliance?.reports ? 'Compliance Reports' : 'Basic Reports'}
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="upgrade-actions">
                    <button className="btn btn-primary" onClick={onUpgrade}>
                        <Zap size={16} />
                        Upgrade to {tier?.name}
                        <ArrowRight size={16} />
                    </button>
                    <button className="btn btn-secondary" onClick={onClose}>
                        Maybe Later
                    </button>
                </div>

                <div className="plan-comparison-link">
                    <a href="/plan-comparison" onClick={(e) => {
                        e.preventDefault();
                        onClose();
                        window.location.href = '/plan-comparison';
                    }}>
                        Compare all plans
                    </a>
                </div>
            </div>
        </div>
    );
};

export default UpgradePrompt;
