import './Container.css';

const Container = ({
  children,
  maxWidth = 'lg',
  className = '',
  ...props
}) => {
  const classes = [
    'container',
    `container-${maxWidth}`,
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Container;
