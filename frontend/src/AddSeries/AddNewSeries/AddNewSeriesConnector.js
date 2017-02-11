import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { lookupSeries, clearAddSeries } from 'Store/Actions/addSeriesActions';
import { fetchRootFolders } from 'Store/Actions/rootFolderActions';
import AddNewSeries from './AddNewSeries';

function createMapStateToProps() {
  return createSelector(
    (state) => state.addSeries,
    (addSeries) => {
      return addSeries;
    }
  );
}

const mapDispatchToProps = {
  lookupSeries,
  clearAddSeries,
  fetchRootFolders
};

class AddNewSeriesConnector extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this._seriesLookupTimeout = null;
  }

  componentWillMount() {
    this.props.fetchRootFolders();
  }

  componentWillUnmount() {
    if (this._seriesLookupTimeout) {
      clearTimeout(this._seriesLookupTimeout);
    }

    this.props.clearAddSeries();
  }

  //
  // Listeners

  onSeriesLookupChange = (term) => {
    if (this._seriesLookupTimeout) {
      clearTimeout(this._seriesLookupTimeout);
    }

    if (term.trim() === '') {
      this.props.clearAddSeries();
    } else {
      this._seriesLookupTimeout = setTimeout(() => {
        this.props.lookupSeries({ term });
      }, 300);
    }
  }

  onClearSeriesLookup = () => {
    this.props.clearAddSeries();
  }

  //
  // Render

  render() {
    const {
      location,
      ...otherProps
    } = this.props;

    return (
      <AddNewSeries
        term={location.query.term}
        {...otherProps}
        onSeriesLookupChange={this.onSeriesLookupChange}
        onClearSeriesLookup={this.onClearSeriesLookup}
      />
    );
  }
}

AddNewSeriesConnector.propTypes = {
  location: PropTypes.object.isRequired,
  lookupSeries: PropTypes.func.isRequired,
  clearAddSeries: PropTypes.func.isRequired,
  fetchRootFolders: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(AddNewSeriesConnector);
