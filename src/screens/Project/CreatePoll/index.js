import React, { Component } from 'react';
import Alert from 'react-s-alert';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import merge from 'deepmerge';
import moment from 'moment';
import Layout from 'components/Layout';
import AddPollForm from './AddPollForm';
import ControlFormBtn from './ControlFormBtn';
import OptionsBox from './OptionsBox';
import { APIs, CHILD_ROUTE_PATH, ROUTER_PATH, BASE_URL } from 'services/config';
import { requestAPI, convertDateToString } from 'services/utils';
import { POLL_SURVEY_STATUS } from 'services/constant';
import { showLoading, hideLoading } from 'actions/ui';
import { ENUM, INPUT_NAME } from '../constant';
import { forEach, filter, isEmpty, map } from 'lodash';
import './style.css';
const {
    APPROVED,
    WAITINGFORAPPROVAL,
    WAILTINGFORPAYMENT,
    REFUSE,
    DRAFT,
    PAUSE,
    FINISH,
    RUNNING,
    SCHEDULED,
    EXPIRED
  } = POLL_SURVEY_STATUS;
  const {
    POLL_NAME,
    QUESTION_TYPE,
    DESCRIPTION,
    FROM_DATE,
    TO_DATE,
  } = INPUT_NAME;
const parseData = (list, valueKey, labelKey) => {
  return list.map(item => ({
    value: item[valueKey] || item.id,
    label: item[labelKey] || item.name,
  }));
}

const isShowPainOption = window.Config ? Boolean(window.Config.isShowPainOption) : false;
const approveMode = window.Config ? Boolean(window.Config.approveMode) : false;
class CreatePollContainer extends Component {
    constructor(props) {
        super(props);
        const { projectId } = props.match.params;
        const url = CHILD_ROUTE_PATH.PROJECT_CREATE_POLL.replace(':projectId', projectId);
        this.isCreatePoll = props.location.pathname === url;
        if (!this.isCreatePoll) {
        this.pollId = props.match.params.pollId;
        }
        const fromDate = moment();
        
        this.state = {
          hasPaidOption: !this.isCreatePoll,
          projectInfo: {},
          listCategories: [],
          listTargetsOfUser: [],
          listTargetOption: [],
          listCityOption: [],
          pollInfo: {},
          noHasPermissionEdit: false,
          isShowModalSchedule:false,
          [FROM_DATE]: fromDate,
          maxDate: moment().add(10, 'years')
        }
    }
    componentDidMount() {
        this.getAllData();
    } 
    getAllData() {
        const requests = [
          this.getProjectInfo(),
          this.getListCategories(),
          this.getTargetsOfUser(),
          this.getTargetOptions(),
          this.getCityOptions(),
        ];
    
        if (!this.isCreatePoll) {
          requests.push(this.getPollInfo())
        }
    
        this.props.showLoading()
        Promise.all(requests).then(res => {
          let projectInfo = res[0].data[0],
              listCategories = res[1].data,
              listTargetsOfUser = res[2].data,
              listTargetOption = res[3].data,
              listCityOption = res[4].data;
          let pollInfo = !this.isCreatePoll ? res[5].data : {};
          listCategories = parseData(listCategories);
          listCityOption = parseData(listCityOption, 'city_id', 'vietnamese');
          projectInfo = {
            value: projectInfo.id,
            label: projectInfo.name,
          };
          this.setState({
            hasPaidOption: !!pollInfo.number_vote && pollInfo.number_vote > 0 && (isShowPainOption || this.props.user.isadmin),
            projectInfo,
            listCategories,
            listTargetsOfUser,
            listTargetOption,
            listCityOption,
            pollInfo,
          }, () => {
              this.props.hideLoading();
          });
        }).catch(error => {
          if(Array.isArray(error.message) || typeof error.message === 'object'){
            forEach(error.message, msg => {
              msg[0] && Alert.error(msg[0]);
            })
          }else{
            Alert.error(error.message);
          }
          this.props.hideLoading();
          if (!error.success && error.message === this.props.localeCreate.PERMISSION_MSG) {
            this.setState({ noHasPermissionEdit: true })
          }
        });
    }
    getCityOptions() {
      return requestAPI({
        url: APIs.poll.getListCity.url,
        method: APIs.poll.getListCity.method,
      });
    }
  
    getPollInfo() {
      return requestAPI({
        url: APIs.poll.getPollInfoToEdit.url.replace('{pollId}', this.pollId),
        method: APIs.poll.getPollInfoToEdit.method,
      });
    }
    
    getProjectInfo() {
        const { projectId } = this.props.match.params;
        let projectInfoUrl = APIs.project.getProjectInfo.url;
        projectInfoUrl = projectInfoUrl.replace('{projectId}', projectId);
    
        return requestAPI({
          url: projectInfoUrl,
          method: APIs.project.getProjectInfo.method,
        });
    }
    
    getTargetsOfUser() {
        const { projectId } = this.props.match.params;
        const url = APIs.target.getListUserTarget.url
          .replace('{projectId}', projectId)
          .replace('{targetType}', 'poll')
        return requestAPI({
          url,
          method: APIs.target.getListUserTarget.method,
        });
    }
    
    getListCategories() {
        return requestAPI({
          url: APIs.category.getListCategories.url,
          method: APIs.category.getListCategories.method,
        });
    }
    
    getTargetOptions() {
        return requestAPI({
          url: APIs.target.getTargetOptions.url,
          method: APIs.target.getTargetOptions.method,
        });
    }
    onChangePaidOption = (e) => {
      this.setState({
        hasPaidOption: e.target.checked,
      })
    }
    updateListTargetOfUser = (entry, actions = 'add') => {
      let listTargetsOfUser;
      if(actions === 'delete'){
        listTargetsOfUser = filter(this.state.listTargetsOfUser, item => item.id !== parseInt(entry, 10))
      }else{
        listTargetsOfUser = this.state.listTargetsOfUser.concat(entry);
      }
      this.setState({
        listTargetsOfUser
      })
    }
    togggleModalSchedule = () => {
      this.setState({
        isShowModalSchedule: !this.state.isShowModalSchedule,
        maxDate: this.addQuestionBoxEl.getTodate()
      })
    }
    onChangeFromdate = (val) => {
      this.setState({
        [FROM_DATE]: val
      })
    }
    savePoll = (actions, isDisableEdit) =>{
      // validation
      const isValidOptionsBox =  this.optionBoxEl ? this.optionBoxEl.validatePaidOption() : true;
      const isValidQuestionBox = this.addQuestionBoxEl.validateQuestionBox();
      if (!isValidOptionsBox || !isValidQuestionBox) {
        return;
      }
      // get data
      const questionBoxData = this.addQuestionBoxEl.getQuestionBoxData();
      const targetData = this.optionBoxEl ? this.optionBoxEl.getTargetData() : {};
      const dataForm = merge(questionBoxData, targetData);
      // config url
      const provider = !this.isCreatePoll || this.state.pollInfo.id ?
      APIs.poll.editPoll : APIs.poll.createPoll;
      if (!this.isCreatePoll || this.state.pollInfo.id) {
        dataForm._method = 'PUT';
        provider.url = provider.url.replace('{pollId}', this.state.pollInfo.id)
      }
      // edit data
      if(isDisableEdit){
        delete dataForm.target
      }
      if (dataForm.question.question_type === ENUM.QUESTION_TYPE.NUMBER ||
          dataForm.question.question_type === ENUM.QUESTION_TYPE.DATE ||
          dataForm.question.question_type === ENUM.QUESTION_TYPE.TEXT) {
          delete dataForm.answer
      }
      const viewResultEl = document.getElementsByName(INPUT_NAME.VIEW_RESULT)[0]
      const viewSocialEl = document.getElementsByName(INPUT_NAME.VIEW_SOCIAL)[0]
      dataForm.poll[INPUT_NAME.VIEW_RESULT] = viewResultEl.checked
      dataForm.poll[INPUT_NAME.VIEW_SOCIAL] = viewSocialEl.checked

      // check paid option
      if(!this.state.hasPaidOption){
        delete dataForm.poll.number_vote
        delete dataForm.target
      }
      if(actions === SCHEDULED){
        dataForm.poll[FROM_DATE] = convertDateToString(this.state[FROM_DATE].toDate())
      }
      if(actions === DRAFT){ // DRAFT
        dataForm.poll.status = DRAFT
      }else{
        // Launch or Scheduled
        if(this.props.user.isadmin){ // là admin
          dataForm.poll.status = APPROVED // poll status đã được xét duyệt
        }else{ // không phải admin
          if((this.state.hasPaidOption && !isDisableEdit && dataForm.poll.number_vote > 0)
          || (isDisableEdit && this.state.pollInfo.number_vote < dataForm.poll.number_vote)
          ){ // nếu user chọn pain otion 
            dataForm.poll.status = WAILTINGFORPAYMENT // poll status chờ thanh toán
          }else{ // không chọn pain option
            if(!approveMode){ // không bật chế độ xét duyệt
              dataForm.poll.status = APPROVED // poll status đã được xét duyệt
            }else{ // bật chết độ xét duyệt
              dataForm.poll.status = WAITINGFORAPPROVAL // poll status đang chờ xét duyệt
            }
          }
        }
      }
      requestAPI({
        url: provider.url,
        method: provider.method,
        dataForm,
      }).then(res => {
        if(actions === SCHEDULED){
          this.togggleModalSchedule()
        }
        if (!res.success) {
          return;
        }

        Alert.success(res.message)

        if(res.data.status === APPROVED || res.data.status === RUNNING){
          
          return window.location.replace(res.data.share)
        }
        if(res.data.status === WAILTINGFORPAYMENT){
          
          const url = CHILD_ROUTE_PATH.PROJECT_POLL_SURVEY_PAYMENT
                          .replace(':type', ENUM.TYPE.POLL)
                          .replace(':pollSurveyId', res.data.id)
          
          return this.props.history.push(url)
        }
        const url =  CHILD_ROUTE_PATH.PROJECT_DETAIL.replace(':projectId', res.data.project_id)
        return window.location.replace(url)
      }).catch(error => {
        if(Array.isArray(error.message) || typeof error.message === 'object'){
          forEach(error.message, msg => {
            msg[0] && Alert.error(msg[0]);
          })
        }else{
          Alert.error(error.message);
        }
        if(actions === SCHEDULED){
          this.togggleModalSchedule()
        }
      });
    }
    renderPermissionError() {
      return (
        <div className="div-box box-create-poll">
          <div className="box-main-setting">
            <div className="alert alert-danger" role="alert">
              {this.props.localeCreate.CANNOT_EDIT_POLL_MSG}
            </div>
          </div>
        </div>
      )
    }
    render(){
        let isDisableEdit = false;
        if ( !this.isCreatePoll && !isEmpty(this.state.pollInfo) && this.state.pollInfo.status !== DRAFT) {
            isDisableEdit = true;
        }
        const { state } = this.props.location;
        const pollDataFromDashboard = state ? state.pollDataFromDashboard : undefined;
        if (this.state.noHasPermissionEdit) {
          return this.renderPermissionError()
        }
        const { projectId } = this.props.match.params;
        return(
            <form className="form form-option form-create-poll" onSubmit={(e) => e.preventDefault()}>
                <AddPollForm
                    ref={(node) => {
                        if (node) this.addQuestionBoxEl = node;
                    }}
                    projectInfo={this.state.projectInfo}
                    listCategories={this.state.listCategories}
                    pollInfo={this.state.pollInfo}
                    pollDataFromDashboard={pollDataFromDashboard}
                    isCreatePoll={this.isCreatePoll}
                    localeCreate={this.props.localeCreate}
                    isDisableEdit={isDisableEdit}
                />
                {
                  isShowPainOption || this.props.user.isadmin ?
                    <OptionsBox 
                      ref={(node) => {
                        if (node) this.optionBoxEl = node;
                      }}
                      pollInfo={this.state.pollInfo}
                      isDisableEdit={isDisableEdit}
                      isCreatePoll={this.isCreatePoll}
                      pollDataFromDashboard={pollDataFromDashboard}
                      projectInfo={this.state.projectInfo}
                      listCityOption={this.state.listCityOption}
                      listTargetsOfUser={this.state.listTargetsOfUser}
                      listTargetOption={this.state.listTargetOption}
                      updateListTargetOfUser={this.updateListTargetOfUser}
                      localeCreate={this.props.localeCreate}
                      hasPaidOption={this.state.hasPaidOption}
                      keyPollSurvey={ENUM.TYPE.POLL}
                      projectId={projectId}
                      onChangePaidOption={this.onChangePaidOption}
                      hideLoading={this.props.hideLoading}
                      isDisableEdit={isDisableEdit}
                      isAdmin={this.props.user.isadmin}
                    />  
                  : null
                }
                <ControlFormBtn
                  isDisableEdit={isDisableEdit}
                  localeCommon={this.props.localeCommon}
                  togggleModalSchedule={this.togggleModalSchedule}
                  onChangeFromdate={this.onChangeFromdate}
                  localeCreate={this.props.localeCreate}
                  savePoll={this.savePoll}
                  fromState={this.state}
                />
            </form>
        )
    }
}

CreatePollContainer = connect((state, ownProps) => ({
    ...ownProps,
    user: state.user
  }), {
    showLoading,
    hideLoading,
  })(CreatePollContainer)
  
  export default (props) => <Layout
    index={4}
    title="Poll"
    menuIcon="assessment"
    mainContent={withRouter(() => <CreatePollContainer
      {...props}
    />)}
  />