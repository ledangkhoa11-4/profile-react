import React from 'react';
import { isEmpty, map } from 'lodash';
import Alert from 'react-s-alert';
import TimeAgo from 'react-timeago';
import { checkCoinPollSurvey } from 'services/utils';

const Poll = (props) => {
  if (!props.listPolls.length) {
    return null
  }

  return map(props.listPolls, (poll, idx) => {
    const { user } = poll;
    const vote = (poll.vote && poll.vote[0]) || {};
    const expiredTimeVote = !isEmpty(vote) ? new Date(vote.timeVote) : false;
    const toDate = new Date(poll.to_date);
    const now = new Date();
    let isExpiredPoll = (now.getTime() > toDate.getTime());
    let isExpiredTimeVote = false;
    
    if (expiredTimeVote) {
      isExpiredTimeVote = now.getTime() > expiredTimeVote.getTime()
    }

    return (
      <div className={'detail'} key={idx}>
        name meno
        <div className="head-detail">
          <div className="title">
            <div className="avatar">
              <img src={user.fullAvatar} alt={user.name}/>
            </div>
            <div className="name-time">
              <span className="text name">{user.name}</span>
              <div className="time">
                <TimeAgo date={poll.created_at} minPeriod={60} />
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
          </div>
        </div>
        <div className="social">
            {
              !isExpiredPoll ?
                !isExpiredTimeVote ?
                  <ul className="list-icons">
                    {
                      (props.user.id === user.id) || poll.view_social ?
                        <li>
                          <a
                            title="vote"
                            onClick={() => {
                              props.openVotePollModal(poll, poll.vote)
                            }}
                          >
                            <span className="material-icons">&#xE80D;</span>
                            <span className="text">
                              {props.localeHome.SHARE_BUTTON}
                            </span>
                          </a>
                        </li> : null
                    }
                    <li className="vote-poll-dashboard">
                      <a
                        title="vote"
                        onClick={() => {
                          if (vote.timeVote) {
                            const timeVote = new Date(vote.timeVote)
                            const currentTime = new Date()
                            if (timeVote.getTime() <= currentTime.getTime()) {
                              return Alert.warning(props.localePoll.EXPIRED_TIME_VOTE_MSG)
                            }
                          }
                          if (!checkCoinPollSurvey(poll)) {
                            return;
                          }
                          props.openVotePollModal(poll, vote)
                        }}
                      >
                        {
                          !isEmpty(vote) ?
                            <span>
                              <span className="fa fa-check-circle-o"/>
                              <span className="text">
                                {props.localeHome.VOTED_BUTTON}
                              </span>
                            </span> :
                            <span>
                              <span className="fa fa-thumbs-up"/>
                              <span className="text">
                                {props.localeHome.VOTE_BUTTON}
                              </span>
                            </span>
                        }
                      </a>
                    </li>
                  </ul> : null
                :
                (
                  <p className="poll-expired-dashboard">Hết hạn</p>
                )
            }
        </div>
      </div>
    )
  })
}

export default Poll;
