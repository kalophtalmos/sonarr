import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import VirtualTable from 'Components/Table/VirtualTable';
import ImportSeriesHeader from './ImportSeriesHeader';
import ImportSeriesRowConnector from './ImportSeriesRowConnector';

class ImportSeriesTable extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this._table = null;
  }

  componentWillMount() {
    const {
      unmappedFolders,
      defaultMonitor,
      defaultQualityProfileId,
      defaultSeriesType,
      defaultSeasonFolder,
      onSeriesLookup,
      onSetImportSeriesValue
    } = this.props;

    const values = {
      monitor: defaultMonitor,
      qualityProfileId: defaultQualityProfileId,
      seriesType: defaultSeriesType,
      seasonFolder: defaultSeasonFolder
    };

    unmappedFolders.forEach((unmappedFolder) => {
      const id = unmappedFolder.name;

      onSeriesLookup(id, unmappedFolder.path);

      onSetImportSeriesValue({
        id,
        ...values
      });
    });
  }

  // This isn't great, but it's the most reliable way to ensure the items
  // are checked off even if they aren't actually visible since the cells
  // are virtualized.

  componentWillReceiveProps(nextProps) {
    const {
      items,
      selectedState,
      allSeries,
      onSelectedChange,
      onRemoveSelectedStateItem
    } = this.props;

    const nextItems = nextProps.items;

    items.forEach((item) => {
      const {
        id,
        selectedSeries
      } = item;

      const nextItem = _.find(nextItems, { id });

      if (!nextItem) {
        onRemoveSelectedStateItem(id);
        return;
      }

      const nextSelectedSeries = nextItem.selectedSeries;
      const nextIsSelected = nextProps.selectedState[id];

      const isExistingSeries = !!nextSelectedSeries &&
        _.some(allSeries, { tvdbId: nextSelectedSeries.tvdbId });

      // Next Props doesn't have a selected series or
      // the next selected series is an existing series.
      if ((!nextSelectedSeries && selectedSeries) || (isExistingSeries && !selectedSeries)) {
        onSelectedChange({ id, value: false });

        return;
      }

      // Next state is selected, but a series isn't selected or
      // the selected series is an existing series.
      if (nextIsSelected && (!nextSelectedSeries || isExistingSeries)) {
        onSelectedChange({ id, value: false });

        return;
      }

      // A series is being selected that wasn't previously selected.
      if (nextSelectedSeries && nextSelectedSeries !== selectedSeries) {
        onSelectedChange({ id, value: true });

        return;
      }
    });

    // Forces the table to re-render if the selected state
    // has changed otherwise it will be stale.

    if (selectedState !== nextProps.selectedState && this._table) {
      this._table.forceUpdateGrid();
    }
  }

  //
  // Control

  setTableRef = (ref) => {
    this._table = ref;
  }

  rowRenderer = ({ key, rowIndex, style }) => {
    const {
      rootFolderId,
      items,
      selectedState,
      onSelectedChange
    } = this.props;

    const item = items[rowIndex];

    return (
      <ImportSeriesRowConnector
        key={key}
        style={style}
        rootFolderId={rootFolderId}
        isSelected={selectedState[item.id]}
        onSelectedChange={onSelectedChange}
        id={item.id}
      />
    );
  }

  //
  // Render

  render() {
    const {
      items,
      allSelected,
      allUnselected,
      isSmallScreen,
      contentBody,
      onSelectAllChange
    } = this.props;

    if (!items.length) {
      return null;
    }

    return (
      <VirtualTable
        ref={this.setTableRef}
        items={items}
        contentBody={contentBody}
        isSmallScreen={isSmallScreen}
        rowHeight={52}
        overscanRowCount={2}
        rowRenderer={this.rowRenderer}
        header={
          <ImportSeriesHeader
            allSelected={allSelected}
            allUnselected={allUnselected}
            onSelectAllChange={onSelectAllChange}
          />
        }
      />
    );
  }
}

ImportSeriesTable.propTypes = {
  rootFolderId: PropTypes.number.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
  unmappedFolders: PropTypes.arrayOf(PropTypes.object),
  defaultMonitor: PropTypes.string.isRequired,
  defaultQualityProfileId: PropTypes.number,
  defaultSeriesType: PropTypes.string.isRequired,
  defaultSeasonFolder: PropTypes.bool.isRequired,
  allSelected: PropTypes.bool.isRequired,
  allUnselected: PropTypes.bool.isRequired,
  selectedState: PropTypes.object.isRequired,
  isSmallScreen: PropTypes.bool.isRequired,
  allSeries: PropTypes.arrayOf(PropTypes.object),
  contentBody: PropTypes.object.isRequired,
  onSelectAllChange: PropTypes.func.isRequired,
  onSelectedChange: PropTypes.func.isRequired,
  onRemoveSelectedStateItem: PropTypes.func.isRequired,
  onSeriesLookup: PropTypes.func.isRequired,
  onSetImportSeriesValue: PropTypes.func.isRequired
};

export default ImportSeriesTable;
