import React, { Component, PropTypes } from 'react';
import { locationShape } from 'react-router';
import SignalRConnector from 'Components/SignalRConnector';
import AppUpdatedModalConnector from 'App/AppUpdatedModalConnector';
import ConnectionLostModalConnector from 'App/ConnectionLostModalConnector';
import PageHeader from './Header/PageHeader';
import PageSidebar from './Sidebar/PageSidebar';
import styles from './Page.css';

class Page extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isSidebarVisible: !props.isSmallScreen,
      isUpdatedModalOpen: false,
      isConnectionLostModalOpen: false
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isUpdated && !this.props.isUpdated) {
      this.setState({ isUpdatedModalOpen: true });
    }

    if (nextProps.isDisconnected !== this.props.isDisconnected) {
      this.setState({ isConnectionLostModalOpen: nextProps.isDisconnected });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  //
  // Listeners

  onResize = () => {
    this.props.onResize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  onSidebarToggle = () => {
    this.setState({ isSidebarVisible: !this.state.isSidebarVisible });
  }

  onSidebarVisibleChange = (isSidebarVisible) => {
    this.setState({ isSidebarVisible });
  }

  onUpdatedModalClose = () => {
    this.setState({ isUpdatedModalOpen: false });
  }

  onConnectionLostModalClose = () => {
    this.setState({ isConnectionLostModalOpen: false });
  }

  //
  // Render

  render() {
    const {
      className,
      location,
      children,
      isSmallScreen
    } = this.props;

    return (
      <div className={className}>
        <SignalRConnector />

        <PageHeader
          onSidebarToggle={this.onSidebarToggle}
        />

        <div className={styles.main}>
          <PageSidebar
            location={location}
            isSmallScreen={isSmallScreen}
            isSidebarVisible={this.state.isSidebarVisible}
            onSidebarVisibleChange={this.onSidebarVisibleChange}
          />

          {children}
        </div>

        <AppUpdatedModalConnector
          isOpen={this.state.isUpdatedModalOpen}
          onModalClose={this.onUpdatedModalClose}
        />

        <ConnectionLostModalConnector
          isOpen={this.state.isConnectionLostModalOpen}
          onModalClose={this.onConnectionLostModalClose}
        />
      </div>
    );
  }
}

Page.propTypes = {
  className: PropTypes.string,
  location: locationShape.isRequired,
  children: PropTypes.node.isRequired,
  isSmallScreen: PropTypes.bool.isRequired,
  isUpdated: PropTypes.bool.isRequired,
  isDisconnected: PropTypes.bool.isRequired,
  onResize: PropTypes.func.isRequired
};

Page.defaultProps = {
  className: styles.page
};

export default Page;
