import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ViewRating from './ViewRating';
import './style.css';

class CustomRating extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.value,
    }
  }

  changeRating = ({rating}) => {
    this.setState({
      value: rating,
    }, () => {
      typeof this.props.onChange === 'function' && this.props.onChange(rating)
    })
  }

  render() {
    return (
      <ViewRating
        value={this.state.value}
        label={this.props.label}
        changeRating={this.changeRating}
        name={this.props.name}
        answerId={this.props.answerId}
        interactive={this.props.interactive}
      />
    );
  }
}

CustomRating.defaultProps = {
  value: 0,
  name: 'rating',
  label: '',
  interactive: true,
}

CustomRating.propTypes = {
  value: PropTypes.number,
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  answerId: PropTypes.number.isRequired,
  interactive: PropTypes.bool,
}

export default CustomRating;
