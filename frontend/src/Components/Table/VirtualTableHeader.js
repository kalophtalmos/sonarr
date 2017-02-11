import React, { PropTypes } from 'react';
import styles from './VirtualTableHeader.css';

function VirtualTableHeader({ children }) {
  return (
    <div className={styles.header}>
      {children}
    </div>
  );
}

VirtualTableHeader.propTypes = {
  children: PropTypes.node
};

export default VirtualTableHeader;
