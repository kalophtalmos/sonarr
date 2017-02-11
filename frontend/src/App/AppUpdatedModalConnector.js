import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import AppUpdatedModal from './AppUpdatedModal';

function createMapStateToProps() {
  return createSelector(
    (state) => state.app.version,
    (version) => {
      return {
        version
      };
    }
  );
}

function createMapDispatchToProps(dispatch, props) {
  return {
    onSeeChangesPress() {
      window.location = `${window.Sonarr.urlBase}/system/updates`;
    },

    onModalClose() {
      location.reload();
    }
  };
}

export default connect(createMapStateToProps, createMapDispatchToProps)(AppUpdatedModal);
