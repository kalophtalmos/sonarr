import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { map } from 'Helpers/elementChildren';
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';
import styles from './PageSidebarItem.css';

function PageSidebarItem(props) {
  const {
    iconName,
    title,
    to,
    isActiveParent,
    isChildItem,
    statusComponent: StatusComponent,
    children
  } = props;

  return (
    <div
      className={classNames(
        styles.item,
        isActiveParent && styles.isActiveItem
      )}
    >
      <Link
        className={classNames(
          isChildItem ? styles.childLink : styles.link,
          isActiveParent && styles.isActiveParentLink
        )}
        activeClassName={styles.isActiveLink}
        onlyActiveOnIndex={!isChildItem}
        to={to}
      >
        {
          !!iconName &&
            <span className={styles.iconContainer}>
              <Icon
                name={iconName}
              />
            </span>
        }

        <span className={isChildItem && styles.noIcon}>
          {title}
        </span>

        {
          !!StatusComponent &&
            <span className={styles.status}>
              <StatusComponent />
            </span>
        }
      </Link>

      {
        children &&
          map(children, (child) => {
            return React.cloneElement(child, { isChildItem: true });
          })
      }
    </div>
  );
}

PageSidebarItem.propTypes = {
  iconName: PropTypes.string,
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  isActiveParent: PropTypes.bool,
  isChildItem: PropTypes.bool.isRequired,
  statusComponent: PropTypes.func,
  children: PropTypes.node
};

PageSidebarItem.defaultProps = {
  isChildItem: false
};

export default PageSidebarItem;
