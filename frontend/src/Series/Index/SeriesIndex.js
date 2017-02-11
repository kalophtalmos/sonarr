import React, { Component, PropTypes } from 'react';
import { align, icons, sortDirections } from 'Helpers/Props';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageToolbar from 'Components/Page/Toolbar/PageToolbar';
import PageToolbarSection from 'Components/Page/Toolbar/PageToolbarSection';
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';
import FilterMenu from 'Components/Menu/FilterMenu';
import SortMenu from 'Components/Menu/SortMenu';
import ViewMenu from 'Components/Menu/ViewMenu';
import Menu from 'Components/Menu/Menu';
import MenuContent from 'Components/Menu/MenuContent';
import ToolbarMenuButton from 'Components/Menu/ToolbarMenuButton';
import FilterMenuItem from 'Components/Menu/FilterMenuItem';
import SortMenuItem from 'Components/Menu/SortMenuItem';
import ViewMenuItem from 'Components/Menu/ViewMenuItem';
import SelectedMenuItem from 'Components/Menu/SelectedMenuItem';
import NoSeries from 'Series/NoSeries';
import SeriesIndexTableConnector from './Table/SeriesIndexTableConnector';
import SeriesIndexPostersConnector from './Posters/SeriesIndexPostersConnector';
import SeriesIndexFooter from './SeriesIndexFooter';
import styles from './SeriesIndex.css';

function getViewComponent(view) {
  if (view === 'posters') {
    return SeriesIndexPostersConnector;
  }

  return SeriesIndexTableConnector;
}

class SeriesIndex extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      contentBody: null
    };
  }

  //
  // Control

  setContentBodyRef = (ref) => {
    this.setState({ contentBody: ref });
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
      view,
      posterSize,
      isRefreshingSeries,
      isRssSyncExecuting,
      onSortSelect,
      onFilterSelect,
      onViewSelect,
      onPosterSizeSelect,
      onRefreshSeriesPress,
      onRssSyncPress,
      ...otherProps
    } = this.props;

    const contentBody = this.state.contentBody;

    const ViewComponent = getViewComponent(view);

    // Specify an innerClassName for PageContentBody
    // when the view is posters to accomodate
    // poster's 5px margin.

    const innerContentClassName = view === 'posters' ?
      styles.innerContentBody :
      undefined;

    return (
      <PageContent>
        <PageToolbar>
          <PageToolbarSection>
            <PageToolbarButton
              iconName={icons.REFRESH}
              spinningName={icons.REFRESH}
              title="Update all series"
              isSpinning={isRefreshingSeries}
              onPress={onRefreshSeriesPress}
            />

            <PageToolbarButton
              iconName={icons.RSS}
              title="Start RSS Sync"
              isSpinning={isRssSyncExecuting}
              onPress={onRssSyncPress}
            />

          </PageToolbarSection>

          <PageToolbarSection alignContent={align.RIGHT}>

            {
              view === 'posters' &&
                <Menu className={styles.posterSizeMenu}>
                  <ToolbarMenuButton
                    iconName={icons.POSTER_SIZE}
                    text="Poster Size"
                  />

                  <MenuContent alignMenu={align.RIGHT}>
                    <SelectedMenuItem
                      name="small"
                      isSelected={posterSize === 'small'}
                      onPress={onPosterSizeSelect}
                    >
                      Small
                    </SelectedMenuItem>

                    <SelectedMenuItem
                      name="medium"
                      isSelected={posterSize === 'medium'}
                      onPress={onPosterSizeSelect}
                    >
                      Medium
                    </SelectedMenuItem>

                    <SelectedMenuItem
                      name="large"
                      isSelected={posterSize === 'large'}
                      onPress={onPosterSizeSelect}
                    >
                      Large
                    </SelectedMenuItem>
                  </MenuContent>
                </Menu>
            }

            <ViewMenu className={styles.viewMenu}>
              <MenuContent alignMenu={align.RIGHT}>
                <ViewMenuItem
                  name="table"
                  selectedView={view}
                  onPress={onViewSelect}
                >
                  Table
                </ViewMenuItem>

                <ViewMenuItem
                  name="posters"
                  selectedView={view}
                  onPress={onViewSelect}
                >
                  Posters
                </ViewMenuItem>
              </MenuContent>
            </ViewMenu>

            <SortMenu className={styles.sortMenu}>
              <MenuContent alignMenu={align.RIGHT}>
                <SortMenuItem
                  name="sortTitle"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onPress={onSortSelect}
                >
                  Title
                </SortMenuItem>

                <SortMenuItem
                  name="network"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onPress={onSortSelect}
                >
                  Network
                </SortMenuItem>

                <SortMenuItem
                  name="qualityProfileId"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onPress={onSortSelect}
                >
                  Profile
                </SortMenuItem>

                <SortMenuItem
                  name="nextAiring"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onPress={onSortSelect}
                >
                  Next Airing
                </SortMenuItem>

                <SortMenuItem
                  name="previousAiring"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onPress={onSortSelect}
                >
                  Previous Airing
                </SortMenuItem>

                <SortMenuItem
                  name="added"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onPress={onSortSelect}
                >
                  Added
                </SortMenuItem>

                <SortMenuItem
                  name="seasonCount"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onPress={onSortSelect}
                >
                  Seasons
                </SortMenuItem>

                <SortMenuItem
                  name="episodeProgress"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onPress={onSortSelect}
                >
                  Episodes
                </SortMenuItem>

                <SortMenuItem
                  name="path"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onPress={onSortSelect}
                >
                  Path
                </SortMenuItem>

                <SortMenuItem
                  name="sizeOnDisk"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onPress={onSortSelect}
                >
                  Size on Disk
                </SortMenuItem>
              </MenuContent>
            </SortMenu>

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

        <PageContentBody
          ref={this.setContentBodyRef}
          innerClassName={innerContentClassName}
        >
          {
            isFetching && !isPopulated &&
              <LoadingIndicator />
          }

          {
            !isFetching && !!error &&
              <div>Unable to load series</div>
          }

          {
            !error && isPopulated && !!items.length && contentBody &&
              <div>
                <ViewComponent
                  posterSize={posterSize}
                  contentBody={contentBody}
                  {...otherProps}
                />

                <SeriesIndexFooter
                  series={items}
                />
              </div>
          }

          {
            !error && isPopulated && !items.length &&
              <NoSeries />
          }
        </PageContentBody>
      </PageContent>
    );
  }
}

SeriesIndex.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isPopulated: PropTypes.bool.isRequired,
  error: PropTypes.object,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  filterKey: PropTypes.string,
  filterValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
  sortKey: PropTypes.string,
  sortDirection: PropTypes.oneOf(sortDirections.all),
  view: PropTypes.string.isRequired,
  posterSize: PropTypes.string.isRequired,
  isRefreshingSeries: PropTypes.bool.isRequired,
  isRssSyncExecuting: PropTypes.bool.isRequired,
  onSortSelect: PropTypes.func.isRequired,
  onFilterSelect: PropTypes.func.isRequired,
  onViewSelect: PropTypes.func.isRequired,
  onPosterSizeSelect: PropTypes.func.isRequired,
  onRefreshSeriesPress: PropTypes.func.isRequired,
  onRssSyncPress: PropTypes.func.isRequired
};

export default SeriesIndex;
