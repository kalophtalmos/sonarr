import React, { Component, PropTypes } from 'react';
import getRelativeDate from 'Utilities/Date/getRelativeDate';
import getProgressBarKind from 'Utilities/Series/getProgressBarKind';
import { icons, kinds } from 'Helpers/Props';
import IconButton from 'Components/Link/IconButton';
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';
import Label from 'Components/Label';
import Link from 'Components/Link/Link';
import ProgressBar from 'Components/ProgressBar';
import SeriesPoster from 'Series/SeriesPoster';
import EditSeriesModalConnector from 'Series/Edit/EditSeriesModalConnector';
import DeleteSeriesModal from 'Series/Delete/DeleteSeriesModal';
import SeriesIndexPosterInfo from './SeriesIndexPosterInfo';
import styles from './SeriesIndexPoster.css';

class SeriesIndexPoster extends Component {

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
      nextAiring,
      episodeCount,
      episodeFileCount,
      images,
      posterWidth,
      posterHeight,
      showRelativeDates,
      shortDateFormat,
      timeFormat,
      isRefreshingSeries,
      onRefreshSeriesPress,
      ...otherProps
    } = this.props;

    const {
      isEditSeriesModalOpen,
      isDeleteSeriesModalOpen
    } = this.state;

    const link = `/series/${titleSlug}`;
    const progress = episodeCount ? episodeFileCount / episodeCount * 100 : 100;

    const elementStyle = {
      width: `${posterWidth}px`,
      height: `${posterHeight}px`
    };

    return (
      <div className={styles.container} style={style}>
        <div className={styles.content}>
          <div className={styles.posterContainer}>
            <Label className={styles.controls}>
              <SpinnerIconButton
                className={styles.action}
                name={icons.REFRESH}
                title="Refresh series"
                isSpinning={isRefreshingSeries}
                onPress={onRefreshSeriesPress}
              />

              <IconButton
                className={styles.action}
                name={icons.EDIT}
                title="Edit Series"
                onPress={this.onEditSeriesPress}
              />
            </Label>

            {
              status === 'ended' &&
                <Label
                  className={styles.ended}
                  kind={kinds.DANGER}
                >
                  Ended
                </Label>
            }

            <div className={styles.title}>
              {title}
            </div>

            <Link
              className={styles.link}
              style={elementStyle}
              to={link}
            >
              <SeriesPoster
                className={styles.poster}
                style={elementStyle}
                images={images}
                size={250}
                lazy={false}
                overflow={true}
              />
            </Link>
          </div>

          <ProgressBar
            className={styles.progressBar}
            containerClassName={styles.progress}
            progress={progress}
            kind={getProgressBarKind(status, monitored, progress)}
            showText={true}
            text={`${episodeFileCount} / ${episodeCount}`}
            width={posterWidth}
          />

          <div className={styles.nextAiring}>
            {
              getRelativeDate(
                nextAiring,
                shortDateFormat,
                showRelativeDates,
                {
                  timeFormat,
                  timeForToday: true
                }
              )
            }
          </div>

          <SeriesIndexPosterInfo
            showRelativeDates={showRelativeDates}
            shortDateFormat={shortDateFormat}
            timeFormat={timeFormat}
            {...otherProps}
          />

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
        </div>
      </div>
    );
  }
}

SeriesIndexPoster.propTypes = {
  style: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  monitored: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  titleSlug: PropTypes.string.isRequired,
  nextAiring: PropTypes.string,
  episodeCount: PropTypes.number,
  episodeFileCount: PropTypes.number,
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  posterWidth: PropTypes.number.isRequired,
  posterHeight: PropTypes.number.isRequired,
  showRelativeDates: PropTypes.bool.isRequired,
  shortDateFormat: PropTypes.string.isRequired,
  timeFormat: PropTypes.string.isRequired,
  isRefreshingSeries: PropTypes.bool.isRequired,
  onRefreshSeriesPress: PropTypes.func.isRequired
};

SeriesIndexPoster.defaultProps = {
  episodeCount: 0,
  episodeFileCount: 0
};

export default SeriesIndexPoster;
