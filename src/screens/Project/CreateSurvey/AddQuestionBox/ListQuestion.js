import React from 'react';
import { cloneDeep, findIndex , isEmpty, map } from 'lodash';

const parseData = (list) => list.map(item => ({
  value: item.id,
  label: item.question,
  hasLogic: !isEmpty(item.logic)
}));

const ListQuestion = (props) => {
  let listQuestion = [];
  let isNotExist = false;
  const cloneQuestions = cloneDeep(props.listQuestion)
  if (props.questionOrder && props.questionOrder.length) {
    listQuestion = map(props.questionOrder, qOrder => {
      const index = findIndex(cloneQuestions, { id: qOrder})
      if (index === -1) {
        isNotExist = true
        return null
      }
      return cloneQuestions.splice(index, 1)[0]
    })

    if (isNotExist) {
      listQuestion = listQuestion.filter(item => !!item)
    }
  }
  listQuestion = [...listQuestion, ...cloneQuestions]

  let questionFiltering = parseData(listQuestion)
  
  return (
    <div className="col-xs-12">
      <div className="form-group created-questions">
        <label>
          { props.localeCreate.CREATED_QUESTION_LABEL }
        </label>
        <div className="wrap-list-questions">
          <table className={questionFiltering.length > 0 ? 'active' : ''}>
            <thead>
              {
                questionFiltering.length > 0 ?
                  <tr>
                    <th>STT</th>
                    <th>{props.localeCreate.QUESTION}</th>
                  </tr>
                :
                  <tr>
                    <th>{props.localeCreate.QUESTION}</th>
                  </tr>
              }
            </thead>
            <tbody>
              {
                questionFiltering.map((question, idx) => {
                  return (
                    <tr key={question.value}>
                      <td>{ idx + 1 }</td>
                      <td>
                        <div className="item-question">
                          <div className="question">
                            { question.label }
                          </div>
                          <ul className="list-control">
                            <li>
                              <button
                                type="button"
                                className="btn"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  props.changeQuestionSelected(question)
                                }}
                              >
                                <span className="fa fa-pencil"/>
                              </button>
                            </li>
                            {
                              listQuestion.length > 2 &&
                              idx < listQuestion.length - 2 ?
                                <li>
                                  <button
                                    type="button"
                                    className="btn"
                                    onClick={() => props.selectQuestion4Logic(question)}
                                  >
                                    <img style={{width: 25,height: 25}} src={require('assets/images/logic_icon.png')} />
                                    {
                                      question.hasLogic ?
                                        <span className="fa fa-check addition-icon-btn"/> : null
                                    }
                                  </button>
                                </li> : null
                            }
                            {
                              !props.isDisableEdit ?
                                <li>
                                  <button
                                    type="button"
                                    className="btn"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      props.removeCurrentQuestion(question)
                                    }}
                                  >
                                    <img src={require('assets/images/x-mark-01.png')} />
                                  </button>
                                </li> : null
                              }
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )
                })
              }
              {
                questionFiltering.length === 0 ?
                  <tr>
                    <td>
                        {props.localeCreate.message_no_question}
                    </td>
                  </tr>
                : null
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ListQuestion;
