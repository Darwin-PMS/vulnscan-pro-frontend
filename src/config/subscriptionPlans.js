/**
 * Subscription Plans Configuration
 * Enhanced tier system with comprehensive feature mapping
 */

export const SUBSCRIPTION_TIERS = {
    free: {
        id: 'free',
        name: 'Free',
        price: 0,
        priceId: null,
        billingCycle: null,
        description: 'Get started with basic vulnerability scanning',
        color: '#6b7280',
        popular: false,
        features: {
            scans: {
                monthly: 5,
                concurrent: 1,
                maxAssets: 10,
                depth: 'basic',
                scheduling: false,
                priority: false
            },
            users: {
                max: 1,
                roles: ['member']
            },
            security: {
                dast: true,
                sast: false,
                sca: false,
                container: false,
                cloud: false,
                mobile: false,
                aiAssist: false
            },
            compliance: {
                reports: false,
                pdfExport: false,
                whiteLabel: false,
                customBranding: false,
                complianceFrameworks: []
            },
            access: {
                api: false,
                webhook: false,
                sso: false,
                scim: false
            },
            storage: {
                auditRetention: 30,
                reportRetention: 30
            },
            support: {
                level: 'community',
                responseTime: null,
                dedicatedManager: false,
                training: false
            },
            limits: {
                apiRateLimit: 0,
                webhookEndpoints: 0
            }
        },
        allowedScanTypes: ['basic_owasp'],
        allowedModules: ['owasp'],
        restrictions: [
            'Watermark on reports',
            'Basic support only',
            'No API access'
        ]
    },

    starter: {
        id: 'starter',
        name: 'Starter',
        price: 49,
        priceId: 'price_starter_monthly',
        billingCycle: 'monthly',
        annualPrice: 39,
        annualPriceId: 'price_starter_annual',
        description: 'Perfect for small teams getting started with security',
        color: '#22c55e',
        popular: false,
        features: {
            scans: {
                monthly: 50,
                concurrent: 2,
                maxAssets: 100,
                depth: 'standard',
                scheduling: true,
                priority: false
            },
            users: {
                max: 3,
                roles: ['member', 'analyst']
            },
            security: {
                dast: true,
                sast: true,
                sca: true,
                container: false,
                cloud: false,
                mobile: false,
                aiAssist: true
            },
            compliance: {
                reports: true,
                pdfExport: false,
                whiteLabel: false,
                customBranding: false,
                complianceFrameworks: ['NIST']
            },
            access: {
                api: 'limited',
                webhook: true,
                sso: false,
                scim: false
            },
            storage: {
                auditRetention: 90,
                reportRetention: 90
            },
            support: {
                level: 'email',
                responseTime: 48,
                dedicatedManager: false,
                training: false
            },
            limits: {
                apiRateLimit: 100,
                webhookEndpoints: 3
            }
        },
        allowedScanTypes: ['basic_owasp', 'standard', 'api_basic'],
        allowedModules: ['owasp', 'ghdb', 'api', 'sca'],
        restrictions: []
    },

    professional: {
        id: 'professional',
        name: 'Professional',
        price: 149,
        priceId: 'price_professional_monthly',
        billingCycle: 'monthly',
        annualPrice: 119,
        annualPriceId: 'price_professional_annual',
        description: 'Comprehensive security for growing businesses',
        color: '#3b82f6',
        popular: true,
        features: {
            scans: {
                monthly: 200,
                concurrent: 5,
                maxAssets: 500,
                depth: 'deep',
                scheduling: true,
                priority: true
            },
            users: {
                max: 10,
                roles: ['member', 'analyst', 'supervisor']
            },
            security: {
                dast: true,
                sast: true,
                sca: true,
                container: false,
                cloud: false,
                mobile: true,
                aiAssist: true
            },
            compliance: {
                reports: true,
                pdfExport: true,
                whiteLabel: false,
                customBranding: false,
                complianceFrameworks: ['NIST', 'OWASP', 'PCI-DSS']
            },
            access: {
                api: true,
                webhook: true,
                sso: false,
                scim: false
            },
            storage: {
                auditRetention: 365,
                reportRetention: 365
            },
            support: {
                level: 'priority',
                responseTime: 24,
                dedicatedManager: false,
                training: false
            },
            limits: {
                apiRateLimit: 1000,
                webhookEndpoints: 10
            }
        },
        allowedScanTypes: ['basic_owasp', 'standard', 'deep', 'api_full', 'mobile'],
        allowedModules: ['owasp', 'ghdb', 'api', 'sca', 'mobile', 'llm'],
        restrictions: []
    },

    business: {
        id: 'business',
        name: 'Business',
        price: 399,
        priceId: 'price_business_monthly',
        billingCycle: 'monthly',
        annualPrice: 319,
        annualPriceId: 'price_business_annual',
        description: 'Enterprise-grade security for organizations',
        color: '#8b5cf6',
        popular: false,
        features: {
            scans: {
                monthly: 1000,
                concurrent: 10,
                maxAssets: 5000,
                depth: 'deep_plus',
                scheduling: true,
                priority: true
            },
            users: {
                max: 50,
                roles: ['member', 'analyst', 'supervisor', 'admin']
            },
            security: {
                dast: true,
                sast: true,
                sca: true,
                container: true,
                cloud: true,
                mobile: true,
                aiAssist: true
            },
            compliance: {
                reports: true,
                pdfExport: true,
                whiteLabel: false,
                customBranding: false,
                complianceFrameworks: ['NIST', 'OWASP', 'PCI-DSS', 'HIPAA', 'SOC2']
            },
            access: {
                api: true,
                webhook: true,
                sso: false,
                scim: false
            },
            storage: {
                auditRetention: 1095,
                reportRetention: 1095
            },
            support: {
                level: 'dedicated',
                responseTime: 8,
                dedicatedManager: true,
                training: true
            },
            limits: {
                apiRateLimit: 5000,
                webhookEndpoints: 50
            }
        },
        allowedScanTypes: ['basic_owasp', 'standard', 'deep', 'deep_plus', 'api_full', 'mobile', 'container', 'cloud'],
        allowedModules: ['owasp', 'ghdb', 'api', 'sca', 'mobile', 'llm', 'container', 'cloud', 'secret'],
        restrictions: []
    },

    enterprise: {
        id: 'enterprise',
        name: 'Enterprise',
        price: null,
        priceId: null,
        billingCycle: 'custom',
        description: 'Fully customized security solution',
        color: '#dc2626',
        popular: false,
        features: {
            scans: {
                monthly: -1,
                concurrent: 50,
                maxAssets: -1,
                depth: 'custom',
                scheduling: true,
                priority: true
            },
            users: {
                max: -1,
                roles: ['member', 'analyst', 'supervisor', 'admin', 'billing']
            },
            security: {
                dast: true,
                sast: true,
                sca: true,
                container: true,
                cloud: true,
                mobile: true,
                aiAssist: true
            },
            compliance: {
                reports: true,
                pdfExport: true,
                whiteLabel: true,
                customBranding: true,
                complianceFrameworks: ['NIST', 'OWASP', 'PCI-DSS', 'HIPAA', 'SOC2', 'GDPR', 'ISO27001']
            },
            access: {
                api: true,
                webhook: true,
                sso: true,
                scim: true
            },
            storage: {
                auditRetention: 2555,
                reportRetention: 2555
            },
            support: {
                level: 'premium',
                responseTime: 4,
                dedicatedManager: true,
                training: true
            },
            limits: {
                apiRateLimit: -1,
                webhookEndpoints: -1
            }
        },
        allowedScanTypes: ['all'],
        allowedModules: ['all'],
        restrictions: []
    },

    msp: {
        id: 'msp',
        name: 'MSSP',
        price: null,
        priceId: null,
        billingCycle: 'custom',
        description: 'Managed Security Service Provider solution',
        color: '#f59e0b',
        popular: false,
        features: {
            scans: {
                monthly: -1,
                concurrent: 100,
                maxAssets: -1,
                depth: 'custom',
                scheduling: true,
                priority: true
            },
            users: {
                max: -1,
                roles: ['member', 'analyst', 'supervisor', 'admin', 'billing', 'client']
            },
            security: {
                dast: true,
                sast: true,
                sca: true,
                container: true,
                cloud: true,
                mobile: true,
                aiAssist: true
            },
            compliance: {
                reports: true,
                pdfExport: true,
                whiteLabel: true,
                customBranding: true,
                complianceFrameworks: ['NIST', 'OWASP', 'PCI-DSS', 'HIPAA', 'SOC2', 'GDPR', 'ISO27001', 'CIS']
            },
            access: {
                api: true,
                webhook: true,
                sso: true,
                scim: true
            },
            storage: {
                auditRetention: -1,
                reportRetention: -1
            },
            support: {
                level: 'premium_plus',
                responseTime: 1,
                dedicatedManager: true,
                training: true
            },
            limits: {
                apiRateLimit: -1,
                webhookEndpoints: -1
            },
            msp: {
                multiTenant: true,
                clientWhiteLabel: true,
                resellerApi: true,
                clientPortal: true,
                revenueShare: true
            }
        },
        allowedScanTypes: ['all'],
        allowedModules: ['all'],
        restrictions: [],
        customOptions: {
            clientManagement: true,
            billingAutomation: true,
            whiteLabelPortal: true
        }
    }
};

export const PLAN_FEATURES = {
    scans: {
        label: 'Scanning',
        items: [
            { key: 'monthly', label: 'Scans per month', format: 'number' },
            { key: 'concurrent', label: 'Concurrent scans', format: 'number' },
            { key: 'maxAssets', label: 'Max assets', format: 'number' },
            { key: 'depth', label: 'Scan depth', format: 'text' },
            { key: 'scheduling', label: 'Scheduled scans', format: 'boolean' },
            { key: 'priority', label: 'Priority queue', format: 'boolean' }
        ]
    },
    users: {
        label: 'Team',
        items: [
            { key: 'max', label: 'Team members', format: 'number' },
            { key: 'roles', label: 'Roles', format: 'array' }
        ]
    },
    security: {
        label: 'Security Modules',
        items: [
            { key: 'dast', label: 'DAST (Web)', format: 'boolean' },
            { key: 'sast', label: 'SAST (Code)', format: 'boolean' },
            { key: 'sca', label: 'SCA (Dependencies)', format: 'boolean' },
            { key: 'container', label: 'Container Scanning', format: 'boolean' },
            { key: 'cloud', label: 'Cloud Security', format: 'boolean' },
            { key: 'mobile', label: 'Mobile Security', format: 'boolean' },
            { key: 'aiAssist', label: 'AI Security Assistant', format: 'boolean' }
        ]
    },
    compliance: {
        label: 'Compliance & Reporting',
        items: [
            { key: 'reports', label: 'Reports', format: 'boolean' },
            { key: 'pdfExport', label: 'PDF Export', format: 'boolean' },
            { key: 'whiteLabel', label: 'White-label Reports', format: 'boolean' },
            { key: 'customBranding', label: 'Custom Branding', format: 'boolean' },
            { key: 'complianceFrameworks', label: 'Compliance Frameworks', format: 'frameworks' }
        ]
    },
    access: {
        label: 'Access & Integration',
        items: [
            { key: 'api', label: 'REST API Access', format: 'access' },
            { key: 'webhook', label: 'Webhooks', format: 'boolean' },
            { key: 'sso', label: 'SSO/SAML', format: 'boolean' },
            { key: 'scim', label: 'SCIM Provisioning', format: 'boolean' }
        ]
    },
    storage: {
        label: 'Data & Storage',
        items: [
            { key: 'auditRetention', label: 'Audit log retention', format: 'days' },
            { key: 'reportRetention', label: 'Report retention', format: 'days' }
        ]
    },
    support: {
        label: 'Support',
        items: [
            { key: 'level', label: 'Support level', format: 'support' },
            { key: 'responseTime', label: 'Response time', format: 'hours' },
            { key: 'dedicatedManager', label: 'Dedicated manager', format: 'boolean' },
            { key: 'training', label: 'Training included', format: 'boolean' }
        ]
    },
    msp: {
        label: 'MSSP Features',
        items: [
            { key: 'multiTenant', label: 'Multi-Tenant Management', format: 'boolean' },
            { key: 'clientWhiteLabel', label: 'Client White-Label', format: 'boolean' },
            { key: 'resellerApi', label: 'Reseller API', format: 'boolean' },
            { key: 'clientPortal', label: 'Client Portal', format: 'boolean' },
            { key: 'revenueShare', label: 'Revenue Share', format: 'boolean' }
        ]
    }
};

export const getTierById = (tierId) => {
    return SUBSCRIPTION_TIERS[tierId] || null;
};

export const hasFeature = (tierId, featurePath) => {
    const tier = getTierById(tierId);
    if (!tier) return false;

    const features = tier.features;
    const path = featurePath.split('.');
    let value = features;

    for (const key of path) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return false;
        }
    }

    return value;
};

export const getPlanLimit = (tierId, limitPath) => {
    return hasFeature(tierId, limitPath);
};

export const canUseModule = (tierId, moduleId) => {
    const tier = getTierById(tierId);
    if (!tier) return false;

    if (tier.allowedModules.includes('all')) return true;
    return tier.allowedModules.includes(moduleId);
};

export const getAllowedModules = (tierId) => {
    const tier = getTierById(tierId);
    if (!tier) return [];
    return tier.allowedModules;
};

export const isUnlimited = (value) => value === -1;

export const formatFeatureValue = (value, format) => {
    if (isUnlimited(value)) return 'Unlimited';

    switch (format) {
        case 'number':
            return value.toString();
        case 'boolean':
            return value ? '✓' : '✗';
        case 'days':
            return `${value} days`;
        case 'hours':
            return `${value}h`;
        case 'access':
            if (value === true) return '✓';
            if (value === false) return '✗';
            return 'Limited';
        case 'select':
            return value;
        case 'array':
            return value.join(', ');
        case 'frameworks':
            return value.length > 0 ? value.join(', ') : 'None';
        case 'support':
            return value.charAt(0).toUpperCase() + value.slice(1);
        default:
            return value;
    }
};

export const comparePlans = (plan1Id, plan2Id) => {
    const plan1 = SUBSCRIPTION_TIERS[plan1Id];
    const plan2 = SUBSCRIPTION_TIERS[plan2Id];

    if (!plan1 || !plan2) return null;

    return {
        plan1,
        plan2,
        differences: Object.keys(SUBSCRIPTION_TIERS).reduce((acc, tierId) => {
            if (tierId === plan1Id || tierId === plan2Id) return acc;
            acc.push(SUBSCRIPTION_TIERS[tierId]);
            return acc;
        }, [])
    };
};

export const getUpgradePath = (currentTierId) => {
    const order = ['free', 'starter', 'professional', 'business', 'enterprise', 'msp'];
    const currentIndex = order.indexOf(currentTierId);
    
    if (currentIndex === -1 || currentIndex === order.length - 1) {
        return [];
    }

    return order.slice(currentIndex + 1);
};

export default SUBSCRIPTION_TIERS;
