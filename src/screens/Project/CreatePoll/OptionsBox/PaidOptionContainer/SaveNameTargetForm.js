import React from 'react';
import { INPUT_NAME } from '../../../constant';

const localeCommon = window.locale.Common;
const { TARGET_NAME } = INPUT_NAME;

const SaveNameTargetForm = (props) => {
  return (
    <div className="save-target-form">
      <div className="row">
        {
          props.formState.isExpandTargetForm ?
            <div className="col-sm-6">
              <a
                role="button"
                className="toggle-expand-save-target"
                onClick={props.toggleExpandSavingTarget}
              >
                <span className={
                  props.formState.isExpandSavingTarget ?
                    'fa fa-minus' : 'fa fa-plus'
                } />
                &nbsp;
                <span className="text">
                  {
                      props.formState.isExpandSavingTarget ? props.localeCreate.COLLAPSE_SAVE_TARGET_BUTTON :
                      props.localeCreate.EXPAND_SAVE_TARGET_BUTTON
                  }
                </span>
              </a>
            </div> : null
        }
      </div>
      {
        props.formState.isExpandSavingTarget ?
          <div className="row">
            <div className="col-xs-7 col-sm-8">
              <input
                name={TARGET_NAME}
                className="input"
                placeholder={props.localeCreate.TARGET_NAME}
                value={props.formState[TARGET_NAME]}
                onChange={props.onChangeInputText}
              />
              {
                !props.formState.isValidTargetName ?
                  <span className="placeholder-error">
                    {localeCommon.REQUIRED_FIELD_MSG}
                  </span> : null
              }
            </div>
            <div className="col-xs-5 col-sm-4 text-right">
              <button type="button" name="save" className="btn full " onClick={props.saveTarget}>
                <span className="material-icons">save </span>
                <span className="text">
                  {props.localeCreate.TARGET_SAVE}
                </span>
              </button>
            </div>
          </div> : null
      }
    </div>
  )
}

export default SaveNameTargetForm;
