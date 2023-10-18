import React from 'react';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';
import {
  isEmpty,
} from 'lodash';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import Countdown from 'components/Countdown';
import { renderReadOnlyAnswers } from './utils';
import { checkCoinPollSurvey } from 'services/utils';

let PollItem = (props) => {
  const {
    poll,
    onOpenResultPopup,
    onOpenAnswerPopup,
    localeCommon,
    user,
  } = props;
  const question = poll.question || {},
        vote = (poll.vote && poll.vote[0]) || {};

  const renderVideo = () => {
    if (!poll.question || !poll.question.media_type ||
        poll.question.media_type.toLowerCase() !== 'video') {
      return null;
    }
    if(poll.question.fullMedia.search('iframe') !== -1){
      const  fulllinkvideo  = poll.question.fullMedia.substr(poll.question.fullMedia.search('https://www.youtube.com/embed'), 41);
      return (
        <div className="embed-responsive embed-responsive-16by9">
          <iframe src={fulllinkvideo} className="embed-responsive-item" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
      )
    }else{
      if (poll.question.fullMedia.search('https://youtu.be') !== -1) {
        const  fulllinkvideo  = poll.question.fullMedia.replace('https://youtu.be','https://www.youtube.com/embed');
        return (
          <div className="embed-responsive embed-responsive-16by9">
            <iframe src={fulllinkvideo} className="embed-responsive-item" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
        )
      } else {
        const  fulllinkvideo  = poll.question.fullMedia.substr( 0, 43).replace('https://www.youtube.com/watch?v=','https://www.youtube.com/embed/');
        return (
          <div className="embed-responsive embed-responsive-16by9">
            <iframe src={fulllinkvideo} className="embed-responsive-item" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
        )
      }
    }
  }

  const renderImage = () => {
    if (!question.media_type || question.media_type.toLowerCase() !== 'image') {
      return null;
    }
    return <img src={question.fullMedia} alt="thumbnail"/>
  }

  if (!question.question) {
    return null;
  }
  const userAvatar = poll.user.fullAvatar ||
    require('assets/images/user-icon-placeholder.png');
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
    <div className="detail full">
      <div className="head-detail table-detail">
        <div className="col">
          <div className="avatar">
            <img src={userAvatar} alt={poll.user.name}/>
          </div>
        </div>
        <div className="infor col">
          <div className="display-row">
            <div className="title">
              <span className="text name">{ poll.user.name }</span>
              <div className="time">
                <TimeAgo date={poll.created_at} minPeriod={60} />
              </div>
            </div>
            <div className="toolbar negative-margin-top">
              <ul className="tag">
                {
                  poll.tag ?
                    <li className="movie">
                      <a role="button" title={ poll.tag }>{ poll.tag }</a>
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
            question ?
            <p>{ question.question }</p> : null
          }
          { renderImage() }
        </div>
        { renderVideo() }
        <div className="vote-content">
          { renderReadOnlyAnswers(props) }
        </div>
      </div>
      <div className="detail-view">
        <ul className="list-point-awards pull-left">
          <li>
            <span className="num">{ poll.point }</span>
            <span className="text">
              {props.localePoll.POINT_RESULT}
            </span>
          </li>
          <li>
            <span className="num">{ poll.number_vote_count }</span>
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
                  <a
                    role="button"
                    title="Vote"
                    className="btn btn-grey"
                    onClick={() => {
                      if (vote) {
                        const timeVote = new Date(vote.timeVote)
                        const currentTime = new Date()
                        if (timeVote.getTime() <= currentTime.getTime()) {
                          return Alert.warning(props.localePoll.EXPIRED_TIME_VOTE_MSG)
                        }
                      }
                      if (!checkCoinPollSurvey(poll)) {
                        return;
                      }
                      onOpenAnswerPopup(poll, vote);
                    }}
                  >
                    <span className="fa fa-thumbs-up"/>
                    <span className="text">
                      {
                        poll.user_vote_count ? props.localePoll.REVOTE_BUTTON : props.localePoll.VOTE_BUTTON
                      }
                    </span>
                  </a>
                </li> : null
            }
            {
              poll.user.id === user.id || poll.view_result ?
                <li>
                  <a
                    role="button"
                    title="Result"
                    className="btn btn-grey"
                    onClick={() => {
                      onOpenResultPopup(poll)
                    }}
                  >
                    <span className="material-icons">&#xE801;</span>
                    <span className="text">
                      {props.localePoll.RESULT_BUTTON}
                    </span>
                  </a>
                </li> : null
            }
          </ul>
        </div>
      </div>
    </div>
  );
}

PollItem.propTypes = {
  onOpenResultPopup: PropTypes.func,
  onOpenAnswerPopup: PropTypes.func,
  poll: PropTypes.object,
}

export default connect((state, ownProps) => ({
  ...ownProps,
  user: state.user
}))(PollItem);
