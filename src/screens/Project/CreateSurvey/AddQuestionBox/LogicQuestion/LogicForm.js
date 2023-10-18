import React from 'react';
import Select from 'react-select';
import { INPUT_NAME } from '../../../constant';
import BasicProfile from './BasicProfile';
import QuestionOption from './QuestionOption';
import AdvanceProfile from './AdvanceProfile';
import DestinationQuestion from './DestinationQuestion';
import LogicSelected from './LogicSelected';

const localeCreate = window.locale.Create;
const localeCommon = window.locale.Common;

function renderContent(props) {
  const {
    currentIdxLogicType,
    onChangeAdvanceProfile,
    onChangeInputText,
    onChangeSelectVal,
    onChangeQuestionInput,
    onChangeDateRatingSliderInput,
    onChangeSelectionAnswer,
    onChangeNumberInput,
    formState,
    listCityOption,
    listQuestion,
    listTargetOption,
    logicOpt,
    onChangeAge,
    onChangeAgeAll,
    questionSelectedLogic,
    deleteQuestionLogic
  } = props;
  switch(currentIdxLogicType) {
    case 0:
      return <QuestionOption
        formState={formState}
        listQuestion={listQuestion}
        onChangeQuestionInput={onChangeQuestionInput}
        onChangeSelectionAnswer={onChangeSelectionAnswer}
        onChangeDateRatingSliderInput={onChangeDateRatingSliderInput}
        onChangeNumberInput={onChangeNumberInput}
        questionSelectedLogic={questionSelectedLogic}
        deleteQuestionLogic={deleteQuestionLogic}
      />
    case 1:
      return <BasicProfile
        formState={formState}
        onChangeAge={onChangeAge}
        onChangeAgeAll={onChangeAgeAll}
        onChangeInputText={onChangeInputText}
        onChangeSelectVal={onChangeSelectVal}
        listCityOption={listCityOption}
      />
    default:
      return <AdvanceProfile
        formState={formState}
        listTargetOption={listTargetOption}
        currentProfile={logicOpt[currentIdxLogicType]}
        onChangeAdvanceProfile={onChangeAdvanceProfile}
      />
  }
}

const LogicForm = (props) => {
  const {
    logicOpt,
    listQuestion,
    currentIdxLogicType,
    onChangeIndexLogicType,
    questionSelectedLogic,
    listTargetOption,
    deleteItemLogic,
  } = props;
 
  return (
    <div className="col-xs-12">
      <div className="box-add-logic-survey">
          <div className="title">
            {localeCreate.message_choose_condition_logic}
          </div>
          <div className="box-choose-questionm-logic">
              <div className="title-option">
                <span className="fa fa-circle-o"></span>
                <span className="text">
                    {localeCreate.label_category}
                </span>
              </div>
              <div className="select-container">
                <Select
                  searchable={false}
                  clearable={false}
                  name={INPUT_NAME.FILTER_QUESTION}
                  placeholder={localeCreate.LOGIC_SELECT_HOLDER}
                  options={logicOpt}
                  value={logicOpt[currentIdxLogicType]}
                  onChange={(val) => onChangeIndexLogicType(val.value)}
                />
              </div>
              <div className="title-option">
                <span className="fa fa-circle-o"></span>
                <span className="text">
                    {localeCreate.logic_option_choose_question}
                </span>
              </div>
              <div className="content-question">
                { renderContent(props) }
              </div>
          </div>
          <div className="row">
            <LogicSelected 
              logic={props.formState.currentLogicObj}
              listQuestion={listQuestion}
              listTargetOption={listTargetOption}
              deleteItemLogic={deleteItemLogic}
            />
          </div>
          {
            props.validateOneLogic() ?
              <DestinationQuestion
                listQuestion={listQuestion}
                questionSelectedLogic={questionSelectedLogic}
                formState={props.formState}
                onChangeDestinationQuestion={props.onChangeDestinationQuestion}
              />
              : null
          }
      </div>
      <div className="group-btn-logic-question form-btn text-right">
        <ul className="list-inline">
          <li>
            <button
              className="btn btn-grey"
              type="button"
              onClick={() => props.clearLogicForm()}
            >
              <span className="fa fa-times" />
              <span className="text">
                {localeCreate.messages_cancel}
              </span>
            </button>
          </li>
          <li>
            {
              props.validateOneLogic() ?
              <button
                className="btn"
                onClick={props.saveOneLogic}
                type="button"
              >
                <span className="material-icons">save</span>
                <span className="text">
                  {localeCommon.SAVE}
                </span>
              </button> : null
            }
          </li>
        </ul>
      </div>
    </div>
  )
}

export default LogicForm;
