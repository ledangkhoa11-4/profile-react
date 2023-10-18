import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { cloneDeep, map } from 'lodash';
import Alert from 'react-s-alert';
import Layout from 'components/Layout';
import Thankyou from './Thankyou';
import { updatePageTitle } from 'actions/ui';
import { APIs } from 'services/config';
import { requestAPI } from 'services/utils';

const localeThankyou = window.locale.ThankYou;
const localeCommon = window.locale.Common;

class ThankyouContent extends Component {
  state = {
    ratingData: [],
  }
  
  componentWillMount () {
    this.props.updatePageTitle(localeCommon.SURVEY_THANKS_PAGE)
    this.getUserRating()
  }

  getUserRating() {
    const { getRatingData } = APIs.survey;
    const surveyId = this.props.surveyId || this.props.match.params.surveyId;
    
    requestAPI({
      url: getRatingData.url.replace('{surveyId}', surveyId),
      method: getRatingData.method,
    }).then(res => {
      if (res.success) {
        const data = res.data;
        const ratingData = map(data.rate, item => {
          item.rating =  item.rating ?
            parseInt(parseInt(item.rating, 10) / data.thank_count, 10) : 0;
          return item;
        })
        this.setState({ ratingData })
      }
    })
  }

  onChangeRating = (number, index) => {
    const cloneRatingData = cloneDeep(this.state.ratingData)
    const ratingItem = cloneRatingData[index];
    ratingItem.rating = number;
    this.setState({ ratingData: cloneRatingData })
  }

  onVoteSurvey = () => {
    const surveyId = this.props.surveyId || this.props.match.params.surveyId;
    const { ratingData } = this.state;
    const { updateRatingDate } = APIs.survey;
    const formData = {
      survey_id: parseInt(surveyId, 10),
      column_1: ratingData[0].rating,
      column_2: ratingData[1].rating,
      column_3: ratingData[2].rating,
      column_4: ratingData[3].rating,
    }
    
    requestAPI({
      url: updateRatingDate.url,
      method: updateRatingDate.method,
      dataForm: formData,
    }).then(res => {
      Alert.success(res.message)
      typeof this.props.successCB === 'function' && this.props.successCB()
    }).catch(error => {
      map(error.message, msg => {
        Alert.error(msg[0], {
          timeout: 5000,
        })
      })
    })
  }
  
  render() {
    const surveyId = this.props.surveyId || this.props.match.params.surveyId
    return (
      <Thankyou
        changeRating={this.onChangeRating}
        ratingData={this.state.ratingData}
        onVoteSurvey={this.onVoteSurvey}
        localeThankyou={localeThankyou}
        surveyId={parseInt(surveyId, 10)}
        history={this.props.history}
      />
    );
  }
}

ThankyouContent = connect((state, ownProps) => ({
  ...ownProps,
}), {
  updatePageTitle,
})(ThankyouContent)

export {
  ThankyouContent
}

const ThankyouPage = () => {
  return (
    <Layout
      index={6}
      title=""
      mainContent={withRouter(ThankyouContent)}
    />
  )
}

export default ThankyouPage;
