import React, { Component, PropTypes } from 'react';
import { align, icons } from 'Helpers/Props';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageToolbar from 'Components/Page/Toolbar/PageToolbar';
import PageToolbarSection from 'Components/Page/Toolbar/PageToolbarSection';
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';
import FilterMenu from 'Components/Menu/FilterMenu';
import MenuContent from 'Components/Menu/MenuContent';
import FilterMenuItem from 'Components/Menu/FilterMenuItem';
import CalendarLinkModal from './iCal/CalendarLinkModal';
import Legend from './Legend/Legend';
import CalendarConnector from './CalendarConnector';

class CalendarPage extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isCalendarLinkModalOpen: false
    };
  }

  //
  // Listeners

  onFilterMenuItemPress = (filterKey, unmonitored) => {
    this.props.onUnmonitoredChange(unmonitored);
  }

  onGetCalendarLinkPress = () => {
    this.setState({ isCalendarLinkModalOpen: true });
  }

  onGetCalendarLinkModalClose = () => {
    this.setState({ isCalendarLinkModalOpen: false });
  }

  //
  // Render

  render() {
    const {
      unmonitored,
      colorImpairedMode
    } = this.props;

    return (
      <PageContent title="Calendar">
        <PageToolbar>
          <PageToolbarSection>
            <PageToolbarButton
              iconName={icons.CALENDAR}
              title="Get iCal link"
              onPress={this.onGetCalendarLinkPress}
            />
          </PageToolbarSection>

          <PageToolbarSection alignContent={align.RIGHT}>
            <FilterMenu>
              <MenuContent alignMenu={align.RIGHT}>
                <FilterMenuItem
                  name="unmonitored"
                  value={true}
                  filterKey="unmonitored"
                  filterValue={unmonitored}
                  onPress={this.onFilterMenuItemPress}
                >
                  All
                </FilterMenuItem>

                <FilterMenuItem
                  name="unmonitored"
                  value={false}
                  filterKey="unmonitored"
                  filterValue={unmonitored}
                  onPress={this.onFilterMenuItemPress}
                >
                  Monitored Only
                </FilterMenuItem>
              </MenuContent>
            </FilterMenu>
          </PageToolbarSection>
        </PageToolbar>

        <PageContentBody>
          <CalendarConnector />
          <Legend colorImpairedMode={colorImpairedMode} />
        </PageContentBody>

        <CalendarLinkModal
          isOpen={this.state.isCalendarLinkModalOpen}
          onModalClose={this.onGetCalendarLinkModalClose}
        />
      </PageContent>
    );
  }
}

CalendarPage.propTypes = {
  unmonitored: PropTypes.bool.isRequired,
  colorImpairedMode: PropTypes.bool.isRequired,
  onUnmonitoredChange: PropTypes.func.isRequired
};

export default CalendarPage;
