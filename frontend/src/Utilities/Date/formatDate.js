import moment from 'moment';

function formatDate(date, dateFormat) {
  if (!date) {
    return false;
  }

  return moment(date).format(dateFormat);
}

export default formatDate;
