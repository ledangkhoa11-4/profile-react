import React, { Component } from 'react';
import Alert from 'react-s-alert';
import moment from 'moment';
import {
  cloneDeep,
  isEmpty,
  find,
  filter,
  forEach,
  map,
  reduce,
} from 'lodash';
import { APIs } from 'services/config';
import {
  convertDateToString,
  requestAPI,
} from 'services/utils';
import {
  COMPARE_VAL,
  GENDEROPT,
  ENUM,
  INPUT_NAME,
  EXTEND_OPTION_TYPE,
} from '../../../constant';
import TargetOption from './TargetOption';

const {
  TARGET_NAME,
  AGE_FROM,
  AGE_TO,
  GENDER,
  CITY,
  COUNTRY,
} = INPUT_NAME;
const {
  SINGLE,
  MULTI,
  DATE,
} = ENUM.QUESTION_TYPE;
const localeCreate = window.locale.Create;

function parseTargetOption(targets, listCityOption) {
  return map(targets, item => {
    const entry = {};
    entry.option = [...item.option];
    entry.target = {};
    entry.target[AGE_FROM] = item[AGE_FROM];
    entry.target[AGE_TO] = item[AGE_TO];
    entry.target[GENDER] = item[GENDER];
    entry.target[CITY] = item[CITY];
    entry.target[COUNTRY] = item[COUNTRY];
    entry.extend_option = item.extend_option;

    const city = map(entry.target.city, item => {
      return find(listCityOption, { value: parseInt(item, 10) })
    })
    const gender = entry.target.gender;
    entry.target[CITY] = city;
    entry.target[GENDER] = gender;
    entry.compare = item.compare

    const question = reduce(item.question, (result, entry) => {
      result[entry.question_id] = reduce(entry.answer_id, (_result, item) => {
        _result[item.id] = entry.question_type === DATE ? moment(item.value) : item.value
        _result.question_type = entry.question_type
        _result[`${this.props.keyPollSurvey}_id`] = entry[`${this.props.keyPollSurvey}_id`]
        return _result
      }, {})
      return result
    }, {})
    entry.question = question;
    return entry;
  })
}

function parseQuestionOfTarget(question) {
  return reduce(question, (totalResult, entry, questionKey) => {
    const answers = reduce(entry, (result, item, answerKey) => {
      const answerId = parseInt(answerKey, 10)

      if (isNaN(answerId)) {
        return result;
      }

      if (entry.question_type === DATE ) {
        result.push({
          id: answerId,
          value: convertDateToString(entry[answerKey].toDate()),
        })
        return result
      }
      
      if (item) {
        result.push({
          id: parseInt(answerKey, 10),
          value: item,
        })
      }
      return result
    }, [])

    if (answers.length) {
      totalResult.push({
        id: parseInt(questionKey, 10),
        answer: answers,
        question_type: entry.question_type,
        [`${this.props.keyPollSurvey}_id`]: entry[`${this.props.keyPollSurvey}_id`]
      })
    }

    return totalResult
  }, [])
}

class TargetOptionContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idxActive: 0,
      isValidTargetName: true,
      isExpandSavingTarget: false,
      isExpandTargetModal: false,
      isExpandTargetForm: false,
      isExpandshowTarget: false,
      // the selected option, not basic
      answerSelected: {},
      // value for targetting Select
      currentUserTargetSelected: '',
      //////////////////////
      childrenTargets: [],
      currentIndexChildTarget: -1,
      [TARGET_NAME]: '',
      [AGE_FROM]: 1,
      [AGE_TO]: 100,
      [GENDER]: GENDEROPT.ALL,
      [CITY]: '',
      currentPollSurveySelected: '',
      currentListQuestion: [],
      currentQuestionSelected: '',
      targetQuestionAnswer: {},
      extendsOptTypeTags: [],
      extendsOptType: EXTEND_OPTION_TYPE[0],
      ListShowItemChildrenTargetDetail: [],
      indexTab: 0,
      isShowOptionUserTarget: false,
      dataTargetChoose: {},
      
    }
  }
  componentWillMount() {
    const {
      target,
      listCityOption,
    } = this.props;

    if (target) {
      const childrenTargets = parseTargetOption.call(this, target.value, listCityOption)
      this.setState({ childrenTargets })
    }
  }

  getCurrentTargetFromState = () => {
    const {
      childrenTargets,
      currentIndexChildTarget,
      targetQuestionAnswer,
      extendsOptTypeTags,
      extendsOptType,
    } = this.state;
    const target = {}
    const ageFrom = parseInt(this.state[AGE_FROM], 10)
    const ageTo = parseInt(this.state[AGE_TO], 10)
    if (this.state[GENDER]) target[GENDER] =  this.state[GENDER];
    if (this.state[CITY]) target[CITY] = this.state[CITY];
    if (!isNaN(ageFrom)) target[AGE_FROM] = ageFrom;
    if (!isNaN(ageTo)) target[AGE_TO] = ageTo;
    if (!isEmpty(target)) target[COUNTRY] = 'VietNam';
    const option = this.getAnOptionData()
    const question = targetQuestionAnswer;
    const extend_option = {};
    if (extendsOptTypeTags.length) {
      extend_option.type = extendsOptType.value;
      extend_option.value = extendsOptTypeTags;
    }
    if (
      !option.length &&
      isEmpty(question) &&
      isEmpty(target) &&
      isEmpty(extend_option)
    ) {
      return undefined;
    }

    let compare = COMPARE_VAL.AND;
    if (currentIndexChildTarget > -1) {
      compare = childrenTargets[currentIndexChildTarget].compare
    }
    return {
      target,
      option,
      question,
      extend_option,
      compare,
    }
  }

  appendTarget = () => {
    const {
      currentIndexChildTarget,
      childrenTargets,
    } = this.state;

    const currentChildTarget = this.getCurrentTargetFromState();
    let newChildrenTargets;

    if (!currentChildTarget) {
      return Alert.error(localeCreate.NO_VALUE_ERROR);
    }

    if (currentIndexChildTarget > -1) {
      newChildrenTargets = cloneDeep(childrenTargets)
      newChildrenTargets[currentIndexChildTarget] = currentChildTarget;
    } else {
      newChildrenTargets = childrenTargets.concat([currentChildTarget]);
    }
    this.setState({
      childrenTargets: newChildrenTargets,
    }, () => {
      this.props.getListUserFilter()
      this.clearTargetForm()
      this.onToggleTargetForm()
    })
  }
  
  clearTargetForm = () => {
    this.setState({
      [AGE_FROM]: 1,
      [AGE_TO]: 100,
      [GENDER]: GENDEROPT.ALL,
      [CITY]: '',
      answerSelected: {},
      idxActive: 0,
      indexTab: 0,
      currentIndexChildTarget: -1,
      currentPollSurveySelected: '',
      currentListQuestion: [],
      currentQuestionSelected: '',
      targetQuestionAnswer: {},
      extendsOptTypeTags: [],
      extendsOptType: EXTEND_OPTION_TYPE[0],
      isShowExtendsOptTypeDetail: false,
      statusInputTxt: '',
      dataTargetChoose: {},
      currentUserTargetSelected: '',
    })
  }

  saveTarget = () => {
    if (!this.validateTargetName()) {
      return;
    }
    const targetData = this.getCurrentTargetFromState();
    
    if (!targetData) {
      return Alert.error(localeCreate.NO_VALUE_ERROR);
    } else {
      if (isEmpty(targetData.target)) {
        delete targetData.target;
      }else{
        if(!isEmpty(targetData.target.city)){
          targetData.target.city = map(targetData.target.city, city => city.value);
        }
        // if(!isEmpty(targetData.target.gender)){
          
        //   targetData.target.gender = map(targetData.target.gender, gender => gender.value);
        // }
      }
      if (isEmpty(targetData.option)) {
        delete targetData.option;
      }
      if (isEmpty(targetData.question)) {
        delete targetData.question;
      } else {
        targetData.question = parseQuestionOfTarget.call(this, targetData.question )
      }
      if (isEmpty(targetData.extend_option)) {
        delete targetData.extend_option;
      }
    }
    targetData.name = this.state[TARGET_NAME];
    targetData.target_type = this.props.keyPollSurvey.toLowerCase();
    targetData.project_id = this.props.projectId;
    requestAPI({
      url: APIs.target.createTarget.url,
      method: APIs.target.createTarget.method,
      dataForm: targetData,
    }).then(res => {
      const currentUserTargetSelected = {
        value: res.data.id,
        label: res.data.name,
      };
      const entry = [{
        id: res.data.id,
        name: res.data.name,
      }];
      Alert.success(res.message)
      this.setState({ 
        currentUserTargetSelected,
        isExpandTargetModal: false
       }, () => {
        this.props.updateListTargetOfUser(entry);
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
          this.setState({
            isExpandTargetForm: true
          })
        }, 50)
      });
    }).catch(error =>{
      if(typeof error.message === 'object'){
        forEach(error.message, msg => {
          msg[0] && Alert.error(msg[0]);
        })
      }else{
        Alert.error(error.message)
      }
    })
  }

  deleteChildTarget = (idx) => {
    const {
      childrenTargets,
    } = this.state;
    const newChildrenTargets = filter(childrenTargets, (target, index) => {
      return index !== idx;
    })
    this.setState({
      childrenTargets: newChildrenTargets,
    }, () => {
      this.props.getListUserFilter()
      this.clearTargetForm()
    })
  }

  getAnOptionData() {
    const { listTargetOption } = this.props;

    const optData = reduce(this.state.answerSelected, (finalResult, answer, key) => {
      let result;
      result = reduce(listTargetOption, (_result, targetOpt) => {
        const temp = filter(targetOpt.question, question => question.id === parseInt(key, 10))
        return [..._result, ...temp]
      }, []);
      if (result.length) {
        let answer_id;
        if (Array.isArray(answer)) {
          answer_id = map(answer, ans => parseInt(ans, 10));
        } else {
          answer_id = [answer.value];
        }
        finalResult.push({
          categorie_id: parseInt(result[0].categorie_id, 10),
          question_id: result[0].id,
          answer_id,
        })
      }
      return finalResult;
    }, []);
    return optData;
  }

  getTargetOptData() {
    const { childrenTargets } = this.state;
    const target = map(childrenTargets, item => {
      const _target = item.target;
      const option = item.option;
      const genderCityObj = {};

      if (_target[GENDER] && !isEmpty(_target[GENDER])) {
        genderCityObj.gender = _target[GENDER]
      }
      if (_target[CITY] && _target[CITY].length) {
        genderCityObj.city = map(_target[CITY], city => city.value)
      }

      const newTarget = Object.assign({}, _target, genderCityObj)
      const targetQuestion = parseQuestionOfTarget.call(this, item.question )
      const result = {
        option,
        target: newTarget,
        question: targetQuestion,
        compare: item.compare,
        extend_option: item.extend_option,
      }
      if (!result.option.length) {
        delete result.option
      }
      if (!result.question.length) {
        delete result.question
      }
      if (!result.extend_option) {
        delete result.extend_option
      }
      
      if (isEmpty(result.target)) {
        delete result.target;
      } else {
        if (isEmpty(result.target.gender) || result.target.gender === '')
          delete result.target.gender;
        if (isEmpty(result.target.city) || result.target.city.length === 0)
          delete result.target.city;
        if (isEmpty(result.target[COUNTRY]) || result.target[COUNTRY].length === 0)
          delete result.target[COUNTRY];
        if (!result.target[AGE_FROM])
          delete result.target[AGE_FROM];
        if (!result.target[AGE_TO])
          delete result.target[AGE_TO];
      }

      return result;
    });

    return target;
  }
  onChangeTabIndex = (idx) => {
    if (idx === this.state.idxActive) return;
    this.setState({ idxActive: idx });
  }
  onChanShowItemChildrenTargetDetail = (idx) => {
    const ListShowItemChildrenTargetDetail = cloneDeep(this.state.ListShowItemChildrenTargetDetail);
    if(ListShowItemChildrenTargetDetail[idx]){
      ListShowItemChildrenTargetDetail[idx] = false;
    }else{
      ListShowItemChildrenTargetDetail[idx] = true;
    }
    this.setState({
      ListShowItemChildrenTargetDetail
    })
  }
  /*
  * change answer for the option
  */
  onChangeAnswers = (type, questionid, e) => {
    let newAnswer;
    let answerid = parseInt(e.target.value, 10);
    const answerSelected = cloneDeep(this.state.answerSelected);
    if(typeof this.state.answerSelected[questionid] === 'undefined'){
        newAnswer = { [questionid]: [answerid] };
    }else{
        if(this.state.answerSelected[questionid].indexOf(answerid) > -1){
          if(type === 'radio'){
              newAnswer = {[questionid]: undefined};
          }else{
              newAnswer = {[questionid]: filter(this.state.answerSelected[questionid], item => item !== answerid)}
          }
        }else{
          if(type === 'radio'){
              newAnswer = { [questionid]: [answerid] };
          }else{
              newAnswer = { [questionid]: [answerid, ... this.state.answerSelected[questionid]] };
          }
        }
    }
    if(isEmpty(newAnswer[questionid])){
      delete answerSelected[questionid];
      this.setState({
        answerSelected
      })
    }else{
      this.setState({
        answerSelected: {
          ...this.state.answerSelected,
          ...newAnswer
        },
      })
    }
  }
  onChangeCity = (val) => {
    this.setState({
      [CITY]: val,
    });
  }

  onChangeGender = (e) => {
    let { value } = e.target;
    this.setState({
      [GENDER]: value,
    });
  }
  onChangeAge = (value) => {
    if(parseInt(value.min, 10) < 1 || parseInt(value.max, 10) > 100){
      return;
    }
    this.setState({
        [AGE_FROM]: parseInt(value.min, 10),
        [AGE_TO]: parseInt(value.max, 10),
    })
  } 
  onChangeAgeAll = () =>{
    if(this.state[AGE_FROM] === 1 && this.state[AGE_TO] === 100){
        this.setState({
            [AGE_FROM]: 25,
            [AGE_TO]: 75,
        })
    }else{
        this.setState({
            [AGE_FROM]: 1,
            [AGE_TO]: 100,
        })
    }
  }

  onChangeInputText = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  onChangeUserTarget = (id) => {
    this.getTargetInfo(id)
  }

  onChangePollSurveySelect = (val) => {
    let currentListQuestion = [];

    if (!val) {
      return this.setState({
        currentPollSurveySelected: '',
        currentListQuestion: [],
        currentQuestionSelected: '',
        targetQuestionAnswer: {},
      })
    }

    const currentPollSurvey = find(this.props.listPollSurvey, {
      id: val.value,
    })
    
    if (this.props.keyPollSurvey === ENUM.TYPE.POLL && currentPollSurvey) {
      currentListQuestion.push(currentPollSurvey.question)
    } else if (this.props.keyPollSurvey === ENUM.TYPE.SURVEY && currentPollSurvey) {
      currentListQuestion = currentListQuestion.concat(currentPollSurvey.question)
    }

    this.setState({
      currentPollSurveySelected: val,
      currentListQuestion,
      currentQuestionSelected: '',
    })
  }

  getPollSurveySelected = (currentTarget) => {
    let currentQuestion, targetQuestionAnswer;
    const pollSurvey = reduce(currentTarget.question, (result, question, key) => {
      const entry = reduce(this.props.listPollSurvey, (result1, item1) => {
        let ques;
        if (Array.isArray(item1.question)) {
          ques = find(item1.question, { id: parseInt(key, 10) })
        } else {
          ques = parseInt(key, 10) === item1.question.id ?
            item1.question : undefined
        }
        result1 = ques ? {
          pollSurvey: {
            value: item1.id,
            label: item1.name,
          },
          question: ques,
          listQuestion: Array.isArray(item1.question) ? item1.question : [item1.question]
        } : result1
        return result1
      }, {})
      result = !isEmpty(entry) ? entry : result;
      return result;
    }, {})
    if (isEmpty(pollSurvey)) {
      return {
        currentQuestionSelected: '',
        targetQuestionAnswer: {},
        currentPollSurveySelected: '',
        currentListQuestion: [],
      }
    }
    
    currentQuestion = {
      value: pollSurvey.question.id,
      label: pollSurvey.question.question,
    }
    targetQuestionAnswer = currentTarget.question
    return {
      currentQuestionSelected: currentQuestion,
      targetQuestionAnswer,
      currentPollSurveySelected: pollSurvey.pollSurvey,
      currentListQuestion: pollSurvey.listQuestion,
    }
  }

  onChangeQuestionSelect = (val) => {
    const { targetQuestionAnswer } = this.state;
    const question = find(this.state.currentListQuestion, {
      id: val.value
    })
    
    const resultAnswerQuestion = reduce(question.answer, (result, answer) => {
      if (isEmpty(result[question.id])) {
        result[question.id] = {
          question_type: question.question_type,
          [`${this.props.keyPollSurvey}_id`]: question[`${this.props.keyPollSurvey}_id`]
        }
      }
      if (targetQuestionAnswer[question.id] &&
          targetQuestionAnswer[question.id][answer.id]) {
        result[question.id][answer.id] = targetQuestionAnswer[question.id][answer.id]
      } else {
        result[question.id][answer.id] = 
          question.question_type === SINGLE ||
          question.question_type === MULTI ?
            false : '';
      }
      return result;
    }, {})
    
    this.setState({
      currentQuestionSelected: val,
      targetQuestionAnswer: {
        ...this.state.targetQuestionAnswer,
        ...resultAnswerQuestion
      },
    })
  }

  onChangeSelectionAnswer = (e) => {
    const {
      checked,
      // name is the question_id
      name,
      // value is the answer_id
      value,
    } = e.target;
    const targetQuestionAnswer = cloneDeep(this.state.targetQuestionAnswer)
    targetQuestionAnswer[name][value] = checked

    this.setState({ targetQuestionAnswer })
  }

  onChangeNumberInput = (target) => {
    const {
      value,
      dataset,
    } = target;
    
    const questionId = parseInt(dataset.questionId, 10),
          answerId = parseInt(dataset.answerId, 10);
    const _value = parseInt(value, 10);
    const targetQuestionAnswer = cloneDeep(this.state.targetQuestionAnswer)
    targetQuestionAnswer[questionId][answerId] = !isNaN(_value) ? _value : '';

    this.setState({ targetQuestionAnswer })
  }

  onChangeDateRatingInput = (val, questionId, answerId) => {
    const targetQuestionAnswer = cloneDeep(this.state.targetQuestionAnswer);
    targetQuestionAnswer[questionId][answerId] = val;

    this.setState({ targetQuestionAnswer })
  }

  onChangeExtendOptType = (extendsOptTypeTags) => {
    this.setState({ 
      extendsOptTypeTags,
      statusInputTxt: ''
     })
  }

  onChangeExtendsOptTypeSelectBox = (extendsOptType) => {
    if(extendsOptType === this.state.extendsOptType){
      this.setState({
        statusInputTxt: '',
        isShowExtendsOptTypeDetail: true
      })
    }else{
      this.setState({
        extendsOptType,
        extendsOptTypeTags: [],
        statusInputTxt: '',
        isShowExtendsOptTypeDetail: true
      })
    }
  }
  hideExtendsOptTypeSelectBox = () =>{
    this.setState({
      statusInputTxt: '',
      isShowExtendsOptTypeDetail: false
    })
  }
  onChangeTargetCondition = (idx, value) => {
    const cloneChildrenTarget = cloneDeep(this.state.childrenTargets)
    cloneChildrenTarget[idx].compare = value;
    this.setState({ childrenTargets: cloneChildrenTarget }, () => {
      this.props.getListUserFilter()
    })
  }

  onToggleTargetForm = (clear = false) => {
    if(clear){
      this.clearTargetForm()
    }
    this.setState((prevState) => ({
      isExpandTargetForm: !prevState.isExpandTargetForm,
    }))
  }
  onToggleTargetModal = () => {
    this.setState((prevState) => ({
      isExpandTargetForm: !prevState.isExpandTargetForm,
      isExpandTargetModal: !prevState.isExpandTargetModal
    }))
  }
  
  findAnswer(questionId, answerId) {
    const { listTargetOption } = this.props;
    for (let i = 0, l = listTargetOption.length; i < l; i++) {
      const question = find(listTargetOption[i].question, { id: questionId });
      if (!question) continue;
      const answer = find(question.answer, { id: answerId });
      if (!answer) continue;
      return answer.name;
    }
    return null
  }

  // getCurrentUserTargetOpt(option) {
  //   const answerSelected = {};
  //   forEach(option, opt => {
  //     const answers = map(opt.answer_id, answerId => ({
  //       value: answerId,
  //       label: this.findAnswer(opt.question_id, answerId),
  //     }));
  //     answerSelected[opt.question_id] = answers;
  //   });
  //   return answerSelected;
  // }
  getCurrentUserTargetOpt(option) {
    const answerSelected = {};
    forEach(option, opt => {
      const answers = map(opt.answer_id, answerId => parseInt(answerId, 10));
      answerSelected[opt.question_id] = answers;
    });
    return answerSelected;
  }
  getTargetInfo(targetId) {
    requestAPI({
      url: APIs.target.getTargetInfo.url.replace('{targetId}', targetId),
      method: APIs.target.getTargetInfo.method,
    }).then(res => {
      if (res.success) {
        const target = res.data;

        const currentTarget = parseTargetOption.call(this, [target], this.props.listCityOption)[0]
        const answerSelected = this.getCurrentUserTargetOpt(currentTarget.option)
        const { extend_option } = currentTarget;
        const extendsOptType = extend_option ?
          find(EXTEND_OPTION_TYPE, { value: extend_option.type }) :
          EXTEND_OPTION_TYPE[0];
        const extendsOptTypeTags = extend_option ?
          extend_option.value : [];
        const pollSurveySelectedData = this.getPollSurveySelected(currentTarget)
        const dataTargetChoose = {
          [TARGET_NAME]: target.name,
          [AGE_FROM]: currentTarget.target[AGE_FROM] || '',
          [AGE_TO]: currentTarget.target[AGE_TO] || '',
          [CITY]: currentTarget.target[CITY],
          [GENDER]: currentTarget.target[GENDER],
          currentUserTargetSelected: {
            value: targetId,
            label: target.name,
          },
          answerSelected,
          extendsOptTypeTags,
          extendsOptType,
          pollSurveySelectedData,
        };
        this.setState({
          dataTargetChoose,
          isExpandshowTarget: true,
          indexTab: 1,
          isShowOptionUserTarget: false
        });
      }
    })
  }

  validateTargetName() {
    let isValidTargetName = true;
    if (!this.state[TARGET_NAME]) {
      isValidTargetName = false;
      Alert.error(localeCreate.REQUIRED_TARGET_NAME_MSG, {
        timeout: 5000,
      })
    }
    this.setState({
      isValidTargetName,
    });
    return isValidTargetName;
  }
  selectChildTarget = (idx) => {
    const currentTarget = this.state.childrenTargets[idx];
    const answerSelected = this.getCurrentUserTargetOpt(currentTarget.option)
    const { extend_option } = currentTarget;
    const extendsOptType = !isEmpty(extend_option) ?
      find(EXTEND_OPTION_TYPE, { value: extend_option.type }) :
      EXTEND_OPTION_TYPE[0];
    const extendsOptTypeTags = !isEmpty(extend_option) ?
      extend_option.value : [];
    const pollSurveySelectedData = this.getPollSurveySelected(currentTarget)
    let state = {
      currentIndexChildTarget: idx,
      answerSelected,
      [AGE_FROM]: currentTarget.target[AGE_FROM] || '',
      [AGE_TO]: currentTarget.target[AGE_TO] || '',
      [CITY]: currentTarget.target[CITY],
      [GENDER]: currentTarget.target[GENDER],
      extendsOptTypeTags,
      extendsOptType,
      ...pollSurveySelectedData,
    }
    this.setState(state, () => {
      if (!this.state.isExpandTargetForm) {
        this.onToggleTargetForm()
      }
    })
  }
  onChoooseTarget = () =>{
    const dataTargetChoose = this.state.dataTargetChoose;
    const state = {
            [TARGET_NAME]: dataTargetChoose[TARGET_NAME],
            currentUserTargetSelected: dataTargetChoose.currentUserTargetSelected,
            answerSelected: dataTargetChoose.answerSelected,
            [AGE_FROM]: dataTargetChoose[AGE_FROM] || '',
            [AGE_TO]: dataTargetChoose[AGE_TO] || '',
            [CITY]: dataTargetChoose[CITY],
            [GENDER]: dataTargetChoose[GENDER],
            extendsOptTypeTags: dataTargetChoose.extendsOptTypeTags,
            extendsOptType: dataTargetChoose.extendsOptType,
            ...dataTargetChoose.pollSurveySelectedData,
            indexTab: 0,
            dataTargetChoose: {},
            isExpandshowTarget: false
    };
    this.setState(state);
  }
  toggleExpandSavingTarget = () => {
    this.setState(prevState => ({
      isExpandSavingTarget: !prevState.isExpandSavingTarget,
    }))
  }
  clearItemTargetForm = (action, idx = null) =>{
    switch (action) {
      case CITY:
        this.setState({
          [CITY]: ''
        })
        break;
      case GENDER:
        this.setState({
          [GENDER]: GENDEROPT.ALL,
        })
        break;
      case AGE_FROM:
        this.setState({
          [AGE_FROM]: 1,
          [AGE_TO]: 100,
        })
        break;
      case 'Option':
        if(idx === null)
        {
          return;
        }
        const answerSelected = cloneDeep(this.state.answerSelected);
        delete answerSelected[idx];
        this.setState({
          answerSelected
        })
        break;
      case 'Extend':
        this.setState({
          statusInputTxt: '',
          extendsOptTypeTags: [],
        })
        break;
      default:
        Alert.error('Error!')
        break;
    }
  }
  onChangeInputTXT = (e) =>{
    const target = e.target;
    if (target.type === 'file') {
        let reader = new FileReader();
        const file = target.files[0];
        if (!file) {
          return;
        }
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
        reader.onloadend = () => {
          var lines = reader.result.split('\n');
          const result = new Array();
          for(var line = 0; line < lines.length; line++){
            result.push(lines[line].replace(' ', ''))
          }
          if(!isEmpty(result)){
            this.checkUserExtendOption(result)
          }
        }
        reader.readAsText(file);
      }, 50);
    }
  }
  checkUserExtendOption = (result) => {
    requestAPI({
      url: APIs.target.checkListTxt.url,
      method: APIs.target.checkListTxt.method,
      dataForm: {
        result: result,
        type: this.state.extendsOptType.value
      },
    }).then(res => {
      if(res.success){
        this.setState({
          extendsOptTypeTags: [
            ... this.state.extendsOptTypeTags,
            ...res.data
          ],
          statusInputTxt: localeCreate.messages_quantity_filter.replace(':userfilter', res.data.length).replace(':user', result.length )
        })
      }
    }).catch(error =>{
      Alert.error(error.message)
    })
  }
  onChangeIndexTab = (indexTab) => {
      if (indexTab === this.state.indexTab) {
        return;
      }
      this.setState({
          indexTab: 0
      });
  }
  onToggleUserTarget = () =>{
    this.setState((prevState) => ({
      isShowOptionUserTarget: !prevState.isShowOptionUserTarget,
    }))
  }
  onDeleteTarget = (targetId) =>{
    requestAPI({
      url: APIs.target.deleteTarget.url.replace('{targetId}', targetId),
      method: APIs.target.deleteTarget.method,
    }).then(res => {
      if (res.success) {
        this.setState({
          indexTab: 0
        }, () =>{
          this.props.updateListTargetOfUser(targetId, 'delete');
          Alert.success(res.message)
        })
      }
    }).catch(error =>{
      Alert.error(error.message)
    })
  }
  render() {
    return (
      <div>
          <TargetOption
            appendTarget={this.appendTarget}
            clearTargetForm={this.clearTargetForm}
            saveTarget={this.saveTarget}
            localeCreate={localeCreate}
            deleteChildTarget={this.deleteChildTarget}
            formState={this.state}
            onChangeAnswers={this.onChangeAnswers}
            onChangeSelectionAnswer={this.onChangeSelectionAnswer}
            onChangeNumberInput={this.onChangeNumberInput}
            onChangeCity={this.onChangeCity}
            onChangeGender={this.onChangeGender} 
            onChangeAge={this.onChangeAge}
            onChangeAgeAll={this.onChangeAgeAll}
            onChangeExtendOptType={this.onChangeExtendOptType}
            onChangeExtendsOptTypeSelectBox={this.onChangeExtendsOptTypeSelectBox}
            onChangePollSurveySelect={this.onChangePollSurveySelect}
            onChangeQuestionSelect={this.onChangeQuestionSelect}
            onChangeTabIndex={this.onChangeTabIndex}
            onChangeInputText={this.onChangeInputText}
            onChangeDateRatingInput={this.onChangeDateRatingInput}
            onChangeTargetCondition={this.onChangeTargetCondition}
            onChangeUserTarget={this.onChangeUserTarget}
            onLoadmorePollSurvey={this.onLoadmorePollSurvey}
            onToggleTargetForm={this.onToggleTargetForm}
            onToggleTargetModal={this.onToggleTargetModal}
            selectChildTarget={this.selectChildTarget}
            toggleExpandSavingTarget={this.toggleExpandSavingTarget}
            onChanShowItemChildrenTargetDetail={this.onChanShowItemChildrenTargetDetail}
            ListShowItemChildrenTargetDetail={this.state.ListShowItemChildrenTargetDetail}
            clearItemTargetForm={this.clearItemTargetForm}
            hideExtendsOptTypeSelectBox={this.hideExtendsOptTypeSelectBox}
            onChangeInputTXT={this.onChangeInputTXT}
            onChangeIndexTab={this.onChangeIndexTab}
            onToggleUserTarget={this.onToggleUserTarget}
            onChoooseTarget={this.onChoooseTarget}
            onDeleteTarget={this.onDeleteTarget}
            {...this.props}
          />
      </div>
    );
  }
}

export default TargetOptionContainer;
