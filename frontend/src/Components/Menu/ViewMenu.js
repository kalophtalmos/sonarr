import React, { PropTypes } from 'react';
import { icons } from 'Helpers/Props';
import Menu from 'Components/Menu/Menu';
import ToolbarMenuButton from 'Components/Menu/ToolbarMenuButton';

function ViewMenu(props) {
  const {
    className,
    children
  } = props;

  return (
    <Menu className={className}>
      <ToolbarMenuButton
        iconName={icons.VIEW}
        text="View"
      />
        {children}
    </Menu>
  );
}

ViewMenu.propTypes = {
  className: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired
};

export default ViewMenu;
