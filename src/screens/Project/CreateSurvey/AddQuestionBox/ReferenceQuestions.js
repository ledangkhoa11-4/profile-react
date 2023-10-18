import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { filter, forEach, map, isEmpty, find } from 'lodash';
import { INPUT_NAME } from '../../constant';

class ReferenceQuestion extends Component {
  state = {
    checkedObj: {},
  }
  
  componentWillMount() {
    this.tempRefQuestion = [];
  }
  
  componentDidMount() {
    if (!isEmpty(this.props.listQuestion)) {
      forEach(this.props.listQuestion, question => {
        if (this.props.answerHasRef.ref === question.id) {
          this.tempRefQuestion.push(this.props.answerHasRef.ref)
        }
      })
    }
  }
  
  handleChange = (e) => {
    this.tempRefQuestion = [];
    const isChecked = e.target.checked;
    const value = parseInt(e.target.value, 10);
    if (isChecked) {
      this.tempRefQuestion.push(value)
    }

    this.setState({
      checkedObj: { [value]: isChecked },
    })
  }

  onSubmit = (e) => {
    e.preventDefault();
    if (this.props.answerHasRef.ref === this.tempRefQuestion[0]) {
      return;
    }
    const formData = new FormData(e.target);
    this.props.onAddReferenceQuestion(formData, this.state.checkedObj);
  }

  renderListQuestions(questions) {
    const {
      answerHasRef,
      localeCommon,
    } = this.props;
    return (
      <form
        className="vote-content"
        onSubmit={this.onSubmit}
      >
        <ul className="answer">
          {
            map(questions, question => {
              const isChecked = !isEmpty(this.state.checkedObj) ?
                      this.state.checkedObj[question.id] : (answerHasRef.ref === question.id);
              return (
                <li key={question.id}>
                  <input
                    type="checkbox"
                    name={INPUT_NAME.REFERENCE_QUES}
                    id={`question-${question.id}`}
                    defaultValue={question.id}
                    checked={!!isChecked}
                    onChange={this.handleChange}
                  />
                  <label htmlFor={`question-${question.id}`}>
                    { question.question }
                  </label>
                </li>
              )
            })
          }
        </ul>
        <div className="box">
          <div className="inner">
            <div className="content">
              <div className="button-save">
                <ul>
                  <li>
                    <button type="submit" className="btn">
                      <span className="material-icons">save</span>
                      <span className="text">
                        {localeCommon.SAVE}
                      </span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }

  renderNoQuestion() {
    return (
      <div className="vote-content">
        <h3>Don't have any questions available!</h3>
        <div className="box">
          <div className="inner">
            <div className="content">
              <div className="button-save">
                <ul>
                  <li>
                    <button
                      type="submit"
                      className="btn"
                      onClick={this.props.closeModal}
                    >
                      <span className="text">Close</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {
      answerHasRef,
      currentQuestion,
      listQuestion,
      refQuestions,
      localeCreate,
    } = this.props;
  
    if (!answerHasRef) {
      return null;
    }
  
    const questions = filter(listQuestion, q => {
      const findAnswer = find(q.answer, { ref: currentQuestion.id });
      
      return (!findAnswer &&
        q.id !== currentQuestion.id &&
        refQuestions.indexOf(q.id) === -1) ||
        answerHasRef.ref === q.id;
    });
    
    return (
      <div className="box-item">
        <div className="head">
          <h1>{localeCreate.ANSWER_REFERENCE}</h1>
        </div>
        {
          questions.length ?
            this.renderListQuestions(questions) :
            this.renderNoQuestion()
        }
        
      </div>
    )
  }
}

ReferenceQuestion.propTypes = {
  answerHasRef: PropTypes.object,
  currentQuestion: PropTypes.object,
  listQuestion: PropTypes.array,
}

export default ReferenceQuestion;
