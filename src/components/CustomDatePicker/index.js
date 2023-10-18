import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { jsonEqual } from 'services/utils';

/*
* CustomInput must be a statefull component. Follow by
* react-datepicker document
*/
class CustomInput extends Component {
  render() {
    const classWrapInput = this.props.hasInputReadOnlyInput ?
      'input custom-input-calendar has-input' : 'input custom-input-calendar'
    return (
      <div
        className={classWrapInput}
        onClick={this.props.onClick}
      >
        {
          this.props.hasInputReadOnlyInput ?
            (
              <input
                name={this.props.nameInput}
                value={this.props.value}
                readOnly={true}
                className="form-control"
                data-answer-id={this.props.answerId}
              />
            ) :
            this.props.value
        }
        <span className="fa fa-calendar"/>
      </div>
    )
  }
}

CustomInput.propTypes = {
  onClick: PropTypes.func,
  value: PropTypes.string
};

class CustomDatePicker extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: props.selected
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!jsonEqual(this.props, nextProps)) {
      this.setState({
        selected: nextProps.selected
      })
    }
  }  

  render() {
    return (
      <DatePicker
        { ...this.props }
        disabled={this.props.readOnlyInput}
        selected={this.state.selected}
        onChange={(moment) => {
          this.setState({ selected: moment }, () => {
            typeof this.props.onChange === 'function' && this.props.onChange(moment)
          })
        }}
        customInput={<CustomInput
          nameInput={this.props.name}
          hasInputReadOnlyInput={this.props.hasInputReadOnlyInput}
          answerId={this.props.answerId}
        />}
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={15}
        showMonthDropdown
        useShortMonthInDropdown
        showTimeSelect={!!this.props.time}
        input={this.props.isEdit}
        timeFormat="HH:mm"
        timeIntervals={30}
        timeCaption="time"
      />
    )
  }
}

CustomDatePicker.defaultProps = {
  isEdit: true,
  time: true,
  hasInputReadOnlyInput: false,
}

export default CustomDatePicker;
