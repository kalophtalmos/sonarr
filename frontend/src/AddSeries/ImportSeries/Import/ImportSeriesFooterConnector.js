import _ from 'lodash';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import ImportSeriesFooter from './ImportSeriesFooter';

function createMapStateToProps() {
  return createSelector(
    (state) => state.addSeries,
    (state) => state.importSeries,
    (addSeries, importSeries) => {
      return {
        isImporting: importSeries.isImporting,
        isLookingUpSeries: _.some(importSeries.items, { isFetching: true }),
        defaultMonitor: addSeries.defaults.monitor,
        defaultQualityProfileId: addSeries.defaults.qualityProfileId,
        defaultSeriesType: addSeries.defaults.seriesType,
        defaultSeasonFolder: addSeries.defaults.seasonFolder
      };
    }
  );
}

export default connect(createMapStateToProps)(ImportSeriesFooter);
