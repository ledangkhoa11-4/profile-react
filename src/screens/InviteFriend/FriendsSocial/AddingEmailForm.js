import React, { Component } from 'react';
import { filter } from 'lodash';
import Alert from 'react-s-alert';
import { APIs, REGEX } from 'services/config';
import { requestAPI } from 'services/utils';
import AddingEmailList from './AddingEmailList';

const PHONE_EMAIL_NAME = 'phone-email';
const {
  requestInvitingByEmail,
  requestInvitingByPhone,
} = APIs.friends;

class AddingEmailFormContainer extends Component {
  constructor(props) {
    super(props);
    this.state =  {
      list: [],
      [PHONE_EMAIL_NAME]: '',
    };

    // 1 -> email
    // 0 -> phone
    this.type = this.props.provider.toLowerCase().indexOf('email') > -1 ?
                  1 : 0;
  }

  onSubmit = (e) => {
    e.preventDefault();
    const validateFunc = this.type === 1 ? 
                          this.validateEmail.bind(this) :
                          this.validatePhone.bind(this);

    if (!validateFunc(this.state[PHONE_EMAIL_NAME])) {
      const msg = this.props.provider.toLowerCase().indexOf('email') > -1 ?
                    this.props.localeNetwork.EMAIL_ERROR :
                    this.props.localeNetwork.PHONE_ERROR;
      Alert.error(msg, {
        timeout: 5000
      });
      return;
    }

    if (this.state.list.length > 9) {
      Alert.error(`${this.props.localeNetwork.MAX_COUNT_ERROR} 10`);
      return;
    }

    this.updateListData(this.state[PHONE_EMAIL_NAME]);
  }

  onChangeEmail = (e) => {
    this.setState({
      [PHONE_EMAIL_NAME]: e.target.value,
    });
  }

  validateEmail(email) {
    let isValid = true;
    isValid = !!email.match(REGEX.EMAIL);
    if (this.state.list.indexOf(this.state[PHONE_EMAIL_NAME]) > -1) {
      isValid = false;
    }

    return isValid;
  }

  validatePhone(phone) {
    let isValid = true;

    isValid = !!phone.match(REGEX.DIGIT);
    if (phone.length < 10 || phone.length > 12) {
      isValid = false;
    }

    return isValid;
  }

  updateListData(phoneEmail) {
    this.setState({
      [PHONE_EMAIL_NAME]: '',
      list: this.state.list.concat(phoneEmail),
    });
  }

  removeItem = (index) => {
    const newList = filter(this.state.list, (item, idx) => idx !== index);
    this.setState({ list: newList });
  }

  sendPhoneEmail = () => {
    let provider = requestInvitingByPhone;
    let key = 'phone';

    if (this.type === 1) {
      provider = requestInvitingByEmail;
      key = 'email';
    }

    requestAPI({
      url: provider.url,
      method: provider.method,
      dataForm: {
        [key]: this.state.list,
      },
    }).then(res => {
      this.setState({ list: [] }, () => {
        this.props.onAfterInvitingPhoneEmail(res.data)
      })
    })
  }

  render() {
    const { localeNetwork } = this.props;
    return (
      <div className="list email">
        <form onSubmit={this.onSubmit} noValidate={true} className="form form-find">
          <label htmlFor={PHONE_EMAIL_NAME}>
            {
              this.type === 1 ?
                `${localeNetwork.ADD_EMAIL}: ` : `${localeNetwork.ADD_PHONE}: `
            }
          </label>
          <div className="row">
            <div className="col-xs-7 col-sm-9">
              <input
                id={PHONE_EMAIL_NAME}
                name={PHONE_EMAIL_NAME}
                type="email"
                className="input"
                value={this.state[PHONE_EMAIL_NAME]}
                onChange={this.onChangeEmail}
              />
            </div>
            <div className="col-xs-5 col-sm-3">
              <button
                title={localeNetwork.ADD}
                className="btn"
              >
                <span className="fa fa-plus"/>
              </button>
            </div>
          </div>
        </form>
        <AddingEmailList
          localeNetwork={localeNetwork}
          items={this.state.list}
          removeItem={this.removeItem}
        />
        {
          this.state.list.length ?
            <div className="see-more">
              <a
                role="button"
                title={localeNetwork.INVITE}
                className="link"
                onClick={this.sendPhoneEmail}
              >
                {localeNetwork.INVITE}
              </a>
            </div> : null
        }
      </div>
    )
  }
}

export default AddingEmailFormContainer;
