import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { createSelector } from 'reselect';
import createSettingsSectionSelector from 'Store/Selectors/createSettingsSectionSelector';
import createSystemStatusSelector from 'Store/Selectors/createSystemStatusSelector';
import { fetchMediaManagementSettings, setMediaManagementSettingsValue, saveMediaManagementSettings, saveNamingSettings } from 'Store/Actions/settingsActions';
import connectSection from 'Store/connectSection';
import MediaManagement from './MediaManagement';

function createMapStateToProps() {
  return createSelector(
    (state) => state.settings.advancedSettings,
    (state) => state.settings.naming,
    createSettingsSectionSelector(),
    createSystemStatusSelector(),
    (advancedSettings, namingSettings, sectionSettings, systemStatus) => {
      return {
        advancedSettings,
        ...sectionSettings,
        hasPendingChanges: !_.isEmpty(namingSettings.pendingChanges) || sectionSettings.hasPendingChanges,
        isMono: systemStatus.isMono
      };
    }
  );
}

const mapDispatchToProps = {
  fetchMediaManagementSettings,
  setMediaManagementSettingsValue,
  saveMediaManagementSettings,
  saveNamingSettings
};

class MediaManagementConnector extends Component {

  //
  // Lifecycle

  componentWillMount() {
    this.props.fetchMediaManagementSettings();
  }

  //
  // Listeners

  onInputChange = ({ name, value }) => {
    this.props.setMediaManagementSettingsValue({ name, value });
  }

  onSavePress = () => {
    this.props.saveMediaManagementSettings();
    this.props.saveNamingSettings();
  }

  //
  // Render

  render() {
    return (
      <MediaManagement
        onInputChange={this.onInputChange}
        onSavePress={this.onSavePress}
        {...this.props}
      />
    );
  }
}

MediaManagementConnector.propTypes = {
  fetchMediaManagementSettings: PropTypes.func.isRequired,
  setMediaManagementSettingsValue: PropTypes.func.isRequired,
  saveMediaManagementSettings: PropTypes.func.isRequired,
  saveNamingSettings: PropTypes.func.isRequired
};

export default connectSection(
                createMapStateToProps,
                mapDispatchToProps,
                undefined,
                undefined,
                { section: 'mediaManagement' }
               )(MediaManagementConnector);
