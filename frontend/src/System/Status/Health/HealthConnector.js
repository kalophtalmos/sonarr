import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { fetchHealth } from 'Store/Actions/systemActions';
import Health from './Health';

function createMapStateToProps() {
  return createSelector(
    (state) => state.system.health,
    (health) => {
      const {
        isFetching,
        items
      } = health;

      return {
        isFetching,
        items
      };
    }
  );
}

const mapDispatchToProps = {
  fetchHealth
};

class HealthConnector extends Component {

  //
  // Lifecycle

  componentWillMount() {
    this.props.fetchHealth();
  }

  //
  // Render

  render() {
    return (
      <Health
        {...this.props}
      />
    );
  }
}

HealthConnector.propTypes = {
  fetchHealth: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(HealthConnector);
