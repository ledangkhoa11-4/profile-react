import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-s-alert';
import { isEmpty } from 'lodash';
import TimeAgo from 'react-timeago';
import Countdown from 'components/Countdown';
import ClipboardJS from 'clipboard';
import { findAncestor, checkCoinPollSurvey } from 'services/utils';
class Survey extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isShowPopover: false,
    }
  }

  componentWillMount() {
    document.documentElement.addEventListener('click', this.onClosePopoverOutside, true)
  }

  componentWillUnmount() {
    document.documentElement.removeEventListener('click', this.onClosePopoverOutside, true)
  }

  onClosePopoverOutside = (e) => {
    const linkEl = findAncestor(e.target, '.link')
    
    if (this.state.isShowPopover && !linkEl) {
      this.closePopover()
    }
  }

  openPopover = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    this.setState({ isShowPopover: true })
  }

  closePopover = () => {
    if (this.clipboard && typeof this.clipboard.destroy === 'function') {
      this.clipboard.destroy()
    }
    this.setState({ isShowPopover: false })
  }

  copyLinkToClipBoard = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.closePopover()
  }

  renderGetLinkPopover() {
    if (!this.state.isShowPopover) {
      return null
    }
    const { survey } = this.props
    
    const linkEl = `#_${survey.id}`
    this.clipboard = new ClipboardJS(linkEl, {
      container: linkEl,
      text: (trigger) => {
        return trigger.getAttribute('data-href')
      }
    })

    return (
      <div className="wrapper-get-link">
        <a
          id={`_${survey.id}`}
          role="button"
          data-href={survey.shareSocial}
          className="link" onClick={this.copyLinkToClipBoard}
          data-clipboard-action="copy"
        >
          <span className="fa fa-clone"/>
          Get survey link
        </a>
      </div>
    )
  }

  render() {
    const {
      gotoSurveyDetail,
      survey,
      localeSurvey,
      localePoll,
      localeCommon,
      user,
      onOpenResultPopup,
    } = this.props;
    const userAvatar = survey.user.fullAvatar ||
      require('assets/images/user-icon-placeholder.png');

    return (
      <div className="detail full">
        <a
          role="button"
          title={survey.name}
          onClick={() => {
            const toDate = new Date(survey.to_date)
            const now = new Date()
            if ( survey.vote && survey.vote.length ) {
              return Alert.warning(localeSurvey.NOT_REVOTE_SURVEY_MSG);
            } else if (toDate < now) {
              return Alert.warning(localeSurvey.EXPIRED_TIME_MSG);
            } else if (!checkCoinPollSurvey(survey)) {
              return;
            }
            if (survey.question && survey.question.length) {
              gotoSurveyDetail(survey.id)
            } else if (survey.gizmoLink) {
              const gizmoLink = survey.gizmoLink +
                '?callback=' + survey.gizmoCallback +
                '/' + survey.has_gizmo +
                '/' + user.has;
              window.location.replace(gizmoLink)
            }
          }}
        >
          <div className="head-detail table-detail">
            <div className="col">
              <div className="avatar">
                <img src={userAvatar} alt={survey.user.name} />
              </div>
            </div>
            <div className="infor col">
              <div className="display-row">
                <div className="title">
                  <span className="text name">{survey.user.name}</span>
                  <div className="time">
                    <TimeAgo date={survey.created_at} minPeriod={60} />
                  </div>
                </div>
                <div className="toolbar negative-margin-top">
                  <ul className="tag">
                    <li className="survey">
                      <span role="button" title="survey">survey</span>
                    </li>
                    {
                      survey.tag ?
                        <li className="movie">
                          <span title={survey.tag}>
                            {survey.tag}
                          </span>
                        </li> : null
                    }
                    {
                      !isEmpty(survey.vote) ?
                        <li className="voted-icon">
                          <span className="fa fa-check" />
                        </li> : null
                    }
                    <li>
                      <span className="fa fa-ellipsis-h" onClick={this.openPopover}/>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="display-row">
                <div className="question">
                  <span className="poll-name">{survey.name}</span>
                  <span className="end-date">
                    <Countdown
                      endDate={survey.to_date}
                      prefix={localeCommon.TIME_LEFT_TEXT}
                      dayLabel={localeCommon.DAY}
                      hourLabel={localeCommon.HOUR}
                      minuteLabel={localeCommon.MINUTE}
                      secondLabel={localeCommon.SECOND}
                      expiredLabel={localeCommon.EXPIRED_TIME_TEXT}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="detail-view">
            <div className="list-point-awards pull-left">
              <ul>
                <li>
                  <span className="num">
                    {survey.question.length || 0}
                  </span>
                  <span className="text">
                    {localeSurvey.QUESTION}
                  </span>
                </li>
                <li>
                  <span className="num">
                    {survey.point || 0}
                  </span>
                  <span className="text">
                    {localePoll.POINT_RESULT}
                  </span>
                </li>
                <li>
                  <span className="num">
                    {survey.voted || 0}
                  </span>
                  <span className="text">
                    {localePoll.VOTE_RESULT}
                  </span>
                </li>
              </ul>
            </div>
            <div className="group-link pull-right">
              <ul>
                {
                  user.id === survey.user.id || survey.view_result ?
                    <li>
                      <button
                        title="Result"
                        className="btn btn-grey"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onOpenResultPopup(survey)
                        }}
                      >
                        <span className="material-icons">&#xE801;</span>
                        <span className="text">
                          {localePoll.RESULT_BUTTON}
                        </span>
                      </button>
                    </li> : null
                }
              </ul>
            </div>
          </div>
        </a>
        { this.renderGetLinkPopover() }
      </div>
    )
  }
}

Survey.propTypes = {
  gotoSurveyDetail: PropTypes.func.isRequired,
  survey: PropTypes.object.isRequired,
}

export default Survey;
