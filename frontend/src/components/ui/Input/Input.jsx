import { useState } from 'react';
import { motion } from 'framer-motion';
import './Input.css';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  disabled = false,
  required = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const inputClasses = [
    'input-field',
    error && 'input-error',
    disabled && 'input-disabled',
    icon && `input-with-icon-${iconPosition}`,
    className
  ]
    .filter(Boolean)
    .join(' ');

  const containerClasses = [
    'input-container',
    fullWidth && 'input-full'
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        {icon && iconPosition === 'left' && (
          <span className="input-icon input-icon-left">{icon}</span>
        )}
        <motion.input
          className={inputClasses}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          animate={{
            scale: isFocused ? 1.01 : 1,
          }}
          transition={{ duration: 0.2 }}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <span className="input-icon input-icon-right">{icon}</span>
        )}
      </div>
      {(error || helperText) && (
        <p className={`input-helper ${error ? 'input-helper-error' : ''}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
