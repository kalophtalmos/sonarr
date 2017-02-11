import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { push } from 'react-router-redux';
import { fetchRootFolders, addRootFolder, deleteRootFolder } from 'Store/Actions/rootFolderActions';
import ImportSeriesSelectFolder from './ImportSeriesSelectFolder';

function createMapStateToProps() {
  return createSelector(
    (state) => state.rootFolders,
    (rootFolders) => {
      return rootFolders;
    }
  );
}

const mapDispatchToProps = {
  fetchRootFolders,
  addRootFolder,
  deleteRootFolder,
  push
};

class ImportSeriesSelectFolderConnector extends Component {

  //
  // Lifecycle

  componentDidMount() {
    this.props.fetchRootFolders();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isSaving && this.props.isSaving && !nextProps.saveError) {
      const newRootFolders = _.differenceBy(nextProps.items, this.props.items, (item) => item.id);

      if (newRootFolders.length === 1) {
        this.props.push(`${window.Sonarr.urlBase}/add/import/${newRootFolders[0].id}`);
      }
    }
  }

  //
  // Listeners

  onNewRootFolderSelect = (path) => {
    this.props.addRootFolder({ path });
  }

  onDeleteRootFolderPress = (id) => {
    this.props.deleteRootFolder({ id });
  }

  //
  // Render

  render() {
    return (
      <ImportSeriesSelectFolder
        {...this.props}
        onNewRootFolderSelect={this.onNewRootFolderSelect}
        onDeleteRootFolderPress={this.onDeleteRootFolderPress}
      />
    );
  }
}

ImportSeriesSelectFolderConnector.propTypes = {
  isSaving: PropTypes.bool.isRequired,
  saveError: PropTypes.object,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchRootFolders: PropTypes.func.isRequired,
  addRootFolder: PropTypes.func.isRequired,
  deleteRootFolder: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(ImportSeriesSelectFolderConnector);
