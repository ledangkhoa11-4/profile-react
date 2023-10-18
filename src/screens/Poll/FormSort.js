import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Select from 'react-select';
import CustomDatePicker from 'components/CustomDatePicker';
import { INPUT_NAME } from 'services/constant';
import { convertDateToString, getDateInMonth, jsonEqual } from 'services/utils';

const {
  FROM_DATE,
  TO_DATE,
  STATUS,
  POINT,
  EXPIRED,
} = INPUT_NAME.FORM_SORT_POLL;

class FormSort extends Component {
  constructor() {
    super();
    this.state = {
      [FROM_DATE]: null,
      [TO_DATE]: null,
      [STATUS]: '',
      [POINT]: '',
      [EXPIRED]: 'no',
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !jsonEqual(this.state, nextState);
  }
  
  componentDidMount() {
    this.filterOnDidMount()
  }

  filterOnDidMount() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const maxDate = getDateInMonth(month + 1, year);
    
    this.setState({
      [FROM_DATE]: moment(new Date(year, month, 1)),
      [TO_DATE]: moment(new Date(year, month, maxDate)),
    }, () => {
      const data = this.getDataToFilter();
      this.props.onFilterPolls(data);
    })
  }
  
  onChange = (val, name) => {
    if (jsonEqual(this.state[name], val)) {
      return;
    }
    this.setState({
      [name]: val,
    }, () => {
      const data = this.getDataToFilter();
      this.props.onFilterPolls(data);
    });
  }

  getDataToFilter() {
    const fromDate = this.state[FROM_DATE] ? 
      convertDateToString(this.state[FROM_DATE].toDate()).split(' ')[0] : '';
    const toDate = this.state[TO_DATE] ?
      convertDateToString(this.state[TO_DATE].toDate()).split(' ')[0] : '';

    return {
      [FROM_DATE]: fromDate,
      [TO_DATE]: toDate,
      [STATUS]: this.state[STATUS].value,
      [POINT]: this.state[POINT].value,
      [EXPIRED]: this.state[EXPIRED].value,
    };
  }

  onSubmit = (e) => {
    e.preventDefault();
    // const formData = new FormData(e.target);
    // this.props.onFilterPolls(formData);
  }

  render() {
    const {localePoll} = this.props;
    return (
      <form name="sort" className="form form-sort filter-poll" onSubmit={this.onSubmit}>
        <div className="line">
          <div className="form-group">
            <label htmlFor="from" className="label">
              {localePoll.FROM}
            </label>
            <CustomDatePicker
              name={FROM_DATE}
              dateFormat="DD-MM-YYYY"
              time={false}
              selected={this.state[FROM_DATE]}
              onChange={(val) => this.onChange(val, FROM_DATE)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="to" className="label">
              {localePoll.TO}
            </label>
            <CustomDatePicker
              name={TO_DATE}
              dateFormat="DD-MM-YYYY"
              time={false}
              selected={this.state[TO_DATE]}
              onChange={(val) => this.onChange(val, TO_DATE)}
            />
          </div>
        </div>
        <div className="line">
          <div className="form-group">
            <label htmlFor="status" className="label">
              {localePoll.STATUS}
            </label>
            <Select
              name={STATUS}
              value={this.state[STATUS]}
              options={[
                { value: '', label: localePoll.STATUS_ALL },
                { value: 'non_voted', label: localePoll.STATUS_UNVOTE },
                { value: 'voted', label: localePoll.STATUS_VOTE },
              ]}
              searchable={false}
              clearable={false}
              onChange={(value) => this.onChange(value, STATUS)}
            />
          </div>
          <div className="form-group">
            <label htmlFor={POINT} className="label">
              {localePoll.POINT}
            </label>
            <Select
              name={POINT}
              value={this.state[POINT]}
              options={[
                { value: '', label: localePoll.POINT_ALL },
                { value: 'ascending', label: localePoll.POINT_ASC },
                { value: 'descending', label: localePoll.POINT_DES }
              ]}
              searchable={false}
              clearable={false}
              onChange={(value) => this.onChange(value, POINT)}
            />
          </div>
          <div className="form-group">
            <label htmlFor={EXPIRED} className="label">
              {localePoll.EXPIRED}
            </label>
            <Select
              name={EXPIRED}
              value={this.state[EXPIRED]}
              options={[
                // { value: '', label: localePoll.EXPIRED_ALL },
                { value: 'yes', label: localePoll.EXPIRED_YES },
                { value: 'no', label: localePoll.EXPIRED_NO }
              ]}
              searchable={false}
              clearable={false}
              onChange={(value) => this.onChange(value, EXPIRED)}
            />
          </div>
        </div>
      </form>
    )
  }
}

FormSort.propTypes = {
  onFilterPolls: PropTypes.func,
}

export default FormSort;
