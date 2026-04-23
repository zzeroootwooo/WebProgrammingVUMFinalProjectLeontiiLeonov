import './Badge.css';

const Badge = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const classes = [
    'badge',
    `badge-${variant}`,
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Badge;
