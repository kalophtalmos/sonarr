import React, { PropTypes } from 'react';
import Modal from 'Components/Modal/Modal';
import EditDelayProfileModalContentConnector from './EditDelayProfileModalContentConnector';

function EditDelayProfileModal({ isOpen, onModalClose, ...otherProps }) {
  return (
    <Modal
      isOpen={isOpen}
      onModalClose={onModalClose}
    >
      <EditDelayProfileModalContentConnector
        {...otherProps}
        onModalClose={onModalClose}
      />
    </Modal>
  );
}

EditDelayProfileModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onModalClose: PropTypes.func.isRequired
};

export default EditDelayProfileModal;
