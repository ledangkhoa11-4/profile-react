import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  jsonEqual,
  requestAPI,
} from 'services/utils';
import { APIs } from 'services/config';
import {
  updateUserInfo,
} from 'actions/requestAPIsAction';
import { INPUT_NAME } from 'services/constant';
import AccountForm from './Form';

const { ACCOUNT_FORM } = INPUT_NAME;

const parseUserData = (data) => {
  const {
    name,
    birthday,
    email,
    phone,
    address,
    city,
    nation,
    description,
    gender,
    currency,
    timezone,
  } = data;

  const dateTime = birthday ? new Date(birthday) : '';
  let date = '',
      month = '',
      year = '';
  if (dateTime) {
    date = dateTime.getDate();
    month = dateTime.getMonth() + 1;
    year = dateTime.getFullYear();
  }

  return {
    [ACCOUNT_FORM.NAME]: name || '',
    [ACCOUNT_FORM.DATE]: date,
    [ACCOUNT_FORM.MONTH]: month,
    [ACCOUNT_FORM.YEAR]: year,
    [ACCOUNT_FORM.EMAIL]: email || '',
    [ACCOUNT_FORM.PHONE]: phone || '',
    [ACCOUNT_FORM.ADDRESS]: address || '',
    [ACCOUNT_FORM.CITY]: city || '',
    [ACCOUNT_FORM.NATION]: nation || '',
    [ACCOUNT_FORM.STATUS]: description || '',
    [ACCOUNT_FORM.GENDER]: gender || '',
    [ACCOUNT_FORM.TIMEZONE]: timezone || '',
    [ACCOUNT_FORM.CURRENCY]: currency || ','
  };
}

class Account extends Component {
  state = {
    listCity: [],
    listTimezone: []
  }

  onSubmitBasicInfo = (values) => {
    if (jsonEqual(values, this.props.user)) {
      return false;
    }

    const dataForm = Object.assign({}, values);
    let { date, month, year } = dataForm;
    date = ('0' + date).slice(-2);
    month = ('0' + month).slice(-2);
    dataForm.birthday = `${year}-${month}-${date}`;

    if (
      this.props.user.verified ||
      this.props.user.email === dataForm.email
    ) {
      delete dataForm.email;
    }
    if (
      this.props.user.verified_phone ||
      this.props.user.phone === dataForm.phone
    ) {
      delete dataForm.phone
    }

    delete dataForm.date;
    delete dataForm.month;
    delete dataForm.year;
    if (!dataForm.description) {
      delete dataForm.description;
    }
    this.props.updateUserInfo(dataForm);
  }

  componentWillMount() {
    this.getListCity();
    this.getListTimezone();
  }

  getListCity() {
    requestAPI({
      url: APIs.poll.getListCity.url,
      method: APIs.poll.getListCity.method,
    }).then(res => {
      if (res.success) {
        const listCity = res.data.map(city => ({
          value: city.city_id,
          label: city.vietnamese,
        }));
        this.setState({
          listCity,
        });
      }
    })
  }

  getListTimezone() {
    requestAPI({
      url: APIs.listTimezone.url,
      method: APIs.listTimezone.method,
    }).then(res => {
      const listTimezone = res.map(timezone => ({
        value: timezone,
        label: timezone
      }))

      this.setState({ listTimezone })
    })
  }
  
  render() {
    const { user } = this.props
    const formData = parseUserData(user);
    return (
      <div className="box-main-setting" id="box-main-2">
          <div className="box-setting-profle-contain" id="box-setting-profle-contain">
              <p>{this.props.localeProfile.BASIC_TITLE}</p>
              <div className="line-setting">
              </div>
              <AccountForm
                localeProfile={this.props.localeProfile}
                localeCommon={this.props.localeCommon}
                onSubmit={this.onSubmitBasicInfo}
                initialValues={formData}
                optionsSelect={{
                  city: this.state.listCity,
                  nation: [
                    { value: 'Viet Nam', label: 'Viet Nam' },
                  ],
                  listTimezone: this.state.listTimezone
                }}
                isVerifiedEmail={user && user.verified}
                isVerifiedPhone={user && user.verified_phone}
                user={user}
              />
          </div>
      </div>
    );
  }
}

Account.propTypes = {
  user: PropTypes.object,
  updateUserInfo: PropTypes.func,
}

Account = connect(state => ({
  user: state.user,
}), {
  updateUserInfo,
})(Account);

export default Account;
