import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { jsonEqual } from 'services/utils';
import './style.css';
import moment from 'moment';

class CustomDatetimePicker extends Component {
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
        <div className="box-datetime-picker">
            <DatePicker
            { ...this.props }
            disabled={this.props.readOnlyInput}
            selected={this.state.selected}
            onChange={(moment) => {
                this.setState({ selected: moment }, () => {
                    typeof this.props.onChange === 'function' && this.props.onChange(moment)
                })
            }}
            onChangeRaw={(e) => {
                const value = e.target.value;
                if(moment(value, this.props.dateFormat || "DD-MM-YYYY HH:mm").isValid()){
                    this.setState({ selected: moment(value, this.props.dateFormat || "DD-MM-YYYY HH:mm") }, (value) => {
                        typeof this.props.onChange === 'function' && this.props.onChange(this.state.selected)
                    })
                }
            }}
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={15}
            showMonthDropdown
            useShortMonthInDropdown
            showTimeSelect={!!this.props.time}
            input={this.props.isEdit}
            timeFormat="HH:mm"
            timeIntervals={30}
            timeCaption="Time"
            />
            {
                typeof this.props.id !== 'undefined' ?
                    <label className="fa fa-calendar" style={{ fontSize: '20px' }} htmlFor={this.props.id} />
                : null
            }
            
        </div>
    )
  }
}

CustomDatetimePicker.defaultProps = {
  isEdit: true,
  time: true,
  hasInputReadOnlyInput: false,
}

export default CustomDatetimePicker;
