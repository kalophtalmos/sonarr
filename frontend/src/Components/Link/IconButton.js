import React, { PropTypes } from 'react';
import Icon from 'Components/Icon';
import Link from './Link';
import styles from './IconButton.css';

function IconButton(props) {
  const {
    className,
    iconClassName,
    name,
    size,
    ...otherProps
  } = props;

  return (
    <Link
      className={className}
      {...otherProps}
    >
      <Icon
        className={iconClassName}
        name={name}
        size={size}
      />
    </Link>
  );
}

IconButton.propTypes = {
  className: PropTypes.string.isRequired,
  iconClassName: PropTypes.string,
  name: PropTypes.string.isRequired,
  size: PropTypes.number
};

IconButton.defaultProps = {
  className: styles.button
};

export default IconButton;
