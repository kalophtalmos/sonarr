import _ from 'lodash';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createSeriesSelector from 'Store/Selectors/createSeriesSelector';
import createEpisodeFileSelector from 'Store/Selectors/createEpisodeFileSelector';
import createCommandsSelector from 'Store/Selectors/createCommandsSelector';
import EpisodeRow from './EpisodeRow';

function createMapStateToProps() {
  return createSelector(
    (state, { id }) => id,
    (state, { sceneSeasonNumber }) => sceneSeasonNumber,
    createSeriesSelector(),
    createEpisodeFileSelector(),
    createCommandsSelector(),
    (id, sceneSeasonNumber, series, episodeFile, commands) => {
      const alternateTitles = sceneSeasonNumber ? _.filter(series.alternateTitles, { sceneSeasonNumber }) : [];

      return {
        seriesMonitored: series.monitored,
        seriesType: series.seriesType,
        episodeFilePath: episodeFile ? episodeFile.path : null,
        episodeFileRelativePath: episodeFile ? episodeFile.relativePath : null,
        alternateTitles
      };
    }
  );
}
export default connect(createMapStateToProps)(EpisodeRow);
