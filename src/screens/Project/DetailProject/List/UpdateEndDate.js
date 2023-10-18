import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import moment from 'moment';
import Alert from 'react-s-alert';
import CustomDatetimePicker from 'components/CustomDatetimePicker';
import { INPUT_NAME } from '../../constant';
import { APIs } from 'services/config';
import { convertDateToString, requestAPI } from 'services/utils';
import { forEach } from 'lodash';
import 'react-datepicker/dist/react-datepicker.css';
const {
  FROM_DATE,
  TO_DATE,
} = INPUT_NAME;

const localeCommon = window.locale.Common;
const localeCreate = window.locale.Create;

class UpdateEndDate extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
      [TO_DATE]: moment(props.item[TO_DATE]),
    }
  }

  closeModal = () => {
    this.setState({ isOpen: false })
  }

  openModal = () => {
    this.setState({ isOpen: true })
  }

  onChange = (val, name) => {
    this.setState({
      [name]: val,
    })
  }

  updateEndDate = () => {
    const date_end = convertDateToString(this.state[TO_DATE].toDate())
    const { updateEndDate } = this.props.keyPollSurvey === 'poll' ?
      APIs.poll : APIs.survey;
    requestAPI({
      url: updateEndDate.url,
      method: updateEndDate.method,
      dataForm: {
        [`${this.props.keyPollSurvey}_id`]: this.props.item.id,
        date_end,
      }
    }).then(res => {
      Alert.success(res.message)
      typeof this.props.onChangeEndDate === 'function' &&
      this.props.onChangeEndDate(res.data)
    }).catch(error => {
      if(Array.isArray(error.message) || typeof error.message === 'object'){
        forEach(error.message, msg => {
          msg[0] && Alert.error(msg[0]);
        })
      }else{
        Alert.error(error.message);
      }
    });
  }

  render() {
    
    return (
      <Modal
        open={this.state.isOpen}
        onClose={this.closeModal}
        showCloseIcon={true}
        classNames={{
          overlay: 'Modal-overlay-0-1',
          modal: 'Modal-modal-0-3',
          closeIcon: 'Modal-closeIcon-0-4'
        }}
      >
        <div className="box-item">
          <div className="vote-content update-end-date">
            <div>
              <div>
                <div>
                  <h3 className="title">
                    Vui lòng chọn một ngày và giờ để gia hạn cho khảo sát
                  </h3>
                </div>
                <div className="date-form">
                  <CustomDatetimePicker
                    id={TO_DATE}
                    name={TO_DATE}
                    dateFormat="DD-MM-YYYY HH:mm"
                    minDate={moment(this.props.item[FROM_DATE])}
                    selected={moment(this.props.item[TO_DATE])}
                    onChange={(val) => this.onChange(val, TO_DATE)
                    }
                    calendarClassName="custom"
                  />
                </div>
              </div>
              <div>
                <div className="box">
                  <div className="inner">
                    <div className="content text-center">
                      <button
                        type="button"
                        name="Save"
                        className="btn"
                        onClick={this.updateEndDate}
                      >
                        <span className="text">
                          Gia hạn
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default UpdateEndDate;
