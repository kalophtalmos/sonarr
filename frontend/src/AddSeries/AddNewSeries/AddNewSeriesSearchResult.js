import React, { Component, PropTypes } from 'react';
import { icons, kinds, sizes } from 'Helpers/Props';
import HeartRating from 'Components/HeartRating';
import Icon from 'Components/Icon';
import Label from 'Components/Label';
import Link from 'Components/Link/Link';
import SeriesPoster from 'Series/SeriesPoster';
import AddNewSeriesModal from './AddNewSeriesModal';
import styles from './AddNewSeriesSearchResult.css';

class AddNewSeriesSearchResult extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isNewAddSeriesModalOpen: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isExistingSeries && nextProps.isExistingSeries) {
      this.setState({ isNewAddSeriesModalOpen: false });
    }
  }

  //
  // Listeners

  onPress = () => {
    this.setState({ isNewAddSeriesModalOpen: true });
  }

  onAddSerisModalClose = () => {
    this.setState({ isNewAddSeriesModalOpen: false });
  }

  //
  // Render

  render() {
    const {
      tvdbId,
      title,
      titleSlug,
      year,
      network,
      status,
      overview,
      seasonCount,
      ratings,
      images,
      isExistingSeries,
      isSmallScreen
    } = this.props;

    const linkProps = isExistingSeries ? { to: `/series/${titleSlug}` } : { onPress: this.onPress };
    let seasons = '1 Season';

    if (seasonCount > 1) {
      seasons = `${seasonCount} Seasons`;
    }


    return (
      <Link
        className={styles.searchResult}
        {...linkProps}
      >
        {
          !isSmallScreen &&
            <SeriesPoster
              className={styles.poster}
              images={images}
              size={250}
            />
        }

        <div>
          <div className={styles.title}>
            {title}

            {
              !title.contains(year) &&
                <span className={styles.year}>({year})</span>
            }

            {
              isExistingSeries &&
                <Icon
                  className={styles.alreadyExistsIcon}
                  name={icons.CHECK_CIRCLE}
                  size={36}
                  title="Already in your library"
                />
            }
          </div>

          <div>
            <Label size={sizes.LARGE}>
              <HeartRating
                rating={ratings.value}
              />
            </Label>

            {
              !!network &&
                <Label size={sizes.LARGE}>
                  {network}
                </Label>
            }

            {
              !!seasonCount &&
                <Label size={sizes.LARGE}>
                  {seasons}
                </Label>
            }

            {
              status === 'ended' &&
                <Label
                  kind={kinds.DANGER}
                  size={sizes.LARGE}
                >
                  Ended
                </Label>
            }
          </div>

          <div className={styles.overview}>
            {overview}
          </div>
        </div>

        <AddNewSeriesModal
          isOpen={this.state.isNewAddSeriesModalOpen}
          tvdbId={tvdbId}
          title={title}
          year={year}
          overview={overview}
          images={images}
          onModalClose={this.onAddSerisModalClose}
        />
      </Link>
    );
  }
}

AddNewSeriesSearchResult.propTypes = {
  tvdbId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  titleSlug: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  network: PropTypes.string,
  status: PropTypes.string.isRequired,
  overview: PropTypes.string,
  seasonCount: PropTypes.number.isRequired,
  ratings: PropTypes.object.isRequired,
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  isExistingSeries: PropTypes.bool.isRequired,
  isSmallScreen: PropTypes.bool.isRequired
};

export default AddNewSeriesSearchResult;
