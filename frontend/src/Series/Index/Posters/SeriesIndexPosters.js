import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Measure from 'react-measure';
import { Grid, WindowScroller } from 'react-virtualized';
import { sortDirections } from 'Helpers/Props';
import SeriesIndexItemConnector from 'Series/Index/SeriesIndexItemConnector';
import SeriesIndexPoster from './SeriesIndexPoster';

// Poster container dimensions
const columnPadding = 20;
const maxiumColumnWidth = 182;

const additionalColumnCount = {
  small: 3,
  medium: 2,
  large: 1
};

function calculateColumnWidth(width, posterSize) {
  const columns = Math.floor(width / maxiumColumnWidth);
  const remainder = width % maxiumColumnWidth;

  if (remainder === 0 && posterSize === 'large') {
    return maxiumColumnWidth;
  }

  return Math.floor(width / (columns + additionalColumnCount[posterSize]));
}

function calculateRowHeight(posterHeight, sortKey) {
  const rowHeight = posterHeight + 15 + 19 + columnPadding;

  switch (sortKey) {
    case 'network':
    case 'qualityProfileId':
    case 'seasons':
    case 'previousAiring':
    case 'added':
    case 'path':
    case 'sizeOnDisk':
      return rowHeight + 19;
    default:
      return rowHeight;
  }
}

function calculatePosterHeight(posterWidth) {
  return Math.ceil((250 / 170) * posterWidth);
}

class SeriesIndexPosters extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      width: 0,
      columnWidth: 182,
      columnCount: 1,
      posterWidth: 162,
      posterHeight: 238
    };

    this._isInitialized = false;
    this._grid = null;
  }

  componentDidMount() {
    this._contentBodyNode = ReactDOM.findDOMNode(this.props.contentBody);
  }

  componentDidUpdate(prevProps) {
    const {
      filterKey,
      filterValue,
      sortKey,
      sortDirection,
      posterSize
    } = this.props;

    if (
      prevProps.filterKey !== filterKey ||
      prevProps.filterValue !== filterValue ||
      prevProps.sortKey !== sortKey ||
      prevProps.sortDirection !== sortDirection
    ) {
      this._grid.recomputeGridSize();
    }

    if (prevProps.posterSize !== posterSize) {
      this.calculateGrid();
    }
  }

  //
  // Control

  setGridRef = (ref) => {
    this._grid = ref;
  }

  calculateGrid = (width = this.state.width) => {
    const columnWidth = calculateColumnWidth(width, this.props.posterSize);
    const columnCount = Math.max(Math.floor(width / columnWidth), 1);
    const posterWidth = columnWidth - columnPadding;
    const posterHeight = calculatePosterHeight(posterWidth);

    this.setState({
      width,
      columnWidth,
      columnCount,
      posterWidth,
      posterHeight
    });
  }

  cellRenderer = ({ key, rowIndex, columnIndex, style }) => {
    const {
      items,
      sortKey,
      showRelativeDates,
      shortDateFormat,
      timeFormat
    } = this.props;

    const {
      posterWidth,
      posterHeight
    } = this.state;

    const series = items[rowIndex * this.state.columnCount + columnIndex];

    if (!series) {
      return null;
    }

    return (
      <SeriesIndexItemConnector
        key={key}
        component={SeriesIndexPoster}
        sortKey={sortKey}
        posterWidth={posterWidth}
        posterHeight={posterHeight}
        showRelativeDates={showRelativeDates}
        shortDateFormat={shortDateFormat}
        timeFormat={timeFormat}
        style={style}
        {...series}
      />
    );
  }

  //
  // Listeners

  onMeasure = ({ width }) => {
    this.calculateGrid(width);
  }

  onSectionRendered = () => {
    const {
      scrollTop,
      isSmallScreen
    } = this.props;

    if (!this._isInitialized && this._contentBodyNode) {
      if (isSmallScreen) {
        document.documentElement.scrollTop = document.body.scrollTop = scrollTop;
      } else {
        this._contentBodyNode.scrollTop = scrollTop;
      }

      this._isInitialized = true;
    }
  }

  //
  // Render

  render() {
    const {
      items,
      sortKey,
      scrollTop,
      isSmallScreen,
      onScroll
    } = this.props;

    const {
      width,
      columnWidth,
      columnCount,
      posterHeight
    } = this.state;

    const rowCount = Math.ceil(items.length / columnCount);
    const rowHeight = calculateRowHeight(posterHeight, sortKey);

    return (
      <Measure onMeasure={this.onMeasure}>
        <WindowScroller
          scrollElement={isSmallScreen ? null : this._contentBodyNode}
          onScroll={onScroll}
        >
          {({ height, isScrolling }) => {
            return (
              <Grid
                ref={this.setGridRef}
                autoHeight={true}
                height={height}
                columnCount={columnCount}
                columnWidth={columnWidth}
                rowCount={rowCount}
                rowHeight={rowHeight}
                width={width}
                scrollTop={scrollTop}
                overscanRowCount={2}
                cellRenderer={this.cellRenderer}
                onSectionRendered={this.onSectionRendered}
              />
            );
          }
        }
        </WindowScroller>
      </Measure>
    );
  }
}

SeriesIndexPosters.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  filterKey: PropTypes.string,
  filterValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
  sortKey: PropTypes.string,
  sortDirection: PropTypes.oneOf(sortDirections.all),
  posterSize: PropTypes.string.isRequired,
  scrollTop: PropTypes.number.isRequired,
  contentBody: PropTypes.object.isRequired,
  showRelativeDates: PropTypes.bool.isRequired,
  shortDateFormat: PropTypes.string.isRequired,
  isSmallScreen: PropTypes.bool.isRequired,
  timeFormat: PropTypes.string.isRequired,
  onScroll: PropTypes.func.isRequired
};

export default SeriesIndexPosters;
