import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { updateManualImportItem } from 'Store/Actions/manualImportActions';
import createAllSeriesSelector from 'Store/Selectors/createAllSeriesSelector';
import SelectSeriesModalContent from './SelectSeriesModalContent';

function createMapStateToProps() {
  return createSelector(
    createAllSeriesSelector(),
    (items) => {
      return {
        items
      };
    }
  );
}

const mapDispatchToProps = {
  updateManualImportItem
};

class SelectSeriesModalContentConnector extends Component {

  //
  // Listeners

  onSeriesSelect = (seriesId) => {
    const series = _.find(this.props.items, { id: seriesId });

    this.props.ids.forEach((id) => {
      this.props.updateManualImportItem({
        id,
        series,
        seasonNumber: undefined,
        episodes: []
      });
    });

    this.props.onModalClose(true);
  }

  //
  // Render

  render() {
    return (
      <SelectSeriesModalContent
        {...this.props}
        onSeriesSelect={this.onSeriesSelect}
      />
    );
  }
}

SelectSeriesModalContentConnector.propTypes = {
  ids: PropTypes.arrayOf(PropTypes.number).isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateManualImportItem: PropTypes.func.isRequired,
  onModalClose: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(SelectSeriesModalContentConnector);
