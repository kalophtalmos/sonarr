import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { fetchDiskSpace } from 'Store/Actions/systemActions';
import DiskSpace from './DiskSpace';

function createMapStateToProps() {
  return createSelector(
    (state) => state.system.diskSpace,
    (diskSpace) => {
      const {
        isFetching,
        items
      } = diskSpace;

      return {
        isFetching,
        items
      };
    }
  );
}

const mapDispatchToProps = {
  fetchDiskSpace
};

class DiskSpaceConnector extends Component {

  //
  // Lifecycle

  componentWillMount() {
    this.props.fetchDiskSpace();
  }

  //
  // Render

  render() {
    return (
      <DiskSpace
        {...this.props}
      />
    );
  }
}

DiskSpaceConnector.propTypes = {
  fetchDiskSpace: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(DiskSpaceConnector);
