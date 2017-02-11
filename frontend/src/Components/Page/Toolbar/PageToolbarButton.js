import React, { PropTypes } from 'react';
import classNames from 'classnames';
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';
import styles from './PageToolbarButton.css';

function PageToolbarButton(props) {
  const {
    iconName,
    isDisabled,
    ...otherProps
  } = props;

  return (
    <SpinnerIconButton
      className={classNames(
        styles.toolbarButton,
        isDisabled && styles.isDisabled
      )}
      iconClassName={styles.toolbarButtonIcon}
      name={iconName}
      size={22}
      isDisabled={isDisabled}
      {...otherProps}
    />
  );
}

PageToolbarButton.propTypes = {
  iconName: PropTypes.string.isRequired,
  spinningName: PropTypes.string,
  isSpinning: PropTypes.bool,
  isDisabled: PropTypes.bool
};

export default PageToolbarButton;
