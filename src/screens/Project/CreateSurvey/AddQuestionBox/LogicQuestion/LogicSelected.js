import React from 'react';
import { isEmpty, find, map, reduce } from 'lodash';
import { ENUM, INPUT_NAME } from '../../../constant';

const localeCreate = window.locale.Create;
const {
  AGE_FROM,
  AGE_TO,
  CITY,
  GENDER,
} = INPUT_NAME;
const {
  DATE,
  SINGLE,
  MULTI,
  RATING,
  SLIDER,
} = ENUM.QUESTION_TYPE;
const {
  IMAGE,
} = ENUM.ANSWER_TYPE;

function renderLogicCol(logic_question, listQuestion, listTargetOption, deleteItemLogic) {
  if (!logic_question) {
    return ''
  }
  const {
    basicProfile,
    advanceProfile,
    questionInput,
  } = logic_question;
  const city = basicProfile[CITY] && basicProfile[CITY].length ?
    basicProfile[CITY].map(city => city.label) : '';
  const gender = basicProfile[GENDER] ? basicProfile[GENDER] : '';
  const ageFrom = basicProfile[AGE_FROM] || '';
  const ageTo = basicProfile[AGE_TO] || '';
  function renderQuestion() {
    if (isEmpty(questionInput)) {
      return ;
    }
    const lists = map(questionInput, (q, keyQuestion) => {
      const _question = find(listQuestion, item => item.id === parseInt(keyQuestion, 10))
      const { question_type } = q;
      const _q = {...q};
      delete _q.question_type;

      const answers = reduce(_q, (result, value, keyAnswer) => {
        const ans = find(_question.answer, item => item.id === parseInt(keyAnswer, 10))
        if (!value) return result
        let _answer;
        if (question_type === SINGLE || question_type === MULTI) {
          _answer = ans.value_type === IMAGE 
            ?
              <div className="box-answer">
                <img src={ans.fullValue} alt="answer image"/>
                <div className="answer">
                  {ans.value}
                </div>
              </div>
            : 
              <div className="answer">{ans.value}</div>;
          
          } else if (question_type === DATE) {
          const date = new Date(value);
          _answer = <div>{date.getDate()} - {(date.getMonth() + 1)} - {date.getFullYear()}</div>;
        } else if (question_type === SLIDER) {
          _answer = <div><div className="slider-answer"> {value} </div> <span className="iconmoon1-slide"></span></div>;
        } else if (question_type === RATING) {
          _answer = <div><div className="slider-answer"> {value} </div> <span className="fa fa-star"></span></div>;
        } else {
          _answer = <div>{value}</div>;
        }
        result.push(_answer)
        return result
      }, [])
      return (
        <span>
          <i className="poll-survey-name">{_question.question }</i>
          <ul className="poll-survey-questions">
            {
              map(answers, (answer, idx) => {
                return (
                  <li key={`item-list-answer-quesion${idx}`}>
                    {answer}
                  </li>
                )
              })
            }
          </ul>
          {renderDeleteItem('questioninput', parseInt(keyQuestion, 10))}
        </span>
      )
    })
    return map(lists, (item, key) => {
            return (
              <div className="item" key={`item-list-quesion${key}`}>
                {item}
              </div>
            )
          })
        
      
    
  }

  function renderAdvanceProfile() {
    if (isEmpty(advanceProfile)) {
      return '';
    }

    const _advanceProfile = reduce(advanceProfile, (result, item, profileKey) => {
      const profile = find(listTargetOption, { id: parseInt(profileKey, 10) })
      const questions = reduce(item, (result1, item1, questionKey) => {
        if (isEmpty(item1)) return result1;
        const answers = map(item1, obj => {
          return obj.label
        })
        const question = find(profile.question, { id: parseInt(questionKey, 10) })
        const _val =  <div>
                        <strong>{question.name}</strong>
                        <ul>
                          {
                            map(answers, (answer, idxx) => {
                                return <li key={`item-advance-profile-answer${idxx}`}>
                                          {answer}
                                        </li>
                            })
                          }
                        </ul>
                        { renderDeleteItem('advance', parseInt(profileKey, 10), parseInt(questionKey, 10)) }
                      </div>
        result1.push(_val)
        return result1;
      }, [])

      if (isEmpty(questions)) return result

      const profileEl = <li>
                            <strong>{profile.name}</strong>
                            <ul>
                              {
                                map(questions, (question, idx) =>{
                                  return (
                                    <li className="item" key={`item-advance-profile-question${idx}`}>
                                        {question}
                                    </li>
                                  )
                                })
                              }
                            </ul>
                        </li>
      result.push(profileEl);
      return result;
    }, [])

    if (isEmpty(_advanceProfile)) return ;

    return map(_advanceProfile, (advance, key) => {
      return (
        <ul className="list-advance-profile" key={`item-advance-profile-${key}`}>
          {advance}
        </ul>
      )
    })
  }
  return (
    <div>
      {
        !(ageFrom && ageFrom === 1 && ageTo === 100) ? 
          <span className="item">
            <strong>{localeCreate.OPTION_AGE}</strong>: {ageFrom} {localeCreate.only_message_to} {ageTo}
              {renderDeleteItem(AGE_FROM)}
          </span>
        :
          <span className="item">
            <strong>{localeCreate.OPTION_AGE}</strong>: {localeCreate.OPTION_AGE_ALL}
          </span>
      }
      {
        gender && gender !== 'All' ?
          <span className="item">
            <strong>{localeCreate.GENDER}</strong>: {gender}
            {renderDeleteItem(GENDER)}
          </span>
        :
          <span className="item">
            <strong>{localeCreate.GENDER}</strong>: {localeCreate.ALL_OPTION_GENDER}
          </span>
      }
      {
        city ? 
          <span className="item">
            <strong>{localeCreate.CITY}</strong>: {city.join(', ')} 
            {renderDeleteItem(CITY)}
          </span>
        : null
      }
      {
        Object.keys(questionInput).length ?
          renderQuestion()
        : null
      }
      {
        renderAdvanceProfile()
      }
    </div>
  );
  function renderDeleteItem(type, key = null, questionKey = null){
    return (
            <a 
              className="delete-item" 
              onClick={() => deleteItemLogic(type, key, questionKey)}
            >
              <img src={require('assets/images/x-mark-01.png')} />
            </a>
          );
      
  }
}

function renderDestinationCol(logic_question, listQuestion) {
  const { questionOutput } = logic_question;
  
  if (!questionOutput) {
    return '';
  }
  
  const question = find(listQuestion, { id: questionOutput })
  return question ? `<div class="item"><strong>${localeCreate.DESTINATION_QUESTION_LABEL}: </strong>${question.question}</div>` : ''
}

function renderListLogic(props) {
  const { logic, listQuestion, listTargetOption, deleteItemLogic } = props;

  if ( isEmpty(logic) ) {
    return null
  }
  return (
    <li>
      <div className="title-group-logic">
        {localeCreate.message_condition_in_list_logic}
      </div>
      <div className="logic-col">
        {renderLogicCol(logic, listQuestion, listTargetOption, deleteItemLogic)}
      </div>
      <div className="destination-col" dangerouslySetInnerHTML={{
          __html: renderDestinationCol(logic, listQuestion)
      }}/>
    </li>
  )
}

const LogicSelected = (props) => {
  return (
    <div className="col-xs-12">
      <div className="box-add-logic-survey">
        <div className="selected-conditions">
          <div className="title">
            {localeCreate.message_conditions_selected}
          </div>
          <div>
            <ul className="wrap-list-logics">
              { renderListLogic(props) }
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}


export default LogicSelected;
