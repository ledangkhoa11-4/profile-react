import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { POLL_SURVEY_STATUS,ACTION_EDIT_POLL_SURVEY } from 'services/constant';

const localeProject = window.locale.Project;
const localePoll = window.locale.Poll;
const {
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
  
let Item = ({
    object,
    gotoPayment,
    openResultModal,
    onchangeStatus,
    openUpdateEndDateModal,
    openModalConfirm,
  }) => {
    const renderQuestion = () =>{
        return (
            <div 
                className='item'
                dangerouslySetInnerHTML={{
                    __html: object.thumb ? object.description : object.question.question
                }}>
            </div>
        )
    }
    const formatDate = (dateobject) => {
        const year = dateobject.getFullYear();
        let month = dateobject.getMonth() + 1;
        let date = dateobject.getDate();
        month = ('0' + month).slice(-2);
        date = ('0' + date).slice(-2);
        return `${date}/${month}/${year}`;
    }
    const renderStatus = () =>{
        switch (object.status) {
            case RUNNING:
                return (
                    <div>
                        <i className="fa fa-circle box-color-green" aria-hidden="true"></i>{localeProject.STATUS_RUNNING}
                    </div>
                );
            case PAUSE:
                return (
                    <div>
                        <i className="fa fa-circle box-color-yellow" aria-hidden="true"></i>{localeProject.STATUS_PAUSE}
                    </div>
                );
            case FINISH:
                return (
                    <div>
                        <i className="fa fa-circle  box-color-red" aria-hidden="true"></i>{localeProject.STATUS_FINISH}
                    </div>
                );
            case DRAFT:
                return (
                    <div className='box-color-blue-2'>
                         <i className="fa fa-circle-o" aria-hidden="true"></i>{localeProject.STATUS_DRAFT}
                    </div>
                );
            case WAITINGFORAPPROVAL:
                return (
                    <div className='box-color-pink'>
                        <i className="fa fa-circle-o" aria-hidden="true"></i>{localeProject.STATUS_WAITINGFORAPPROVAL}
                    </div>
                );
            case REFUSE:
                    return (
                        <div className='box-color-refuse'>
                            <i className="fa fa-circle-o" aria-hidden="true"></i>{localeProject.STATUS_REFUSE}
                        </div>
                    );
            case WAILTINGFORPAYMENT:
                return (
                    <div className='box-color-organ'>
                        <i className="fa fa-circle-o" aria-hidden="true"></i>{localeProject.STATUS_WAILTINGFORPAYMENT}
                    </div>
                );
            case SCHEDULED:
                return (
                    <div className='box-color-green-2'>
                        <i className="fa fa-circle-o" aria-hidden="true"></i>{localeProject.STATUS_SCHEDULED}
                    </div>
                );
            case EXPIRED:
                return (
                    <div className='active box-color-a7a7a7'>
                        <i className="fa fa-circle-o" aria-hidden="true"></i>{localeProject.STATUS_EXPIRED}
                    </div>
                );
            default:
                return;
        }
    }
    const fromDate = formatDate(new Date(object.from_date));
    const toDate = formatDate(new Date(object.to_date));
    return (
        <div className="item-survey-or-poll">
            <div className="title">
                {object.name}
            </div>
            <div className="box-content">
                <div className="question">
                    {renderQuestion()}
                </div>
                <div className="infomation">
                    <ul className="list-inline">
                        <li>
                            <div className="time">
                                <i className="fa fa-clock-o" aria-hidden="true"></i>{fromDate} - {toDate}
                            </div>
                        </li>
                        <li>
                            <div className="user-voted">
                                <i className="fa fa-user" aria-hidden="true"></i>{object.voted}
                            </div>
                        </li>
                        <li>
                            <div className="user-voted">
                                <i className="fa fa-tags" aria-hidden="true"></i>{object.categoryname}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="status">
                <div className="status-detail">
                    <div className="row">
                        <div className="col-xs-12 col-sm-4">
                            <div className="box-status-detail">
                                {renderStatus()}
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-8">
                            <div className="text-right">
                                {
                                    !object.gizmoLink && (object.status === RUNNING || object.status === PAUSE || object.status === FINISH || object.status === EXPIRED) ?
                                        (
                                            <a
                                            role="button"
                                            title={localePoll.RESULT_BUTTON}
                                            className="btn btn-grey"
                                            onClick={() => {
                                            openResultModal(object)
                                            }}
                                            >
                                                <span className="material-icons">&#xE801;</span>
                                                <span className="text">
                                                {localePoll.RESULT_BUTTON}
                                                </span>
                                            </a>
                                        ) : null
                                }
                                {
                                    object.status === WAILTINGFORPAYMENT  ?
                                    (
                                        <a
                                        className="btn btn-grey"
                                        style={{marginLeft: 20}}
                                        onClick={() => {
                                            gotoPayment(object)
                                        }}
                                        >
                                            <span className="material-icons">credit_card</span>
                                            <span className="text">
                                            { localeProject.PollTab.PAYMENT_BTN }
                                            </span>
                                        </a>
                                    ) : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="action-object">
                <div className="dropdown">
                    <div className="dropdown-toggle" data-toggle="dropdown">
                        <span className="fa fa-circle"></span><span className="fa fa-circle"></span><span className="fa fa-circle"></span>
                    </div>
                    
                    <ul className="dropdown-menu">
                        {
                            object.status === RUNNING  ?
                                <li>
                                    <a onClick={() => {
                                        onchangeStatus(object, ACTION_EDIT_POLL_SURVEY.PAUSE)
                                        }}
                                    >
                                        {localeProject.MESSAGE_CHANGE_STATUS_PAUSE}
                                    </a>
                                </li>
                            : null
                        }
                        {
                            object.status === SCHEDULED  ?
                                <li>
                                    <a onClick={() => {
                                        onchangeStatus(object, ACTION_EDIT_POLL_SURVEY.LAUNCHNOW)
                                        }}
                                    >
                                        {localeProject.MESSAGE_CHANGE_STATUS_LAUNCH_NOW}
                                    </a>
                                </li>
                            : null
                        }
                        {
                            object.status === PAUSE  ?
                                <li>
                                    <a onClick={() => {
                                        onchangeStatus(object, ACTION_EDIT_POLL_SURVEY.LAUNCH)
                                        }}
                                    >
                                        {localeProject.MESSAGE_CHANGE_STATUS_LAUNCH}
                                    </a>
                                </li>
                            : null
                        }
                        {
                            object.status === EXPIRED  ?
                                <li>
                                    <a onClick={() => {
                                        openUpdateEndDateModal(object)
                                        }}
                                    >
                                        {localeProject.MESSAGE_CHANGE_STATUS_RENEW}
                                    </a>
                                </li>
                            : null
                        }
                        {
                            object.status === RUNNING || object.status === SCHEDULED 
                            || object.status === EXPIRED || object.status === PAUSE  
                            || object.status === WAITINGFORAPPROVAL ?
                                <li>
                                    <a onClick={() => {
                                        onchangeStatus(object, ACTION_EDIT_POLL_SURVEY.FINISH)
                                        }}
                                    >
                                        {localeProject.MESSAGE_CHANGE_STATUS_FINISH}
                                    </a>
                                </li>
                            : null
                        }
                        {
                            object.status === REFUSE  ?
                                <li>
                                    <a onClick={() => {
                                        onchangeStatus(object, ACTION_EDIT_POLL_SURVEY.SUBMITAPPROVAL)
                                        }}
                                    >
                                        {localeProject.MESSAGE_CHANGE_STATUS_SUBMIT_APPROVAL}
                                    </a>
                                </li>
                            : null
                        }
                        {
                            object.status === RUNNING || object.status === SCHEDULED 
                            || object.status === EXPIRED || object.status === PAUSE
                            || object.status === DRAFT || object.status === REFUSE
                            || object.status === WAITINGFORAPPROVAL   ?
                                <li>
                                    <a onClick={() => {
                                        onchangeStatus(object, ACTION_EDIT_POLL_SURVEY.EDIT)
                                        }}
                                    >
                                        {localeProject.MESSAGE_CHANGE_STATUS_EDIT}
                                    </a>
                                </li>
                            : null
                        }
                        {
                            object.status === WAILTINGFORPAYMENT ?
                                <li>
                                    <a onClick={() => {
                                        openUpdateEndDateModal(object)
                                        }}
                                    >
                                        {localeProject.MESSAGE_CHANGE_STATUS_EDIT}
                                    </a>
                                </li>
                            : null
                        }
                        
                        {
                            object.status === DRAFT || object.status === WAILTINGFORPAYMENT
                            || object.status === FINISH ?
                                <li>
                                    <a onClick={() => {
                                        openModalConfirm(object)
                                        }}
                                    >
                                        {localeProject.MESSAGE_CHANGE_STATUS_DELETE}
                                    </a>
                                </li>
                            : null
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
  }



  Item.propTypes = {
    Item: PropTypes.shape({
      name: PropTypes.string,
      question: PropTypes.object,
    })
  };
  
  Item = connect((state, ownProps) => ({
    ...ownProps,
  }))(Item);
  
  export default Item;
  