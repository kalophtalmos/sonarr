import React, { PropTypes } from 'react';
import { icons } from 'Helpers/Props';
import IconButton from './IconButton';

function SpinnerIconButton(props) {
  const {
    name,
    spinningName,
    isSpinning,
    ...otherProps
  } = props;

  return (
    <IconButton
      name={isSpinning ? `${spinningName || name} fa-spin` : name}
      {...otherProps}
    />
  );
}

SpinnerIconButton.propTypes = {
  name: PropTypes.string.isRequired,
  spinningName: PropTypes.string.isRequired,
  isSpinning: PropTypes.bool.isRequired
};

SpinnerIconButton.defaultProps = {
  spinningName: icons.SPINNER,
  isSpinning: false
};

export default SpinnerIconButton;
