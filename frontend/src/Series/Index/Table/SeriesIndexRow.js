import React, { Component, PropTypes } from 'react';
import getProgressBarKind from 'Utilities/Series/getProgressBarKind';
import formatBytes from 'Utilities/Number/formatBytes';
import { icons } from 'Helpers/Props';
import IconButton from 'Components/Link/IconButton';
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';
import ProgressBar from 'Components/ProgressBar';
import TagListConnector from 'Components/TagListConnector';
import VirtualTableRow from 'Components/Table/VirtualTableRow';
import VirtualTableRowCell from 'Components/Table/Cells/VirtualTableRowCell';
import RelativeDateCellConnector from 'Components/Table/Cells/RelativeDateCellConnector';
import SeriesTitleLink from 'Series/SeriesTitleLink';
import EditSeriesModalConnector from 'Series/Edit/EditSeriesModalConnector';
import DeleteSeriesModal from 'Series/Delete/DeleteSeriesModal';
import SeriesStatusCell from './SeriesStatusCell';
import styles from './SeriesIndexRow.css';

class SeriesIndexRow extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isEditSeriesModalOpen: false,
      isDeleteSeriesModalOpen: false
    };
  }

  onEditSeriesPress = () => {
    this.setState({ isEditSeriesModalOpen: true });
  }

  onEditSeriesModalClose = () => {
    this.setState({ isEditSeriesModalOpen: false });
  }

  onDeleteSeriesPress = () => {
    this.setState({
      isEditSeriesModalOpen: false,
      isDeleteSeriesModalOpen: true
    });
  }

  onDeleteSeriesModalClose = () => {
    this.setState({ isDeleteSeriesModalOpen: false });
  }

  //
  // Render

  render() {
    const {
      style,
      id,
      monitored,
      status,
      title,
      titleSlug,
      network,
      qualityProfile,
      nextAiring,
      previousAiring,
      added,
      seasonCount,
      episodeCount,
      episodeFileCount,
      path,
      sizeOnDisk,
      tags,
      columns,
      isRefreshingSeries,
      onRefreshSeriesPress
    } = this.props;

    const {
      isEditSeriesModalOpen,
      isDeleteSeriesModalOpen
    } = this.state;

    const progress = episodeCount ? episodeFileCount / episodeCount * 100 : 100;

    return (
      <VirtualTableRow style={style}>

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
                <SeriesStatusCell
                  key={name}
                  className={styles[name]}
                  monitored={monitored}
                  status={status}
                  component={VirtualTableRowCell}
                />
              );
            }

            if (name === 'sortTitle') {
              return (
                <VirtualTableRowCell
                  key={name}
                  className={styles[name]}
                >
                  <SeriesTitleLink
                    titleSlug={titleSlug}
                    title={title}
                  />
                </VirtualTableRowCell>
              );
            }

            if (name === 'network') {
              return (
                <VirtualTableRowCell
                  key={name}
                  className={styles[name]}
                >
                  {network}
                </VirtualTableRowCell>
              );
            }

            if (name === 'qualityProfileId') {
              return (
                <VirtualTableRowCell
                  key={name}
                  className={styles[name]}
                >
                  {qualityProfile.name}
                </VirtualTableRowCell>
              );
            }

            if (name === 'nextAiring') {
              return (
                <RelativeDateCellConnector
                  key={name}
                  className={styles[name]}
                  date={nextAiring}
                  component={VirtualTableRowCell}
                />
              );
            }

            if (name === 'previousAiring') {
              return (
                <RelativeDateCellConnector
                  key={name}
                  className={styles[name]}
                  date={previousAiring}
                  component={VirtualTableRowCell}
                />
              );
            }

            if (name === 'added') {
              return (
                <RelativeDateCellConnector
                  key={name}
                  className={styles[name]}
                  date={added}
                  component={VirtualTableRowCell}
                />
              );
            }

            if (name === 'seasonCount') {
              return (
                <VirtualTableRowCell
                  key={name}
                  className={styles[name]}
                >
                  {seasonCount}
                </VirtualTableRowCell>
              );
            }

            if (name === 'episodeProgress') {
              return (
                <VirtualTableRowCell
                  key={name}
                  className={styles[name]}
                >
                  <ProgressBar
                    progress={progress}
                    kind={getProgressBarKind(status, monitored, progress)}
                    showText={true}
                    text={`${episodeFileCount} / ${episodeCount}`}
                    width={125}
                  />
                </VirtualTableRowCell>
              );
            }

            if (name === 'path') {
              return (
                <VirtualTableRowCell
                  key={name}
                  className={styles[name]}
                >
                  {path}
                </VirtualTableRowCell>
              );
            }

            if (name === 'sizeOnDisk') {
              return (
                <VirtualTableRowCell
                  key={name}
                  className={styles[name]}
                >
                  {formatBytes(sizeOnDisk)}
                </VirtualTableRowCell>
              );
            }

            if (name === 'tags') {
              return (
                <VirtualTableRowCell
                  key={name}
                  className={styles[name]}
                >
                  <TagListConnector
                    tags={tags}
                  />
                </VirtualTableRowCell>
              );
            }

            if (name === 'actions') {
              return (
                <VirtualTableRowCell
                  key={name}
                  className={styles[name]}
                >
                  <SpinnerIconButton
                    name={icons.REFRESH}
                    title="Refresh series"
                    isSpinning={isRefreshingSeries}
                    onPress={onRefreshSeriesPress}
                  />

                  <IconButton
                    name={icons.EDIT}
                    title="Edit Series"
                    onPress={this.onEditSeriesPress}
                  />
                </VirtualTableRowCell>
              );
            }

            return null;
          })
        }

        <EditSeriesModalConnector
          isOpen={isEditSeriesModalOpen}
          seriesId={id}
          onModalClose={this.onEditSeriesModalClose}
          onDeleteSeriesPress={this.onDeleteSeriesPress}
        />

        <DeleteSeriesModal
          isOpen={isDeleteSeriesModalOpen}
          seriesId={id}
          onModalClose={this.onDeleteSeriesModalClose}
        />
      </VirtualTableRow>
    );
  }
}

SeriesIndexRow.propTypes = {
  style: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  monitored: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  titleSlug: PropTypes.string.isRequired,
  network: PropTypes.string.isRequired,
  qualityProfile: PropTypes.object.isRequired,
  nextAiring: PropTypes.string,
  previousAiring: PropTypes.string,
  added: PropTypes.string,
  seasonCount: PropTypes.number.isRequired,
  episodeCount: PropTypes.number,
  episodeFileCount: PropTypes.number,
  path: PropTypes.string.isRequired,
  sizeOnDisk: PropTypes.number,
  tags: PropTypes.arrayOf(PropTypes.number).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  isRefreshingSeries: PropTypes.bool.isRequired,
  onRefreshSeriesPress: PropTypes.func.isRequired
};

SeriesIndexRow.defaultProps = {
  episodeCount: 0,
  episodeFileCount: 0
};

export default SeriesIndexRow;
