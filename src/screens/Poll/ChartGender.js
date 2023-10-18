import React from 'react';
import { reduce } from 'lodash';
import { PieChart } from 'react-chartkick';
import 'chart.js';

const getData = (genderData) => {
  if (!genderData) {
    return [];
  }

  const count = reduce(genderData, (total, item) => {
    return total + item;
  }, 0);

  return {
    data: [
      ['Male', genderData.Nam],
      ['Female', genderData.Nu],
      ['Other', genderData.Khac],
    ],
    title: `${count} people`
  }
}

const ChartGender = ({ resultAnswer }) => {
  if (!resultAnswer.advance) {
    return null;
  }
  const datas = getData(resultAnswer.advance.gender)  	

  return (
    <div className="wrap-donut">
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

export default ChartGender;
