import React, { Component } from 'react';
import { cloneDeep } from 'lodash';
import PropTypes from 'prop-types';

class InputNumber extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.value || props.defaultValue
    }
  }

  componentWillReceiveProps(nextProps) {
    if ( this.props.value !== nextProps.value ) {
      this.setState({ value: nextProps.value || '' })
    }
  }

  onInput = (e) => {
    const { target } = e;
    const value = target.value.replace(/[^0-9]/gi, '')
    this.setState({ value }, () => {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(value, target.name)
      } else if (typeof this.props.onChangeDefault === 'function') {
        this.props.onChangeDefault(target)
      }
    })
  }

  render() {
    const propsClone = cloneDeep(this.props)
    delete propsClone.value;
    delete propsClone.defaultValue;
    delete propsClone.onChange;
    delete propsClone.onChangeDefault;
    delete propsClone.onInput;

    return (
      <input
        type="tel"
        onInput={this.onInput}
        onChange={this.onInput}
        value={this.state.value}
        {...propsClone}
      />
    );
  }
}

InputNumber.defaultProps = {
  value: '',
  defaultValue: '',
  readOnly: false,
}

InputNumber.proptypes = {
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
}

export default InputNumber;
