import React, { Component } from 'react';
import { map, findIndex, cloneDeep } from 'lodash';
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from 'react-sortable-hoc';
import {
  jsonEqual,
} from 'services/utils';

const localeCommon = window.locale.Common;
const localeCreate = window.locale.Create;

const SortableItem = SortableElement(({value}) =>
  <li className="sort-item">
    <span className="fa fa-th"/>
    {value.question}
  </li>
);

const SortableList = SortableContainer(({listQuestion}) => {
  return (
    <ul className="sortable-box">
      {listQuestion.map((question, index) => (
        <SortableItem key={`item-${index}`} index={index} value={question} />
      ))}
    </ul>
  );
});

class SortQuestions extends Component {
  constructor(props) {
    super(props)
    
    const listQuestion = this.getListQuestion(props)
    this.state = {
      listQuestion,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !jsonEqual(this.props.listQuestion, nextProps.listQuestion) ||
      !jsonEqual(this.state, nextState)
  }

  componentWillUpdate(nextProps, nextState) {
    if (!jsonEqual(this.props, nextProps)) {
      const listQuestion = this.getListQuestion(nextProps)
      this.setState({ listQuestion })
    }
  }  

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      listQuestion: arrayMove(this.state.listQuestion, oldIndex, newIndex),
    })
  }

  getListQuestion(props) {
    let listQuestion = [];
    const cloneQuestions = cloneDeep(props.listQuestion)
    if (props.questionOrder && props.questionOrder.length) {
      listQuestion = map(props.questionOrder, qOrder => {
        const index = findIndex(cloneQuestions, { id: qOrder})
        return cloneQuestions.splice(index, 1)[0]
      })
    }

    return [...listQuestion, ...cloneQuestions]
  }

  getSortableQuestions() {
    return this.state.listQuestion
  }

  requestSortQuestion = () => {
    const question = map(this.state.listQuestion, question => question.id)
    this.props.requestSortQuestion(question)
  }

  render() {
    return (
      <div className="box-item">
        <div className="head">
          <div className="title">
            <h3>
              { localeCreate.SORT_QUESTION_TITLE }
            </h3>
          </div>
        </div>
        <span className="hint-sort-question">
          * {localeCreate.HINT_TEXT_SORT_QUESTION}
        </span>
        <SortableList
          listQuestion={this.state.listQuestion}
          onSortEnd={this.onSortEnd}
        />
        <div className="wrap-btn text-right">
          <button
            type="button"
            className="btn"
            onClick={this.requestSortQuestion}
          >
            <span className="material-icons">save</span>
            <span className="text">
              {localeCommon.SAVE}
            </span>
          </button>
        </div>
      </div>
    );
  }
}

export default SortQuestions;
