import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createQualityProfileSelector from 'Store/Selectors/createQualityProfileSelector';
import SeriesEditorRow from './SeriesEditorRow';

function createMapStateToProps() {
  return createSelector(
    createQualityProfileSelector(),
    (qualityProfile) => {
      return {
        qualityProfile
      };
    }
  );
}

function SeriesEditorRowConnector(props) {
  return (
    <SeriesEditorRow
      {...props}
    />
  );
}

SeriesEditorRowConnector.propTypes = {
  qualityProfileId: PropTypes.number.isRequired
};

export default connect(createMapStateToProps)(SeriesEditorRowConnector);
