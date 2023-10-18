import React from 'react';
import { Field } from 'redux-form';
import {
  renderReactSelect,
  VALIDATION,
  getDateOptions,
  getMonthOptions,
  getYearOptions,
} from 'services/utils';

const monthOptions = getMonthOptions();
const yearOptions = getYearOptions();
monthOptions.unshift({ value: '', label: 'Month' });
yearOptions.unshift({ value: '', label: 'Year' });

const DateMonthYear = (props) => {
  const {
    inputName: INPUT_NAME,
    month,
    year,
    localeProfile,
  } = props;
  const dateOptions = getDateOptions(month, year);
  dateOptions.unshift({ value: '', label: 'Date' });

  return (
    <div>
      <div className="row">
        <div className="col-xs-12">
            <label htmlFor={INPUT_NAME.DATE}>
              {localeProfile.BIRTHDAY}
            </label>
          </div>
        </div>
      <div className="row select-birthday">
        <div className="col-xs-4">
          <Field
            id={INPUT_NAME.DATE}
            name={INPUT_NAME.DATE}
            options={dateOptions}
            component={renderReactSelect}
            validate={[VALIDATION.required]}
          />
        </div>
        <div className="col-xs-4">
          <Field
            id={INPUT_NAME.MONTH}
            name={INPUT_NAME.MONTH}
            options={monthOptions}
            component={renderReactSelect}
            validate={[VALIDATION.required]}
          />
        </div>
        <div className="col-xs-4">
          <Field
            id={INPUT_NAME.YEAR}
            name={INPUT_NAME.YEAR}
            options={yearOptions}
            component={renderReactSelect}
            validate={[VALIDATION.required]}
          />
        </div>
      </div>
    </div>
    
  )
}

export default DateMonthYear;
