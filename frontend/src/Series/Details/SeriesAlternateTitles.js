import React, { PropTypes } from 'react';
import styles from './SeriesAlternateTitles.css';

function SeriesAlternateTitles({ alternateTitles }) {
  return (
    <ul className={styles.alternateTitles}>
      {
        alternateTitles.map((alternateTitle) => {
          return (
            <li
              key={alternateTitle}
              className={styles.alternateTitle}
            >
              {alternateTitle}
            </li>
          );
        })
      }
    </ul>
  );
}

SeriesAlternateTitles.propTypes = {
  alternateTitles: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default SeriesAlternateTitles;
