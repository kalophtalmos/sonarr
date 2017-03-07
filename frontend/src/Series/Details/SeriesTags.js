import React, { PropTypes } from 'react';
import { kinds, sizes } from 'Helpers/Props';
import Label from 'Components/Label';
import styles from './SeriesTags.css';

function SeriesTags({ tags }) {
  return (
    <div>
      {
        tags.map((tag) => {
          return (
            <Label
              key={tag}
              kind={kinds.INFO}
              size={sizes.LARGE}
            >
              {tag}
            </Label>
          );
        })
      }
    </div>
  );
}

SeriesTags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default SeriesTags;
