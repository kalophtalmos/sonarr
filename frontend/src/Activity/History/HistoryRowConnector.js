import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { fetchHistory, markAsFailed } from 'Store/Actions/historyActions';
import createEpisodeSelector from 'Store/Selectors/createEpisodeSelector';
import createUISettingsSelector from 'Store/Selectors/createUISettingsSelector';
import HistoryRow from './HistoryRow';

function createMapStateToProps() {
  return createSelector(
    createEpisodeSelector(),
    createUISettingsSelector(),
    (episode, uiSettings) => {
      return {
        episode,
        shortDateFormat: uiSettings.shortDateFormat,
        timeFormat: uiSettings.timeFormat
      };
    }
  );
}

const mapDispatchToProps = {
  fetchHistory,
  markAsFailed
};

class HistoryRowConnector extends Component {

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isMarkingAsFailed &&
        this.props.isMarkingAsFailed &&
        !nextProps.markAsFailedError
    ) {
      this.props.fetchHistory();
    }
  }

  //
  // Listeners

  onMarkAsFailedPress = () => {
    this.props.markAsFailed({ id: this.props.id });
  }

  //
  // Render

  render() {
    return (
      <HistoryRow
        {...this.props}
        onMarkAsFailedPress={this.onMarkAsFailedPress}
      />
    );
  }
}

HistoryRowConnector.propTypes = {
  id: PropTypes.number.isRequired,
  isMarkingAsFailed: PropTypes.bool,
  fetchHistory: PropTypes.func.isRequired,
  markAsFailed: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(HistoryRowConnector);
