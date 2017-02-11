import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { addRootFolder } from 'Store/Actions/rootFolderActions';
import RootFolderSelectInput from './RootFolderSelectInput';

function createMapStateToProps() {
  return createSelector(
    (state) => state.rootFolders,
    (state, { includeNoChange }) => includeNoChange,
    (rootFolders, includeNoChange) => {
      const values = _.map(rootFolders.items, (rootFolder) => {
        return {
          [rootFolder.path]: rootFolder.path
        };
      });

      if (includeNoChange) {
        values.unshift({
          'noChange': 'No Change'
        });
      }

      values.push({
        'addNew': 'Add a new path'
      });

      return {
        values
      };
    }
  );
}

const mapDispatchToProps = {
  addRootFolder
};

class RootFolderSelectInputConnector extends Component {

  //
  // Lifecycle

  componentWillMount() {
    const {
      name,
      value,
      values,
      onChange
    } = this.props;

    if (!value || !_.some(values, { id: value })) {
      onChange({ name, value: _.keys(values[0])[0] });
    }
  }

  //
  // Listeners

  onNewRootFolderSelect = (path) => {
    this.props.addRootFolder({ path });
  }

  //
  // Render

  render() {
    return (
      <RootFolderSelectInput
        {...this.props}
        onNewRootFolderSelect={this.onNewRootFolderSelect}
      />
    );
  }
}

RootFolderSelectInputConnector.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  values: PropTypes.arrayOf(PropTypes.object).isRequired,
  includeNoChange: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  addRootFolder: PropTypes.func.isRequired
};

RootFolderSelectInputConnector.defaultProps = {
  includeNoChange: false
};

export default connect(createMapStateToProps, mapDispatchToProps)(RootFolderSelectInputConnector);
