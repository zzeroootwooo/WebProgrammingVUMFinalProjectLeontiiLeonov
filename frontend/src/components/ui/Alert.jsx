import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import './Alert.css';

const Alert = ({
  children,
  type = 'info',
  onClose,
  className = '',
  ...props
}) => {
  const icons = {
    success: <FaCheckCircle />,
    error: <FaExclamationCircle />,
    warning: <FaExclamationCircle />,
    info: <FaInfoCircle />
  };

  const classes = [
    'alert',
    `alert-${type}`,
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <AnimatePresence>
      <motion.div
        className={classes}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        <div className="alert-icon">{icons[type]}</div>
        <div className="alert-content">{children}</div>
        {onClose && (
          <button className="alert-close" onClick={onClose}>
            <FaTimes />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Alert;
