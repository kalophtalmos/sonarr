import React, { Component, PropTypes } from 'react';
import formatBytes from 'Utilities/Number/formatBytes';
import { icons, inputTypes, kinds } from 'Helpers/Props';
import Button from 'Components/Link/Button';
import Icon from 'Components/Icon';
import FormGroup from 'Components/Form/FormGroup';
import FormLabel from 'Components/Form/FormLabel';
import FormInputGroup from 'Components/Form/FormInputGroup';
import ModalContent from 'Components/Modal/ModalContent';
import ModalHeader from 'Components/Modal/ModalHeader';
import ModalBody from 'Components/Modal/ModalBody';
import ModalFooter from 'Components/Modal/ModalFooter';
import styles from './DeleteSeriesModalContent.css';

class DeleteSeriesModalContent extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      deleteFiles: false
    };
  }

  //
  // Listeners

  ondeleteFilesChange = ({ value }) => {
    this.setState({ deleteFiles: value });
  }

  onDeleteSeriesConfirmed = () => {
    const deleteFiles = this.state.deleteFiles;

    this.setState({ deleteFiles: false });
    this.props.onDeletePress(deleteFiles);
  }

  //
  // Render

  render() {
    const {
      title,
      path,
      episodeFileCount,
      sizeOnDisk,
      onModalClose
    } = this.props;

    const deleteFiles = this.state.deleteFiles;
    let deleteFilesLabel = `Delete ${episodeFileCount} Episode Files`;
    let deleteFilesHelpText = 'Delete the episode files and series folder';

    if (episodeFileCount === 0) {
      deleteFilesLabel = 'Delete Series Folder';
      deleteFilesHelpText = 'Delete the series folder and it\'s contents';
    }

    return (
      <ModalContent
        onModalClose={onModalClose}
      >
        <ModalHeader>
          Delete - {title}
        </ModalHeader>

        <ModalBody>
          <div className={styles.pathContainer}>
            <Icon
              className={styles.pathIcon}
              name={icons.FOLDER}
            />

            {path}
          </div>

          <FormGroup>
            <FormLabel>
              {
                deleteFilesLabel
              }
            </FormLabel>
            <FormInputGroup
              type={inputTypes.CHECK}
              name="deleteFiles"
              value={deleteFiles}
              helpText={deleteFilesHelpText}
              kind={kinds.DANGER}
              onChange={this.ondeleteFilesChange}
            />
          </FormGroup>

          {
            deleteFiles &&
              <div className={styles.deleteFilesMessage}>
                <div>The series folder <strong>{path}</strong> and all it's content will be deleted.</div>

                {
                  !!episodeFileCount &&
                    <div>{episodeFileCount} episode files totaling {formatBytes(sizeOnDisk)}</div>
                }
              </div>
          }

        </ModalBody>

        <ModalFooter>
          <Button onPress={onModalClose}>
            Close
          </Button>

          <Button
            kind={kinds.DANGER}
            onPress={this.onDeleteSeriesConfirmed}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    );
  }
}

DeleteSeriesModalContent.propTypes = {
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  episodeFileCount: PropTypes.number.isRequired,
  sizeOnDisk: PropTypes.number.isRequired,
  onDeletePress: PropTypes.func.isRequired,
  onModalClose: PropTypes.func.isRequired
};

DeleteSeriesModalContent.defaultProps = {
  episodeFileCount: 0
};

export default DeleteSeriesModalContent;
