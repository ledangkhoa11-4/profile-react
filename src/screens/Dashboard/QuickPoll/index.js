import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import merge from 'deepmerge';
import Alert from 'react-s-alert';
import Question from 'screens/Project/CreatePoll/AddQuestionBox/Question';
import AnswerList from 'screens/Project/CreatePoll/AddQuestionBox/AnswerList';
import CustomDatePicker from 'components/CustomDatePicker';
import {
  INPUT_NAME,
} from '../constant';
import { QUESTION_TYPES_OPTION } from '../../Project/constant';
import {
  convertDateToString,
  requestAPI,
} from 'services/utils';
import {
  APIs,
  CHILD_ROUTE_PATH,
} from 'services/config';

const {
  FROM_DATE,
  TO_DATE,
} = INPUT_NAME.QUICK_POLL;
const localeCreate = window.locale.Create;
const localeCommon = window.locale.Common;

function initValues() {
  // const date = moment().add(1, 'days')
  const date = moment().endOf('day')

  return {
    [TO_DATE]: date,
    isShowLayer: false,
    isShowCreatingPoll: false,
  }
}

class QuickPoll extends Component {
  constructor() {
    super()

    this.state = initValues();
  }

  onChange = (value, name) => {
    this.setState({
      [name]: value,
    })
  }

  onSubmit = (e) => {
    e.preventDefault()
    const isValidQuestion = this.questionEl.validateQuestionBox()
    const isValidAnswers = this.answersEl.validateAnswers()
    if (!isValidQuestion || !isValidAnswers) {
      return;
    }
    const dataForm = this.getQuestionAnswer()
    requestAPI({
      url: APIs.poll.createQuickPoll.url,
      method: APIs.poll.createQuickPoll.method,
      dataForm,
      // isShowPageLoading: false,
    }).then(res => {
      if (res.success) {
        this.clearForm()
        this.props.onSuhmitQuickPollSuccess(res)
      }
    })
  }

  getQuestionAnswer() {    
    let dataForm = {
      [FROM_DATE]: convertDateToString(moment().toDate()),
      [TO_DATE]: convertDateToString(this.state[TO_DATE].toDate()),
    }
    const answerListData = this.answersEl.getDataEditing()
    const questionData = this.questionEl.getQuestion()
    dataForm = merge.all([dataForm, questionData, answerListData])
    return dataForm;
  }

  clearForm = () => {
    const initState = initValues()
    this.setState(initState, () => {
      this.questionEl.clearQuestion()
    })
  }

  getDefaultProjectId = async () => {
    const res = await requestAPI({
      url: APIs.project.getListProjects.url,
      method: APIs.project.getListProjects.method,
    })

    if(res.success) {
      const defaultProject = res.data.filter(item => {
        return item.name === 'Default Project'
      })
      return defaultProject.length ?
        defaultProject[0].id : -1
    }
    return -1;
  }

  gotoCreatePollPaidOption = async () => {
    const pollDataFromDashboard = this.getQuestionAnswer()
    
    if (Array.isArray(pollDataFromDashboard.answer)) {
      pollDataFromDashboard.question.answer = [...pollDataFromDashboard.answer]
    } else {
      pollDataFromDashboard.question.answer = []
    }
    pollDataFromDashboard.question.fullMedia = pollDataFromDashboard.question.media
    delete pollDataFromDashboard.answer
    
    const defaultProjectId = await this.getDefaultProjectId()
    if (defaultProjectId > -1) {
      const pathname = CHILD_ROUTE_PATH.PROJECT_CREATE_POLL.replace(':projectId', defaultProjectId)
      return this.props.history.push({
        pathname,
        state: {
          pollDataFromDashboard,
        },
      })
    }
    return Alert.error(localeCommon.SOMETHING_WRONG)
  }

  onCloseLayer = () => {
    this.setState({ isShowLayer: false }, () => {
      this.clearForm()
    })
  }

  onOpenLayer = () => {
    this.setState({ isShowLayer: true })
  }

  onShowCreatingPoll = () => {
    this.setState({ isShowCreatingPoll: true })
  }

  onHideCreatingPoll = () => {
    this.setState({ isShowCreatingPoll: false })
  }

  render() {
    const { localeHome } = this.props;
    const classWrapper = this.state.isShowLayer ?
      'box-comment quick-poll-layer' : 'box-comment';

    return (
      <div className={classWrapper}>
        <div className="inner">
          <span className="caption">
            {localeHome.QUICK_POLL_TITLE}
          </span>
          <form name="comment-form" className="form style-1" onSubmit={this.onSubmit}>
            <div className="form-group row">
              <Question
                localeCreate={localeCreate}
                questionData={{}}
                ref={node => {
                  if (node) {
                    this.questionEl = node;
                  }
                }}
                isShowLabel={false}
                onFocus={() => {
                  this.onOpenLayer()
                  this.onShowCreatingPoll()
                }}
              />
            </div>
            {
              this.state.isShowCreatingPoll ?
              (
                <div>
                  <div className="form-group row">
                    <AnswerList
                      ref={node => {
                        if (node) {
                          this.answersEl = node;
                        }
                      }}
                      localeCreate={localeCreate}
                      isCreatePoll={true}
                      answers={[]}
                      isShowLabel={false}
                      questionType={QUESTION_TYPES_OPTION[0]}
                      hasTopLineOnMultiChoice={true}
                      isDoNotUpdateOnProps={true}
                    />
                    <div className="col-xs-12">
                      <label>
                        {localeCreate.TIME_EXPIRED_LABEL}:
                      </label>
                      <CustomDatePicker
                        name={TO_DATE}
                        selected={this.state[TO_DATE]}
                        time={true}
                        className="date-form"
                        minDate={moment().add(1, 'days')}
                        onChange={(val) => {
                          this.onChange(val, TO_DATE)
                        }}
                        dateFormat="DD-MM-YYYY HH:mm"
                      />
                    </div>
                    <div className="col-xs-12">
                      <div className="row">
                        <div className="col-xs-6">
                          <a
                            role="button"
                            className="paid-btn"
                            title={localeHome.PAID_BUTTON}
                            onClick={this.gotoCreatePollPaidOption}
                          >
                            <span className="fa fa-credit-card"/>
                            <span className="text">
                              {localeHome.PAID_BUTTON}
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-btn text-right top-line">
                    <ul>
                      <li>
                        <a
                          role="button"
                          onClick={this.clearForm}
                          className="btn btn-grey"
                          title={localeHome.REMOVE_POLL_BUTTON}
                        >
                          <span className="text">
                            {localeHome.REMOVE_POLL_BUTTON}
                          </span>
                        </a>
                      </li>
                      <li>
                        <button
                          type="submit"
                          name="save"
                          className="btn"
                          title={localeHome.POLL_BUTTON}
                        >
                          <span className="material-icons">&#xE801;</span>
                          <span className="text">
                            { localeHome.POLL_BUTTON }
                          </span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : null
            }
          </form>
        </div>
        {
          this.state.isShowLayer ?
          (
            <div
              className="layer in"
              onClick={this.onCloseLayer}
            />
          ) : null
        }
      </div>
    )
  }
}

export default withRouter(QuickPoll);
