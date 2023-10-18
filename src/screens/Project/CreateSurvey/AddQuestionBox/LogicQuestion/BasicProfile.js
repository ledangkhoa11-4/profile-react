import React, { Component } from 'react';
import Select from 'react-select';
import { INPUT_NAME, GENDEROPT } from '../../../constant';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';

const localeCreate = window.locale.Create;
const {
  AGE_FROM,
  AGE_TO,
  GENDER,
  CITY,
} = INPUT_NAME;

const optionsbasic = [
  {
    label: localeCreate.OPTION_AGE,
    value: 1,
  },
  {
    label: localeCreate.GENDER,
    value: 2,
  },
  {
    label: localeCreate.CITY,
    value: 3,
  }
]
class BasicProfile extends Component{
  constructor(props){
    super(props)
    this.state = {
      indexQuestion: 1
    }
  }
  onChangeIndexBasicQuestion = (value) =>{
    this.setState({
      indexQuestion: value
    })
  }
  renderQuestion = (basicProfile) =>{
    switch (this.state.indexQuestion) {
      case 2:
        return <div className="col-xs-12 col-sm-6">
                  <div className="form">
                    <div className="form-group">
                      <div className="choose-object">
                          <div className="label-object">
                            {localeCreate.GENDER}
                          </div>
                          <div className="check-gender-target">
                              <div className="item-gender">
                                  <div className="custom-checkbox-1">
                                      <input
                                          id={GENDEROPT.MALE}
                                          type="checkbox"
                                          name={GENDER}
                                          value={GENDEROPT.MALE}
                                          checked={basicProfile[GENDER] === GENDEROPT.MALE}
                                          onChange={(e) =>  this.props.onChangeSelectVal(GENDER, e.target.value)}
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
                                          checked={basicProfile[GENDER] === GENDEROPT.FEMALE}
                                          onChange={(e) =>  this.props.onChangeSelectVal(GENDER, e.target.value)}
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
                                          checked={basicProfile[GENDER] === GENDEROPT.ALL}
                                          onChange={(e) =>  this.props.onChangeSelectVal(GENDER, e.target.value)}
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
                  </div>
                </div>
      case 3:
          return  <div className="col-xs-12 col-sm-6">
                    <div className="form">
                      <div className="form-group">
                        <label className="label-object">
                          {localeCreate.CITY}
                        </label>
                        <div className="select-container item">
                          <Select
                            name={CITY}
                            multi={true}
                            removeSelected={false}
                            closeOnSelect={false}
                            className="custom-select"
                            placeholder={localeCreate.CITY_HOLDER}
                            options={ this.props.listCityOption}
                            value={basicProfile[CITY]}
                            onChange={(val) =>  this.props.onChangeSelectVal(CITY, val)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
      default:
        return  <div className="col-xs-12 col-sm-6">
                  <div className="form">
                    <div className="form-group">
                      <div className="choose-object">
                          <div className="label-object">
                            {localeCreate.messages_user_choose_age}
                          </div>
                          <div className="slider-age">
                              <div className="box-input-range custom-input-range-slider">
                                  <InputRange
                                      draggableTrack
                                      maxValue={100}
                                      minValue={1}
                                      onChange={value =>  this.props.onChangeAge(value)}
                                      value={{
                                          min: basicProfile[AGE_FROM],
                                          max: basicProfile[AGE_TO]
                                      }} 
                                  />
                              </div>
                              <div className="custom-checkbox-small">
                                  <div className="custom-checkbox-1">
                                      <input
                                      id='onChangeAgeAll'
                                      type="checkbox"
                                      name='onChangeAgeAll'
                                      checked={basicProfile[AGE_FROM] === 1 && basicProfile[AGE_TO] == 100}
                                      onChange={this.props.onChangeAgeAll}
                                      />
                                      <div className="checkbox-visible"></div> 
                                  </div>
                                  <label htmlFor='onChangeAgeAll' className="text-settings noselect">
                                      {localeCreate.OPTION_AGE_ALL}
                                  </label>
                              </div>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
    }
  }
  render(){
    const { basicProfile } = this.props.formState.currentLogicObj
    return(
      <div className="row box-basic-logic">
        <div className="col-xs-12">
          <div className="select-container">
            <Select
              searchable={false}
              clearable={false}
              name='index-question-basic-logic'
              options={optionsbasic}
              value={this.state.indexQuestion}
              onChange={(val) => this.onChangeIndexBasicQuestion(val.value)}
            />
          </div>
        </div>
        { this.renderQuestion(basicProfile) }
      </div>
    )
  }
}

export default BasicProfile;
