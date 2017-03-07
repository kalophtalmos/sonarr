import React, { PropTypes } from 'react';
import { align, icons, kinds } from 'Helpers/Props';
import Icon from 'Components/Icon';
import Menu from 'Components/Menu/Menu';
import MenuButton from 'Components/Menu/MenuButton';
import MenuContent from 'Components/Menu/MenuContent';
import MenuItem from 'Components/Menu/MenuItem';
import styles from './PageHeaderActionsMenu.css';

function PageHeaderActionsMenu(props) {
  const {
    formsAuth,
    onRestartPress,
    onShutdownPress
  } = props;

  return (
    <div>
      <Menu>
        <MenuButton className={styles.menuButton}>
          <Icon
            name={icons.INTERACTIVE}
          />
        </MenuButton>

        <MenuContent alignMenu={align.RIGHT}>
          <MenuItem onPress={onRestartPress}>
            <Icon
              className={styles.itemIcon}
              name={icons.RESTART}
            />
            Restart
          </MenuItem>

          <MenuItem onPress={onShutdownPress}>
            <Icon
              className={styles.itemIcon}
              name={icons.SHUTDOWN}
              kind={kinds.DANGER}
            />
            Shutdown
          </MenuItem>

          {
            formsAuth &&
              <div className={styles.separator} />
          }

          {
            formsAuth &&
              <MenuItem
                to={`${window.Sonarr.urlBase}/logout`}
                noRouter={true}
              >
                <Icon
                  className={styles.itemIcon}
                  name={icons.LOGOUT}
                />
                Logout
              </MenuItem>
          }
        </MenuContent>
      </Menu>
    </div>
  );
}

PageHeaderActionsMenu.propTypes = {
  formsAuth: PropTypes.bool.isRequired,
  onRestartPress: PropTypes.func.isRequired,
  onShutdownPress: PropTypes.func.isRequired
};

export default PageHeaderActionsMenu;
