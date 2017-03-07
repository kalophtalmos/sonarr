import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { createSelector } from 'reselect';
import createSettingsSectionSelector from 'Store/Selectors/createSettingsSectionSelector';
import createCommandsSelector from 'Store/Selectors/createCommandsSelector';
import createSystemStatusSelector from 'Store/Selectors/createSystemStatusSelector';
import { setGeneralSettingsValue, saveGeneralSettings, fetchGeneralSettings } from 'Store/Actions/settingsActions';
import { executeCommand } from 'Store/Actions/commandActions';
import { restart } from 'Store/Actions/systemActions';
import connectSection from 'Store/connectSection';
import * as commandNames from 'Commands/commandNames';
import GeneralSettings from './GeneralSettings';

function createMapStateToProps() {
  return createSelector(
    (state) => state.settings.advancedSettings,
    createSettingsSectionSelector(),
    createCommandsSelector(),
    createSystemStatusSelector(),
    (advancedSettings, sectionSettings, commands, systemStatus) => {
      const isResettingApiKey = _.some(commands, { name: commandNames.RESET_API_KEY });

      return {
        advancedSettings,
        isResettingApiKey,
        isMono: systemStatus.isMono,
        isWindows: systemStatus.isWindows,
        mode: systemStatus.mode,
        ...sectionSettings
      };
    }
  );
}

const mapDispatchToProps = {
  setGeneralSettingsValue,
  saveGeneralSettings,
  fetchGeneralSettings,
  executeCommand,
  restart
};

class GeneralSettingsConnector extends Component {

  //
  // Lifecycle

  componentWillMount() {
    this.props.fetchGeneralSettings();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isResettingApiKey && this.props.isResettingApiKey) {
      this.props.fetchGeneralSettings();
    }
  }

  //
  // Listeners

  onInputChange = ({ name, value }) => {
    this.props.setGeneralSettingsValue({ name, value });
  }

  onSavePress = () => {
    this.props.saveGeneralSettings();
  }

  onConfirmResetApiKey = () => {
    this.props.executeCommand({ name: commandNames.RESET_API_KEY });
  }

  onConfirmRestart = () => {
    this.props.restart();
  }

  //
  // Render

  render() {
    return (
      <GeneralSettings
        onInputChange={this.onInputChange}
        onSavePress={this.onSavePress}
        onConfirmResetApiKey={this.onConfirmResetApiKey}
        onConfirmRestart={this.onConfirmRestart}
        {...this.props}
      />
    );
  }
}

GeneralSettingsConnector.propTypes = {
  isResettingApiKey: PropTypes.bool.isRequired,
  setGeneralSettingsValue: PropTypes.func.isRequired,
  saveGeneralSettings: PropTypes.func.isRequired,
  fetchGeneralSettings: PropTypes.func.isRequired,
  executeCommand: PropTypes.func.isRequired,
  restart: PropTypes.func.isRequired
};

export default connectSection(
                createMapStateToProps,
                mapDispatchToProps,
                undefined,
                undefined,
                { section: 'general' }
               )(GeneralSettingsConnector);
