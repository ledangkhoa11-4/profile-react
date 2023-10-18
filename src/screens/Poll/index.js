import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import Alert from 'react-s-alert';
import { cloneDeep, find } from 'lodash';
import { connect } from 'react-redux';
import Modal from 'react-responsive-modal';
import Layout from 'components/Layout';
import ListPolls from './ListPolls';
import AnswerContent from './AnswerContent';
import ResultContent from './ResultContent';
import './style.css';
import {
  onScroll,
  requestAPI,
  checkCoinPollSurvey,
} from 'services/utils';
import { APIs } from 'services/config';
import { updatePageTitle } from 'actions/ui';
import { updateUserPoint } from 'actions/profile';
import { INPUT_NAME } from '../Project/constant';
import {
  compareUserVoted,
  getDataFromVoteForm,
  validateVoteAnswer,
} from './utils';

const POPUP_TYPE = {
  ANSWER: 'answer',
  RESULT: 'result',
};
const localeCommon = window.locale.Common;
const localePoll = window.locale.Poll;
const localeCreate = window.locale.Create;

class Content extends Component {
  state = {
    next_page_url: '',
    isBottomLoading: false,
    isOpen: false,
    popupType: POPUP_TYPE.ANSWER,
    currentPoll: {},
    userVoted: [],
    currentTime: new Date(),
    polls: [],
  }

  constructor() {
    super();
    this.hasWillUnmount = false;
    this.formData = {};
  }

  componentWillMount () {
    this.props.updatePageTitle(localeCommon.POLL_PAGE)
  } 

  componentDidMount() {
    window.addEventListener('scroll', this.handleOnScroll)

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
    window.removeEventListener('scroll', this.handleOnScroll)
  }

  getUserListPolls = async (url, isShowPageLoading = true, isResetPolls = false) => {
    try {
      const res = await requestAPI({
        url,
        method: APIs.poll.listPollToPlay.method,
        dataForm: this.formData,
        isShowPageLoading,
      });
      
      if (this.hasWillUnmount) {
        return;
      }

      const polls = isResetPolls ? res.data.data :
          this.state.polls.concat(res.data.data);

      this.setState({
        polls,
        next_page_url: res.data.next_page_url,
        isBottomLoading: false,
      });
    } catch (error) {
      if (this.hasWillUnmount) {
        return;
      }
      
      this.setState({ isBottomLoading: false });
      console.log('error: ', error)
    }
  }

  getPollResult = (poll) => {
    const { getResultAnswer } = APIs.poll;
    
    if (!poll[INPUT_NAME.VIEW_RESULT] && this.props.user.id !== poll.user.id) {
      return
    }

    requestAPI({
      url: getResultAnswer.url,
      method: getResultAnswer.method,
      dataForm: {
        poll_id: poll.id
      }
    }).then(res => {
      if (res.success) {
        this.setState({
          resultAnswer: res.data,
          currentPoll: poll,
        }, () => {
          this.openResultPopup()
        })
      }
    })
  }

  handleOnScroll = async () => {
    await onScroll();

    if (this.state.isBottomLoading) return;

    if (this.state.next_page_url) {
      this.setState({
        isBottomLoading: true,
      }, () => {
        this.getUserListPolls(this.state.next_page_url, false);
      });
    }
  }

  filterPolls = (formData) => {
    this.formData = formData;
    this.getUserListPolls(APIs.poll.listPollToPlay.url, true, true);
  }

  closeModal = () => {
    this.setState({ isOpen: false });
    document.documentElement.style.overflow = '' 
  }

  openResultPopup = () => {
    this.setState({
      isOpen: true,
      popupType: POPUP_TYPE.RESULT,
    });
  }

  openAnswerPopup = (poll, vote) => {
    this.setState({
      isOpen: true,
      popupType: POPUP_TYPE.ANSWER,
      currentPoll: poll,
      userVoted: vote,
    });

    // temporary fix issue scroll on chrome windows 
    setTimeout(() => { 
      document.documentElement.style.overflow = '' 
    }, 100) 
    setTimeout(() => { 
      document.documentElement.style.overflow = 'hidden' 
    }, 600) 
  }

  votePoll = (target, callBack) => {
    const inputData = new FormData(target);

    if (this.props.user.id === this.state.currentPoll.user_id) {
      return Alert.warning(localePoll.NO_VOTE_YOUR_POLL_MSG)
    }

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
      if (!checkCoinPollSurvey(this.state.currentPoll)) {
        return;
      }
      
      // input's name is the question.poll_id
      if (inputData.length) return;
      const { question } = this.state.currentPoll;
      const answer_id = getDataFromVoteForm(question, inputData);
      const dataForm = {
        poll_id: question.poll_id,
        question_id: question.id,
        answer_id,
      };
  
      if (!validateVoteAnswer(question.question_type, dataForm.answer_id)) {
        Alert.error(localePoll.REQUIRED);
        return;
      }
  
      if (compareUserVoted(this.state.userVoted.answer_id, dataForm.answer_id)) {
        Alert.error(localePoll.NO_CHANGE);
        return;
      }
      
      requestAPI({
        url: APIs.poll.votePoll.url,
        method: APIs.poll.votePoll.method,
        dataForm,
      }).then(res => {
        if (res.success) {
          Alert.success(res.message)
          const data = res.data;

          if (data.point && Number.isInteger(data.point)) {
            const point = this.props.user.point + data.point;
            this.props.updateUserPoint(point)
          }
          this.updatePollAfterVote(answer_id)
          typeof callBack === 'function' && callBack()
          this.closeModal()
        }
      })
    }, 100);
  }

  updatePollAfterVote(answer_id) {
    const listPoll = cloneDeep(this.state.polls);
    const currPoll = find(listPoll, { id: this.state.currentPoll.id });
    if (currPoll.id) {
      if (!currPoll.vote[0]) {
        currPoll.vote[0] = {};
      }
      currPoll.vote[0].answer_id = answer_id;
      if (!currPoll.user_vote_count) {
        currPoll.number_vote_count += 1;
        currPoll.user_vote_count = 1;  
      }
      this.setState({
        polls: listPoll,
        isOpen: false,
      });
    }
  }

  renderPopupContent() {
    const isOwner = this.props.user.id === this.state.currentPoll.user_id;
    
    switch(this.state.popupType) {
      case POPUP_TYPE.ANSWER:
        return <AnswerContent
          question={this.state.currentPoll.question}
          userVoted={this.state.userVoted}
          votePoll={this.votePoll}
          localePoll={localePoll}
          shareSocial={this.state.currentPoll.shareSocial || ''}
          viewSocial={
            isOwner ||
            this.state.currentPoll[INPUT_NAME.VIEW_SOCIAL]
          }
        />;
      case POPUP_TYPE.RESULT:
        return <ResultContent
          keyPollSurvey="poll"
          isFreePoll={!this.state.currentPoll.number_vote}
          localeCreate={localeCreate}
          question={this.state.currentPoll.question}
          resultAnswer={this.state.resultAnswer}
          viewResult={isOwner || this.state.currentPoll[INPUT_NAME.VIEW_RESULT]}
          viewSocial={isOwner || this.state.currentPoll[INPUT_NAME.VIEW_SOCIAL]}
          shareSocial={this.state.currentPoll.shareSocial || ''}
          isOwner={isOwner}
          onFilterResultWithTarget={this.onFilterResultWithTarget}
        />
      default:
        return null;
    }
  }

  onFilterResultWithTarget = (resultAnswer) => {
    this.setState({ resultAnswer });
  }

  render() {
    const { currentPoll } = this.state
    const userAvatar = currentPoll && currentPoll.user ?
      currentPoll.user.fullAvatar :
      require('assets/images/user-icon-placeholder.png')
    
    return (
      <div className="a">
        <ListPolls
          polls={this.state.polls}
          onFilterPolls={this.filterPolls}
          isBottomLoading={this.state.isBottomLoading}
          onOpenResultPopup={this.getPollResult}
          onOpenAnswerPopup={this.openAnswerPopup}
          localePoll={localePoll}
          localeCommon={localeCommon}
          currentTime={this.state.currentTime}
        />
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
          {
            currentPoll && currentPoll.user ?
              (
                <div className="box-item">
                  <div className="head">
                    <div className="thumb">
                      <img src={userAvatar} alt={currentPoll.user.name} />
                    </div>
                    <div className="title">
                      <h3>{currentPoll.user.name}</h3>
                    </div>
                    <div className="point">
                      <span className="number">{currentPoll.point || 0}</span>
                      <span className="text">
                        {localePoll.POINT_RESULT}
                      </span>
                    </div>
                  </div>
                  {this.renderPopupContent()}
                </div>
              ) : null
          }
        </Modal>
      </div>
    )
  }
}

Content = connect(state => ({
  user: state.user,
}), {
  updatePageTitle,
  updateUserPoint,
})(Content);

const Polls = () => {
  return (
    <Layout
      index={5}
      title="Poll"
      menuIcon="assessment"
      mainContent={Content}
    />
  )
}


export default Polls;
