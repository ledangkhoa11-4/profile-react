import React from 'react';
import Select from 'react-select';
import { findIndex } from 'lodash';

const localeCreate = window.locale.Create;

const DestinationQuestion = (props) => {
  const {
    formState,
    listQuestion,
    questionSelectedLogic,
    onChangeDestinationQuestion,
  } = props;
  const index = findIndex(listQuestion, item => {
    return item.id === questionSelectedLogic.value
  })

  if (index + 1 > listQuestion.length) {
    return null;
  }

  const subQuestions = listQuestion.slice(index + 1).map(item => ({
    value: item.id,
    label: item.question
  }))
  const valueSelect = subQuestions.find(item => item.value === formState.currentLogicObj.questionOutput)

  return (
    <div className="destination-question">
      <div className="title">
        {localeCreate.option_select_target_question}
      </div>
      <div className="form-group">
        <div className="select-container item">
          <Select
            searchable={false}
            clearable={false}
            placeholder={localeCreate.DESTINATION_QUESTION_HOLDER}
            options={subQuestions}
            value={valueSelect}
            onChange={(val) => onChangeDestinationQuestion(val)}
          />
        </div>
      </div>
    </div>
  )
}

export default DestinationQuestion;
