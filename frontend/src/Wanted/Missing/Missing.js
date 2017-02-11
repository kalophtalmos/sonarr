import React, { Component, PropTypes } from 'react';
import hasDifferentItems from 'Utilities/Object/hasDifferentItems';
import getSelectedIds from 'Utilities/Table/getSelectedIds';
import selectAll from 'Utilities/Table/selectAll';
import toggleSelected from 'Utilities/Table/toggleSelected';
import { align, icons, kinds } from 'Helpers/Props';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';
import TablePager from 'Components/Table/TablePager';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageToolbar from 'Components/Page/Toolbar/PageToolbar';
import PageToolbarSection from 'Components/Page/Toolbar/PageToolbarSection';
import PageToolbarSeparator from 'Components/Page/Toolbar/PageToolbarSeparator';
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';
import FilterMenu from 'Components/Menu/FilterMenu';
import MenuContent from 'Components/Menu/MenuContent';
import FilterMenuItem from 'Components/Menu/FilterMenuItem';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import ManualImportModal from 'ManualImport/ManualImportModal';
import MissingRow from './MissingRow';

class Missing extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      allSelected: false,
      allUnselected: false,
      lastToggled: null,
      selectedState: {},
      isConfirmSearchAllMissingModalOpen: false,
      isManualImportModalOpen: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (hasDifferentItems(nextProps.items, this.props.items)) {
      this.setState({ selectedState: {} });
    }
  }

  //
  // Control

  getSelectedIds = () => {
    return getSelectedIds(this.state.selectedState);
  }

  //
  // Listeners

  onFilterMenuItemPress = (filterKey, filterValue) => {
    this.props.onFilterSelect(filterKey, filterValue);
  }

  onSelectAllChange = ({ value }) => {
    this.setState(selectAll(this.state.selectedState, value));
  }

  onSelectedChange = ({ id, value, shiftKey = false }) => {
    this.setState((state) => {
      return toggleSelected(state, this.props.items, id, value, shiftKey);
    });
  }

  onSearchSelectedPress = () => {
    const selected = this.getSelectedIds();

    this.props.onSearchSelectedPress(selected);
  }

  onToggleSelectedPress = () => {
    const selected = this.getSelectedIds();

    this.props.onToggleSelectedPress(selected);
  }

  onSearchAllMissingPress = () => {
    this.setState({ isConfirmSearchAllMissingModalOpen: true });
  }

  onSearchAllMissingConfirmed = () => {
    this.props.onSearchAllMissingPress();
    this.setState({ isConfirmSearchAllMissingModalOpen: false });
  }

  onConfirmSearchAllMissingModalClose = () => {
    this.setState({ isConfirmSearchAllMissingModalOpen: false });
  }

  onManualImportPress = () => {
    this.setState({ isManualImportModalOpen: true });
  }

  onManualImportModalClose = () => {
    this.setState({ isManualImportModalOpen: false });
  }

  //
  // Render

  render() {
    const {
      isFetching,
      isPopulated,
      error,
      items,
      columns,
      totalRecords,
      isScanningDroneFactory,
      isSearchingForEpisodes,
      isSearchingForMissingEpisodes,
      isSaving,
      filterKey,
      filterValue,
      onRescanDroneFactoryPress,
      ...otherProps
    } = this.props;

    const {
      allSelected,
      allUnselected,
      selectedState,
      isConfirmSearchAllMissingModalOpen,
      isManualImportModalOpen
    } = this.state;

    return (
      <PageContent title="Missing">
        <PageToolbar>
          <PageToolbarSection>
            <PageToolbarButton
              iconName={icons.SEARCH}
              title="Search selected"
              isSpinning={isSearchingForEpisodes}
              onPress={this.onSearchSelectedPress}
            />

            <PageToolbarButton
              iconName={icons.MONITORED}
              title={filterKey === 'monitored' && filterValue ? 'Unmonitor selected' : 'Monitor selected'}
              isSpinning={isSaving}
              onPress={this.onToggleSelectedPress}
            />

            <PageToolbarSeparator />

            <PageToolbarButton
              iconName={icons.SEARCH}
              title="Search all missing"
              isSpinning={isSearchingForMissingEpisodes}
              onPress={this.onSearchAllMissingPress}
            />

            <PageToolbarSeparator />

            <PageToolbarButton
              iconName={icons.REFRESH}
              title="Rescan Drone Factory folder"
              isSpinning={isScanningDroneFactory}
              onPress={onRescanDroneFactoryPress}
            />

            <PageToolbarButton
              iconName={icons.INTERACTIVE}
              title="Manual Import"
              onPress={this.onManualImportPress}
            />

          </PageToolbarSection>

          <PageToolbarSection alignContent={align.RIGHT}>
            <FilterMenu>
              <MenuContent alignMenu={align.RIGHT}>
                <FilterMenuItem
                  name="monitored"
                  value={true}
                  filterKey={filterKey}
                  filterValue={filterValue}
                  onPress={this.onFilterMenuItemPress}
                >
                  Monitored
                </FilterMenuItem>

                <FilterMenuItem
                  name="monitored"
                  value={false}
                  filterKey={filterKey}
                  filterValue={filterValue}
                  onPress={this.onFilterMenuItemPress}
                >
                  Unmonitored
                </FilterMenuItem>
              </MenuContent>
            </FilterMenu>
          </PageToolbarSection>
        </PageToolbar>

        <PageContentBody>
          {
            isFetching && !isPopulated &&
              <LoadingIndicator />
          }

          {
            !isFetching && error &&
              <div>
                Error fetching missing items
              </div>
          }

          {
            isPopulated && !error && !items.length &&
              <div>
                No missing items
              </div>
          }

          {
            isPopulated && !error && !!items.length &&
              <div>
                <Table
                  columns={columns}
                  selectAll={true}
                  allSelected={allSelected}
                  allUnselected={allUnselected}
                  {...otherProps}
                  onSelectAllChange={this.onSelectAllChange}
                >
                  <TableBody>
                    {
                      items.map((item) => {
                        return (
                          <MissingRow
                            key={item.id}
                            isSelected={selectedState[item.id]}
                            columns={columns}
                            {...item}
                            onSelectedChange={this.onSelectedChange}
                          />
                        );
                      })
                    }
                  </TableBody>
                </Table>

                <TablePager
                  totalRecords={totalRecords}
                  isFetching={isFetching}
                  {...otherProps}
                />

                <ConfirmModal
                  isOpen={isConfirmSearchAllMissingModalOpen}
                  kind={kinds.DANGER}
                  title="Search for all missing episodes"
                  message={
                    <div>
                      <div>
                        Are you sure you want to search for all {totalRecords} missing episodes?
                      </div>
                      <div>
                        This cannot be cancelled once started without restarting Sonarr.
                      </div>
                    </div>
                  }
                  confirmLabel="Search"
                  onConfirm={this.onSearchAllMissingConfirmed}
                  onCancel={this.onConfirmSearchAllMissingModalClose}
                />

                <ManualImportModal
                  isOpen={isManualImportModalOpen}
                  onModalClose={this.onManualImportModalClose}
                />
              </div>
          }
        </PageContentBody>
      </PageContent>
    );
  }
}

Missing.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isPopulated: PropTypes.bool.isRequired,
  error: PropTypes.object,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  totalRecords: PropTypes.number,
  isScanningDroneFactory: PropTypes.bool.isRequired,
  isSearchingForEpisodes: PropTypes.bool.isRequired,
  isSearchingForMissingEpisodes: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  filterKey: PropTypes.string,
  filterValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
  onFilterSelect: PropTypes.func.isRequired,
  onSearchSelectedPress: PropTypes.func.isRequired,
  onToggleSelectedPress: PropTypes.func.isRequired,
  onSearchAllMissingPress: PropTypes.func.isRequired,
  onRescanDroneFactoryPress: PropTypes.func.isRequired
};

export default Missing;
