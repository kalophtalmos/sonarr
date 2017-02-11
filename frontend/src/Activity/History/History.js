import React, { Component, PropTypes } from 'react';
import { align } from 'Helpers/Props';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';
import TablePager from 'Components/Table/TablePager';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageToolbar from 'Components/Page/Toolbar/PageToolbar';
import PageToolbarSection from 'Components/Page/Toolbar/PageToolbarSection';
import FilterMenu from 'Components/Menu/FilterMenu';
import MenuContent from 'Components/Menu/MenuContent';
import FilterMenuItem from 'Components/Menu/FilterMenuItem';
import HistoryRowConnector from './HistoryRowConnector';

class History extends Component {

  //
  // Render

  render() {
    const {
      isFetching,
      isPopulated,
      error,
      items,
      columns,
      filterKey,
      filterValue,
      totalRecords,
      episodesFetching,
      episodesPopulated,
      episodesError,
      onFilterSelect,
      ...otherProps
    } = this.props;

    const isFetchingAny = isFetching || episodesFetching;
    const isAllPopulated = isPopulated && episodesPopulated;
    const hasError = error || episodesError;

    return (
      <PageContent title="History">
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
                  name="eventType"
                  value="1"
                  filterKey={filterKey}
                  filterValue={filterValue}
                  onPress={onFilterSelect}
                >
                  Grabbed
                </FilterMenuItem>

                <FilterMenuItem
                  name="eventType"
                  value="3"
                  filterKey={filterKey}
                  filterValue={filterValue}
                  onPress={onFilterSelect}
                >
                  Imported
                </FilterMenuItem>

                <FilterMenuItem
                  name="eventType"
                  value="4"
                  filterKey={filterKey}
                  filterValue={filterValue}
                  onPress={onFilterSelect}
                >
                  Failed
                </FilterMenuItem>

                <FilterMenuItem
                  name="eventType"
                  value="5"
                  filterKey={filterKey}
                  filterValue={filterValue}
                  onPress={onFilterSelect}
                >
                  Deleted
                </FilterMenuItem>
              </MenuContent>
            </FilterMenu>
          </PageToolbarSection>
        </PageToolbar>

        <PageContentBody>
          {
            isFetchingAny && !isAllPopulated &&
              <LoadingIndicator />
          }

          {
            !isFetchingAny && hasError &&
              <div>Unable to load history</div>
          }

          {
            // If history isPopulated and it's empty show no history found and don't
            // wait for the episodes to populate because they are never coming.

            isPopulated && !hasError && !items.length &&
              <div>
                No history found
              </div>
          }

          {
            isAllPopulated && !hasError && !!items.length &&
              <div>
                <Table
                  columns={columns}
                  {...otherProps}
                >
                  <TableBody>
                    {
                      items.map((item) => {
                        return (
                          <HistoryRowConnector
                            key={item.id}
                            columns={columns}
                            {...item}
                          />
                        );
                      })
                    }
                  </TableBody>
                </Table>

                <TablePager
                  totalRecords={totalRecords}
                  isFetching={isFetchingAny}
                  {...otherProps}
                />
              </div>
          }
        </PageContentBody>
      </PageContent>
    );
  }
}

History.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isPopulated: PropTypes.bool.isRequired,
  error: PropTypes.object,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  filterKey: PropTypes.string,
  filterValue: PropTypes.string,
  totalRecords: PropTypes.number,
  episodesFetching: PropTypes.bool.isRequired,
  episodesPopulated: PropTypes.bool.isRequired,
  episodesError: PropTypes.object,
  onFilterSelect: PropTypes.func.isRequired
};

export default History;
