import React from 'react';
import { isEmpty } from 'lodash';
import TimeAgo from 'react-timeago';
import Countdown from 'components/Countdown';
import { renderAnswers } from '../utils';
import { ENUM } from '../../Project/constant';

import FakeComment from '../../../components/FakeComment'

const {
  IMAGE,
  VIDEO,
} = ENUM.QUESTION_MEDIA_TYPE;

const Poll = (props) => {
  const { poll } = props;

  if (isEmpty(poll)) {
    return null;
  }
  const question = poll.question || {},
        vote = (poll.vote && poll.vote[0]) || {};

  const renderVideo = () => {
    if (!question.media_type || question.media_type.toLowerCase() !== VIDEO) {
      return null;
    }
    return (
      <div className="embed-responsive embed-responsive-16by9">
        <iframe src={question.fullMedia} className="embed-responsive-item" title="video-thumbnail" />
      </div>
    )
  }

  const renderImage = () => {
    if (!question.media_type || question.media_type.toLowerCase() !== IMAGE) {
      return null;
    }
    return <img src={question.fullMedia} alt="thumbnail" />
  }

  if (!question.question) {
    return null;
  }
  const userAvatar = poll.user.fullAvatar ||
    require('assets/images/avatar.jpg');
  const expiredTimeVote = !isEmpty(vote) ? new Date(vote.timeVote) : false;
  const toDate = new Date(poll.to_date);
  const now = new Date();
  let isShowVoteBtn = (now.getTime() < toDate.getTime());
  
  if (expiredTimeVote) {
    const minusTime = expiredTimeVote.getTime() - props.currentTime.getTime()
    if (minusTime <= 0) {
      isShowVoteBtn = false;
    }
  }

  return (
    <div className="box-dashboard">
      <div className="inne">
        <div className="detail full">
          <div className="head-detail table-detail">
            <div className="col">
              <div className="avatar">
                <img 
                  src={userAvatar}
                  alt={poll.user.name}
                />
              </div>
            </div>
            <div className="infor col">
              <div className="display-row">
                <div className="title">
                  <span className="text name">{poll.user.name}</span>
                  <div className="time">
                    <TimeAgo date={poll.created_at} minPeriod={60} />
                  </div>
                </div>
                <div className="toolbar negative-margin-top">
                  <ul className="tag">
                    <li className="poll">
                      <a role="button" title="poll">poll</a>
                    </li>
                    {
                      poll.tag ?
                        <li className="movie">
                          <a role="button" title={poll.tag}>{poll.tag}</a>
                        </li> : null
                    }
                    {
                      !isEmpty(vote) ?
                        <li className="voted-icon">
                          <span className="fa fa-check"/>
                        </li> : null
                    }
                  </ul>
                </div>
              </div>
              <div className="display-row">
                <div className="question">
                  <span className="poll-name">{poll.name}</span>
                  <span className="end-date">
                    <Countdown
                      endDate={poll.to_date}
                      prefix={props.localeCommon.TIME_LEFT_TEXT}
                      dayLabel={props.localeCommon.DAY}
                      hourLabel={props.localeCommon.HOUR}
                      minuteLabel={props.localeCommon.MINUTE}
                      secondLabel={props.localeCommon.SECOND}
                      expiredLabel={props.localeCommon.EXPIRED_TIME_TEXT}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="content-detail border-top">            
            <div className="caption">
              <p>{question.question}</p>
              {renderImage()}
            </div>
            {renderVideo()}
          </div>

          <form className="vote-content" onSubmit={props.votePoll}>
            {
              renderAnswers({
                ...props.poll,
                localePoll: props.localePoll,
                userVoted: props.userVoted,
              })
            }

            <FakeComment/>

            <div className="detail-view">
              <ul className="list-point-awards pull-left">
                <li>
                  <span className="num">{poll.point}</span>
                  <span className="text">
                    {props.localePoll.POINT_RESULT}
                  </span>
                </li>
                <li>
                  <span className="num">{poll.number_vote_count}</span>
                  <span className="text">
                    {props.localePoll.VOTE_RESULT}
                  </span>
                </li>
              </ul>
              <div className="group-link pull-right">
                <ul>
                  {
                    isShowVoteBtn ?
                      <li>
                        <button
                          title="Vote"
                          className="btn btn-grey"
                          type="submit"
                        >
                          <span className="fa fa-thumbs-up"/>
                          <span className="text">
                            {
                              poll.user_vote_count ? 
                                props.localePoll.REVOTE_BUTTON :
                                props.localePoll.VOTE_BUTTON
                            }
                          </span>
                        </button>
                      </li> : null
                  }
                  {/* <li>
                    <a
                      role="button"
                      title="Result"
                      className="btn btn-grey"
                      onClick={() => {
                        // onOpenResultPopup()
                      }}
                    >
                      <span className="material-icons">&#xE801;</span>
                      <span className="text">
                        {props.localePoll.RESULT_BUTTON}
                      </span>
                    </a>
                  </li> */}
                </ul>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Poll;
