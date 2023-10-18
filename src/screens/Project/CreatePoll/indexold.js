import React, { Component } from 'react';
import Alert from 'react-s-alert';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import merge from 'deepmerge';
import Layout from 'components/Layout';
import AddQuestionBox from './AddQuestionBox';
import ControlFormBtn from './ControlFormBtn';
import OptionsBox from './OptionsBox';
import { APIs, CHILD_ROUTE_PATH, ROUTER_PATH, BASE_URL } from 'services/config';
import { requestAPI } from 'services/utils';
import { POLL_SURVEY_STATUS } from 'services/constant';
import { showLoading, hideLoading } from 'actions/ui';
import { ENUM, INPUT_NAME } from '../constant';
import { forEach } from 'lodash';

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
    // create or edit
    const { projectId } = props.match.params;
    const url = CHILD_ROUTE_PATH.PROJECT_CREATE_POLL.replace(':projectId', projectId);
    this.isCreatePoll = props.location.pathname === url;
    const { state } = props.location;
    const pollDataFromDashboard = state && state.pollDataFromDashboard;
    
    if (!this.isCreatePoll) {
      this.pollId = props.match.params.pollId;
    }

    const hrefParams = queryString.parse(window.location.search)

    if (hrefParams.hasExpired === 'true' && hrefParams.hasLaunch === 'true') {
      this.hasEditEndDate = true;
    }

    this.state = {
      hasPaidOption: !this.isCreatePoll || !!pollDataFromDashboard,
      projectInfo: {},
      listCategories: [],
      listTargetsOfUser: [],
      listTargetOption: [],
      listCityOption: [],
      pollInfo: {},
      noHasPermissionEdit: false,
      isShowPainOption: false,
      isadmin: false,
    }
  }

  componentDidMount() {
    this.getAllData();
  }  
  getAllData() {
    const { localeCreate } = this.props;
    const requests = [
      this.getProjectInfo(),
      this.getListCategories(),
      this.getTargetsOfUser(),
      this.getTargetOptions(),
      this.getCityOptions(),
      this.checkadmin(),
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
          listCityOption = res[4].data,
          isadmin = res[5].data;
      let pollInfo = !this.isCreatePoll ? res[6].data : {};
      
      listCategories = parseData(listCategories);
      listCityOption = parseData(listCityOption, 'city_id', 'vietnamese');
      
      projectInfo = {
        value: projectInfo.id,
        label: projectInfo.name,
      };
      this.setState({
        hasPaidOption: !!pollInfo.number_vote,
        projectInfo,
        listCategories,
        listTargetsOfUser,
        listTargetOption,
        listCityOption,
        pollInfo,
        isadmin,
      }, () => {
        const prefixText = this.isCreatePoll ?
          `${localeCreate.PREFIX_CREATE} ` :
          `${localeCreate.PREFIX_EDIT} `;
      });
    }).catch(error => {
      // any request fail will be got here
      console.log('Error: ', error)
      if (!error.success && error.message === ENUM.PERMISSION_MSG) {
        this.setState({ noHasPermissionEdit: true }, () => {
        })
      }
    });
  }
  checkadmin(){
    return requestAPI({
      url: APIs.profile.checkAdmin.url,
      method: APIs.profile.checkAdmin.method,
    })
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

  savePoll = (actions, isDisableEdit) => {
    console.log(actions, 'actions')
    console.log(isDisableEdit, 'isDisableEdit')
    console.log(this.state.hasPaidOption, 'hasPaidOption')
    const isValidOptionsBox = this.optionBoxEl.validatePaidOption();
    const isValidQuestionBox = this.addQuestionBoxEl.validateQuestionBox();
    if (!isValidOptionsBox || !isValidQuestionBox) {
      return;
    }
    
  //   APPROVED: 'Approved',
  // WAITINGFORAPPROVAL: 'WaitingForApproval',
  // WAILTINGFORPAYMENT: 'WaitingForPayment',
  // REFUSE: 'Refuse',
  // DRAFT: 'Draft',
  // PAUSE: 'Pause',
  // FINISH: 'Finish',
  // DELETE: 'Delete',
  // RUNNING: 'Running',
  // SCHEDULED: 'Scheduled',
  // EXPIRED: 'Expired'
  
    const questionBoxData = this.addQuestionBoxEl.getQuestionBoxData();
    const targetData = this.optionBoxEl.getTargetData();
    const provider = !this.isCreatePoll || this.state.pollInfo.id ?
      APIs.poll.editPoll : APIs.poll.createPoll;

    const dataForm = merge(questionBoxData, targetData);
    
    if(actions === 'Save'){ // Save
      dataForm.poll.status = DRAFT
    }else{
      // Launch or Scheduled
      if(this.state.isadmin){ // là admin
        dataForm.poll.status = APPROVED // poll status đã được xét duyệt
      }else{ // không phải admin
        if(this.state.hasPaidOption){ // nếu user chọn pain otion 
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
    if(isDisableEdit){
      delete dataForm.target
    }

    if (!this.isCreatePoll || this.state.pollInfo.id) {
      dataForm._method = 'PUT';
      provider.url = provider.url.replace('{pollId}', this.state.pollInfo.id)
    }

    if (dataForm.question.question_type === ENUM.QUESTION_TYPE.NUMBER ||
      dataForm.question.question_type === ENUM.QUESTION_TYPE.DATE) {
        delete dataForm.answer
    }
    const viewResultEl = document.getElementsByName(INPUT_NAME.VIEW_RESULT)[0]
    const viewSocialEl = document.getElementsByName(INPUT_NAME.VIEW_SOCIAL)[0]
    dataForm.poll[INPUT_NAME.VIEW_RESULT] = viewResultEl.checked
    dataForm.poll[INPUT_NAME.VIEW_SOCIAL] = viewSocialEl.checked
    requestAPI({
      url: provider.url,
      method: provider.method,
      dataForm,
    }).then(res => {
      if (!res.success) {
        return;
      }
      Alert.success(res.message)
      if(res.data.status === WAILTINGFORPAYMENT || ( isDisableEdit && this.state.pollInfo.number_vote < dataForm.poll.number_vote)){
        const action = isDisableEdit ? 'edit' : 'create';
        const url = CHILD_ROUTE_PATH.PROJECT_POLL_SURVEY_PAYMENT
                        .replace(':action', action)
                        .replace(':type', ENUM.TYPE.POLL)
                        .replace(':pollSurveyId', res.data.id)
                        console.log(url)
        //return this.props.history.push(url)
      }
      if(res.data.status === APPROVED){
        console.log("binh-luan")
        //return window.location.replace(BASE_URL + '/binh-luan/poll/' + res.data.id)
      }
      const url =  CHILD_ROUTE_PATH.PROJECT_DETAIL
                  .replace(':projectId', res.data.project_id)
      console.log(url)
      //return this.props.history.replace(url)
      // if ((!this.state.hasPaidOption || !isShowPainOption || this.state.isadmin) && res.data.status == POLL_STATUS.LAUNCH) {
      //   return window.location.replace(BASE_URL + '/binh-luan/poll/' + res.data.id)
      // } else {
      //   if ((
      //     !isLauchPoll && isDisableEdit &&
      //     this.state.pollInfo.number_vote < dataForm.poll.number_vote
      //   ) || isLauchPoll ) {
      //     const url = CHILD_ROUTE_PATH.PROJECT_POLL_SURVEY_PAYMENT
      //                   .replace(':type', ENUM.TYPE.POLL)
      //                   .replace(':pollSurveyId', res.data.id)
      //     return this.props.history.push(url)
      //   }
      //   if(isDisableEdit){
      //     return window.location.replace(BASE_URL + '/binh-luan/poll/' + res.data.id)
      //   }
      //   const url = CHILD_ROUTE_PATH.PROJECT_EDIT_POLL
      //                 .replace(':projectId', res.data.project_id)
      //                 .replace(':pollId', res.data.id)
      //   return this.props.history.replace(url)
      // }
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

  updateListTargetOfUser = (entry) => {
    this.setState({
      listTargetsOfUser: this.state.listTargetsOfUser.concat(entry),
    })
  }

  renderPermissionError() {
    return (
      <div className="form form-option">
        <div className="alert alert-danger" role="alert">
          { this.props.localeCreate.CANNOT_EDIT_POLL_MSG }
        </div>
      </div>
    )
  }

  onChangePaidOption = (e) => {
    this.setState({
      hasPaidOption: e.target.checked,
    })
  }

  render() {
    if (this.state.noHasPermissionEdit) {
      return this.renderPermissionError()
    }
    const { state } = this.props.location;
    const { projectId } = this.props.match.params;
    const pollDataFromDashboard = state ? state.pollDataFromDashboard : undefined;
    // for disable some inputs when edit poll
    let isDisableEdit = false;
    if (
      !this.isCreatePoll &&
      this.state.pollInfo &&
      this.state.pollInfo.status !== DRAFT
    ) {
      isDisableEdit = true;
    }
    
    return (
      <form className="form form-option" onSubmit={(e) => e.preventDefault()}>
        <AddQuestionBox
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
        <OptionsBox
          ref={(node) => {
            if (node) this.optionBoxEl = node;
          }}
          isCreatePoll={this.isCreatePoll}
          pollInfo={this.state.pollInfo}
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
          isAdmin={this.state.isadmin}
          isShowPainOption={isShowPainOption}
        />
        <ControlFormBtn
          pollInfo={this.state.pollInfo}
          savePoll={this.savePoll}
          localeCreate={this.props.localeCreate}
          localeCommon={this.props.localeCommon}
          hasPaidOption={this.state.hasPaidOption}
          isDisableEdit={isDisableEdit}
          isAdmin={this.state.isadmin}
          isShowPainOption={isShowPainOption}
        />
      </form>
    )
  }
}

CreatePollContainer = connect((state, ownProps) => ({
  ...ownProps,
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
