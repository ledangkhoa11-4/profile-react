import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { INPUT_NAME, POLL_SURVEY_STATUS } from 'services/constant';
import { jsonEqual } from 'services/utils';
import { ENUM } from '../../constant';
import { BASE_URL } from 'services/config';

const {
  STATUS,
  SEARCH,
} = INPUT_NAME.FILTER_POLL_SURVEY_PROJECT;
const {
  WAITINGFORAPPROVAL,
  WAILTINGFORPAYMENT,
  REFUSE,
  DRAFT,
  PAUSE,
  FINISH,
  RUNNING,
  SCHEDULED,
  EXPIRED
} = POLL_SURVEY_STATUS;
const {
  POLL,
  SURVEY
} = ENUM.TYPE;
const TYPE = 'type';
const localeCreate = window.locale.Create;

class FormFilter extends Component {
  state = {
    [STATUS]: '',
    [SEARCH]: '',
    [TYPE]: '',
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
    const select_all = BASE_URL + '/assetsnew/icon/select_all.png';
    const status_icon = BASE_URL + '/assetsnew/icon/status_icon.png';
    const survey_icon = BASE_URL + '/assetsnew/icon/survey_2.png';
    const poll_icon = BASE_URL + '/assetsnew/icon/poll.png';
    const { isadmin } = this.props.user;
    return (
      <form name="sort" className="form form-inline filter-in-project" onSubmit={this.onSubmit}>
        <div className="form-search-detail-project">
          <div className="row">
              <div className="form-group  col-xs-12 col-sm-4">
                <div className="label-select-custom">
                    {
                      this.state[TYPE] === '' ? <img src={select_all}/>
                      : this.state[TYPE] === SURVEY ? <img src={survey_icon}/>
                      : <img src={poll_icon}/>
                    }{this.props.localeProject.TYPE_OF_VOTES}:
                </div>
                <Select
                  name={TYPE}
                  value={this.state[TYPE]}
                  options={[
                    {
                      value: '',
                      label:
                        <div className={this.state[TYPE] === '' ? 'active' : ''}>
                          <img src={select_all}/>{localeCreate.FILTER_STATE_ALL}
                        </div>
                    },
                    {
                      value: SURVEY,
                      label:
                        <div className={this.state[TYPE] === SURVEY ? 'active' : ''}>
                          <img src={survey_icon}/>{this.props.localeProject.SELECT_SURVEY}
                        </div>
                    },
                    {
                      value: POLL,
                      label:
                        <div className={this.state[TYPE] === POLL ? 'active' : ''}>
                          <img src={poll_icon}/>{this.props.localeProject.SELECT_POLL}
                        </div>
                     
                    },
                  ]}
                  searchable={false}
                  clearable={false}
                  onChange={(val) => this.onChange(val.value, TYPE)}
                  className="custom-select-filter"
                />
              </div>
              <div className="form-group col-xs-12 col-sm-4">
                <div className="label-select-custom left">
                  <img src={status_icon} />{this.props.localeProject.STATUS}:
                </div>
                <Select
                name={STATUS}
                value={this.state[STATUS]}
                options={
                  isadmin ?
                    [
                      {
                        value: '',
                        label:
                          <div className={this.state[STATUS] === '' ? 'active' : ''}>
                            <i className="fa fa-circle box-color-blue" aria-hidden="true"></i>{localeCreate.FILTER_STATE_ALL}
                          </div>
                      },
                      {
                        value: RUNNING, 
                        label: 
                          <div className={this.state[STATUS] === RUNNING ? 'active' : ''}>
                            <i className="fa fa-circle box-color-green" aria-hidden="true"></i>{this.props.localeProject.STATUS_RUNNING}
                          </div> 
                      },
                      {
                        value: PAUSE, 
                        label: 
                          <div className={this.state[STATUS] === PAUSE ? 'active' : ''}>
                            <i className="fa fa-circle box-color-yellow" aria-hidden="true"></i>{this.props.localeProject.STATUS_PAUSE}
                          </div> 
                      },
                      {
                        value: FINISH, 
                        label: 
                          <div className={this.state[STATUS] === FINISH ? 'active' : ''}>
                            <i className="fa fa-circle  box-color-red" aria-hidden="true"></i>{this.props.localeProject.STATUS_FINISH}
                          </div> 
                      },
                      {
                        value: DRAFT, 
                        label:  
                          <div className={this.state[STATUS] === DRAFT ? 'active box-color-blue-2' : 'box-color-blue-2'}>
                            <i className="fa fa-circle-o" aria-hidden="true"></i>{this.props.localeProject.STATUS_DRAFT}
                          </div>
                      },
                      {
                        value: SCHEDULED, 
                        label:  
                          <div className={this.state[STATUS] === SCHEDULED ? 'active box-color-green-2' : 'box-color-green-2'}>
                            <i className="fa fa-circle-o" aria-hidden="true"></i>{this.props.localeProject.STATUS_SCHEDULED}
                          </div>
                      },
                      {
                        value: EXPIRED, 
                        label: 
                          <div className={this.state[STATUS] === EXPIRED ? 'active box-color-a7a7a7' : ' box-color-a7a7a7'}>
                            <i className="fa fa-circle-o" aria-hidden="true"></i>{this.props.localeProject.STATUS_EXPIRED}
                          </div> 
                      }
                    ]
                  :
                    [
                      {
                        value: '',
                        label:
                          <div className={this.state[STATUS] === '' ? 'active' : ''}>
                            <i className="fa fa-circle box-color-blue" aria-hidden="true"></i>{localeCreate.FILTER_STATE_ALL}
                          </div>
                      },
                      {
                        value: RUNNING, 
                        label: 
                          <div className={this.state[STATUS] === RUNNING ? 'active' : ''}>
                            <i className="fa fa-circle box-color-green" aria-hidden="true"></i>{this.props.localeProject.STATUS_RUNNING}
                          </div> 
                      },
                      {
                        value: PAUSE, 
                        label: 
                          <div className={this.state[STATUS] === PAUSE ? 'active' : ''}>
                            <i className="fa fa-circle box-color-yellow" aria-hidden="true"></i>{this.props.localeProject.STATUS_PAUSE}
                          </div> 
                      },
                      {
                        value: FINISH, 
                        label: 
                          <div className={this.state[STATUS] === FINISH ? 'active' : ''}>
                            <i className="fa fa-circle  box-color-red" aria-hidden="true"></i>{this.props.localeProject.STATUS_FINISH}
                          </div> 
                      },
                      {
                        value: DRAFT, 
                        label:  
                          <div className={this.state[STATUS] === DRAFT ? 'active box-color-blue-2' : 'box-color-blue-2'}>
                            <i className="fa fa-circle-o" aria-hidden="true"></i>{this.props.localeProject.STATUS_DRAFT}
                          </div>
                      },
                      {
                        value: WAITINGFORAPPROVAL, 
                        label: 
                          <div className={this.state[STATUS] === WAITINGFORAPPROVAL ? 'active box-color-pink' : 'box-color-pink'}>
                            <i className="fa fa-circle-o" aria-hidden="true"></i>{this.props.localeProject.STATUS_WAITINGFORAPPROVAL}
                          </div> 
                      },
                      {
                        value: REFUSE, 
                        label: 
                          <div className={this.state[STATUS] === REFUSE ? 'active box-color-refuse' : 'box-color-refuse'}>
                            <i className="fa fa-circle-o" aria-hidden="true"></i>{this.props.localeProject.STATUS_REFUSE}
                          </div> 
                      },
                      {
                        value: WAILTINGFORPAYMENT, 
                        label:  
                          <div className={this.state[STATUS] === WAILTINGFORPAYMENT ? 'active box-color-organ' : 'box-color-organ'}>
                            <i className="fa fa-circle-o" aria-hidden="true"></i>{this.props.localeProject.STATUS_WAILTINGFORPAYMENT}
                          </div>
                      },
                      {
                        value: SCHEDULED, 
                        label:  
                          <div className={this.state[STATUS] === SCHEDULED ? 'active box-color-green-2' : 'box-color-green-2'}>
                            <i className="fa fa-circle-o" aria-hidden="true"></i>{this.props.localeProject.STATUS_SCHEDULED}
                          </div>
                      },
                      {
                        value: EXPIRED, 
                        label: 
                          <div className={this.state[STATUS] === EXPIRED ? 'active box-color-a7a7a7' : ' box-color-a7a7a7'}>
                            <i className="fa fa-circle-o" aria-hidden="true"></i>{this.props.localeProject.STATUS_EXPIRED}
                          </div> 
                      }
                    ]
                }
                searchable={false}
                clearable={false}
                onChange={(val) => this.onChange(val.value, STATUS)}
                className="custom-select-filter status"
                />
              </div>
              <div className="form-group col-xs-12 col-sm-4 search-poll-survey">
                <input
                id={SEARCH}
                name={SEARCH}
                type="text"
                className="input form-control"
                placeholder={this.props.localeProject.SEARCH_POLL_SURVEY}
                onChange={(e) => this.onChange(e.target.value, SEARCH)}
                />
                <span className="material-icons" onClick={this.onSubmit}>search</span>
              </div>
            </div>
        </div>
      </form>
    );
  }
}

FormFilter.propTypes = {
  onFilter: PropTypes.func,
  projectId: PropTypes.string,
}

export default FormFilter;
