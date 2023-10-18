import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty, reduce } from 'lodash';
// import PropTypes from 'prop-types';
import Layout from 'components/Layout';
import Setting from './Setting';
import { updatePageTitle } from 'actions/ui';
import { APIs } from 'services/config';
import { requestAPI } from 'services/utils';

const localeCommon = window.locale.Common;
const localeSetting = window.locale.Setting;

function groupSettings(data) {
  return reduce(data, (result, value, idx) => {
    if (!result[value.group]) {
      result[value.group] = {};
    }
    result[value.group][value.id] = value;
    return result;
  }, {})
}

class PreferenceContent extends Component {
  state = {
    settings: {},
  }

  componentWillMount () {
    this.props.updatePageTitle(localeCommon.SETTING_PAGE)
    this.getSettings()
  }

  getSettings() {
    const { getSettings } = APIs.setting;
    requestAPI({
      url: getSettings.url,
      method: getSettings.method,
    }).then(res => {
      if (res.success) {
        const settings = groupSettings(res.data)
        this.setState({ settings })
      }
    })
  }

  setSettings(setting, settingId) {
    const { setSettings } = APIs.setting;
    const action = setting ? 'activate' : 'deactivate';

    requestAPI({
      url: setSettings.url,
      method: setSettings.method,
      isShowPageLoading: false,
      dataForm: {
        action,
        setting_id: settingId,
      }
    })
  }

  onChangeSetting = (target, settingId) => {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.setSettings(target.checked, settingId)
    }, 500)
  }

  render() {
    if (isEmpty(this.state.settings)) {
      return null
    }

    return (
      <div>
        <Setting
          settings={this.state.settings}
          localeSetting={localeSetting}
          onChangeSetting={this.onChangeSetting}
        />
      </div>
    );
  }
}

PreferenceContent = connect((state, ownProps) => ({
  ...ownProps,
}), {
  updatePageTitle,
})(PreferenceContent)

// Preference.propTypes = {

// };

const Preference = () => {
  return (
    <Layout
      index={8}
      title="Preference"
      mainContent={PreferenceContent}
      menuIcon="settings"
    />
  )
}

export default Preference;
