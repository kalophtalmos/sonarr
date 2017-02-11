import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { findCommand } from 'Utilities/Command';
import { executeCommand } from 'Store/Actions/commandActions';
import createCommandsSelector from 'Store/Selectors/createCommandsSelector';
import createUISettingsSelector from 'Store/Selectors/createUISettingsSelector';
import TaskRow from './TaskRow';

function createMapStateToProps() {
  return createSelector(
    (state, { taskName }) => taskName,
    createCommandsSelector(),
    createUISettingsSelector(),
    (taskName, commands, uiSettings) => {
      const isExecuting = !!findCommand(commands, { name: taskName });

      return {
        isExecuting,
        showRelativeDates: uiSettings.showRelativeDates,
        shortDateFormat: uiSettings.shortDateFormat,
        longDateFormat: uiSettings.longDateFormat,
        timeFormat: uiSettings.timeFormat
      };
    }
  );
}

function createMapDispatchToProps(dispatch, props) {
  const taskName = props.taskName;

  return {
    onExecutePress() {
      dispatch(executeCommand({
        name: taskName
      }));
    }
  };
}

export default connect(createMapStateToProps, createMapDispatchToProps)(TaskRow);
