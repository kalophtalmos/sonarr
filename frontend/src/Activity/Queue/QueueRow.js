import React, { Component, PropTypes } from 'react';
import { icons } from 'Helpers/Props';
import IconButton from 'Components/Link/IconButton';
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';
import ProgressBar from 'Components/ProgressBar';
import TableRow from 'Components/Table/TableRow';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import ProtocolLabel from 'Activity/Queue/ProtocolLabel';
import EpisodeTitleLink from 'Episode/EpisodeTitleLink';
import EpisodeQuality from 'Episode/EpisodeQuality';
import SeasonEpisodeNumber from 'Episode/SeasonEpisodeNumber';
import ManualImportModal from 'ManualImport/ManualImportModal';
import SeriesTitleLink from 'Series/SeriesTitleLink';
import QueueStatusCell from './QueueStatusCell';
import TimeleftCell from './TimeleftCell';
import RemoveQueueItemModal from './RemoveQueueItemModal';
import styles from './QueueRow.css';

class QueueRow extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isRemoveQueueItemModalOpen: false,
      isManualImportModalOpen: false
    };
  }

  //
  // Listeners

  onRemoveQueueItemPress = () => {
    this.setState({ isRemoveQueueItemModalOpen: true });
  }

  onRemoveQueueItemModalConfirmed = (blacklist) => {
    this.props.onRemoveQueueItemPress(blacklist);
    this.setState({ isRemoveQueueItemModalOpen: false });
  }

  onRemoveQueueItemModalClose = () => {
    this.setState({ isRemoveQueueItemModalOpen: false });
  }

  onManualImportPress = () => {
    this.setState({ isManualImportModalOpen: true });
  }

  onManualImportModalClose = () => {
    this.setState({ isManualImportModalOpen: false });
  }

  //
  // Render

  render() {
    const {
      downloadId,
      episodeEntity,
      title,
      status,
      trackedDownloadStatus,
      statusMessages,
      series,
      episode,
      quality,
      protocol,
      estimatedCompletionTime,
      timeleft,
      size,
      sizeleft,
      showRelativeDates,
      shortDateFormat,
      timeFormat,
      isGrabbing,
      isRemoving,
      columns,
      onGrabPress
    } = this.props;

    const {
      isRemoveQueueItemModalOpen,
      isManualImportModalOpen
    } = this.state;

    const progress = 100 - (sizeleft / size * 100);
    const showManualImport = status === 'Completed' && trackedDownloadStatus === 'Warning';
    const isPending = status === 'Pending';

    return (
      <TableRow>
        {
          columns.map((column) => {
            const {
              name,
              isVisible
            } = column;

            if (!isVisible) {
              return null;
            }

            if (name === 'status') {
              return (
                <QueueStatusCell
                  key={name}
                  sourceTitle={title}
                  status={status.toLowerCase()}
                  trackedDownloadStatus={trackedDownloadStatus && trackedDownloadStatus.toLowerCase()}
                  statusMessages={statusMessages}
                />
              );
            }

            if (name === 'series.sortTitle') {
              return (
                <TableRowCell key={name}>
                  <SeriesTitleLink
                    titleSlug={series.titleSlug}
                    title={series.title}
                  />
                </TableRowCell>
              );
            }

            if (name === 'series') {
              return (
                <TableRowCell key={name}>
                  <SeriesTitleLink
                    titleSlug={series.titleSlug}
                    title={series.title}
                  />
                </TableRowCell>
              );
            }

            if (name === 'episode') {
              return (
                <TableRowCell key={name}>
                  <SeasonEpisodeNumber
                    seasonNumber={episode.seasonNumber}
                    episodeNumber={episode.episodeNumber}
                    absoluteEpisodeNumber={episode.absoluteEpisodeNumber}
                    seriesType={series.seriesType}
                    sceneSeasonNumber={episode.sceneSeasonNumber}
                    sceneEpisodeNumber={episode.sceneEpisodeNumber}
                    sceneAbsoluteEpisodeNumber={episode.sceneAbsoluteEpisodeNumber}
                  />
                </TableRowCell>
              );
            }

            if (name === 'episodeTitle') {
              return (
                <TableRowCell key={name}>
                  <EpisodeTitleLink
                    episodeId={episode.id}
                    seriesId={series.id}
                    episodeFileId={episode.episodeFileId}
                    episodeEntity={episodeEntity}
                    episodeTitle={episode.title}
                    showOpenSeriesButton={true}
                  />
                </TableRowCell>
              );
            }

            if (name === 'quality') {
              return (
                <TableRowCell key={name}>
                  <EpisodeQuality
                    quality={quality}
                  />
                </TableRowCell>
              );
            }

            if (name === 'protocol') {
              return (
                <TableRowCell key={name}>
                  <ProtocolLabel
                    protocol={protocol}
                  />
                </TableRowCell>
              );
            }

            if (name === 'estimatedCompletionTime') {
              return (
                <TimeleftCell
                  key={name}
                  status={status.toLowerCase()}
                  estimatedCompletionTime={estimatedCompletionTime}
                  timeleft={timeleft}
                  size={size}
                  sizeleft={sizeleft}
                  showRelativeDates={showRelativeDates}
                  shortDateFormat={shortDateFormat}
                  timeFormat={timeFormat}
                />
              );
            }

            if (name === 'progress') {
              return (
                <TableRowCell
                  key={name}
                  className={styles.progress}
                >
                  {
                    !!progress &&
                      <ProgressBar
                        progress={progress}
                        title={`${progress.toFixed(1)}%`}
                      />
                  }
                </TableRowCell>
              );
            }

            if (name === 'actions') {
              return (
                <TableRowCell
                  key={name}
                  className={styles.actions}
                >
                  {
                    showManualImport &&
                      <IconButton
                        name={icons.INTERACTIVE}
                        onPress={this.onManualImportPress}
                      />
                  }

                  {
                    isPending &&
                      <SpinnerIconButton
                        name={icons.DOWNLOAD}
                        isSpinning={isGrabbing}
                        onPress={onGrabPress}
                      />
                  }

                  <SpinnerIconButton
                    name={icons.REMOVE}
                    isSpinning={isRemoving}
                    onPress={this.onRemoveQueueItemPress}
                  />
                </TableRowCell>
              );
            }
          })
        }

        <ManualImportModal
          isOpen={isManualImportModalOpen}
          downloadId={downloadId}
          title={title}
          onModalClose={this.onManualImportModalClose}
        />

        <RemoveQueueItemModal
          isOpen={isRemoveQueueItemModalOpen}
          sourceTitle={title}
          onRemovePress={this.onRemoveQueueItemModalConfirmed}
          onModalClose={this.onRemoveQueueItemModalClose}
        />
      </TableRow>
    );
  }

}

QueueRow.propTypes = {
  downloadId: PropTypes.string,
  episodeEntity: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  trackedDownloadStatus: PropTypes.string,
  statusMessages: PropTypes.arrayOf(PropTypes.object),
  series: PropTypes.object.isRequired,
  episode: PropTypes.object.isRequired,
  quality: PropTypes.object.isRequired,
  protocol: PropTypes.string.isRequired,
  estimatedCompletionTime: PropTypes.string,
  timeleft: PropTypes.string,
  size: PropTypes.number,
  sizeleft: PropTypes.number,
  showRelativeDates: PropTypes.bool.isRequired,
  shortDateFormat: PropTypes.string.isRequired,
  timeFormat: PropTypes.string.isRequired,
  isGrabbing: PropTypes.bool.isRequired,
  isRemoving: PropTypes.bool.isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  onGrabPress: PropTypes.func.isRequired,
  onRemoveQueueItemPress: PropTypes.func.isRequired
};

QueueRow.defaultProps = {
  isGrabbing: false,
  isRemoving: false
};

export default QueueRow;
