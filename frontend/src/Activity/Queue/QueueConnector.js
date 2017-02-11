import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { executeCommand } from 'Store/Actions/commandActions';
import * as queueActions from 'Store/Actions/queueActions';
import { clearEpisodes } from 'Store/Actions/episodeActions';
import * as commandNames from 'Commands/commandNames';
import Queue from './Queue';

function createMapStateToProps() {
  return createSelector(
    (state) => state.queue.paged,
    (queued, commands) => {
      return queued;
    }
  );
}

const mapDispatchToProps = {
  ...queueActions,
  clearEpisodes,
  executeCommand
};

class QueueConnector extends Component {

  //
  // Lifecycle

  componentWillMount() {
    this.props.gotoQueueFirstPage();
  }

  componentWillReceiveProps(nextProps) {
    if (_.differenceBy(nextProps.items, this.props.items, ({ id }) => id).length) {
      const episodes = _.uniqBy(_.reduce(nextProps.items, (result, item) => {
        result.push(item.episode);

        return result;
      }, []), ({ id }) => id);

      this.props.setQueueEpisodes({ episodes });
    }
  }

  componentWillUnmount() {
    this.props.clearQueue();
    this.props.clearEpisodes();
  }

  //
  // Listeners

  onFirstPagePress = () => {
    this.props.gotoQueueFirstPage();
  }

  onPreviousPagePress = () => {
    this.props.gotoQueuePreviousPage();
  }

  onNextPagePress = () => {
    this.props.gotoQueueNextPage();
  }

  onLastPagePress = () => {
    this.props.gotoQueueLastPage();
  }

  onPageSelect = (page) => {
    this.props.gotoQueuePage({ page });
  }

  onSortPress = (sortKey) => {
    this.props.setQueueSort({ sortKey });
  }

  onTableOptionChange = (payload) => {
    this.props.setQueueTableOption(payload);

    if (payload.pageSize) {
      this.props.gotoQueueFirstPage();
    }
  }

  onRefreshPress = () => {
    this.props.executeCommand({
      name: commandNames.CHECK_FOR_FINISHED_DOWNLOAD
    });
  }

  //
  // Render

  render() {
    return (
      <Queue
        onFirstPagePress={this.onFirstPagePress}
        onPreviousPagePress={this.onPreviousPagePress}
        onNextPagePress={this.onNextPagePress}
        onLastPagePress={this.onLastPagePress}
        onPageSelect={this.onPageSelect}
        onSortPress={this.onSortPress}
        onTableOptionChange={this.onTableOptionChange}
        onRefreshPress={this.onRefreshPress}
        {...this.props}
      />
    );
  }
}

QueueConnector.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchQueue: PropTypes.func.isRequired,
  gotoQueueFirstPage: PropTypes.func.isRequired,
  gotoQueuePreviousPage: PropTypes.func.isRequired,
  gotoQueueNextPage: PropTypes.func.isRequired,
  gotoQueueLastPage: PropTypes.func.isRequired,
  gotoQueuePage: PropTypes.func.isRequired,
  setQueueSort: PropTypes.func.isRequired,
  setQueueTableOption: PropTypes.func.isRequired,
  clearQueue: PropTypes.func.isRequired,
  setQueueEpisodes: PropTypes.func.isRequired,
  clearEpisodes: PropTypes.func.isRequired,
  executeCommand: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(QueueConnector);
