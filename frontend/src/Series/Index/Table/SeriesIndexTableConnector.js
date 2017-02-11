import React, { Component, PropTypes } from 'react';
import { createSelector } from 'reselect';
import connectSection from 'Store/connectSection';
import createClientSideCollectionSelector from 'Store/Selectors/createClientSideCollectionSelector';
import { setSeriesSort } from 'Store/Actions/seriesIndexActions';
import SeriesIndexTable from './SeriesIndexTable';

function createMapStateToProps() {
  return createSelector(
    (state) => state.app.dimensions,
    createClientSideCollectionSelector(),
    (dimensions, series) => {
      return {
        isSmallScreen: dimensions.isSmallScreen,
        ...series
      };
    }
  );
}

const mapDispatchToProps = {
  setSeriesSort
};

class SeriesIndexTableConnector extends Component {

  //
  // Listeners

  onSortPress = (sortKey) => {
    this.props.setSeriesSort({ sortKey });
  }

  //
  // Render

  render() {
    return (
      <SeriesIndexTable
        {...this.props}
        onSortPress={this.onSortPress}
      />
    );
  }
}

SeriesIndexTableConnector.propTypes = {
  setSeriesSort: PropTypes.func.isRequired
};

export default connectSection(
                createMapStateToProps,
                mapDispatchToProps,
                undefined,
                undefined,
                { section: 'series', uiSection: 'seriesIndex' }
              )(SeriesIndexTableConnector);
