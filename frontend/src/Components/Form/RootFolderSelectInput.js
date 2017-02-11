import React, { Component, PropTypes } from 'react';
import FileBrowserModal from 'Components/FileBrowser/FileBrowserModal';
import SelectInput from './SelectInput';

class RootFolderSelectInput extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isAddNewRootFolderModalOpen: false
    };
  }

  //
  // Listeners

  onChange = ({ name, value }) => {
    if (value === 'addNew') {
      this.setState({ isAddNewRootFolderModalOpen: true });
    } else {
      this.props.onChange({ name, value });
    }
  }

  onNewRootFolderSelect = ({ value }) => {
    this.props.onNewRootFolderSelect(value);
  }

  onAddRootFolderModalClose = () => {
    this.setState({ isAddNewRootFolderModalOpen: false });
  }

  //
  // Render

  render() {
    return (
      <div>
        <SelectInput
          {...this.props}
          onChange={this.onChange}
        />

        <FileBrowserModal
          isOpen={this.state.isAddNewRootFolderModalOpen}
          name="rootFolderPath"
          value=""
          onChange={this.onNewRootFolderSelect}
          onModalClose={this.onAddRootFolderModalClose}
        />
      </div>
    );
  }
}

RootFolderSelectInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  onNewRootFolderSelect: PropTypes.func.isRequired
};

export default RootFolderSelectInput;
