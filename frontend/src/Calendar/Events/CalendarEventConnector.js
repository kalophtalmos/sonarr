import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createQueueItemSelector from 'Store/Selectors/createQueueItemSelector';
import createUISettingsSelector from 'Store/Selectors/createUISettingsSelector';
import CalendarEvent from './CalendarEvent';

function createMapStateToProps() {
  return createSelector(
    createQueueItemSelector(),
    createUISettingsSelector(),
    (queueItem, uiSettings) => {
      return {
        queueItem,
        timeFormat: uiSettings.timeFormat,
        colorImpairedMode: uiSettings.enableColorImpairedMode
      };
    }
  );
}

export default connect(createMapStateToProps)(CalendarEvent);
