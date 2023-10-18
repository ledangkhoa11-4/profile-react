import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  cloneDeep,
  find,
  findIndex,
  forEach,
  isEmpty,
  map,
  range,
  reduce
} from 'lodash';
import Alert from 'react-s-alert';
import { withRouter } from 'react-router-dom';
import Layout from 'components/Layout';
// import ListQuestions from './ListQuestions';
import DetailQuestion from './DetailQuestion';
import ShortSurveyInfo from './ShortSurveyInfo';
import { APIs, CHILD_ROUTE_PATH } from 'services/config';
import { requestAPI, checkCoinPollSurvey } from 'services/utils';
import { updatePageTitle } from 'actions/ui';
import { updateUserPoint } from 'actions/profile';
import { getDataFromVoteForm } from '../../Poll/utils';
import { ThankyouContent } from '../Thankyou';

const localeSurvey = window.locale.Survey;
const localePoll = window.locale.Poll;
const localeCommon = window.locale.Common;

class ContentSurvey extends Component {
  state = {
    answers: {},
    questions: [],
    surveyInfo: {},
    currentQuestions: [],
    isShowThankyou: false,
    permissionMsg: '',
    listTargetOption: [],
  }

  componentDidMount() {
    this.getSurveyInfo()
  }

  getSurveyInfo() {
    const { getSurveyInfo } = APIs.survey;
    const { surveyInfo } = this.props;
    const surveyId = !isEmpty(surveyInfo) ?
      surveyInfo.id : this.props.match.params.surveyId;

    // if having survey data from props, we do not get it again
    if (surveyInfo) {
      return this.setSurveyData(surveyInfo)
    }
    
    requestAPI({
      url: getSurveyInfo.url.replace('{surveyId}', surveyId),
      method: getSurveyInfo.method,
    }).then(async res => {
      if (res.success) {
        const survey = res.data;
        if (res.data.status_code && res.data.status_code === 403) {
          // permission view survey
          this.setState({
            permissionMsg: res.message
          })
        } else {
          await this.setSurveyData(survey)
  
          // for the survey detail page
          if (!this.props.surveyInfo) {
            this.props.updatePageTitle(survey.name)
          }
        }
      }
    }).catch(err => {
      Alert.error(err.message);
      console.log('Error: ', err)
    })
  }

  setSurveyData = (survey) => {
    let questions = survey.question;
    const questionOrder = survey.question_order;
    const surveyInfo = cloneDeep(survey);
    delete surveyInfo.question;
    const rangeQuestion = range(0, questions.length);

    const answers = reduce(surveyInfo.vote, (result, item) => {
      result[item.question_id] = item.answer_id;
      return result
    }, {})

    if (questionOrder && questionOrder.length) {
      questions = map(questionOrder, qOrder => {
        return find(questions, { id: qOrder })
      })
    }
    const currentQuestions = [questions[0]];

    this.setState({
      answers,
      currentQuestions,
      questions,
      rangeQuestion,
      surveyInfo,
    })
  }

  gotoThankyou = () => {
    const { surveyInfo } = this.props;
    const { questions } = this.state;
    if (!isEmpty(surveyInfo)) {
      this.setState({ isShowThankyou: true })
    } else {      
      const { surveyId } = this.props.match.params;
      const path = CHILD_ROUTE_PATH.SURVEY_THANKS.replace(':surveyId', surveyId)
      this.props.history.push({
        pathname: path,
        state: {
          questionId: questions[0] && questions[0].id
        }
      })
    }
  }

  getUserAnswer = async (e) => {
    e.preventDefault();
    const target = e.target;
    const formData = new FormData(target);
    const { currentQuestions } = this.state;
    const currentQuestion = currentQuestions[currentQuestions.length - 1];
    const questionId = currentQuestion.id;

    if (formData.length) return;
    let userChoice = getDataFromVoteForm(currentQuestion, formData, true);

    if (!userChoice.length) {
      return;
    }
    
    await this.setState({
      answers: {
        ...this.state.answers,
        [questionId]: {
          answer_id: userChoice,
          question_type: currentQuestion.question_type,
        },
      },
    })
    
    const index = findIndex(this.state.questions, { id: questionId })
    if (index + 1 < this.state.questions.length) {
      target.reset()
      this.gotoNext()
    } else {
      this.voteSurvey(() => {
        this.gotoThankyou()
      })      
    }
  }

  voteSurvey(successCB) {
    const { voteInSurvey } = APIs.survey;
    const {
      surveyInfo,
    } = this.state;

    if (this.state.surveyInfo.user_id === this.props.user.id) {
      return Alert.warning(localeSurvey.NO_VOTE_YOUR_SURVEY_MSG)
    }

    const toDate = new Date(surveyInfo.to_date)
    const now = new Date()
    if ( surveyInfo.vote && surveyInfo.vote.length ) {
      return Alert.warning(localeSurvey.NOT_REVOTE_SURVEY_MSG);
    } else if (toDate < now) {
      return Alert.warning(localeSurvey.EXPIRED_TIME_MSG);
    } else if (!checkCoinPollSurvey(surveyInfo)) {
      return;
    }

    const question = map(this.state.answers, (answer, key) => {
      return {
        id: key,
        ...answer,
      }
    })
    const dataForm = {
      survey_id: surveyInfo.id,
      question,
    }
    requestAPI({
      url: voteInSurvey.url,
      method: voteInSurvey.method,
      dataForm,
    }).then(res => {
      if (res.success) {
        if (res.data.point && Number.isInteger(res.data.point)) {
          const point = this.props.user.point + res.data.point;
          this.props.updateUserPoint(point)
        }
        typeof successCB === 'function' && successCB()
      }
    }).catch(error => {
      if (typeof error.message === 'object') {
        forEach(error.message, (message) => {
          Alert.error(message[0])
        })
      } else {
        Alert.error(error.message)
      }
    })
  }

  gotoNext = async () => {
    const {
      currentQuestions,
      questions,
    } = this.state;

    const res = await this.getNextQuestion();

    if (!res.success) {
      return console.log(res);
    }

    const { question_id } = res.data;
    let question;
    if (question_id) {
      question = find(questions, { id: question_id })
    } else {
      const currentQuestion = currentQuestions[currentQuestions.length - 1]
      const index = findIndex(questions, { id: currentQuestion.id})
      if (index > -1 && index + 1 < questions.length) {
        question = questions[index + 1]
      } else {
        return console.log('Can not find the index question of ', currentQuestion.id)
      }
    }

    this.setState({
      currentQuestions: currentQuestions.concat(question),
    })
  }

  backToQuestion = (questionId) => {
    this.detailQuestionEl.resetForm();
    const currentQuestions = reduce(this.state.currentQuestions, (result, question) => {
      if (question.id !== questionId) {
        result.push(question);
      }
      return result;
    }, []);
    const answers = reduce(this.state.answers, (result, item, key) => {
      if (parseInt(key, 10) !== questionId) {
        result[key] = item;
      }
      return result;
    }, {});
    
    this.setState({
      answers,
      currentQuestions,
    })
  }

  // for skip logic question
  getNextQuestion = () => {
    const surveyId = !isEmpty(this.props.surveyInfo) ? 
      this.props.surveyInfo.id : this.props.match.params.surveyId;
    const questionAnswer = reduce(this.state.answers, (result, item, key) => {
      result.push({
        question_id: parseInt(key, 10),
        answer_id: item.answer_id,
        question_type: item.question_type
      })
      return result;
    }, [])
    const { currentQuestions } = this.state;
    const currentQuestion = currentQuestions[currentQuestions.length - 1]
    
    return requestAPI({
      url: APIs.skipLogic.nextQuestion.url,
      method: APIs.skipLogic.nextQuestion.method,
      dataForm: {
        survey_id: surveyId,
        question_answer: questionAnswer,
        last_question_id: currentQuestion.id
      }
    })
  }

  render() {
    if (this.state.permissionMsg) {
      return (
        <div className="form form-option">
          <div className="alert alert-warning" role="alert">
            { this.state.permissionMsg }
          </div>
        </div>
      )
    }

    if (this.state.questions.length === 0) {
      return null;
    }

    const surveyId = !isEmpty(this.props.surveyInfo) ? 
      this.props.surveyInfo.id : this.props.match.params.surveyId;
      
    if (!isEmpty(this.props.surveyInfo) && this.state.isShowThankyou) {
      return <ThankyouContent surveyId={surveyId} successCB={this.props.successCB} />
    }
    const currentQuestion = this.state.currentQuestions[
      this.state.currentQuestions.length - 1
    ]

    return (
      <div>
        <ShortSurveyInfo
          surveyInfo={this.state.surveyInfo}
          localeSurvey={localeSurvey}
          localeCommon={localeCommon}
        />
        {/* <ListQuestions
          backToQuestion={this.backToQuestion}
          current={this.state.current}
          rangeQuestion={this.state.rangeQuestion}
          surveyInfo={this.state.surveyInfo}
        /> */}
        <DetailQuestion
          ref={(node) => {
            if (node) this.detailQuestionEl = node;
          }}
          hasNotResult={this.props.hasNotResult || !this.state.surveyInfo.view_result}
          surveyId={surveyId}
          questions={this.state.questions}
          surveyInfo={this.state.surveyInfo}
          getUserAnswer={this.getUserAnswer}
          backToQuestion={this.backToQuestion}
          currentQuestion={currentQuestion}
          currentQuestions={this.state.currentQuestions}
          answered={this.state.answers}
          user={this.props.user}
          localePoll={localePoll}
          localeSurvey={localeSurvey}
        />
      </div>
    );
  }
}

ContentSurvey = connect((state, ownProps) => ({
  ...ownProps,
  user: state.user,
}), {
  updatePageTitle,
  updateUserPoint,
})(ContentSurvey)
ContentSurvey = withRouter(ContentSurvey)

const Survey = (props) => {
  return (
    <Layout
      index={6}
      title={props.location.state && props.location.state.title}
      mainContent={ContentSurvey}
      menuIcon="library_books"
    />
  )
}

export {
  ContentSurvey,
}

export default Survey;
