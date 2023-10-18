import React from 'react';
import { map } from 'lodash';
import Alert from 'react-s-alert';
import moment from 'moment';
import TimeAgo from 'react-timeago';
import { checkCoinPollSurvey } from 'services/utils';

const localeSurvey = window.locale.Survey;

const Surveys = (props) => {
  if (!props.listSurveys.length) {
    return null
  }
  return map(props.listSurveys, (survey, idx) => {
    const { user } = survey;
    const now = moment();
    const toDate = moment(new Date(survey.to_date));
    const classWrapper = 'detail';
    
    return (
      <div className={classWrapper} key={idx}>
        name member 
        <div className="head-detail">
          <div className="title">
            <div className="avatar">
              <img src={user.fullAvatar} alt={user.name} />
            </div>
            <div className="name-time">
              <span className="text name">{user.name}</span>
              <div className="time">
                <TimeAgo date={survey.created_at} minPeriod={60} />
              </div>
            </div>
          </div>
        </div>
        <div className="content-detail">
          <div className="caption">
            <p>{survey.name}</p>
          </div>
        </div>
        <div className="social">
          {
            moment(now).isBefore(toDate) ?
              (!survey.vote || !survey.vote.length) ?
                <ul className="list-icons">
                  {
                    (props.user.id === user.id) || survey.view_social ?
                      <li>
                        <a
                          title="vote"
                          onClick={() => {
                            props.openVoteSurveyModal(survey)
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
                        const toDate = new Date(survey.to_date)
                        const now = new Date()
                        if ( survey.vote && survey.vote.length ) {
                          return Alert.warning(localeSurvey.NOT_REVOTE_SURVEY_MSG);
                        } else if (toDate < now) {
                          return Alert.warning(localeSurvey.EXPIRED_TIME_MSG);
                        } else if (!checkCoinPollSurvey(survey)) {
                          return;
                        }
                        props.openVoteSurveyModal(survey)
                      }}
                    >
                      <span className="fa fa-thumbs-up"/>
                      <span className="text">
                        {props.localeHome.VOTE_BUTTON}
                      </span>
                    </a>
                  </li>
                </ul> : 
                <ul className="list-icons">
                  <li className="vote-poll-dashboard">
                    <span className="fa fa-check-circle-o"/>
                    <span className="text">
                      {props.localeHome.VOTED_BUTTON}
                    </span>
                  </li>
                </ul>
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

export default Surveys;
