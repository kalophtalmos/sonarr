import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import * as calendarViews from 'Calendar/calendarViews';
import CalendarDayConnector from './CalendarDayConnector';
import styles from './CalendarDays.css';

class CalendarDays extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      todaysDate: moment().startOf('day').toISOString()
    };

    this.updateTimeoutId = null;
  }

  // Lifecycle

  componentDidMount() {
    const view = this.props.view;

    if (view === calendarViews.MONTH) {
      this.scheduleUpdate();
    }
  }

  componentWillUnmount() {
    this.clearUpdateTimeout();
  }

  //
  // Control

  scheduleUpdate = () => {
    this.clearUpdateTimeout();
    const todaysDate = moment().startOf('day');
    const diff = moment().diff(todaysDate.add(1, 'day'));

    this.setState({
      todaysDate: todaysDate.toISOString()
    });

    this.updateTimeoutId = setTimeout(this.scheduleUpdate, diff);
  }

  clearUpdateTimeout = () => {
    if (this.updateTimeoutId) {
      clearTimeout(this.updateTimeoutId);
    }
  }

  //
  // Render

  render() {
    return (
      <div className={styles.days}>
        {
          this.props.dates.map((date) => {
            return (
              <CalendarDayConnector
                key={date}
                date={date}
                isTodaysDate={date === this.state.todaysDate}
              />
            );
          })
        }
      </div>
    );
  }
}

CalendarDays.propTypes = {
  dates: PropTypes.arrayOf(PropTypes.string).isRequired,
  view: PropTypes.string.isRequired
};

export default CalendarDays;
