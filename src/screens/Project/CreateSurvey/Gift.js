import React, { Component } from 'react';
import Description from 'components/Description';
import Alert from 'react-s-alert';
import { isEmpty } from 'lodash';
import { jsonEqual } from 'services/utils';
import {
    INPUT_NAME,
} from '../constant';
const {
    GIFT
  } = INPUT_NAME;

class Gift extends Component{
    constructor(props){
        super(props)
        this.state = {
            giftType: 'artifacts',
            gift: '',
            star: '',
            isValidStar: true,
            isValidGift: true
        }
    }
    componentWillReceiveProps(nextProps) {
        if (jsonEqual(this.props, nextProps) || isEmpty(nextProps.surveyInfo)) {
          return;
        }
        if(!isEmpty(nextProps.surveyInfo[GIFT])){
            const gift = nextProps.surveyInfo[GIFT]
            this.setState({
                gift
            })
        }else{
            const giftType = 'star'
            const star = nextProps.surveyInfo.point
            this.setState({
                giftType,
                star
            })
        }
    }
    onChangeGiftType = (e) => {
        const { value } = e.target;
        this.setState({
            giftType:  value
        })
    }
    onChangeGift = (data) =>{
        this.setState({
            gift: data
        })
    }
    onChangeStar = (e) => {
        const { value } = e.target;
        if(isNaN(parseInt(value, 10))){
            return;
        }
        this.setState({
            star: value
        })
    }
    validate = () => {
        if(this.state.giftType === 'artifacts'){
            let isValidGift = true;
            if(!this.state.gift){
                isValidGift = false;
                Alert.error(this.props.localeCreate.message_please_enter_gifts_in_kind, {
                    timeout: 5000,
                })
            }
            this.setState({
                isValidGift
            })
            return isValidGift;
        }else{
            let isValidStar = true;
            if(!this.state.star){
                isValidStar = false;
                Alert.error(this.props.localeCreate.message_please_enter_number_of_stars, {
                    timeout: 5000,
                })
            }
            this.setState({
                isValidStar
            })
            return isValidStar;
        }
    }
    getGift = () =>{
        if(this.state.giftType === 'artifacts'){
            return {
                giftType: 'artifacts',
                gift: this.state.gift
            }
        }else{
            return {
                giftType: 'star',
                gift: parseInt(this.state.star, 10)
            }
        }
    }
    render(){
        return(
            <div className="div-box paid-option-container box-choose-gift-survey box-create-poll">
                <div className="box-main-setting">
                    <div className="chooose-paid-option">
                        <div className="answer-advanced-settings">
                            <div className="custom-checkbox-1">
                                <input
                                id="gift-option"
                                type="checkbox"
                                name="gift-option"
                                checked={this.props.hasGiftOption}
                                onChange={this.props.onChangeGiftOption}
                                />
                                <div className="checkbox-visible"></div> 
                            </div>
                            <label htmlFor="gift-option" className="text-settings noselect">
                                {this.props.localeCreate.message_title_gift_option}
                            </label>
                        </div>
                    </div>
                    {
                        this.props.hasGiftOption ? 
                            <div className="main-choose-gift-survey">
                                <div className="form-group box-artifacts">
                                    <div className="custom-checkbox-small">
                                        <div className="custom-checkbox-1">
                                            <input
                                                id="gift-type-artifacts"
                                                name='gift-type'
                                                type='radio'
                                                value='artifacts'
                                                checked={this.state.giftType === 'artifacts'}
                                                onChange={this.onChangeGiftType}
                                            />
                                            <div className="radio-visible"></div>
                                        </div>
                                        <label htmlFor="gift-type-artifacts">
                                            {this.props.localeCreate.message_gift_option_1}
                                        </label>
                                    </div>
                                    {
                                        this.state.giftType === 'artifacts' ? 
                                            <div className="row artifacts">
                                                <Description 
                                                    data={this.state.gift}
                                                    onChange={this.onChangeGift}
                                                    isValidDescription={this.state.isValidGift}
                                                />
                                            </div>
                                        : null
                                    }
                                </div>
                                <div className="form-group box-star">
                                    <div className="custom-checkbox-small">
                                        <div className="custom-checkbox-1">
                                            <input
                                                id="gift-type-star"
                                                name='gift-type'
                                                type='radio'
                                                value='star'
                                                checked={this.state.giftType === 'star'}
                                                onChange={this.onChangeGiftType}
                                            />
                                            <div className="radio-visible"></div>
                                        </div>
                                        <label htmlFor="gift-type-star">
                                            {this.props.localeCreate.message_gift_option_2} <i className="fa fa-star"/>
                                        </label>
                                    </div>
                                    {
                                        this.state.giftType === 'star' ? 
                                            <div>
                                                <input
                                                    className="form-control"
                                                    value={this.state.star}
                                                    onChange={this.onChangeStar}
                                                    placeholder="000"
                                                />
                                                <i className="fa fa-star"/>
                                                {
                                                !this.state.isValidStar ?
                                                    <span className="placeholder-error">
                                                        {this.props.localeCommon.REQUIRED_FIELD_MSG}
                                                    </span> : null
                                                }
                                            </div>
                                        : null
                                    }
                                </div>
                            </div>
                        : null
                    }
                </div>
            </div>
        )
    }
}
export default Gift;