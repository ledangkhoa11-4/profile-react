import React from 'react';
import Select from 'react-select';
import { find, findIndex, isEmpty, reduce } from 'lodash';
import InputNumber from 'components/InputNumber';
import CustomDatePicker from 'components/CustomDatePicker';
import CustomRating from 'components/CustomRating';
import CustomSlider from 'components/CustomSlider';
import moment from 'moment';
import {
  ENUM,
} from '../../../constant';

const localeCreate = window.locale.Create;

function renderCheckbox({
  idx,
  inputType,
  currentQuestion,
  ans,
  formState,
  onChangeSelectionAnswer
}) {
  const { questionInput } = formState.currentLogicObj;

  if (isEmpty(questionInput)) {
    return null
  }

  return (
    <div className="col-sm-6 col-xs-12 custom-single-multi" key={idx}>
      <label>
        <input
          type={inputType}
          id={`ans-${idx}`}
          name={currentQuestion.id}
          defaultValue={ans.id}
          checked={!!questionInput[currentQuestion.id][ans.id]}
          onChange={onChangeSelectionAnswer}
        />
        {
          ans.value_type === ENUM.ANSWER_TYPE.TEXT ?
              <label htmlFor={`ans-${idx}`}>
                { ans.value }
              </label>
            :
            <label htmlFor={`ans-${idx}`} className={ans.value ? "box-answer active" : "box-answer"}>
              <div className="img-answer">
                <img src={ans.fullValue} alt={`answer-${idx+1}`}/>
              </div>
              <div className="answer">
                { ans.value ?  ans.value : null}
              </div>
            </label>
        }
      </label>
    </div>
  )
}

function renderNumberInput({
  idx,
  ans,
  formState,
  currentQuestion,
  onChangeNumberInput,
}) {
  const { questionInput } = formState.currentLogicObj;

  if (isEmpty(questionInput)) {
    return null
  }

  return (
    <div key={idx} className="number-question-logic">
      <div className="title-question">
        {currentQuestion.question}
      </div>
      <InputNumber
        className="input form-control"
        value={questionInput[currentQuestion.id][ans.id]}
        onChangeDefault={onChangeNumberInput}
        data-question-id={currentQuestion.id}
        data-answer-id={ans.id}
      />
    </div>
  )
}

function renderDateInput({
  idx,
  ans,
  formState,
  currentQuestion,
  onChangeDateRatingSliderInput,
}) {
  const { questionInput } = formState.currentLogicObj;

  if (isEmpty(questionInput)) {
    return null
  }

  let selected = questionInput[currentQuestion.id][ans.id];

  if (!selected) {
    selected = null;
  }else{
    selected = moment(new Date(selected))
  }
  
  return (
    <div key={idx} className="date-picker-logic">
      <div className="title-question">
        {currentQuestion.question}
      </div>
      <div className="box-custom-date-picker">
        <CustomDatePicker
          selected={selected}
          dateFormat="DD-MM-YYYY"
          onChange={(val) => onChangeDateRatingSliderInput(val, currentQuestion.id, ans.id)}
          isClearable={false}
          time={false}
          hasInputReadOnlyInput={true}
        />
      </div>
    </div>
  )
}

function renderRatingInput({
  idx,
  ans,
  formState,
  currentQuestion,
  onChangeDateRatingSliderInput,
}) {
  const { questionInput } = formState.currentLogicObj;

  if (isEmpty(questionInput)) {
    return null
  }

  return (
    <div key={idx} className="rating-question-logic">
      <CustomRating
        value={questionInput[currentQuestion.id][ans.id] || 0}
        label={ans.data_value.label}
        answerId={ans.id}
        onChange={(rating) => onChangeDateRatingSliderInput(rating, currentQuestion.id, ans.id)}
      />
    </div>
  )
}

function renderSliderInput({
  idx,
  ans,
  formState,
  currentQuestion,
  onChangeDateRatingSliderInput,
}) {
  const { questionInput } = formState.currentLogicObj;

  if (isEmpty(questionInput)) {
    return null
  }
  
  return (
    <div className="slider-question-logic box-input-number-vote" key={`${currentQuestion.question_type}-${idx}`}>
      <CustomSlider
        name={`${currentQuestion.question_type}-vote`}
        value={questionInput[currentQuestion.id][ans.id] || 0}
        label={ans.data_value.label}
        answerId={ans.id}
        max={ans.data_value.max_value}
        min={ans.data_value.min_value}
        
        onChange={(num) => onChangeDateRatingSliderInput(num, currentQuestion.id, ans.id)}
      />
    </div>
  )
}

const QuestionOption = (props) => {
  const {
    formState,
    listQuestion,
    onChangeNumberInput,
    onChangeDateRatingSliderInput,
    onChangeSelectionAnswer,
    questionSelectedLogic
  } = props;

  const { inputQuestionSelected } = formState;
  const indexOfQuestionSelected = findIndex(listQuestion, { id: questionSelectedLogic.value })
  const _listQuestion = reduce(listQuestion, (result, question, index) => {
    if (index <= indexOfQuestionSelected && question.question_type !== ENUM.QUESTION_TYPE.TEXT) {
      result.push(question)
    }
    return result;
  }, []).map(item => ({
    value: item.id,
    label: item.question,
  }))
  const currentQuestion = inputQuestionSelected ?
    find(listQuestion, { id: inputQuestionSelected.value }) : undefined;
  var classWrapper = 'answer non-overflow';

  if (
    currentQuestion && (
      currentQuestion.question_type === ENUM.QUESTION_TYPE.SINGLE ||
      currentQuestion.question_type === ENUM.QUESTION_TYPE.MULTI
    )) {
    var inputType = 'checkbox';
    var imgAnswer = find(currentQuestion.answer, answer => {
      return answer.value_type === ENUM.ANSWER_TYPE.IMAGE;
    });
    classWrapper = imgAnswer && 'answer non-overflow img-style';
  }

  return (
    <div style={{ marginBottom: 10 }}>
      <div className="select-container item">
        <Select
          clearable={false}
          searchable={false}
          removeSelected={false}
          className="custom-select"
          options={_listQuestion}
          placeholder={localeCreate.QUESTION_LOGIC_SELECT_HOLDER}
          value={inputQuestionSelected}
          onChange={props.onChangeQuestionInput}
        />
      </div>
      {
        currentQuestion ?
          <div className="question-logic noselect">
            <div className="label-object">{ localeCreate.ANSWER_TARGET_TITLE }:</div>
            <a 
              className="deleted-question-logic"
              title={localeCreate.message_delete_this_target_answer}
              onClick={() => props.deleteQuestionLogic(currentQuestion.id)}
            >
              <img src={require('assets/images/x-mark-01.png')} />
            </a>
            <div className={`row ${classWrapper}`}>
              {
                currentQuestion.answer.map((ans, idx) => {
                  switch(currentQuestion.question_type) {
                    case ENUM.QUESTION_TYPE.NUMBER:
                      return renderNumberInput({
                        idx,
                        ans,
                        formState,
                        currentQuestion,
                        onChangeNumberInput,
                      });
                    case ENUM.QUESTION_TYPE.SLIDER:
                      return renderSliderInput({
                        idx,
                        ans,
                        formState,
                        currentQuestion,
                        onChangeDateRatingSliderInput,
                      });
                    case ENUM.QUESTION_TYPE.DATE:
                      return renderDateInput({
                        idx,
                        ans,
                        formState,
                        currentQuestion,
                        onChangeDateRatingSliderInput,
                      });
                    case ENUM.QUESTION_TYPE.RATING:
                      return renderRatingInput({
                        idx,
                        ans,
                        formState,
                        currentQuestion,
                        onChangeDateRatingSliderInput,
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
            </div>
          </div> : null
      }
    </div>
  )
}

export default QuestionOption;
