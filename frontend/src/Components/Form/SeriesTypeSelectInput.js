import React from 'react';
import SelectInput from './SelectInput';

const seriesTypeOptions = [
  { 'standard': 'Standard' },
  { 'daily': 'Daily' },
  { 'anime': 'Anime' }
];

function SeriesTypeSelectInput(props) {
  return (
    <SelectInput
      {...props}
      values={seriesTypeOptions}
    />
  );
}

export default SeriesTypeSelectInput;
