import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createCommandsSelector from 'Store/Selectors/createCommandsSelector';
import { fetchBackups } from 'Store/Actions/systemActions';
import { executeCommand } from 'Store/Actions/commandActions';
import * as commandNames from 'Commands/commandNames';
import Backups from './Backups';

function createMapStateToProps() {
  return createSelector(
    (state) => state.system.backups,
    createCommandsSelector(),
    (backups, commands) => {
      const {
        isFetching,
        items
      } = backups;

      const backupExecuting = _.some(commands, { name: commandNames.BACKUP });

      return {
        isFetching,
        items,
        backupExecuting
      };
    }
  );
}

const mapDispatchToProps = {
  fetchBackups,
  executeCommand
};

class BackupsConnector extends Component {

  //
  // Lifecycle

  componentWillMount() {
    this.props.fetchBackups();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.backupExecuting && this.props.backupExecuting) {
      this.props.fetchBackups();
    }
  }

  //
  // Listeners

  onBackupPress = () => {
    this.props.executeCommand({
      name: commandNames.BACKUP,
      type: 'manual'
    });
  }

  //
  // Render

  render() {
    return (
      <Backups
        onBackupPress={this.onBackupPress}
        {...this.props}
      />
    );
  }
}

BackupsConnector.propTypes = {
  backupExecuting: PropTypes.bool.isRequired,
  fetchBackups: PropTypes.func.isRequired,
  executeCommand: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(BackupsConnector);
