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
import { fetchEpisodeFiles, clearEpisodeFiles } from 'Store/Actions/episodeFileActions';
import * as commandNames from 'Commands/commandNames';
import CutoffUnmet from './CutoffUnmet';

function createMapStateToProps() {
  return createSelector(
    (state) => state.wanted.cutoffUnmet,
    createCommandsSelector(),
    (cutoffUnmet, commands) => {
      const isSearchingForEpisodes = _.some(commands, { name: commandNames.EPISODE_SEARCH });
      const isSearchingForCutoffUnmetEpisodes = _.some(commands, { name: commandNames.CUTOFF_UNMET_EPISODE_SEARCH });

      return {
        isSearchingForEpisodes,
        isSearchingForCutoffUnmetEpisodes,
        isSaving: _.some(cutoffUnmet.items, { isSaving: true }),
        ...cutoffUnmet
      };
    }
  );
}

const mapDispatchToProps = {
  ...wantedActions,
  executeCommand,
  fetchQueueDetails,
  clearQueueDetails,
  fetchEpisodeFiles,
  clearEpisodeFiles
};

class CutoffUnmetConnector extends Component {

  //
  // Lifecycle

  componentWillMount() {
    this.props.fetchCutoffUnmet();
  }

  componentWillReceiveProps(nextProps) {
    if (hasDifferentItems(nextProps.items, this.props.items)) {
      const episodeIds = selectUniqueIds(nextProps.items, 'id');
      const episodeFileIds = selectUniqueIds(nextProps.items, 'episodeFileId');

      this.props.fetchQueueDetails({ episodeIds });

      if (episodeFileIds.length) {
        this.props.fetchEpisodeFiles({ episodeFileIds });
      }
    }
  }

  componentWillUnmount() {
    this.props.clearCutoffUnmet();
    this.props.clearQueueDetails();
    this.props.clearEpisodeFiles();
  }

  //
  // Listeners

  onFirstPagePress = () => {
    this.props.gotoCutoffUnmetFirstPage();
  }

  onPreviousPagePress = () => {
    this.props.gotoCutoffUnmetPreviousPage();
  }

  onNextPagePress = () => {
    this.props.gotoCutoffUnmetNextPage();
  }

  onLastPagePress = () => {
    this.props.gotoCutoffUnmetLastPage();
  }

  onPageSelect = (page) => {
    this.props.gotoCutoffUnmetPage({ page });
  }

  onSortPress = (sortKey) => {
    this.props.setCutoffUnmetSort({ sortKey });
  }

  onFilterSelect = (filterKey, filterValue) => {
    this.props.setCutoffUnmetFilter({ filterKey, filterValue });
  }

  onTableOptionChange = (payload) => {
    this.props.setCutoffUnmetTableOption(payload);

    if (payload.pageSize) {
      this.props.gotoCutoffUnmetFirstPage();
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

    this.props.batchToggleCutoffUnmetEpisodes({
      episodeIds: selected,
      monitored: filterKey !== 'monitored' || !filterValue
    });
  }

  onSearchAllCutoffUnmetPress = () => {
    this.props.executeCommand({
      name: commandNames.CUTOFF_UNMET_EPISODE_SEARCH
    });
  }

  //
  // Render

  render() {
    return (
      <CutoffUnmet
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
        onSearchAllCutoffUnmetPress={this.onSearchAllCutoffUnmetPress}
        {...this.props}
      />
    );
  }
}

CutoffUnmetConnector.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  filterKey: PropTypes.string.isRequired,
  filterValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
  fetchCutoffUnmet: PropTypes.func.isRequired,
  gotoCutoffUnmetFirstPage: PropTypes.func.isRequired,
  gotoCutoffUnmetPreviousPage: PropTypes.func.isRequired,
  gotoCutoffUnmetNextPage: PropTypes.func.isRequired,
  gotoCutoffUnmetLastPage: PropTypes.func.isRequired,
  gotoCutoffUnmetPage: PropTypes.func.isRequired,
  setCutoffUnmetSort: PropTypes.func.isRequired,
  setCutoffUnmetFilter: PropTypes.func.isRequired,
  setCutoffUnmetTableOption: PropTypes.func.isRequired,
  batchToggleCutoffUnmetEpisodes: PropTypes.func.isRequired,
  clearCutoffUnmet: PropTypes.func.isRequired,
  executeCommand: PropTypes.func.isRequired,
  fetchQueueDetails: PropTypes.func.isRequired,
  clearQueueDetails: PropTypes.func.isRequired,
  fetchEpisodeFiles: PropTypes.func.isRequired,
  clearEpisodeFiles: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(CutoffUnmetConnector);
