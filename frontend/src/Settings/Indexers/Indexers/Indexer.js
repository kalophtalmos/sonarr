import React, { Component, PropTypes } from 'react';
import { kinds } from 'Helpers/Props';
import Card from 'Components/Card';
import Label from 'Components/Label';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import EditIndexerModalConnector from './EditIndexerModalConnector';
import styles from './Indexer.css';

function getLabelKind(supports, enabled) {
  if (!supports) {
    return kinds.DEFAULT;
  }

  if (!enabled) {
    return kinds.DANGER;
  }

  return kinds.SUCCESS;
}

class Indexer extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isEditIndexerModalOpen: false,
      isDeleteIndexerModalOpen: false
    };
  }

  //
  // Listeners

  onEditIndexerPress = () => {
    this.setState({ isEditIndexerModalOpen: true });
  }

  onEditIndexerModalClose = () => {
    this.setState({ isEditIndexerModalOpen: false });
  }

  onDeleteIndexerPress = () => {
    this.setState({
      isEditIndexerModalOpen: false,
      isDeleteIndexerModalOpen: true
    });
  }

  onDeleteIndexerModalClose= () => {
    this.setState({ isDeleteIndexerModalOpen: false });
  }

  onConfirmDeleteIndexer = () => {
    this.props.onConfirmDeleteIndexer(this.props.id);
  }

  //
  // Render

  render() {
    const {
      id,
      name,
      enableRss,
      enableSearch,
      supportsRss,
      supportsSearch
    } = this.props;

    return (
      <Card
        className={styles.indexer}
        onPress={this.onEditIndexerPress}
      >
        <div className={styles.name}>
          {name}
        </div>

        <div className={styles.enabled}>
          <Label
            kind={getLabelKind(supportsRss, enableRss)}
          >
            RSS
          </Label>

          <Label
            kind={getLabelKind(supportsSearch, enableSearch)}
          >
            Search
          </Label>
        </div>

        <EditIndexerModalConnector
          id={id}
          isOpen={this.state.isEditIndexerModalOpen}
          onModalClose={this.onEditIndexerModalClose}
          onDeleteIndexerPress={this.onDeleteIndexerPress}
        />

        <ConfirmModal
          isOpen={this.state.isDeleteIndexerModalOpen}
          kind={kinds.DANGER}
          title="Delete Indexer"
          message={`Are you sure you want to delete the indexer '${name}'?`}
          confirmLabel="Delete"
          onConfirm={this.onConfirmDeleteIndexer}
          onCancel={this.onDeleteIndexerModalClose}
        />
      </Card>
    );
  }
}

Indexer.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  enableRss: PropTypes.bool.isRequired,
  enableSearch: PropTypes.bool.isRequired,
  supportsRss: PropTypes.bool.isRequired,
  supportsSearch: PropTypes.bool.isRequired,
  onConfirmDeleteIndexer: PropTypes.func.isRequired
};

export default Indexer;
