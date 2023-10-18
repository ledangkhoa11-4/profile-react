import React from 'react';
import Select from 'react-select';
import { INPUT_NAME } from 'services/constant';

const localePoll = window.locale.Poll;
const {
  EXPIRED,
} = INPUT_NAME.FORM_SORT_POLL;

const FilterForm = (props) => {
  const {
    expiredStatus,
    categories,
    category,
    changeCategory,
    localeSurvey,
    changeExpiredStatus,
  } = props;
  const options = categories.map(category => ({
    value: category.id,
    label: category.name,
  }))

  return (
    <div className="box-filter">
      <div className="inner">
        <form name="filter" className="form">
          <div className="row">
            <div className="col-sm-6">
              <label>
                {localeSurvey.CATEGORY_TITLE}
              </label>
              <Select
                name="filter-survey-category"
                options={options}
                value={category}
                onChange={changeCategory}
                className="custom-select"
                clearable={false}
                searchable={false}
                placeholder={localeSurvey.SELECT}
              />
            </div>
            <div className="col-sm-6">
              <label htmlFor={EXPIRED} className="label">
                {localePoll.EXPIRED}
              </label>
              <Select
                name={EXPIRED}
                value={expiredStatus}
                options={[
                  { value: 'yes', label: localePoll.EXPIRED_YES },
                  { value: 'no', label: localePoll.EXPIRED_NO }
                ]}
                searchable={false}
                clearable={false}
                onChange={changeExpiredStatus}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FilterForm;
