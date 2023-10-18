import React from 'react';
import { map } from 'lodash';

export default ({ resultAnswer }) => {
  return (
    <div className="date-result-type">
      <table className="result-table">
        <thead>
          <tr className="border-top-bottom">
            <th>Response</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {
            map(resultAnswer.answer, (item, index) => {
              return map(item.data, (_item, _index) => {
                return (
                  <tr key={`${index}_${_index}`}>
                    <td className="text-center">
                      {_item.value}
                    </td>
                    <td className="text-center">
                      {_item.vote_count}
                    </td>
                  </tr>
                )
              })
            })
          }
        </tbody>
      </table>
    </div>
  )
}
