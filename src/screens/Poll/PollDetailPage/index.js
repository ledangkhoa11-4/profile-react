import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { cloneDeep, isEmpty } from 'lodash';
import Alert from 'react-s-alert';
import Layout from 'components/Layout';
import Poll from './Poll';
import ResultContent from '../ResultContent';
import { jsonEqual, requestAPI, checkCoinPollSurvey } from 'services/utils';
import { APIs } from 'services/config';
import { updatePageTitle } from 'actions/ui';
import { INPUT_NAME } from '../../Project/constant'
import {
  compareUserVoted,
  getDataFromVoteForm,
  validateVoteAnswer,
} from '../utils';
import '../style.css';

const localePoll = window.locale.Poll;
const localeCommon = window.locale.Common;

class PollDetailPage extends Component {
  state = {
    poll: {},
    userVoted: [],
    resultAnswer: {},
    currentTime: new Date(),
    permissionMsg: '',
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !jsonEqual(this.state, nextState)
  }
  
  componentDidMount() {
    this.getPollInfo()
    this.getPollResult()
    this.timeInterval = setInterval(() => {
      if (this.hasWillUnmount) {
        return
      }
      this.setState({
        currentTime: new Date(),
      })
    }, 60000)
  }

  componentWillUnmount() {    
    this.hasWillUnmount = true;
    clearInterval(this.timeInterval)
  }  
  
  getPollInfo() {
    const { getPollInfoToShow } = APIs.poll;
    const { pollId } = this.props.match.params;

    requestAPI({
      url: getPollInfoToShow.url.replace('{pollId}', pollId),
      method: getPollInfoToShow.method,
    }).then(res => {
      if (res.success) {
        if (res.data.status_code && res.data.status_code === 403) {
          // permission view survey
          this.setState({
            permissionMsg: res.message
          })
        } else {
          const vote = res.data.vote.length ? res.data.vote[0] : res.data.vote;
          this.setState({
            poll: res.data,
            userVoted: vote,
          }, () => {
            const title = !this.state.poll.name ? '' :
              `> ${this.state.poll.name}`;
            this.props.updatePageTitle(`Poll ${title}`)
          })
        }
      }
    })
  }
  
  getPollResult = () => {
    const { pollId } = this.props.match.params;
    const { getResultAnswer } = APIs.poll;
    requestAPI({
      url: getResultAnswer.url,
      method: getResultAnswer.method,
      dataForm: {
        poll_id: pollId
      }
    }).then(res => {
      if (res.success) {
        this.setState({
          resultAnswer: res.data,
        })
      }
    })
  }

  votePoll = (e) => {
    e.preventDefault();    

    if (this.props.user.id === this.state.poll.user_id) {
      return Alert.warning(localePoll.NO_VOTE_YOUR_POLL_MSG)
    }

    const inputData = new FormData(e.target);
    clearTimeout(this.timeoutSubmitVote);
    this.timeoutSubmitVote = setTimeout(() => {
      const { userVoted } = this.state;
      if (userVoted.timeVote) {
        const timeVote = new Date(userVoted.timeVote)
        const currentTime = new Date()
        if (timeVote.getTime() <= currentTime.getTime()) {
          return Alert.warning(localePoll.EXPIRED_TIME_VOTE_MSG)
        }
      }

      // input's name is the question.poll_id
      if (inputData.length) return;
      const { poll } = this.state;
      const answer_id = getDataFromVoteForm(poll.question, inputData);
      const dataForm = {
        poll_id: poll.question.poll_id,
        question_id: poll.question.id,
        answer_id,
      };
  
      if (!validateVoteAnswer(poll.question.question_type, dataForm.answer_id)) {
        Alert.error(localePoll.REQUIRED);
        return;
      }
  
      if (compareUserVoted(this.state.userVoted.answer_id, dataForm.answer_id)) {
        Alert.error(localePoll.NO_CHANGE);
        return;
      }
      
      if (!checkCoinPollSurvey(this.state.poll)) {
        return;
      }
      
      requestAPI({
        url: APIs.poll.votePoll.url,
        method: APIs.poll.votePoll.method,
        dataForm,
      }).then(res => {
        if (res.success) {
          // this.updatePollAfterVote(res.data);
          Alert.success(res.message)
          const poll = cloneDeep(this.state.poll);
          if (!poll.user_vote_count) {
            poll.user_vote_count = 1;
            poll.number_vote_count += 1;
          }
          
          this.setState({ poll })
        }
      })
    }, 100);
  }

  render() {
    if (this.state.permissionMsg) {
      return (
        <div className="form form-option">
          <div className="alert alert-warning" role="alert">
            { this.state.permissionMsg }
          </div>
        </div>
      )
    }
    
    const isOwner = this.props.user.id === this.state.poll.user_id;
    return (
      <div>
        <Poll
          poll={this.state.poll}
          userVoted={this.state.userVoted}
          votePoll={this.votePoll}
          localePoll={localePoll}
          localeCommon={localeCommon}
          currentTime={this.state.currentTime}
        />

        {
          !isEmpty(this.state.resultAnswer) ?
            <div className="wrapper-box box-item">
              <ResultContent
                keyPollSurvey="poll"
                question={this.state.poll.question}
                resultAnswer={this.state.resultAnswer}
                isHideQuestion={true}
                viewResult={isOwner || this.state.poll[INPUT_NAME.VIEW_RESULT]}
                viewSocial={isOwner || this.state.poll[INPUT_NAME.VIEW_SOCIAL]}
                shareSocial={this.state.poll.shareSocial || ''}
              />
            </div> : null
        }
      </div>
    );
  }
}

PollDetailPage = connect(state => ({
  user: state.user,
}), {
  updatePageTitle,
})(PollDetailPage)

export default () => (
  <Layout
    index={5}
    title="Poll"
    menuIcon="assessment"
    mainContent={withRouter(PollDetailPage)}
  />
)
