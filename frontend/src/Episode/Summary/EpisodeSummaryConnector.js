import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createEpisodeSelector from 'Store/Selectors/createEpisodeSelector';
import createEpisodeFileSelector from 'Store/Selectors/createEpisodeFileSelector';
import createSeriesSelector from 'Store/Selectors/createSeriesSelector';
import EpisodeSummary from './EpisodeSummary';

function createMapStateToProps() {
  return createSelector(
    createSeriesSelector(),
    createEpisodeSelector(),
    createEpisodeFileSelector(),
    (series, episode, episodeFile) => {
      const {
        qualityProfileId,
        network
      } = series;

      const {
        airDateUtc,
        overview
      } = episode;

      const {
        path,
        size,
        quality,
        qualityCutoffNotMet
      } = episodeFile || {};

      return {
        network,
        qualityProfileId,
        airDateUtc,
        overview,
        path,
        size,
        quality,
        qualityCutoffNotMet
      };
    }
  );
}

class EpisodeSummaryConnector extends Component {

  //
  // Listeners

  onDeleteEpisodeFilePress = () => {
    // TODO: Remove episode file
  }

  //
  // Render

  render() {
    return (
      <EpisodeSummary
        {...this.props}
        onDeleteEpisodeFilePress={this.onDeleteEpisodeFilePress}
      />
    );
  }
}

EpisodeSummaryConnector.propTypes = {
  episodeId: PropTypes.number.isRequired,
  episodeFileId: PropTypes.number,
  seriesId: PropTypes.number.isRequired
};

export default connect(createMapStateToProps)(EpisodeSummaryConnector);
