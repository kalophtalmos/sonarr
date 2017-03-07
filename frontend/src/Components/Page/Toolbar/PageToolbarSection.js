import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { align } from 'Helpers/Props';
import styles from './PageToolbarSection.css';

class PageToolbarSection extends Component {

  //
  // Render

  render() {
    const {
      children,
      alignContent
    } = this.props;

    return (
      <div className={classNames(
        styles.section,
        styles[alignContent]
      )}>
        {children}
      </div>
    );
  }

}

PageToolbarSection.propTypes = {
  children: PropTypes.node,
  alignContent: PropTypes.oneOf([align.LEFT, align.CENTER, align.RIGHT])
};

PageToolbarSection.defaultProps = {
  alignContent: align.LEFT
};

export default PageToolbarSection;
