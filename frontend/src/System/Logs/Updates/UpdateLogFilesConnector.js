import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createCommandsSelector from 'Store/Selectors/createCommandsSelector';
import { executeCommand } from 'Store/Actions/commandActions';
import { fetchUpdateLogFiles } from 'Store/Actions/systemActions';
import * as commandNames from 'Commands/commandNames';
import LogFiles from '../Files/LogFiles';

function createMapStateToProps() {
  return createSelector(
    (state) => state.system.updateLogFiles,
    createCommandsSelector(),
    (updateLogFiles, commands) => {
      const {
        isFetching,
        items
      } = updateLogFiles;

      const deleteFilesExecuting = _.some(commands, { name: commandNames.DELETE_UPDATE_LOG_FILES });

      return {
        isFetching,
        items,
        deleteFilesExecuting,
        currentLogView: 'Update Log Files'
      };
    }
  );
}

const mapDispatchToProps = {
  fetchUpdateLogFiles,
  executeCommand
};

class UpdateLogFilesConnector extends Component {

  //
  // Lifecycle

  componentWillMount() {
    this.props.fetchUpdateLogFiles();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.deleteFilesExecuting && this.props.deleteFilesExecuting) {
      this.props.fetchUpdateLogFiles();
    }
  }

  //
  // Listeners

  onRefreshPress = () => {
    this.props.fetchUpdateLogFiles();
  }

  onDeleteFilesPress = () => {
    this.props.executeCommand({ name: commandNames.DELETE_UPDATE_LOG_FILES });
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

UpdateLogFilesConnector.propTypes = {
  deleteFilesExecuting: PropTypes.bool.isRequired,
  fetchUpdateLogFiles: PropTypes.func.isRequired,
  executeCommand: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(UpdateLogFilesConnector);
