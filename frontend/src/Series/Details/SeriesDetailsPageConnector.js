import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { push } from 'react-router-redux';
import createAllSeriesSelector from 'Store/Selectors/createAllSeriesSelector';
import NotFound from 'Components/NotFound';
import SeriesDetailsConnector from './SeriesDetailsConnector';

function createMapStateToProps() {
  return createSelector(
    (state, { params }) => params,
    createAllSeriesSelector(),
    (params, allSeries) => {
      const titleSlug = params.titleSlug;
      const seriesIndex = _.findIndex(allSeries, { titleSlug });

      if (seriesIndex > -1) {
        return {
          titleSlug
        };
      }

      return {
      };
    }
  );
}

const mapDispatchToProps = {
  push
};

class SeriesDetailsPageConnector extends Component {

  //
  // Lifecycle

  componentWillReceiveProps(nextProps) {
    if (!nextProps.titleSlug) {
      this.props.push(`${window.Sonarr.urlBase}/`);
      return;
    }
  }

  //
  // Render

  render() {
    const {
      titleSlug
    } = this.props;

    if (!titleSlug) {
      return (
        <NotFound
          message="Sorry, that series cannot be found."
        />
      );
    }

    return (
      <SeriesDetailsConnector
        titleSlug={titleSlug}
      />
    );
  }
}

SeriesDetailsPageConnector.propTypes = {
  titleSlug: PropTypes.string,
  params: PropTypes.shape({ titleSlug: PropTypes.string.isRequired }).isRequired,
  push: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(SeriesDetailsPageConnector);
