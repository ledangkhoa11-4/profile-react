import React from 'react';
import { find, reduce } from 'lodash';
import { ColumnChart } from 'react-chartkick';
import 'chart.js';

const localeCommon = window.locale.Common;

const ChartTimeline = ({ resultAnswer, listCityOption }) => {
  if (!resultAnswer.advance) {
    return null;	  
  }
  const data = reduce(resultAnswer.advance.city, (result, item, key) => {
    const percent = item / resultAnswer.vote_count * 100;

    if (parseInt(key, 10) === 0) {
      result.push([
        'Other',
        percent
      ])
      return result;
    }
    const city = find(listCityOption, { value: parseInt(key, 10) });
    result.push([city.label, percent]);
    return result;
  }, []);

  return (
    <div>
      <ColumnChart
        data={data}
        library={{
          title: {
            text: localeCommon.PERCENT,
            position: 'left',
            display: true,
            fontSize: 12,
            fontColor: '#000',
            fontStyle: 'italic'
          }
        }}
      />
    </div>
  )
}

export default ChartTimeline;
