import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import hasDifferentItems from 'Utilities/Object/hasDifferentItems';
import selectUniqueIds from 'Utilities/Object/selectUniqueIds';
import * as historyActions from 'Store/Actions/historyActions';
import { fetchEpisodes, clearEpisodes } from 'Store/Actions/episodeActions';
import History from './History';

function createMapStateToProps() {
  return createSelector(
    (state) => state.history,
    (state) => state.episodes,
    (history, episodes) => {
      return {
        episodesFetching: episodes.isFetching,
        episodesPopulated: episodes.isPopulated,
        episodesError: episodes.error,
        ...history
      };
    }
  );
}

const mapDispatchToProps = {
  ...historyActions,
  fetchEpisodes,
  clearEpisodes
};

class HistoryConnector extends Component {

  //
  // Lifecycle

  componentWillMount() {
    this.props.fetchHistory();
  }

  componentWillReceiveProps(nextProps) {
    if (hasDifferentItems(nextProps.items, this.props.items)) {
      const episodeIds = selectUniqueIds(nextProps.items, 'episodeId');
      this.props.fetchEpisodes({ episodeIds });
    }
  }

  componentWillUnmount() {
    this.props.clearHistory();
    this.props.clearEpisodes();
  }

  //
  // Listeners

  onFirstPagePress = () => {
    this.props.gotoHistoryFirstPage();
  }

  onPreviousPagePress = () => {
    this.props.gotoHistoryPreviousPage();
  }

  onNextPagePress = () => {
    this.props.gotoHistoryNextPage();
  }

  onLastPagePress = () => {
    this.props.gotoHistoryLastPage();
  }

  onPageSelect = (page) => {
    this.props.gotoHistoryPage({ page });
  }

  onSortPress = (sortKey) => {
    this.props.setHistorySort({ sortKey });
  }

  onFilterSelect = (filterKey, filterValue) => {
    this.props.setHistoryFilter({ filterKey, filterValue });
  }

  onTableOptionChange = (payload) => {
    this.props.setHistoryTableOption(payload);

    if (payload.pageSize) {
      this.props.gotoHistoryFirstPage();
    }
  }

  //
  // Render

  render() {
    return (
      <History
        onFirstPagePress={this.onFirstPagePress}
        onPreviousPagePress={this.onPreviousPagePress}
        onNextPagePress={this.onNextPagePress}
        onLastPagePress={this.onLastPagePress}
        onPageSelect={this.onPageSelect}
        onSortPress={this.onSortPress}
        onFilterSelect={this.onFilterSelect}
        onTableOptionChange={this.onTableOptionChange}
        {...this.props}
      />
    );
  }
}

HistoryConnector.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchHistory: PropTypes.func.isRequired,
  gotoHistoryFirstPage: PropTypes.func.isRequired,
  gotoHistoryPreviousPage: PropTypes.func.isRequired,
  gotoHistoryNextPage: PropTypes.func.isRequired,
  gotoHistoryLastPage: PropTypes.func.isRequired,
  gotoHistoryPage: PropTypes.func.isRequired,
  setHistorySort: PropTypes.func.isRequired,
  setHistoryFilter: PropTypes.func.isRequired,
  setHistoryTableOption: PropTypes.func.isRequired,
  clearHistory: PropTypes.func.isRequired,
  fetchEpisodes: PropTypes.func.isRequired,
  clearEpisodes: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(HistoryConnector);
