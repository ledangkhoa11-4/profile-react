const DateBetween = function(startDate, endDate, isShowFullTime, timeLabel) {
  let second = 1000;
  let minute = second * 60;
  let hour = minute * 60;
  let day = hour * 24;
  let distance = endDate - startDate;
  const {
    dayLabel,
    hourLabel,
    minuteLabel,
    secondLabel,
  } = timeLabel;

  if (distance < 0) {
    return false;
  }

  let days = Math.floor(distance / day);
  let hours = Math.floor((distance % day) / hour);
  let minutes = Math.floor((distance % hour) / minute);
  let seconds = Math.floor((distance % minute) / second);


  let between = [];

  days > 0 && between.push(`${days} ${dayLabel || 'd'}`);
  hours > 0 && between.push(`${hours} ${hourLabel || 'h'}`);
  minutes > 0 && between.push(`${minutes} ${minuteLabel || 'm'}`);
  seconds > 0 && between.push(`${seconds} ${secondLabel || 's'}`);

  if (isShowFullTime) {
    return between.join(' ')
  }

  // else will return individual time (days or hours or munites or seconds)
  if (between.length) {
    return between[0]
  }
}

export default DateBetween;
