import React from 'react';
import { reduce } from 'lodash';
import { PieChart } from 'react-chartkick';
import 'chart.js';

const getData = (ageData) => {
  if (!ageData) {
    return [];
  }

  const count = reduce(ageData, (total, item) => {
    return total + item;
  }, 0);

  return {
    data: [
      ['other', ageData['0']],
      ['< 18', ageData['18']],
      ['18 - 34', ageData['34']],
      ['35 - 54', ageData['54']],
      ['> 55', ageData['55']],
    ],
    title: `${count} people`
  }
};

const ChartAge = ({ resultAnswer }) => {
  if (!resultAnswer.advance) {
    return null;	  
  }	
  const datas = getData(resultAnswer.advance.age);

  return (
    <div className="wrap-donut">
      {/* 
        @data: [["WaterMelon", 64], ["Honey", 73]]
      */}
      <PieChart
        data={datas.data}
        donut={true}
        legend="bottom"
        messages={{empty: "No data"}}
      />
      <span className="chart-title">{datas.title}</span>
    </div>
  )
}

export default ChartAge;
