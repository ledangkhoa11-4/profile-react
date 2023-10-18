import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { cloneDeep, find, isEmpty } from 'lodash';
import Alert from 'react-s-alert';
import Masonry from 'react-masonry-component';
import Modal from 'react-responsive-modal';
import Layout from 'components/Layout';
import QuickPoll from './QuickPoll';
import Article from './Article';
import Poll from './Poll';
import Surveys from './Surveys';
import { ContentSurvey } from '../Surveys/Survey';
import FriendActivities from './FriendActivities';
import UserActivities from './UserActivities';
import AnswerContent from '../Poll/AnswerContent';
import { updatePageTitle } from 'actions/ui';
import { updateUserPoint } from 'actions/profile';
import { APIs, ROUTER_PATH } from 'services/config';
import {
  requestAPI,
} from 'services/utils';
import {
  compareUserVoted,
  getDataFromVoteForm,
  validateVoteAnswer,
} from '../Poll/utils';
import QuickProfile from './QuickProfile';

const localeCommon = window.locale.Common;
const localeHome = window.locale.Home;
const localePoll = window.locale.Poll;

class DashBoard extends Component{
  state = {
    listPolls: [],
    listSurveys: [],
    listArticles: [],
    userActivities: [],
    friendActivities: {
      listFriendActivities: [],
      next_page_url: '',
      total: 0,
      isShowBottomLoading: false,
    },
    bannerLink: {},
    isShowPollModal: false,
    isShowSurveyModal: false,
  }

  constructor(props) {
    super(props)
    const { pollId } = props.match.params;
    this.pollIdRecentlyCreated = pollId && parseInt(pollId, 10);
  }

  componentDidMount() {
    this.props.updatePageTitle(localeCommon.HOME_PAGE)
    this.getAllData()
    this.getBannerLink()
  }

  getBannerLink() {
    requestAPI({
      url: APIs.getBannerLink.url,
      method: APIs.getBannerLink.method,
    }).then(res => {
      if (!res.banner_dashboard) {
        return
      }
      this.setState({
        bannerLink: {
          link: res.banner_dashboard.link,
          image: res.banner_dashboard.image
        }
      })
    })
  }
  
  getListPollPlay() {
    return requestAPI({
      url: APIs.poll.listPollToPlay.url,
      method: APIs.poll.listPollToPlay.method,
      dataForm: {
        action: 'dashboard'
      }
    })
  }

  getSurveysPlay() {
    return requestAPI({
      url: APIs.survey.getListSurveys.url,
      method: APIs.survey.getListSurveys.method,
      dataForm: {
        action: 'dashboard'
      }
    })
  }
  
  getListArticles() {
    return requestAPI({
      url: APIs.article.getListArticles.url,
      method: APIs.article.getListArticles.method,
    })
  }

  getUserActivities() {
    return requestAPI({
      url: APIs.profile.getUserActivities.url,
      method: APIs.profile.getUserActivities.method,
    })
  }

  requestFriendActivities(isLoadmore) {
    const url = isLoadmore ? this.state.friendActivities.next_page_url :
      APIs.friends.getFriendActivities.url;
    return requestAPI({
      url,
      method: APIs.friends.getFriendActivities.method,
    })
  }

  getFriendActivities = async (isLoadmore) => {
    if (isLoadmore) {
      await this.setState({
        friendActivities: {
          ...this.state.friendActivities,
          isShowBottomLoading: true,
        }
      })
    }
    const res = await this.requestFriendActivities(isLoadmore)
    if (res.success) {
      const listFriendActivities = !isLoadmore ? res.data.data :
        this.state.friendActivities.listFriendActivities.concat(res.data.data);

      this.setState({
        friendActivities: {
          listFriendActivities,
          next_page_url: res.data.next_page_url,
          total: res.data.total,
          isShowBottomLoading: false,
        },
      })
    }
  }
  
  getAllData() {
    const requests = [
      this.getListPollPlay(),
      this.getListArticles(),
      this.getUserActivities(),
      this.requestFriendActivities(),
      this.getSurveysPlay(),
    ]

    Promise.all(requests).then(res => {
      const listPolls = res[0].data.data;
      const listArticles = res[1].data.data;
      const userActivities = res[2].data.data;
      const friendActivitiesRespone = res[3].data;
      const listSurveys = res[4].data.data;
      const friendActivities = {
        listFriendActivities: friendActivitiesRespone.data,
        next_page_url: friendActivitiesRespone.next_page_url,
        total: friendActivitiesRespone.total,
        isShowBottomLoading: false,
      }

      this.setState({
        listPolls,
        listSurveys,
        listArticles,
        userActivities,
        friendActivities,
      })
    }).catch(error => {
      console.log(error)
    })
  }

  closeModal = () => {
    this.setState({
      isShowPollModal: false,
      isShowSurveyModal: false,
      poll: null,
      surveyInfo: null,
    })
    document.documentElement.style.overflow = '' 
  }

  openVotePollModal = (poll, vote) => {
    this.setState({
      poll,
      userVoted: vote,
      isShowPollModal: true,
    })

    // temporary fix issue scroll on chrome windows 
    setTimeout(() => { 
      document.documentElement.style.overflow = '' 
    }, 100) 
    setTimeout(() => { 
      document.documentElement.style.overflow = 'hidden' 
    }, 600) 
  }

  openVoteSurveyModal = (survey) => {
    if (survey.gizmoLink) {
      const gizmoLink = survey.gizmoLink +
        '?callback=' + survey.gizmoCallback +
        '/' + survey.has_gizmo +
        '/' + this.props.user.has;
      return window.location.href = gizmoLink;
    }

    this.setState({
      surveyInfo: survey,
      isShowSurveyModal: true,
    })

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

    if (this.state.poll.user_id === this.props.user.id) {
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
      
      // input's name is the question.poll_id
      if (inputData.length) return;
      const { question } = this.state.poll;
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

      const { poll } = this.state;
      const vote = (poll.vote && poll.vote[0]) || {};
      const expiredTimeVote = !isEmpty(vote) ? new Date(vote.timeVote) : false;
      const toDate = new Date(poll.to_date);
      const now = new Date();
      let isExpiredPoll = (now.getTime() > toDate.getTime());
      let isExpiredTimeVote = false;
      
      if (expiredTimeVote) {
        isExpiredTimeVote = now.getTime() > expiredTimeVote.getTime()
      }

      if (isExpiredPoll || isExpiredTimeVote) {
        return Alert.warning(localeHome.EXPIRED_VOTE_MSG)
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

  onSuccessVoteSurvey = () => {
    const listSurveys = this.state.listSurveys.map(item => {
      if (this.state.surveyInfo.id === item.id) {
        item.voted = 1
      }
      return item
    })
    this.setState({ listSurveys }, () => {
      this.closeModal()
    })
  }

  onSuhmitQuickPollSuccess = () => {
    this.props.history.replace(ROUTER_PATH.POLL)
  }

  updatePollAfterVote(answer_id) {
    const listPoll = cloneDeep(this.state.listPolls);
    const currPoll = find(listPoll, { id: this.state.poll.id });
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
        listPolls: listPoll,
      });
    }
  }

  onClickBanner = () => {
    const { host } = window.location;
    const { bannerLink } = this.state;
    if (isEmpty(bannerLink) || !bannerLink.link) {
      return
    }
    if (bannerLink.link.indexOf(host) > -1) {
      window.location.href = bannerLink.link
    } else {
      window.open(bannerLink.link, '_blank')
    }
  }
  
  render() {
    const { poll, bannerLink } = this.state
    const userAvatar = poll && poll.user ? poll.user.fullAvatar :
      require('assets/images/user-icon-placeholder.png')
    const bannerImage = !isEmpty(bannerLink) ? bannerLink.image :
      require('assets/images/banner-a.jpg')

    return (
      <div>
        <QuickProfile/>
        <QuickPoll
          localeHome={localeHome}
          onSuhmitQuickPollSuccess={this.onSuhmitQuickPollSuccess}
        />
        <div className="box-dashboard">
          <div className="inner is-showing">
            <Masonry
              options={{
                transitionDuration: 300
              }}
            >
              <div className="detail banner">
                <div className="thumb">
                  <img
                    src={bannerImage}
                    alt="banner"
                    onClick={this.onClickBanner}
                  />
                </div>
              </div>
              {/*user activities history*/}
              <UserActivities
                userInfo={this.props.user}
                localeHome={localeHome}
                activities={this.state.userActivities}
              />
              {/* poll */}
              <Poll
                localeHome={localeHome}
                listPolls={this.state.listPolls}
                openVotePollModal={this.openVotePollModal}
                pollIdRecentlyCreated={this.pollIdRecentlyCreated}
                user={this.props.user}
              />
              {/* survey */}
              <Surveys
                localeHome={localeHome}
                listSurveys={this.state.listSurveys}
                openVoteSurveyModal={this.openVoteSurveyModal}
                user={this.props.user}
              />
              {/*article*/}
              <Article
                listArticles={this.state.listArticles}
              />
              {/* friend history activities */}
              <FriendActivities
                localeHome={localeHome}
                friendActivities={this.state.friendActivities}
                getFriendActivities={this.getFriendActivities}
              />
            </Masonry>
          </div>
        </div>
        <Modal
          open={this.state.isShowPollModal}
          onClose={this.closeModal}
          showCloseIcon={true}
          classNames={{
            overlay: 'Modal-overlay-0-1',
            modal: 'Modal-modal-0-3',
            closeIcon: 'Modal-closeIcon-0-4'
          }}
        >
          {
            poll && poll.user ?
              (
                <div className="box-item">
                  <div className="head">
                    <div className="thumb">
                      <img src={userAvatar} alt={poll.user.name} />
                    </div>
                    <div className="title">
                      <h3>{poll.user.name}</h3>
                    </div>
                    <div className="point">
                      <span className="number">{poll.user.point || 0}</span>
                      <span className="text">
                        {localePoll.POINT_RESULT}
                      </span>
                    </div>
                  </div>
                  <AnswerContent
                    question={this.state.poll.question}
                    userVoted={this.state.userVoted}
                    votePoll={this.votePoll}
                    localePoll={localePoll}
                    shareSocial={this.state.poll.shareSocial}
                    viewSocial={
                      (poll.user_id === this.props.user.id) ||
                      poll.view_social
                    }
                  />
                </div>
              ) : null
          }
        </Modal>
        <Modal
          open={this.state.isShowSurveyModal}
          onClose={this.closeModal}
          showCloseIcon={true}
          classNames={{
            overlay: 'Modal-overlay-0-1',
            modal: 'Modal-modal-0-3',
            closeIcon: 'Modal-closeIcon-0-4'
          }}
        >
          {
            this.state.surveyInfo ?
              (
                <div className="box-item">
                  <div className="head">
                    <div className="title">
                      <h3>
                        {this.state.surveyInfo.point} &nbsp;
                        {localePoll.POINT_RESULT}
                      </h3>
                    </div>
                  </div>
                  <ContentSurvey
                    surveyInfo={this.state.surveyInfo}
                    successCB={this.onSuccessVoteSurvey}
                    hasNotResult={true}
                  />
                </div>
              ) : null
          }
        </Modal>
      </div>
      )
  }
}

DashBoard = connect((state, ownProps) => ({
  ...ownProps,
  user: state.user,
}), {
  updatePageTitle,
  updateUserPoint,
})(DashBoard)

export default () => (
  <Layout
    index={0}
    menuIcon="home"
    // innerBoxTitle={() => (
    //   <ul className="tabs">
    //     <li className="active">
    //       <a href={undefined} title="Recent">Recent</a>
    //     </li>
    //     <li>
    //       <a href={undefined} title="Popular">Popular</a>
    //     </li>
    //     <li>
    //       <a href={undefined} title="Score Board">Score Board</a>
    //     </li>
    //   </ul>
    // )}
    mainContent={withRouter(DashBoard)}
  />
)
