import React from 'react';
import Select from 'react-select';

export const parseData = (question) => {
  return question.answer.map(item => ({
    value: item.id,
    label: item.name,
    parent_id: question.parent_id,
  }));
}

const AdvanceProfile = (props) => {
  const {
    listTargetOption,
    currentProfile,
    formState,
    onChangeAdvanceProfile,
  } = props;
  const targetOption = listTargetOption
    .find(item => item.id === currentProfile._id)

  return (
    <div className="row advance-logic">
      {
        targetOption.question.map((item, index) => {
          let value = '';
          if (formState.currentLogicObj.advanceProfile[currentProfile._id]) {
            value = formState.currentLogicObj.advanceProfile[currentProfile._id][item.id]
          }
          return (
            <div key={index} className="col-xs-12 col-sm-6">
              <label className="label-object">{item.name}</label>
              <div className="select-container item">
                <Select
                  searchable={false}
                  clearable={false}
                  multi={true}
                  closeOnSelect={false}
                  removeSelected={false}
                  options={parseData(item)}
                  className="custom-select"
                  onChange={(val) => onChangeAdvanceProfile(item, val)}
                  value={value}
                  placeholder="Select option"
                />
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default AdvanceProfile;
