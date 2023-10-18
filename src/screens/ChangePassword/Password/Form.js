import React from 'react';
import { Field, reduxForm } from 'redux-form';
import {
  renderInputField,
  VALIDATION,
} from 'services/utils';
import { INPUT_NAME } from 'services/constant';

const { PASSWORD_FORM } = INPUT_NAME;
function reloadpage(){
  window.location.reload();
}
let PasswordForm = (props) => {
  const {
    handleSubmit,
    localeProfile,
    localeCommon,
  } = props;
  
  const {
    required,
    // password,
  } = VALIDATION;
  return (
    <form
      name="infor"
      noValidate={true}
      autoComplete="off"
      className="form"
      onSubmit={handleSubmit}
    >
      <div className="input-right">
          <label htmlFor={PASSWORD_FORM.CURRENT_PASS}>
               {localeProfile.CURRENT_PW}
          </label>
          <Field
            name={PASSWORD_FORM.CURRENT_PASS}
            component={renderInputField}
            type="password"
            className="input form-control"
            validate={[required]}
          />
          <label htmlFor={PASSWORD_FORM.NEW_PASS}>
            {localeProfile.NEW_PW}
            </label>
            <Field
              name={PASSWORD_FORM.NEW_PASS}
              component={renderInputField}
              className="input form-control"
              type="password"
              validate={[required]}
            />
            <label htmlFor={PASSWORD_FORM.CONFIRM_PASS}>
               {localeProfile.CONFIRM_PW}
            </label>
            <Field
              name={PASSWORD_FORM.CONFIRM_PASS }
              component={renderInputField}
              className="input form-control"
              type="password"
              validate={[required]}
            />
      </div>
      <div className="button-setting">
          <button className="btn-reset" onClick={reloadpage} >{localeCommon.CANCEL}</button>
          <button type="submit" className="btn-save" name="save">{localeCommon.SAVE}</button>
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
    //         <label htmlFor={PASSWORD_FORM.CURRENT_PASS}>
    //           {localeProfile.CURRENT_PW}
    //         </label>
    //         <Field
    //           name={PASSWORD_FORM.CURRENT_PASS}
    //           component={renderInputField}
    //           type="password"
    //           className="input"
    //           validate={[required]}
    //         />
    //       </div>
    //     </div>
    //   </div>
    //   <div className="form-group">
    //     <div className="row">
    //       <div className="col-xs-12">
    //         <label htmlFor={PASSWORD_FORM.NEW_PASS}>
    //           {localeProfile.NEW_PW}
    //         </label>
    //         <Field
    //           name={PASSWORD_FORM.NEW_PASS}
    //           component={renderInputField}
    //           className="input"
    //           type="password"
    //           validate={[required]}
    //         />
    //       </div>
    //     </div>
    //   </div>
    //   <div className="form-group">
    //     <div className="row">
    //       <div className="col-xs-12">
    //         <label htmlFor={PASSWORD_FORM.CONFIRM_PASS}>
    //           {localeProfile.CONFIRM_PW}
    //         </label>
    //         <Field
    //           name={PASSWORD_FORM.CONFIRM_PASS }
    //           component={renderInputField}
    //           className="input"
    //           type="password"
    //           validate={[required]}
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

PasswordForm = reduxForm({
  form: 'password',
  touchOnBlur: false,
})(PasswordForm);

export default PasswordForm;
