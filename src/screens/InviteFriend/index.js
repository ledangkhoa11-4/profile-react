import React, { Component } from 'react';
import Layout from 'components/Layout';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import CustomTags from 'components/CustomTags';
import Alert from 'react-s-alert';
import {
    REGEX,
  } from 'services/config';
import './style.css';
import { ENUM } from 'services/constant';
import { APIs } from 'services/config';
import { requestAPI } from 'services/utils';
import {
    FacebookShareButton,
    TwitterShareButton,
    ViberShareButton
  } from 'react-share';
import ZaloShareButton from '../../components/ZaloShareButton'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import moment from 'moment';
import {
    isEmpty
} from 'lodash';
const {
  FB,
  TW,
  ZA,
  VB
} = ENUM.SOCIAL_PROVIDER;

const timesinvitefriendfirst = window.Config ? window.Config.timesinvitefriendfirst : 5;
const timesinvitefriendnext = window.Config ? window.Config.timesinvitefriendnext : 5;
const numberofextrapoints = window.Config ? window.Config.numberofextrapoints : 100;
const pointinvited = window.Config ? window.Config.pointinvited : 5;

const localeFriend = window.locale.Friend;
class InviteFriend extends Component{
    constructor(props){
        super(props)
        this.state = {
            listEmail: [],
            historyInvites: [],
            emailsSuccess: [],
            emailsFail: [],
        }
    }
    componentDidMount(){
        this.getListHistoryInvites()
    }
    getListHistoryInvites = () =>{
        requestAPI({
            url: APIs.friends.getListHistoryInvites.url,
            method: APIs.friends.getListHistoryInvites.method,
        }).then(res =>{
            if(res.success){
                this.setState({
                    historyInvites: res.data
                })
            }
        })
    }
    onChangeListEmail = (val) =>{
        this.setState({
            listEmail: val
        })
    }
    copyClipboard = () =>{
        
        Alert.success(localeFriend.message_copy_successfull)
    }
    sendListEmail = () =>{
        if(isEmpty(this.state.listEmail)){
            Alert.error(localeFriend.message_please_enter_email)
            return;
        }
        requestAPI({
            url: APIs.friends.sendInviteListEmail.url,
            method: APIs.friends.sendInviteListEmail.method,
            dataForm: {
                list: this.state.listEmail
            }
        }).then(res =>{
            if(res.success){
                Alert.success(res.message)
                this.setState({
                    emailsSuccess: res.data.emailsSuccess,
                    emailsFail: res.data.emailsFail,
                    listEmail: [],
                })
            }else{
                this.setState({
                    emailsSuccess: [],
                    emailsFail: [],
                })
            }
        })
    }
    render(){
        const {
            user
        } = this.props;
        const fbShareUrl = `${user.shareProfile}&network=${FB}`
        const twShareUrl = `${user.shareProfile}&network=${TW}`
        const zaShareUrl = `${user.shareProfile}&network=${ZA}`
        const vbShareUrl = `${user.shareProfile}&network=${VB}`
        const linkShareUrl = `${user.shareProfile}&network=linkProvider`
        return(
            <div className="page-invite-friend">
                <div className="div-box">
                    <div className="box-main-setting">
                        <div className="title">
                            {localeFriend.title_invite_friends}
                        </div>
                        <div className="description">
                            {localeFriend.sub_title_1_invite_friends.replace(':times', timesinvitefriendfirst).replace(':star', pointinvited)} <i className="fa fa-star"></i>
                        </div>
                        <div className="sub-title">
                            {localeFriend.message_note}
                        </div>
                        <div className="description">
                            {localeFriend.sub_title_2_1_invite_friends.replace(':times', timesinvitefriendnext).replace(':star', numberofextrapoints)} <i className="fa fa-star"></i> {localeFriend.sub_title_2_2_invite_friends} <i className="fa fa-star"></i> {localeFriend.sub_title_2_3_invite_friends}
                        </div>
                        <div className="description">
                            {localeFriend.sub_title_3_invite_friends}
                        </div>
                    </div>
                </div>
                <div className="div-box">
                    <div className="box-main-setting">
                        <div className="title">
                            {localeFriend.title_invite_friend_2}
                        </div>
                        <div className="container-invite-friend">
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="send-email">
                                        <div className="sub-title">
                                            {localeFriend.title_invite_you_via_email}
                                        </div>
                                        <div className="description">
                                            <span>{localeFriend.message_input_list_email}</span> {localeFriend.message_note_input_list_email}
                                        </div>
                                        <CustomTags
                                            value={this.state.listEmail}
                                            onChange={this.onChangeListEmail}
                                            validationRegex={REGEX.EMAIL}
                                            inputProps={{
                                                placeholder: localeFriend.message_input_list_email
                                            }}
                                            onValidationReject={() => {
                                                Alert.error(localeFriend.message_please_enter_email)
                                            }}
                                        />
                                        <div className="box-btn-send-list-enmail">
                                            <a 
                                                onClick={this.sendListEmail}
                                            >
                                                {localeFriend.button_send_invite_friend}
                                            </a>
                                        </div>
                                        <div className="result-send-emails">
                                            {
                                                this.state.emailsSuccess.length > 0 ?
                                                    <div className="list-success">
                                                        <label>
                                                            {localeFriend.message_send_email_success}
                                                        </label>
                                                        {
                                                             this.state.emailsSuccess.map((item, key)=>{
                                                                return <div
                                                                            key={key}
                                                                            className="item-success"
                                                                        >
                                                                            {item}
                                                                        </div>
                                                            })
                                                        }
                                                    </div>
                                                : null
                                            }
                                            {
                                                this.state.emailsFail.length > 0 ?
                                                    <div className="list-fail">
                                                        <label>
                                                            {localeFriend.message_send_email_fail}
                                                        </label>
                                                        {
                                                             this.state.emailsFail.map((item, key)=>{
                                                                return <div
                                                                            key={key}
                                                                            className="item-fail"
                                                                        >
                                                                            {item}
                                                                        </div>
                                                            })
                                                        }
                                                    </div>
                                                : null
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="send-social">
                                        <div className="sub-title">
                                            {localeFriend.sub_title_invite_friend_2}
                                        </div>
                                        <div className="row">
                                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6">
                                                <div className="box-share fb">
                                                    <FacebookShareButton
                                                        url={fbShareUrl}
                                                    >
                                                       <img src={require('assets/images/facebook.png')} />
                                                       <span>{localeFriend.message_share_facebook}</span>
                                                    </FacebookShareButton>
                                                </div>
                                            </div>
                                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6">
                                                <div className="box-share-zalo">
                                                    <ZaloShareButton
                                                        url={zaShareUrl}
                                                    />
                                                    <div className="text">{localeFriend.message_share_zalo}</div>
                                                </div>
                                            </div>
                                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6">
                                                <div className="box-share tw">
                                                    <TwitterShareButton
                                                        url={twShareUrl}
                                                    >
                                                        <img src={require('assets/images/twitter.png')} />
                                                        <span>{localeFriend.message_share_twitter}</span>
                                                    </TwitterShareButton>
                                                </div>
                                            </div>
                                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6">
                                                <div className="box-share vb">
                                                    <ViberShareButton
                                                        url={vbShareUrl}
                                                    >
                                                        <img src={require('assets/images/viber.png')} />
                                                        <span>{localeFriend.message_share_viber}</span>
                                                    </ViberShareButton>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <div className="share-link">
                                        <div className="sub-title">
                                            {localeFriend.message_share_link_friend}
                                        </div>
                                        <div className="box-link">
                                            <CopyToClipboard 
                                                text={linkShareUrl}
                                                onCopy={this.copyClipboard}
                                                title={localeFriend.message_copy_text_to_clipboard}
                                            >
                                                <div>
                                                    <input
                                                        id="link-shareUrl"
                                                        className="input"
                                                        value={linkShareUrl}
                                                        disabled
                                                    />
                                                    <img src={require('assets/images/copy.png')}/>
                                                </div>
                                            </CopyToClipboard>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="div-box">
                    <div className="box-main-setting">
                        <div className="title">
                            {localeFriend.title_table_statistical}
                        </div>
                        <table className="table table-history">
                            <thead>
                                <tr>
                                    <th>{localeFriend.th_account_name}</th>
                                    <th>{localeFriend.th_date_joined}</th>
                                    <th>{localeFriend.th_gift}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.historyInvites.map((item, key) =>{
                                        return  <tr
                                                    key={key}
                                                >
                                                    <td>{item.name}</td>
                                                    <td>{moment(new Date(item.created_at)).format('DD/MM/YYYY')}</td>
                                                    <td>
                                                        {
                                                            item.gift > 0 ?
                                                                <div>{item.gift}  <i className="fa fa-star"></i></div>
                                                            : 
                                                                localeFriend.messages_gift_pending
                                                        }
                                                        
                                                    </td>
                                                </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

InviteFriend = connect((state, ownProps) => ({
    ...ownProps,
    networks: state.networks,
    user: state.user,
  }))(InviteFriend)
  
  const ListFriends = (props) => {
    return (
      <Layout
        index={3}
        title="Network"
        menuIcon="person_add"
        mainContent={withRouter(() => {
          return <InviteFriend {...props}/>
        })}
      />
    )
  }
export default ListFriends;