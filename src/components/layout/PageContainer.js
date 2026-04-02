import React from 'react';
import Navbar from '../../components/Navbar';
import { cn } from '../../lib/utils';
import './Layout.css';

const PageContainer = ({ 
  children, 
  title,
  subtitle,
  action,
  showNavbar = true,
  fullWidth = false,
  className,
  noPadding = false,
}) => {
  return (
    <div className="page-container">
      {showNavbar && <Navbar />}
      <div className={cn('page-content', noPadding && 'page-content-no-padding', className)}>
        {(title || action) && (
          <div className="page-header">
            <div className="page-header-text">
              {title && <h1 className="page-title">{title}</h1>}
              {subtitle && <p className="page-subtitle">{subtitle}</p>}
            </div>
            {action && <div className="page-header-action">{action}</div>}
          </div>
        )}
        <div className={cn('page-body', fullWidth && 'page-body-full')}>
          {children}
        </div>
      </div>
    </div>
  );
};

const Section = ({ children, className, ...props }) => (
  <section className={cn('page-section', className)} {...props}>
    {children}
  </section>
);

const Grid = ({ children, cols = 3, gap = 'lg', className, ...props }) => {
  const colsMap = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };
  
  const gapMap = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  return (
    <div className={cn('page-grid', colsMap[cols], gapMap[gap], className)} {...props}>
      {children}
    </div>
  );
};

const Flex = ({ children, gap = 'md', align = 'center', justify = 'between', className, ...props }) => {
  const alignMap = {
    start: 'align-start',
    center: 'align-center',
    end: 'align-end',
    stretch: 'align-stretch',
  };

  const justifyMap = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };

  return (
    <div className={cn('page-flex', alignMap[align], justifyMap[justify], `gap-${gap}`, className)} {...props}>
      {children}
    </div>
  );
};

PageContainer.Section = Section;
PageContainer.Grid = Grid;
PageContainer.Flex = Flex;

export default PageContainer;
