import React, { PropTypes } from 'react';
import Modal from 'Components/Modal/Modal';
import EditMetadataModalContentConnector from './EditMetadataModalContentConnector';

function EditMetadataModal({ isOpen, onModalClose, ...otherProps }) {
  return (
    <Modal
      isOpen={isOpen}
      onModalClose={onModalClose}
    >
      <EditMetadataModalContentConnector
        {...otherProps}
        onModalClose={onModalClose}
      />
    </Modal>
  );
}

EditMetadataModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onModalClose: PropTypes.func.isRequired
};

export default EditMetadataModal;
