import React, { Component, PropTypes } from 'react';
import { scrollDirections } from 'Helpers/Props';
import Scroller from 'Components/Scroller';
import styles from './PageContentBody.css';

class PageContentBody extends Component {

  //
  // Render

  render() {
    const {
      className,
      innerClassName,
      children,
      ...otherProps
    } = this.props;

    return (
      <Scroller
        className={className}
        scrollDirection={scrollDirections.VERTICAL}
        {...otherProps}
      >
        <div className={innerClassName}>
          {children}
        </div>
      </Scroller>
    );
  }
}

PageContentBody.propTypes = {
  className: PropTypes.string,
  innerClassName: PropTypes.string,
  children: PropTypes.node.isRequired
};

PageContentBody.defaultProps = {
  className: styles.contentBody,
  innerClassName: styles.innerContentBody
};

export default PageContentBody;
