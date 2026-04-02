import React from 'react';
import { cn } from '../../lib/utils';
import './Input.css';

const Input = React.forwardRef(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className,
  id,
  type = 'text',
  required,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={cn('input-wrapper', fullWidth && 'input-full-width', className)}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <div className={cn('input-container', error && 'input-error', leftIcon && 'input-has-left-icon', rightIcon && 'input-has-right-icon')}>
        {leftIcon && <span className="input-icon input-icon-left">{leftIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className="input-field"
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {rightIcon && <span className="input-icon input-icon-right">{rightIcon}</span>}
      </div>
      {error && (
        <span id={`${inputId}-error`} className="input-error-message" role="alert">
          {error}
        </span>
      )}
      {hint && !error && (
        <span id={`${inputId}-hint`} className="input-hint">
          {hint}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

const Textarea = React.forwardRef(({
  label,
  error,
  hint,
  fullWidth = true,
  className,
  id,
  required,
  rows = 4,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={cn('input-wrapper', fullWidth && 'input-full-width', className)}>
      {label && (
        <label htmlFor={textareaId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        className={cn('input-field', 'input-textarea', error && 'input-error')}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
        {...props}
      />
      {error && (
        <span id={`${textareaId}-error`} className="input-error-message" role="alert">
          {error}
        </span>
      )}
      {hint && !error && (
        <span id={`${textareaId}-hint`} className="input-hint">
          {hint}
        </span>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

const Select = React.forwardRef(({
  label,
  error,
  hint,
  fullWidth = true,
  className,
  id,
  required,
  children,
  placeholder,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={cn('input-wrapper', fullWidth && 'input-full-width', className)}>
      {label && (
        <label htmlFor={selectId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={cn('input-field', 'input-select', error && 'input-error')}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children}
      </select>
      {error && (
        <span id={`${selectId}-error`} className="input-error-message" role="alert">
          {error}
        </span>
      )}
      {hint && !error && (
        <span id={`${selectId}-hint`} className="input-hint">
          {hint}
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';

Input.Textarea = Textarea;
Input.Select = Select;

export default Input;
