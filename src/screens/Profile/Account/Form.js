import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import Image from './image';
import { genderOpt } from 'services/config';
import {
  renderInputField,
  renderReactSelect,
  VALIDATION,
} from 'services/utils';
import {
  CURRENCY_VAL,
  INPUT_NAME,
} from 'services/constant';
import DateMonthYear from './DateMonthYear';

const { ACCOUNT_FORM } = INPUT_NAME;
function reloadpage(){
  window.location.reload();
}
let AccountForm = (props) => {
  const {
    handleSubmit,
    optionsSelect,
    date,
    month,
    year,
    localeProfile,
    localeCommon,
    isVerifiedEmail,
    isVerifiedPhone,
  } = props;
  const {
    required,
    digit,
    email,
  } = VALIDATION;
  return (
    <form action="" className="form-setting form" name="infor" noValidate={true} autoComplete="off" onSubmit={handleSubmit}>
          <div className="row">
              <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 padding-right-50">
                  <div className="setting-account">
                      <label htmlFor={ACCOUNT_FORM.NAME}>{localeProfile.NAME}</label>
                      <Field
                        id={ACCOUNT_FORM.NAME}
                        name={ACCOUNT_FORM.NAME}
                        component={renderInputField}
                        className="input form-control"
                        type="text"
                        validate={[required]}
                      />
                      <label htmlFor={ACCOUNT_FORM.EMAIL}>{localeProfile.EMAIL}</label>
                      <Field
                        id={ACCOUNT_FORM.EMAIL}
                        name={ACCOUNT_FORM.EMAIL}
                        component={renderInputField}
                        type="email"
                        className="input form-control"
                        readOnly={isVerifiedEmail}
                        validate={[required, email]}
                      />
                      <label htmlFor={ACCOUNT_FORM.GENDER}>
                        {localeProfile.GENDER}
                      </label>
                      <Field
                        id={ACCOUNT_FORM.GENDER}
                        name={ACCOUNT_FORM.GENDER}
                        options={genderOpt}
                        className="form-control"
                        component={renderReactSelect}
                        validate={[required]}
                      />
                      <DateMonthYear
                      localeProfile={localeProfile}
                      inputName={ACCOUNT_FORM}
                      date={date}
                      month={month}
                      year={year}
                      />
                  </div>
              </div>
              <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 padding-left-50">
                  <div className="setting-account">
                      <label htmlFor={ACCOUNT_FORM.PHONE}>
                        {localeProfile.PHONE}
                      </label>
                      <Field
                        id={ACCOUNT_FORM.PHONE}
                        name={ACCOUNT_FORM.PHONE}
                        component={renderInputField}
                        type="text"
                        className="input form-control"
                        validate={[required, digit]}
                        readOnly={isVerifiedPhone}
                      />
                      <label htmlFor={ACCOUNT_FORM.ADDRESS}>{localeProfile.ADDRESS}</label>
                      <Field
                        id={ACCOUNT_FORM.ADDRESS}
                        name={ACCOUNT_FORM.ADDRESS}
                        component={renderInputField}
                        type="text"
                        className="input form-control"
                        validate={[required]}
                      />
                      <label htmlFor={ACCOUNT_FORM.CITY}>{localeProfile.CITY}</label>
                      <Field
                        id={ACCOUNT_FORM.CITY}
                        name={ACCOUNT_FORM.CITY}
                        options={optionsSelect.city}
                        component={renderReactSelect}
                        validate={[required]}
                      />
                      <label htmlFor={ACCOUNT_FORM.NATION}>
                        {localeProfile.NATION}
                      </label>
                      <Field
                          id={ACCOUNT_FORM.NATION}
                          name={ACCOUNT_FORM.NATION}
                          options={optionsSelect.nation}
                          component={renderReactSelect}
                          validate={[required]}
                        />
                      <div className="button-setting">
                          <button className="btn-reset" onClick={reloadpage} >{localeCommon.CANCEL}</button>
                          <button type="submit" className="btn-save" name="save" >{localeCommon.SAVE}</button>
                      </div>
                  </div>
              </div>
          </div>
      </form>
    // <form
    //   name="infor"
    //   noValidate={true}
    //   autoComplete="off"
    //   className="form"
    //   onSubmit={handleSubmit}
    // >
    //   <div className="form-group">
    //     <div className="row">
    //       <div className="col-xs-12">
    //         <label htmlFor={ACCOUNT_FORM.NAME}>
    //           {localeProfile.NAME}
    //         </label>
    //         <Field
    //           id={ACCOUNT_FORM.NAME}
    //           name={ACCOUNT_FORM.NAME}
    //           component={renderInputField}
    //           className="input"
    //           type="text"
    //           validate={[required]}
    //         />
    //       </div>
    //     </div>
    //   </div>
    //   <div className="form-group">
    //     <DateMonthYear
    //       localeProfile={localeProfile}
    //       inputName={ACCOUNT_FORM}
    //       date={date}
    //       month={month}
    //       year={year}
    //     />
    //   </div>
    //   <div className="form-group">
    //     <div className="row">
    //       <div className="col-xs-4">
    //         <label htmlFor={ACCOUNT_FORM.GENDER}>
    //           {localeProfile.GENDER}
    //         </label>
    //         <Field
    //           id={ACCOUNT_FORM.GENDER}
    //           name={ACCOUNT_FORM.GENDER}
    //           options={genderOpt}
    //           component={renderReactSelect}
    //           validate={[required]}
    //         />
    //       </div>
    //       <div className="col-xs-4">
    //         <label htmlFor={ACCOUNT_FORM.EMAIL}>
    //           {localeProfile.EMAIL}
    //         </label>
    //         <Field
    //           id={ACCOUNT_FORM.EMAIL}
    //           name={ACCOUNT_FORM.EMAIL}
    //           component={renderInputField}
    //           type="email"
    //           className="input"
    //           readOnly={isVerifiedEmail}
    //           validate={[required, email]}
    //         />
    //       </div>
    //       <div className="col-xs-4">
    //         <label htmlFor={ACCOUNT_FORM.PHONE}>
    //           {localeProfile.PHONE}
    //         </label>
    //         <Field
    //           id={ACCOUNT_FORM.PHONE}
    //           name={ACCOUNT_FORM.PHONE}
    //           component={renderInputField}
    //           type="text"
    //           className="input"
    //           validate={[required, digit]}
    //           readOnly={isVerifiedPhone}
    //         />
    //       </div>
    //     </div>
    //   </div>
    //   <div className="form-group">
    //     <div className="row">
    //       <div className="col-xs-12">
    //         <label htmlFor={ACCOUNT_FORM.ADDRESS}>
    //           {localeProfile.ADDRESS}
    //         </label>
    //         <Field
    //           id={ACCOUNT_FORM.ADDRESS}
    //           name={ACCOUNT_FORM.ADDRESS}
    //           component={renderInputField}
    //           type="text"
    //           className="input"
    //           validate={[required]}
    //         />
    //       </div>
    //     </div>
    //   </div>
    //   <div className="form-group">
    //     <div className="row">
    //       <div className="col-sm-6">
    //         <label htmlFor={ACCOUNT_FORM.CITY}>
    //           {localeProfile.CITY}
    //         </label>
    //         <Field
    //           id={ACCOUNT_FORM.CITY}
    //           name={ACCOUNT_FORM.CITY}
    //           options={optionsSelect.city}
    //           component={renderReactSelect}
    //           validate={[required]}
    //         />
    //       </div>
    //       <div className="col-sm-6">
    //         <label htmlFor={ACCOUNT_FORM.NATION}>
    //           {localeProfile.NATION}
    //         </label>
    //         <Field
    //           id={ACCOUNT_FORM.NATION}
    //           name={ACCOUNT_FORM.NATION}
    //           options={optionsSelect.nation}
    //           component={renderReactSelect}
    //           validate={[required]}
    //         />
    //       </div>
    //     </div>
    //   </div>
    //   <div className="form-group">
    //     <div className="row">
    //       <div className="col-xs-6">
    //         <label htmlFor={ ACCOUNT_FORM.TIMEZONE }>
    //           { localeProfile.TIMEZONE }
    //         </label>
    //         <Field
    //           id={ ACCOUNT_FORM.TIMEZONE }
    //           name={ ACCOUNT_FORM.TIMEZONE }
    //           options={optionsSelect.listTimezone}
    //           component={renderReactSelect}
    //           validate={[required]}
    //         />
    //       </div>
    //       <div className="col-xs-6">
    //         <label htmlFor={ ACCOUNT_FORM.CURRENCY }>
    //           { localeProfile.CURRENCY }
    //         </label>
    //         <Field
    //           id={ ACCOUNT_FORM.CURRENCY }
    //           name={ ACCOUNT_FORM.CURRENCY }
    //           options={CURRENCY_VAL}
    //           component={renderReactSelect}
    //           validate={[required]}
    //         />
    //       </div>
    //     </div>
    //   </div>
    //   <div className="form-group">
    //     <div className="row">
    //       <div className="col-xs-12">
    //         <label htmlFor={ACCOUNT_FORM.STATUS}>
    //           {localeProfile.STATUS}
    //         </label>
    //         <Field
    //           id={ACCOUNT_FORM.STATUS}
    //           name={ACCOUNT_FORM.STATUS}
    //           component="textarea"
    //           className="input"
    //         />
    //       </div>
    //     </div>
    //   </div>
    //   <div className="form-btn text-right">
    //     <ul>
    //       <li>
    //         <button type="submit" name="save" className="btn">
    //           <span className="material-icons">&#xE161;</span>
    //           <span className="text">{localeCommon.SAVE}</span>
    //         </button>
    //       </li>
    //     </ul>
    //   </div>
    // </form>
  )
}

AccountForm = reduxForm({
  form: 'account',
  enableReinitialize: true,
  touchOnBlur: false,
})(AccountForm);

const selector = formValueSelector('account');
const mapStateToProps = (state) => {
  const {
    day,
    month,
    year,
  } = selector(state, ACCOUNT_FORM.DAY, ACCOUNT_FORM.MONTH, ACCOUNT_FORM.YEAR);

  return {
    day,
    month,
    year,
  };
};
AccountForm = connect(
  mapStateToProps
)(AccountForm);

export default AccountForm;
