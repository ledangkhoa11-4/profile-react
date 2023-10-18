import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DateBetween from './DateBetween';

class Countdown extends Component {
  constructor (props) {
    super(props)
    this.state = { remaining: null }
  }

  componentDidMount() {
    if (this.props.endDate) {
      this.tick()
      this.interval = setInterval(this.tick, 1000)
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.endDate !== nextProps.endDate) {
      window.clearInterval(this.interval)
      this.tick()
      this.interval = setInterval(this.tick, 1000)
    }
  }
  

  tick = () => {
    const {
      endDate,
      isShowFullTime,
      callback,
      dayLabel,
      hourLabel,
      minuteLabel,
      secondLabel,
    } = this.props;
    const timeLabel = {
      dayLabel,
      hourLabel,
      minuteLabel,
      secondLabel,
    }
    const startDate = new Date()
    const _endDate = new Date(endDate)
    const remaining = DateBetween(startDate, _endDate, isShowFullTime, timeLabel)

    if(remaining === false){
      window.clearInterval(this.interval)
      callback && callback()
    }

    this.setState({
      remaining,
    })
  }

  render() {
    if (!this.props.endDate) {
      return null
    }

    return (
      <div className="react-count-down">
       <span className="date"> {this.state.remaining}</span>
       {
         this.state.remaining ?
          <span className="prefix">
            &nbsp;{this.props.prefix}
          </span> : ` ${this.props.expiredLabel}`
       }
      </div>
    )
  };
}

Countdown.propTypes = {
  expiredLabel: PropTypes.string,
  isShowFullTime: PropTypes.bool,
  prefix: PropTypes.string,
  endDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
}

Countdown.defaultProps = {
  expiredLabel: 'time expired',
  isShowFullTime: false,
  prefix: '',
}

export default Countdown;
