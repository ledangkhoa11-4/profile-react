import React, { Component } from 'react'
import Alert from 'react-s-alert'
import { map, forEach } from 'lodash'
import moment from 'moment'
import Select from 'react-select'

import CustomDatePicker from 'components/CustomDatePicker';
import { requestAPI } from 'services/utils'
import { APIs, BASE_URL } from 'services/config';
import { jsonEqual } from 'services/utils';
import './index.css'

const {
  getProfileQuestionDashboard,
  postProfileAnswerDashboard
} = APIs.profile;

const localeHome = window.locale.Home, localeProfile = window.locale.Profile;
const isCollectUserProfile = window.Config ?
  !!window.Config.CollectUserProfile : true;

const pointAnswered =  window.Config ? parseInt(window.Config.pointAnswered) : 14;

class QuickProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
      question: null,
      answered: null,
      quantityAnswered: 0,
      quantityAnsweres: 0,
    }
  }
  componentDidMount = () => {
    if (isCollectUserProfile) {
      this.getQuestion()
    }
  }
  componentWillReceiveProps = (nextProps) => {
    if (jsonEqual(this.props, nextProps)) {
      return;
    }
    const {
      user
    } = nextProps;
    let quantityAnswered = user.profile_count,
      quantityAnsweres = user.profile_number_count + 7;
      if(user.name !== null){
        quantityAnswered ++;
      }
      if(user.gender !== null){
        quantityAnswered ++;
      }
      if(user.birthday !== null){
        quantityAnswered ++;
      }
      if(user.address !== null){
        quantityAnswered ++;
      }
      if(user.email !== null){
        quantityAnswered ++;
      }
      if(user.phone !== null){
        quantityAnswered ++;
      }
      if(user.city !== null){
        quantityAnswered ++;
      }
      this.setState({
        quantityAnswered,
        quantityAnsweres
      })

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
      answered: null,
      quantityAnswered: 0
    })
  }

  onSubmitAnswer = (isClose = false) => () => {
    const {
      question,
      answered
    } = this.state;

    if (!answered) {
      return Alert.warning(this.props.localeProfile.PLEASE_SELECT_THE_ANSWER)
    }

    const dataForm = {
      question_id: question.id,
    }

    if (question.type === 'date') {
      dataForm.answer_id = moment(answered.value).format('YYYY-MM-DD')
    } else {
      if (this.state.question.type === 'text' || this.state.question.id === 'gender' || this.state.question.id ===  'city') {
        dataForm.answer_id = answered.value;
      }else{
        dataForm.answer_id = Array.isArray(answered) ?
        map(answered, val => val.value) :
        [answered.value];
      }
    }
    if(this.state.quantityAnsweres === this.state.quantityAnswered + 1){
      dataForm.isPlusPoint = true;
    }
    requestAPI({
      url: postProfileAnswerDashboard.url,
      method: postProfileAnswerDashboard.method,
      dataForm,
    }).then(res => {
      if (!res.success) {
        Alert.error(res.message)
      }
      const quantityAnswered = this.state.quantityAnswered + 1;
      if(quantityAnswered === this.state.quantityAnsweres){
        this.onClose()
        Alert.success(this.props.localeProfile.PROFILE_ADDINFOMATION_RESULT.replace(':star', pointAnswered))
        window.location.reload()
      }else{
        if (!isClose) {
          this.setState({quantityAnswered})
          this.getQuestion()
        } else {
          this.onClose()
        }
      }
    }).catch(error => {
      if(Array.isArray(error.message) || typeof error.message === 'object'){
        forEach(error.message, msg => {
          msg[0] && Alert.error(msg[0]);
        })
      }else{
        Alert.error(error.message);
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
        className="input form-control"
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
        clearable={false}
        searchable={false}
        key={question.id}
        options={answersOpt}
        clearable={false}
        multi={question.type === '0' ? false : true}
        closeOnSelect={question.type === '0' ? true : false}
        removeSelected={false}
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
    if (!question || !isOpen || this.props.user.complete_profile === 1) {
      return null;
    }
    const img_start = BASE_URL + '/assetsnew/img/capture.png';
    const precent = Math.round(( this.state.quantityAnswered / this.state.quantityAnsweres ) * 100);
    const percentCompleted = isNaN(precent) ? 0 : precent;
    return (
      <div className="box-main-setting" id="box-main-2">
          <div className="box-setting-profle-contain position-relative" id="box-containing-profile-settings">
            <p>{this.props.localeProfile.PROFILE_ADDINFOMATION_TITLE.replace(':star', pointAnswered)}</p>
            <a role="button" title="Close" className="close-quick-profile" onClick={this.onClose}>
              <span className="fa fa-times"/>
            </a>
            <div className="row box-progress-bar">
              <div className="col-lg-10">
                <div className="progress">
                  <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow={percentCompleted}
                  aria-valuemin="0" aria-valuemax="100" style={{width: percentCompleted + '%'}}>
                    {percentCompleted}%
                  </div>
                </div>
              </div>
              <div className="col-lg-2">
                <div className="img-point">
                  <img src={img_start} alt={img_start}/>
                  <div className="point">
                      {pointAnswered}
                  </div>
                </div>
              </div>
            </div>
            <div className="box box-detail-information">
              <div className="inner">
                <div className="form quick-profile">
                  <p className="caption">
                    { question.name }
                  </p>
                  { this.renderInput() }

                  <div className="form-btn text-right">
                    <ul className="list-inline">
                      <li>
                        <button
                          name="save"
                          className="btn btn-grey"
                          title={this.props.localeProfile.NEXT_QUICK_PROFILE_BTN}
                          onClick={this.onSubmitAnswer()}
                        >
                          <span className="material-icons">&#xE801;</span>
                          <span className="text">
                            { this.props.localeProfile.NEXT_QUICK_PROFILE_BTN }
                          </span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    )
  }
}
export default  QuickProfile;