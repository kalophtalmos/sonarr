import React, { Component, PropTypes } from 'react';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import * as calendarViews from './calendarViews';
import CalendarHeaderConnector from './Header/CalendarHeaderConnector';
import DaysOfWeekConnector from './Day/DaysOfWeekConnector';
import CalendarDaysConnector from './Day/CalendarDaysConnector';
import AgendaConnector from './Agenda/AgendaConnector';

class Calendar extends Component {

  //
  // Render

  render() {
    const {
      isFetching,
      isPopulated,
      error,
      view
    } = this.props;

    return (
      <div>
        {
          isFetching && !isPopulated &&
            <LoadingIndicator />
        }

        {
          !isFetching && !!error &&
            <div>Unable to load the calendar</div>
        }

        {
          !error && isPopulated &&
            <div>
              {
                view === calendarViews.AGENDA ?
                  <div>
                    <CalendarHeaderConnector />
                    <AgendaConnector />
                  </div> :

                  <div>
                    <CalendarHeaderConnector />
                    <DaysOfWeekConnector />
                    <CalendarDaysConnector />
                  </div>
              }

            </div>
        }
      </div>
    );
  }
}

Calendar.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isPopulated: PropTypes.bool.isRequired,
  error: PropTypes.object,
  view: PropTypes.string.isRequired
};

export default Calendar;
