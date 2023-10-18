import React from 'react';
import Select from 'react-select';
import Alert from 'react-s-alert';
import {
  cloneDeep,
  find,
  isEmpty,
  map,
} from 'lodash';
import ExtendControlCarousel from './ExtendControlCarousel';
import CustomTags from 'components/CustomTags';
import InputNumber from 'components/InputNumber';
import CustomDatePicker from 'components/CustomDatePicker';
import CustomRating from 'components/CustomRating';
import {
  INPUT_NAME,
  ENUM,
  EXTEND_OPTION_TYPE,
} from '../../../constant';
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

export const parseData = (list) => {
  return list.map(item => ({
    value: item.id,
    label: item.name,
  }));
}

export function renderCarousel(props) {
  const targetOpt = cloneDeep(props.listTargetOption);
  targetOpt.unshift({ name: props.localeCreate.BASIC_TITLE });
  targetOpt.push({ name: props.localeCreate.QUESTION_TARGET_TITLE });
  targetOpt.push({ name: props.localeCreate.EXTEND_OPTION_TYPE_TITLE });
  const slidesToShow = targetOpt.length > 3 ? 3 : targetOpt.length;

  return <ExtendControlCarousel
    dots={false}
    slidesToShow={slidesToShow}
    slidesToScroll={1}
    onClickPrev={() => {
      if (props.formState.idxActive - 1 >= 0) {
        props.onChangeTabIndex(props.formState.idxActive - 1)
      }
    }}
    onClickNext={() => {
      if (props.formState.idxActive + 1 < targetOpt.length) {
        props.onChangeTabIndex(props.formState.idxActive + 1)
      }
    }}
  >
    {map(targetOpt, (item, idx) => {
      const classWrapper = props.formState.idxActive === idx ? 'item active' : 'item';
      return (
        <div className={classWrapper} key={idx} style={{ height: 70 }}>
          <a
            role="button"
            title={item.name}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              props.onChangeTabIndex(idx);
            }}
            id={`tab-${idx}`}
          >
            <span className="text">{item.name}</span>
          </a>
        </div>
      )
    })}
  </ExtendControlCarousel>
}

export function renderBasicContent(props) {
  return (
    <div className="col-xs-12" key={0}>
      <div className="row">
        <div className="col-xs-6">
          <div className="form-group">
            <label>
              {props.localeCreate.AGE_FROM}:
            </label>
            <input
              className="input"
              name={AGE_FROM}
              type="number"
              value={props.formState[AGE_FROM]}
              onChange={props.onChangeInputText}
            />
          </div>
        </div>
        <div className="col-xs-6">
          <div className="form-group">
            <label>
              {props.localeCreate.AGE_TO}:
            </label>
            <input
              className="input"
              name={AGE_TO}
              type="number"
              value={props.formState[AGE_TO]}
              onChange={props.onChangeInputText}
            />
          </div>
        </div>
        <div className="col-xs-6">
          <div className="form-group">
            <label>
              {props.localeCreate.GENDER}
            </label>
            <Select
              name={GENDER}
              clearable={false}
              searchable={false}
              multi={true}
              removeSelected={false}
              closeOnSelect={false}
              className="custom-select"
              options={genderOpt}
              placeholder={props.localeCreate.GENDER_HOLDER}
              value={props.formState[GENDER]}
              onChange={props.onChangeGender}
            />
          </div>
        </div>
        <div className="col-xs-6">
          <div className="form-group">
            <label>
              {props.localeCreate.CITY}
            </label>
            <Select
              name={CITY}
              multi={true}
              removeSelected={false}
              closeOnSelect={false}
              className="custom-select"
              placeholder={props.localeCreate.CITY_HOLDER}
              options={props.listCityOption}
              value={props.formState[CITY]}
              onChange={props.onChangeCity}
            />
          </div>
        </div>
      </div>
    </div>
  )
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

function renderExtendOptionType(props) {
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

export function renderSpecificTarget(props) {
  if (props.formState.idxActive > props.listTargetOption.length + 2) {
    return null;
  }

  if (props.formState.idxActive === 0) {
    return renderBasicContent(props);
  }

  if (props.formState.idxActive === props.listTargetOption.length + 1) {
    return renderQuestionOption(props)
  }

  if (props.formState.idxActive === props.listTargetOption.length + 2) {
    return renderExtendOptionType(props)
  }

  // first index (0) for the basic
  return map(props.listTargetOption[props.formState.idxActive - 1].question, (item, idx) => {
    if(typeof props.formState.answerSelected[item.id] != 'undefined' && item.type == '0' && typeof props.formState.answerSelected[item.id][0] != 'undefined'){
      props.formState.answerSelected[item.id] = props.formState.answerSelected[item.id][0]
    }
    return (
      <div className="col-xs-6" key={idx}>
        <label>{item.name}</label>
        <Select
          searchable={false}
          clearable={false}
          multi={item.type === '0' ? false : true}
          closeOnSelect={item.type==='0' ? true : false}
          removeSelected={false}
          options={parseData(item.answer)}
          className="custom-select"
          onChange={(val) => props.onChangeAnswers(item, val)}
          value={props.formState.answerSelected[item.id]}
          placeholder="Select option"
        />
      </div>
    )
  })
}
