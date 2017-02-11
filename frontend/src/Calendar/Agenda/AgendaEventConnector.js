import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createQueueItemSelector from 'Store/Selectors/createQueueItemSelector';
import createUISettingsSelector from 'Store/Selectors/createUISettingsSelector';
import AgendaEvent from './AgendaEvent';

function createMapStateToProps() {
  return createSelector(
    createQueueItemSelector(),
    createUISettingsSelector(),
    (queueItem, uiSettings) => {
      return {
        queueItem,
        timeFormat: uiSettings.timeFormat,
        longDateFormat: uiSettings.longDateFormat
      };
    }
  );
}

export default connect(createMapStateToProps)(AgendaEvent);
