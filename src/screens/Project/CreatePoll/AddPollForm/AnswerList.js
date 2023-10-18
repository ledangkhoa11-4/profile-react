import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  cloneDeep,
  filter,
  forEach,
  isEmpty,
  map,
} from 'lodash';
import SelectionAnswer from './SelectionAnswer';
import SliderAnswer from './SliderAnswer';
import RatingAnswer from './RatingAnswer';
import { ENUM, INPUT_NAME } from '../../constant';
import { jsonEqual } from 'services/utils';
import { BASE_URL } from 'services/config';
import Tooltip from '../../../../components/Tooltip';
import '../style.css';
const {
  SINGLE,
  MULTI,
  SLIDER,
  RATING,
  DATE,
  NUMBER,
  TEXT,
} = ENUM.QUESTION_TYPE;
const {
  MIN_VALUE_SLIDER,
  MAX_VALUE_SLIDER,
  LABEL_SLIDER_LEFT,
  LABEL_SLIDER_RIGHT,
  NUMBER_STAR_RATING,
  MULTI_AVANCE_OPTION,
  LABEL_SLIDER,
  LABEL_RATING,
} = INPUT_NAME;

const localeCreate = window.locale.Create;
const getAnEmptySelectionAnswer = () => {
  return {
    title: '',
    value: '',
    media: '',
    value_type: ENUM.ANSWER_TYPE.TEXT,
    is_corrected: 0,
    [MULTI_AVANCE_OPTION]: 'no',
  }
}

const getEmptySliderAnswer = () => {
  return {
    [LABEL_SLIDER]: '',
    [LABEL_SLIDER_LEFT]: '',
    [LABEL_SLIDER_RIGHT]: '',
    [MIN_VALUE_SLIDER]: null,
    [MAX_VALUE_SLIDER]: null,
  }
}

const getEmptyRatingAnswer = () => {
  return {
    [LABEL_RATING]: '',
    [NUMBER_STAR_RATING]: 5,
  }
}

const initEmptyAnswer = (questionType, isAddOne) => {
  switch(questionType.value) {
    case SLIDER:
      return [getEmptySliderAnswer()]
    case RATING:
      return [getEmptyRatingAnswer()]
    case DATE:
    case TEXT:
    case NUMBER:
      return [];
    default:
      if (isAddOne) {
        return [getAnEmptySelectionAnswer()]
      }
      return [
        getAnEmptySelectionAnswer(),
        getAnEmptySelectionAnswer(),
      ]
  }
};

function parseAnswerOnEdit(props) {
  if (props.questionType.value.indexOf(SINGLE) > -1) {
    return props.answers
  }
  if (props.questionType.value.indexOf(MULTI) > -1) {
    return map(props.answers, answer => {
      if (answer.data_value) {
        const data_value = answer.data_value;
        return {
          ...answer,
          ...data_value
        }
      }else{
        return answer
      }
    })
  }
  return map(props.answers, answer => {
    if (answer.data_value) {
      return answer.data_value
    }
    return answer
  })
}

const MULTI_STRING = 'multi';

class AnswerList extends Component {
  constructor(props) {
    super(props)
    const answers = (props.pollDataFromDashboard &&
                    props.answers.length) ||
                      (!props.isCreatePoll && props.answers.length) ?
                      parseAnswerOnEdit(props) : initEmptyAnswer(props.questionType);
    const isMultiChoiceAns = props.question ?
      props.question.question_type === MULTI_STRING : (props.questionType === MULTI_STRING ? true : false);
    this.maxAnswerCount = window.Config ?
      parseInt(window.Config.MaxPollAnswer, 10) : 6;
    this.timeout = 0;
    
    this.state = {
      isMultiChoiceAns,
      answers,
      isShowAvanceSetting: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !jsonEqual(this.state, nextState) || !jsonEqual(this.props, nextProps)
  }

  getIsMultiChoiceAns = () => {
    return this.state.isMultiChoiceAns;
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.isDoNotUpdateOnProps ||
      jsonEqual(this.props, nextProps)
    ) {
      return;
    }
    
    if (nextProps.answers.length) {
      this.setState({
        answers: parseAnswerOnEdit(nextProps),
        isMultiChoiceAns: nextProps.question.question_type === MULTI_STRING,
      })
    } else if (
      this.props.questionType.value !== nextProps.questionType.value ||
      (
        !isEmpty(nextProps.question) &&
        nextProps.questionType.value.indexOf(nextProps.question.question_type) === -1
      ) ||
      !nextProps.answers.length
    ) {
      this.setState({
        answers: initEmptyAnswer(nextProps.questionType),
        isMultiChoiceAns: nextProps.questionType.value === MULTI_STRING,
      })
    }
  }

  getDataEditing() {
    let questionType = this.props.questionType.value;
    let answers = this.state.answers;
    if (questionType.indexOf(SINGLE) > -1 ||
        questionType.indexOf(MULTI) > -1) {
      questionType = this.state.isMultiChoiceAns ?
        MULTI : SINGLE;
      answers = filter(answers, answer => answer.value);
    }
    const data = {
      question: {
        question_type: questionType,
      },
    }
    if (answers.length) {
      data.answer = answers
    }
    return data
  }
  
  cloneAnswers(isCheckElement) {
    if (!this.state.isMultiChoiceAns && isCheckElement) {
      return this.state.answers.map(item => {
        const newItem = Object.assign({}, item);
        newItem.is_corrected = 0;
        return newItem;
      });
    }
    return cloneDeep(this.state.answers);
  }

  updateAnAnswer = (ans, idx, isCheckElement) => {
    const answersClone = this.cloneAnswers(isCheckElement);
    answersClone[idx] = ans;
    this.setState({answers: answersClone},() =>{
    });
  }

  excludeOtherAnswers = (ans, index) => {
    let answersClone = this.cloneAnswers();
    answersClone = map(answersClone, (item, idx) => {
      if (index === idx) {
        return ans
      }
      item.is_corrected = 0;
      return item
    });
    
    this.setState({ answers: answersClone });
  }

  validateAnswers() {
    let isValid = true;
    forEach(this.listAnswer, (item) => {
      const hasValid = item.validateAnswer();
      isValid = isValid && hasValid;
    });
    return isValid;
  }
  toggleMultiChoice = () => {
    const state = { isMultiChoiceAns: !this.state.isMultiChoiceAns };
    const cloneAnswers = map(this.state.answers, (answer, idx) => {
      const newAnswer = Object.assign({}, answer);
      newAnswer.is_corrected = 0;
      return newAnswer;
    });
    state.answers = cloneAnswers;
    
    this.setState(state);
  }
  renderAnswer() {
    this.listAnswer = [];
    const { questionType } = this.props;
    const otherProps = {
      isMultiChoiceAns: this.state.isMultiChoiceAns,
      lengthAnswer: this.state.answers.length,
      updateAnAnswer: this.updateAnAnswer,
      removeAnswer: this.removeAnswer,
      excludeOtherAnswers: this.excludeOtherAnswers,
     
    }
    if (questionType.value.indexOf(SINGLE) > -1 ||
        questionType.value.indexOf(MULTI) > -1) {
      return map(this.state.answers, (answer, idx) => {
        return  <SelectionAnswer
                  ref={node => {
                    if(node) this.listAnswer.push(node);
                  }}
                  key={`selection-${idx}`}
                  answer={answer}
                  index={idx}
                  {...otherProps}
                  isShowAvanceSetting={this.state.isShowAvanceSetting}
                  answerAdvancedSettings={this.answerAdvancedSettings}
                  isDisableEdit={this.props.isDisableEdit}
                />
        ;
      })
    } else if (questionType.value.indexOf(SLIDER) > -1) {
      return map(this.state.answers, (answer, idx) => {
        return <SliderAnswer
          ref={node => {
            if(node) this.listAnswer.push(node);
          }}
          key={`slider-${idx}`}
          answer={answer}
          index={idx}
          {...otherProps}
          isDisableEdit={this.props.isDisableEdit}
        />;
      })
    } else if (questionType.value.indexOf(RATING) > -1) {
      return map(this.state.answers, (answer, idx) => {
        return <RatingAnswer
          ref={node => {
            if(node) this.listAnswer.push(node);
          }}
          key={`rating-${idx}`}
          answer={answer}
          index={idx}
          {...otherProps}
          isDisableEdit={this.props.isDisableEdit}
        />
      })
    } else if (questionType.value.indexOf(DATE) > -1) {
      return (
        <div className="col-xs-12">
          <img
            className="question-holder-img"
            src={require('assets/images/date.png')}
            alt="date-input-img-holder"
          />
        </div>
      )
    } else if (questionType.value.indexOf(NUMBER) > -1) {
      return (
        <div className="col-xs-12">
          <img
            className="question-holder-img"
            src={require('assets/images/number.png')}
            alt="number-input-img-holder"
          />
        </div>
      )
    } else if (questionType.value.indexOf(TEXT) > -1) {
      return (
        <div className="col-xs-12">
          <img
            className="question-holder-img"
            src={require('assets/images/text.png')}
            alt="number-input-img-holder"
          />
        </div>
      )
    }
  }

  addAnswer = () => {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      const lenAnswer = this.state.answers.length;
      if (lenAnswer >= this.maxAnswerCount) {
        return;
      }
      const newAnswer = initEmptyAnswer(this.props.questionType, true);
      this.setState({ answers: this.state.answers.concat(newAnswer) });
    }, 50);
  }

  removeAnswer = (idx) => {
    const newAnswer = filter(this.state.answers, (answer, index) => index !== idx);
    this.setState({ answers: newAnswer });
  }

  clearAllAnswers = () => {
    this.setState({
      isMultiChoiceAns: false,
      isShowAvanceSetting: false,
      [MULTI_AVANCE_OPTION]: 'no',
      answers: initEmptyAnswer(this.props.questionType),
    })
  }
  answerAdvancedSettings = () =>{
    this.setState({
      isShowAvanceSetting: !this.state.isShowAvanceSetting
    })
  }
  renderTitle = () =>{
    const infor = BASE_URL + '/assetsnew/icon/infor.png';
    switch (this.props.questionType.value) {
      case SINGLE:
        return this.state.isShowAvanceSetting  && !this.state.isMultiChoiceAns ? 
          <div className="col-xs-12">
              <div className="row label-single-multi">
                <div className="col-xs-8">
                  <div>
                    <Tooltip
                      content={localeCreate.Right_answer_tooltip}
                      position='top'
                    >
                      {localeCreate.Right_answer} <img src={infor}/>
                    </Tooltip>
                  </div>
                </div>
                <div className="col-xs-4">
                  <div>
                    <Tooltip
                      content={localeCreate.Report_value_tooltip}
                      position='top'
                    >
                      {localeCreate.Report_value} <img src={infor}/>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
        : null
      case MULTI:
        return this.state.isShowAvanceSetting && this.state.isMultiChoiceAns ? 
          <div className="col-xs-12">
              <div className="row label-single-multi">
                <div className="col-xs-6">
                  <div>
                    <Tooltip
                      content={localeCreate.Right_answer_tooltip}
                      position='top'
                    >
                      {localeCreate.Right_answer} <img src={infor}/>
                    </Tooltip>
                  </div>
                </div>
                <div className="col-xs-3">
                  <div>
                    <Tooltip
                      content={localeCreate.Special_options_tooltip}
                      position='top'
                    >
                     {localeCreate.Special_options}  <img src={infor}/>
                    </Tooltip>
                  </div>
                </div>
                <div className="col-xs-3">
                  <div>
                    <Tooltip
                      content={localeCreate.Report_value_tooltip}
                      position='top'
                    >
                      {localeCreate.Report_value} <img src={infor}/>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
        : null
      case SLIDER:
        return (
          <div className="col-xs-12">
            <div className="row label-single-multi">
              <div className="col-xs-3">
                <div>
                  <Tooltip
                    content={localeCreate.Name_of_criteria_tooltip}
                    position='top'
                  >
                    {localeCreate.Name_of_criteria} <img src={infor}/>
                  </Tooltip>
                </div>
              </div>
              <div className="col-xs-3">
                <div>
                  <Tooltip
                    content={localeCreate.Value_range_tooltip}
                    position='top'
                  >
                    {localeCreate.Value_range} <img src={infor}/>
                  </Tooltip>
                </div>
              </div>
              <div className="col-xs-3">
                <div>
                  <Tooltip
                    content={localeCreate.Left_label_tooltip}
                    position='top'
                  >
                    {localeCreate.Left_label} <img src={infor}/>
                  </Tooltip>
                </div>
              </div>
              <div className="col-xs-3">
                <div>
                  <Tooltip
                    content={localeCreate.Right_label_tooltip}
                    position='top'
                  >
                   {localeCreate.Right_label} <img src={infor}/>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        )
        
      case RATING:
        return (
          <div className="col-xs-12">
            <div className="row label-single-multi">
              <div className="col-xs-8">
                <div>
                  <Tooltip
                    content={localeCreate.Name_of_criteria_tooltip}
                    position='top'
                  >
                    {localeCreate.Name_of_criteria} <img src={infor}/>
                  </Tooltip>
                </div>
              </div>
              <div className="col-xs-4">
                <div>
                  <Tooltip
                    content={localeCreate.Number_of_stars_tooltip}
                    position='top'
                  >
                    {localeCreate.Number_of_stars} <img src={infor}/>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return;
    }
  }
  render() {
    if (!this.props.questionType) {
      return null
    }
    return (
      <div className="col-xs-12">
        <div className="row">
          { this.renderTitle() }
          { this.renderAnswer() }
          {
            this.props.questionType.value.indexOf(DATE) === -1 &&
            this.props.questionType.value.indexOf(NUMBER) === -1 &&
            this.props.questionType.value.indexOf(TEXT) === -1 &&
            this.state.answers.length < this.maxAnswerCount && !this.props.isDisableEdit?
              <div className="col-xs-12 box-add-answer">
                <a
                  role="button"
                  title={localeCreate.ADD}
                  className="add-answer"
                  onClick={this.addAnswer}
                >
                  <span className="fa fa-plus"/>
                  <span className="text">
                    &nbsp;{localeCreate.ADD}
                  </span>
                </a>
              </div> : null
          }
          <div className="col-xs-12">
          {
            this.props.questionType.value.indexOf(SINGLE) > -1 ||
            this.props.questionType.value.indexOf(MULTI) > -1 ? 
            <div className="answer-advanced-settings">
                <div className="custom-checkbox-1">
                    <input
                      id="advanced-settings"
                      name="advanced-settings"
                      type="checkbox"
                      checked={this.state.isShowAvanceSetting}
                      onChange={this.answerAdvancedSettings}
                    />
                    <div className="checkbox-visible"></div> 
                </div>
                <label htmlFor="advanced-settings" className="text-settings">
                  {localeCreate.Advanced_settings}
                </label>
            </div> : null
          }
          </div>
        </div>
      </div>
    );
  }
}

AnswerList.defaulProps = {
  isShowLabel: true,
}

AnswerList.propTypes = {
  isShowLabel: PropTypes.bool,
}

export default AnswerList;
