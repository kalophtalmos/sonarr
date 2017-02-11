import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Measure from 'react-measure';
import { WindowScroller } from 'react-virtualized';
import { scrollDirections } from 'Helpers/Props';
import Scroller from 'Components/Scroller';
import VirtualTableBody from './VirtualTableBody';
import styles from './VirtualTable.css';

class VirtualTable extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      width: 0
    };

    this._isInitialized = false;
    this._table = null;
  }

  componentDidMount() {
    this._contentBodyNode = ReactDOM.findDOMNode(this.props.contentBody);
  }

  //
  // Control

  rowGetter = ({ index }) => {
    return this.props.items[index];
  }

  setTableRef = (ref) => {
    this._table = ref;
  }

  forceUpdateGrid = () => {
    this._table.recomputeGridSize();
  }

  //
  // Listeners

  onMeasure = ({ width }) => {
    this.setState({
      width
    });
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
      isSmallScreen,
      header,
      headerHeight,
      rowRenderer,
      onScroll,
      ...otherProps
    } = this.props;

    const {
      width
    } = this.state;

    return (
      <Measure onMeasure={this.onMeasure}>
        <WindowScroller
          scrollElement={isSmallScreen ? null : this._contentBodyNode}
          onScroll={onScroll}
        >
          {({ height, isScrolling, scrollTop }) => {
            return (
              <Scroller
                className={styles.tableContainer}
                scrollDirection={scrollDirections.HORIZONTAL}
              >
                {header}

                <VirtualTableBody
                  ref={this.setTableRef}
                  autoContainerWidth={true}
                  width={width}
                  height={height}
                  headerHeight={height - headerHeight}
                  rowHeight={38}
                  rowCount={items.length}
                  columnCount={1}
                  scrollTop={scrollTop}
                  autoHeight={true}
                  overscanRowCount={2}
                  cellRenderer={rowRenderer}
                  columnWidth={width}
                  onSectionRendered={this.onSectionRendered}
                  {...otherProps}
                />
              </Scroller>
              );
          }
        }
        </WindowScroller>
      </Measure>
    );
  }
}

VirtualTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  scrollTop: PropTypes.number,
  contentBody: PropTypes.object.isRequired,
  isSmallScreen: PropTypes.bool.isRequired,
  header: PropTypes.node.isRequired,
  headerHeight: PropTypes.number.isRequired,
  rowRenderer: PropTypes.func.isRequired,
  onScroll: PropTypes.func
};

VirtualTable.defaultProps = {
  headerHeight: 38
};

export default VirtualTable;
