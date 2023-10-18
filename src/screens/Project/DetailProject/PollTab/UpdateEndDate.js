import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import moment from 'moment';
import Alert from 'react-s-alert';
import CustomDatePicker from 'components/CustomDatePicker';
import { INPUT_NAME } from '../../constant';
import { APIs } from 'services/config';
import { convertDateToString, requestAPI } from 'services/utils';

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
      if (!res.success) {
        console.log(res)
      }
      Alert.success(res.message)

      typeof this.props.onChangeEndDate === 'function' &&
      this.props.onChangeEndDate(res.data)
    })
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
          <div className="head min-height-55">
            <div className="title">
              <h3>{ this.props.item.name }</h3>
            </div>
          </div>
          <div className="vote-content update-end-date">
            {/* <div className="row">
              <div className="col-sm-6">
                <p className="label">
                  {localeCreate.FROM_DATE}
                </p>
                <div className="date-form">
                  <CustomDatePicker
                    id={FROM_DATE}
                    name={FROM_DATE}
                    selected={moment(this.props.item[FROM_DATE])}
                    dateFormat="DD-MM-YYYY HH:mm"
                    disabled={true}
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <p className="label">
                  {localeCreate.TO_DATE}
                </p>
                <div className="date-form">
                  <CustomDatePicker
                    id={TO_DATE}
                    name={TO_DATE}
                    dateFormat="DD-MM-YYYY HH:mm"
                    minDate={moment(this.props.item[FROM_DATE])}
                    selected={moment(this.props.item[TO_DATE])}
                    onChange={(val) => this.onChange(val, TO_DATE)}
                    calendarClassName="last"
                  />
                </div>
              </div>
            </div> */}
            <p className="label">
              {localeCreate.TO_DATE}
            </p>
            <div className="date-form" style={{ width: 300 }}>
              <CustomDatePicker
                id={TO_DATE}
                name={TO_DATE}
                dateFormat="DD-MM-YYYY HH:mm"
                minDate={moment(this.props.item[FROM_DATE])}
                selected={moment(this.props.item[TO_DATE])}
                onChange={(val) => this.onChange(val, TO_DATE)}
                calendarClassName="last"
              />
            </div>
            <div className="box top-line">
              <div className="inner">
                <div className="content text-center">
                  <button
                    type="button"
                    name="Save"
                    className="btn"
                    onClick={this.updateEndDate}
                  >
                    <span className="material-icons">poll</span>
                    <span className="text">
                      { localeCommon.SAVE }
                    </span>
                  </button>
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
