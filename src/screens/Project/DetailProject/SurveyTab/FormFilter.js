import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { INPUT_NAME } from 'services/constant';
import { jsonEqual } from 'services/utils';

const {
  STATUS,
  SEARCH,
} = INPUT_NAME.FILTER_POLL_PROJECT;
const localeCreate = window.locale.Create;

class FormFilter extends Component {
  state = {
    [STATUS]: '',
    [SEARCH]: '',
  }

  onChange = (value, name) => {
    this.prevState = this.state;
    this.setState({ [name]: value }, () => {
      if (name !== SEARCH) {
        this.onSubmit();
      }
    });
  }

  onSubmit = (e) => {
    e && e.preventDefault();
    if (!jsonEqual(this.state, this.prevState)) {
      this.props.onFilter(this.state)
    }
  }

  render() {
        
    return (
      <form name="sort" className="form form-sort filter-in-project" onSubmit={this.onSubmit}>
        <div className="form-group">
          <label htmlFor="status" className="label">
            {this.props.localeProject.STATUS}
          </label>
          <Select
            name={STATUS}
            value={this.state[STATUS]}
            options={[
              { value: '', label: localeCreate.FILTER_STATE_ALL },
              { value: 'completed', label: localeCreate.FILTER_STATE_COMPLETED },
              { value: 'running', label: localeCreate.FILTER_STATE_RUNNING },
              { value: 'done', label: localeCreate.FILTER_STATE_DONE },
              { value: 'save', label: localeCreate.FILTER_STATE_SAVE },
            ]}
            searchable={false}
            clearable={false}
            onChange={(val) => this.onChange(val.value, STATUS)}
            className="custom-select"
          />
        </div>
        <div className="form-group">
          <label htmlFor="search" className="label">
            {this.props.localeProject.SEARCH_POLL_SURVEY}
          </label>
          <div className="group-search">
            <input
              id={SEARCH}
              name={SEARCH}
              type="text"
              className="input"
              onChange={(e) => this.onChange(e.target.value, SEARCH)}
            />
            <span className="material-icons">search</span>
          </div>
        </div>
      </form>
    );
  }
}

FormFilter.propTypes = {
  onFilter: PropTypes.func,
  projectId: PropTypes.string.isRequired,
}

export default FormFilter;
