import React, { PropTypes } from 'react';
import Icon from 'Components/Icon';
import MenuButton from 'Components/Menu/MenuButton';
import styles from './ToolbarMenuButton.css';

function ToolbarMenuButton(props) {
  const {
    iconName,
    text,
    ...otherProps
  } = props;

  return (
    <MenuButton
      className={styles.menuButton}
      {...otherProps}
    >
      <Icon
        className={styles.menuButtonIcon}
        name={iconName}
        size={22}
      />
      <span className={styles.menuButtonText}>
        {text}
      </span>
    </MenuButton>
  );
}

ToolbarMenuButton.propTypes = {
  iconName: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};

export default ToolbarMenuButton;
