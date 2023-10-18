import React from 'react';
import ListChildrenTarget from './ListChildrenTarget';
import ModalTargetOtion from './ModalTargetOption';
import ModalSaveShowTarget from './ModalSaveShowTarget';

const TargetOption = (props) => {
  return (
    <div className="wrap-target box-group-target">
      <div className="group-target">
        <a className="title-group" role="button">
          {props.localeCreate.TITLE_GROUP_TARGET} {` ${props.index + 1}`}
        </a>
        <a 
          className="remove-group-target"
          onClick={() => {
            props.openModalConfirm(props.index)
          }}
        >
          <img src={require('assets/images/x-mark-01.png')} />
        </a>
        <div>
          <ListChildrenTarget {...props} />
        </div>
        <div className="box-toggle-expand-save-target">
          <a className="toggle-expand-save-target" onClick={props.onToggleTargetForm}>
              <span className='fa fa-plus'/>
              <span className="text">&nbsp;{props.localeCreate.messages_add_survey_subjects}</span>
          </a>
        </div>
      </div>
      {
        props.formState.isExpandTargetForm ?
          <ModalTargetOtion {...props} />
        : null
      }
      {
        props.formState.isExpandTargetModal ?
          <ModalSaveShowTarget {...props} />
        : null
      }
    </div>
  )
}

export default TargetOption;
