import React, { Component } from 'react';
import Alert from 'react-s-alert';
import Modal from 'react-responsive-modal';
import { Link, withRouter } from 'react-router-dom';
import { cloneDeep, find, filter } from 'lodash';
import PropTypes from 'prop-types';
import { APIs, CHILD_ROUTE_PATH } from 'services/config';
import { onScroll, requestAPI } from 'services/utils';
import UpdateEndDate from '../PollTab/UpdateEndDate';
import FormFilter from './FormFilter';
import ListSurveys from './ListSurveys';
import BottomLoading from 'components/BottomLoading';
import ResultContent from '../../../Poll/ResultContent';
import { INPUT_NAME, ENUM } from '../../constant';

const localePoll = window.locale.Poll;
const localeCreate = window.locale.Create;
const localeProject = window.locale.Project;

class SurveyTab extends Component {
  constructor() {
    super();
    this.state = {
      surveys: [],
      next_page_url: '',
      isBottomLoading: false,
      currentSurvey: {},
      isOpen: false,
      resultAnswer: {},
      currentQuestion: null,
    }
    this.dataForm = {};
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleOnScroll);
    const url = APIs.project.getListSurveys.url
                  .replace('{projectId}', this.props.projectId);
    this.getUserListSurveys(url);
  }

  componentWillUnmount() {
    this.hasWillUnmount = true;
    window.removeEventListener('scroll', this.handleOnScroll);
  }
  
  closeModal = () => {
    this.setState({ isOpen: false });
  }
  
  getUserListSurveys = async (url, isShowPageLoading = true, isResetSurveys = false) => {
    try {
      const res = await requestAPI({
        url,
        method: APIs.project.getListSurveys.method,
        isShowPageLoading,
        dataForm: this.dataForm,
      });
      
      if (this.hasWillUnmount) {
        return;
      }

      const surveys = isResetSurveys ? res.data.data :
        this.state.surveys.concat(res.data.data);

      this.setState({
        surveys,
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
        this.getUserListSurveys(this.state.next_page_url, false);
      });
    }
  }

  onChangeStatus = async (status, survey) => {
    const res = await requestAPI({
      url: APIs.project.updateStatusSurvey.url.replace('{surveyId}', survey.id),
      method: APIs.project.updateStatusSurvey.method,
      dataForm: {
        status,
      }
    })
    
    if (res.success) {
      const surveys = cloneDeep(this.state.surveys).map(item => {
        if (item.id === survey.id) {
          item.status = status
        }
        return item
      })
  
      this.setState({
        surveys,
      })
    } else {
      Alert.error(res.message)
    }
  }

  onDeleteSurvey = async (survey) => {
    const url = APIs.project.deleteSurvey.url.replace('{surveyId}', survey.id);
    const res = await requestAPI({
      url,
      method: APIs.project.deleteSurvey.method,
    });

    if (!res.success) {
      return;
    }

    if (res.data && res.data.survey_id) {
      const surveys = filter(this.state.surveys, item => {
        return item.id !== survey.id;
      });
      this.setState({ surveys })
      Alert.success(localeProject.SurveyTab.DELETE_SURVEY_SUCCESS_MSG)
    } else {
      Alert.error(res.message)
    }
  }

  openResultModal = async (currentSurvey) => {
    const res = await requestAPI({
      url: APIs.survey.getResultAnswer.url,
      method: APIs.survey.getResultAnswer.method,
      dataForm: {
        survey_id: currentSurvey.id,
        question_id: currentSurvey.question[0].id
      }
    })
    
    if (!res.success) {
      return;
    }

    this.setState({
      currentQuestion: currentSurvey.question[0],
      currentSurvey,
      isOpen: true,
      resultAnswer: res.data,
    })
  }
  
  onFilter = (dataForm) => {
    this.dataForm = dataForm;
    
    const url = APIs.project.getListSurveys.url
                  .replace('{projectId}', this.props.projectId);
    this.getUserListSurveys(url, true, true);
  }

  openUpdateEndDateModal = (currentSurvey) => {
    this.setState({ currentSurvey }, () => {
      this.updateEndDateForm.openModal()
    })
  }

  onChangeEndDate = (survey) => {
    const surveys = cloneDeep(this.state.surveys).map(item => {
      if (item.id === survey.id) {
        item.to_date = survey.to_date
      }
      return item
    })

    this.updateEndDateForm.closeModal()
    this.setState({
      surveys,
      currentSurvey: {},
    })
  }

  onFilterResultWithTarget = (resultAnswer) => {
    this.setState({ resultAnswer });
  }
  
  getResultAnswer = (surveyId, questionId) => {
    const { getResultAnswer } = APIs.survey;

    return requestAPI({
      url: getResultAnswer.url,
      method: getResultAnswer.method,
      dataForm: {
        survey_id: parseInt(surveyId, 10),
        question_id: questionId
      },
    })
  }

  getResultBaseOnQuestion = async (questionId, successCB) => {
    const {
      currentSurvey,
      // currentQuestion,
    } = this.state;

    if (!currentSurvey) {
      return;
    }

    const res = await this.getResultAnswer(currentSurvey.id, questionId);

    if (res.success) {
      const question = find(currentSurvey.question, { id: questionId })
      typeof successCB === 'function' && successCB();
      this.setState({
        currentQuestion: question,
        resultAnswer: res.data,
      });
    }
  }

  gotoPayment = (survey) => {
    const url = CHILD_ROUTE_PATH.PROJECT_POLL_SURVEY_PAYMENT
                  .replace(':type', ENUM.TYPE.SURVEY)
                  .replace(':pollSurveyId', survey.id)
    this.props.history.push(url)
  }

  render() {
    const { currentSurvey } = this.state;
    const isOwner = this.props.user.id === currentSurvey.user_id;
    const userAvatar = currentSurvey && currentSurvey.user ?
      currentSurvey.user.fullAvatar :
      require('assets/images/user-icon-placeholder.png')
    const createSurveyUrl = CHILD_ROUTE_PATH.PROJECT_CREATE_SURVEY
      .replace(':projectId', this.props.projectId);
      
    return (
      <div>
        <Link
          className="btn"
          to={createSurveyUrl}
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
          ref={(node) => this.form = node}
          onFilter={this.onFilter}
          projectId={this.props.projectId}
          localeProject={this.props.localeProject}
        />
        <ListSurveys
          localeCommon={this.props.localeCommon}
          surveys={this.state.surveys}
          openUpdateEndDateModal={this.openUpdateEndDateModal}
          openResultModal={this.openResultModal}
          onDeleteSurvey={this.onDeleteSurvey}
          gotoPayment={this.gotoPayment}
          onChangeStatus={this.onChangeStatus}
        />
        {
          this.state.isBottomLoading ?
            <BottomLoading/> : null
        }
        <UpdateEndDate
          ref={node => {
            if (node) this.updateEndDateForm = node
          }}
          item={this.state.currentSurvey}
          onChangeEndDate={this.onChangeEndDate}
          keyPollSurvey="survey"
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
            currentSurvey && currentSurvey.user ?
              (
                <div className="box-item">
                  <div className="head">
                    <div className="thumb">
                      <img src={userAvatar} alt={currentSurvey.user.name} />
                    </div>
                    <div className="title">
                      <h3>{currentSurvey.user.name}</h3>
                    </div>
                    <div className="point">
                      <span className="number">{currentSurvey.point || 0}</span>
                      <span className="text">
                        {localePoll.POINT_RESULT}
                      </span>
                    </div>
                  </div>
                  {/* {this.renderPopupContent()} */}
                  <ResultContent
                    keyPollSurvey="survey"
                    localeCreate={localeCreate}
                    question={this.state.currentQuestion}
                    resultAnswer={this.state.resultAnswer}
                    viewResult={isOwner || currentSurvey[INPUT_NAME.VIEW_RESULT]}
                    viewSocial={isOwner || currentSurvey[INPUT_NAME.VIEW_SOCIAL]}
                    shareSocial={currentSurvey.shareSocial || ''}
                    listQuestions={currentSurvey.question}
                    getResultBaseOnQuestion={this.getResultBaseOnQuestion}
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

SurveyTab.propTypes = {
  projectId: PropTypes.string.isRequired,
}

export default withRouter(SurveyTab);
