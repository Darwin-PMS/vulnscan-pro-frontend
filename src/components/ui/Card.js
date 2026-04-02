import React from 'react';
import { cn } from '../../lib/utils';
import './Card.css';

const Card = ({ 
  children, 
  variant = 'default', 
  padding = 'md', 
  hoverable = false,
  className,
  onClick,
  ...props 
}) => {
  return (
    <div
      className={cn(
        'card',
        `card-${variant}`,
        `card-padding-${padding}`,
        hoverable && 'card-hoverable',
        onClick && 'card-clickable',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className, ...props }) => (
  <div className={`card-header ${className || ''}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className, icon, ...props }) => (
  <div className={`card-title-wrapper ${className || ''}`} {...props}>
    {icon && <span className="card-title-icon">{icon}</span>}
    <h3 className="card-title">{children}</h3>
  </div>
);

const CardDescription = ({ children, className, ...props }) => (
  <p className={`card-description ${className || ''}`} {...props}>
    {children}
  </p>
);

const CardContent = ({ children, className, ...props }) => (
  <div className={`card-content ${className || ''}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className, ...props }) => (
  <div className={`card-footer ${className || ''}`} {...props}>
    {children}
  </div>
);

const CardBadge = ({ children, variant = 'default', className, ...props }) => (
  <span className={cn('card-badge', `card-badge-${variant}`, className)} {...props}>
    {children}
  </span>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Badge = CardBadge;

export default Card;
