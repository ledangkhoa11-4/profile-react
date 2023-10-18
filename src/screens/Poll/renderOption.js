import React from 'react';
import Select from 'react-select';
import {
  cloneDeep,
  map,
} from 'lodash';
import ExtendControlCarousel from '../Project/CreatePoll/OptionsBox/PaidOptionContainer/ExtendControlCarousel';
import {
  INPUT_NAME
} from '../Project/constant';
import {
  genderOpt,
} from 'services/config';

const {
  AGE_FROM,
  AGE_TO,
  GENDER,
  CITY,
  // COUNTRY,
} = INPUT_NAME;
const localeCreate = window.locale.Create;

export function renderCarousel(props) {
  const targetOpt = cloneDeep(props.listTargetOption);
  targetOpt.unshift({ name: localeCreate.BASIC_TITLE });
  const slidesToShow = targetOpt.length > 3 ? 3 : targetOpt.length;

  return <ExtendControlCarousel
    dots={false}
    slidesToShow={slidesToShow}
    slidesToScroll={1}
    onClickPrev={() => {
      if (props.formState.idxActive - 1 >= 0) {
        props.onChangeTabIndex(props.formState.idxActive - 1)
      }
    }}
    onClickNext={() => {
      if (props.formState.idxActive + 1 < targetOpt.length) {
        props.onChangeTabIndex(props.formState.idxActive + 1)
      }
    }}
    heightMode="current"
    shouldRecalculateHeight={true}
  >
    {map(targetOpt, (item, idx) => {
      const classWrapper = props.formState.idxActive === idx ? 'item active' : 'item';
      return (
        <div className={classWrapper} key={idx} style={{
          height: props.hasFixHeightSlider ? 70 : 'auto'
        }}>
          <a
            role="button"
            title={item.name}
            onClick={() => {
              props.onChangeTabIndex(idx);
            }}
            id={`tab-${idx}`}
          >
            <span className="text">{item.name}</span>
          </a>
        </div>
      )
    })}
  </ExtendControlCarousel>
}

export function renderBasicContent(props) {
  return (
    <div className="col-xs-12" key={0}>
      <div className="row">
        <div className="col-xs-6">
          <div className="form-group">
            <label>
              {localeCreate.AGE_FROM}:
            </label>
            <input
              className="input form-control"
              name={AGE_FROM}
              type="number"
              value={props.formState[AGE_FROM]}
              onChange={props.onChangeInputText}
            />
          </div>
        </div>
        <div className="col-xs-6">
          <div className="form-group">
            <label>
              {localeCreate.AGE_TO}:
            </label>
            <input
              className="input form-control"
              name={AGE_TO}
              type="number"
              value={props.formState[AGE_TO]}
              onChange={props.onChangeInputText}
            />
          </div>
        </div>
        <div className="col-xs-6">
          <div className="form-group">
            <label>
              {localeCreate.GENDER}
            </label>
            <Select
              name={GENDER}
              clearable={false}
              searchable={false}
              multi={true}
              removeSelected={false}
              closeOnSelect={false}
              className="custom-select"
              options={genderOpt}
              placeholder={localeCreate.GENDER_HOLDER}
              value={props.formState[GENDER]}
              onChange={props.onChangeGender}
            />
          </div>
        </div>
        <div className="col-xs-6">
          <div className="form-group">
            <label>
              {localeCreate.CITY}
            </label>
            <Select
              name={CITY}
              multi={true}
              removeSelected={false}
              closeOnSelect={false}
              className="custom-select"
              placeholder={localeCreate.CITY_HOLDER}
              options={props.listCityOption}
              value={props.formState[CITY]}
              onChange={props.onChangeCity}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export function renderSpecificTarget(props) {
  if (props.formState.idxActive > props.listTargetOption.length + 2) {
    return null;
  }

  if (props.formState.idxActive === 0) {
    return renderBasicContent(props);
  }

  // first index (0) for the basic
  return map(props.listTargetOption[props.formState.idxActive - 1].question, (item, idx) => {
    
    return (
      <div className="col-xs-6" key={idx}>
        <label>{item.name}</label>
        <Select
          searchable={false}
          clearable={false}
          multi={true}
          closeOnSelect={false}
          removeSelected={false}
          options={parseData(item.answer)}
          className="custom-select"
          onChange={(val) => props.onChangeAnswers(item, val)}
          value={props.formState.answerSelected[item.id]}
          placeholder="Select option"
        />
      </div>
    )
  })
}

export const parseData = (list, valueKey, labelKey) => {
  return list.map(item => ({
    value: item[valueKey] || item.id,
    label: item[labelKey] || item.name,
  }));
}
