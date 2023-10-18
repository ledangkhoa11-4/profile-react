import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Countdown from 'components/Countdown';
import { connect } from 'react-redux';
import TimeAgo from 'react-timeago';
import { CHILD_ROUTE_PATH } from 'services/config';
import { POLL_STATUS } from 'services/constant';
import { STATUS_CAN_CHANGE } from '../../constant';

const localeProject = window.locale.Project;
const localePoll = window.locale.Poll;

function getListStatus(status) {
  if (status === POLL_STATUS.CLOSE) {
    return STATUS_CAN_CHANGE.filter(item => item === POLL_STATUS.CLOSE)
  }
  return STATUS_CAN_CHANGE
}

let Poll = ({
  projectId,
  poll,
  localeCommon,
  user,
  // openUpdateEndDateModal,
  openResultModal,
  onDeletePoll,
  gotoPayment,
  onChangeStatus,
}) => {
  const renderVideo = () => {
    if (!poll.question || !poll.question.media_type ||
        poll.question.media_type.toLowerCase() !== 'video') {
      return null;
    }
    return (
      <div className="embed-responsive embed-responsive-16by9">
        <iframe src={poll.question.fullMedia} className="embed-responsive-item" title="video-thumbnail"/>
      </div>
    )
  }

  const renderImage = () => {
    if (!poll.question || !poll.question.media_type ||
        poll.question.media_type.toLowerCase() !== 'image') {
      return null;
    }
    return <img src={poll.question.fullMedia} alt="thumbnail"/>
  }

  const editPollUrl = CHILD_ROUTE_PATH.PROJECT_EDIT_POLL
                        .replace(':projectId', projectId)
                        .replace(':pollId', poll.id);
  const userAvatar = user.fullAvatar ||
          require('assets/images/user-icon-placeholder.png');
  const listStatus = getListStatus(poll.status)
  // const now = new Date();
  // const toDate = new Date(poll.to_date);
  // const hasExpired = now > toDate;

  return (
    <div className="detail full">
      <div className="head-detail table-detail">
        <div className="col">
          <div className="avatar">
            <img src={userAvatar} alt={user.name}/>
          </div>
        </div>
        <div className="infor col">
          <div className="display-row">
            <div className="title">
              <span className="text name">{ user.name }</span>
              <div className="time">
                <TimeAgo date={poll.created_at} minPeriod={60} />
              </div>
            </div>
            {
              poll.tag ?
                <div className="toolbar negative-margin-top">
                  <ul className="tag">
                    <li className="poll">
                      <a role="button" title="poll">
                        { poll.tag }
                      </a>
                    </li>
                  </ul>
                </div> : null
            }
          </div>
          <div className="display-row">
            <div className="question">
              <span className="poll-name">{ poll.name }</span>
              <span className="end-date">
                <Countdown
                  endDate={poll.to_date}
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
      <div className="content-detail">
        <div className="caption">
          {
            poll.question ?
              <p>{ poll.question.question }</p> : null
          }
          { renderImage() }
        </div>
        { renderVideo() }
      </div>
      <div className="detail-view">    
        {
          listStatus.indexOf(poll.status) > -1 ?
            <div className="group-link pull-left status-action">
              <div className="select-style">
                <select
                  value={poll.status}
                  onChange={evt => {
                    onChangeStatus(evt.target.value, poll)
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
            poll.status !== POLL_STATUS.CLOSE ?
              <Link className="btn btn-grey" to={editPollUrl}>
                <span className="material-icons">mode_edit </span>
                <span className="text">{ localeProject.PollTab.EDIT_BTN }</span>
              </Link> : null
          }
          {
            poll.status !== POLL_STATUS.DONE &&
            poll.status !== POLL_STATUS.LAUNCH &&
            poll.status !== POLL_STATUS.PAUSE ?
              <a
                role="button"
                title="Result"
                className="btn btn-grey"
                onClick={() => {
                  onDeletePoll(poll)
                }}
              >
                <span className="material-icons">delete</span>
                <span className="text">
                  {localeProject.PollTab.DELETE_POLL_BTN}
                </span>
              </a> : null
          }
          {
            poll.status === POLL_STATUS.LAUNCH ||
            poll.status === POLL_STATUS.PAUSE ?
              <a
                role="button"
                title="Result"
                className="btn btn-grey"
                onClick={() => {
                  openResultModal(poll)
                }}
              >
                <span className="material-icons">&#xE801;</span>
                <span className="text">
                  {localePoll.RESULT_BUTTON}
                </span>
              </a> : null
          }
          {
            poll.status === POLL_STATUS.DONE ?
              (
                <button
                  className="btn btn-grey"
                  onClick={() => {
                    gotoPayment(poll)
                  }}
                >
                  <span className="material-icons">credit_card</span>
                  <span className="text">{ localeProject.PollTab.PAYMENT_BTN }</span>
                </button>
              ) : null
          }
        </div>
      </div>
    </div>
  );
}

Poll.propTypes = {
  poll: PropTypes.shape({
    name: PropTypes.string,
    question: PropTypes.object,
  })
};

Poll = connect((state, ownProps) => ({
  ...ownProps,
  user: state.user,
}))(Poll);

export default Poll;
