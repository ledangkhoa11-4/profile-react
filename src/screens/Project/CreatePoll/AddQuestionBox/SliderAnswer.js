import React, { Component } from 'react';
import Alert from 'react-s-alert';
import { INPUT_NAME } from '../../constant';
import InputNumber from 'components/InputNumber';
import { jsonEqual } from 'services/utils';

const localeCreate = window.locale.Create;
const localeCommon = window.locale.Common;
const {
  MAX_VALUE_SLIDER,
  MIN_VALUE_SLIDER,
  LABEL_SLIDER,
} = INPUT_NAME;

class SliderAnswer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      [MAX_VALUE_SLIDER]: props.answer[MAX_VALUE_SLIDER],
      [MIN_VALUE_SLIDER]: props.answer[MIN_VALUE_SLIDER],
      [LABEL_SLIDER]: props.answer[LABEL_SLIDER],
      isValidMaxValue: true,
      isValidMinValue: true,
      isValidLabel: true,
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
        [MAX_VALUE_SLIDER]: this.state[MAX_VALUE_SLIDER],
        [MIN_VALUE_SLIDER]: this.state[MIN_VALUE_SLIDER],
        [LABEL_SLIDER]: this.state[LABEL_SLIDER],
      }
      this.props.updateAnAnswer(answer, this.props.index)
    })
  }

  validateAnswer = () => {
    let isValidMaxValue = true,
        isValidMinValue = true,
        isValidLabel = true;
    if (!this.state[MAX_VALUE_SLIDER]) {
      isValidMaxValue = false;
      Alert.error(localeCreate.REQUIRED_MAX_VALUE_SLIDER, {
        timeout: 5000,
      })
    }
    if (!this.state[MIN_VALUE_SLIDER]) {
      isValidMinValue = false;
      Alert.error(localeCreate.REQUIRED_MIN_VALUE_SLIDER, {
        timeout: 5000,
      })
    }
    if (!this.state[LABEL_SLIDER]) {
      isValidLabel = false;
      Alert.error(localeCreate.REQUIRED_LABEL, {
        timeout: 5000,
      })
    }

    this.setState({
      isValidLabel,
      isValidMaxValue,
      isValidMinValue,
    })

    return isValidLabel && isValidMaxValue && isValidMinValue;
  }

  render() {
    return (
      <div className="col-xs-12">
        <div className="form-group">
          <div className="wrap-group">
            <div className="input-group">
              <div className="input-wrap">
                <div className="row">
                  <div className="col-sm-6">
                    <input
                      name={LABEL_SLIDER}
                      placeholder={localeCreate.LABEL_SLIDER_HOLDER}
                      className="input"
                      value={this.state[LABEL_SLIDER]}
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
                  <div className="col-sm-3">
                    <InputNumber
                      name={MIN_VALUE_SLIDER}
                      placeholder={localeCreate.MIN_VALUE_SLIDER_HOLDER}
                      className="input border-left"
                      value={this.state[MIN_VALUE_SLIDER]}
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
                    {
                      !this.state.isValidMinValue ?
                        <span className="placeholder-error">
                          {localeCommon.REQUIRED_FIELD_MSG}
                        </span> : null
                    }
                  </div>
                  <div className="col-sm-3">
                    <InputNumber
                      name={MAX_VALUE_SLIDER}
                      placeholder={localeCreate.MAX_VALUE_SLIDER_HOLDER}
                      className="input border-left"
                      value={this.state[MAX_VALUE_SLIDER]}
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
                    {
                      !this.state.isValidMaxValue ?
                        <span className="placeholder-error">
                          {localeCommon.REQUIRED_FIELD_MSG}
                        </span> : null
                    }
                  </div>
                </div>
              </div>
              {
                this.props.lengthAnswer > 1 && !this.props.isDisableEdit ?
                  <div className="input-group-addon last">
                    <a
                      role="button"
                      title={localeCreate.ANSWER_REMOVE}
                      onClick={() => {
                        this.props.removeAnswer(this.props.index);
                      }}
                    >
                      <span className="fa fa-trash"></span>
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

export default SliderAnswer;
