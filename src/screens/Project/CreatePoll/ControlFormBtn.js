import React from 'react';
import CheckboxSettingForm from './CheckBoxSettingForm';
import { INPUT_NAME } from '../constant';
import Modal from 'react-responsive-modal';
import CustomDatetimePicker from 'components/CustomDatetimePicker';
import moment from 'moment';
import { POLL_SURVEY_STATUS } from 'services/constant';
const {
  FROM_DATE,
} = INPUT_NAME;
const {
  APPROVED,
  DRAFT,
  SCHEDULED,
} = POLL_SURVEY_STATUS;
const ControlFormBtn = (props) => {

  return(
    <div className="div-box box-btn-poll">
        <div className="box-main-setting">
          <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-8 col-lg-9">
                <CheckboxSettingForm
                  checkboxSetting={{
                    [INPUT_NAME.VIEW_RESULT]: props.fromState.pollInfo[INPUT_NAME.VIEW_RESULT],
                    [INPUT_NAME.VIEW_SOCIAL]: props.fromState.pollInfo[INPUT_NAME.VIEW_SOCIAL],
                  }}
                />
              </div>
              <div className="col-xs-12 col-sm-12 col-md-4 col-lg-3">
                <div className="dropdown dropdown-action-poll-survey">
                  <div className="box-btn-launch-poll">
                    <a
                      className="btn btn-primary"
                      onClick={() => props.savePoll(APPROVED, props.isDisableEdit)}
                    >
                      {
                        props.isDisableEdit ?
                          props.localeCommon.SAVE
                        :
                          props.localeCommon.LAUNCH
                      }
                    </a>
                    {
                      !props.isDisableEdit ?
                        <a className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                          <span className="fa fa-angle-down"></span>
                        </a>
                      : 
                      null
                    }
                    {
                      !props.isDisableEdit ?
                        <ul className="dropdown-menu">
                          <li>
                            <a 
                              onClick={props.togggleModalSchedule}
                            >
                              {props.localeCreate.Button_Schedule}
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() => props.savePoll(DRAFT, props.isDisableEdit)}
                            >
                              {props.localeCreate.Button_Save_Draft}
                            </a>
                          </li>
                        </ul>
                      :
                        null
                    }
                  </div>
                </div>
              </div>
              <Modal
                  open={props.fromState.isShowModalSchedule}
                  onClose={props.togggleModalSchedule}
                  showCloseIcon={true}
                  classNames={{
                      overlay: 'Modal-overlay-0-1 modal-schedule-poll',
                      modal: 'Modal-modal-0-3',
                      closeIcon: 'Modal-closeIcon-0-4'
                  }}
              >
                <div className="main-modal-schedule-poll">
                  <div className="title">
                    {props.localeCreate.title_popup_choose_from_date}
                  </div>
                  <div className="chosse-from-date">
                    <CustomDatetimePicker
                      id={FROM_DATE}
                      name={FROM_DATE}
                      dateFormat="DD-MM-YYYY HH:mm"
                      minDate={moment()}
                      maxDate={props.fromState.maxDate}
                      selected={moment(props.fromState[FROM_DATE])}
                      onChange={(val) => props.onChangeFromdate(val)
                      }
                      calendarClassName="custom"
                    />
                  </div>
                  <div className="btn-group row">
                      <a 
                        className="btn"
                        onClick={props.togggleModalSchedule}
                      >
                        {props.localeCreate.messages_cancel}
                      </a>
                      <a
                        className="btn"
                        onClick={() => props.savePoll(SCHEDULED, props.isDisableEdit)}
                      >
                        {props.localeCreate.Button_Schedule}
                      </a>
                  </div>
                </div>
              </Modal>
          </div>
        </div>
    </div>
  )
}

export default ControlFormBtn;
