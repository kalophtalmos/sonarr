import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { scrollDirections } from 'Helpers/Props';
import styles from './Scroller.css';

class Scroller extends Component {

  //
  // Render

  render() {
    const {
      className,
      scrollDirection,
      autoScroll,
      children,
      ...otherProps
    } = this.props;

    return (
      <div
        className={classNames(
          className,
          styles.scroller,
          styles[scrollDirection],
          autoScroll && styles.autoScroll
        )}
        {...otherProps}
      >
        {children}
      </div>
    );
  }

}

Scroller.propTypes = {
  className: PropTypes.string,
  scrollDirection: PropTypes.oneOf([scrollDirections.NONE, scrollDirections.HORIZONTAL, scrollDirections.VERTICAL]).isRequired,
  autoScroll: PropTypes.bool.isRequired,
  children: PropTypes.node
};

Scroller.defaultProps = {
  scrollDirection: scrollDirections.VERTICAL,
  autoScroll: true
};

export default Scroller;
