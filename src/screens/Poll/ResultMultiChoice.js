import React from 'react';
import { map, reduce } from 'lodash';
import { ColumnChart } from 'react-chartkick';
import 'chart.js';

const getData = (resultAnswer, totalVoteCount) => {
  return map(resultAnswer.answer, item => {
    const percent = item.vote_count / totalVoteCount * 100;
    if(item.title){
      return [item.title, percent.toFixed(1)]
    }
    return [item.value, percent.toFixed(1)]
  });
};
const getTotalVoteCount = (resultAnswer) => {
  return reduce(resultAnswer.answer, (result, item) => {
    return result + item.vote_count;
  }, 0);
}

export default ({ resultAnswer }) => {
  const totalVoteCount = getTotalVoteCount(resultAnswer);
  const data = getData(resultAnswer, totalVoteCount);

  return (
    <div>
      <ColumnChart
        data={data}
      />

      <table className="result-table">
        <thead>
          <tr className="border-top-bottom">
            <th className="text-left">Value</th>
            <th className="text-right percent-count">Percent</th>
            <th className="text-right response-count">Response</th>
          </tr>
        </thead>
        <tbody>
          {
            map(resultAnswer.answer, (item, index) => {
              const percent = (item.vote_count / totalVoteCount * 100) || 0;
              return (
                <tr key={index}>
                  <td>{item.title ? item.title : item.value}</td>
                  <td className="rate-list percent-count">
                    <div className="rate">
                      <progress max="100" value={percent} className="rate-1" />
                    </div>
                    <span className="text-percent">
                      { percent.toFixed(1) }%
                    </span>
                  </td>
                  <td className="text-right response-count">{item.vote_count}</td>
                </tr>
              )
            })
          }
        </tbody>
        <tfoot>
          <tr className="border-top-bottom">
            <td colSpan="3" className="text-right">
              <strong>Totals: {totalVoteCount}</strong>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
