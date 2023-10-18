import React, { Component } from 'react';
import Alert from 'react-s-alert';
import Slider from 'components/RangeSlider';
import { jsonEqual } from 'services/utils';
import {
  isEmpty
} from 'lodash';
const localeCommon = window.locale.Common;
const localeCreate = window.locale.Create;

class NumberVote extends Component {
  constructor(props){
    super(props);
    let numberVote = 1,
    minNumberVote = 1;
    if(!isEmpty(props.pollInfo) && props.pollInfo.number_vote > 0){
      numberVote = props.pollInfo.number_vote 
      if (props.isDisableEdit) {
        minNumberVote = props.pollInfo.number_vote
      }
    }
    this.state = {
      numberVote: numberVote,
      minNumberVote: minNumberVote,
      maxNumberVote: 10000,
      stepNumberVote: 5,
      isValidNumberVote: true,
      ruler: 1000,
    }
  }
  onChangeNumberVote = (num) => {
    this.setState({ numberVote: num }, () => {
      if(!isNaN(num)){
        this.props.renderEstimatedCost(num)
      }else{
        this.props.renderEstimatedCost(0)
      }
    });
  }
  componentDidMount(){
    this.props.renderEstimatedCost(this.state.numberVote)
  }
  componentWillReceiveProps(nextProps) {
    
    if (jsonEqual(this.props, nextProps)) {
      return;
    }
    const { pollInfo, isDisableEdit } = nextProps;
    if (!isEmpty(pollInfo) && pollInfo.number_vote > 0) {
      const _state = { numberVote: pollInfo.number_vote }
      if (isDisableEdit) {
        _state.minNumberVote = pollInfo.number_vote
      }
      this.setState(_state, () =>{
        this.props.renderEstimatedCost(this.state.numberVote)
      })
    }
  }
  
  validateNumberVote() {
    let isValidNumberVote = true;
    if (this.state.numberVote === 0) {
      isValidNumberVote = false;
      Alert.error(localeCreate.REQUIRED_NUMBER_VOTE_MSG, {
        timeout: 5000,
      })
    }
    this.setState({ isValidNumberVote });
    return isValidNumberVote;
  }

  getNumberVote = () => {
    return this.state.numberVote
  }
  
  renderLabels = () =>{
    const minNumberVote = this.state.minNumberVote;
    let labels = new Array();
    for (let i = 0; i <= this.state.maxNumberVote; i += this.state.ruler) {
        if(i >= minNumberVote){
          labels[i] = i;
        }
    }
    return Object.assign({}, labels);
  }
  render() {
    const valueNumberVote = isNaN(parseInt(this.state.numberVote, 10)) ? 0 : this.state.numberVote;
    return (
      <div className="box-input-number-vote">
        <div className="progress">
          <Slider
            value={isNaN(this.state.numberVote) ? this.state.minNumberVote : valueNumberVote}
            min={this.state.minNumberVote}
            max={this.state.maxNumberVote}
            step={this.state.stepNumberVote}
            onChange={this.onChangeNumberVote}
            labels={this.renderLabels()}
            tooltipAlways={false}
          />
          {
            !this.state.isValidNumberVote ?
              <span className="placeholder-error">
                {localeCommon.REQUIRED_FIELD_MSG}
              </span> : null
          }
        </div>
        <div className="container-number-vote">
          <div className='box-number-vote'>
              <a
                onClick={()=>{
                  let minus = this.state.numberVote - 1;
                  let value = parseInt(minus);
                  if (value <= this.state.maxNumberVote && value >= this.state.minNumberVote) {
                    this.onChangeNumberVote(value)
                  }
                }}
              >
                <div className="minus">
                  <span className="fa fa-minus"></span>
                </div>
              </a>
              <input
                className="input"
                name="input-number-vote form-control"
                value={this.state.numberVote}
                type={'number'}
                onBlur={(e) => {
                  const value = e.target.value
                  if(value == 0 || value == null){
                    this.onChangeNumberVote(this.state.minNumberVote)
                  }
                }}
                onChange={(e) => {
                  const value = e.target.value
                  if(value > this.state.maxNumberVote){
                    this.onChangeNumberVote(this.state.maxNumberVote)
                  }else{
                     this.onChangeNumberVote(value)
                  }
                }}
              />
              <a
              onClick={()=>{
                let plus = this.state.numberVote + 1;
                let value = parseInt(plus);
                if (value <= this.state.maxNumberVote && value >= this.state.minNumberVote) {
                  this.onChangeNumberVote(value)
                }
              }}
              >
                <div className="plus">
                  <span className="fa fa-plus"></span>
                </div>
              </a>
          </div>
        </div>
      </div>
    )
  }
}

export default NumberVote;
