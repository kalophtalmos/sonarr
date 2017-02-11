import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
import { setAddSeriesDefault, addSeries } from 'Store/Actions/addSeriesActions';
import AddNewSeriesModalContent from './AddNewSeriesModalContent';

function createMapStateToProps() {
  return createSelector(
    (state) => state.addSeries,
    createDimensionsSelector(),
    (addSeriesState, dimensions) => {
      const {
        isAdding,
        addError,
        defaults
      } = addSeriesState;

      return {
        isAdding,
        addError,
        isSmallScreen: dimensions.isSmallScreen,
        ...defaults
      };
    }
  );
}

const mapDispatchToProps = {
  setAddSeriesDefault,
  addSeries
};

class AddNewSeriesModalContentConnector extends Component {

  //
  // Listeners

  onInputChange = ({ name, value }) => {
    this.props.setAddSeriesDefault({ [name]: value });
  }

  onAddSeriesPress = (searchForMissingEpisodes) => {
    const {
      tvdbId,
      rootFolder,
      monitor,
      qualityProfileId,
      seriesType,
      seasonFolder,
      tags
    } = this.props;

    this.props.addSeries({
      tvdbId,
      rootFolder,
      monitor,
      qualityProfileId,
      seriesType,
      seasonFolder,
      tags,
      searchForMissingEpisodes
    });
  }

  //
  // Render

  render() {
    return (
      <AddNewSeriesModalContent
        {...this.props}
        onInputChange={this.onInputChange}
        onAddSeriesPress={this.onAddSeriesPress}
      />
    );
  }
}

AddNewSeriesModalContentConnector.propTypes = {
  tvdbId: PropTypes.number.isRequired,
  rootFolder: PropTypes.string,
  monitor: PropTypes.string.isRequired,
  qualityProfileId: PropTypes.number,
  seriesType: PropTypes.string.isRequired,
  seasonFolder: PropTypes.bool.isRequired,
  tags: PropTypes.arrayOf(PropTypes.number).isRequired,
  onModalClose: PropTypes.func.isRequired,
  setAddSeriesDefault: PropTypes.func.isRequired,
  addSeries: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(AddNewSeriesModalContentConnector);
