import React, { Component, PropTypes } from 'react';
import Autosuggest from 'react-autosuggest';
import classNames from 'classnames';
import { icons } from 'Helpers/Props';
import Icon from 'Components/Icon';
import FileBrowserModal from 'Components/FileBrowser/FileBrowserModal';
import FormInputButton from './FormInputButton';
import styles from './PathInput.css';

class PathInput extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isFileBrowserModalOpen: false
    };
  }

  //
  // Control

  getSuggestionValue({ path }) {
    return path;
  }

  renderSuggestion({ path }, { query }) {
    const lastSeparatorIndex = query.lastIndexOf('\\') || query.lastIndexOf('/');

    if (lastSeparatorIndex === -1) {
      return (
        <span>{path}</span>
      );
    }

    return (
      <span>
        <span className={styles.pathMatch}>
          {path.substr(0, lastSeparatorIndex)}
        </span>
        {path.substr(lastSeparatorIndex)}
      </span>
    );
  }

  //
  // Listeners

  onChange = (event, { newValue }) => {
    this.props.onChange({
      name: this.props.name,
      value: newValue
    });
  }

  onKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const path = this.props.paths[0];

      this.props.onChange({
        name: this.props.name,
        value: path.path
      });

      if (path.type !== 'file') {
        this.props.onFetchPaths(path.path);
      }
    }
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.props.onFetchPaths(value);
  }

  onSuggestionsClearRequested = () => {
    this.props.onClearPaths();
  }

  onSuggestionSelected = (event, { suggestionValue }) => {
    this.props.onFetchPaths(suggestionValue);
  }

  onFileBrowserOpenPress = () => {
    this.setState({ isFileBrowserModalOpen: true });
  }

  onFileBrowserModalClose = () => {
    this.setState({ isFileBrowserModalOpen: false });
  }

  //
  // Render

  render() {
    const {
      className,
      inputClassName,
      name,
      value,
      placeholder,
      paths,
      hasError,
      hasWarning,
      hasFileBrowser,
      onChange
    } = this.props;

    const inputProps = {
      className: classNames(
        inputClassName,
        hasError && styles.hasError,
        hasWarning && styles.hasWarning,
        hasFileBrowser && styles.hasFileBrowser
      ),
      name,
      value,
      placeholder,
      autoComplete: 'off',
      spellCheck: false,
      onChange: this.onChange,
      onKeyDown: this.onKeyDown
    };

    const theme = {
      container: styles.pathInputContainer,
      containerOpen: styles.pathInputContainerOpen,
      suggestionsContainer: styles.pathContainer,
      suggestionsList: styles.pathList,
      suggestion: styles.pathListItem,
      suggestionFocused: styles.pathFocused
    };

    return (
      <div className={className}>
        <Autosuggest
          id={name}
          inputProps={inputProps}
          theme={theme}
          suggestions={paths}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          onSuggestionSelected={this.onSuggestionSelected}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        />

        {
          hasFileBrowser &&
            <div>
              <FormInputButton
                className={styles.fileBrowserButton}
                onPress={this.onFileBrowserOpenPress}
              >
                <Icon name={icons.FOLDER_OPEN} />
              </FormInputButton>

              <FileBrowserModal
                isOpen={this.state.isFileBrowserModalOpen}
                name={name}
                value={value}
                onChange={onChange}
                onModalClose={this.onFileBrowserModalClose}
              />
            </div>
        }
      </div>
    );
  }
}

PathInput.propTypes = {
  className: PropTypes.string.isRequired,
  inputClassName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  paths: PropTypes.array.isRequired,
  hasError: PropTypes.bool,
  hasWarning: PropTypes.bool,
  hasFileBrowser: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onFetchPaths: PropTypes.func.isRequired,
  onClearPaths: PropTypes.func.isRequired
};

PathInput.defaultProps = {
  className: styles.pathInputWrapper,
  inputClassName: styles.path,
  value: '',
  hasFileBrowser: true
};

export default PathInput;
