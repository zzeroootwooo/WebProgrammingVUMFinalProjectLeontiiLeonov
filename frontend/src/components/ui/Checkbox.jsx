import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';
import './Checkbox.css';

const Checkbox = ({
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <label className={`checkbox-container ${disabled ? 'checkbox-disabled' : ''} ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="checkbox-input"
        {...props}
      />
      <motion.div
        className="checkbox-box"
        animate={{
          backgroundColor: checked ? 'var(--primary)' : 'transparent',
          borderColor: checked ? 'var(--primary)' : 'var(--glass-border)'
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: checked ? 1 : 0,
            opacity: checked ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
        >
          <FaCheck className="checkbox-icon" />
        </motion.div>
      </motion.div>
      {label && <span className="checkbox-label">{label}</span>}
    </label>
  );
};

export default Checkbox;
