import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import getSelectedIds from 'Utilities/Table/getSelectedIds';
import selectAll from 'Utilities/Table/selectAll';
import toggleSelected from 'Utilities/Table/toggleSelected';
import { icons, kinds } from 'Helpers/Props';
import Button from 'Components/Link/Button';
import Icon from 'Components/Icon';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import SelectInput from 'Components/Form/SelectInput';
import ModalContent from 'Components/Modal/ModalContent';
import ModalHeader from 'Components/Modal/ModalHeader';
import ModalBody from 'Components/Modal/ModalBody';
import ModalFooter from 'Components/Modal/ModalFooter';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';
import SelectSeriesModal from 'ManualImport/Series/SelectSeriesModal';
import SelectSeasonModal from 'ManualImport/Season/SelectSeasonModal';
import InteractiveImportRow from './InteractiveImportRow';
import styles from './InteractiveImportModalContent.css';

const columns = [
  {
    name: 'relativePath',
    label: 'Relative Path',
    isSortable: true,
    isVisible: true
  },
  {
    name: 'series',
    label: 'Series',
    isSortable: true,
    isVisible: true
  },
  {
    name: 'season',
    label: 'Season',
    isVisible: true
  },
  {
    name: 'episodes',
    label: 'Episode(s)',
    isVisible: true
  },
  {
    name: 'quality',
    label: 'Quality',
    isSortable: true,
    isVisible: true
  },
  {
    name: 'size',
    label: 'Size',
    isVisible: true
  },
  {
    name: 'rejections',
    label: React.createElement(Icon, {
      name: icons.DANGER,
      kind: kinds.DANGER
    }),
    isVisible: true
  }
];

class InteractiveImportModalContent extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      allSelected: false,
      allUnselected: false,
      lastToggled: null,
      selectedState: {},
      importMode: props.importMode,
      isSelectSeriesModalOpen: false,
      isSelectSeasonModalOpen: false
    };
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

  onImportSelectedPress = () => {
    const selected = this.getSelectedIds();

    this.props.onImportSelectedPress(selected, this.state.importMode);
  }

  onImportModeChange = ({ value }) => {
    this.setState({ importMode: value });
  }

  onSelectSeriesPress = () => {
    this.setState({ isSelectSeriesModalOpen: true });
  }

  onSelectSeasonPress = () => {
    this.setState({ isSelectSeasonModalOpen: true });
  }

  onSelectSeriesModalClose = () => {
    this.setState({ isSelectSeriesModalOpen: false });
  }

  onSelectSeasonModalClose = () => {
    this.setState({ isSelectSeasonModalOpen: false });
  }

  //
  // Render

  render() {
    const {
      title,
      folder,
      isFetching,
      isPopulated,
      error,
      items,
      sortKey,
      sortDirection,
      manualImportErrorMessage,
      onSortPress,
      onModalClose
    } = this.props;

    const {
      allSelected,
      allUnselected,
      selectedState,
      importMode,
      isSelectSeriesModalOpen,
      isSelectSeasonModalOpen
    } = this.state;

    const selectedIds = this.getSelectedIds();
    const selectedItem = selectedIds.length ? _.find(items, { id: selectedIds[0] }) : null;
    const errorMessage = error && error.message || 'Unable to load manual import items';

    const importModeOptions = [
      { Move: 'Move Files' },
      { Copy: 'Copy Files' }
    ];

    return (
      <ModalContent onModalClose={onModalClose}>
        <ModalHeader>
          Manual Import - {title || folder}
        </ModalHeader>

        <ModalBody>
          {
            isFetching &&
              <LoadingIndicator />
          }

          {
            error &&
              <div>{errorMessage}</div>
          }

          {
            isPopulated && !!items.length &&
              <Table
                columns={columns}
                selectAll={true}
                allSelected={allSelected}
                allUnselected={allUnselected}
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSortPress={onSortPress}
                onSelectAllChange={this.onSelectAllChange}
              >
                <TableBody>
                  {
                    items.map((item) => {
                      return (
                        <InteractiveImportRow
                          key={item.id}
                          isSelected={selectedState[item.id]}
                          {...item}
                          onSelectedChange={this.onSelectedChange}
                        />
                      );
                    })
                  }
                </TableBody>
              </Table>
          }

          {
            isPopulated && !items.length &&
              'No video files were found in the selected folder'
          }
        </ModalBody>

        <ModalFooter className={styles.footer}>
          <div>
            <SelectInput
              className={styles.importMode}
              name="importMode"
              value={importMode}
              values={importModeOptions}
              onChange={this.onImportModeChange}
            />
          </div>

          <div>
            <Button onPress={this.onSelectSeriesPress}>
              Select Series
            </Button>

            <Button onPress={this.onSelectSeasonPress}>
              Select Season
            </Button>
          </div>

          <div>
            <Button onPress={onModalClose}>
              Cancel
            </Button>

            {
              manualImportErrorMessage &&
                <span className={styles.errorMessage}>{manualImportErrorMessage}</span>
            }

            <Button
              kind={kinds.SUCCESS}
              isDisabled={!this.getSelectedIds().length}
              onPress={this.onImportSelectedPress}
            >
              Import
            </Button>
          </div>
        </ModalFooter>

        <SelectSeriesModal
          isOpen={isSelectSeriesModalOpen}
          ids={selectedIds}
          onModalClose={this.onSelectSeriesModalClose}
        />

        <SelectSeasonModal
          isOpen={isSelectSeasonModalOpen}
          ids={selectedIds}
          seriesId={selectedItem && selectedItem.series && selectedItem.series.id}
          onModalClose={this.onSelectSeasonModalClose}
        />
      </ModalContent>
    );
  }
}

InteractiveImportModalContent.propTypes = {
  downloadId: PropTypes.string,
  importMode: PropTypes.string,
  title: PropTypes.string,
  folder: PropTypes.string,
  isFetching: PropTypes.bool.isRequired,
  isPopulated: PropTypes.bool.isRequired,
  error: PropTypes.object,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  sortKey: PropTypes.string,
  sortDirection: PropTypes.string,
  manualImportErrorMessage: PropTypes.string,
  onSortPress: PropTypes.func.isRequired,
  onImportSelectedPress: PropTypes.func.isRequired,
  onModalClose: PropTypes.func.isRequired
};

InteractiveImportModalContent.defaultProps = {
  importMode: 'Move'
};

export default InteractiveImportModalContent;
