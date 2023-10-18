import React from 'react';
import { map } from 'lodash';

const getValuesOfAnAnswer = (data) => {
  let min = 0,
      max = 0,
      count = 0,
      totalValue = 0;
  for (let i = 0, l = data.length; i < l; i++) {
    if (i === 0) {
      max = data[i].value;
      min = data[i].value;
    } else {
      if (data[i].value > max) {
        max = data[i].value;
      }
      if (data[i].value < min) {
        min = data[i].value;
      }
    }
    count += data[i].vote_count;
    totalValue += data[i].value * data[i].vote_count;
  }

  const average = totalValue / count;
  let sum = 0;
  /* start calculate the average */
  for (let i = 0, l = data.length; i < l; i++) {
    sum += (Math.pow(data[i].value - average, 2) * data[i].vote_count)
  }
  const stdDev = Math.sqrt(sum / (count - 1)) || 0
  /* end calculate the average */

  return {
    min,
    max,
    median: (min + max) / 2,
    average,
    stdDev,
  }
}

export default ({ resultAnswer, questionType }) => {
  return (
    <div>
      <table className="result-table">
        <thead>
          <tr className="border-top-bottom">
            <th className="text-left">{questionType}</th>
            <th>Average</th>
            <th>Median</th>
            <th>Min</th>
            <th>Max</th>
            <th>StdDev</th>
          </tr>
        </thead>
        <tbody>
          {
            
            map(resultAnswer.answer, (item, index) => {
              const values = getValuesOfAnAnswer(item.data);

              return (
                <tr key={index}>
                  <td>{ item.label }</td>
                  <td className="text-center">{ values.average }</td>
                  <td className="text-center">{ values.median }</td>
                  <td className="text-center">{ values.min }</td>
                  <td className="text-center">{ values.max }</td>
                  <td className="text-center">{ values.stdDev }</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}
