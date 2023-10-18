
import React, { Component } from 'react';
import Select from 'react-select';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import {
    GENDEROPT,
    INPUT_NAME,
  } from '../../../../constant';
const {
    AGE_FROM,
    AGE_TO,
    GENDER,
    CITY,
  } = INPUT_NAME;
const localeCreate = window.locale.Create;
class BasicContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowOptionCity: false,
            isShowOptionGender: false,
            isShowOptionAge: false,
        }
    }
    toggleDropdown = (action) =>{
        if(action === AGE_FROM){
            this.setState({
                isShowOptionAge: !this.state.isShowOptionAge
            })
        }else{
            if(action === GENDER){
                this.setState({
                    isShowOptionGender: !this.state.isShowOptionGender
                })
            }else{
                if(action === CITY){
                    this.setState({
                        isShowOptionCity: !this.state.isShowOptionCity
                    })
                }
            }
        }
    }
    
    render(){
        return(
            <div className="row">
                <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                    <div className="box-choose-item-basic-target">
                        <a
                            onClick={() => this.toggleDropdown(CITY)}
                        >
                            <div className="item-choose-object-target">
                                <div className="label-object">
                                    {localeCreate.Province_City}
                                </div>
                                <img src={require('assets/images/VN map-01.png')} />
                            </div>
                        </a>
                        {
                            this.state.isShowOptionCity ? 
                                <div className="object-target">
                                    <div className="choose-object">
                                        <div className="label-object">
                                            {localeCreate.Province_City}
                                        </div>
                                        <Select
                                            name={CITY}
                                            searchable={true}
                                            multi={true}
                                            removeSelected={false}
                                            closeOnSelect={false}
                                            className="custom-select"
                                            placeholder={localeCreate.ALL_OPTION_CITY}
                                            options={this.props.listCityOption}
                                            value={this.props.formState[CITY]}
                                            onChange={this.props.onChangeCity}
                                        />
                                    </div>
                                </div>
                            : null
                        }
                    </div>
                </div>
                <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                    <div className="box-choose-item-basic-target">
                        <a
                            onClick={() => this.toggleDropdown(GENDER)}
                        >
                            <div className="item-choose-object-target">
                                <div className="label-object">
                                    {localeCreate.Gender_option}
                                </div>
                                <div className="img-gender">
                                    <img src={require('assets/images/people-01.png')} />
                                    <img src={require('assets/images/people-02.png')} />
                                </div>
                            </div>
                        </a>
                        {
                            this.state.isShowOptionGender ? 
                                <div className="object-target">
                                    <div className="choose-object">
                                        <div className="label-object">
                                            {localeCreate.Gender_option}
                                        </div>
                                        <div className="check-gender-target">
                                            <div className="item-gender">
                                                <div className="custom-checkbox-1">
                                                    <input
                                                        id={GENDEROPT.MALE}
                                                        type="checkbox"
                                                        name={GENDER}
                                                        value={GENDEROPT.MALE}
                                                        checked={this.props.formState[GENDER] === GENDEROPT.MALE}
                                                        onChange={this.props.onChangeGender}
                                                    />
                                                    <div className="checkbox-visible"></div> 
                                                </div>
                                                <label htmlFor={GENDEROPT.MALE} className="text-settings noselect">
                                                    {localeCreate.OPTION_GENDER_MALE}
                                                </label>
                                            </div>
                                            <div className="item-gender">
                                                <div className="custom-checkbox-1">
                                                    <input
                                                        id={GENDEROPT.FEMALE}
                                                        type="checkbox"
                                                        name={GENDER}
                                                        value={GENDEROPT.FEMALE}
                                                        checked={this.props.formState[GENDER] === GENDEROPT.FEMALE}
                                                        onChange={this.props.onChangeGender}
                                                    />
                                                    <div className="checkbox-visible"></div> 
                                                </div>
                                                <label htmlFor={GENDEROPT.FEMALE} className="text-settings noselect">
                                                    {localeCreate.OPTION_GENDER_FEMALE}
                                                </label>
                                            </div>
                                            <div className="item-gender">
                                                <div className="custom-checkbox-1">
                                                    <input
                                                        id={GENDEROPT.ALL}
                                                        type="checkbox"
                                                        name={GENDER}
                                                        value={GENDEROPT.ALL}
                                                        checked={this.props.formState[GENDER] === GENDEROPT.ALL}
                                                        onChange={this.props.onChangeGender}
                                                    />
                                                    <div className="checkbox-visible"></div> 
                                                </div>
                                                <label htmlFor={GENDEROPT.ALL} className="text-settings noselect">
                                                    {localeCreate.ALL_OPTION_GENDER}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            : null
                        }
                    </div>
                </div>
                <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                    <div className="box-choose-item-basic-target">
                        <a
                            onClick={() => this.toggleDropdown(AGE_FROM)}
                        >
                            <div className="item-choose-object-target">
                                <div className="label-object">
                                    {localeCreate.OPTION_AGE}
                                </div>
                                <div className="img-age">
                                    <img src={require('assets/images/people-01.png')} />
                                    <img src={require('assets/images/people-01.png')} />
                                    <img src={require('assets/images/people-01.png')} />
                                </div>
                            </div>
                        </a>
                        {
                            this.state.isShowOptionAge ? 
                                <div className="object-target large">
                                    <div className="choose-object">
                                        <div className="label-object">
                                            {localeCreate.OPTION_AGE}
                                        </div>
                                        <div className="slider-age">
                                            <div className="custom-checkbox-small">
                                                <div className="custom-checkbox-1">
                                                    <input
                                                    id='onChangeAgeAll'
                                                    type="checkbox"
                                                    name='onChangeAgeAll'
                                                    checked={this.props.formState[AGE_FROM] === 1 && this.props.formState[AGE_TO] == 100}
                                                    onChange={this.props.onChangeAgeAll}
                                                    />
                                                    <div className="checkbox-visible"></div> 
                                                </div>
                                                <label htmlFor='onChangeAgeAll' className="text-settings noselect">
                                                    {localeCreate.OPTION_AGE_ALL}
                                                </label>
                                            </div>
                                            <div className="box-input-range custom-input-range-slider">
                                                <InputRange
                                                    draggableTrack
                                                    maxValue={100}
                                                    minValue={1}
                                                    onChange={value =>  this.props.onChangeAge(value)}
                                                    value={{
                                                        min: this.props.formState[AGE_FROM],
                                                        max: this.props.formState[AGE_TO]
                                                    }} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            : null
                        }
                    </div>
                </div>
                <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                    <a
                        onClick={this.props.toggleOptionTarget}
                    >
                        <div className="item-choose-object-target">
                            <div className="label-object">
                                {localeCreate.Other_target}
                            </div>
                            <div className="img-other">
                                <img src={require('assets/images/add-icon-01.png')} />
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        )
    }
}
export default BasicContent;