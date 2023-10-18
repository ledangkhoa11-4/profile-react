import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';
import Countdown from 'components/Countdown';
import { connect } from 'react-redux';
import ClipboardJS from 'clipboard';
import { findAncestor } from 'services/utils';
import { POLL_STATUS } from 'services/constant';
import { CHILD_ROUTE_PATH } from 'services/config';
import { STATUS_CAN_CHANGE } from '../../constant';

const localeProject = window.locale.Project;
const localePoll = window.locale.Poll;

function getListStatus(status) {
  if (status === POLL_STATUS.CLOSE) {
    return STATUS_CAN_CHANGE.filter(item => item === POLL_STATUS.CLOSE)
  }
  return STATUS_CAN_CHANGE
}

class Survey extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isShowPopover: false,
    }
  }

  componentWillMount() {
    document.documentElement.addEventListener('click', this.onClosePopoverOutside, true)
  }

  componentWillUnmount() {
    document.documentElement.removeEventListener('click', this.onClosePopoverOutside, true)
  }

  onClosePopoverOutside = (e) => {
    const linkEl = findAncestor(e.target, '.link')
    
    if (this.state.isShowPopover && !linkEl) {
      this.closePopover()
    }
  }

  openPopover = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    this.setState({ isShowPopover: true })
  }

  closePopover = () => {
    if (this.clipboard && typeof this.clipboard.destroy === 'function') {
      this.clipboard.destroy()
    }
    this.setState({ isShowPopover: false })
  }

  copyLinkToClipBoard = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.closePopover()
  }

  renderGetLinkPopover() {
    const { survey } = this.props
    if (!survey.view_social || !this.state.isShowPopover) {
      return null
    }
    
    const linkEl = `#_${survey.id}`
    this.clipboard = new ClipboardJS(linkEl, {
      container: linkEl,
      text: (trigger) => {
        return trigger.getAttribute('data-href')
      }
    })

    return (
      <div className="wrapper-get-link">
        <a
          id={`_${survey.id}`}
          role="button"
          data-href={survey.shareSocial}
          className="link" onClick={this.copyLinkToClipBoard}
          data-clipboard-action="copy"
        >
          <span className="fa fa-clone"/>
          Get survey link
        </a>
      </div>
    )
  }

  render() {
    const {
      localeCommon,
      survey,
      user,
      // openUpdateEndDateModal,
      openResultModal,
      onDeleteSurvey,
      gotoPayment,
      onChangeStatus,
    } = this.props;

    const editSurveyUrl = CHILD_ROUTE_PATH.PROJECT_EDIT_SURVEY
            .replace(':projectId', survey.project_id)
            .replace(':surveyId', survey.id);
    const userAvatar = user.fullAvatar ||
            require('assets/images/user-icon-placeholder.png');
    const listStatus = getListStatus(survey.status)
    // const now = new Date();
    // const toDate = new Date(survey.to_date);
    // const hasExpired = now > toDate;

    return (
      <div className="detail full">
        <div className="head-detail  table-detail">
          <div className="col">
            <div className="avatar">
              <img src={userAvatar} alt={ user.name }/>
            </div>
          </div>
          <div className="infor col">
            <div className="display-row">
              <div className="title">
                <span className="text name">{ user.name }</span>
                <div className="time">
                  <TimeAgo date={survey.created_at} minPeriod={60} />
                </div>
              </div>
              {
                survey.tag ?
                  <div className="toolbar negative-margin-top">
                    <ul className="tag">
                      <li className="survey">
                        <a role="button" title="survey">{survey.tag}</a>
                      </li>
                      {
                        survey.view_social ?
                          <li>
                            <span className="fa fa-ellipsis-h" onClick={this.openPopover}/>
                          </li> : null
                      }
                    </ul>
                  </div> : null
              }
            </div>
            <div className="display-row">
              <div className="question">
                <span className="poll-name">{ survey.name }</span>
                <span className="end-date">
                  <Countdown
                    endDate={survey.to_date}
                    prefix={localeCommon.TIME_LEFT_TEXT}
                    dayLabel={localeCommon.DAY}
                    hourLabel={localeCommon.HOUR}
                    minuteLabel={localeCommon.MINUTE}
                    secondLabel={localeCommon.SECOND}
                    expiredLabel={localeCommon.EXPIRED_TIME_TEXT}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="detail-view">
          {
            listStatus.indexOf(survey.status) > -1 ?
              <div className="group-link pull-left status-action">
                <div className="select-style">
                  <select
                    value={survey.status}
                    onChange={evt => {
                      onChangeStatus(evt.target.value, survey)
                    }}
                  >
                    {
                      listStatus.map((item, idx) => (
                        <option key={idx} value={item}>
                          {item}
                        </option>
                      ))
                    }
                  </select>
                </div>
              </div> : null
          }
          <div className="group-link text-center">
            {
              survey.status !== POLL_STATUS.CLOSE ?
                <Link className="btn btn-grey" to={editSurveyUrl}>
                  <span className="material-icons">mode_edit </span>
                  <span className="text">{ localeProject.PollTab.EDIT_BTN }</span>
                </Link> : null
            }
            {
              survey.status !== POLL_STATUS.DONE &&
              survey.status !== POLL_STATUS.LAUNCH &&
              survey.status !== POLL_STATUS.PAUSE ?
                <a
                  role="button"
                  title="Result"
                  className="btn btn-grey"
                  onClick={() => {
                    onDeleteSurvey(survey)
                  }}
                >
                  <span className="material-icons">delete</span>
                  <span className="text">
                    {localeProject.PollTab.DELETE_POLL_BTN}
                  </span>
                </a> : null
            }
            {
              survey.gizmoLink === null && (survey.status === POLL_STATUS.LAUNCH || survey.status === POLL_STATUS.PAUSE)
               ?
                <a
                  role="button"
                  title="Result"
                  className="btn btn-grey"
                  onClick={() => {
                    openResultModal(survey)
                  }}
                >
                  <span className="material-icons">&#xE801;</span>
                  <span className="text">
                    {localePoll.RESULT_BUTTON}
                  </span>
                </a> : null
            }
            {
              survey.status === POLL_STATUS.DONE ?
                <button
                  className="btn btn-grey"
                  onClick={() => {
                    gotoPayment(survey)
                  }}
                >
                  <span className="material-icons">credit_card</span>
                  <span className="text">{ localeProject.PollTab.PAYMENT_BTN }</span>
                </button> : null
            }
          </div>
        </div>
        {
          this.renderGetLinkPopover()
        }
      </div>
    );
  }
}

Survey = connect((state, ownProps) => ({
  ...ownProps,
  user: state.user,
}))(Survey);

Survey.propTypes = {
  survey: PropTypes.shape({
    name: PropTypes.string,
  })
};

export default Survey;
