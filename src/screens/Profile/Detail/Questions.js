import React from 'react';
import PropTypes from 'prop-types';
import { find } from 'lodash';
import FormAnswer from './FormAnswer';

const Question = (props) => {
  const ques = props.question;
  let form;
  let userAnswer = [],
      answerString = '';
  if (props.userAnswer.length) {
    answerString = props.userAnswer.map(ans => {
      const entry = ques.answer.filter(a => a.id === parseInt(ans, 10));
      if (entry) {
        userAnswer.push({
          value: entry[0].id,
          label: entry[0].name,
        });
      }
      return entry[0].name;
    });
    answerString = answerString.join('; ');
  }
  return (
    <div className="item" key={ques.id}>
      <div className="question">
        { ques.name }
      </div>
      {
        answerString ? 
          <div className="detail">
            <div className="desc">{ answerString }</div>
            <a name="edit" className="edit" onClick={() => {
              form.showForm();
            }}>
              <i aria-hidden="true" className="fa fa-pencil-square-o"></i>
              <span className="text">
                {props.localeProfile.EDIT_BUTTON}
              </span>
            </a>
          </div>
        : null
      }
      <FormAnswer
        ref={node => {
          if (node) {
            form = node;
          }
        }}
        question={ques}
        userAnswer={userAnswer}
        updateUserProfile={props.updateUserProfile}
      />
    </div>
  )
}

const Questions = (props) => {
  const questionWillBeRendered = props.questions.filter(question => {
    const matchObj = props.userProfiles.find(obj => {
      return obj.answer_id.indexOf(question.parent_id) > -1;
    });
    return question.parent_id === 0 || matchObj;
  })

  return questionWillBeRendered.map((ques, idx) => {
    const entry = find(props.userProfiles, obj => {
      return obj.question_id === ques.id;
    });
    const userAnswer = entry ? entry.answer_id : [];
    
    return <Question
      key={idx}
      localeProfile={props.localeProfile}
      question={ques}
      userAnswer={userAnswer}
      updateUserProfile={props.updateUserProfile}
    />;
  })
}

Questions.propTypes = {
  questions: PropTypes.array.isRequired,
  userProfiles: PropTypes.array.isRequired,
  updateUserProfile: PropTypes.func.isRequired,
}

export default Questions;
