import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findIndex } from 'lodash';
import AnswersController from './AnswersController';
import ResultContent from '../../Poll/ResultContent';
import SurveyVoteInfo from './SurveyVoteInfo';
import { jsonEqual, requestAPI } from 'services/utils';
import { APIs } from 'services/config';
import { ENUM } from 'services/constant';
import { INPUT_NAME } from '../../Project/constant'

import FakeComment from '../../../components/FakeComment'

const localeSurvey = window.locale.Survey;
const {
  IMAGE,
  VIDEO,
} = ENUM.QUESTION_MEDIA_TYPE;

class DetailQuestion extends Component {
  state = {
    resultAnswer: null,
    isShowResult: false,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !jsonEqual(this.state, nextState) || !jsonEqual(this.props, nextProps)
  }

  componentDidMount() {
    if (this.props.currentQuestion) {
      this.getResultAnswer(this.props.currentQuestion.id)
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (!jsonEqual(this.props.currentQuestion, nextProps.currentQuestion)) {
      this.getResultAnswer(nextProps.currentQuestion.id)
    }
  }
  
  getResultAnswer(questionId) {
    const { surveyId } = this.props;
    const { getResultAnswer } = APIs.survey;

    if (this.props.hasNotResult) {
      return;
    }
    
    this.setState({ resultAnswer: null })

    requestAPI({
      url: getResultAnswer.url,
      method: getResultAnswer.method,
      dataForm: {
        survey_id: parseInt(surveyId, 10),
        question_id: questionId
      },
      isShowPageLoading: false,
    }).then(res => {
      if (res.success) {
        this.setState({
          resultAnswer: res.data,
        })
      }
    })
  }

  onFilterResultWithTarget = (resultAnswer) => {
    this.setState({ resultAnswer });
  }

  renderMedia = () => {
    const { currentQuestion } = this.props;
    if (!currentQuestion.media) {
      return null
    }

    switch (currentQuestion.media_type) {
      case IMAGE:
        return <div className="screen">
          <div className="view">
            <img src={currentQuestion.fullMedia} alt="question" />
          </div>
        </div>;
      case VIDEO:
        return <div className="screen">
          <div className="view">
            <div className="embed-responsive embed-responsive-16by9">
              <iframe
                src={currentQuestion.fullMedia}
                className="embed-responsive-item"
                title="video-thumbnail"
              />
            </div>
          </div>
        </div>;
      default:
        return null;
    }
  }

  renderResultAnswer() {
    const { resultAnswer, isShowResult } = this.state;
    if (!resultAnswer || this.props.hasNotResult) {
      return null;
    }
    const icon = isShowResult ? 'fa fa-minus' : 'fa fa-plus';
    const isOwner = this.props.user.id === this.props.surveyInfo.user_id;
    
    return (
      <div className="outer box-result-share">
        <div className="inner">
          <h3 onClick={this.toggleResultWrapper}>
            <span className={icon}/>
            &nbsp;
            {localeSurvey.TOTAL_RESULT_LABEL}
          </h3>
          {
            isShowResult ?
              <ResultContent
                keyPollSurvey="survey"
                resultAnswer={resultAnswer}
                isHideQuestion={true}
                question={this.props.currentQuestion}
                viewResult={isOwner || this.props.surveyInfo[INPUT_NAME.VIEW_RESULT]}
                viewSocial={isOwner || this.props.surveyInfo[INPUT_NAME.VIEW_SOCIAL]}
                shareSocial={this.props.surveyInfo.shareSocial || ''}
                isOwner={isOwner}
                onFilterResultWithTarget={this.onFilterResultWithTarget}
              /> : null
          }
        </div>
      </div>
    )
  }

  resetForm = () => {
    this.form.reset();
  }

  toggleResultWrapper = () => {
    this.setState({ isShowResult: !this.state.isShowResult })
  }

  render() {
    const {
      answered,
      localePoll,
      currentQuestions,
      currentQuestion,
      surveyInfo,
      questions,
    } = this.props;
    const currAnswer = answered[currentQuestion.id];
    const indexQuestion = findIndex(questions, { id: currentQuestion.id })

    return (
      <div className="box-detail-question non-overflow">
        <SurveyVoteInfo
          localePoll={localePoll}
          localeSurvey={localeSurvey}
          surveyInfo={surveyInfo}
          answered={answered}
          currentQuestions={currentQuestions}
          currentQuestionId={currentQuestion.id}
        />
        <div className="question-content">
          <div className="text">
            <strong>{currentQuestion.question}</strong>
          </div>
          <div className="content">
            {this.renderMedia()}
            <form
              name="poll"
              className="form vote-content non-float"
              onSubmit={this.props.getUserAnswer}
              ref={(node) => {
                if (node) {
                  this.form = node;
                }
              }}
            >
              {
                <AnswersController
                  question={currentQuestion}
                  currentAnswer={currAnswer}
                />
              }
              <div className="form-btn">
                {
                  currentQuestions.length > 1 ?
                    <div className="pull-left">
                      <button
                        type="button"
                        name="back"
                        className="btn btn-grey"
                        onClick={() => {
                          this.props.backToQuestion(currentQuestion.id)
                        }}
                      >
                        <span className="material-icons">keyboard_arrow_left</span>
                        <span className="text"> 
                          {localeSurvey.BACK_BUTTON}
                        </span>
                      </button>
                    </div> : null
                }
                <div className="pull-right">
                  <button
                    type="submit"
                    name="next"
                    className="btn btn-grey"
                  >
                    {
                      indexQuestion === questions.length - 1 ?
                        <span className="fa fa-thumbs-up"/> : null
                    }
                    <span className="text"> 
                      {
                        indexQuestion === questions.length - 1 ?
                          localeSurvey.VOTE_BUTTON :
                          localeSurvey.NEXT_BUTTON
                      }
                    </span>
                    {
                      indexQuestion < questions.length - 1 ?
                        <span className="material-icons">
                          keyboard_arrow_right
                        </span> : null
                    }
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <FakeComment/>

        { this.renderResultAnswer() }
      </div>
    )
  }
}

DetailQuestion.propTypes = {
  answered: PropTypes.object,
  getUserAnswer: PropTypes.func.isRequired,
  backToQuestion: PropTypes.func.isRequired,
  currentQuestion: PropTypes.object.isRequired,
}

export default DetailQuestion;
