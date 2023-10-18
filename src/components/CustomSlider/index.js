import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ViewSlider from './ViewSlider';
import './style.css';

class CustomSlider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.value,
    }
  }

  onChange = (num) => {
    this.setState({
      value: num,
    }, () => {
      typeof this.props.onChange === 'function' && this.props.onChange(num)
    })
  }

  render() {
    return (
      <ViewSlider
        step={1}
        max={this.props.max}
        min={this.props.min}
        value={this.state.value}
        onChange={this.onChange}
        name={this.props.name}
        label={this.props.label}
        answerId={this.props.answerId}
        readOnly={this.props.readOnly}
      />
    )
  }
}

CustomSlider.defaultProps = {
  min: 0,
  value: 0,
  name: 'slider',
  label: '',
  readOnly: false,
}

CustomSlider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number.isRequired,
  value: PropTypes.number,
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  answerId: PropTypes.number.isRequired,
  readOnly: PropTypes.bool,
}

export default CustomSlider;
