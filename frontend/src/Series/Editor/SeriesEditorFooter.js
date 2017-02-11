import React, { Component, PropTypes } from 'react';
import { kinds } from 'Helpers/Props';
import SpinnerButton from 'Components/Link/SpinnerButton';
import SelectInput from 'Components/Form/SelectInput';
import QualityProfileSelectInputConnector from 'Components/Form/QualityProfileSelectInputConnector';
import RootFolderSelectInputConnector from 'Components/Form/RootFolderSelectInputConnector';
import PageContentFooter from 'Components/Page/PageContentFooter';
import styles from './SeriesEditorFooter.css';

const NO_CHANGE = 'noChange';

class SeriesEditorFooter extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      monitored: NO_CHANGE,
      qualityProfileId: NO_CHANGE,
      rootFolderPath: NO_CHANGE,
      seasonFolder: NO_CHANGE
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isSaving && this.props.isSaving && !nextProps.saveError) {
      this.setState({
        monitored: NO_CHANGE,
        qualityProfileId: NO_CHANGE,
        rootFolderPath: NO_CHANGE,
        seasonFolder: NO_CHANGE
      });
    }
  }

  //
  // Listeners

  onInputChange = ({ name, value }) => {
    this.setState({ [name]: value });
  }

  onSaveSelectedPress = () => {
    const {
      monitored,
      qualityProfileId,
      rootFolderPath,
      seasonFolder
    } = this.state;

    const changes = {};

    if (monitored !== NO_CHANGE) {
      changes.monitored = monitored === 'monitored';
    }

    if (qualityProfileId !== NO_CHANGE) {
      changes.qualityProfileId = qualityProfileId;
    }

    if (rootFolderPath !== NO_CHANGE) {
      changes.rootFolderPath = rootFolderPath;
    }

    if (seasonFolder !== NO_CHANGE) {
      changes.seasonFolder = seasonFolder === 'yes';
    }

    this.props.onSaveSelectedPress(changes);
  }

  //
  // Render

  render() {
    const {
      selectedCount,
      isSaving,
      isOrganizingSeries,
      onOrganizeSeriesPress
    } = this.props;

    const {
      monitored,
      qualityProfileId,
      seasonFolder,
      rootFolderPath,
      monitor
    } = this.state;

    const monitoredOptions = [
      { [NO_CHANGE]: 'No Change' },
      { 'monitored': 'Monitored' },
      { 'unmonitored': 'Unmonitored' }
    ];

    const seasonFolderOptions = [
      { [NO_CHANGE]: 'No Change' },
      { 'yes': 'Yes' },
      { 'no': 'No' }
    ];

    const noChanges = monitored === NO_CHANGE && monitor === NO_CHANGE;

    return (
      <PageContentFooter>
        <div className={styles.inputContainer}>
          <div className={styles.label}>
            Monitor Series
          </div>

          <SelectInput
            name="monitored"
            value={monitored}
            values={monitoredOptions}
            isDisabled={!selectedCount}
            onChange={this.onInputChange}
          />
        </div>

        <div className={styles.inputContainer}>
          <div className={styles.label}>
            Quality Profile
          </div>

          <QualityProfileSelectInputConnector
            name="qualityProfileId"
            value={qualityProfileId}
            includeNoChange={true}
            isDisabled={!selectedCount}
            onChange={this.onInputChange}
          />
        </div>

        <div className={styles.inputContainer}>
          <div className={styles.label}>
            Season Folder
          </div>

          <SelectInput
            name="seasonFolder"
            value={seasonFolder}
            values={seasonFolderOptions}
            isDisabled={!selectedCount}
            onChange={this.onInputChange}
          />
        </div>

        <div className={styles.inputContainer}>
          <div className={styles.label}>
            Root Folder
          </div>

          <RootFolderSelectInputConnector
            name="rootFolderPath"
            value={rootFolderPath}
            includeNoChange={true}
            isDisabled={!selectedCount}
            onChange={this.onInputChange}
          />
        </div>

        <div>
          <div className={styles.label}>
            {selectedCount} Series Selected
          </div>

          <SpinnerButton
            className={styles.saveSelectedButton}
            kind={kinds.PRIMARY}
            isSpinning={isSaving}
            isDisabled={!selectedCount || noChanges}
            onPress={this.onSaveSelectedPress}
          >
            Save
          </SpinnerButton>

          <SpinnerButton
            className={styles.organizeSelectedButton}
            kind={kinds.DANGER}
            isSpinning={isOrganizingSeries}
            isDisabled={!selectedCount || isOrganizingSeries}
            onPress={onOrganizeSeriesPress}
          >
            Organize
          </SpinnerButton>
        </div>
      </PageContentFooter>
    );
  }
}

SeriesEditorFooter.propTypes = {
  selectedCount: PropTypes.number.isRequired,
  isSaving: PropTypes.bool.isRequired,
  saveError: PropTypes.object,
  isOrganizingSeries: PropTypes.bool.isRequired,
  onSaveSelectedPress: PropTypes.func.isRequired,
  onOrganizeSeriesPress: PropTypes.func.isRequired
};

export default SeriesEditorFooter;
