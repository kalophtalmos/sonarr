import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createCommandsSelector from 'Store/Selectors/createCommandsSelector';
import { executeCommand } from 'Store/Actions/commandActions';
import { fetchLogFiles } from 'Store/Actions/systemActions';
import * as commandNames from 'Commands/commandNames';
import LogFiles from './LogFiles';

function createMapStateToProps() {
  return createSelector(
    (state) => state.system.logFiles,
    createCommandsSelector(),
    (logFiles, commands) => {
      const {
        isFetching,
        items
      } = logFiles;

      const deleteFilesExecuting = _.some(commands, { name: commandNames.DELETE_LOG_FILES });

      return {
        isFetching,
        items,
        deleteFilesExecuting,
        currentLogView: 'Log Files'
      };
    }
  );
}

const mapDispatchToProps = {
  fetchLogFiles,
  executeCommand
};

class LogFilesConnector extends Component {

  //
  // Lifecycle

  componentWillMount() {
    this.props.fetchLogFiles();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.deleteFilesExecuting && this.props.deleteFilesExecuting) {
      this.props.fetchLogFiles();
    }
  }

  //
  // Listeners

  onRefreshPress = () => {
    this.props.fetchLogFiles();
  }

  onDeleteFilesPress = () => {
    this.props.executeCommand({ name: commandNames.DELETE_LOG_FILES });
  }

  //
  // Render

  render() {
    return (
      <LogFiles
        onRefreshPress={this.onRefreshPress}
        onDeleteFilesPress={this.onDeleteFilesPress}
        {...this.props}
      />
    );
  }
}

LogFilesConnector.propTypes = {
  deleteFilesExecuting: PropTypes.bool.isRequired,
  fetchLogFiles: PropTypes.func.isRequired,
  executeCommand: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(LogFilesConnector);
