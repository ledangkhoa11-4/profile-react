import React from 'react';
import Select from 'react-select';
import {
  INPUT_NAME,
  LIST_QUESTION_TYPE_FILTER,
} from '../../constant';

const localeCreate = window.locale.Create;

const FilterQuestion = (props) => {
  return (
    <div className="col-xs-12">
      <div className="form-group">
        <Select
          searchable={false}
          clearable={false}
          name={INPUT_NAME.FILTER_QUESTION}
          placeholder={localeCreate.FILTER_QUESTION_HOLDER}
          options={LIST_QUESTION_TYPE_FILTER}
          value={props.typeQuestionSelected}
          onChange={props.changeTypeQuestionSelected}
        />
      </div>
    </div>
  )
}

export default FilterQuestion
