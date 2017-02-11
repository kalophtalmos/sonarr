import React, { Component, PropTypes } from 'react';
import { kinds } from 'Helpers/Props';
import Label from 'Components/Label';
import Link from 'Components/Link/Link';
import styles from './ImportSeriesSearchResult.css';

class ImportSeriesSearchResult extends Component {

  //
  // Listeners

  onPress = () => {
    this.props.onPress(this.props.tvdbId);
  }

  //
  // Render

  render() {
    const {
      title,
      year,
      network,
      isExistingSeries
    } = this.props;

    return (
      <Link
        className={styles.series}
        onPress={this.onPress}
      >
        <span className={styles.title}>
          {title}

          {
            !title.contains(year) &&
              <span className={styles.year}>({year})</span>
          }
        </span>

        {
          !!network &&
            <Label>{network}</Label>
        }

        {
          isExistingSeries &&
            <Label
              kind={kinds.WARNING}
            >
              Existing
            </Label>
        }
      </Link>
    );
  }
}

ImportSeriesSearchResult.propTypes = {
  tvdbId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  network: PropTypes.string,
  isExistingSeries: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired
};

export default ImportSeriesSearchResult;
