import React, { Component } from 'react'
import Alert from 'react-s-alert'
import { map } from 'lodash'
import moment from 'moment'
import Select from 'react-select'

import CustomDatePicker from 'components/CustomDatePicker';
import { requestAPI } from 'services/utils'
import { APIs } from 'services/config'
import './index.css'

const {
  getProfileQuestionDashboard,
  postProfileAnswerDashboard
} = APIs.profile;

const localeHome = window.locale.Home;
const isCollectUserProfile = window.Config ?
  !!window.Config.CollectUserProfile : true;

export default class QuickProfile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
      question: null,
      answered: null
    }
  }

  componentDidMount = () => {
    if (isCollectUserProfile) {
      this.getQuestion()
    }
  }

  getQuestion() {
    requestAPI({
      url: getProfileQuestionDashboard.url,
      method: getProfileQuestionDashboard.method,
    }).then(res => {
      if (res.success) {
        if (!res.data) {
          return this.onClose()
        }

        this.setState({
          question: res.data,
          answered: null,
          isOpen: true,
        })
      }
    })
  }

  onChange = (answered) => {
    this.setState({ answered })
  }

  onChangeText = (evt) => {
    this.setState({ answered: {
      value: evt.target.value
    }})
  }

  onChangeDate = (val) => {
    this.setState({
      answered: val
    })
  }

  onClose = () => {
    this.setState({
      isOpen: false,
      question: null,
      answered: null
    })
  }

  onSubmitAnswer = (isClose = false) => () => {
    const {
      question,
      answered
    } = this.state;

    if (!answered) {
      return Alert.warning('Vui lòng chọn đáp án')
    }

    const dataForm = {
      question_id: question.id,
    }

    if (question.type === 'date') {
      dataForm.answer_id = moment(answered.value).format('YYYY-MM-DD')
    } else {
      dataForm.answer_id = answered.value
    }

    requestAPI({
      url: postProfileAnswerDashboard.url,
      method: postProfileAnswerDashboard.method,
      dataForm,
    }).then(res => {
      if (!res.success) {
        Alert.error(res.message)
      }
      if (!isClose) {
        this.getQuestion()
      } else {
        this.onClose()
      }
    })
  }

  renderInput() {
    const {
      answered,
      question,
    } = this.state

    if (question.type === 'text') {
      return <input
        className="input"
        value={(answered && answered.value) || ''}
        onChange={this.onChangeText}
      />
    }

    if (question.type === 'date') {
      return (
        <div className="date-form">
          <CustomDatePicker
            selected={answered}
            dateFormat="DD-MM-YYYY"
            onChange={(val) => this.onChangeDate(val)}
            time={false}
            dropdownMode="select"
          />
        </div>
      )
    }

    const answersOpt = map(question.answer, (ans) => ({
      value: ans.id,
      label: ans.name
    }))

    return (
      <Select
        key={question.id}
        options={answersOpt}
        clearable={false}
        className="custom-select"
        value={answered}
        onChange={this.onChange}
        placeholder={localeHome.QUICK_PROFILE_ANSWER_HOLDER}
      />
    )
  }

  render() {
    const {
      question,
      isOpen
    } = this.state;

    if (!question || !isOpen) {
      return null;
    }

    return (
      <div className="box-comment">
        <div className="inner">
          <div className="form quick-profile">
            <a role="button" className="close-quick-profile" onClick={this.onClose}>
              <span className="fa fa-times"/>
            </a>
            <span className="caption">
              { question.name }
            </span>
            { this.renderInput() }

            <div className="form-btn text-right">
              <ul>
                <li>
                  <a
                    role="button"
                    className="btn btn-grey"
                    title={ localeHome.SAVE_CLOSE_QUICK_PROFILE_BTN }
                    onClick={this.onSubmitAnswer(true)}
                  >
                    <span className="text">
                      { localeHome.SAVE_CLOSE_QUICK_PROFILE_BTN }
                    </span>
                  </a>
                </li>
                <li>
                  <button
                    name="save"
                    className="btn btn-grey"
                    title={localeHome.NEXT_QUICK_PROFILE_BTN}
                    onClick={this.onSubmitAnswer()}
                  >
                    <span className="material-icons">&#xE801;</span>
                    <span className="text">
                      { localeHome.NEXT_QUICK_PROFILE_BTN }
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
