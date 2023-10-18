import React from 'react';
import IndexQuestion from './IndexQuestion';

const ListQuestions = (props) => {
  return (
    <div className="box-list-question">
      <div className="inner">
        <strong>
          {props.surveyInfo.name}
        </strong>
        <br/><br/>
        <ul className="list">
          {
            props.rangeQuestion.map((num) => {
              return <IndexQuestion
                key={num}
                backToQuestion={props.backToQuestion}
                current={props.current}
                index={num}
              />;
            })
          }
        </ul>
      </div>
    </div>
  )
}

export default ListQuestions;
