import { motion } from 'framer-motion';
import './Select.css';

const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  helperText,
  disabled = false,
  required = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const selectClasses = [
    'select-field',
    error && 'select-error',
    disabled && 'select-disabled',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const containerClasses = [
    'select-container',
    fullWidth && 'select-full'
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      {label && (
        <label className="select-label">
          {label}
          {required && <span className="select-required">*</span>}
        </label>
      )}
      <motion.select
        className={selectClasses}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </motion.select>
      {(error || helperText) && (
        <p className={`select-helper ${error ? 'select-helper-error' : ''}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Select;
