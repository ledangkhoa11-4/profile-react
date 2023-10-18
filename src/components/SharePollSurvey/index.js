import React, { Component } from 'react';
import { reduce } from 'lodash';
import ShareView from './ShareView';
import { INPUT_NAME } from './constant';
import { APIs } from 'services/config';
import { requestAPI } from 'services/utils';

const getSocialConfig = (social) => {
  return reduce(social, (result, social) => {
    result[social] = true;
    return result;
  }, {})
}

class SharePollSurvey extends Component {
  state = {
    [INPUT_NAME.FB]: false
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.social) {
      const state = getSocialConfig(nextProps.social)
      this.setState(state)
    }
  }
  
  componentDidMount() {
    if (this.props.social) {
      const state = getSocialConfig(this.props.social)
      this.setState(state)
    }
  }

  onChange = (e) => {
    const { target } = e;
    
    this.setState({
      [target.name]: target.checked,
    })
  }

  submitShare = (isShowPageLoading = false) => {
    const {
      idPollSurvey,
      shareType,
    } = this.props;
    const { socialShare } = APIs;
    const social = this.getSocialProvider();

    if (!social.length || !idPollSurvey || !shareType) {
      return;
    }
    const dataForm = {
      id: idPollSurvey,
      share: shareType,
      social,
    }

    requestAPI({
      url: socialShare.url,
      method: socialShare.method,
      isShowPageLoading,
      dataForm,
    })
  }

  getSocialProvider() {
    return reduce(this.state, (result, item, key) => {
      if (item === true) {
        result.push(key)
      }
      return result
    }, [])
  }

  render() {
    return (
      <ShareView
        onChange={this.onChange}
        formState={this.state}
      />
    );
  }
}

SharePollSurvey.defaulProps = {
  hasControlButton: false,
  hasTitle: false,
  idPollSurvey: '',
  shareType: '', // 'poll/survey'
}

export default SharePollSurvey;
