import React, { PropTypes } from 'react';
import Modal from 'Components/Modal/Modal';
import EditIndexerModalContentConnector from './EditIndexerModalContentConnector';

function EditIndexerModal({ isOpen, onModalClose, ...otherProps }) {
  return (
    <Modal
      isOpen={isOpen}
      onModalClose={onModalClose}
    >
      <EditIndexerModalContentConnector
        {...otherProps}
        onModalClose={onModalClose}
      />
    </Modal>
  );
}

EditIndexerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onModalClose: PropTypes.func.isRequired
};

export default EditIndexerModal;
