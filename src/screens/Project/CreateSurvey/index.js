import React, { Component } from 'react';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';
import { withRouter } from 'react-router-dom';
import { cloneDeep, isEmpty, find, forEach, map, reduce } from 'lodash';
import merge from 'deepmerge';
import Layout from 'components/Layout';
import AddQuestionBox from './AddQuestionBox';
import ControlFormBtn from './ControlFormBtn';
import OptionsBox from '../CreatePoll/OptionsBox';
import Gift from './Gift';
import {
  APIs,
  CHILD_ROUTE_PATH,
  CONFIG_QUESTIONS,
} from 'services/config';
import {
  convertDateToString,
  requestAPI,
} from 'services/utils';
import { POLL_SURVEY_STATUS } from 'services/constant';
import { showLoading, hideLoading } from 'actions/ui';
import {
  ENUM,
  INPUT_NAME,
} from '../constant';

import './style.css';
import moment from 'moment';
const {
  FROM_DATE,
  AGE_FROM,
  AGE_TO,
  CITY,
  COUNTRY,
  GENDER,
  GIFT,
  POINT,
} = INPUT_NAME;

const {
  APPROVED,
  WAITINGFORAPPROVAL,
  WAILTINGFORPAYMENT,
  DRAFT,
  RUNNING,
  SCHEDULED,
} = POLL_SURVEY_STATUS;
const parseData = (list, valueKey, labelKey) => {
  return list.map(item => ({
    value: item[valueKey] || item.id,
    label: item[labelKey] || item.name,
  }));
}

const parseLogicQuestion = (questions, listCityOption, listTargetOption) => {
  return map(questions, (question) => {
    if (isEmpty(question.logic)) {
      return question
    }

    let index = 1;
    const logic_question = reduce(question.logic, (_result, logicQuestion) => {
      // start advanceProfile
      
      const advanceProfile = reduce(logicQuestion.advance_profile, (result1, item) => {
        // categorie_id => mean 'profile_id'
        const profile = find(listTargetOption, { id: item.categorie_id })
        
        const questionProfile = find(profile.question, { id: item.question_id })
        
        const answerProfile = map(item.answer_id, _id => {
          const answer = find(questionProfile.answer, { id: _id })
          
          return {
            value: _id,
            label: answer.name,
            parent_id: questionProfile.parent_id
          }
        })

        if (!profile || !questionProfile) {
          return result1;
        }
        if(isEmpty(result1[profile.id])){
          result1[profile.id] = {};
        }
        result1[profile.id][questionProfile.id] = answerProfile;
        
        return result1;
      }, {})
      // end advanceProfile

      // start basicProfile
      const basicProfile = {};
      basicProfile[AGE_FROM] = logicQuestion[AGE_FROM];
      basicProfile[AGE_TO] = logicQuestion[AGE_TO];
      basicProfile[COUNTRY] = logicQuestion[COUNTRY];
      basicProfile[CITY] = map(logicQuestion[CITY], cityId => {
        const city = find(listCityOption, { city_id: cityId })
        if (city === undefined) {
          return null;
        }

        return {
          value: city.city_id,
          label: city.vietnamese
        }
      })
      basicProfile[GENDER] = logicQuestion[GENDER]
      // end advanceProfile
  
      // start questionInput
      const questionInput = reduce(logicQuestion.question_input, (result1, item) => {
        result1[item.question_id] = reduce(item.answer, (result2, _item) => {
          result2[_item.id] = _item.value
          return result2
        }, {})
  
        result1[item.question_id].question_type = item.question_type;
        return result1;
      }, {})
      // end questionInput
  
      // start questionOutput
      const questionOutput = logicQuestion.question_out || '';
      // end questionOutput

      _result[index++] = {
        id: logicQuestion.id,
        advanceProfile,
        basicProfile,
        questionInput,
        questionOutput,
      };
      return _result;
    }, {});
    question.logic = logic_question;
    return question;
  });
}
const enableCreateSurvey = window.Config ? Boolean(window.Config.enableCreateSurvey) : false;
const isShowPainOption = window.Config ? Boolean(window.Config.isShowPainOption) : false;
const approveMode = window.Config ? Boolean(window.Config.approveMode) : false;
class CreateSurveyContainer extends Component {
  constructor(props) {
    super(props);
    // create or edit
    const { projectId } = props.match.params;
    const url = CHILD_ROUTE_PATH.PROJECT_CREATE_SURVEY.replace(':projectId', projectId);
    this.isCreateSurvey = props.location.pathname === url;
    
    if (!this.isCreateSurvey) {
      this.surveyId = props.match.params.surveyId;
    }

    this.state = {
      hasPaidOption: false,
      projectInfo: {},
      listCategories: [],
      listTargetsOfUser: [],
      listTargetOption: [],
      listCityOption: [],
      surveyInfo: {},
      noHasPermissionEdit: false,
      isShowPainOption: false,
      isShowModalSchedule: false,
      [FROM_DATE]: moment(),
      maxDate: moment().add(10, 'years'),
      hasGiftOption: false,
    }
    CONFIG_QUESTIONS.REFS = [];
  }
  componentDidMount() {
    const { projectId } = this.props.match.params;
    const url =  CHILD_ROUTE_PATH.PROJECT_DETAIL.replace(':projectId', projectId)
    if(this.props.user.isadmin == true || enableCreateSurvey == true){
      this.getAllData();
      
    }
    else{
      return window.location.replace(url)
    }
  }  
  getAllData() {
    let requests = [
      this.getProjectInfo(),
      this.getListCategories(),
      this.getTargetsOfUser(),
      this.getTargetOptions(),
      this.getCityOptions(),
    ];

    if (!this.isCreateSurvey) {
      requests.push(this.getSurveyInfo())
      this.props.showLoading()
    }

    Promise.all(requests).then(res => {
      let projectInfo = res[0].data[0],
          listCategories = res[1].data,
          listTargetsOfUser = res[2].data,
          listTargetOption = res[3].data,
          listCityOption = res[4].data;
      let surveyInfo = !this.isCreateSurvey ? res[5].data : {};
      const questionLength = surveyInfo.question ?
        surveyInfo.question.length : 0;

      if (!this.isCreateSurvey) {
        this.props.hideLoading()
      }
      // checking and parsing logic skip question
      if (questionLength) {
        surveyInfo.question = parseLogicQuestion(
          surveyInfo.question,
          listCityOption,
          listTargetOption
        )
      }

      listCategories = parseData(listCategories);
      listCityOption = parseData(listCityOption, 'city_id', 'vietnamese');
      
      projectInfo = {
        value: projectInfo.id,
        label: projectInfo.name,
      };
      this.setState({
        projectInfo,
        listCategories,
        listTargetsOfUser,
        listTargetOption,
        listCityOption,
        surveyInfo,
        hasPaidOption: !!surveyInfo.number_vote && surveyInfo.number_vote > 0 && (isShowPainOption || this.props.user.isadmin),
        hasGiftOption: !isEmpty(surveyInfo) && (surveyInfo[GIFT] !== null || surveyInfo[POINT] !== 0 || surveyInfo.number_vote > 0),
      }, () => {
       if(surveyInfo[FROM_DATE]){
         this.setState({
          [FROM_DATE]: moment(new Date(surveyInfo[FROM_DATE]))
         })
       }
      });
    }).catch(error => {
      this.props.hideLoading()
      if(isEmpty(error.message)){
        return;
      }
      if(Array.isArray(error.message) || typeof error.message === 'object'){
        forEach(error.message, msg => {
          msg[0] && Alert.error(msg[0]);
        })
      }else{
        Alert.error(error.message);
      }
      if (!error.success && error.message === this.props.localeCreate.PERMISSION_MSG) {
        this.setState({ noHasPermissionEdit: true })
      }
    });
  }
  getCityOptions() {
    return requestAPI({
      url: APIs.poll.getListCity.url,
      method: APIs.poll.getListCity.method,
    });
  }

  getSurveyInfo() {
    return requestAPI({
      url: APIs.project.getSurveyInfo.url.replace('{surveyId}', this.surveyId),
      method: APIs.project.getSurveyInfo.method,
    });
  }

  getProjectInfo() {
    const { projectId } = this.props.match.params;
    let projectInfoUrl = APIs.project.getProjectInfo.url;
    projectInfoUrl = projectInfoUrl.replace('{projectId}', projectId);

    return requestAPI({
      url: projectInfoUrl,
      method: APIs.project.getProjectInfo.method,
    });
  }

  getTargetsOfUser() {
    const { projectId } = this.props.match.params;
    const url = APIs.target.getListUserTarget.url
      .replace('{projectId}', projectId)
      .replace('{targetType}', 'survey')
    return requestAPI({
      url,
      method: APIs.target.getListUserTarget.method,
    });
  }

  getListCategories() {
    return requestAPI({
      url: APIs.category.getListCategories.url,
      method: APIs.category.getListCategories.method,
    });
  }

  getTargetOptions() {
    return requestAPI({
      url: APIs.target.getTargetOptions.url,
      method: APIs.target.getTargetOptions.method,
    });
  }

  updateSurvey = (actions, isDisableEdit) => {
    
    const isValidOptionsBox = this.optionBoxEl ? this.optionBoxEl.validatePaidOption() : true ;
    if (!isValidOptionsBox) {
      return;
    }

    const targetData = this.optionBoxEl ? this.optionBoxEl.getTargetData() : {};

    if(!isEmpty(this.state.surveyInfo)){
      targetData.survey_id = this.state.surveyInfo.id;
    }

    const data = this.addQuestionBoxEl.getDataSurvey();
   
    if(!data){
      return;
    }
    targetData.survey =  Object.assign({}, targetData.survey, data)

    if (isDisableEdit) {
      delete targetData.target
    }
    if(!this.state.hasPaidOption){
      delete targetData.survey.number_vote
      delete targetData.target
    }
    
    if(this.props.user.isadmin && this.state.hasGiftOption){
       const isValidGift = this.optionGiftEL.validate();
       if(!isValidGift){
         return;
      }
      
      const gift = this.optionGiftEL.getGift();
      targetData.survey.gift = gift;
    }
    if(actions === SCHEDULED){
      targetData.survey[FROM_DATE] = convertDateToString(this.state[FROM_DATE].toDate())
    }
    
    if(actions === DRAFT){ // DRAFT
      targetData.status = DRAFT
    }else{
      // Scheduled
      if(this.props.user.isadmin){ // là admin
        targetData.status = APPROVED // poll status đã được xét duyệt
      }else{ // không phải admin
        if((this.state.hasPaidOption && !isDisableEdit && targetData.survey.number_vote >  0) // chưa khởi chạy
        || (isDisableEdit && this.state.surveyInfo.number_vote < targetData.survey.number_vote) // đã khởi chạy
        ){ // nếu user chọn pain otion 
          targetData.status = WAILTINGFORPAYMENT // poll status chờ thanh toán
        }else{ // không chọn pain option
          if(!approveMode){ // không bật chế độ xét duyệt
            targetData.status = APPROVED // poll status đã được xét duyệt
          }else{ // bật chết độ xét duyệt
            targetData.status = WAITINGFORAPPROVAL // poll status đang chờ xét duyệt
          }
        }
      }
    }
    
    const viewResultEl = document.getElementsByName(INPUT_NAME.VIEW_RESULT)[0]
    const viewSocialEl = document.getElementsByName(INPUT_NAME.VIEW_SOCIAL)[0]
    targetData.survey[INPUT_NAME.VIEW_RESULT] = viewResultEl.checked
    targetData.survey[INPUT_NAME.VIEW_SOCIAL] = viewSocialEl.checked
    
    requestAPI({
      url: APIs.survey.postTargetOption.url,
      method: APIs.survey.postTargetOption.method,
      dataForm: targetData,
    }).then(res => {
      if (!res.success) {
        return;
      }
      Alert.success(res.message);
      if(res.data.status === APPROVED || res.data.status === RUNNING){
          
        return window.location.replace(res.data.share)
      }
      if(res.data.status === WAILTINGFORPAYMENT){
        
        const url = CHILD_ROUTE_PATH.PROJECT_POLL_SURVEY_PAYMENT
                        .replace(':type', ENUM.TYPE.POLL)
                        .replace(':pollSurveyId', res.data.id)
        return this.props.history.push(url)
      }
      const url =  CHILD_ROUTE_PATH.PROJECT_DETAIL.replace(':projectId', res.data.project_id)
      return window.location.replace(url)
    }).catch(error => {
      if(Array.isArray(error.message) || typeof error.message === 'object'){
        forEach(error.message, msg => {
          msg[0] && Alert.error(msg[0]);
        })
      }else{
        Alert.error(error.message);
      }
      if(actions === SCHEDULED){
        this.togggleModalSchedule()
      }
    });
  }

  updateListTargetOfUser = (entry) => {
    this.setState({
      listTargetsOfUser: this.state.listTargetsOfUser.concat(entry),
    });
  }

  updateQuestionOrder = (questionOrder) => {
    const surveyInfo = cloneDeep(this.state.surveyInfo)
    surveyInfo.question_order = questionOrder;
    this.setState({
      surveyInfo
    })
  }
  updateSurveyInfo = (question) => {
    const surveyInfo = cloneDeep(this.state.surveyInfo)
    surveyInfo.question = question;
    this.setState({
      surveyInfo
    })
  }
  onChangePaidOption = (e) => {
    this.setState({
      hasPaidOption: e.target.checked,
    })
  }
  togggleModalSchedule = () =>{
    this.setState({
      isShowModalSchedule: !this.state.isShowModalSchedule,
      maxDate: this.addQuestionBoxEl.getTodate()
    })
  }
  onChangeFromdate = (val) => {
    this.setState({
      [FROM_DATE]: val
    })
  }
  onChangeGiftOption = () => {
    this.setState({
      hasGiftOption: !this.state.hasGiftOption
    })
  }
  renderBoxes(isDisableEdit) {
    const { projectId } = this.props.match.params;
    return (
      <div>
        {
          isShowPainOption || this.props.user.isadmin ?
            <OptionsBox
              ref={(node) => {
                if (node) this.optionBoxEl = node;
              }}
              isCreatePoll={this.isCreateSurvey}
              pollInfo={this.state.surveyInfo}
              listCityOption={this.state.listCityOption}
              listTargetsOfUser={this.state.listTargetsOfUser}
              listTargetOption={this.state.listTargetOption}
              updateListTargetOfUser={this.updateListTargetOfUser}
              localeCreate={this.props.localeCreate}
              hasPaidOption={this.state.hasPaidOption}
              onChangePaidOption={this.onChangePaidOption}
              keyPollSurvey={ENUM.TYPE.SURVEY}
              projectId={projectId}
              projectInfo={this.state.projectInfo}
              hideLoading={this.props.hideLoading}
              isDisableEdit={isDisableEdit}
              isAdmin={this.props.user.isadmin}
            />
          : null
        }
        {
          this.props.user.isadmin ?
          <Gift
            ref={(node) => {
              if (node) this.optionGiftEL = node;
            }}
            hasGiftOption={this.state.hasGiftOption}
            surveyInfo={this.state.surveyInfo}
            onChangeGiftOption={this.onChangeGiftOption}
            localeCreate={this.props.localeCreate}
            localeCommon={this.props.localeCommon}
          />
          : null
        }
        <ControlFormBtn
          localeCreate={this.props.localeCreate}
          localeCommon={this.props.localeCommon}
          updateSurvey={this.updateSurvey}
          isDisableEdit={isDisableEdit}
          isAdmin = {this.props.user.isadmin}
          isShowPainOption={isShowPainOption}
          togggleModalSchedule={this.togggleModalSchedule}
          fromState={this.state}
          onChangeFromdate={this.onChangeFromdate}
        />
      </div>
    );
  }
  createBasicSurveyInfo = (data) => {
    const initBasicSurveyData = {
      [INPUT_NAME.VIEW_RESULT]: false,
      [INPUT_NAME.VIEW_SOCIAL]: false,
    }
    const dataForm = Object.assign({}, data, initBasicSurveyData)
    
    if (this.state.surveyInfo && this.state.surveyInfo.id) {
      dataForm.id = this.state.surveyInfo.id;
    }
    requestAPI({
      url: APIs.survey.createSurvey.url,
      method: APIs.survey.createSurvey.method,
      dataForm,
    }).then(res => {
      if (res.success) {
        Alert.success(res.message);
        
        if (window.location.href.indexOf('create-survey') > -1) {
          const url = CHILD_ROUTE_PATH.PROJECT_EDIT_SURVEY
                        .replace(':projectId', res.data.project_id)
                        .replace(':surveyId', res.data.id)
          return this.props.history.replace(url)
        }

        const surveyInfo = merge(this.state.surveyInfo, res.data);
        this.setState({
          surveyInfo
        });
      }
    }).catch(error => {
      if(Array.isArray(error.message) || typeof error.message === 'object'){
        forEach(error.message, msg => {
          msg[0] && Alert.error(msg[0]);
        })
      }else{
        Alert.error(error.message);
      }
    });
  }
  renderPermissionError() {
    return (
      <div className="div-box box-create-poll">
        <div className="box-main-setting">
          <div className="alert alert-danger" role="alert">
            {this.props.localeCreate.CANNOT_EDIT_SURVEY_MSG}
          </div>
        </div>
      </div>
    )
  }
  render() {
    if (this.state.noHasPermissionEdit) {
      return this.renderPermissionError()
    }

    // for disable some inputs when edit poll
    let isDisableEdit = false;
    if (
      !this.isCreateSurvey &&
      this.state.surveyInfo &&
      this.state.surveyInfo.status !== DRAFT
    ) {
      isDisableEdit = true;
    }
    return (
      <form className="form form-option form-option-create-survey">
        <AddQuestionBox
          ref={(node) => {
            if (node) this.addQuestionBoxEl = node;
          }}
          projectInfo={this.state.projectInfo}
          listCategories={this.state.listCategories}
          listCityOption={this.state.listCityOption}
          surveyInfo={this.state.surveyInfo}
          isCreateSurvey={this.isCreateSurvey}
          createBasicSurveyInfo={this.createBasicSurveyInfo}
          updateQuestionOrder={this.updateQuestionOrder}
          updateSurveyInfo={this.updateSurveyInfo}
          listTargetOption={this.state.listTargetOption}
          localeCreate={this.props.localeCreate}
          localeCommon={this.props.localeCommon}
          isDisableEdit={isDisableEdit}
          isAdmin={this.props.user.isadmin}
        />
        {
            this.renderBoxes(isDisableEdit)
        }
      </form>
    )
  }
}

CreateSurveyContainer = connect((state, ownProps) => ({
  ...ownProps,
  user: state.user,
}), {
  showLoading,
  hideLoading,
})(CreateSurveyContainer)

export default (props) => <Layout
  index={4}
  title="Create Survey"
  menuIcon="assessment"
  mainContent={withRouter(() => <CreateSurveyContainer
    {...props}
  />)}
/>
