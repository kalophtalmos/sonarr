import moment from 'moment';
import React, { PropTypes } from 'react';
import { align, icons } from 'Helpers/Props';
import Button from 'Components/Link/Button';
import Icon from 'Components/Icon';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import Menu from 'Components/Menu/Menu';
import MenuButton from 'Components/Menu/MenuButton';
import MenuContent from 'Components/Menu/MenuContent';
import ViewMenuItem from 'Components/Menu/ViewMenuItem';
import * as calendarViews from 'Calendar/calendarViews';
import CalendarHeaderViewButton from './CalendarHeaderViewButton';
import styles from './CalendarHeader.css';

function getTitle(time, start, end, view, longDateFormat) {
  const timeMoment = moment(time);
  const startMoment = moment(start);
  const endMoment = moment(end);

  if (view === 'day') {
    return timeMoment.format(longDateFormat);
  } else if (view === 'month') {
    return timeMoment.format('MMMM YYYY');
  } else if (view === 'agenda') {
    return 'Agenda';
  }

  let startFormat = 'MMM D YYYY';
  let endFormat = 'MMM D YYYY';

  if (startMoment.isSame(endMoment, 'month')) {
    startFormat = 'MMM D';
    endFormat = 'D YYYY';
  } else if (startMoment.isSame(endMoment, 'year')) {
    startFormat = 'MMM D';
    endFormat = 'MMM D YYYY';
  }

  return `${startMoment.format(startFormat)} \u2014 ${endMoment.format(endFormat)}`;
}

function CalendarHeader(props) {
  const {
    isFetching,
    time,
    start,
    end,
    view,
    longDateFormat,
    isSmallScreen,
    onCalendarViewChange,
    onTodayPress,
    onPreviousPress,
    onNextPress
  } = props;

  const title = getTitle(time, start, end, view, longDateFormat);

  return (
    <div>
      {
        isSmallScreen &&
          <div className={styles.titleMobile}>
            {title}
          </div>
      }

      <div className={styles.header}>
        <div className={styles.navigationButtons}>
          <Button
            buttonGroupPosition={align.LEFT}
            onPress={onPreviousPress}
          >
            <Icon name={icons.PAGE_PREVIOUS} />
          </Button>

          <Button
            buttonGroupPosition={align.RIGHT}
            onPress={onNextPress}
          >
            <Icon name={icons.PAGE_NEXT} />
          </Button>

          <Button
            className={styles.todayButton}
            onPress={onTodayPress}
          >
            Today
          </Button>
        </div>

        {
          !isSmallScreen &&
            <div className={styles.titleDesktop}>
              {title}
            </div>
        }

        <div className={styles.viewButtonsContainer}>
          {
            isFetching &&
              <LoadingIndicator
                className={styles.loading}
                size={20}
              />
          }

          {
            isSmallScreen ?
              <Menu className={styles.viewMenu}>
                <MenuButton>
                  <Icon
                    name={icons.VIEW}
                    size={22}
                  />
                </MenuButton>

                <MenuContent alignMenu={align.RIGHT}>
                  <ViewMenuItem
                    name={calendarViews.WEEK}
                    selectedView={view}
                    onPress={onCalendarViewChange}
                  >
                    Week
                  </ViewMenuItem>

                  <ViewMenuItem
                    name={calendarViews.FORECAST}
                    selectedView={view}
                    onPress={onCalendarViewChange}
                  >
                    Forecast
                  </ViewMenuItem>

                  <ViewMenuItem
                    name={calendarViews.DAY}
                    selectedView={view}
                    onPress={onCalendarViewChange}
                  >
                    Day
                  </ViewMenuItem>

                  <ViewMenuItem
                    name={calendarViews.AGENDA}
                    selectedView={view}
                    onPress={onCalendarViewChange}
                  >
                    Agenda
                  </ViewMenuItem>
                </MenuContent>
              </Menu> :

              <div className={styles.viewButtons}>
                <CalendarHeaderViewButton
                  view={calendarViews.MONTH}
                  selectedView={view}
                  buttonGroupPosition={align.LEFT}
                  onPress={onCalendarViewChange}
                />

                <CalendarHeaderViewButton
                  view={calendarViews.WEEK}
                  selectedView={view}
                  buttonGroupPosition={align.CENTER}
                  onPress={onCalendarViewChange}
                />

                <CalendarHeaderViewButton
                  view={calendarViews.FORECAST}
                  selectedView={view}
                  buttonGroupPosition={align.CENTER}
                  onPress={onCalendarViewChange}
                />

                <CalendarHeaderViewButton
                  view={calendarViews.DAY}
                  selectedView={view}
                  buttonGroupPosition={align.CENTER}
                  onPress={onCalendarViewChange}
                />

                <CalendarHeaderViewButton
                  view={calendarViews.AGENDA}
                  selectedView={view}
                  buttonGroupPosition={align.RIGHT}
                  onPress={onCalendarViewChange}
                />
              </div>
          }
        </div>
      </div>
    </div>
  );
}

CalendarHeader.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  time: PropTypes.string.isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  view: PropTypes.oneOf(calendarViews.all).isRequired,
  isSmallScreen: PropTypes.bool.isRequired,
  longDateFormat: PropTypes.string.isRequired,
  onCalendarViewChange: PropTypes.func.isRequired,
  onTodayPress: PropTypes.func.isRequired,
  onPreviousPress: PropTypes.func.isRequired,
  onNextPress: PropTypes.func.isRequired
};

export default CalendarHeader;
