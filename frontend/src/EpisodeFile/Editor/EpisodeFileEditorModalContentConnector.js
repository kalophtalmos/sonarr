import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createSeriesSelector from 'Store/Selectors/createSeriesSelector';
import { deleteEpisodeFiles, updateEpisodeFiles } from 'Store/Actions/episodeFileActions';
import { fetchQualityProfileSchema } from 'Store/Actions/settingsActions';
import EpisodeFileEditorModalContent from './EpisodeFileEditorModalContent';

function createMapStateToProps() {
  return createSelector(
    (state, { seasonNumber }) => seasonNumber,
    (state) => state.episodes,
    (state) => state.episodeFiles,
    (state) => state.settings.qualityProfiles.schema,
    createSeriesSelector(),
    (seasonNumber, episodes, episodeFiles, qualityProfileSchema, series) => {
      const filtered = _.filter(episodes.items, (episode) => {
        if (seasonNumber >= 0 && episode.seasonNumber !== seasonNumber) {
          return false;
        }

        if (!episode.episodeFileId) {
          return false;
        }

        return _.some(episodeFiles.items, { id: episode.episodeFileId });
      });

      const sorted = _.orderBy(filtered, ['seasonNumber', 'episodeNumber'], ['desc', 'desc']);

      const items = _.map(sorted, (episode) => {
        const episodeFile = _.find(episodeFiles.items, { id: episode.episodeFileId });

        return {
          relativePath: episodeFile.relativePath,
          quality: episodeFile.quality,
          ...episode
        };
      });

      const qualities = _.map(qualityProfileSchema.items, 'quality');

      return {
        items,
        seriesType: series.seriesType,
        isDeleting: episodeFiles.isDeleting,
        isSaving: episodeFiles.isSaving,
        qualities
      };
    }
  );
}

const mapDispatchToProps = {
  deleteEpisodeFiles,
  updateEpisodeFiles,
  fetchQualityProfileSchema
};

class EpisodeFileEditorModalContentConnector extends Component {

  //
  // Lifecycle

  componentWillMount() {
    this.props.fetchQualityProfileSchema();
  }

  //
  // Listeners

  onDeletePress = (episodeFileIds) => {
    this.props.deleteEpisodeFiles({ episodeFileIds });
  }

  onQualityChange = (episodeFileIds, qualityId) => {
    const quality = {
      quality: _.find(this.props.qualities, { id: qualityId }),
      revision: {
        version: 1,
        real: 0
      }
    };

    this.props.updateEpisodeFiles({ episodeFileIds, quality });
  }

  //
  // Render

  render() {
    return (
      <EpisodeFileEditorModalContent
        {...this.props}
        onDeletePress={this.onDeletePress}
        onQualityChange={this.onQualityChange}
      />
    );
  }
}

EpisodeFileEditorModalContentConnector.propTypes = {
  seriesId: PropTypes.number.isRequired,
  seasonNumber: PropTypes.number,
  qualities: PropTypes.arrayOf(PropTypes.object).isRequired,
  deleteEpisodeFiles: PropTypes.func.isRequired,
  updateEpisodeFiles: PropTypes.func.isRequired,
  fetchQualityProfileSchema: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(EpisodeFileEditorModalContentConnector);
