import React, { Component } from 'react';
import {
  cloneDeep,
  isEmpty,
  filter,
  reduce,
} from 'lodash';
import { APIs } from 'services/config';
import Alert from 'react-s-alert';
import {
  COMPARE_VAL,
  INPUT_NAME,
  ENUM,
  MAX_DISTANCE_TARGETS,
} from '../../../constant';
import Modal from 'react-responsive-modal';
import { POLL_STATUS } from 'services/constant';
import { requestAPI, getTokenCookie, formatPrice } from 'services/utils';
import NumberVote from '../NumberVote';
import ListGroupTarget from './ListGroupTarget';
import './style.css';


const { PAID_CHECKBOX } = INPUT_NAME;
const pricePoll = window.Config ? window.Config.pricePoll : 2000;
const priceSurvey = window.Config ? window.Config.priceSurvey : 4000;
const CurrencySupport = window.CurrencySupport ? window.CurrencySupport : null;
const Currency = window.Currency ? window.Currency : 'VND';
const localeCreate = window.locale.Create;

class PaidOptionContainer extends Component {

  state = {
    isLoadingQuestionTarget: false,
    listPollSurvey: [],
    nextUrlPollSurvey: '',
    groupTarget: [],
    expandValGroup: [],
    isShowBottomAddGroupBtn: false,
    listUserFilter: [],
    isShowButtonDownLoad: false,
    isShowModalConfirm: false,
    idGroupConfirm: -1,
    estimatedCost: ''
  }
  componentWillMount() {
    if (!this.props.isCreatePoll || this.props.disableChangePaidOption) {
      clearTimeout(this.timeout)
      this.timeout = setInterval(() => {
        if (!isEmpty(this.props.pollInfo)) {
          clearInterval(this.timeout);

          // get array poll/survey id
          const pollSurveyId = reduce(this.props.pollInfo.group, (totalResult, groupItem) => {
            let temp1 = reduce(groupItem.target, (total1, targetItem) => {
              let temp2 = reduce(targetItem.question, (total2, questionItem) => {
                if (total2.indexOf(questionItem[`${this.props.keyPollSurvey}_id`]) === -1) {
                  total2.push(questionItem[`${this.props.keyPollSurvey}_id`])
                }
                return total2
              }, [])

              temp2 = filter(temp2, item => total1.indexOf(item) === -1)
              return total1.concat(temp2)
            }, [])

            temp1 = filter(temp1, item => totalResult.indexOf(item) === -1)
            return totalResult.concat(temp1)
          }, [])

          let postData = {}
          if (pollSurveyId.length) {
            postData[this.props.keyPollSurvey] = pollSurveyId
          }
          
          this.requestListPollSurvey({
            postData,
            isShowPageLoading: true,
          })
          this.initGroupTargetData();
        }
      }, 500);
    } else {
      this.requestListPollSurvey({
        postData: null,
        isShowPageLoading: true,
      })
    }
  }
  addEmptyGroup = () => {
    clearTimeout(this.timeoutAddGroup)
    this.timeoutAddGroup = setTimeout(() => {
      const groupTargetClone = cloneDeep(this.state.groupTarget)
      const _expandValGroup = [...this.state.expandValGroup]
      groupTargetClone.push({
        compare: COMPARE_VAL.AND,
        value: [],
      })
      _expandValGroup.push(true)
      this.setState({
        groupTarget: groupTargetClone,
        expandValGroup: _expandValGroup,
      })
    }, 300)
  }

  initGroupTargetData() {
    const {
      // listCityOption,
      pollInfo,
    } = this.props;
    const groupTarget = !isEmpty(pollInfo.group) ?
      cloneDeep(pollInfo.group) : [];
    const expandValGroup = groupTarget.map(item => false)

    if (!isEmpty(groupTarget)) {
      groupTarget.forEach(target=> {
        target.value = target.target
        delete target.target
      });
    }

    this.setState({
      expandValGroup,
      groupTarget,
    })
  }
 
  getPaidOptData = () => {
    if(!this.props.hasPaidOption){
      return {};
    }
    const data = {
      [this.props.keyPollSurvey]: {
        number_vote: this.numberVoteEl.getNumberVote(),
      }
    }
    if (this.groupTargetEl) {
      data.target = {
        targets: this.groupTargetEl.getGroupTargetValue()
      }
    }
    return data;
  }

  onChangeCondition = (idx, value) => {
    const cloneTargetGroup = cloneDeep(this.state.groupTarget)
    cloneTargetGroup[idx].compare = value;
    this.setState({ groupTarget: cloneTargetGroup },()=>{
      this.getListUserFilter()
    })
  }

  onLoadmorePollSurvey = () => {
    clearTimeout(this.timeoutMorePollSurvey)
    this.timeoutMorePollSurvey = setTimeout(() => {
      if (!this.state.nextUrlPollSurvey || this.state.isLoadingQuestionTarget) {
        return;
      }
      this.requestListPollSurvey({isShowPageLoading: false})
    }, 150)
  }

  onRemoveOneGroup = (idx) => {
    if(idx === - 1){
      this.closeModalConfirm()
      return;
    }
    let _groupTarget = cloneDeep(this.state.groupTarget)
    let _expandValGroup = [...this.state.expandValGroup]
    _groupTarget = filter(_groupTarget, (target, index) => idx !== index)
    _expandValGroup = filter(_expandValGroup, (val, index) => index !== idx)

    this.setState({
      isShowModalConfirm: false,
      idGroupConfirm: -1,
      groupTarget: _groupTarget,
      expandValGroup: _expandValGroup,
    },()=>{
      this.getListUserFilter()
      this.closeModalConfirm()
    })
  }
  onToggleExpandGroup = (idx) => {
    let _expandValGroup = [...this.state.expandValGroup]
    _expandValGroup[idx] = !_expandValGroup[idx]
    this.setState({ expandValGroup: _expandValGroup })
  }
  requestListPollSurvey({isShowPageLoading, postData}) {
    const { keyPollSurvey } = this.props;
    const { projectId } = this.props;
    const pollRequest = APIs.poll.listPollSurveyForTarget;
    const surveyRequest = APIs.project.getListSurveys;
    let requestProvider;

    if (keyPollSurvey === ENUM.TYPE.POLL) {
      // get question of poll
      requestProvider = pollRequest;
    } else if (keyPollSurvey === ENUM.TYPE.SURVEY) {
      // get question of a survey
      requestProvider = surveyRequest;
    }

    let url = requestProvider.url.replace('{projectId}', projectId)
    if (this.state.nextUrlPollSurvey) {
      url = this.state.nextUrlPollSurvey
    }

    this.setState({
      isLoadingQuestionTarget: true,
    })
    
    requestAPI({
      url,
      method: requestProvider.method,
      isShowPageLoading,
      dataForm: postData,
    }).then(res => {
      if (!res.success) {
        return;
      }

      if (isShowPageLoading) {
        if (
          (
            this.props.keyPollSurvey === ENUM.TYPE.SURVEY &&
            !this.props.isCreatePoll
          ) || this.props.keyPollSurvey === ENUM.TYPE.POLL
        ) {
          this.props.hideLoading()
        }
      }
      
      const listPollSurvey = filter(res.data.data, item => {
        return item.status === POLL_STATUS.LAUNCH
      })
      this.setState({
        isLoadingQuestionTarget: false,
        listPollSurvey: this.state.listPollSurvey.concat(listPollSurvey),
        nextUrlPollSurvey: res.data.next_page_url,
      })
    })
  }
  getListUserFilter = () => {
    const targetData = this.groupTargetEl.getGroupTargetValue();
    requestAPI({
      url: APIs.target.getListUserFilter.url,
      method: APIs.target.getListUserFilter.method,
      dataForm: targetData,
      }).then(res => {
        if(res.success){
          this.setState({
            listUserFilter: res.data,
          })
        }
    });
  }
  downloadlistuser = () => {
      let url = '';
      url = APIs.resultCsv.downLoadListUserFilter.url;
      const listUser = this.state.listUserFilter.map((user, idx)=>{
        return user.id;
      });
      if (url) {
        url += `?api_token=${getTokenCookie()}&listUser=${listUser}`
      } else {
        return;
      }
      window.open(url, '_blank');
  }
  validatePaidOption = () => {
    if(!this.numberVoteEl){
      return true;
    }
    return this.numberVoteEl.validateNumberVote()
  }
  openModalConfirm = (idx) => {
    this.setState({
      isShowModalConfirm: true,
      idGroupConfirm: idx
    })
  }
  closeModalConfirm = () =>{
    this.setState({
      isShowModalConfirm: false,
      idGroupConfirm: -1
    })
  }
  renderEstimatedCost = (number) =>{
    if(!this.props.hasPaidOption){
      return;
    }
    let numberVote = number;
    if(this.props.isDisableEdit){
      numberVote = numberVote - this.props.pollInfo.number_vote;
    }
    let ratio, price, total, CurrencyShow;
    if(Currency === 'USD'){
      ratio = CurrencySupport.USD;
      CurrencyShow = 'USD';
    }else{
      ratio = CurrencySupport.VND;
      CurrencyShow = 'VND';
    }
    if(this.props.keyPollSurvey === ENUM.TYPE.POLL){
      price = pricePoll;
    }else{
      price = priceSurvey;
    }
    total = formatPrice((price * numberVote + price * numberVote * (10 / 100)) / ratio);
    this.setState({
      estimatedCost: total + ' ' + CurrencyShow
    })
  }
  render() {
    const classBtnAddGroup = this.state.groupTarget.length >= 1 ? 'box-add-answer active' : 'box-add-answer';
    return (
      <div className="div-box paid-option-container box-create-poll">
        <div className="box-main-setting">
            <div className="chooose-paid-option">
                  <div className="answer-advanced-settings">
                      <div className="custom-checkbox-1">
                          <input
                          id={PAID_CHECKBOX}
                          type="checkbox"
                          name={PAID_CHECKBOX}
                          checked={this.props.hasPaidOption}
                          onChange={this.props.onChangePaidOption}
                          />
                          <div className="checkbox-visible"></div> 
                      </div>
                      <label htmlFor={PAID_CHECKBOX} className="text-settings noselect">
                          {localeCreate.messages_paid_option} <span>{localeCreate.messages_paid}</span>
                      </label>
                  </div>
              </div>
              {
                  this.props.hasPaidOption ?
                      <div className="paid-option">
                          <div className="description">
                              {localeCreate.description_paid_option}
                          </div>
                          <div className="title">
                              {localeCreate.messages_choose_number_votes}
                          </div>
                          <NumberVote
                              ref={node => {
                                  if (node) this.numberVoteEl = node;
                              }}
                              pollInfo={this.props.pollInfo}
                              isDisableEdit={this.props.isDisableEdit}
                              renderEstimatedCost={this.renderEstimatedCost}
                          />
                          {
                            !this.props.isDisableEdit ?
                              <div>
                                <ListGroupTarget
                                  ref={node => {
                                    if (node) this.groupTargetEl = node
                                  }}
                                  keyPollSurvey={this.props.keyPollSurvey}
                                  listCityOption={this.props.listCityOption}
                                  listTargetsOfUser={this.props.listTargetsOfUser}
                                  listTargetOption={this.props.listTargetOption}
                                  updateListTargetOfUser={this.props.updateListTargetOfUser}
                                  listPollSurvey={this.state.listPollSurvey}
                                  groupTarget={this.state.groupTarget}
                                  projectId={this.props.projectId}
                                  projectInfo={this.props.projectInfo}
                                  isLoadingQuestionTarget={this.state.isLoadingQuestionTarget}
                                  expandValGroup={this.state.expandValGroup}
                                  onChangeCondition={this.onChangeCondition}
                                  onLoadmorePollSurvey={this.onLoadmorePollSurvey}
                                  onRemoveOneGroup={this.onRemoveOneGroup}
                                  onToggleExpandGroup={this.onToggleExpandGroup}
                                  getListUserFilter={this.getListUserFilter}
                                  openModalConfirm={this.openModalConfirm}
                                  isAdmin={this.props.isAdmin}
                                />
                                <Modal
                                    open={this.state.isShowModalConfirm}
                                    onClose={this.closeModalConfirm}
                                    showCloseIcon={true}
                                    classNames={{
                                        overlay: 'Modal-overlay-0-1 modal-confirm-delete-group-target',
                                        modal: 'Modal-modal-0-3',
                                        closeIcon: 'Modal-closeIcon-0-4'
                                    }}
                                >
                                    <div className="confirm-delete-group-target">
                                        <div className="title">
                                          {localeCreate.Delete_audience_group}
                                        </div>
                                        <div className="note">
                                          {localeCreate.messages_when_delete_group_target}
                                        </div>
                                        <div className="group-btn-action">
                                            <div className="row">
                                              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                                <a
                                                  onClick={this.closeModalConfirm}
                                                >
                                                  {localeCreate.messages_cancel}
                                                </a>
                                              </div>
                                              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                                <a
                                                  onClick={() => this.onRemoveOneGroup(this.state.idGroupConfirm)}
                                                >
                                                    {localeCreate.TARGET_SAVE}
                                                </a>
                                              </div>
                                            </div>
                                        </div>
                                    </div>
                                </Modal>
                                <div className="add-empty-group"> 
                                    <div className={classBtnAddGroup}>
                                        <a
                                            role="button" 
                                            title={localeCreate.messages_add_survey_subjects}
                                            className="add-answer"
                                            onClick={this.addEmptyGroup}
                                        >
                                            <span className="fa fa-plus"></span>
                                            <span className="text">&nbsp;{localeCreate.messages_add_new_groups}</span>
                                        </a>
                                    </div>
                                </div>
                              </div>
                            : null
                          }
                          <div className="box-quatity-user-filter-and-total-money">
                            <div className="row">
                              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                {
                                  !this.props.isDisableEdit ?
                                    <div className="text-left">
                                      {localeCreate.Estimated_number_of_users} <strong>{formatPrice(this.state.listUserFilter.length)}</strong>
                                      {
                                        this.state.listUserFilter.length > 0 && this.props.isAdmin ?
                                          <a
                                            onClick={this.downloadlistuser}
                                          >
                                            <span className="fa fa-cloud-download"></span> {localeCreate.messages_dowload_list_user}
                                          </a>
                                        : null
                                      }
                                    </div>
                                  : null
                                }
                              </div>
                              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                  {
                                    !isEmpty(this.state.estimatedCost) ? 
                                      <div className="text-right">
                                        {localeCreate.messages_estimated_cost} <strong>{this.state.estimatedCost}</strong>
                                      </div>
                                    : null
                                  }
                              </div>
                            </div>
                          </div>
                      </div>
                  : null
              }
          </div>
      </div>
    );
  }
}

export default PaidOptionContainer;
