# VulnScan Pro - UI/UX Redesign Comprehensive Plan

**Document Version:** 1.0  
**Last Updated:** April 2026  
**Project:** VulnScan Pro Frontend (React)  
**Team Size:** 10 React Developers  
**Pages:** 21 pages, 11 components, 1 global CSS file (~5944 lines)

---

## 1. Current State Assessment

### 1.1 Architecture Overview

```
vulnscan-pro-frontend/
├── src/
│   ├── pages/           # 21 page components
│   │   ├── AdminDashboard.js (1155+ lines)
│   │   ├── Dashboard.js (367 lines)
│   │   ├── LandingPage.js (1040 lines)
│   │   ├── Login.js (267 lines) [uses inline styles]
│   │   ├── EnterpriseDashboard.js (974 lines)
│   │   └── ... (16 more pages)
│   ├── components/       # 11 reusable components
│   ├── contexts/         # Auth, Theme, Toast providers
│   ├── hooks/            # Custom hooks (useAdmin.js)
│   ├── services/        # API service layer
│   ├── styles/           # Single index.css (~5944 lines)
│   └── App.js            # Router configuration
├── package.json
└── public/
```

### 1.2 Current UI/UX Issues

| Category | Issues | Impact |
|----------|--------|--------|
| **Consistency** | 1 CSS file for all styles, inline styles mixed throughout | Hard to maintain, inconsistent theming |
| **Styling Approach** | Pure CSS with CSS variables (no Tailwind/styled-components) | Verbose inline styles in many components |
| **Component Reuse** | Low - many pages have duplicate patterns | Code duplication, maintenance burden |
| **Accessibility** | Basic ARIA labels, no keyboard navigation focus management | Poor screen reader support |
| **Performance** | Large CSS file, no code splitting, no lazy loading | Slower initial load |
| **Responsive Design** | Breakpoints exist but inconsistent | Poor mobile experience |
| **Theming** | Dual theme (dark/light) but implementation varies | Pages look different across themes |
| **Navigation** | Inconsistent between pages (tabs vs sidebar) | Poor UX flow |

### 1.3 Page-by-Page Analysis

| Page | Lines | Inline Styles | Key Issues | Priority |
|------|-------|---------------|------------|----------|
| AdminDashboard.js | 1155+ | Low (uses CSS) | Complex, needs sidebar | HIGH |
| LandingPage.js | 1040 | Low | Good structure, needs polish | MEDIUM |
| Login.js | 267 | HIGH | Full inline styles | HIGH |
| Register.js | 388 | HIGH | Similar to Login | HIGH |
| EnterpriseDashboard.js | 974 | HIGH | Almost entirely inline | HIGH |
| Dashboard.js | 367 | Medium | Good base, needs improvement | MEDIUM |
| ScanResults.js | 807 | Medium | Complex data display | MEDIUM |
| AIAssistant.js | 493 | Low | Chat interface | LOW |

---

## 2. Proposed Design System

### 2.1 Visual Design Tokens

```typescript
// design-tokens.ts

export const tokens = {
  colors: {
    // Primary palette
    primary: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',  // Main
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
    },
    
    // Severity colors (vulnerability-specific)
    severity: {
      critical: '#dc2626',
      criticalBg: 'rgba(220, 38, 38, 0.15)',
      high: '#ea580c',
      highBg: 'rgba(234, 88, 12, 0.15)',
      medium: '#d97706',
      mediumBg: 'rgba(217, 119, 6, 0.15)',
      low: '#65a30d',
      lowBg: 'rgba(101, 163, 13, 0.15)',
      info: '#0891b2',
      infoBg: 'rgba(8, 145, 178, 0.15)',
    },
    
    // Semantic colors
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    
    // Grayscale
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      950: '#030712',
    }
  },
  
  typography: {
    fontFamily: {
      sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    }
  },
  
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
  },
  
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    DEFAULT: '0.375rem', // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    glow: '0 0 20px rgba(99, 102, 241, 0.3)',
  },
  
  transitions: {
    duration: {
      fast: '150ms',
      DEFAULT: '200ms',
      slow: '300ms',
      slower: '500ms',
    },
    easing: {
      DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    }
  },
  
  zIndex: {
    dropdown: 100,
    sticky: 200,
    modal: 300,
    popover: 400,
    tooltip: 500,
    toast: 600,
  }
};
```

### 2.2 Component Architecture

```
src/
├── components/
│   ├── ui/                    # Base UI components (design system)
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   └── index.ts
│   │   ├── Card/
│   │   ├── Input/
│   │   ├── Badge/
│   │   ├── Modal/
│   │   ├── Dropdown/
│   │   ├── Avatar/
│   │   ├── Tooltip/
│   │   ├── Spinner/
│   │   ├── Skeleton/
│   │   └── index.ts
│   │
│   ├── layout/                # Layout components
│   │   ├── Sidebar/
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── PageContainer/
│   │   └── index.ts
│   │
│   ├── features/              # Feature-specific components
│   │   ├── VulnerabilityCard/
│   │   ├── ScanModule/
│   │   ├── StatCard/
│   │   ├── SeverityBadge/
│   │   ├── StatusBadge/
│   │   └── index.ts
│   │
│   └── forms/                # Form components
│       ├── FormField/
│       ├── Select/
│       ├── Checkbox/
│       ├── RadioGroup/
│       └── index.ts
```

### 2.3 Icon System

**Recommendation:** Continue using `lucide-react` (already in use)

```typescript
// icon-constants.ts
export const IconSizes = {
  xs: 12,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
  '2xl': 32,
} as const;

export const IconColors = {
  primary: 'var(--color-primary-500)',
  secondary: 'var(--color-text-secondary)',
  muted: 'var(--color-text-muted)',
  inherit: 'currentColor',
} as const;
```

---

## 3. Layout System

### 3.1 Responsive Breakpoints

```css
/* breakpoints.css */

/* Mobile: 0 - 639px */
/* Tablet: 640px - 1023px */
/* Desktop: 1024px - 1279px */
/* Wide: 1280px - 1535px */
/* Ultra-wide: 1536px+ */

@layer base {
  :root {
    --breakpoint-sm: 640px;
    --breakpoint-md: 768px;
    --breakpoint-lg: 1024px;
    --breakpoint-xl: 1280px;
    --breakpoint-2xl: 1536px;
  }
}

/* Container widths */
.container {
  width: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container { padding-left: 1.5rem; padding-right: 1.5rem; }
}

@media (min-width: 1024px) {
  .container { padding-left: 2rem; padding-right: 2rem; }
}
```

### 3.2 Grid System

```css
/* grid.css */

.grid {
  display: grid;
  gap: var(--spacing-6);
}

.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.grid-cols-6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }
.grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }

@media (max-width: 1023px) {
  .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .md\:grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
}

@media (max-width: 639px) {
  .sm\:grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
}

/* Auto-fit grids for flexible layouts */
.grid-auto {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

/* Dashboard specific */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-6);
}

@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 2fr 1fr;
  }
}
```

### 3.3 Navigation Patterns

#### Main Application Layout

```tsx
// layouts/AppLayout.tsx

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.mainArea}>
        <Header />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
};
```

#### Admin Layout (with collapsible sidebar)

```tsx
// layouts/AdminLayout.tsx

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <div className={cn(styles.adminLayout, sidebarCollapsed && styles.collapsed)}>
      <AdminSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className={styles.adminMain}>
        <AdminHeader />
        <main className={styles.adminContent}>
          {children}
        </main>
      </div>
    </div>
  );
};
```

---

## 4. Component Specifications

### 4.1 Button Component

```tsx
// components/ui/Button/Button.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          styles.button,
          styles[variant],
          styles[size],
          fullWidth && styles.fullWidth,
          isLoading && styles.loading,
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className={styles.spinner}>
            <Loader2 className="animate-spin" size={size === 'sm' ? 14 : 18} />
          </span>
        )}
        {!isLoading && leftIcon && <span className={styles.icon}>{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className={styles.icon}>{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

```css
/* Button.module.css */

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-md);
  transition: all var(--transition-duration-fast) var(--transition-easing-default);
  cursor: pointer;
  white-space: nowrap;
  position: relative;
}

.button:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Variants */
.primary {
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  color: white;
  box-shadow: var(--shadow-sm), 0 0 0 0 rgba(99, 102, 241, 0.5);
}

.primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md), var(--shadow-glow);
}

.primary:active:not(:disabled) {
  transform: translateY(0);
}

.secondary {
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.secondary:hover:not(:disabled) {
  background: var(--color-surface-hover);
  border-color: var(--color-border-strong);
}

.ghost {
  background: transparent;
  color: var(--color-text-secondary);
}

.ghost:hover:not(:disabled) {
  background: var(--color-primary-50);
  color: var(--color-primary-600);
}

.danger {
  background: linear-gradient(135deg, var(--color-danger), var(--color-danger-hover));
  color: white;
}

.danger:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

.link {
  background: transparent;
  color: var(--color-primary-500);
  padding: 0;
}

.link:hover:not(:disabled) {
  text-decoration: underline;
}

/* Sizes */
.xs { padding: var(--spacing-1) var(--spacing-2); font-size: var(--font-size-xs); }
.sm { padding: var(--spacing-2) var(--spacing-3); font-size: var(--font-size-sm); }
.md { padding: var(--spacing-3) var(--spacing-5); font-size: var(--font-size-base); }
.lg { padding: var(--spacing-4) var(--spacing-6); font-size: var(--font-size-lg); }

.fullWidth { width: 100%; }

.loading { pointer-events: none; }

.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### 4.2 Card Component

```tsx
// components/ui/Card/Card.tsx

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        styles.card,
        styles[variant],
        styles[`padding-${padding}`],
        hoverable && styles.hoverable,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={styles.cardHeader}>{children}</div>
);

export const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className={styles.cardTitle}>{children}</h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className={styles.cardDescription}>{children}</p>
);

export const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={styles.cardContent}>{children}</div>
);

export const CardFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={styles.cardFooter}>{children}</div>
);
```

### 4.3 Input Component

```tsx
// components/ui/Input/Input.tsx

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || useId();
    
    return (
      <div className={cn(styles.inputWrapper, fullWidth && styles.fullWidth, className)}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {props.required && <span className={styles.required}>*</span>}
          </label>
        )}
        <div className={cn(styles.inputContainer, error && styles.hasError)}>
          {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              styles.input,
              leftIcon && styles.hasLeftIcon,
              rightIcon && styles.hasRightIcon
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
        </div>
        {error && (
          <span id={`${inputId}-error`} className={styles.error} role="alert">
            {error}
          </span>
        )}
        {hint && !error && (
          <span id={`${inputId}-hint`} className={styles.hint}>
            {hint}
          </span>
        )}
      </div>
    );
  }
);
```

### 4.4 Modal Component

```tsx
// components/ui/Modal/Modal.tsx

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  children,
  footer,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Focus trap
  useEffect(() => {
    if (isOpen) {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0] as HTMLElement;
      firstElement?.focus();
    }
  }, [isOpen]);
  
  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeOnEscape, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div className={styles.overlay} onClick={closeOnOverlayClick ? onClose : undefined}>
      <div
        ref={modalRef}
        className={cn(styles.modal, styles[size])}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
      >
        {title && (
          <div className={styles.header}>
            <div>
              <h2 id="modal-title" className={styles.title}>{title}</h2>
              {description && <p id="modal-description" className={styles.description}>{description}</p>}
            </div>
            <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
              <X size={20} />
            </button>
          </div>
        )}
        <div className={styles.content}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
};
```

---

## 5. Interaction Design

### 5.1 Transition Guidelines

```css
/* Transitions */

/* Duration scale */
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
--duration-slower: 500ms;

/* Easing curves */
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Component transitions */
--transition-colors: color var(--duration-fast) var(--ease-default),
                     background-color var(--duration-fast) var(--ease-default),
                     border-color var(--duration-fast) var(--ease-default);
                     
--transition-transform: transform var(--duration-normal) var(--ease-default);
--transition-opacity: opacity var(--duration-normal) var(--ease-default);
--transition-all: all var(--duration-normal) var(--ease-default);

/* Usage */
.button {
  transition: var(--transition-all);
}

.card {
  transition: box-shadow var(--duration-normal) var(--ease-default),
              transform var(--duration-normal) var(--ease-default);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

### 5.2 Micro-interactions

```tsx
// hooks/useMicroInteractions.ts

// Button press effect
export const useButtonPress = () => {
  const [isPressed, setIsPressed] = useState(false);
  
  return {
    onMouseDown: () => setIsPressed(true),
    onMouseUp: () => setIsPressed(false),
    onMouseLeave: () => setIsPressed(false),
    style: isPressed ? { transform: 'scale(0.98)' } : undefined,
  };
};

// Number counter animation
export const useCountUp = (end: number, duration = 1000) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setCount(Math.floor(eased * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  
  return count;
};

// Toast auto-dismiss
export const useAutoDismiss = (isVisible: boolean, duration = 5000) => {
  const [shouldHide, setShouldHide] = useState(false);
  
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => setShouldHide(true), duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);
  
  return shouldHide;
};
```

### 5.3 Loading States

```tsx
// components/ui/Skeleton/Skeleton.tsx

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className,
}) => {
  return (
    <div
      className={cn(styles.skeleton, styles[variant], className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
};

// Usage
const UserTableSkeleton: React.FC = () => (
  <>
    {Array.from({ length: 5 }).map((_, i) => (
      <tr key={i}>
        <td><Skeleton variant="circular" width={40} height={40} /></td>
        <td><Skeleton width={150} /></td>
        <td><Skeleton width={100} /></td>
        <td><Skeleton width={80} /></td>
        <td><Skeleton width={100} /></td>
      </tr>
    ))}
  </>
);
```

---

## 6. Accessibility Improvements

### 6.1 ARIA Guidelines

```tsx
// Accessibility checklist for components

// BUTTON
<button
  aria-label="Close dialog"      // When icon-only
  aria-expanded={isOpen}         // For collapsible
  aria-controls="menu-id"        // For dropdowns
  disabled={isLoading}            // Disables + dims
/>

// MODAL
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="title-id"      // Points to heading
  aria-describedby="desc-id"      // Optional description
/>

// FORM
<input
  id="email"
  aria-invalid={hasError}
  aria-describedby="email-hint email-error"
  aria-required="true"
/>
<span id="email-error" role="alert">{error}</span>
<p id="email-hint">We'll never share your email</p>

// TABLE
<table aria-label="User list">
  <thead>
    <tr>
      <th scope="col">Name</th>    // scope="col" for headers
      <th scope="col">Email</th>
    </tr>
  </thead>
</table>

// NAVIGATION
<nav aria-label="Main navigation">
<ul role="list">
  <li><a href="/" aria-current="page">Home</a></li>  // Current page
</ul>
</nav>

// LIVE REGIONS
<div aria-live="polite" aria-atomic="true">
  {/* Auto-updated content */}
</div>
```

### 6.2 Keyboard Navigation

```css
/* Focus styles */

*:focus {
  outline: none;
}

*:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

/* Skip link */
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  background: var(--color-primary-500);
  color: white;
  padding: var(--spacing-2) var(--spacing-4);
  z-index: 9999;
  transition: top var(--duration-fast);
}

.skip-link:focus {
  top: 0;
}

/* Roving tabindex for menus */
[role="menuitem"][tabindex="0"] {
  background: var(--color-primary-50);
}

[role="menuitem"][tabindex="-1"]:focus {
  background: var(--color-gray-100);
}
```

### 6.3 Color Contrast

```css
/* WCAG 2.1 AA Compliance */

/* Text contrast requirements */
/* Dark text on light background */
.text-primary { color: var(--color-gray-900); }     /* 21:1 contrast */
.text-secondary { color: var(--color-gray-700); }    /* 9:1 contrast */
.text-muted { color: var(--color-gray-600); }       /* 6.5:1 contrast */

/* On dark background */
[data-theme="dark"] .text-primary { color: var(--color-gray-50); }   /* 18:1 */
[data-theme="dark"] .text-secondary { color: var(--color-gray-300); } /* 8:1 */

/* Interactive elements */
.btn-primary {
  background: var(--color-primary-600);  /* 4.5:1 on white */
  color: white;                          /* Always pass */
}

.link {
  color: var(--color-primary-600);       /* 4.5:1 on white */
  text-decoration: underline;             /* Additional cue */
}

/* Focus indicators - 3:1 minimum */
*:focus-visible {
  outline: 2px solid var(--color-primary-500); /* 3:1 against white */
  outline-offset: 2px;
}
```

---

## 7. Performance Considerations

### 7.1 Code Splitting

```tsx
// App.tsx - Lazy load pages
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Login = lazy(() => import('./pages/Login'));
const ScanResults = lazy(() => import('./pages/ScanResults'));

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/scan/:id" element={<ScanResults />} />
          {/* ... */}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### 7.2 Component Memoization

```tsx
// Optimized stat card
import { memo, useMemo } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  trend?: number;
  icon: React.ReactNode;
  color: string;
}

// Memoize to prevent re-renders when parent updates but props don't
export const StatCard = memo<StatCardProps>(({ title, value, trend, icon, color }) => {
  // Memoize formatted value
  const formattedValue = useMemo(() => {
    return value.toLocaleString();
  }, [value]);
  
  // Memoize trend color
  const trendColor = useMemo(() => {
    return trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-500';
  }, [trend]);
  
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ color }}>
        {icon}
      </div>
      <div className="stat-value">{formattedValue}</div>
      <div className="stat-title">{title}</div>
      {trend !== undefined && (
        <div className={trendColor}>
          {trend > 0 ? '+' : ''}{trend}%
        </div>
      )}
    </div>
  );
});

StatCard.displayName = 'StatCard';
```

### 7.3 Virtualization for Long Lists

```tsx
// For scan lists with 100+ items
import { useVirtualizer } from '@tanstack/react-virtual';

export const ScanList: React.FC<{ scans: Scan[] }> = ({ scans }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: scans.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // Estimated row height
    overscan: 5,
  });
  
  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            className="absolute w-full"
            style={{
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <ScanRow scan={scans[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 8. Implementation Phases

### Phase 1: MVP (Weeks 1-4)

**Goal:** Critical screens re-styled, design tokens established, accessible components

| Task | Effort | Assignee | Status |
|------|--------|----------|--------|
| Extract design tokens to CSS variables | 4h | Frontend Lead | Pending |
| Create Button component | 2h | Dev 1 | Pending |
| Create Card component | 2h | Dev 1 | Pending |
| Create Input/FormField components | 3h | Dev 2 | Pending |
| Create Modal component | 3h | Dev 2 | Pending |
| Create Badge components (Severity, Status) | 2h | Dev 3 | Pending |
| Create Skeleton/Loading components | 2h | Dev 3 | Pending |
| Create Sidebar layout component | 4h | Dev 4 | Pending |
| Create Header layout component | 3h | Dev 4 | Pending |
| Refactor Login page (inline → components) | 4h | Dev 5 | Pending |
| Refactor Register page | 3h | Dev 5 | Pending |
| Refactor AdminDashboard | 8h | Dev 6 | Pending |
| Accessibility audit & fixes | 6h | Dev 7 | Pending |
| Responsive testing | 4h | QA | Pending |

**Deliverables:**
- Design token CSS file
- Core UI component library (10 components)
- Refactored Login, Register, AdminDashboard

### Phase 2: Enhancement (Weeks 5-8)

**Goal:** Advanced components, animations, theming, performance optimizations

| Task | Effort | Assignee | Status |
|------|--------|----------|--------|
| Refactor Dashboard page | 6h | Dev 1 | Pending |
| Refactor LandingPage | 8h | Dev 2 | Pending |
| Refactor ScanResults page | 8h | Dev 3 | Pending |
| Refactor EnterpriseDashboard | 8h | Dev 4 | Pending |
| Create Toast notification system | 4h | Dev 5 | Pending |
| Add page transition animations | 6h | Dev 6 | Pending |
| Implement dark/light theme toggle | 4h | Dev 7 | Pending |
| Code splitting & lazy loading | 4h | Frontend Lead | Pending |
| List virtualization for scan results | 4h | Dev 8 | Pending |
| Performance audit & optimization | 8h | Dev 9 | Pending |
| Full regression testing | 8h | QA | Pending |

**Deliverables:**
- All user-facing pages refactored
- Consistent theming across all pages
- Performance improvements (lazy loading, virtualization)
- Toast notification system

### Phase 3: Polish (Weeks 9-10)

**Goal:** Final polish, documentation, team training

| Task | Effort | Assignee | Status |
|------|--------|----------|--------|
| Create Storybook documentation | 8h | Frontend Lead | Pending |
| Write component usage guidelines | 4h | Dev 1 | Pending |
| Add keyboard shortcuts | 4h | Dev 2 | Pending |
| Animation refinements | 6h | Dev 3 | Pending |
| Final accessibility audit | 4h | Dev 4 | Pending |
| Team training session | 2h | All | Pending |
| Code review & cleanup | 8h | All | Pending |

---

## 9. Migration Plan

### 9.1 Git Workflow

```
feature/admin-redesign        -> develop
feature/dashboard-redesign    -> develop  
feature/ui-components         -> develop
develop                       -> main (releases)
```

### 9.2 Migration Steps

1. **Create new branch** from main
2. **Add design tokens** to existing CSS (backward compatible)
3. **Build components** in `components/ui/` folder
4. **Refactor pages incrementally** (one page at a time)
5. **Test each page** before moving to next
6. **Merge to develop** after completing phase
7. **QA on develop** for full regression
8. **Release to main** after approval

### 9.3 Backward Compatibility

```css
/* Keep old classes working during migration */

.btn {
  /* New styles */
  composes: button from './Button.module.css';
}

/* Gradual migration */
.old-card {
  /* Existing styles */
  /* Add new styles alongside */
}

.new-card {
  /* New component styles */
}
```

---

## 10. Checklist

### Pre-Migration
- [ ] Design tokens extracted and documented
- [ ] Component library scaffold created
- [ ] Storybook set up
- [ ] Git branch created

### Component Development
- [ ] Button (all variants, sizes, loading states)
- [ ] Card (header, content, footer, variants)
- [ ] Input (label, error, hint, icons)
- [ ] Modal (sizes, header, footer, animations)
- [ ] Badge (severity, status, sizes)
- [ ] Skeleton (text, circular, rectangular)
- [ ] Sidebar (collapsible, responsive)
- [ ] Header (search, user menu, notifications)

### Page Migration (per page)
- [ ] Replace inline styles with component props
- [ ] Replace hardcoded colors with tokens
- [ ] Add proper ARIA attributes
- [ ] Test keyboard navigation
- [ ] Test responsive behavior
- [ ] Check color contrast

### Post-Migration
- [ ] Remove duplicate CSS
- [ ] Update documentation
- [ ] Run full test suite
- [ ] Performance audit
- [ ] Accessibility audit
- [ ] Team code review

---

## 11. Estimated Effort Summary

| Phase | Tasks | Hours | Team |
|-------|-------|-------|------|
| Phase 1 | 14 tasks | ~50h | 7 devs + QA |
| Phase 2 | 11 tasks | ~60h | 9 devs |
| Phase 3 | 7 tasks | ~36h | All |
| **Total** | **32 tasks** | **~146h** | **10 devs** |

**Timeline:** ~10 weeks (2.5 months) with parallel work

---

## 12. Technology Recommendations

### Styling Approach

| Approach | Pros | Cons | Recommendation |
|----------|------|------|----------------|
| **CSS Modules** | Scoped styles, tree-shaking, familiar | No dynamic styles, no theming built-in | Recommended for this project |
| **Tailwind CSS** | Rapid development, consistent design, small bundle | Learning curve, verbose class names | Good alternative |
| **styled-components** | Dynamic styles, theming built-in | Runtime overhead, larger bundle | Consider for complex theming |
| **CSS-in-JS (Emotion)** | Best of both worlds | More complexity | Overkill for this project |

**Recommendation:** CSS Modules with CSS Custom Properties (current approach, refined)

**Rationale:**
- Already using CSS custom properties
- No runtime overhead
- Easy migration path
- Good performance
- Team is familiar with CSS

### Additional Dependencies

```json
{
  "dependencies": {
    "@tanstack/react-virtual": "^3.0.0",  // List virtualization
    "clsx": "^2.0.0",                       // Classname utility
    "class-variance-authority": "^0.7.0",    // Component variants
    "@radix-ui/react-dialog": "^1.0.0",     // Accessible modal
    "@radix-ui/react-dropdown-menu": "^2.0.0", // Accessible dropdown
    "@radix-ui/react-tooltip": "^1.0.0",    // Accessible tooltip
    "@radix-ui/react-select": "^2.0.0",      // Accessible select
    "@radix-ui/react-switch": "^1.0.0",     // Accessible toggle
    "react-merge-refs": "^2.0.0",            // Ref merging utility
    "@floating-ui/react": "^1.0.0"           // Floating UI positioning
  }
}
```

---

*Document prepared for VulnScan Pro frontend team review*
