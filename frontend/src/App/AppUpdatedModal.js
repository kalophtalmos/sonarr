import React, { PropTypes } from 'react';
import { kinds } from 'Helpers/Props';
import Button from 'Components/Link/Button';
import Modal from 'Components/Modal/Modal';
import ModalContent from 'Components/Modal/ModalContent';
import ModalHeader from 'Components/Modal/ModalHeader';
import ModalBody from 'Components/Modal/ModalBody';
import ModalFooter from 'Components/Modal/ModalFooter';
import styles from './AppUpdatedModal.css';

function AppUpdatedModal(props) {
  const {
    isOpen,
    version,
    onSeeChangesPress,
    onModalClose
  } = props;

  return (
    <Modal
      isOpen={isOpen}
      onModalClose={onModalClose}
    >
      <ModalContent onModalClose={onModalClose}>
        <ModalHeader>
          Sonarr Updated
        </ModalHeader>

        <ModalBody>
          <div>
            Version <span className={styles.version}>{version}</span> of Sonarr has been installed, in order to get the latest changes you'll need to reload Sonarr.
          </div>

          <div className={styles.subMessage}>
            Press Okay to refresh now.
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            onPress={onSeeChangesPress}
          >
            What's new?
          </Button>

          <Button
            kind={kinds.PRIMARY}
            onPress={onModalClose}
          >
            Okay
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

AppUpdatedModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  version: PropTypes.string.isRequired,
  onSeeChangesPress: PropTypes.func.isRequired,
  onModalClose: PropTypes.func.isRequired
};

export default AppUpdatedModal;
