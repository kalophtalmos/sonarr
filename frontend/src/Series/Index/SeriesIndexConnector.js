import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createCommandsSelector from 'Store/Selectors/createCommandsSelector';
import createScrollPositionSelector from 'Store/Selectors/createScrollPositionSelector';
import { fetchSeries } from 'Store/Actions/seriesActions';
import scrollPositions from 'Store/scrollPositions';
import { setSeriesSort, setSeriesFilter, setSeriesView, setSeriesPosterSize } from 'Store/Actions/seriesIndexActions';
import { executeCommand } from 'Store/Actions/commandActions';
import * as commandNames from 'Commands/commandNames';
import SeriesIndex from './SeriesIndex';

function createMapStateToProps() {
  return createSelector(
    (state) => state.series,
    (state) => state.seriesIndex,
    createCommandsSelector(),
    createScrollPositionSelector('seriesIndex', `${window.Sonarr.urlBase}/`),
    (series, seriesIndex, commands, scrollTop) => {
      const isRefreshingSeries = _.some(commands, { name: commandNames.REFRESH_SERIES });
      const isRssSyncExecuting = _.some(commands, { name: commandNames.RSS_SYNC });

      return {
        scrollTop,
        isRefreshingSeries,
        isRssSyncExecuting,
        ...series,
        ...seriesIndex
      };
    }
  );
}

const mapDispatchToProps = {
  fetchSeries,
  setSeriesSort,
  setSeriesFilter,
  setSeriesView,
  setSeriesPosterSize,
  executeCommand
};

class SeriesIndexConnector extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      scrollTop: props.scrollTop
    };
  }

  componentWillMount() {
    this.props.fetchSeries();
  }

  //
  // Listeners

  onSortSelect = (sortKey) => {
    this.props.setSeriesSort({ sortKey });
  }

  onFilterSelect = (filterKey, filterValue, filterType) => {
    this.props.setSeriesFilter({ filterKey, filterValue, filterType });
  }

  onViewSelect = (view) => {
    this.props.setSeriesView({ view });
  }

  onPosterSizeSelect = (posterSize) => {
    this.props.setSeriesPosterSize({ posterSize });
  }

  onScroll = ({ scrollTop }) => {
    this.setState({
      scrollTop
    }, () => {
      scrollPositions.seriesIndex = scrollTop;
    });
  }

  onRefreshSeriesPress = () => {
    this.props.executeCommand({
      name: commandNames.REFRESH_SERIES
    });
  }

  onRssSyncPress = () => {
    this.props.executeCommand({
      name: commandNames.RSS_SYNC
    });
  }

  //
  // Render

  render() {
    return (
      <SeriesIndex
        {...this.props}
        scrollTop={this.state.scrollTop}
        onSortSelect={this.onSortSelect}
        onFilterSelect={this.onFilterSelect}
        onViewSelect={this.onViewSelect}
        onPosterSizeSelect={this.onPosterSizeSelect}
        onScroll={this.onScroll}
        onRefreshSeriesPress={this.onRefreshSeriesPress}
        onRssSyncPress={this.onRssSyncPress}
      />
    );
  }
}

SeriesIndexConnector.propTypes = {
  scrollTop: PropTypes.number.isRequired,
  fetchSeries: PropTypes.func.isRequired,
  setSeriesSort: PropTypes.func.isRequired,
  setSeriesFilter: PropTypes.func.isRequired,
  setSeriesView: PropTypes.func.isRequired,
  setSeriesPosterSize: PropTypes.func.isRequired,
  executeCommand: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(SeriesIndexConnector);
