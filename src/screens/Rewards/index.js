import React, { Component } from 'react';
import { connect } from 'react-redux';
import Layout from 'components/Layout';
import './style.css';
import Alert from 'react-s-alert';
import { updateUserPoint, updeteUserPhone } from 'actions/profile';
import { APIs, BASE_URL, ROUTER_PATH, REGEX } from 'services/config';
import { Link } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import { forEach, isEmpty } from 'lodash';
import {
    formatDate,
    formatPrice,
    requestAPI,
  } from 'services/utils';
  
const localeCommon = window.locale.Common;
const localeReward = window.locale.Reward;

class RewardContent extends Component{
    constructor(props) {
        super(props)
        this.state = {
            valueVoucher: 0,
            starVoucher: 0,
            listValueVoucher: [],
            listPoint: [],
            quantityVoucher: 1,
            isOpen: false,
            isShowChangePhone: false,
            phone: '03'
        }
    }
    
    componentDidMount(){
        this.getListValueVoucher();
        this.getListHistoryPoint();
    }
    getvalueVoucher = (e) => {
        const id = e.target.value;
        const list = this.state.listValueVoucher;
        for (let i = 0; i < list.length; i++) {
            if(list[i].id === parseInt(id, 10)){
                this.setState({
                    valueVoucher: list[i].value,
                    starVoucher: list[i].star
                },()=>{
                    return;
                })
            }
        }
    }
    getListValueVoucher = () => {
        requestAPI({
            url: APIs.rewards.getListValueVoucher.url,
            method: APIs.rewards.getListValueVoucher.method,
          }).then(res => {
              if(res.success){
                  this.setState({
                      listValueVoucher: res.data
                  })
              }
          })
    }
    getListHistoryPoint = () =>{
        requestAPI({
            url: APIs.listPoint.url,
            method: APIs.listPoint.method,
          }).then(res => {
              if(res.success){
                  this.setState({
                        listPoint: res.data
                  })
              }
          })
    }
    renderListVouchervalue = () => {
        return (
            this.state.listValueVoucher.map((valueVoucher, idx) => {
                const value =  parseInt(valueVoucher.value, 10);
                return  <div key={idx} className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                            <div className="radio">
                                <label className={
                                    this.state.valueVoucher === value
                                    ? 'radio-container checked'
                                    : 'radio-container'
                                }>
                                    {formatPrice(valueVoucher.value)} vnđ <br/>
                                    {valueVoucher.star} <i className="fa fa-star"></i>
                                    <input type="radio" 
                                    onChange={this.getvalueVoucher}
                                    checked={this.state.valueVoucher === value}
                                    value={valueVoucher.id}/>
                                    <span className="checkmark"></span>
                                </label>
                            </div>
                        </div>
            })
        )
    }
    onPlusQuantity = (action) =>{
        const quantity = action ? this.state.quantityVoucher + 1 :  this.state.quantityVoucher - 1;
        if(quantity >= 0){
            this.setState({
                quantityVoucher: quantity
            })
        }
    }
    onChangeQuantity = (e) =>{
        const value = e.target.value;
        if(!isNaN(value) && value >= 0){
            this.setState({
                quantityVoucher: parseInt(value, 10)
            })
        }
    }
    onReward = () =>{
        if(this.props.user.verified_phone){
            this.closeModal();
            this.getVoucher();
        }else{
            this.verifyPhone()
        }
    }
    getVoucher(){
        const value = parseInt(this.state.valueVoucher, 10);
        const stars = parseInt(this.state.starVoucher, 10);
        const quantity = parseInt(this.state.quantityVoucher, 10);
        requestAPI({
          url: APIs.rewards.getVoucher.url,
          method: APIs.rewards.getVoucher.method,
          dataForm: {
            value: value,
            stars: stars,
            quantity: quantity,
          },
        }).then(res => {
            if(res.success){
                Alert.success(res.message)
                if(typeof res.data !== 'undefined'){
                    this.props.updateUserPoint(res.data);
                    this.getListHistoryPoint();
                }
            }
        }).catch(error =>{
            if(typeof error.message !== 'undefined' && typeof error.message.code !== 'undefined'){
                if(error.message.code === 1){ 
                    this.props.updateUserPoint(error.message.point);
                    this.getListHistoryPoint();
                    Alert.error(error.message.messages)
                }
            }
            if(typeof error.message !== 'undefined'){
                Alert.error(error.message)
            }
        })
    }
    verifyPhone = () => {
        window.location.replace(ROUTER_PATH.GIFT_VERIFY)
    }
    onModelAccept = () =>{
        this.setState({
            isOpen: true
        })
    }
    closeModal = ()=>{
        this.setState({
            isOpen: false,
            isShowChangePhone: false
        })
    }
    onShowChangePhone = () =>{
        this.setState({
            isShowChangePhone: true
        })
    }
    onChangeInputPhone = (e) =>{
        
        const value = e.target.value;
        if(value.match(REGEX.DIGIT)){
            this.setState({
                phone: value
            })
        }else{
            Alert.error(localeCommon.ERROR_NUMBER_MSG)
        }
    }
    onChangePhone = () =>{
        const phone = this.state.phone;
        requestAPI({
            url: APIs.profile.updateUserPhone.url,
            method: APIs.profile.updateUserPhone.method,
            dataForm: {
                phone: phone
            }
          }).then(res => {
              if(res.success){
                Alert.success(res.message);
                this.props.updeteUserPhone(res.data.phone, res.data.verified_phone);
                this.closeModal();
                setTimeout(() => {
                    this.verifyPhone();
                }, 2000);
              }
          }).catch(error => {
            if(typeof error.message === 'object'){
                forEach(error.message, msg => {
                  msg[0] && Alert.error(msg[0]);
                })
              }else{
                Alert.error(error.message)
              }
          })
    }
    renderBodyModal = () => {
        if(this.props.user.verified_phone === true && !isEmpty(this.props.user.phone)){
            return (
                <div>
                    <div className="sub-title">
                        {localeReward.message_confirm_phone} <strong>{this.props.user.phone}</strong>?
                    </div>
                    <div className="btn-group-accept-phone">
                        <a className="btn btn-phone-be-my"
                            onClick={()=>{
                                this.onReward()
                            }}
                        >
                            {localeReward.message_agree_gift}
                        </a>
                        <a className="btn btn-phone-not-mine"
                            onClick={()=>{
                                this.closeModal()
                            }}
                        >
                            {localeReward.messages_cancel}
                        </a>
                    </div>
                </div>
            )
        }else{
            if(isEmpty(this.props.user.phone)){
                return (
                    <div>
                        <div className="sub-title">
                            {localeReward.message_add_phone_gift}
                        </div>
                        <div className="btn-group-accept-phone">
                            <a className="btn btn-phone-be-my"
                                onClick={()=>{
                                    this.verifyPhone()
                                }}
                            >
                                {localeReward.message_action_add_phone_gift}
                            </a>
                            <a className="btn btn-phone-not-mine"
                                onClick={()=>{
                                    this.closeModal()
                                }}
                            >
                                {localeReward.messages_cancel}
                            </a>
                        </div>
                    </div>
                )
            }else{
                return (
                    this.state.isShowChangePhone ?
                        <div>
                            <div className="sub-title">
                                {localeReward.note_change_phone}
                            </div>
                            <div className="box-change-phone">
                                <div className="form-group">
                                    <input 
                                        type="text"
                                        className="form-control"
                                        onChange={
                                            this.onChangeInputPhone
                                        }
                                        value={this.state.phone}
                                    />
                                </div>
                                <div className="box-action-change-phone">
                                    <a className="btn btn-action-change-phone"
                                        onClick={() =>{
                                            this.onChangePhone()
                                        }}
                                    >
                                        {localeReward.Change}
                                    </a>
                                </div>
                            </div>
                        </div>
                    :
                        <div>
                            <div className="sub-title">
                                {localeReward.messages_phone_1} <strong>{ this.props.user.phone }</strong> {localeReward.messages_phone_2}
                            </div>
                            <div className="btn-group-accept-phone">
                                <a className="btn btn-phone-be-my"
                                    onClick={()=>{
                                        this.verifyPhone()
                                    }}
                                >
                                    {localeReward.message_action_verify_phone_gift}
                                </a>
                                <a className="btn btn-phone-not-mine"
                                    onClick={()=>{
                                        this.onShowChangePhone()
                                    }}
                                >
                                    {localeReward.Not_mine}
                                </a>
                            </div>
                        </div>
                )
            }
        }
    }
    render(){
        const reward = BASE_URL + "/assetsnew/img/reward.png";
        const gift = BASE_URL + '/assetsnew/icon/gift.png';
        const mobilegift = BASE_URL + '/assetsnew/img/gift.jpg';
        const totalVoucher = this.state.quantityVoucher * this.state.valueVoucher;
        const totalStar = this.state.quantityVoucher * this.state.starVoucher;
        return (
            <div className="div-box box-reward">
                <div className="box-main-setting">
                    <div className="box-reward-head">
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="reward-head">
                                    <div className="title">
                                        {localeReward.Amount} <i className="fa fa-star"></i> {localeReward.now_available}:
                                    </div>
                                    <div className="point">
                                        {this.props.user.point}
                                    </div>
                                    <div className="description">
                                        <ul>
                                            {
                                                this.state.listPoint.map((item, idx)=>{
                                                    return <li key={idx}>
                                                                {item.point} <i className="fa fa-star"></i> {localeReward.will_expire_on} {formatDate(item.expired)}
                                                            </li>
                                                })
                                            }
                                        </ul>
                                    </div>
                                    <div className="history">
                                        <Link
                                            className="btn-history btn"
                                            to={ROUTER_PATH.REWARD_HISTORY}
                                        >
                                            {localeReward.HISTORYREWARD}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="img-reward">
                                    <img src={reward} alt={this.props.user.name}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="box-main-setting">
                    <div className="box-reward-boby">
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="title">
                                    <img src={gift}  alt="iconreward"/>
                                    <span>{localeReward.MY_REWARD}</span>
                                </div>
                                <div className="description">
                                    <p>{localeReward.star} <i className="fa fa-star"></i> {localeReward.title_gift_net_work}</p>
                                    <p>{localeReward.sub_title_gift_net_work}</p>
                                </div>
                                <div className="main-body-reward">
                                    <div className="description-2">
                                        {localeReward.Choose_gift_value}:
                                    </div>
                                    <div className="row">
                                        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                            <div className="img-mobilegift">
                                                <img src={mobilegift}  alt="reward"/>
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                                            <div className="choose-gift">
                                                <div className="box-radio">
                                                    <div className="row">
                                                        {this.renderListVouchervalue()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="box-choose-quantity-voucher noselect">
                                                <div className="title">{localeReward.AMOUNT}:</div>
                                                <div className="choose-quantity-voucher">
                                                    <a
                                                        onClick={() => {
                                                            this.onPlusQuantity(false)
                                                        }}
                                                        className="btn-onchange-quantity"
                                                    >
                                                        <i className="fa fa-minus"></i>
                                                    </a>
                                                    <input 
                                                        type="text"
                                                        onChange={
                                                            this.onChangeQuantity
                                                        }
                                                        value={this.state.quantityVoucher}
                                                    />
                                                    <a
                                                        onClick={() => {
                                                            this.onPlusQuantity(true)
                                                        }}
                                                        className="btn-onchange-quantity"
                                                    >
                                                        <i className="fa fa-plus"></i>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="line-2px"></div>
                                            <div className="total-reward">
                                                <div className="total">
                                                        {localeReward.TOTAL}: {formatPrice(totalVoucher)} VNĐ = {totalStar} <i className="fa fa-star"></i>
                                                </div>
                                                {
                                                    totalVoucher > 0 ? 
                                                    <div>
                                                        <a className="btn-reward btn"
                                                            onClick={()=>{
                                                                this.onModelAccept()
                                                            }}
                                                        >
                                                            {localeReward.COMFIRM}
                                                        </a>
                                                    </div>: null
                                                }
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                  open={this.state.isOpen}
                  onClose={this.closeModal}
                  showCloseIcon={true}
                  classNames={{
                    overlay: 'Modal-overlay-0-1 modal-verify-phone-reward',
                    modal: 'Modal-modal-0-3',
                    closeIcon: 'Modal-closeIcon-0-4'
                  }}
                >
                    <div className="verify-phone-reward">
                        <div className="title">
                            <img src={gift} alt="Image"/> {localeReward.Confirm_phone_number}
                        </div>
                        {
                            this.renderBodyModal()
                        }
                    </div>
                </Modal>
            </div>
        )
    }
}

RewardContent = connect((state, ownProps) => ({
    ...ownProps,
    user: state.user,
  }), {
    updateUserPoint,
    updeteUserPhone,
  })(RewardContent)
  
  const Rewards = () => {
    return (
      <Layout
        index={2}
        title="Reward"
        menuIcon="card_giftcard"
        mainContent={RewardContent}
      />
    )
  }
  
  export default Rewards;