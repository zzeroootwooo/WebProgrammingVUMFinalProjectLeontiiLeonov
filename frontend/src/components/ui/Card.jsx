import { motion } from 'framer-motion';
import './Card.css';

const Card = ({
  children,
  variant = 'glass',
  hoverable = false,
  onClick,
  className = '',
  ...props
}) => {
  const classes = [
    'card',
    `card-${variant}`,
    hoverable && 'card-hoverable',
    onClick && 'card-clickable',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const MotionCard = motion.div;

  return (
    <MotionCard
      className={classes}
      onClick={onClick}
      whileHover={hoverable || onClick ? { y: -4, scale: 1.02 } : {}}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </MotionCard>
  );
};

const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`card-header ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardBody = ({ children, className = '', ...props }) => {
  return (
    <div className={`card-body ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`card-footer ${className}`} {...props}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
