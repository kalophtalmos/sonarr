import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { fetchHealth } from 'Store/Actions/systemActions';
import PageSidebarStatus from 'Components/Page/Sidebar/PageSidebarStatus';

function createMapStateToProps() {
  return createSelector(
    (state) => state.system.health,
    (health) => {
      const count = health.items.length;
      let errors = false;
      let warnings = false;

      health.items.forEach((item) => {
        if (item.type === 'error') {
          errors = true;
        }

        if (item.type === 'warning') {
          warnings = true;
        }
      });

      return {
        isPopulated: health.isPopulated,
        count,
        errors,
        warnings
      };
    }
  );
}

const mapDispatchToProps = {
  fetchHealth
};

class HealthStatusConnector extends Component {

  //
  // Lifecycle

  componentWillMount() {
    if (!this.props.isPopulated) {
      this.props.fetchHealth();
    }
  }

  //
  // Render

  render() {
    return (
      <PageSidebarStatus
        {...this.props}
      />
    );
  }
}

HealthStatusConnector.propTypes = {
  isPopulated: PropTypes.bool.isRequired,
  fetchHealth: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(HealthStatusConnector);
