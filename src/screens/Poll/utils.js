import React from 'react';
import { find, isEmpty, map, reduce } from 'lodash';
import CustomRating from 'components/CustomRating';
import CustomSlider from 'components/CustomSlider';
import InputNumber from 'components/InputNumber';
import CustomDatePicker from 'components/CustomDatePicker';
import ResultSingleChoice from './ResultSingleChoice';
import ResultMultiChoice from './ResultMultiChoice';
import ResultDateType from './ResultDateType';
import { ENUM } from '../Project/constant';
import moment from 'moment';
import ResultSpecificType from './ResultSpecificType';
import { APIs } from '../../services/config';
import { getTokenCookie } from '../../services/utils';

const {
  SINGLE,
  SLIDER,
  RATING,
  NUMBER,
  DATE,
  MULTI
} = ENUM.QUESTION_TYPE;
const { IMAGE } = ENUM.QUESTION_MEDIA_TYPE;
const localePoll = window.locale.Poll;
// const localeCreate = window.locale.Create;

/*
* @isSurvey: true => for survey else for poll
*/
export function renderAnswers(props, isSurvey = false) {
  const data = !isSurvey ? {
    question: props.question,
    currentAnswer: props.userVoted,
    isSurvey,
  } : {
    ...props,
    isSurvey,
  };

  switch(props.question.question_type) {
    case SLIDER:
      return renderSliderAnswer(data)
    case RATING:
      return renderRatingAnswer(data)
    case NUMBER:
      return renderNumberAnswer(data)
    case DATE:
      return renderDateAnswer(data)
    default:
      // multi/single
      return renderSelectionAnswer(data)
  }
}

export function renderReadOnlyAnswers(props) {
  switch(props.poll.question.question_type) {
    case SLIDER:
      return renderReadOnlySliderAnswer(props)
    case RATING:
      return renderReadOnlyRatingAnswer(props)
    case NUMBER:
      return renderReadOnlyNumberAnswer(props)
    case DATE:
      return renderReadOnlyDateAnswer(props)
    default:
      // multi/single
      return renderReadOnlySelectionAnswer(props)
  }
}

export function compareUserVoted(prevVote, currentVote) {
  if (!prevVote) {
    return false;
  }
  if (prevVote.length !== currentVote.length) {
    return false;
  }
  for (let i = 0, l = prevVote.length; i < l; i++) {
    if (prevVote[i] !== currentVote[i]) {
      return false;
    }
  }
  return true;
}

export function getDataFromVoteForm(question, inputData, isSurvey = false) {
  switch (question.question_type) {
    case RATING:
    case SLIDER:
    case NUMBER:
      const inputs = document.getElementsByName(`${question.question_type}-vote`);
      return map(inputs, input => ({
        id: parseInt(input.dataset.answerId, 10),
        value: parseInt(input.value, 10),
      }))
    case DATE:
      const dateInputs = document.getElementsByName(`${question.question_type}-vote`);
      return map(dateInputs, input => {
        let date = '';

        if (input.value) {
          const temp = input.value.split('-')
          date = new Date(temp[2], temp[1], temp[0])
        }
        
        if (date) {
          date = date.getFullYear() + '-' +
                  ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
                  ('0' + date.getDate()).slice(-2)
        }

        return {
          id: parseInt(input.dataset.answerId, 10),
          value: date,
        }
      })
    default:
      // single/multi
      const id = !isSurvey ?
        question.poll_id : question.id;
      return inputData.getAll(id)
        .map(val => parseInt(val, 10))
  }
}

export function validateVoteAnswer(questionType, answer_id) {
  if (!answer_id.length) {
    return false
  }

  if (questionType === NUMBER || questionType === DATE) {
    return !!answer_id[0].value
  }

  return true
}

function renderSelectionAnswer({question, currentAnswer, isSurvey}) {
  const inputType = question.question_type === SINGLE ? 'radio' : 'checkbox';
  const imgAnswer = find(question.answer, answer => {
    return answer.value_type === ENUM.ANSWER_TYPE.IMAGE;
  });
  const classWrapper = imgAnswer ? 'answer img-style' : 'answer';
  const classRow = !imgAnswer ? 'col-sm-6' : '';

  return (    
    <ul className={classWrapper}>
      {
        question.answer.map((ans, idx) => {
          const answerSelect = !!(
            currentAnswer &&
            currentAnswer.answer_id &&
            currentAnswer.answer_id.indexOf(ans.id) > -1
          );
          const name = !isSurvey ?
            question.poll_id : question.id;
          
          return (
            <li key={idx} className={classRow}>
              <label>
                <input
                  type={inputType}
                  id={`ans-${idx}`}
                  name={name}
                  defaultValue={ans.id}
                  defaultChecked={answerSelect}
                />
                {
                  ans.value_type === ENUM.ANSWER_TYPE.TEXT ?
                    <label htmlFor={`ans-${idx}`} className={question.question_type}>
                      { ans.value }
                    </label> :
                    <div className="img-answer">
                      <img src={ans.fullValue} alt={`answer-${idx+1}`}/>
                    </div>
                }
              </label>
            </li>
          )
        })
      }
    </ul>
  )
}

function renderReadOnlySelectionAnswer(props) {
  const { poll } = props;
  const question = poll.question || {},
        vote = (poll.vote && poll.vote[0]) || {};
  const inputType = question.question_type === 'single' ? 'radio' : 'checkbox';
  const imgAnswer = find(question.answer, answer => {
    return answer.value_type === ENUM.ANSWER_TYPE.IMAGE;
  });
  const classWrapper = imgAnswer ? 'answer img-style' : 'answer';
  return (
    <ul className={classWrapper}>
      {
        question.answer.map((ans) => {
          const answerSelect = !!(vote.answer_id && vote.answer_id.indexOf(ans.id) > -1);

          if (!answerSelect) {
            return null
          }

          return (
            <li key={ans.id}>
              <label>
                <input
                  type={inputType}
                  id={`ans-${ans.id}`}
                  name={question.poll_id}
                  defaultValue={ans.id}
                  defaultChecked={answerSelect}
                  disabled={true}
                />
                {
                  ans.value_type === ENUM.ANSWER_TYPE.TEXT ?
                    <label htmlFor={`ans-${ans.id}`} className={question.question_type}>
                      {ans.value}
                    </label> :
                    <div className="img-answer">
                      <img src={ans.fullValue} alt={`answer-${ans.id}`} />
                    </div>
                }
              </label>
            </li>
          )
        })
      }
    </ul>
  )
}

function renderRatingAnswer({question, currentAnswer}) {
  const answer_id = currentAnswer && currentAnswer.answer_id;
  return (
    <ul className="answer">
      {
        question.answer.map((ans, idx) => {
          let value = ans.value || 0;
          
          if (answer_id) {
            value = find(answer_id, obj => {
              return obj.id === ans.id
            }).value
          }

          return (
            <li key={`${question.question_type}-${idx}`}>
              <CustomRating
                name={`${question.question_type}-vote`}
                value={value}
                label={ans.data_value.label}
                answerId={ans.id}
              />
            </li>
          )
        })
      }
    </ul>
  )
}

function renderReadOnlyRatingAnswer(props) {
  const {
    vote,
    question,
  } = props.poll;
  const answer_id = !isEmpty(vote) && vote[0].answer_id;
  if (!answer_id) {
    return null;
  }
  return (
    <ul className="answer">
      {
        question.answer.map((ans, idx) => {
          let value = ans.value || 0;
          
          if (answer_id) {
            value = find(answer_id, obj => {
              return obj.id === ans.id
            }).value
          }

          return (
            <li key={`${question.question_type}-${idx}`}>
              <CustomRating
                name={question.question_type}
                value={value}
                label={ans.data_value.label}
                answerId={ans.id}
                interactive={false}
              />
            </li>
          )
        })
      }
    </ul>
  )
}

function renderSliderAnswer({question, currentAnswer}) {
  const answer_id = currentAnswer && currentAnswer.answer_id;
  
  return (
    <ul className={`answer ${question.question_type}`}>
      {
        question.answer.map((ans, idx) => {
          let value = ans.value || 0;
          
          if (answer_id) {
            value = find(answer_id, obj => {
              return obj.id === ans.id
            }).value
          }
          
          return (
            <li key={`${question.question_type}-${idx}`}>
              <CustomSlider
                name={`${question.question_type}-vote`}
                value={value}
                label={ans.data_value.label}
                answerId={ans.id}
                max={ans.data_value.max_value}
                min={ans.data_value.min_value}
              />
            </li>
          )
        })
      }
    </ul>
  )
}

function renderReadOnlySliderAnswer(props) {
  const {
    vote,
    question,
  } = props.poll;
  const answer_id = !isEmpty(vote) && vote[0].answer_id;
  if (!answer_id) {
    return null;
  }
  return (
    <ul className={`answer ${question.question_type}`}>
      {
        question.answer.map((ans, idx) => {
          let value = ans.value || 0;
          
          if (answer_id) {
            value = find(answer_id, obj => {
              return obj.id === ans.id
            }).value
          }
          
          return (
            <li key={`${question.question_type}-${idx}-${value}`}>
              <CustomSlider
                name={question.question_type}
                value={value}
                label={ans.data_value.label}
                answerId={ans.id}
                max={ans.data_value.max_value}
                readOnly={true}
              />
            </li>
          )
        })
      }
    </ul>
  )
}

function renderNumberAnswer({question, currentAnswer}) {
  const answer_id = currentAnswer && currentAnswer.answer_id;

  return (
    <div className={`form ${question.question_type}`}>
      {
        question.answer.map((ans, idx) => {
          let value = ans.value || '';
          
          if (answer_id) {
            value = find(answer_id, obj => {
              return obj.id === ans.id
            }).value
          }

          return (
            <InputNumber
              key={`${question.question_type}-${idx}`}
              name={`${question.question_type}-vote`}
              placeholder={localePoll.NUMBER_INPUT_HOLDER}
              className="input"
              data-answer-id={ans.id}
              defaultValue={value}
            />
          )
        })
      }
    </div>
  )
}

function renderReadOnlyNumberAnswer(props) {  
  const {
    vote,
    question,
  } = props.poll;
  const answer_id = !isEmpty(vote) && vote[0].answer_id;
  if (!answer_id) {
    return null;
  }
  return (
    <div className={`form ${question.question_type}`}>
      {
        question.answer.map((ans, idx) => {
          let value = ans.value || '';
          
          if (answer_id) {
            value = find(answer_id, obj => {
              return obj.id === ans.id
            }).value
          }

          return (
            <InputNumber
              key={`${question.question_type}-${idx}-${value}`}
              name={question.question_type}
              placeholder={localePoll.NUMBER_INPUT_HOLDER}
              className="input"
              data-answer-id={ans.id}
              defaultValue={value}
              readOnly={true}
            />
          )
        })
      }
    </div>
  )
}

function renderDateAnswer({question, currentAnswer}) {
  const answer_id = currentAnswer && currentAnswer.answer_id;

  return question.answer.map((ans, idx) => {
    let value = ans.value || null;
    
    if (answer_id) {
      value = find(answer_id, obj => {
        return obj.id === ans.id
      }).value;
      value = moment(new Date(value));
    }

    return (
      <CustomDatePicker
        key={`${question.question_type}-${idx}`}
        name={`${question.question_type}-vote`}
        dateFormat="DD-MM-YYYY"
        time={false}
        answerId={ans.id}
        selected={value}
        hasInputReadOnlyInput={true}
      />
    )
  })
}

function renderReadOnlyDateAnswer(props) {
  const {
    vote,
    question,
  } = props.poll;
  const answer_id = !isEmpty(vote) && vote[0].answer_id;
  if (!answer_id) {
    return null;
  }

  return question.answer.map((ans, idx) => {
    let value = ans.value || '';
    
    if (answer_id) {
      value = find(answer_id, obj => {
        return obj.id === ans.id
      }).value;
      value = moment(new Date(value));
    }

    return (
      <CustomDatePicker
        key={`${question.question_type}-${idx}-${value}`}
        name={question.question_type}
        dateFormat="DD-MM-YYYY"
        time={false}
        answerId={ans.id}
        selected={value}
        isEdit={false}
        readOnlyInput={true}
      />
    )
  })
}

/*
* For ResultContent
*/
function calculateResultAnswer(questionType, totalVoteCount, answer) {
  if (totalVoteCount === 0) {
    return 0;
  }
  const { data } = answer;
  switch(questionType) {
    case SLIDER:
      const sumValue = reduce(data, (result, item) => {
        return result += item.value * item.vote_count
      }, 0)
      return sumValue / totalVoteCount;
    case RATING:
      let totalStarVote = 0;
      let entry;
      for (let i = 0; i < 5; i++) {
        entry = find(data, { value: (i + 1) })
        totalStarVote += entry ? (entry.value * entry.vote_count) : 0;
      }

      return totalStarVote / totalVoteCount;
    default:
      // single / multi / number / date
      return Math.round(answer.vote_count / totalVoteCount * 100);
  }
}

function renderProgress(questionType, result, dataValue) {
  let resultPercent;
  switch (questionType) {
    case SLIDER:
      resultPercent = result / dataValue.max_value * 100;
      break;
    case RATING:
      resultPercent = result / 5 * 100;
      break;
    default:
      resultPercent = result;
  }
  return (
    <div>
      <progress max="100" value={resultPercent} className="rate-1" />
      {
        dataValue ?
          <span className="max-value-progress">
            {dataValue.max_value}
          </span> : null
      }
    </div>
  )
}

function renderNumberResult(questionType, dataValue) {
  switch (questionType) {
    case SLIDER:
      return null;
    case RATING:
      return <i className="fa fa-star" />
    default:
      return '%';
  }
}

// function renderProgressResult(idx, answer, question, resultAnswerVoteCount) {
//   const result = calculateResultAnswer(question.question_type, resultAnswerVoteCount, answer)
//   let value = answer.value || answer.label;

//   if (question.question_type === DATE) {
//     value = value.split('-')
//     value = `${value[2]}-${value[1]}-${value[0]}`
//   }

//   return (
//     <li className="rate table" key={idx}>
//       <div className="table-row">
//         {
//           answer.value_type === IMAGE ?
//             <div className="img-in-result table-cell">
//               <img src={answer.fullValue} alt=""/>
//             </div> : null
//         }
//         <div className="wrapper-percent table-cell">
//           <div className="number">
//             <span>
//               {result}
//               {
//                 renderNumberResult(
//                   question.question_type,
//                   question.answer[idx].data_value
//                 )
//               }
//             </span>
//           </div>
//           <div className="wrap">
//             {
//               renderProgress(
//                 question.question_type,
//                 result,
//                 question.answer[idx].data_value
//               )
//             }
//             {
//               answer.value_type !== IMAGE ?
//                 <div className="text">
//                   {value}
//                 </div> : null
//             }
//           </div>
//         </div>
//       </div>
//     </li>
//   )
// }

export function exportCSV(props) {  
  const {
    question,
  } = props;  
  let url = '';

  if (props.keyPollSurvey === 'poll') {
    url = APIs.resultCsv.poll.url.replace('{pollId}', question.poll_id);
  } else if (props.keyPollSurvey === 'survey') {
    url = APIs.resultCsv.survey.url
      .replace('{surveyId}', question.survey_id)
      .replace('{questionId}', question.id);
  }

  if (url) {
    url += `?api_token=${getTokenCookie()}`
  } else {
    return;
  }

  window.open(url, '_blank');
}

export function renderQuestionSection(question, resultAnswer) {
  if (question.question_type === SINGLE) {
    return <ResultSingleChoice
      resultAnswer={resultAnswer}
    />
  } else if (question.question_type === MULTI) {
    return <ResultMultiChoice
      resultAnswer={resultAnswer}
    />
  } else if (question.question_type === DATE) {
    return <ResultDateType
      resultAnswer={resultAnswer}
    />
  } else if (
    question.question_type === SLIDER ||
    question.question_type === RATING ||
    question.question_type === NUMBER
  ) {
    return <ResultSpecificType
      resultAnswer={resultAnswer}
      questionType={question.question_type}
    />
  }
  
  return null
}
