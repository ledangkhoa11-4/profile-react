import React, { Component } from 'react';
import Alert from 'react-s-alert';
import Modal from 'react-responsive-modal';
import { cloneDeep, filter } from 'lodash';
import { Link, withRouter } from 'react-router-dom';
import FormFilter from './FormFilter';
import ListPolls from './ListPolls';
import ResultContent from '../../../Poll/ResultContent';
import UpdateEndDate from './UpdateEndDate';
import { APIs, CHILD_ROUTE_PATH } from 'services/config';
import { requestAPI, onScroll } from 'services/utils';
import { INPUT_NAME, ENUM } from '../../constant';

const localePoll = window.locale.Poll;
const localeCreate = window.locale.Create;
const localeProject = window.locale.Project;

class PollTab extends Component {
  constructor() {
    super();
    this.hasWillUnmount = false;
    this.state = {
      polls: [],
      next_page_url: '',
      isBottomLoading: false,
      currentPoll: {},
      isOpen: false,
      resultAnswer: {},
    }
    this.formData = {};
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleOnScroll);
    const url = APIs.poll.listPollUserInProject.url
                  .replace('{projectId}', this.props.projectId);
    this.getUserListPolls(url);
  }
  
  componentWillUnmount() {
    this.hasWillUnmount = true;
    window.removeEventListener('scroll', this.handleOnScroll);
  }
  
  closeModal = () => {
    this.setState({ isOpen: false });
  }

  getUserListPolls = async (url, isShowPageLoading = true, isResetPolls = false) => {
    try {
      const res = await requestAPI({
        url,
        method: APIs.poll.listPollUserInProject.method,
        isShowPageLoading,
        dataForm: this.formData,
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

  openResultModal = async (currentPoll) => {
    const res = await requestAPI({
      url: APIs.poll.getResultAnswer.url,
      method: APIs.poll.getResultAnswer.method,
      dataForm: {
        poll_id: currentPoll.id
      }
    })
    
    if (!res.success) {
      return;
    }

    this.setState({
      currentPoll,
      isOpen: true,
      resultAnswer: res.data,
    })
  }

  onChangeStatus = async (status, poll) => {
    const res = await requestAPI({
      url: APIs.project.updateStatusPoll.url.replace('{pollId}', poll.id),
      method: APIs.project.updateStatusPoll.method,
      dataForm: {
        status,
      }
    })

    if (res.success) {
      const polls = cloneDeep(this.state.polls).map(item => {
        if (item.id === poll.id) {
          item.status = status
        }
        return item
      })
  
      this.setState({
        polls,
      })
    } else {
      Alert.error(res.message)
    }
  }

  onDeletePoll = async (poll) => {
    const url = APIs.project.deletePoll.url.replace('{pollId}', poll.id);
    const res = await requestAPI({
      url,
      method: APIs.project.deletePoll.method,
    });

    if (!res.success) {
      return;
    }

    if (res.data && res.data.poll_id) {
      const polls = filter(this.state.polls, item => {
        return item.id !== poll.id;
      });
      this.setState({ polls })
      Alert.success(localeProject.PollTab.DELETE_POLL_SUCCESS_MSG)
    } else {
      Alert.error(res.message)
    }
  }

  onFilter = (dataForm) => {
    this.formData = dataForm;
    const url = APIs.poll.listPollUserInProject.url
                  .replace('{projectId}', this.props.projectId);
    this.getUserListPolls(url, true, true);
  }

  openUpdateEndDateModal = (currentPoll) => {
    this.setState({ currentPoll }, () => {
      this.updateEndDateForm.openModal()
    })
  }

  onChangeEndDate = (poll) => {
    const polls = cloneDeep(this.state.polls).map(item => {
      if (item.id === poll.id) {
        item.to_date = poll.to_date
      }
      return item
    })

    this.updateEndDateForm.closeModal()
    this.setState({
      polls,
      currentPoll: {},
    })
  }

  onFilterResultWithTarget = (resultAnswer) => {
    this.setState({ resultAnswer });
  }

  gotoPayment = (poll) => {
    const url = CHILD_ROUTE_PATH.PROJECT_POLL_SURVEY_PAYMENT
                  .replace(':type', ENUM.TYPE.POLL)
                  .replace(':pollSurveyId', poll.id)
    this.props.history.push(url)
  }

  render() {
    const {
      currentPoll
    } = this.state;
    const isOwner = this.props.user.id === currentPoll.user_id;
    const userAvatar = currentPoll && currentPoll.user ?
      currentPoll.user.fullAvatar :
      require('assets/images/user-icon-placeholder.png')
    
    return (
      <div>
        <Link
          className="btn"
          to={CHILD_ROUTE_PATH.PROJECT_CREATE_POLL.replace(':projectId', this.props.projectId)}
          style={{
            marginTop: '14px'
          }}
        >
          <span className="material-icons">add</span>
          <span className="text">
            {this.props.localeProject.CREATE_BUTTON}
          </span>
        </Link>
        <FormFilter
          projectId={this.props.projectId}
          onFilter={this.onFilter}
          localeProject={this.props.localeProject}
        />
        <ListPolls
          projectId={this.props.projectId}
          isBottomLoading={this.state.isBottomLoading}
          polls={this.state.polls}
          localeCommon={this.props.localeCommon}
          openUpdateEndDateModal={this.openUpdateEndDateModal}
          openResultModal={this.openResultModal}
          onDeletePoll={this.onDeletePoll}
          gotoPayment={this.gotoPayment}
          onChangeStatus={this.onChangeStatus}
        />
        <UpdateEndDate
          ref={node => {
            if (node) this.updateEndDateForm = node
          }}
          item={this.state.currentPoll}
          onChangeEndDate={this.onChangeEndDate}
          keyPollSurvey="poll"
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
                  {/* {this.renderPopupContent()} */}
                  <ResultContent
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
                </div>
              ) : null
          }
        </Modal>
      </div>
    )
  }
}

export default withRouter(PollTab);
