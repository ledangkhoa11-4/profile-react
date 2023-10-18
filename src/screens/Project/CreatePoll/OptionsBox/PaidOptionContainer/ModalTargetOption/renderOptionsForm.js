import React from 'react';
import Select from 'react-select';
import Alert from 'react-s-alert';
import {
  cloneDeep,
  find,
  isEmpty,
  map,
} from 'lodash';
import CustomTags from 'components/CustomTags';
import InputNumber from 'components/InputNumber';
import CustomDatePicker from 'components/CustomDatePicker';
import CustomRating from 'components/CustomRating';
import {
  INPUT_NAME,
  ENUM,
  EXTEND_OPTION_TYPE,
} from '../../../../constant';
import {
  genderOpt,
  REGEX,
} from 'services/config';

const {
  AGE_FROM,
  AGE_TO,
  GENDER,
  CITY,
} = INPUT_NAME;
const localeCreate = window.locale.Create;
export const parseData = (list) => {
  return list.map(item => ({
    value: item.id,
    label: item.name,
  }));
}

export function renderQuestionOption(props) {
  const {
    isLoadingQuestionTarget,
    formState,
    listPollSurvey,
    onChangeSelectionAnswer,
    onChangePollSurveySelect,
    onChangeQuestionSelect,
    onLoadmorePollSurvey,
    onChangeNumberInput,
    onChangeDateRatingInput,
    localeCreate,
    projectInfo,
  } = props;
  const _listPollSurvey = map(listPollSurvey, item => ({
    value: item.id,
    label: item.name,
  }))
  const currentListQuestion = formState.currentListQuestion.map(item => ({
    value: item.id,
    label: item.question,
  }))
  const currentQuestion = find(formState.currentListQuestion, {
    id: formState.currentQuestionSelected.value
  })
  
  var classWrapper = 'answer';
  if (
    currentQuestion && (
      currentQuestion.question_type === ENUM.QUESTION_TYPE.SINGLE ||
      currentQuestion.question_type === ENUM.QUESTION_TYPE.MULTI
    )) {
    var inputType = 'checkbox';
    var imgAnswer = find(currentQuestion.answer, answer => {
      return answer.value_type === ENUM.ANSWER_TYPE.IMAGE;
    });
    classWrapper = imgAnswer && 'answer img-style';
  }

  return (
    <div>
      <label>
        { localeCreate.SELECT_QUESTION_TAGET_LABEL }
        &nbsp;
        { projectInfo.label }
      </label>
      <Select
        options={_listPollSurvey}
        onChange={onChangePollSurveySelect}
        value={formState.currentPollSurveySelected}
        placeholder={localeCreate.CHOICE_POLL_SURVEY_HOLDER}
        searchable={false}
        onMenuScrollToBottom={onLoadmorePollSurvey}
        isLoading={isLoadingQuestionTarget}
      />
      <br/>
      {
        currentListQuestion.length ?
          <Select
            options={currentListQuestion}
            onChange={onChangeQuestionSelect}
            value={formState.currentQuestionSelected}
            placeholder={localeCreate.CHOICE_QUESTION_HOLDER}
            searchable={false}
            clearable={false}
          /> : null
      }
      {
        !isEmpty(currentQuestion) ?
          <div
            className="vote-content"
            style={{
              marginTop: 15
            }}
          >
            <strong>{ props.localeCreate.ANSWER_TARGET_TITLE }:</strong>
            <ul className={classWrapper}>
              {
                currentQuestion.answer.map((ans, idx) => { 
                  switch(currentQuestion.question_type) {
                    case ENUM.QUESTION_TYPE.NUMBER:
                    case ENUM.QUESTION_TYPE.SLIDER:
                      return renderNumberInput({
                        idx,
                        ans,
                        formState,
                        currentQuestion,
                        onChangeNumberInput,
                      });
                    case ENUM.QUESTION_TYPE.DATE:
                      return renderDateInput({
                        idx,
                        ans,
                        formState,
                        currentQuestion,
                        onChangeDateRatingInput,
                      });
                    case ENUM.QUESTION_TYPE.RATING:
                      return renderRatingInput({
                        idx,
                        ans,
                        formState,
                        currentQuestion,
                        onChangeDateRatingInput,
                      });
                    default:
                      return renderCheckbox({
                        idx,
                        inputType,
                        currentQuestion,
                        ans,
                        formState,
                        onChangeSelectionAnswer
                      })
                  }
                })
              }
            </ul>
          </div> : null
      }
    </div>
  )
}

function renderCheckbox({
  idx,
  inputType,
  currentQuestion,
  ans,
  formState,
  onChangeSelectionAnswer
}) {
  return (
    <li key={idx}>
      <label>
        <input
          type={inputType}
          id={`ans-${idx}`}
          name={currentQuestion.id}
          defaultValue={ans.id}
          checked={!!formState.targetQuestionAnswer[currentQuestion.id][ans.id]}
          onChange={onChangeSelectionAnswer}
        />
        {
          ans.value_type === ENUM.ANSWER_TYPE.TEXT ?
            <label htmlFor={`ans-${idx}`}>
              { ans.value }
            </label> :
            <div className="img-answer">
              <img src={ans.fullValue} alt={`answer-${idx+1}`}/>
            </div>
        }
      </label>
    </li>
  )
}

function renderNumberInput({
  idx,
  ans,
  formState,
  currentQuestion,
  onChangeNumberInput,
}) {
  return (
    <li key={idx}>
      {
        ans.data_value ?
          (
            <label>{ ans.data_value.label }</label>
          ) : null
      }
      <InputNumber
        className="input"
        value={formState.targetQuestionAnswer[currentQuestion.id][ans.id]}
        onChangeDefault={onChangeNumberInput}
        data-question-id={currentQuestion.id}
        data-answer-id={ans.id}
      />
    </li>
  )
}

function renderDateInput({
  idx,
  ans,
  formState,
  currentQuestion,
  onChangeDateRatingInput,
}) {
  let selected = formState.targetQuestionAnswer[currentQuestion.id][ans.id];

  if (!selected) {
    selected = null;
  }

  return (
    <li key={idx}>
      <CustomDatePicker
        selected={selected}
        dateFormat="DD-MM-YYYY"
        onChange={(val) => onChangeDateRatingInput(val, currentQuestion.id, ans.id)}
        isClearable={true}
        time={false}
        hasInputReadOnlyInput={true}
      />
    </li>
  )
}

function renderRatingInput({
  idx,
  ans,
  formState,
  currentQuestion,
  onChangeDateRatingInput,
}) {
  return (
    <li key={idx}>
      <CustomRating
        value={formState.targetQuestionAnswer[currentQuestion.id][ans.id] || 0}
        label={ans.data_value.label}
        answerId={ans.id}
        onChange={(rating) => onChangeDateRatingInput(rating, currentQuestion.id, ans.id)}
      />
    </li>
  )
}

export function renderExtendOptionType(props) {
  let regex;

  switch(props.formState.extendsOptType.value) {
    case 'email':
      regex = REGEX.EMAIL;
      break;
    case 'phone':
      regex = REGEX.DIGIT;
      break;
    default:
      // id => no validate
      regex = /.*/;
  }

  return (
    <div>
      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label>
              { props.localeCreate.SL_EXTEND_OPT_TYPE_LABEL }:
            </label>
            <Select
              className="custom-select"
              searchable={false}
              clearable={false}
              options={EXTEND_OPTION_TYPE}
              value={props.formState.extendsOptType}
              onChange={props.onChangeExtendsOptTypeSelectBox}
            />
          </div>
        </div>
      </div>
      <div className="form-group">
        <label>
          { props.localeCreate.HOLDER_EXTEND_OPT_TYPE_LABEL }:
        </label>
        <p className="extend-opt-holder">Lorem Ipsum chỉ đơn giản là một đoạn văn bản giả, được dùng vào việc trình bày và dàn trang phục vụ cho in ấn.</p>
        <CustomTags
          value={props.formState.extendsOptTypeTags}
          onChange={props.onChangeExtendOptType}
          validationRegex={regex}
          onValidationReject={() => {
            Alert.error(props.localeCreate.ERROR_EXTEND_TYPE)
          }}
        />
      </div>
    </div>
  )
}

function findName(questionId, type, answerId, props){
       
  const { listTargetOption } = props;
  for (let i = 0, l = listTargetOption.length; i < l; i++) {
    const question = find(listTargetOption[i].question, { id: parseInt(questionId, 10) });
   
    if (!question) continue;
    if(type === 'question'){
        return question.name
    }
    const answer = find(question.answer, { id: parseInt(answerId, 10) });
    if (!answer) continue;
    return answer.name;
  }
  return null
}
export function renderItemtarget(props){

  let  age_from, age_to, cities, gender, answerSelected, extendsOptTypeTags, extendsOptType, pollSurveySelectedData;
  if(props.formState.isExpandshowTarget){
    age_from = props.formState.dataTargetChoose[AGE_FROM] || '';
    age_to = props.formState.dataTargetChoose[AGE_TO] || '';
    cities = props.formState.dataTargetChoose[CITY] || '';
    gender = props.formState.dataTargetChoose[GENDER] || '';
    answerSelected = props.formState.dataTargetChoose.answerSelected;
    extendsOptType = props.formState.dataTargetChoose.extendsOptType;
    extendsOptTypeTags = props.formState.dataTargetChoose.extendsOptTypeTags;
    pollSurveySelectedData = props.formState.dataTargetChoose.pollSurveySelectedData;
  }else{
    age_from = props.formState[AGE_FROM] || '';
    age_to = props.formState[AGE_TO] || '';
    cities = props.formState[CITY] || '';
    gender = props.formState[GENDER] || '';
    answerSelected = props.formState.answerSelected;
    extendsOptType = props.formState.extendsOptType;
    extendsOptTypeTags = props.formState.extendsOptTypeTags;
  }
  let gendercheck =  genderOpt[2].label;
  if(gender){
      if(gender === genderOpt[0].value){
        gendercheck = genderOpt[0].label
      }else{
          if(gender === genderOpt[1].value){
            gendercheck = genderOpt[1].label
          }else{
            gendercheck = genderOpt[2].label
          }
      }
  }
  return (
    <div className="row">
      <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        {
            cities && cities.length ?
                <div className="row">
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className="sub-title">
                            {localeCreate.Province_City}:
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className="content">
                            {cities.map(city => city.label).join(', ')}
                        </div>
                    </div>
                </div>
            :null
        }
        {
            gendercheck ?
                <div className="row">
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className="sub-title">
                          {localeCreate.Gender_option}:
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className="content">
                            {gendercheck}
                        </div>
                    </div>
                </div>
            :null
        }
        {
            age_from && age_to ? 
                <div className="row">
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className="sub-title">
                          {localeCreate.OPTION_AGE}:
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className="content">
                            {
                                age_from === 1 && age_to === 100 ?
                                  localeCreate.OPTION_AGE_ALL
                                :
                                  localeCreate.message_age_from + age_from + localeCreate.message_age_to + age_to
                            }
                        </div>
                    </div>
                </div>
            :null
        }
        {
            !isEmpty(answerSelected) ?
                map(answerSelected,(item, idx) =>{
                    return <div key={idx} className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="sub-title">
                                        {findName(idx, 'question', null, props)}: 
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="content">
                                        {
                                            !isEmpty(item) ? item.map(id => findName(idx, 'answer', id, props)).join(', ') : null
                                        }
                                    </div>
                                </div>
                            </div>
                })
                : null
        }
        {
            !isEmpty(extendsOptTypeTags) ?
                <div className="row">
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className="sub-title">
                            {props.localeCreate.EXTEND_OPTION_TYPE_TITLE}:
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className="content">
                            {extendsOptTypeTags.length} {extendsOptType.label}
                        </div>
                    </div>
                </div>
            : null
        }
      </div>
    </div>
  )
}