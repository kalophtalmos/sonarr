import React, { Component, PropTypes } from 'react';
import getSelectedIds from 'Utilities/Table/getSelectedIds';
import selectAll from 'Utilities/Table/selectAll';
import toggleSelected from 'Utilities/Table/toggleSelected';
import { align, sortDirections } from 'Helpers/Props';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageToolbar from 'Components/Page/Toolbar/PageToolbar';
import PageToolbarSection from 'Components/Page/Toolbar/PageToolbarSection';
import FilterMenu from 'Components/Menu/FilterMenu';
import MenuContent from 'Components/Menu/MenuContent';
import FilterMenuItem from 'Components/Menu/FilterMenuItem';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';
import NoSeries from 'Series/NoSeries';
import SeriesEditorRowConnector from './SeriesEditorRowConnector';
import SeriesEditorFooter from './SeriesEditorFooter';
import OrganizeSeriesModal from './Organize/OrganizeSeriesModal';

const columns = [
  {
    name: 'status',
    isVisible: true
  },
  {
    name: 'sortTitle',
    label: 'Title',
    isSortable: true,
    isVisible: true
  },
  {
    name: 'qualityProfileId',
    label: 'Profile',
    isSortable: true,
    isVisible: true
  },
  {
    name: 'seasonFolder',
    label: 'Season Folder',
    isSortable: true,
    isVisible: true
  },
  {
    name: 'path',
    label: 'Path',
    isSortable: true,
    isVisible: true
  }
];

class SeriesEditor extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      allSelected: false,
      allUnselected: false,
      lastToggled: null,
      selectedState: {},
      isOrganizingSeriesModalOpen: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isSaving && this.props.isSaving && !nextProps.saveError) {
      this.onSelectAllChange({ value: false });
    }
  }

  //
  // Control

  getSelectedIds = () => {
    return getSelectedIds(this.state.selectedState);
  }

  //
  // Listeners

  onSelectAllChange = ({ value }) => {
    this.setState(selectAll(this.state.selectedState, value));
  }

  onSelectedChange = ({ id, value, shiftKey = false }) => {
    this.setState((state) => {
      return toggleSelected(state, this.props.items, id, value, shiftKey);
    });
  }

  onSaveSelectedPress = (changes) => {
    this.props.onSaveSelectedPress({
      seriesIds: this.getSelectedIds(),
      ...changes
    });
  }

  onOrganizeSeriesPress = () => {
    this.setState({ isOrganizingSeriesModalOpen: true });
  }

  onOrganizeSeriesModalClose = (organized) => {
    this.setState({ isOrganizingSeriesModalOpen: false });

    if (organized === true) {
      this.onSelectAllChange({ value: false });
    }
  }

  //
  // Render

  render() {
    const {
      isFetching,
      isPopulated,
      error,
      items,
      filterKey,
      filterValue,
      sortKey,
      sortDirection,
      isSaving,
      saveError,
      isOrganizingSeries,
      onSortPress,
      onFilterSelect
    } = this.props;

    const {
      allSelected,
      allUnselected,
      selectedState
    } = this.state;

    return (
      <PageContent title="Series Editor">
        <PageToolbar>
          <PageToolbarSection />
          <PageToolbarSection alignContent={align.RIGHT}>
            <FilterMenu>
              <MenuContent alignMenu={align.RIGHT}>
                <FilterMenuItem
                  filterKey={filterKey}
                  filterValue={filterValue}
                  onPress={onFilterSelect}
                >
                  All
                </FilterMenuItem>

                <FilterMenuItem
                  name="monitored"
                  value={true}
                  filterKey={filterKey}
                  filterValue={filterValue}
                  onPress={onFilterSelect}
                >
                  Monitored Only
                </FilterMenuItem>

                <FilterMenuItem
                  name="status"
                  value="continuing"
                  filterKey={filterKey}
                  filterValue={filterValue}
                  onPress={onFilterSelect}
                >
                  Continuing Only
                </FilterMenuItem>

                <FilterMenuItem
                  name="status"
                  value="ended"
                  filterKey={filterKey}
                  filterValue={filterValue}
                  onPress={onFilterSelect}
                >
                  Ended Only
                </FilterMenuItem>

                <FilterMenuItem
                  name="missing"
                  value={true}
                  filterKey={filterKey}
                  filterValue={filterValue}
                  onPress={onFilterSelect}
                >
                  Missing Episodes
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
            !isFetching && !!error &&
              <div>Unable to load the calendar</div>
          }

          {
            !error && isPopulated && !!items.length &&
              <div>
                <Table
                  columns={columns}
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  selectAll={true}
                  allSelected={allSelected}
                  allUnselected={allUnselected}
                  onSortPress={onSortPress}
                  onSelectAllChange={this.onSelectAllChange}
                >
                  <TableBody>
                    {
                      items.map((item) => {
                        return (
                          <SeriesEditorRowConnector
                            key={item.id}
                            {...item}
                            isSelected={selectedState[item.id]}
                            onSelectedChange={this.onSelectedChange}
                          />
                        );
                      })
                    }
                  </TableBody>
                </Table>
              </div>
          }

          {
            !error && isPopulated && !items.length &&
              <NoSeries />
          }
        </PageContentBody>

        <SeriesEditorFooter
          selectedCount={this.getSelectedIds().length}
          isSaving={isSaving}
          saveError={saveError}
          isOrganizingSeries={isOrganizingSeries}
          onSaveSelectedPress={this.onSaveSelectedPress}
          onOrganizeSeriesPress={this.onOrganizeSeriesPress}
        />

        <OrganizeSeriesModal
          isOpen={this.state.isOrganizingSeriesModalOpen}
          seriesIds={this.getSelectedIds()}
          onModalClose={this.onOrganizeSeriesModalClose}
        />
      </PageContent>
    );
  }
}

SeriesEditor.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isPopulated: PropTypes.bool.isRequired,
  error: PropTypes.object,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  sortKey: PropTypes.string,
  sortDirection: PropTypes.oneOf(sortDirections.all),
  filterKey: PropTypes.string,
  filterValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
  isSaving: PropTypes.bool.isRequired,
  saveError: PropTypes.object,
  isOrganizingSeries: PropTypes.bool.isRequired,
  onSortPress: PropTypes.func.isRequired,
  onFilterSelect: PropTypes.func.isRequired,
  onSaveSelectedPress: PropTypes.func.isRequired
};

export default SeriesEditor;
