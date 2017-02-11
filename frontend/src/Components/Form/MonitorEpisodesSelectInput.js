import React, { PropTypes } from 'react';
import SelectInput from './SelectInput';

const monitorOptions = [
  { 'all': 'All Episodes' },
  { 'future': 'Future Episodes' },
  { 'missing': 'Missing Episodes' },
  { 'existing': 'Existing Episodes' },
  { 'first': 'Only First Season' },
  { 'latest': 'Only Latest Season' },
  { 'none': 'None' }
];

function MonitorEpisodesSelectInput({ includeNoChange, ...otherProps }) {
  const values = includeNoChange ? [
    { 'noChange': 'No Change' },
    ...monitorOptions
  ] : monitorOptions;

  return (
    <SelectInput
      values={values}
      {...otherProps}
    />
  );
}

MonitorEpisodesSelectInput.propTypes = {
  includeNoChange: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};

MonitorEpisodesSelectInput.defaultProps = {
  includeNoChange: false
};

export default MonitorEpisodesSelectInput;
