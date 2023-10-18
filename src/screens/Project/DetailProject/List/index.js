import React, { Component } from 'react';
import Alert from 'react-s-alert';
import FormFilter from './FormFilter';
import { cloneDeep, find, forEach, filter } from 'lodash';
import { APIs, CHILD_ROUTE_PATH, BASE_URL } from 'services/config';
import { requestAPI, onScroll } from 'services/utils';
import List from './List';
import Modal from 'react-responsive-modal';
import { INPUT_NAME, ENUM } from '../../constant';
import ResultContent from '../../../Poll/ResultContent';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ACTION_EDIT_POLL_SURVEY, POLL_SURVEY_STATUS } from 'services/constant';
import UpdateEndDate from './UpdateEndDate';

const localeProject = window.locale.Project;
const localeCreate = window.locale.Create;
const localePoll = window.locale.Poll;
const {
  PAUSE,
  LAUNCHNOW,
  LAUNCH,
  RENEW,
  FINISH,
  SUBMITAPPROVAL,
  EDIT,
  DELETE,
} = ACTION_EDIT_POLL_SURVEY;
class ListPollSurvey extends Component {
    constructor(props) {
      super(props);
      this.state={
        list: [],
        next_page_survey_url: '',
        isBottomLoading: false,
        currentObject: {},
        currentQuestion: null,
        isOpen: false,
        openConfirm: false,
        resultAnswer: {},
        delObject: {},
      }
      this.formData = {};
      this.hasWillUnmount = false;
    }
    handleOnScroll = async () => {
      await onScroll();
  
      if (this.state.isBottomLoading) return;
  
      if (this.state.next_page_url) {
        this.setState({
          isBottomLoading: true,
        }, () => {
          this.getUserListPollsSurveys(this.state.next_page_url, false);
        });
      }
    }
    componentDidMount() {
      window.addEventListener('scroll', this.handleOnScroll);
      const url = APIs.project.listPollSurveyUserInProject.url
                    .replace('{projectId}', this.props.projectId);
      this.getUserListPollsSurveys(url);
    }
    componentWillUnmount() {
      this.hasWillUnmount = true;
      window.removeEventListener('scroll', this.handleOnScroll);
    }
   
    getUserListPollsSurveys = async (url, isShowPageLoading = true, isReset = false) => {
      try {
        const res = await requestAPI({
          url,
          method: APIs.project.listPollSurveyUserInProject.method,
          isShowPageLoading,
          dataForm: this.formData,
        });
        if (this.hasWillUnmount) {
          return;
        }
  
        const list = isReset ? res.data.data :
            this.state.list.concat(res.data.data);
        this.setState({
          list,
          next_page_url: res.data.next_page_url,
          isBottomLoading: false,
        });
      } catch (error) {
        if (this.hasWillUnmount) {
          return;
        }
        this.setState({ isBottomLoading: false });
        if(Array.isArray(error.message) || typeof error.message === 'object'){
          forEach(error.message, msg => {
            msg[0] && Alert.error(msg[0]);
          })
        }else{
          Alert.error(error.message);
        }
      }
    }
    onFilter = (dataForm) => {
      this.formData = dataForm;
      const url = APIs.project.listPollSurveyUserInProject.url
                    .replace('{projectId}', this.props.projectId);
      this.getUserListPollsSurveys(url, true, true);
    }
    openResultModal = async (currentObject) => {
      if(typeof currentObject.thumb === 'undefined'){
        const res = await requestAPI({
          url: APIs.poll.getResultAnswer.url,
          method: APIs.poll.getResultAnswer.method,
          dataForm: {
            poll_id: currentObject.id
          }
        })
        
        if (!res.success) {
          return;
        }
        this.setState({
          currentObject,
          isOpen: true,
          resultAnswer: res.data,
        })
      }else{
        const res = await requestAPI({
          url: APIs.survey.getResultAnswer.url,
          method: APIs.survey.getResultAnswer.method,
          dataForm: {
            survey_id: currentObject.id,
            question_id: currentObject.question[0].id
          }
        })
        
        if (!res.success) {
          if(Array.isArray(res.message) || typeof res.message === 'object'){
            forEach(res.message, msg => {
              msg[0] && Alert.error(msg[0]);
            })
          }else{
            Alert.error(res.message);
          }
          return;
        }
    
        this.setState({
          currentQuestion: currentObject.question[0],
          currentObject,
          isOpen: true,
          resultAnswer: res.data,
        })
      }
    }
    openModalConfirm = (delObject) =>{
      this.setState({ 
        openConfirm: true,
        delObject,
       });
    }
    onChangeStatus = (object, action) => {
      var status;
      switch (action) {
        case PAUSE:
          if(object.status !== POLL_SURVEY_STATUS.RUNNING){
            return;
          }
          status = action;
          break;
        case DELETE:
            if(object.status !== POLL_SURVEY_STATUS.DRAFT && object.status !== POLL_SURVEY_STATUS.WAILTINGFORPAYMENT
              && object.status !== POLL_SURVEY_STATUS.FINISH ){
              return;
            }
            status = POLL_SURVEY_STATUS.DELETE;
            break;
        case FINISH:
            if(object.status === POLL_SURVEY_STATUS.DRAFT || object.status  === POLL_SURVEY_STATUS.REFUSE
              || object.status === POLL_SURVEY_STATUS.FINISH  || object.status === POLL_SURVEY_STATUS.WAILTINGFORPAYMENT){
              return;
            }
            status = POLL_SURVEY_STATUS.FINISH;
            break;
        case LAUNCHNOW:
            if(object.status !== POLL_SURVEY_STATUS.SCHEDULED){
              return;
            }
            status = action;
            break;
        case LAUNCH:
            if(object.status !== POLL_SURVEY_STATUS.PAUSE){
              return;
            }
            status = POLL_SURVEY_STATUS.APPROVED;
            break;
        case SUBMITAPPROVAL:
            if(object.status !== POLL_SURVEY_STATUS.REFUSE){
              return;
            }
            status = POLL_SURVEY_STATUS.WAITINGFORAPPROVAL;
            break;
        case EDIT:
          if(object.status === POLL_SURVEY_STATUS.FINISH){
            return;
          }
          const editUrl =  typeof object.thumb === 'undefined'
                  ? CHILD_ROUTE_PATH.PROJECT_EDIT_POLL
                    .replace(':projectId', object.project_id)
                    .replace(':pollId', object.id)
                  : CHILD_ROUTE_PATH.PROJECT_EDIT_SURVEY
                    .replace(':projectId', object.project_id)
                    .replace(':surveyId', object.id);
          this.props.history.push(editUrl)
          return;
        default:
          return;
      }
      
      const url = typeof object.thumb === 'undefined'
                  ? APIs.project.updateStatusPoll.url.replace('{pollId}', object.id)
                  : APIs.project.updateStatusSurvey.url.replace('{surveyId}', object.id);
      const method = typeof object.thumb === 'undefined' 
                  ? APIs.project.updateStatusPoll.method 
                  : APIs.project.updateStatusSurvey.method;
      requestAPI({
        url,
        method,
        dataForm: {
          status,
          action
        }
      }).then(res =>{
        if (res.success) {
          const type_object = typeof object.thumb !== 'undefined' ? ENUM.TYPE.SURVEY : ENUM.TYPE.POLL;
          const list = action === DELETE 
          ? filter(cloneDeep(this.state.list), item => {
            const type_item = typeof item.thumb !== 'undefined' ? ENUM.TYPE.SURVEY : ENUM.TYPE.POLL;
              return item.id !== object.id && type_item !== type_object;
            })
          : cloneDeep(this.state.list).map(item => {
            const type_item = typeof item.thumb !== 'undefined' ? ENUM.TYPE.SURVEY : ENUM.TYPE.POLL;
            if (item.id === object.id && type_item === type_object) {
              item.status = res.data.status;
              if(status == LAUNCHNOW){
                item.from_date = res.data.from_date;
              }
            }
            return item
          })
          this.setState({
            openConfirm: false,
            list,
          },()=>{
            Alert.success(res.message)
          })
        }
      }).catch(error => {
        if(Array.isArray(error.message) || typeof error.message === 'object'){
          forEach(error.message, msg => {
            msg[0] && Alert.error(msg[0]);
          })
        }else{
          Alert.error(error.message);
        }
      });
    }
    closeModal = () => {
      this.setState({ isOpen: false });
    }
    closeModalConfirm = () =>{
      this.setState({ openConfirm: false });
    }
    getResultBaseOnQuestion = async (questionId, successCB) => {
      const {
        currentObject,
        // currentQuestion,
      } = this.state;
  
      if (!currentObject) {
        return;
      }
  
      const res = await this.getResultAnswer(currentObject.id, questionId);
  
      if (res.success) {
        const question = find(currentObject.question, { id: questionId })
        typeof successCB === 'function' && successCB();
        this.setState({
          currentQuestion: question,
          resultAnswer: res.data,
        });
      }
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
    gotoPayment = (object) => {
      if(typeof object.thumb === 'undefined'){
        const url = CHILD_ROUTE_PATH.PROJECT_POLL_SURVEY_PAYMENT
          .replace(':type', ENUM.TYPE.POLL)
          .replace(':pollSurveyId', object.id)
        this.props.history.push(url)
      }else{
        const url = CHILD_ROUTE_PATH.PROJECT_POLL_SURVEY_PAYMENT
          .replace(':type', ENUM.TYPE.SURVEY)
          .replace(':pollSurveyId', object.id)
        this.props.history.push(url)
      }
    }
    openUpdateEndDateModal = (currentObject) => {
      if(currentObject.status === POLL_SURVEY_STATUS.EXPIRED 
        || currentObject.status === POLL_SURVEY_STATUS.WAILTINGFORPAYMENT){
        this.setState({ currentObject }, () => {
          this.updateEndDateForm.openModal()
        })
      }else{
        return;
      }
    }
    onChangeEndDate = (object) => {
      const type_object = typeof object.thumb !== 'undefined' ? ENUM.TYPE.SURVEY : ENUM.TYPE.POLL;
      const list = cloneDeep(this.state.list).map(item => {
        const type_item = typeof item.thumb !== 'undefined' ? ENUM.TYPE.SURVEY : ENUM.TYPE.POLL;
        if (item.id === object.id && type_object === type_item) {
          item.from_date = object.from_date;
          item.to_date = object.to_date;
          item.status = object.status;
        }
        return item
      })
      this.updateEndDateForm.closeModal()
      this.setState({
        list,
        currentObject: {},
      })
    }
    render(){
      const { currentObject } = this.state;
      const { delObject } = this.state;
      const isOwner = this.props.user.id === currentObject.user_id;
      var userAvatar = this.props.user.gender === 'Nam' ? BASE_URL + '/avtgbl.jpg' : BASE_URL + '/avtglm.jpg';
      if(isOwner && typeof this.props.user.fullAvatar !== undefined && this.props.user.fullAvatar !== null && this.props.user.fullAvatar !== '' && typeof this.props.user.fullAvatar !== 'undefined'){
        userAvatar = this.props.user.fullAvatar;
      }
        return (
            <div className="box-list-detail-project">
                <FormFilter
                projectId={this.props.projectId}
                onFilter={this.onFilter}
                localeProject={localeProject}
                user={this.props.user}
                />
                <List
                projectId={this.props.projectId}
                isBottomLoading={this.state.isBottomLoading}
                openResultModal={this.openResultModal}
                onchangeStatus={this.onChangeStatus}
                list={this.state.list}
                openUpdateEndDateModal={this.openUpdateEndDateModal}
                gotoPayment={this.gotoPayment}
                openModalConfirm={this.openModalConfirm}
                />
                <UpdateEndDate
                  ref={node => {
                    if (node) this.updateEndDateForm = node
                  }}
                  item={this.state.currentObject}
                  onChangeEndDate={this.onChangeEndDate}
                  keyPollSurvey={typeof currentObject.thumb === 'undefined' ? ENUM.TYPE.POLL : ENUM.TYPE.SURVEY}
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
                  currentObject && currentObject.user ?
                    (
                      <div className="box-item">
                        <div className="head">
                          <div className="thumb">
                            <img src={userAvatar} alt={currentObject.user.name} />
                          </div>
                          <div className="title">
                            <h3>{currentObject.user.name}</h3>
                          </div>
                          <div className="point">
                            <span className="number">{currentObject.point || 0}</span>
                            <span className="text">
                              {localePoll.POINT_RESULT}
                            </span>
                          </div>
                        </div>
                        {
                          typeof currentObject.thumb === 'undefined' ?
                          <ResultContent
                            keyPollSurvey="poll"
                            isFreePoll={!this.state.currentObject.number_vote}
                            localeCreate={localeCreate}
                            name={this.state.currentObject.name}
                            question={this.state.currentObject.question}
                            resultAnswer={this.state.resultAnswer}
                            viewResult={isOwner || this.state.currentObject[INPUT_NAME.VIEW_RESULT]}
                            viewSocial={isOwner || this.state.currentObject[INPUT_NAME.VIEW_SOCIAL]}
                            shareSocial={this.state.currentObject.shareSocial || ''}
                            isOwner={isOwner}
                            onFilterResultWithTarget={this.onFilterResultWithTarget}
                          />
                          :
                          <ResultContent
                            keyPollSurvey="survey"
                            localeCreate={localeCreate}
                            question={this.state.currentQuestion}
                            resultAnswer={this.state.resultAnswer}
                            viewResult={isOwner || currentObject[INPUT_NAME.VIEW_RESULT]}
                            viewSocial={isOwner || currentObject[INPUT_NAME.VIEW_SOCIAL]}
                            shareSocial={currentObject.shareSocial || ''}
                            listQuestions={currentObject.question}
                            getResultBaseOnQuestion={this.getResultBaseOnQuestion}
                            isOwner={isOwner}
                            onFilterResultWithTarget={this.onFilterResultWithTarget}
                          />
                        }
                      </div>
                    ) : null
                }
              </Modal>
              <Modal
                  open={this.state.openConfirm}
                  onClose={this.closeModalConfirm}
                  showCloseIcon={true}
                  classNames={{
                    overlay: 'Modal-overlay-0-1',
                    modal: 'Modal-modal-0-3 modal-confirm',
                    closeIcon: 'Modal-closeIcon-0-4'
                  }}
              >
                <div className="box-confirm">
                  <div className="title">
                    {localeProject.MESSAGE_CONFIRM_DELETE}
                  </div>
                  <div>
                    <div className="sub-title">
                      {localeProject.MESSAGE_SUBTITLE_CONFIRM}
                    </div>
                    <div className="btn-group-confirm">
                      <a className="btn btn-confirm"

                          onClick={()=>{
                              this.onChangeStatus(delObject, ACTION_EDIT_POLL_SURVEY.DELETE)
                          }}
                      >
                          {localeProject.MESSAGE_CONFIRM_DELETE}
                      </a>
                      <a className="btn btn-cancel"
                          onClick={()=>{
                              this.closeModalConfirm()
                          }}
                      >
                          {localeProject.STATUS_REFUSE}
                      </a>
                    </div>
                  </div>
                </div>
              </Modal>
            </div>
        );
    }
}

ListPollSurvey.propTypes = {
  projectId: PropTypes.string.isRequired,
}

export default withRouter(ListPollSurvey);