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

const {
  SINGLE,
  MULTI,
  SLIDER,
  RATING,
  DATE,
  NUMBER,
} = ENUM.QUESTION_TYPE;
const {
  MIN_VALUE_SLIDER,
  MAX_VALUE_SLIDER,
  LABEL_SLIDER,
  LABEL_RATING,
} = INPUT_NAME;

const localeCreate = window.locale.Create;
const getAnEmptySelectionAnswer = () => {
  return {
    title: '',
    value: '',
    value_type: ENUM.ANSWER_TYPE.TEXT,
    is_corrected: 0,
  }
}

const getEmptySliderAnswer = () => {
  return {
    [LABEL_SLIDER]: '',
    [MIN_VALUE_SLIDER]: null,
    [MAX_VALUE_SLIDER]: null,
  }
}

const getEmptyRatingAnswer = () => {
  return {
    [LABEL_RATING]: '',
    numberStar: 5,
  }
}

const initEmptyAnswer = (questionType, isAddOne) => {
  switch(questionType.value) {
    case SLIDER:
      return [getEmptySliderAnswer()]
    case RATING:
      return [getEmptyRatingAnswer()]
    case DATE:
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
  if (props.questionType.value.indexOf(SINGLE) > -1 ||
      props.questionType.value.indexOf(MULTI) > -1) {
    return props.answers
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
      props.question.question_type === MULTI_STRING : false;
    this.maxAnswerCount = window.Config ?
      parseInt(window.Config.MaxPollAnswer, 10) : 6;
    this.timeout = 0;
    
    this.state = {
      isMultiChoiceAns,
      answers,
    };
  }
  componentDidMount(){
    
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
        isMultiChoiceAns: nextProps.question.question_type === MULTI_STRING,
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
    this.setState({answers: answersClone});
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
        return <SelectionAnswer
          ref={node => {
            if(node) this.listAnswer.push(node);
          }}
          key={`selection-${idx}`}
          answer={answer}
          index={idx}
          {...otherProps}
          isDisableEdit={this.props.isDisableEdit}
        />;
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
            src={require('assets/images/date-input.jpg')}
            alt="date-input-img-holder"
          />
        </div>
      )
    } else if (questionType.value.indexOf(NUMBER) > -1) {
      return (
        <div className="col-xs-12">
          <img
            className="question-holder-img"
            src={require('assets/images/number-input.jpg')}
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

  removeAnswer = (idx) => {
    const newAnswer = filter(this.state.answers, (answer, index) => index !== idx);
    this.setState({ answers: newAnswer });
  }

  clearAllAnswers = () => {
    this.setState({
      isMultiChoiceAns: false,
      answers: initEmptyAnswer(this.props.questionType),
    })
  }

  render() {
    if (!this.props.questionType) {
      return null
    }

    const topLineMultiChoice = this.props.hasTopLineOnMultiChoice ? 'top-line' : ''

    return (
      <div className="col-xs-12">
        <div className="row">
          {
            this.props.isShowLabel ?
              <div className="col-xs-12">
                <label>{localeCreate.ANSWER}: </label>
              </div> : null
          }
          { this.renderAnswer() }
          {
            this.props.questionType.value.indexOf(DATE) === -1 &&
            this.props.questionType.value.indexOf(NUMBER) === -1 &&
            this.state.answers.length < this.maxAnswerCount && !this.props.isDisableEdit?
              <div className="col-xs-12">
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
          {
            !this.props.isDisableEdit ?
              <div className="col-xs-12">
                <div className={`form-btn ${topLineMultiChoice}`}>
                  {
                    this.props.questionType.value.indexOf(SINGLE) > -1 ||
                    this.props.questionType.value.indexOf(MULTI) > -1 ? 
                    <div className="form-group">
                      <span>
                        {localeCreate.MULTICHOICE}
                        &nbsp;&nbsp;
                      </span>
                      <input
                        className="toggle"
                        name="toggle-multi-choice"
                        onChange={this.toggleMultiChoice}
                        checked={this.state.isMultiChoiceAns}
                        type="checkbox"
                      />
                    </div> : null
                  }
                </div>
              </div> : null
          }
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
