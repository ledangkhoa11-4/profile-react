import React from 'react';

// const pad = (num, len) => (1e15 + num + '').slice(-len);

const SurveyVoteInfo = (props) => {
  const {
    localePoll,
    localeSurvey,
    surveyInfo,
    currentQuestions,
    // currentQuestionId,
  } = props;
  
  return (
    <div className="box-dashboard detail-survey">
      <div className="inne">
        <div className="detail full">
          <div className="detail-view">
            <div className="pull-left">
              <div className="number">
                <span className="title">
                  { localeSurvey.LABEL_QUESTION_ANSWERED }
                </span>
                &nbsp;
                <strong>
                  { currentQuestions.length - 1}
                </strong>
              </div>
            </div>
            <div className="list-point-awards pull-right">
              <ul>
                <li>
                  <span className="num">
                    {surveyInfo.point || 0}
                  </span>
                  <span className="text">
                    {localePoll.POINT_RESULT}
                  </span>
                </li>
                <li>
                  <span className="num">
                    {surveyInfo.voted || 0}
                  </span>
                  <span className="text">
                    {localePoll.VOTE_RESULT}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SurveyVoteInfo;
