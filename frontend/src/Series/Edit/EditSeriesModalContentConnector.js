import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import selectSettings from 'Store/Selectors/selectSettings';
import createSeriesSelector from 'Store/Selectors/createSeriesSelector';
import { setSeriesValue, saveSeries } from 'Store/Actions/seriesActions';
import EditSeriesModalContent from './EditSeriesModalContent';

function createMapStateToProps() {
  return createSelector(
    (state) => state.series,
    createSeriesSelector(),
    (seriesState, series) => {
      const {
        isSaving,
        saveError,
        pendingChanges
      } = seriesState;

      const seriesSettings = _.pick(series, [
        'monitored',
        'seasonFolder',
        'qualityProfileId',
        'seriesType',
        'path',
        'tags'
      ]);

      const settings = selectSettings(seriesSettings, pendingChanges, saveError);

      return {
        title: series.title,
        isSaving,
        saveError,
        pendingChanges,
        item: settings.settings,
        ...settings
      };
    }
  );
}

const mapDispatchToProps = {
  setSeriesValue,
  saveSeries
};

class EditSeriesModalContentConnector extends Component {

  //
  // Lifecycle

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.isSaving && !this.props.isSaving && !this.props.saveError) {
      this.props.onModalClose();
    }
  }

  //
  // Listeners

  onInputChange = ({ name, value }) => {
    this.props.setSeriesValue({ name, value });
  }

  onSavePress = () => {
    this.props.saveSeries({ id: this.props.seriesId });
  }

  //
  // Render

  render() {
    return (
      <EditSeriesModalContent
        {...this.props}
        onInputChange={this.onInputChange}
        onSavePress={this.onSavePress}
      />
    );
  }
}

EditSeriesModalContentConnector.propTypes = {
  seriesId: PropTypes.number,
  isSaving: PropTypes.bool.isRequired,
  saveError: PropTypes.object,
  setSeriesValue: PropTypes.func.isRequired,
  saveSeries: PropTypes.func.isRequired,
  onModalClose: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(EditSeriesModalContentConnector);
