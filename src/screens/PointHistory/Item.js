import React from 'react';

const localePointHistory = window.locale.PointHistory;
const getMonthText = (month) => {
  var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return months[month];
}

const HistoryItem = (props) => {
  const dateTime = new Date(props.created_at)
  const month = dateTime.getMonth()
  const numberOfExpirationDatesStar = window.numberOfExpirationDatesStar || 180;
  const expiration = new Date(props.created_at);
  expiration.setDate(expiration.getDate() + parseInt(numberOfExpirationDatesStar));
  var day = expiration.getDate() + "";
  var monthexpiration = (expiration.getMonth() + 1) + "";
  var year = expiration.getFullYear() + "";
  var hour = expiration.getHours() + "";
  var minutes = expiration.getMinutes() + "";
  var seconds = expiration.getSeconds() + "";

  day = checkZero(day);
  monthexpiration = checkZero(monthexpiration);
  year = checkZero(year);
  hour = checkZero(hour);
  minutes = checkZero(minutes);
  seconds = checkZero(seconds);
  const datetime = day + "/" + monthexpiration + "/" + year + " " + hour + ":" + minutes + ":" + seconds;

  function checkZero(data){
    if(data.length == 1){
      data = "0" + data;
    }
    return data;
  }
  return (
    <div className="item">
      <div className="col text-center">
        <span className="date">
          { dateTime.getDate() }
        </span>
        <span className="month-year">
          {getMonthText(month)}, {dateTime.getFullYear()}
        </span>
      </div>
      <div className="col">
        { props.content }
      </div>
      <div className="col text-center">
        <span className="point">
          { props.point }
        </span>
        <span>{localePointHistory.POINT_TEXT}</span>
      </div>
    </div>
  )
}

export default HistoryItem;
