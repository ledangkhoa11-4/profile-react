import React, { Component } from 'react';
import Alert from 'react-s-alert';
import Select from 'react-select';
import Modal from 'react-responsive-modal';
import PropTypes from 'prop-types';
import merge from 'deepmerge';
import {
  cloneDeep,
  filter,
  find,
  forEach,
  isEmpty,
  map,
  reduce,
} from 'lodash';
import Description from 'components/Description';
import moment from 'moment';
import CustomDatetimePicker from 'components/CustomDatetimePicker';
import ListQuestion from './ListQuestion';
import LogicQuestion from './LogicQuestion';
import AnswerList from '../../CreatePoll/AddPollForm/AnswerList';
import SortQuestions from './SortQuestions';
import {
  ENUM,
  INPUT_NAME,
  LIST_QUESTION_TYPE_FILTER,
  QUESTION_TYPES_OPTION,
} from '../../constant';
import { isValidURL, jsonEqual, requestAPI, validateImage, convertDateToString } from 'services/utils';
import { APIs, CONFIG_QUESTIONS, BASE_URL } from 'services/config';
const {
  FROM_DATE,
  TO_DATE,
  SURVEY_NAME,
  GIZMO_LINK,
  GIZMO_STATUS_COMPLETED,
  GIZMO_STATUS_PARTIAL,
  GIZMO_STATUS_DISQUALIFIED,
  GIZMO_STATUS_FULL_QUOTA,
  GIZMO_STATUS_SALT,
  QUESTION_TYPE,
  DESCRIPTION,
  DURATION,
} = INPUT_NAME;

class AddQuestionBox extends Component {
  constructor(props) {
    super(props);
    let fromDate, toDate;
    if (props.surveyInfo[FROM_DATE]) {
      fromDate = moment(new Date(props.surveyInfo[FROM_DATE]));
      toDate = moment(new Date(props.surveyInfo[FROM_DATE])).add(10, 'years');
    } else {
        fromDate = moment();
        toDate = moment().add(10, 'years');
    }
    this.state = {
      categorySelected: undefined,
      projectSelected: props.projectInfo,
      [SURVEY_NAME]: '',
      [DESCRIPTION]: '',
      [GIZMO_LINK]: '',
      [GIZMO_STATUS_COMPLETED]: '',
      [GIZMO_STATUS_PARTIAL]: '',
      [GIZMO_STATUS_DISQUALIFIED]: '',
      [GIZMO_STATUS_FULL_QUOTA]: '',
      [GIZMO_STATUS_SALT]: '',
      isShowQuestionsPopup: false,
      isShowLogicArea: false,
      hasGizmoLink: false,
      hasOtherLink: false,
      other_link: '',
      salt_survey: '',
      survey_code: '',
      voucher_value: '',
      isValidCategory: true,
      isValidSurveyName: true,
      isValidGizmoLink: true,
      errorGizmoMsg: '',
      listQuestion: [],
      questionSelected: '', // for edit question
      questionSelectedLogic: '', // for add/update logic question
      currentQuestion: {},
      typeQuestionSelected: LIST_QUESTION_TYPE_FILTER[0],
      [QUESTION_TYPE]: QUESTION_TYPES_OPTION[0],
      isActiveUpload: false,
      image: '',
      isShowDescipbe: false,
      isValidDescription: true,
      isShowQuestionForm: false,
      question: '',
      description_question: '',
      isShowDescipbeQuestion: false,
      isValidDescriptionQuestion: true,
      isValidQuestion: true,
      isShowToDate: false,
      [FROM_DATE]: fromDate,
      [TO_DATE]: toDate,
      [DURATION]: '',
      isValidDuration: true,
      isOpen : false,
    }
  }
  componentWillReceiveProps(nextProps) {
    
    const {
      surveyInfo,
      listCategories,
      projectInfo,
    } = nextProps;
    let categorySelected = listCategories[0] || {},
        projectSelected = projectInfo;
    if (jsonEqual(this.props, nextProps)) {
      return;
    }
    
    if (surveyInfo.id && !this.props.isCreateSurvey) {
      
      forEach(surveyInfo.question, question => {
        const refs = reduce(question.answer, function (result, answer) {
          if (answer.ref && !isNaN(answer.ref)) {
            result.push(answer.ref)
          }
          return result;
        }, [])
        CONFIG_QUESTIONS.REFS = CONFIG_QUESTIONS.REFS.concat(refs)
      })
      categorySelected = find(listCategories, { value: surveyInfo.category_id })
      const gizmoLink = surveyInfo.gizmoLink || '';
      const statusCompleted = surveyInfo.status_completed || '';
      const statusPartial = surveyInfo.status_partial || '';
      const statusDisqualified = surveyInfo.status_disqualified || '';
      const statusFullQuota = surveyInfo.status_full_quota || '';
      const statusSalt = surveyInfo.status_salt || '';
      const fullThumb = surveyInfo.fullThumb || '';
      const hasGizmoLink = !!gizmoLink;
      const fromDate = moment(new Date(surveyInfo[FROM_DATE]));
      const toDate = moment(new Date(surveyInfo[TO_DATE]));
      const other_link = surveyInfo.other_link || '';
      const salt_survey = surveyInfo.salt_survey || '';
      const survey_code = surveyInfo.survey_code || '';
      const voucher_value = surveyInfo.voucher_value || '';
      const hasOtherLink = !!other_link;
      
      if (toDate.isSame(fromDate)) {
        toDate.add(100, 'years');
      }
     
      this.setState({
        categorySelected,
        projectSelected,
        [SURVEY_NAME]: surveyInfo.name,
        [DESCRIPTION]: surveyInfo[DESCRIPTION] || '',
        [GIZMO_LINK]: gizmoLink,
        [GIZMO_STATUS_COMPLETED]: statusCompleted,
        [GIZMO_STATUS_PARTIAL]: statusPartial,
        [GIZMO_STATUS_DISQUALIFIED]: statusDisqualified,
        [GIZMO_STATUS_FULL_QUOTA]: statusFullQuota,
        [GIZMO_STATUS_SALT]: statusSalt,
        hasGizmoLink,
        listQuestion: surveyInfo.question,
        [FROM_DATE]: fromDate,
        [TO_DATE]: toDate,
        isShowToDate: surveyInfo.show_to_date,
        isShowDescipbe: surveyInfo[DESCRIPTION] ? true : false,
        image: fullThumb,
        isActiveUpload: surveyInfo.thumb ? true : false,
        isShowQuestionForm: surveyInfo.question.length === 0 ? true : false,
        [DURATION]: surveyInfo[DURATION] !== 0 ? surveyInfo[DURATION] : '',
        hasOtherLink,
        other_link,
        salt_survey,
        survey_code,
        voucher_value
      },() =>{
        if(this.state[GIZMO_LINK] === ''){
          this.GenerateStatus();
        }
      })
    } else if (!isEmpty(projectInfo)) {
      this.setState({
        projectSelected,
      })
    }
  }
  
  validateQuestionBox = () => {
    const isValidProjectCategory = this.validateProjectCategory();
    const isValidSurveyName = this.validateSurveyName();
    const isValidQuestionBox = this.validateQuestion();
    const isValidAnswers = this.answersEl.validateAnswers();
    return isValidProjectCategory && isValidSurveyName &&
          isValidQuestionBox && isValidAnswers;
  }

  validateProjectCategory = () => {
    let isValidCategory = true;
    if (!this.state.categorySelected || !this.state.categorySelected.value) {
      isValidCategory = false;
      Alert.error(this.props.localeCreate.REQUIRED_CATEGORY_MSG, {
        timeout: 5000,
      })
    }
    this.setState({
      isValidCategory,
    });
    return isValidCategory;
  }

  validateSurveyName = () => {
    let isValidSurveyName = true, isValidDescription = true;
    if (!this.state[SURVEY_NAME]) {
      isValidSurveyName = false;
      Alert.error(this.props.localeCreate.REQUIRED_SURVEY_NAME_MSG, {
        timeout: 5000,
      })
    }
    if (!this.state[DESCRIPTION] && this.state.isShowDescipbe) {
      isValidDescription = false;
      Alert.error(this.props.localeCreate.REQUIRED_DESCRIPTION_MSG, {
        timeout: 5000,
      })
    }
    this.setState({
      isValidSurveyName,
      isValidDescription
     });
    return isValidSurveyName && isValidDescription;
  }
  validateQuestion = () =>{

    let isValidQuestion = true, isValidDescriptionQuestion = true;
    if (isEmpty(this.state.question) || this.state.question === '') {
      isValidQuestion = false;
      Alert.error(this.props.localeCreate.REQUIRED_QUESTION_MSG, {
        timeout: 5000,
      })
    }
    if(this.state.isShowDescipbeQuestion && (isEmpty(this.state.description_question) || this.state.description_question === '')){
      isValidDescriptionQuestion = false;
      Alert.error(this.props.localeCreate.REQUIRED_DESCRIPTION_MSG, {
        timeout: 5000,
      })
    }
    this.setState({
      isValidQuestion,
      isValidDescriptionQuestion
    });
    return isValidQuestion && isValidDescriptionQuestion;
  }
  validateGizmoLink = () => {
    let isValidGizmoLink = true;
    let errorGizmoMsg = '';
    if (this.state.hasGizmoLink) {
      if (!this.state[GIZMO_LINK]) {
        errorGizmoMsg = this.props.localeCreate.GIZMO_REQUIRED;
        isValidGizmoLink = false;
        Alert.error(errorGizmoMsg, {
          timeout: 5000,
        })
      } else if (
        (this.state[GIZMO_LINK].indexOf('surveygizmo.com') === -1 &&
        this.state[GIZMO_LINK].indexOf('survey.alchemer.com') === -1)|| 
        !isValidURL(this.state[GIZMO_LINK])
      ) {
        errorGizmoMsg = this.props.localeCreate.INVALID_GIZMO_LINK;
        isValidGizmoLink = false;
        Alert.error(errorGizmoMsg, {
          timeout: 5000,
        })
      }
    }
    this.setState({
      isValidGizmoLink,
      errorGizmoMsg
    })
    return isValidGizmoLink;
  }
  validateDuration = () =>{
    let isValidDuration = true;
    if(!this.state[DURATION] || isNaN(parseInt(this.state[DURATION], 10))){
      isValidDuration = false;
      Alert.error(this.props.localeCreate.message_please_enter_duration_survey, {
        timeout: 5000,
      })
    }
    this.setState({
      isValidDuration,
    });
    return isValidDuration;
  }
  onChangeProjectCategory = (subState) => {
    this.setState({...this.state, ...subState});
  }

  onChangeTextInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  changeQuestionSelected = (val) => {
    const currentQuestion = val && find(this.state.listQuestion, {
      id: val.value,
      question: val.label
    });
    
    const state = { questionSelected: val };
    state.currentQuestion = currentQuestion || {};

    if (currentQuestion) {
      const questionTypeString = currentQuestion.question_type;
      const questionType = find(QUESTION_TYPES_OPTION, item => {
        return item.value.indexOf(questionTypeString) > -1;
      })
      state[QUESTION_TYPE] = questionType;
      state.question = currentQuestion.question;
      if(currentQuestion.description){
        state.description_question = currentQuestion.description;
        state.isShowDescipbeQuestion = true;
      }
    }
    this.setState(state, () => {
      if (!val) {
        this.resetStateQuestion()
      }
      if (!this.state.isShowQuestionForm) {
        this.toggleQuestionForm()
      }
    });
  }
  resetStateQuestion = () =>{
    this.setState({
      question: '',
      description_question: '',
      isValidDescriptionQuestion: true,
      isValidQuestion: true,
      isShowDescipbeQuestion: false,
      [QUESTION_TYPE]: QUESTION_TYPES_OPTION[0],
    })
  }

  changeTypeQuestionSelected = (val) => {
    this.setState({
      typeQuestionSelected: val,
      questionSelected: '',
      currentQuestion: {},
    }, () => {
      this.resetStateQuestion()
    })
  }
  
  getQuestionAnswers() {
    const questionData = this.getQuestion();
    const tempData = this.answersEl.getDataEditing();
    const questionInfoInEntry = tempData.question;
    delete tempData.question
    const answersData = merge(tempData, questionInfoInEntry)
    const entry = merge(questionData, answersData)
    return entry;
  }
  getQuestion() {
    const media = { media_type: ENUM.QUESTION_MEDIA_TYPE.TEXT };
    const description = this.state.isShowDescipbeQuestion ? this.state.description_question : null;
    return {
      question: this.state.question,
      description: description,
      ...media,
    };
  }
  addQuestion = () => {
    if (!this.validateQuestionBox()) {
      return;
    }
    const { currentQuestion, listQuestion } = this.state;
    const isEdit = !isEmpty(currentQuestion);
    const provider = !isEdit ? APIs.survey.createQuestion :
                      APIs.survey.editQuestion;
    const url = isEdit ? provider.url.replace('{questionId}', currentQuestion.id) : provider.url;
    const question = this.getQuestionAnswers();
    let currentQuestions = cloneDeep(listQuestion);
    question.survey_id = this.props.surveyInfo.id;
    requestAPI({
      url,
      method: provider.method,
      dataForm: question,
    }).then(res => {
      if (res.success) {
        Alert.success(res.message);
        if (!isEdit) {
          currentQuestions.push(res.data);
        } else {
          currentQuestions = map(currentQuestions, question => {
            if (question.id === res.data.id) {
              if(question.logic){
                return {
                  ...res.data,
                  logic: question.logic
                }
              }
              return res.data;
            }
            return question;
          });
        }
        this.setState({
          listQuestion: currentQuestions,
          questionSelected: '',
          currentQuestion: {},
        }, () => {
          this.resetStateQuestion();
          this.answersEl.clearAllAnswers();
          this.props.updateSurveyInfo(currentQuestions)
          if (this.state.isShowQuestionForm) {
            this.toggleQuestionForm()
          }
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

  changeQuestionType = (val) => {
    this.setState({
      [QUESTION_TYPE]: val,
    },() =>{
        if((this.state[QUESTION_TYPE].value.indexOf(ENUM.QUESTION_TYPE.SINGLE) > -1 || this.state[QUESTION_TYPE].value.indexOf(ENUM.QUESTION_TYPE.MULTI) > -1) 
        && !this.props.isDisableEdit && this.answersEl && !isEmpty(this.state.currentQuestion) 
        && this.state[QUESTION_TYPE].value.indexOf(this.state.currentQuestion.question_type) === -1){
            this.answersEl.toggleMultiChoice();
        }
    })
  }

  renderAnswers(answers) {
    return <AnswerList
      ref={node => {
        if (node) {
          this.answersEl = node;
        }
      }}
      addQuestion={this.addQuestion}
      isCreatePoll={this.props.isCreateSurvey}
      answers={answers}
      question={this.state.currentQuestion}
      questionType={this.state[QUESTION_TYPE]}
      localeCreate={this.props.localeCreate}
      localeCommon={this.props.localeCommon}
      isDisableEdit={this.props.isDisableEdit}
    />;
  }

  togglePopupQuestions = (isShow = true) => {
    this.setState({
      isShowQuestionsPopup: isShow,
    })
  }

  toggleQuestionForm = (clear = false) => {
    this.setState({
      isShowQuestionForm: !this.state.isShowQuestionForm
    }, () =>{
      if(clear){
        this.setState({
          currentQuestion: {}
        })
        this.resetStateQuestion();
        this.answersEl.clearAllAnswers();
      }
    })
  }

  selectQuestion4Logic = (question) => {
    this.setState({
      isOpen: false,
      questionSelectedLogic: question,
    }, () => {
      this.toggleLogicArea()
    })
  }

  toggleLogicArea = (isShow = true) => {
    this.setState({ isShowLogicArea: isShow })
  }
  // openModalSwapQuestion = (question) =>{
  //   this.setState({
  //     isOpen: true,
  //     question,
  //   });
  // }
  // closeModalSwapQuestion = () =>{
  //   this.setState({ isOpen: false });
  // }
  requestSortQuestion = (question) => {
    const { sortQuestionSurvey } = APIs.project;
    
    requestAPI({
      url: sortQuestionSurvey.url,
      method: sortQuestionSurvey.method,
      dataForm: {
        survey_id: this.props.surveyInfo.id,
        question,
      },
    }).then(res => {
      if (res.success) {
        this.togglePopupQuestions(false)
        this.props.updateQuestionOrder(res.data)
      }
    })
  }
  showHideDescripbeQuestion = () =>{
    this.setState({
      isShowDescipbeQuestion: !this.state.isShowDescipbeQuestion
    })
  }
  onChangeDescriptionQuestion = (data) =>{
    this.setState({
      description_question: data
    })
  }
  getTodate(){
    return this.state.isShowToDate ? this.state[TO_DATE] : moment().add(10, 'years');
  }
  renderQuestionBox() {
    const {
      currentQuestion,
      listQuestion,
    } = this.state;
    const question = currentQuestion || {},
          answers = question.answer || [];
    return (
      <div className="row container-add-question">
            <ListQuestion
              localeCreate={this.props.localeCreate}
              listQuestion={listQuestion}
              questionSelected={this.state.questionSelected}
              changeQuestionSelected={this.changeQuestionSelected}
              typeQuestionSelected={this.state.typeQuestionSelected}
              selectQuestion4Logic={this.selectQuestion4Logic}
              removeCurrentQuestion={this.removeCurrentQuestion}
              questionOrder={this.props.surveyInfo.question_order}
              isDisableEdit={this.props.isDisableEdit}
            />
            {
              !this.props.isDisableEdit ?
                <div className="col-xs-12">
                  <div className="wrap-create-group-target-btn text-center">
                    {
                      !isEmpty(this.props.surveyInfo) ?
                        <button type="button" className="btn" onClick={() => this.toggleQuestionForm(true)}>
                          <span className="fa fa-plus"/>
                          <span className="text">
                            {
                                this.props.localeCreate.NEW_QUESTION_SURVEY
                            }            
                          </span>
                        </button>
                      : 
                          <button type="button" className="btn" onClick={this.saveSurveyName}>
                            <span className="fa fa-plus"/>
                            <span className="text">
                              {
                                  this.props.localeCreate.NEW_QUESTION_SURVEY
                              }                    
                            </span>
                          </button>
                    }
                    
                  </div>
                </div> : null
            }
            <Modal
              open={this.state.isShowQuestionForm}
              onClose={() => this.toggleQuestionForm(true)}
              classNames={{
                overlay: 'Modal-overlay-0-1',
                modal: 'Modal-modal-0-3 modal-add-question-survey',
                closeIcon: 'Modal-closeIcon-0-4'
              }}
              showCloseIcon={true}
            >
              <div className="container box-add-question-survey box-create-poll">
                <div className="row">
                  <div className="col-xs-12">
                    <div className="title">
                        {this.props.localeCreate.NEW_QUESTION_SURVEY}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-12 col-sm-8">
                      <input
                          className="input form-control input-name-question"
                          placeholder={this.props.localeCreate.QUESTION_HOLDER}
                          name='question'
                          value={this.state.question}
                          onChange={this.onChangeQuestion}
                          tabIndex='1'
                      />
                      {
                        !this.state.isValidQuestion ?
                          <span className="placeholder-error">
                            {this.props.localeCreate.REQUIRED_QUESTION_MSG}
                          </span> : null
                      }
                  </div>
                  <div className={`col-xs-12 col-sm-4 custom-select-question-type ${this.state[QUESTION_TYPE].value}-question`}>
                    <div className="form-group">
                      <Select
                          clearable={false}
                          searchable={false}
                          placeholder={this.props.localeCreate.QUESTION_TYPE_HOLDER}
                          value={this.state[QUESTION_TYPE]}
                          onChange={this.changeQuestionType}
                          options={QUESTION_TYPES_OPTION}
                          disabled={this.props.isDisableEdit}
                          className="custom-icon-select"
                          tabIndex='2'
                      />
                    </div>
                  </div>
                  <div className="col-xs-12">
                    <div className="form-group">
                        {
                          this.state.isShowDescipbeQuestion ? 
                              <a role="button" title={this.props.localeCreate.HIDE_DESCRIPTION} className="add-describe"
                              onClick={() => {
                                  this.showHideDescripbeQuestion()
                              }}>
                                  <span className="fa fa-minus"></span>
                                  <span className="text">&nbsp;{this.props.localeCreate.HIDE_DESCRIPTION}</span>
                              </a>
                          : 
                              <a role="button" title={this.props.localeCreate.ADD_DESCRIPTION} className="add-describe"
                              onClick={() => {
                                  this.showHideDescripbeQuestion()
                              }}>
                                  <span className="fa fa-plus"></span>
                                  <span className="text">&nbsp;{this.props.localeCreate.ADD_DESCRIPTION}</span>
                              </a>
                        }
                    </div>
                </div>
                  {
                      this.state.isShowDescipbeQuestion ?  
                          <Description 
                              data={this.state.description_question}
                              onChange={this.onChangeDescriptionQuestion}
                              isValidDescription={this.state.isValidDescriptionQuestion}
                          />
                      : null
                  }
                  { this.renderAnswers(answers) }
                  <div className="col-xs-12">
                    <div className="pull-right">
                      <button
                        type="button"
                        name="Save"
                        className="btn"
                        onClick={this.addQuestion}
                        title={this.props.localeCreate.button_save_question_holder}
                      >
                        <span className="material-icons">save</span>
                        <span className="text">
                          {this.props.localeCreate.button_save_question}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
            <Modal
              open={this.state.isShowLogicArea}
              onClose={() => this.toggleLogicArea(false)}
              classNames={{
                overlay: 'Modal-overlay-0-1',
                modal: 'Modal-modal-0-3 logic-skip-box',
                closeIcon: 'Modal-closeIcon-0-4'
              }}
              showCloseIcon={true}
            >
              <LogicQuestion
                listTargetOption={this.props.listTargetOption}
                listCityOption={this.props.listCityOption}
                listQuestion={this.state.listQuestion}
                updateSurveyInfo={this.props.updateSurveyInfo}
                questionSelectedLogic={this.state.questionSelectedLogic}
                closeLogicArea={this.toggleLogicArea}
              /> 
            </Modal>
            <Modal
              open={this.state.isShowQuestionsPopup}
              onClose={() => {
                this.togglePopupQuestions(false)
              }}
              showCloseIcon={true}
              classNames={{
                overlay: 'Modal-overlay-0-1',
                modal: 'Modal-modal-0-3',
                closeIcon: 'Modal-closeIcon-0-4'
              }}
            >
              {
                this.state.listQuestion ?
                  <SortQuestions
                    listQuestion={this.state.listQuestion}
                    questionOrder={this.props.surveyInfo.question_order}
                    surveyId={this.props.surveyInfo.id}
                    updateQuestionOrder={this.props.updateQuestionOrder}
                    closeModal={this.togglePopupQuestions}
                    requestSortQuestion={this.requestSortQuestion}
                  /> : null
              }
            </Modal>
      </div>
    )
  }
  removeCurrentQuestion = (question) => {
    const { deleteAQuestion } = APIs.survey;
    const {
      currentQuestion,
      listQuestion,
    } = this.state;
    const questionId = (question && question.value) || currentQuestion.id

    if (this.props.isDisableEdit) {
      return;
    }

    if (
      this.props.surveyInfo.question_order &&
      this.props.surveyInfo.question_order.length
    ) {
      const question = this.props.surveyInfo.question_order.filter(item => {
        return !!find(listQuestion, { id: item }) && item !== questionId
      })
      this.requestSortQuestion(question)
    }

    requestAPI({
      url: deleteAQuestion.url.replace('{questionId}', questionId),
      method: deleteAQuestion.method,
    }).then(res => {
      if (res.success) {
        const newListQuestion = filter(listQuestion, question => {
          return question.id !== questionId
        })
        this.setState({
          questionSelected: '',
          currentQuestion: {},
        }, () => {
          this.props.updateSurveyInfo(newListQuestion)
          if (this.state.isShowQuestionForm) {
            this.toggleQuestionForm()
          }
        })
        Alert.success(res.message)
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
  validateSurveyOther = () => {
    let isValidSurveyCode = true;
    let  isValidSurveySalt = true;
    let  isValidVoucherValue = true;
    let  isValidLinkSurvey = true;
    if (!this.state.other_link) {
      isValidSurveyCode = false;
      Alert.error("Other link is required!", {
        timeout: 5000,
      })
    }
    if (!this.state.salt_survey) {
      isValidSurveySalt = false;
      Alert.error("Salt is required!", {
        timeout: 5000,
      })
    }
    if (!this.state.survey_code) {
      isValidVoucherValue = false;
      Alert.error("Survey code is required!", {
        timeout: 5000,
      })
    }
    if (!this.state.voucher_value) {
      isValidLinkSurvey = false;
      Alert.error("Voucher is required!", {
        timeout: 5000,
      })
    }
    this.setState({
      isValidSurveyCode,
      isValidSurveySalt,
      isValidVoucherValue,
      isValidVoucherValue
     });
    return isValidSurveyCode && isValidSurveySalt && isValidVoucherValue && isValidLinkSurvey;
  }
  getDataSurvey = () =>{

   
    
    const isValidSurveyName = this.validateSurveyName();
    const isValidGizmoLink = this.validateGizmoLink();
    const isValidDuration = this.validateDuration();
    const isValidCategory = this.validateProjectCategory();

    
    if ( !isValidSurveyName || !isValidGizmoLink || !isValidDuration|| !isValidCategory) {
      return;
    }

    if(this.state.hasOtherLink){
      const isValidSurveyOther = this.validateSurveyOther();
      if(!isValidSurveyOther){
        return;
      }
    }
    
    // save survey name
    const data = {
      name: this.state[SURVEY_NAME],
      project_id: this.props.projectInfo.value,
      category_id: this.state.categorySelected.value,
      show_to_date: this.state.isShowToDate ? true : false,
      [FROM_DATE]: convertDateToString(this.state[FROM_DATE].toDate()),
      [TO_DATE]: this.state.isShowToDate ? convertDateToString(this.state[TO_DATE].toDate()) : convertDateToString(moment().add(10, 'years').toDate()),
      [DURATION]: parseInt(this.state[DURATION], 10)
    }
    if (this.state.hasGizmoLink) {
      data[GIZMO_LINK] = this.state[GIZMO_LINK]
      data[GIZMO_STATUS_COMPLETED] = this.state[GIZMO_STATUS_COMPLETED]
      data[GIZMO_STATUS_PARTIAL] = this.state[GIZMO_STATUS_PARTIAL]
      data[GIZMO_STATUS_DISQUALIFIED] = this.state[GIZMO_STATUS_DISQUALIFIED]
      data[GIZMO_STATUS_FULL_QUOTA] = this.state[GIZMO_STATUS_FULL_QUOTA]
      data[GIZMO_STATUS_SALT] = this.state[GIZMO_STATUS_SALT]
    }
    if(this.state.hasOtherLink){
      data['other_link'] = this.state.other_link
      data['salt_survey'] = this.state.salt_survey
      data['survey_code'] = this.state.survey_code
      data['voucher_value'] = this.state.voucher_value
    }
    if(this.state.isActiveUpload){
      data['thumb'] = this.state.image;
    }
    if(this.state[DESCRIPTION] && this.state.isShowDescipbe){
      data[DESCRIPTION] = this.state[DESCRIPTION]
    }
    return data;
  }
  saveSurveyName = () => {
    const isValidSurveyName = this.validateSurveyName();
    const isValidGizmoLink = this.validateGizmoLink();

    if ( !isValidSurveyName || !isValidGizmoLink) {
      return;
    }
    const category = !isEmpty(this.state.categorySelected) ? this.state.categorySelected.value : this.props.listCategories[0].value;
    // save survey name
    const data = {
      name: this.state[SURVEY_NAME],
      project_id: this.props.projectInfo.value,
      category_id: category,
      show_to_date: this.state.isShowToDate ? true : false,
      [FROM_DATE]: convertDateToString(this.state[FROM_DATE].toDate()),
      [TO_DATE]: this.state.isShowToDate ? convertDateToString(this.state[TO_DATE].toDate()) : convertDateToString(moment().add(10, 'years').toDate()),
    }
    if (this.state.hasGizmoLink) {
      data[GIZMO_LINK] = this.state[GIZMO_LINK]
      data[GIZMO_STATUS_COMPLETED] = this.state[GIZMO_STATUS_COMPLETED]
      data[GIZMO_STATUS_PARTIAL] = this.state[GIZMO_STATUS_PARTIAL]
      data[GIZMO_STATUS_DISQUALIFIED] = this.state[GIZMO_STATUS_DISQUALIFIED]
      data[GIZMO_STATUS_FULL_QUOTA] = this.state[GIZMO_STATUS_FULL_QUOTA]
      data[GIZMO_STATUS_SALT] = this.state[GIZMO_STATUS_SALT]
    }
    if(this.state.hasOtherLink){
      data['other_link'] = this.state.other_link
    }
    if(this.state.isActiveUpload){
      data['thumb'] = this.state.image;
    }
    if(this.state[DESCRIPTION] && this.state.isShowDescipbe){
      data[DESCRIPTION] = this.state[DESCRIPTION]
    }
    if(this.state[DURATION] && !isNaN(parseInt(this.state[DURATION], 10))){
      data[DURATION] = parseInt(this.state[DURATION], 10);
    }
    this.props.createBasicSurveyInfo(data);
  }
  GenerateStatus(){
    this.setState({
      [GIZMO_STATUS_COMPLETED]: this.GenerateRandomString(20),
      [GIZMO_STATUS_PARTIAL]: this.GenerateRandomString(20),
      [GIZMO_STATUS_DISQUALIFIED]: this.GenerateRandomString(20),
      [GIZMO_STATUS_FULL_QUOTA]: this.GenerateRandomString(20),
      [GIZMO_STATUS_SALT]: this.GenerateRandomString(5),
    });
  }
  GenerateRandomString(len){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < len; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
  handlePreviewImg = (e) => {
    if (!validateImage(e.target)) {
      return;
    }
    const file = e.target.files[0] || '';
    let reader = new FileReader();
    if (!file) {
      return this.setState({
        image: '',
        isActiveUpload: false,
      });
    }

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      reader.onloadend = () => {
        this.setState({
          image: reader.result,
          isActiveUpload: true,
        });
      }
      reader.readAsDataURL(file);
    }, 50);
  }
  clearInput = (e) => {
    this.imgInput.value = '';
    this.setState({
      isActiveUpload: false,
      image: '',
    });
  }
  onChangeDescription = (data) =>{
    this.setState({
      [DESCRIPTION]: data
    })
  }
  showHideDescripbe = () =>{
    this.setState({
        isShowDescipbe: !this.state.isShowDescipbe
    })
  }
  onChangeQuestion = (e) =>{
    const { value } = e.target;
    this.setState({
      question: value
    })
  }
  onChangeHasGizmoLink = () =>{
    if(!this.state.hasGizmoLink && this.state[GIZMO_STATUS_COMPLETED] === ''){
      this.GenerateStatus();
    }
    // this.setState({
    //   hasGizmoLink: !this.state.hasGizmoLink,
    //   hasOtherLink: this.state.hasGizmoLink,
    // })
    if(this.state.hasGizmoLink){
      this.setState({
        hasGizmoLink: !this.state.hasGizmoLink,
      })
    }
    if(!this.state.hasGizmoLink){
      if(this.state.hasOtherLink){
        this.setState({
          hasGizmoLink: !this.state.hasGizmoLink,
          hasOtherLink: !this.state.hasOtherLink,
        })
      }else{
        this.setState({
          hasGizmoLink: !this.state.hasGizmoLink,
        })
      }
    }
  }
  
  onChangeHasOtherLink = () =>{
    if(this.state.hasOtherLink){
      this.setState({
        hasOtherLink: !this.state.hasOtherLink,
      })
    }
    if(!this.state.hasOtherLink){
      if(this.state.hasGizmoLink){
        this.setState({
          hasOtherLink: !this.state.hasOtherLink,
          hasGizmoLink: !this.state.hasGizmoLink,
        })
      }else{
        this.setState({
          hasOtherLink: !this.state.hasOtherLink,
        })
      }
    }
    // this.setState({
    //   hasOtherLink: !this.state.hasOtherLink,
    //   hasGizmoLink: this.state.hasOtherLink,
    // })
  }
  onChangeShowToDate = () =>{
    if(!this.state.isShowToDate && !this.props.surveyInfo.show_to_date){
      this.setState({
        isShowToDate: true,
        [TO_DATE]: moment().add( 2, 'days')
      })
    }else{
      this.setState({
        isShowToDate: !this.state.isShowToDate
      })
    }
  }
  onChangeToDate = (val) =>{
    this.setState({
        [TO_DATE]: val
    })
  }
  onChaneTime = (e) =>{
    const { value } = e.target;
    this.setState({
      [DURATION]: value
    })
  }
  render() {
    const {
      localeCreate,
      localeCommon,
    } = this.props;
    const resultLinkGizmo = BASE_URL + '/update-status';
    return (
      <div className="div-box box-survey-add">
        <div className="box-main-setting inner">
            <div className="row">
              <div className="col-xs-12">
                <div className="sub-title">
                  {this.state.projectSelected.label}
                </div>
                <div className="title">
                    {localeCreate.title_create_new_survey}
                </div>
              </div>
              <div className="col-xs-12">
                <input
                  className="input-custom form-control"
                  placeholder={localeCreate.SURVEY_HOLDER}
                  name={SURVEY_NAME}
                  value={this.state[SURVEY_NAME]}
                  onChange={this.onChangeTextInput}
                />
                {
                  !this.state.isValidSurveyName ?
                    <span className="placeholder-error">
                      {localeCommon.REQUIRED_FIELD_MSG}
                    </span> : null
                }
              </div>
              <div className="col-xs-12">
                  <div className="form-group">
                      {
                          this.state.isShowDescipbe ? 
                              <a role="button" title={localeCreate.HIDE_DESCRIPTION} className="add-describe"
                              onClick={() => {
                                  this.showHideDescripbe()
                              }}>
                                  <span className="fa fa-minus"></span>
                                  <span className="text">&nbsp;{localeCreate.HIDE_DESCRIPTION}</span>
                              </a>
                          : 
                              <a role="button" title={localeCreate.ADD_DESCRIPTION} className="add-describe"
                              onClick={() => {
                                  this.showHideDescripbe()
                              }}>
                                  <span className="fa fa-plus"></span>
                                  <span className="text">&nbsp;{localeCreate.ADD_DESCRIPTION}</span>
                              </a>
                      }
                  </div>
              </div>
              {
                  this.state.isShowDescipbe ?  
                      <Description 
                          data={this.state[DESCRIPTION]}
                          onChange={this.onChangeDescription}
                          isValidDescription={this.state.isValidDescription}
                      />
                  : null
              }
              <div className="col-xs-12">
                  <div className="custom-checkbox-small noselect check-gizmo">
                      <div className="custom-checkbox-1">
                        <input
                          id="control-gizmo"
                          type="checkbox"
                          disabled={this.props.isDisableEdit || (this.props.surveyInfo && this.props.surveyInfo.question && this.props.surveyInfo.question.length > 0)}
                          checked={this.state.hasGizmoLink}
                          onChange={this.onChangeHasGizmoLink}
                        />
                        <div className="checkbox-visible"></div>
                      </div>
                      <label htmlFor="control-gizmo" className={this.state.hasGizmoLink ? 'active' : ''}>
                      { localeCreate.GIZMO_LABEL }
                    </label>
                  </div>
              </div>
              {
                this.state.hasGizmoLink ?
                <div className="col-xs-12">
                  <div className="row box-has-gizmo">
                    <div className="col-xs-12">
                      <div className="form-group">
                        <label>
                          {localeCreate.GIZMO_HOLDER}:
                        </label>
                        <input
                          className="input-custom form-control"
                          placeholder={localeCreate.GIZMO_HOLDER}
                          name={GIZMO_LINK}
                          value={this.state[GIZMO_LINK]}
                          onChange={this.onChangeTextInput}
                        />
                        {
                          this.state.hasGizmoLink && !this.state.isValidGizmoLink ?
                            <span className="placeholder-error">
                              {this.state.errorGizmoMsg}
                            </span> : null
                        }
                      </div>
                    </div>
                    <div className="col-xs-12">
                      <div className="form-group">
                        <label>
                          {localeCreate.GIZMO_RESULT_HOLDER}:
                        </label>
                        <input
                          className="input-custom form-control"
                          readOnly={true}
                          defaultValue={resultLinkGizmo}
                        />
                      </div>
                    </div>
                    <div className="col-xs-12">
                      <div className="form-group">
                        <label>
                          Completed Hash:
                        </label>
                        <input
                          className="input-custom form-control"
                          readOnly={true}
                          defaultValue={this.state[GIZMO_STATUS_COMPLETED]}
                        />
                      </div>
                    </div>
                    <div className="col-xs-12">
                      <div className="form-group">
                        <label>
                          Partial Hash:
                        </label>
                        <input
                          className="input-custom form-control"
                          readOnly={true}
                          defaultValue={this.state[GIZMO_STATUS_PARTIAL]}
                        />
                      </div>
                    </div>
                    <div className="col-xs-12">
                      <div className="form-group">
                        <label>
                          Disqualified Hash:
                        </label>
                        <input
                          className="input-custom form-control"
                          readOnly={true}
                          defaultValue={this.state[GIZMO_STATUS_DISQUALIFIED]}
                        />
                      </div>
                  </div>
                    <div className="col-xs-12">
                      <div className="form-group">
                        <label>
                          Full_Quota Hash:
                        </label>
                        <input
                          className="input-custom form-control"
                          readOnly={true}
                          defaultValue={this.state[GIZMO_STATUS_FULL_QUOTA]}
                        />
                      </div>
                    </div>
                    <div className="col-xs-12">
                    <div className="form-group">
                      <label>
                        Salt:
                      </label>
                      <input
                        className="input-custom form-control"
                        readOnly={true}
                        defaultValue={this.state[GIZMO_STATUS_SALT]}
                      />
                    </div>
                  </div>
                  </div>
                </div> : null
              }
              {
                this.props.isAdmin ?
                <div className="col-xs-12">
                  <div className="custom-checkbox-small noselect check-gizmo">
                      <div className="custom-checkbox-1">
                        <input
                          id="control-other-link"
                          type="checkbox"
                          disabled={this.props.isDisableEdit || (this.props.surveyInfo && this.props.surveyInfo.question && this.props.surveyInfo.question.length > 0)}
                          checked={this.state.hasOtherLink}
                          onChange={this.onChangeHasOtherLink}
                        />
                        <div className="checkbox-visible"></div>
                      </div>
                      <label htmlFor="control-other-link" className={this.state.hasOtherLink ? 'active' : ''}>
                      Dùng Khảo Sát Khác
                    </label>
                  </div>
                </div> : null
              }
              
              {
              this.state.hasOtherLink ?
                <div className="col-xs-12">
                    <div className="row box-has-gizmo">
                      <div className="col-xs-12">
                        <div className="form-group">
                          <label>
                            Nhập đường dẫn khảo sát (*):
                          </label>
                          <input
                            className="input-custom form-control"
                            placeholder={"Nhập đường đẫn khảo sát khác"}
                            value={this.state.other_link}
                            name={"other_link"}
                            onChange={this.onChangeTextInput}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row box-has-gizmo">
                      <div className="col-xs-12">
                        <div className="form-group">
                          <label>
                            Salt (*):
                          </label>
                          <input
                            className="input-custom form-control"
                            placeholder={"Nhập salt"}
                            value={this.state.salt_survey}
                            name={"salt_survey"}
                            required
                            onChange={this.onChangeTextInput}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row box-has-gizmo">
                      <div className="col-xs-12">
                        <div className="form-group">
                          <label>
                            Survey code (*):
                          </label>
                          <input
                            className="input-custom form-control"
                            placeholder={"Nhập survey code"}
                            value={this.state.survey_code}
                            name={"survey_code"}
                            onChange={this.onChangeTextInput}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row box-has-gizmo">
                      <div className="col-xs-12">
                        <div className="form-group">
                          <label>
                            Giá trị voucher (*):
                          </label>
                          <input
                            className="input-custom form-control"
                            placeholder={"Nhập giá trị voucher"}
                            value={this.state.voucher_value}
                            name={"voucher_value"}
                            type="number"
                            onChange={this.onChangeTextInput}
                            required
                          />
                        </div>
                      </div>
                    </div>
                </div>
                : null
              }
            </div>
            {
            !this.state.hasGizmoLink && !this.state.hasOtherLink ?
              this.renderQuestionBox() : null
            }
        </div>
        <div className="box-main-setting inner box-create-poll">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div className="row">
                  <div className="col-sm-6">
                      <div className="create-img-poll">
                          <div className="title">
                              {localeCreate.TITLE_THUMB_POLL_AND_SURVEY}
                          </div>
                          <div className="review-img-poll">
                              {
                                this.state.isActiveUpload ?
                                  <div className="review-img">
                                      <a
                                          onClick={this.clearInput}
                                      >
                                          <img src={this.state.image} alt="preview img"/>
                                      </a>
                                  </div>
                                :
                                  <a
                                      onClick={()=>{
                                          this.imgInput.click()
                                      }}
                                  >
                                      <div className="default-img">
                                          <img src={require('assets/images/img-poll.png')} alt="default img"/>
                                          <div className="text-size">
                                            {localeCreate.SZE_THUMB_SURVEY}
                                          </div>
                                      </div>
                                  </a>
                              }
                              <input
                              ref={(node) => {
                                  if (node) {
                                  this.imgInput = node;
                                  }
                              }}
                              type="file"
                              id="question-image"
                              name="question-image"
                              className="hidden"
                              onChange={this.handlePreviewImg}
                              />
                          </div>
                      </div>
                  </div>
                  <div className="col-sm-6">
                      <div className="add-category-and-to-date">
                          <div className="add-category">
                              <div className="title">
                                  {localeCreate.CATEGORY}
                              </div>
                              <div>
                                  <Select
                                    className="custom-select"
                                    name={INPUT_NAME.CATEGORY}
                                    clearable={false}
                                    searchable={false}
                                    options={this.props.listCategories}
                                    onChange={(val) => {
                                        this.onChangeProjectCategory({categorySelected: val})
                                    }}
                                    placeholder={this.props.localeCreate.CATEGORY}
                                    value={this.state.categorySelected}
                                  />
                                  {
                                  !this.state.isValidCategory ?
                                      <span className="placeholder-error">
                                      {localeCommon.REQUIRED_FIELD_MSG}
                                      </span> : null
                                  }
                              </div>
                          </div>
                          <div className="row">
                              <div className="col-sm-12 col-md-12 col-lg-8">
                                <div className="choose-to-date">
                                    <div className="answer-advanced-settings">
                                        <div className="custom-checkbox-1">
                                            <input
                                              id="isShowToDate"
                                              type="checkbox"
                                              checked={this.state.isShowToDate}
                                              onChange={this.onChangeShowToDate}
                                            />
                                            <div className="checkbox-visible"></div> 
                                        </div>
                                        <label htmlFor="isShowToDate" className="text-settings noselect">
                                            {localeCreate.Customize_the_end_date}
                                        </label>
                                    </div>
                                </div>
                                {
                                    this.state.isShowToDate ?
                                        <div>
                                            <CustomDatetimePicker
                                                id={TO_DATE}
                                                name={TO_DATE}
                                                dateFormat="DD-MM-YYYY HH:mm"
                                                minDate={this.state[FROM_DATE]}
                                                selected={this.state[TO_DATE]}
                                                onChange={(val) => this.onChangeToDate(val)
                                                }
                                                calendarClassName="custom"
                                            />
                                        </div>
                                    : null
                                }
                              </div>
                              <div className="col-sm-12 col-md-12 col-lg-4">
                                <div className="box-time-of-survey">
                                    <div className="title-time">
                                        {this.props.localeCreate.message_title_time_survey}
                                    </div>
                                    <div>
                                      <input
                                        type="number"
                                        name="time-survey"
                                        className="form-control"
                                        value={this.state[DURATION]}
                                        onChange={this.onChaneTime}
                                        placeholder="00"
                                      />
                                      <span>{this.props.localeCreate.message_time_survey}</span>
                                    </div>
                                    {
                                    !this.state.isValidDuration ?
                                        <span className="placeholder-error">
                                        {localeCommon.REQUIRED_FIELD_MSG}
                                        </span> : null
                                    }
                                </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AddQuestionBox.propTypes = {
  isCreateSurvey: PropTypes.bool,
  projectInfo: PropTypes.object.isRequired,
  listCategories: PropTypes.array.isRequired,
  surveyInfo: PropTypes.object,
  createBasicSurveyInfo: PropTypes.func.isRequired,
  updateQuestionLength: PropTypes.func,
}

export default AddQuestionBox;
