import './Grid.css';

const Grid = ({
  children,
  cols = 1,
  gap = 4,
  className = '',
  ...props
}) => {
  const classes = [
    'grid',
    `grid-cols-${cols}`,
    `grid-gap-${gap}`,
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

export default Grid;
