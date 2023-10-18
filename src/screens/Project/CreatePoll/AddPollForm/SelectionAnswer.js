import React, { Component } from 'react';
import Alert from 'react-s-alert';
import PropTypes from 'prop-types';
import { ENUM, INPUT_NAME } from '../../constant';
import { jsonEqual, validateImage } from 'services/utils';
import {  BASE_URL } from 'services/config';
import Select from 'react-select';
import { find, isEmpty } from 'lodash';
const {
  MULTI_AVANCE_OPTION
} = INPUT_NAME;
const localeCommon = window.locale.Common;
const localeCreate = window.locale.Create;
const avance_option = [
  {
    value: 'no',
    label: '---'
  },
  {
    value: 'only',
    label: localeCreate.The_only_option
  },
  {
    value: 'all',
    label: localeCreate.Optional_all
  }
];
class SelectionAnswer extends Component {
  static defaultProps = {
    answer: {
      is_corrected: 0,
      title: '',
      value: '',
      media: '',
      value_type: ENUM.ANSWER_TYPE.TEXT,
      [MULTI_AVANCE_OPTION]: avance_option[0],
    }
  }

  constructor(props) {
    super(props);

    let imgUrl = '',
      text = '',
      option_selected = avance_option[0];
    if (props.answer.value_type === ENUM.ANSWER_TYPE.IMAGE) {
      imgUrl = props.answer.fullValue;
    } else {
      text = props.answer.value;
    }
    if(props.answer[MULTI_AVANCE_OPTION]){
      option_selected = find(avance_option, { value: props.answer[MULTI_AVANCE_OPTION] })
    }
    this.state = {
      isActive: false,
      isValid: true,
      imgUrl,
      text,
      [MULTI_AVANCE_OPTION]: option_selected,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !jsonEqual(this.props, nextProps) || !jsonEqual(this.state, nextState);
  }

  componentWillReceiveProps(nextProps) {
    if (!jsonEqual(this.props, nextProps)) {
      this.initStateData(nextProps)
    }
  } 
  
  componentWillMount() {
    if (this.props.answer) {
      this.initStateData(this.props)
    }
  }

  initStateData(props) {
    let imgUrl = '',
        text = '',
        option_selected = avance_option[0];
    if (props.answer.value_type === ENUM.ANSWER_TYPE.IMAGE) {
      imgUrl = props.answer.fullValue || props.answer.media;
      text = props.answer.value ? props.answer.value : '';
    } else {
      text = props.answer.value;
    }
    if((!isEmpty(props.answer.title) || (props.answer[MULTI_AVANCE_OPTION] && props.answer[MULTI_AVANCE_OPTION] !== 'no')) && !props.isShowAvanceSetting){
      props.answerAdvancedSettings();
    }
    if(props.answer[MULTI_AVANCE_OPTION]){
      option_selected = find(avance_option, { value: props.answer[MULTI_AVANCE_OPTION] })
    }
    this.setState({
      imgUrl,
      text,
      [MULTI_AVANCE_OPTION]: option_selected
    })
  }
  
  validateAnswer() {
    let isValid = true;
    const { value_type } = this.props.answer;
    if ((value_type === ENUM.ANSWER_TYPE.TEXT && !this.state.text) ||
        (value_type === ENUM.ANSWER_TYPE.IMAGE && !this.state.imgUrl)) {
        isValid = false;
        Alert.error(localeCreate.REQUIRED_ANSWER_MSG, {
        timeout: 5000,
      });
    }
    this.setState({ isValid });
    return isValid;
  }
  toggleActive = () => {
    this.setState({ isActive: !this.state.isActive });
  }
  updateAnswerVal = (e) => {
    const target = e.target;
      this.setState({
        text: target.value,
      }, () => {
        const answerProp = Object.assign({}, this.props.answer);
        answerProp.value = target.value;
        if(!(this.props.answer.value_type === ENUM.ANSWER_TYPE.IMAGE && this.props.answer.media)){
          answerProp.value_type = ENUM.ANSWER_TYPE.TEXT;
        }
        this.props.updateAnAnswer(answerProp, this.props.index);
      });
  }
  updateAnswerMedia = (e) => {
    const target = e.target;
    if (target.type === 'file') {
        if (!validateImage(target)) {
          return;
        }
        console.log( e.target.value, 'sssssss')
        let reader = new FileReader();
        const file = target.files[0];
        if (!file) {
          return;
        }
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
          reader.onloadend = () => {
            this.setState({ imgUrl: reader.result }, () => {
              const answerProp = Object.assign({}, this.props.answer);
              answerProp.media = reader.result;
              answerProp.value_type = ENUM.ANSWER_TYPE.IMAGE;
              this.props.updateAnAnswer(answerProp, this.props.index);
            });
          }
          reader.readAsDataURL(file);
        }, 50);
    }
  }
  updateAnswerChecked = (e) => {
    const answerProp = Object.assign({}, this.props.answer);
    if (!this.props.isMultiChoiceAns && answerProp.is_corrected) {
      answerProp.is_corrected = 0;
    } else {
      answerProp.is_corrected = e.target.checked * 1;
    }
    this.props.updateAnAnswer(answerProp, this.props.index, true);
  }
  updateAnswerTitle = (e) => {
    const answerProp = Object.assign({}, this.props.answer);
    answerProp.title = e.target.value;
    this.props.updateAnAnswer(answerProp, this.props.index);
  }
  onExcludeAnswers = () => {
    if (!this.props.isMultiChoiceAns) {
      return;
    }

    const answerProp = Object.assign({}, this.props.answer);
    answerProp.is_corrected = 1;

    this.props.excludeOtherAnswers(answerProp, this.props.index);
  }
  clearImage = () => {
    this.imgInput.value = '';
    const answerProp = Object.assign({}, this.props.answer);
    answerProp.media = '';
    answerProp.value_type = ENUM.ANSWER_TYPE.TEXT;
    this.props.updateAnAnswer(answerProp, this.props.index);
  }
  onChangeMultiChoiceOptionAvance = (val) =>{
    if(this.props.isMultiChoiceAns){
      this.setState({
        [MULTI_AVANCE_OPTION]: val
      }, () => {
        const answerProp = Object.assign({}, this.props.answer);
        answerProp[MULTI_AVANCE_OPTION] = this.state[MULTI_AVANCE_OPTION].value;
        this.props.updateAnAnswer(answerProp, this.props.index);
      })
    }
  }
  render() {
    const activeClass = !this.props.isShowAvanceSetting ? 'basic' : '';
    const inputType = this.props.isMultiChoiceAns ? 'checkbox' : 'radio';
    const inputClass = !this.props.isShowAvanceSetting ? 'col-xs-12 no-advance' :  this.props.isMultiChoiceAns ? 'col-sm-6 advance-setting multi' : 'col-sm-8 advance-setting single';
    const toolbarClass = !this.props.isShowAvanceSetting ? 'toolbarClass no-advance' : this.props.isMultiChoiceAns ? 'col-sm-3 toolbarClass advance' : 'col-sm-4 toolbarClass advance';
    return (
      
          <div className="col-xs-12 box-answer-selection">
            <div className="form-group">
              <div className={`wrap-group ${activeClass}`}>
                {
                  !this.state.isValid ?
                    <span className="placeholder-error">
                      {localeCommon.REQUIRED_FIELD_MSG}
                    </span> : null
                }
                <div className="row">
                  <div className={inputClass}>
                    <div className="box-item-input-answer">
                      <div className="custom-checkbox-answer">
                        <div className="custom-checkbox-1">
                            <input
                              name={INPUT_NAME.ANSWER_SELECTED}
                              type={inputType}
                              checked={this.props.answer.is_corrected !== null && this.props.answer.is_corrected}
                              onChange={this.updateAnswerChecked}
                            />
                            {
                              this.props.isMultiChoiceAns ? 
                                <div className="checkbox-visible"></div>
                              :
                                <div className="radio-visible"></div>
                            }
                            
                        </div>
                      </div>
                      <div className="input-answer">
                          <input
                            type="text"
                            placeholder={localeCreate.ANSWER_HOLDER}
                            className="input"
                            value={this.state.text}
                            onChange={this.updateAnswerVal}
                            tabIndex={2}
                          />
                          {
                            this.props.answer.value_type === ENUM.ANSWER_TYPE.IMAGE ?
                              <div className="upload-btn-wrapper">
                                <span className="fa fa-file-image-o"></span>
                                <img src={this.state.imgUrl} alt="preview img"/>
                              </div> : null
                          }
                      </div>
                    </div>
                  </div>
                  {
                    this.props.isMultiChoiceAns && this.props.isShowAvanceSetting ?
                      <div className="col-sm-3 custom-select-multi-option-avance">
                        <Select
                          className="custom-select"
                          name='MultiChoiceOptionAvance'
                          clearable={false}
                          searchable={false}
                          options={avance_option}
                          onChange={(val) => {
                              this.onChangeMultiChoiceOptionAvance(val)
                          }}
                          placeholder='---'
                          value={this.state[MULTI_AVANCE_OPTION]}
                        />
                      </div>
                    : null
                  }
                 
                  <div className={toolbarClass}>
                    <div className="list-toolbar-setting">
                          {
                            this.props.isShowAvanceSetting ?
                            <div className="input-setting-hodler">
                              <input
                                name="input"
                                type="text"
                                className="input"
                                value={this.props.answer.title || ''}
                                onChange={this.updateAnswerTitle}
                                placeholder={localeCreate.Enter_the_value_of_the_report}
                                tabIndex={2}
                              />
                            </div> : null
                          }
                          <div className="toolbar">
                              <div className="add-remove-image">
                                {
                                  this.props.answer.value_type === ENUM.ANSWER_TYPE.IMAGE ?
                                    <a
                                    role="button"
                                    title={localeCreate.IMAGE}
                                    onClick={this.clearImage}
                                    >
                                        <span className="fa fa-picture-o"></span>
                                    </a>
                                  :
                                    <a
                                    role="button"
                                    title={localeCreate.IMAGE}
                                    onClick={() => {
                                      this.imgInput.click();
                                    }}
                                    >
                                        <span className="fa fa-picture-o"></span>
                                    </a>
                                }
                              </div>
                            {
                              this.props.lengthAnswer > 2 && !this.props.isDisableEdit ?
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
                <div className="row">
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <input
                          ref={(node) => {
                            if (node) {
                              this.imgInput = node;
                            }
                          }}
                          type="file"
                          id="question-image"
                          name="question-image"
                          className="hidden"
                          onChange={this.updateAnswerMedia}
                        />
                  </div>
                </div>
              </div>
            </div>
          </div>
    );
  }
}

SelectionAnswer.propTypes = {
  answer: PropTypes.shape({
    is_corrected: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.bool,
    ]),
    title: PropTypes.string,
    value: PropTypes.string,
    value_type: PropTypes.string,
  }),
}

export default SelectionAnswer;
