import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
import { saveDimensions } from 'Store/Actions/appActions';
import { fetchSeries } from 'Store/Actions/seriesActions';
import { fetchTags } from 'Store/Actions/tagActions';
import { fetchQualityProfiles, fetchUISettings } from 'Store/Actions/settingsActions';
import { fetchStatus } from 'Store/Actions/systemActions';
import ErrorPage from './ErrorPage';
import LoadingPage from './LoadingPage';
import Page from './Page';

function testLocalStorage() {
  const key = 'sonarrTest';

  try {
    localStorage.setItem(key, key);
    localStorage.removeItem(key);

    return true;
  } catch (e) {
    return false;
  }
}

function createMapStateToProps() {
  return createSelector(
    (state) => state.series,
    (state) => state.tags,
    (state) => state.settings,
    (state) => state.app,
    createDimensionsSelector(),
    (series, tags, settings, app, dimensions) => {
      const isPopulated = series.isPopulated &&
        tags.isPopulated &&
        settings.qualityProfiles.isPopulated &&
        settings.ui.isPopulated;

      const hasError = !!series.error ||
        !!tags.error ||
        !!settings.qualityProfiles.error ||
        !!settings.ui.error;

      return {
        isPopulated,
        hasError,
        seriesError: series.error,
        tagsError: tags.error,
        qualityProfilesError: settings.qualityProfiles.error,
        uiSettingsError: settings.ui.error,
        isSmallScreen: dimensions.isSmallScreen,
        version: app.version,
        isUpdated: app.isUpdated,
        isDisconnected: app.isDisconnected
      };
    }
  );
}

const mapDispatchToProps = {
  saveDimensions,
  fetchSeries,
  fetchTags,
  fetchQualityProfiles,
  fetchUISettings,
  fetchStatus
};

class PageConnector extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isLocalStorageSupported: testLocalStorage()
    };
  }

  componentWillMount() {
    if (!this.props.isPopulated) {
      this.props.fetchSeries();
      this.props.fetchTags();
      this.props.fetchQualityProfiles();
      this.props.fetchUISettings();
      this.props.fetchStatus();
    }
  }

  //
  // Listeners

  onResize = (dimensions) => {
    this.props.saveDimensions(dimensions);
  }

  //
  // Render

  render() {
    const {
      isPopulated,
      hasError,
      ...otherProps
    } = this.props;

    if (hasError || !this.state.isLocalStorageSupported) {
      return (
        <ErrorPage
          {...this.state}
          {...otherProps}
        />
      );
    }

    if (isPopulated) {
      return (
        <Page
          {...otherProps}
          onResize={this.onResize}
        />
      );
    }

    return (
      <LoadingPage />
    );
  }
}

PageConnector.propTypes = {
  isPopulated: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  saveDimensions: PropTypes.func.isRequired,
  fetchSeries: PropTypes.func.isRequired,
  fetchTags: PropTypes.func.isRequired,
  fetchQualityProfiles: PropTypes.func.isRequired,
  fetchUISettings: PropTypes.func.isRequired,
  fetchStatus: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(PageConnector);
