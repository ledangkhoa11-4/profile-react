import React from 'react';
import Countdown from 'components/Countdown';

const ShortSurveyInfo = (props) => {
  const {
    localeCommon,
    localeSurvey,
    surveyInfo,
  } = props;
  const { user } = surveyInfo;
  const userAvatar = user && user.fullAvatar ? user.fullAvatar :
    require('assets/images/user-icon-placeholder.png');
  const userName = user && user.name ? user.name : '';

  return (
    <div className="box-dashboard detail-survey">
      <div className="inne">
        <div className="detail full">
          <div className="head-detail table-detail">
            <div className="col">
              <div className="avatar">
                <img src={userAvatar} alt={userName}/>
              </div>
            </div>
            <div className="infor col">
              <div className="display-row">
                <div className="title">
                  <span>
                    {localeSurvey.CREATE_BY} &nbsp;
                    <strong>{userName}</strong>
                  </span>
                </div>
                <div className="toolbar negative-margin-top">
                  <ul className="tag">
                    <li className="survey">
                      <span role="button" title="survey">survey</span>
                    </li>
                    <li className="movie">
                      <span title={surveyInfo.tag}>{surveyInfo.tag}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="display-row">
                <div className="question">
                  <span>
                    {localeSurvey.CREATE_TIME} &nbsp;
                    {surveyInfo.created_at}
                  </span>
                  <span className="end-date">
                    <Countdown
                      endDate={surveyInfo.to_date}
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
        </div>
      </div>
    </div>
  )
}

export default ShortSurveyInfo;
