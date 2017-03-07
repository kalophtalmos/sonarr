import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import hasDifferentItems from 'Utilities/Object/hasDifferentItems';
import selectUniqueIds from 'Utilities/Object/selectUniqueIds';
import createCommandsSelector from 'Store/Selectors/createCommandsSelector';
import * as wantedActions from 'Store/Actions/wantedActions';
import { executeCommand } from 'Store/Actions/commandActions';
import { fetchQueueDetails, clearQueueDetails } from 'Store/Actions/queueActions';
import * as commandNames from 'Commands/commandNames';
import Missing from './Missing';

function createMapStateToProps() {
  return createSelector(
    (state) => state.wanted.missing,
    createCommandsSelector(),
    (missing, commands) => {
      const isScanningDroneFactory = _.some(commands, { name: commandNames.DOWNLOADED_EPSIODES_SCAN });
      const isSearchingForEpisodes = _.some(commands, { name: commandNames.EPISODE_SEARCH });
      const isSearchingForMissingEpisodes = _.some(commands, { name: commandNames.MISSING_EPISODE_SEARCH });

      return {
        isScanningDroneFactory,
        isSearchingForEpisodes,
        isSearchingForMissingEpisodes,
        isSaving: _.some(missing.items, { isSaving: true }),
        ...missing
      };
    }
  );
}

const mapDispatchToProps = {
  ...wantedActions,
  executeCommand,
  fetchQueueDetails,
  clearQueueDetails
};

class MissingConnector extends Component {

  //
  // Lifecycle

  componentWillMount() {
    this.props.fetchMissing();
  }

  componentWillReceiveProps(nextProps) {
    if (hasDifferentItems(nextProps.items, this.props.items)) {
      const episodeIds = selectUniqueIds(nextProps.items, 'id');
      this.props.fetchQueueDetails({ episodeIds });
    }
  }

  componentWillUnmount() {
    this.props.clearMissing();
    this.props.clearQueueDetails();
  }

  //
  // Listeners

  onFirstPagePress = () => {
    this.props.gotoMissingFirstPage();
  }

  onPreviousPagePress = () => {
    this.props.gotoMissingPreviousPage();
  }

  onNextPagePress = () => {
    this.props.gotoMissingNextPage();
  }

  onLastPagePress = () => {
    this.props.gotoMissingLastPage();
  }

  onPageSelect = (page) => {
    this.props.gotoMissingPage({ page });
  }

  onSortPress = (sortKey) => {
    this.props.setMissingSort({ sortKey });
  }

  onFilterSelect = (filterKey, filterValue) => {
    this.props.setMissingFilter({ filterKey, filterValue });
  }

  onTableOptionChange = (payload) => {
    this.props.setMissingTableOption(payload);

    if (payload.pageSize) {
      this.props.gotoMissingFirstPage();
    }
  }

  onSearchSelectedPress = (selected) => {
    this.props.executeCommand({
      name: commandNames.EPISODE_SEARCH,
      episodeIds: selected
    });
  }

  onToggleSelectedPress = (selected) => {
    const {
      filterKey,
      filterValue
    } = this.props;

    this.props.batchToggleMissingEpisodes({
      episodeIds: selected,
      monitored: filterKey !== 'monitored' || !filterValue
    });
  }

  onSearchAllMissingPress = () => {
    this.props.executeCommand({
      name: commandNames.MISSING_EPISODE_SEARCH
    });
  }

  onRescanDroneFactoryPress = () => {
    this.props.executeCommand({
      name: commandNames.DOWNLOADED_EPSIODES_SCAN
    });
  }

  //
  // Render

  render() {
    return (
      <Missing
        onFirstPagePress={this.onFirstPagePress}
        onPreviousPagePress={this.onPreviousPagePress}
        onNextPagePress={this.onNextPagePress}
        onLastPagePress={this.onLastPagePress}
        onPageSelect={this.onPageSelect}
        onSortPress={this.onSortPress}
        onFilterSelect={this.onFilterSelect}
        onTableOptionChange={this.onTableOptionChange}
        onSearchSelectedPress={this.onSearchSelectedPress}
        onToggleSelectedPress={this.onToggleSelectedPress}
        onSearchAllMissingPress={this.onSearchAllMissingPress}
        onRescanDroneFactoryPress={this.onRescanDroneFactoryPress}
        {...this.props}
      />
    );
  }
}

MissingConnector.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  filterKey: PropTypes.string.isRequired,
  filterValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
  fetchMissing: PropTypes.func.isRequired,
  gotoMissingFirstPage: PropTypes.func.isRequired,
  gotoMissingPreviousPage: PropTypes.func.isRequired,
  gotoMissingNextPage: PropTypes.func.isRequired,
  gotoMissingLastPage: PropTypes.func.isRequired,
  gotoMissingPage: PropTypes.func.isRequired,
  setMissingSort: PropTypes.func.isRequired,
  setMissingFilter: PropTypes.func.isRequired,
  setMissingTableOption: PropTypes.func.isRequired,
  clearMissing: PropTypes.func.isRequired,
  batchToggleMissingEpisodes: PropTypes.func.isRequired,
  executeCommand: PropTypes.func.isRequired,
  fetchQueueDetails: PropTypes.func.isRequired,
  clearQueueDetails: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(MissingConnector);
