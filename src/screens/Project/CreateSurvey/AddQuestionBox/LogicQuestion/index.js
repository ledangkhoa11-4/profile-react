import React, { Component } from 'react';
import { cloneDeep, find, forEach, isEmpty, map, reduce, filter } from 'lodash';
import Alert from 'react-s-alert';
import LogicTable from './LogicTable/index';

import LogicForm from './LogicForm';
import {
  ENUM,
  INPUT_NAME,
  GENDEROPT
} from '../../../constant';
import {
  convertDateToString,
  jsonEqual,
  requestAPI,
} from 'services/utils';
import { APIs } from 'services/config';

const localeCreate = window.locale.Create;
const {
  GENDER,
  AGE_FROM,
  AGE_TO,
  CITY,
} = INPUT_NAME;

function getLogicOption() {  
  let logicOpt = this.props.listTargetOption.map(item => ({
    _id: item.id,
    name: item.name,
  }))
  const prefixLogicOpt = [{name: localeCreate.logic_option_choose_question}, {name: localeCreate.logic_option_choose_basic_profile}]
  return [...prefixLogicOpt, ...logicOpt].map((item, index) => ({
    value: index,
    label: item.name,
    _id: item._id,
  }))
}

function parseInputQuestionData(question) {
  return reduce(question, (totalResult, entry, questionKey) => {
    const answers = reduce(entry, (result, item, answerKey) => {
      const answerId = parseInt(answerKey, 10)

      if (isNaN(answerId)) {
        return result;
      }

      if (entry.question_type === ENUM.QUESTION_TYPE.DATE ) {
        result.push({
          id: answerId,
          value: convertDateToString(typeof entry[answerKey] === "string" ? new Date(entry[answerKey]) : entry[answerKey].toDate()),
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
        question_id: parseInt(questionKey, 10),
        answer: answers,
        question_type: entry.question_type,
        // [`survey_id`]: entry[`${this.props.keyPollSurvey}_id`]
      })
    }

    return totalResult
  }, [])
}

function parseAdvanceProfileData(advanceProfile) {
  const data = [];
  let entry = {};
  forEach(advanceProfile, (profile, keyProfile) => {
    forEach(profile, (question, keyQuestion) => {
      forEach(question, (answer) => {
        if (!entry.categorie_id) {
          entry.categorie_id = parseInt(keyProfile, 10)
        }
        if (!entry.question_id) {
          entry.question_id = parseInt(keyQuestion, 10)
        }
        if (!entry.answer_id) {
          entry.answer_id = []
        }
        entry.answer_id.push(answer.value)
      })
      if (!isEmpty(entry)) {
        data.push({...entry})
        entry = {}
      }
    })
  })
  return data
}

function parseBasicProfileData(basic_profile) {
  let _basicProfile = {...basic_profile};
  if (_basicProfile[CITY]) {
    _basicProfile[CITY] = _basicProfile[CITY].map(item => item.value);
  } else {
    delete _basicProfile[CITY]
  }
  if (_basicProfile[GENDER]) {
    _basicProfile[GENDER] = _basicProfile[GENDER];
  } else {
    delete _basicProfile[GENDER]
  }
  if (!_basicProfile[AGE_FROM]) {
    delete _basicProfile[AGE_FROM];
  }
  if (!_basicProfile[AGE_TO]) {
    delete _basicProfile[AGE_TO];
  }

  return _basicProfile;
}

const basicProfile = {
  [GENDER]: GENDEROPT.ALL,
  [AGE_FROM]: 1,
  [AGE_TO]: 100,
  [CITY]: '',
};
const advanceProfile = {};
const questionInput = {};
const questionOutput = {};
const emptyLogicObj = {
  basicProfile,
  advanceProfile,
  questionInput,
  questionOutput,
}

const initState = {
  indexTab: 1,
  currentIdxLogicType: 1,
  isShowLogicForm: false,
  currentLogicObj: emptyLogicObj,
  inputQuestionSelected: null,
  // logic selected in the list
  currentKeyLogicInTable: null,
}

class LogicQuestion extends Component {
  constructor(props) {
    super(props)

    this.state = initState;
  }

  clearLogicForm = () => {
    this.setState(initState)
  }

  closeLogicArea = async () => {
    await this.clearLogicForm()
    this.props.closeLogicArea(false)
  }

  onChangeTab = (indexTab) => {
    this.setState({ indexTab })
  }

  onChangeIndexLogicType = (index) => {
    this.setState({ currentIdxLogicType: index })
  }

  onChangeInputText = (e) => {
    const currentLogicObj = cloneDeep(this.state.currentLogicObj)
    currentLogicObj.basicProfile[e.target.name] = e.target.value;

    this.setState({ currentLogicObj })
  }
  onChangeAge = (value) => {
    if(parseInt(value.min, 10) < 1 || parseInt(value.max, 10) > 100){
      return;
    }
    const currentLogicObj = cloneDeep(this.state.currentLogicObj)
    currentLogicObj.basicProfile[AGE_FROM] =  parseInt(value.min, 10);
    currentLogicObj.basicProfile[AGE_TO] =  parseInt(value.max, 10);

    this.setState({ currentLogicObj })
  }
  onChangeAgeAll = () =>{
    const currentLogicObj = cloneDeep(this.state.currentLogicObj)
    if(currentLogicObj.basicProfile[AGE_FROM] === 1 && currentLogicObj.basicProfile[AGE_TO] === 100){
      currentLogicObj.basicProfile[AGE_FROM] =  25;
      currentLogicObj.basicProfile[AGE_TO] =  75;
    }else{
      currentLogicObj.basicProfile[AGE_FROM] =  1;
      currentLogicObj.basicProfile[AGE_TO] =  100;
    }
    this.setState({ currentLogicObj })
  }
  onChangeSelectVal = (name, val) => {
    const currentLogicObj = cloneDeep(this.state.currentLogicObj);
    currentLogicObj.basicProfile[name] = val;

    this.setState({ currentLogicObj })
  }

  /*
  * for logic input question
  */
  onChangeQuestionInput = (val) => {
    const question = find(this.props.listQuestion, { id: val.value });
    const currentLogicObj = cloneDeep(this.state.currentLogicObj);
    if (!currentLogicObj.questionInput[val.value]) {
      currentLogicObj.questionInput[val.value] = {};
      currentLogicObj.questionInput[val.value].question_type = question.question_type;
    }
    this.setState({
      currentLogicObj,
      inputQuestionSelected: val
    })
  }

  onChangeAdvanceProfile = (question, answerVal) => {
    const logicOpt = getLogicOption.call(this);
    const { currentIdxLogicType } = this.state;
    const currentLogicType = logicOpt[currentIdxLogicType];
    const currentLogicObj = cloneDeep(this.state.currentLogicObj);
    if (!currentLogicObj.advanceProfile[currentLogicType._id]) {
      currentLogicObj.advanceProfile[currentLogicType._id] = {}
    }
    currentLogicObj.advanceProfile[currentLogicType._id][question.id] = answerVal;
    
    this.setState({
      currentLogicObj,
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
    const currentLogicObj = cloneDeep(this.state.currentLogicObj)
    currentLogicObj.questionInput[name][value] = checked
    this.setState({ currentLogicObj })
  }

  onChangeNumberInput = (target) => {
    const {
      value,
      dataset,
    } = target;
    
    const questionId = parseInt(dataset.questionId, 10),
          answerId = parseInt(dataset.answerId, 10);
    const _value = parseInt(value, 10);
    const currentLogicObj = cloneDeep(this.state.currentLogicObj)
    currentLogicObj.questionInput[questionId][answerId] = !isNaN(_value) ? _value : '';

    this.setState({ currentLogicObj })
  }

  onChangeDateRatingSliderInput = (val, questionId, answerId) => {
    const currentLogicObj = cloneDeep(this.state.currentLogicObj);
    currentLogicObj.questionInput[questionId][answerId] = val;

    this.setState({ currentLogicObj })
  }

  onChangeDestinationQuestion = (question) => {    
    const currentLogicObj = cloneDeep(this.state.currentLogicObj);
    currentLogicObj.questionOutput = question.value;
    this.setState({ currentLogicObj })
  }

  toggleLogicForm = (isShow = true) => {
    this.setState({ isShowLogicForm: isShow })
  }

  addLogic = async () => {
    await this.setState({ currentLogicObj: emptyLogicObj })
    this.toggleLogicForm()
  }

  saveOneLogic = async () => {
    const { listQuestion, questionSelectedLogic } = this.props;
    const question = find(listQuestion, { id: questionSelectedLogic.value });
    // post data to server and update question list
    const subLogicQuestion = cloneDeep(this.state.currentLogicObj);
    forEach(subLogicQuestion.questionInput, (item, key) => {
      if(!(Object.keys(item).length > 1 && item.question_type)){
        delete subLogicQuestion.questionInput[key];
      }
    })
    const keyPrevLogicQuestion = question.logic ?
      Object.keys(question.logic) : [];
    const lastKey = keyPrevLogicQuestion.length ?
      parseInt(keyPrevLogicQuestion[keyPrevLogicQuestion.length - 1], 10) : 0;
    const key = this.state.currentKeyLogicInTable || (lastKey + 1);
    const logicQuestion = {
      [key]: subLogicQuestion
    };
    const tempLogicQuestion = question.logic ?
      { ...question.logic, ...logicQuestion } : logicQuestion;

    // if (!isEmpty(subLogicQuestion.basicProfile)) {
    //   subLogicQuestion.basicProfile[COUNTRY] = 'VietNam'
    // }
    if (jsonEqual(question.logic, tempLogicQuestion)) {
      Alert.error(localeCreate.messages_do_not_have_update);
      return;
    }
    // if currentKeyLogicInTable => edit; else => create
    const questionInput = parseInputQuestionData(subLogicQuestion.questionInput);
    const advanceProfile = parseAdvanceProfileData(subLogicQuestion.advanceProfile);
    const basicProfile = parseBasicProfileData(subLogicQuestion.basicProfile);
    const questionOutput = subLogicQuestion.questionOutput;
    const formData = {
      survey_id: question.survey_id,
      question_id: questionSelectedLogic.value
    }
    if (!isEmpty(questionInput)) {
      formData.questionInput = questionInput;
    }
    if (questionOutput) {
      formData.questionOutput = questionOutput;
    }
    if (!isEmpty(advanceProfile)) {
      formData.advanceProfile = advanceProfile;
    }
    if (!isEmpty(basicProfile)) {
      formData.basicProfile = basicProfile;
    }
    if (question.logic && question.logic[key]) {
      formData.logic_id = question.logic[key].id;
    }
    const res = await requestAPI({
      url: APIs.skipLogic.editOrCreate.url,
      method: APIs.skipLogic.editOrCreate.method,
      dataForm: formData
    });
    if (!res.success) {
      const message = map(res.message, msg => msg.join(', ')).join(' ')
      Alert.error(message)
      return;
    }
    Alert.success(res.message)
    subLogicQuestion.id = res.data.id;
    // update listquestion after post data
    
    const _listQuestion = this.props.listQuestion.map(item => {
      if (item.id === this.props.questionSelectedLogic.value) {
        return {
          ...item,
          logic:  item.logic ?
          { ...item.logic, ...logicQuestion } : logicQuestion
        }
      }
      return item
    })
    this.setState(initState)
    this.props.updateSurveyInfo(_listQuestion)
  }

  removeOneLogic = async (key) => {
    const { listQuestion, questionSelectedLogic } = this.props;
    const question = find(listQuestion, { id: questionSelectedLogic.value });
    let logicSelected;
    const logicQuestion = reduce(question.logic, (result, item, _key) => {
      if (_key !== key) {
        result[_key] = item
      } else {
        logicSelected = item
      }
      return result
    }, {})

    const res = await requestAPI({
      url: APIs.skipLogic.delete.url,
      method: APIs.skipLogic.delete.method,
      dataForm: {
        survey_id: question.survey_id,
        question_id: question.id,
        logic_id: logicSelected.id
      }
    })

    if (!res.success) {
      const message = map(res.message, msg => msg.join(', ')).join(' ')
      Alert.error(message)
      return;
    }
    Alert.success(res.message)
    const _listQuestion = this.props.listQuestion.map(item => {
      if (item.id === this.props.questionSelectedLogic.value) {
        return {
          ...item,
          logic: logicQuestion
        }
      }
      return item
    })
    
    this.setState(initState)
    this.props.updateSurveyInfo(_listQuestion)
  }

  selectCurrentLogic = (logicItem, keyLogic) => {
    this.setState({
      currentLogicObj: logicItem,
      currentKeyLogicInTable: keyLogic,
    })
    this.toggleLogicForm()
  }

  validateOneLogic = () => {
    const { currentLogicObj } = this.state;
    
    const isValidQuestionInput = reduce(currentLogicObj.questionInput, (result, item) => {
      const _item = {...item};
      delete _item.question_type;
      let isValid = !isEmpty(_item);
      
      if (isValid) {
        isValid = reduce(_item, (_result, val) => {
          return val || _result
        }, false)
      }

      return isValid || result;
    }, false);

    const isValidAdvanceProfile = reduce(currentLogicObj.advanceProfile, (result, item) => {
      let isValid = reduce(item, (result1, item1) => {
        isValid = reduce(item1, (result2, val) => {
          return !isEmpty(val) || result2;
        }, false)
        return isValid || result1;
      }, false)
      return isValid || result
    }, false)

    if (
      jsonEqual(currentLogicObj.basicProfile, basicProfile) &&
      !isValidQuestionInput && !isValidAdvanceProfile
    ) {
      return false;
    }

    return true;
  }
  deleteQuestionLogic = (questionId) =>{
    const currentLogicObj = cloneDeep(this.state.currentLogicObj);
    if(currentLogicObj.questionInput[questionId]){
      delete currentLogicObj.questionInput[questionId];
    }
    this.setState({
      currentLogicObj,
      inputQuestionSelected: null
    })
  }
  deleteItemLogic = (type, key = null, questionKey = null) => {
    const currentLogicObj = cloneDeep(this.state.currentLogicObj);
    switch (type) {
      case GENDER:
        currentLogicObj.basicProfile[GENDER] = GENDEROPT.ALL;
        break;
      case AGE_FROM:
        currentLogicObj.basicProfile[AGE_FROM] = 1;
        currentLogicObj.basicProfile[AGE_TO] = 100;
        break;
      case CITY:
        currentLogicObj.basicProfile[CITY] = [];
        break;
     case "questioninput":
        delete currentLogicObj.questionInput[key]
        break;
      case "advance":
        if(!isEmpty(currentLogicObj.advanceProfile[key])){
          delete currentLogicObj.advanceProfile[key][questionKey]
          if(isEmpty(currentLogicObj.advanceProfile[key])){
            delete currentLogicObj.advanceProfile[key];
          }
        }
        break;
      default:
        Alert.error('Error!')
        break;
    }
    this.setState({ currentLogicObj })
    // this.setState({
    //   currentLogicObj,
    //   currentKeyLogicInTable: keyLogic
    // }, () =>{
    //   if(isEmpty(currentLogicObj.basicProfile) || 
    //   ((isEmpty(currentLogicObj.basicProfile[GENDER]) || currentLogicObj.basicProfile[GENDER] === GENDEROPT.ALL) 
    //   && currentLogicObj.basicProfile[AGE_FROM] === 1 && currentLogicObj.basicProfile[AGE_TO] === 100
    //   && isEmpty(currentLogicObj.basicProfile[CITY])) && isEmpty(currentLogicObj.questionInput)
    //   && isEmpty(currentLogicObj.advanceProfile)){
    //     this.removeOneLogic(keyLogic);
    //   }
    // })
  }
  render() {
    const logicOpt = getLogicOption.call(this)

    return (
      <div className="row">
        {
          this.state.isShowLogicForm ?
            <LogicForm
              logicOpt={logicOpt}
              addLogic={this.addLogic}
              clearLogicForm={this.clearLogicForm}
              currentIdxLogicType={this.state.currentIdxLogicType}
              onChangeTab={this.onChangeTab}
              onChangeDestinationQuestion={this.onChangeDestinationQuestion}
              onChangeAdvanceProfile={this.onChangeAdvanceProfile}
              onChangeIndexLogicType={this.onChangeIndexLogicType}
              onChangeInputText={this.onChangeInputText}
              onChangeAge={this.onChangeAge}
              onChangeAgeAll={this.onChangeAgeAll}
              onChangeSelectVal={this.onChangeSelectVal}
              onChangeQuestionInput={this.onChangeQuestionInput}
              onChangeSelectionAnswer={this.onChangeSelectionAnswer}
              onChangeDateRatingSliderInput={this.onChangeDateRatingSliderInput}
              onChangeNumberInput={this.onChangeNumberInput}
              formState={this.state}
              listCityOption={this.props.listCityOption}
              listTargetOption={this.props.listTargetOption}
              listQuestion={this.props.listQuestion}
              questionSelectedLogic={this.props.questionSelectedLogic}
              saveOneLogic={this.saveOneLogic}
              validateOneLogic={this.validateOneLogic}
              deleteQuestionLogic={this.deleteQuestionLogic}
              deleteItemLogic={this.deleteItemLogic}
            />
          : 
            <React.Fragment>
              <LogicTable
                listQuestion={this.props.listQuestion}
                listTargetOption={this.props.listTargetOption}
                questionSelectedLogic={this.props.questionSelectedLogic}
                selectCurrentLogic={this.selectCurrentLogic}
                removeOneLogic={this.removeOneLogic}
                closeLogicArea={this.closeLogicArea}
                
              />
              <div className="col-xs-12">
                <div className="wrap-create-group-target-btn text-center">
                  <button type="button" className="btn" onClick={this.addLogic}>
                    <span className="fa fa-plus"/>
                    <span className="text">
                      { localeCreate.ADD_LOGIC_BTN }
                    </span>
                  </button>
                </div>
              </div>
            </React.Fragment>
        }
      </div>
    );
  }
}

export default LogicQuestion;
