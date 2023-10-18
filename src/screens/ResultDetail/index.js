import React, { Component } from 'react'
import { connect } from 'react-redux'
import { find } from 'lodash'
import Alert from 'react-s-alert'

import Layout from 'components/Layout';
import ResultContent from '../Poll/ResultContent';
import { INPUT_NAME } from '../Project/constant';
import { APIs } from 'services/config'
import { requestAPI } from 'services/utils'

const localePoll = window.locale.Poll;
const localeCreate = window.locale.Create;
const localeCommon = window.locale.Common;

// result/survey/:surveyId/question/:questionId
// OR
// result/poll/:pollId
class ResultDetail extends Component {
  constructor(props) {
    super(props);

    const { history: { location } } = props;
    this.isSurvey = location && location.pathname.indexOf('/survey/') > -1;

    this.state = {
      currentSurveyPoll: null,
      currentQuestion: null,
      resultAnswer: null,
      permissionMsg: null
    }
  }

  componentDidMount = () => {
    const { match: { params } } = this.props;

    if (this.isSurvey) {
      const questionId = params && params.questionId ?
        params.questionId : '';

      this.getSurveyInfo()
      this.getResultBaseOnQuestion(questionId)
    } else {
      const pollId = params && params.pollId ?
        params.pollId : '';
      this.getPollInfo()
      this.getResultBaseOnQuestion(pollId)
    }
  }

  getSurveyInfo() {
    const { getSurveyInfo } = APIs.survey ;
    const { match: { params } } = this.props;
    const surveyId = params && params.surveyId ?
      params.surveyId : '';

    if (!surveyId) {
      return;
    }
    
    requestAPI({
      url: getSurveyInfo.url.replace('{surveyId}', surveyId),
      method: getSurveyInfo.method,
    }).then(async res => {
      if (res.success) {
        if (res.data.status_code && res.data.status_code === 403) {
          // permission view survey
          this.setState({
            permissionMsg: res.message
          })
        } else {
          this.setState({
            currentSurveyPoll: res.data,
            currentQuestion: res.data.question ? res.data.question[0] : null
          })

        }
      }
    }).catch(err => {
      Alert.error(err.message);
      console.log('Error: ', err)
    })
  }

  getPollInfo() {
    const { getPollInfoToShow } = APIs.poll ;
    const { match: { params } } = this.props;
    const pollId = params && params.pollId ?
      params.pollId : '';

    if (!pollId) {
      return;
    }
    
    requestAPI({
      url: getPollInfoToShow.url.replace('{pollId}', pollId),
      method: getPollInfoToShow.method,
    }).then(async res => {
      if (res.success) {
        if (res.data.status_code && res.data.status_code === 403) {
          // permission view survey
          this.setState({
            permissionMsg: res.message
          })
        } else {
          this.setState({
            currentSurveyPoll: res.data,
            currentQuestion: res.data.question
          })

        }
      }
    }).catch(err => {
      Alert.error(err.message);
      console.log('Error: ', err)
    })
  }

  getResultBaseOnQuestion = async (questionId, successCB) => {
    const {
      currentSurveyPoll,
      // currentQuestion,
    } = this.state;

    if (!questionId) {
      return;
    }

    const res = await this.getResultAnswer(questionId);

    if (res.success) {
      const question = currentSurveyPoll ? 
        this.isSurvey ?
          find(currentSurveyPoll.question, { id: questionId }): currentSurveyPoll.question :
        undefined;
      typeof successCB === 'function' && successCB();
      const state = {
        resultAnswer: res.data
      }

      if (question) {
        state.currentQuestion = question
      }
      this.setState(state);
    }
  }
  
  getResultAnswer = (questionId) => {
    const { match: { params } } = this.props;
    const surveyId = params && params.surveyId ?
      params.surveyId : '';
    const { getResultAnswer } = this.isSurvey ? APIs.survey : APIs.poll;

    const dataForm = this.isSurvey ? {
      survey_id: parseInt(surveyId, 10),
      question_id: questionId
    } : {
      poll_id: parseInt(questionId, 10)
    }

    return requestAPI({
      url: getResultAnswer.url,
      method: getResultAnswer.method,
      dataForm: dataForm
    })
  }

  onFilterResultWithTarget = (resultAnswer) => {
    this.setState({ resultAnswer });
  }

  render() {
    const {
      currentSurveyPoll,
      currentQuestion,
      resultAnswer,
    } = this.state;

    if (this.state.permissionMsg) {
      return (
        <div className="box-dashboard">
          <div className="inne">
            <div className="alert alert-warning" role="alert">
              { localeCommon.PERMISSION_VIEW_RESULT }
            </div>
          </div>
        </div>
      )
    }

    if (!currentSurveyPoll || !resultAnswer) {
      return null
    }
    const userAvatar = currentSurveyPoll && currentSurveyPoll.user ?
      currentSurveyPoll.user.fullAvatar :
      require('assets/images/user-icon-placeholder.png');
    const isOwner = this.state.currentSurveyPoll ?
      this.props.user.id === this.state.currentSurveyPoll.user_id : false;

    return (
      <div className="box-tab">
        <div className="tab-content">
          <div className="wrapper">
            <div className="box-item">
              <div className="head">
                <div className="thumb">
                  <img src={userAvatar} alt={currentSurveyPoll.user.name} />
                </div>
                <div className="title">
                  <h3>{currentSurveyPoll.user.name}</h3>
                </div>
                <div className="point">
                  <span className="number">{currentSurveyPoll.point || 0}</span>
                  <span className="text">
                    {localePoll.POINT_RESULT}
                  </span>
                </div>
              </div>
              <ResultContent
                keyPollSurvey={this.isSurvey ? 'survey' : 'poll'}
                localeCreate={localeCreate}
                question={currentQuestion}
                resultAnswer={resultAnswer}
                viewResult={isOwner || currentSurveyPoll[INPUT_NAME.VIEW_RESULT]}
                viewSocial={isOwner || currentSurveyPoll[INPUT_NAME.VIEW_SOCIAL]}
                shareSocial={currentSurveyPoll.shareSocial || ''}
                listQuestions={currentSurveyPoll.question}
                getResultBaseOnQuestion={this.getResultBaseOnQuestion}
                isOwner={isOwner}
                onFilterResultWithTarget={this.onFilterResultWithTarget}
                isFreePoll={!currentSurveyPoll.number_vote}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  user: state.user,
})

ResultDetail = connect(mapStateToProps)(ResultDetail)

export default (props) => {
  const { history: { location } } = props;
  console.log('location ', location)
  const isSurvey = location && location.pathname.indexOf('/survey/') > -1;

  return (
    <Layout
      index={isSurvey ? 6 : 5}
      // title={props.location.state && props.location.state.title}
      mainContent={ResultDetail}
      menuIcon="library_books"
    />
  )
}