import React, { Component } from 'react';
import Alert from 'react-s-alert';
import { INPUT_NAME } from '../../constant';
import { jsonEqual } from 'services/utils';
import InputNumber from 'components/InputNumber';

const localeCreate = window.locale.Create;
const localeCommon = window.locale.Common;
const {
  LABEL_RATING,
  NUMBER_STAR_RATING,
} = INPUT_NAME;

class RatingSlider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      [LABEL_RATING]: props.answer[LABEL_RATING],
      [NUMBER_STAR_RATING]: props.answer[NUMBER_STAR_RATING],
      isValidLabel: true,
      isValidNumber: true,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !jsonEqual(this.props, nextProps) || !jsonEqual(this.state, nextState);
  }

  componentWillReceiveProps(nextProps) {
    if (!jsonEqual(this.props.answer, nextProps.answer)) {
      this.setState({...nextProps.answer})
    }
  }

  onChangeInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    }, () => {
      const answer = {
        numberStar: this.state[NUMBER_STAR_RATING],
        [LABEL_RATING]: this.state[LABEL_RATING],
      }
      this.props.updateAnAnswer(answer, this.props.index)
    })
  }
  onChangeNumberStar = (action) =>{
    if(action && this.state[NUMBER_STAR_RATING] < 10){
      this.setState({
        [NUMBER_STAR_RATING]: this.state[NUMBER_STAR_RATING] + 1
      }, () => {
        const answer = {
          numberStar: this.state[NUMBER_STAR_RATING],
          [LABEL_RATING]: this.state[LABEL_RATING],
        }
        this.props.updateAnAnswer(answer, this.props.index)
      })
    }else if(this.state[NUMBER_STAR_RATING] > 2){
      this.setState({
        [NUMBER_STAR_RATING]: this.state[NUMBER_STAR_RATING] - 1
      }, () => {
        const answer = {
          numberStar: this.state[NUMBER_STAR_RATING],
          [LABEL_RATING]: this.state[LABEL_RATING],
        }
        this.props.updateAnAnswer(answer, this.props.index)
      })
    }
  }

  validateAnswer = () => {
    let isValidLabel = true;
    if (!this.state[LABEL_RATING]) {
      isValidLabel = false;
      Alert.error(localeCreate.REQUIRED_LABEL, {
        timeout: 5000
      })
    }
    this.setState({ isValidLabel })
    return isValidLabel
  }

  render() {
    return (
      <div className={`col-xs-12 box-add-answer-rating  ${this.props.lengthAnswer > 1 ? 'active' : ''}`}>
        <div className="form-group">
          <div className="wrap-group">
            <div className="input-group">
              <div className="input-wrap item-answer-rating">
                <div className="row">
                  <div className="col-sm-8">
                    <input
                      name={LABEL_RATING}
                      placeholder={localeCreate.LABEL_RATING_HOLDER}
                      className="input"
                      value={this.state[LABEL_RATING]}
                      onChange={this.onChangeInput}
                      tabIndex={2}
                    />
                    {
                      !this.state.isValidLabel ?
                        <span className="placeholder-error">
                          {localeCommon.REQUIRED_FIELD_MSG}
                        </span> : null
                    }
                  </div>
                  <div className="col-sm-4">
                    <div className="box-chosse-quantity-star">
                      <a 
                        className="btn btn-minus"
                        onClick={() => this.onChangeNumberStar(false)}
                      >
                        <i className="fa fa-minus" aria-hidden="true"></i>
                      </a>
                      <InputNumber
                        name={NUMBER_STAR_RATING}
                        placeholder={localeCreate.NUMBER_STAR_RATING_HOLDER}
                        className="input"
                        value={this.state[NUMBER_STAR_RATING]}
                        onChange={(value, name) => {
                          const obj = {
                            target: {
                              name,
                              value: parseInt(value, 10),
                            }
                          }
                          this.onChangeInput(obj)
                        }}
                        tabIndex={2}
                      />
                      <a 
                        className="btn btn-add"
                        onClick={() => this.onChangeNumberStar(true)}
                      >
                        <i className="fa fa-plus" aria-hidden="true"></i>
                      </a>
                    </div>
                    {
                      !this.state.isValidNumber ?
                        <span className="placeholder-error">
                          {localeCommon.REQUIRED_FIELD_MSG}
                        </span> : null
                    }
                  </div>
                </div>
              </div>
              {
                this.props.lengthAnswer > 1 && !this.props.isDisableEdit?
                  <div className="remove-answer">
                    <a
                      role="button"
                      title={localeCreate.ANSWER_REMOVE}
                      onClick={() => {
                        this.props.removeAnswer(this.props.index);
                      }}
                    >
                      <img src={require('assets/images/x-mark-01.png')} />
                    </a>
                  </div> : null
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RatingSlider;
