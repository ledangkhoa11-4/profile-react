import React, { Component } from 'react';
import Alert from 'react-s-alert';
import PropTypes from 'prop-types';
import { ENUM, INPUT_NAME } from '../../constant';
import { jsonEqual, validateImage } from 'services/utils';

const localeCommon = window.locale.Common;
const localeCreate = window.locale.Create;

class SelectionAnswer extends Component {
  static defaultProps = {
    answer: {
      is_corrected: 0,
      title: '',
      value: '',
      value_type: ENUM.ANSWER_TYPE.TEXT,
    }
  }

  constructor(props) {
    super(props);

    let imgUrl = '',
      text = '';
    if (props.answer.value_type === ENUM.ANSWER_TYPE.IMAGE) {
      imgUrl = props.answer.fullValue;
    } else {
      text = props.answer.value;
    }

    this.state = {
      isActive: false,
      isValid: true,
      imgUrl,
      text,
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
        text = '';
    if (props.answer.value_type === ENUM.ANSWER_TYPE.IMAGE) {
      imgUrl = props.answer.fullValue || props.answer.value;
    } else {
      text = props.answer.value;
    }
    this.setState({
      imgUrl,
      text,
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
    if (target.type === 'file') {
      if (!validateImage(target)) {
        return;
      }
      
      let reader = new FileReader();
      const file = target.files[0];
      if (!file) {
        this.imgInput.value = '';
        const answerProp = Object.assign({}, this.props.answer);
        answerProp.value = this.state.text;
        answerProp.value_type = ENUM.ANSWER_TYPE.TEXT;
        return this.props.updateAnAnswer(answerProp, this.props.index);
      }
  
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
  
      this.timeout = setTimeout(() => {
        reader.onloadend = () => {
          this.setState({ imgUrl: reader.result }, () => {
            const answerProp = Object.assign({}, this.props.answer);
            answerProp.value = reader.result;
            answerProp.value_type = ENUM.ANSWER_TYPE.IMAGE;
            this.props.updateAnAnswer(answerProp, this.props.index);
          });
        }
        
        reader.readAsDataURL(file);
      }, 50);
    } else {
      this.setState({
        text: target.value,
      }, () => {
        const answerProp = Object.assign({}, this.props.answer);
        answerProp.value = target.value;
        answerProp.value_type = ENUM.ANSWER_TYPE.TEXT;
        this.props.updateAnAnswer(answerProp, this.props.index);
      });
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
    answerProp.value = this.state.text;
    answerProp.value_type = ENUM.ANSWER_TYPE.TEXT;
    this.props.updateAnAnswer(answerProp, this.props.index);
  }

  render() {
    const activeClass = this.state.isActive ? 'active' : '';
    const inputType = this.props.isMultiChoiceAns ? 'checkbox' : 'radio';
  
    return (
      <div className="col-xs-12">
        <div className="form-group">
          <div className={`wrap-group ${activeClass}`}>
            {
              !this.state.isValid ?
                <span className="placeholder-error">
                  {localeCommon.REQUIRED_FIELD_MSG}
                </span> : null
            }
            <div className="input-group">
              <div className="input-wrap">
                {
                  this.props.answer.value_type === ENUM.ANSWER_TYPE.IMAGE ?
                    <div className="upload-btn-wrapper">
                      <span className="fa fa-file-image-o"></span>
                      <img src={this.state.imgUrl} alt="preview img"/>
                    </div> :
                    <input
                      type="text"
                      placeholder={localeCreate.ANSWER_HOLDER}
                      className="input"
                      value={this.state.text}
                      onChange={this.updateAnswerVal}
                      tabIndex={2}
                    />
                }
                <ul className="list-toolbar">
                  {
                    this.props.answer.value_type === ENUM.ANSWER_TYPE.IMAGE ?
                      <li>
                        <a role="button" title="clear" onClick={this.clearImage}>
                          <span className="fa fa-times"></span>
                        </a>
                      </li> : null
                  }
                  <li>
                    <a
                      role="button"
                      title={localeCreate.IMAGE}
                      onClick={() => {
                        this.imgInput.click();
                      }}
                    >
                      <span className="fa fa-camera"></span>
                    </a>
                  </li>
                </ul>
              </div>
              {
                this.props.lengthAnswer > 2 && !this.props.isDisableEdit ?
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
              <div className="input-group-addon last">
                <a
                  role="button"
                  title={localeCreate.ANSWER_SETTING}
                  onClick={this.toggleActive}
                >
                  <span className="fa fa-cog"></span>
                </a>
              </div>
            </div>
            <div className="setting-1">
            <div className="row">
              <div className="col-sm-3">
                <div className="input-group">
                  <div className="input-group-addon">
                    <div>Đáp án đúng</div>
                    <div className="custom-checkbox-1">
                      <input
                        name={INPUT_NAME.ANSWER_SELECTED}
                        type={inputType}
                        checked={this.props.answer.is_corrected}
                        onChange={this.updateAnswerChecked}
                      />
                      <div className="checkbox-visible"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-9">
                <div className="input-group table">
                  <div className="tr">
                    <div className="td">
                      <span>{localeCreate.SETTING_LABEL}</span>
                    </div>
                    <div className="td">
                      <div className="value-group">
                        <input
                          name="input"
                          type="text"
                          placeholder={localeCreate.SETTING_HODLER}
                          className="input"
                          value={this.props.answer.title || ''}
                          onChange={this.updateAnswerTitle}
                          tabIndex={2}
                        />
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
                          onChange={this.updateAnswerVal}
                        />
                      </div>
                    </div>
                    <div className="td">
                      <div className="input-group-addon last">
                        <a
                          role="button"
                          title={localeCreate.ANSWER_SETTING}
                          onClick={this.toggleActive}
                        >
                          <span className="fa fa-times"></span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>                
              </div>
                {
                  this.props.isMultiChoiceAns ?
                    <div className="col-xs-12">
                      <div className="input-group-addon">
                        <a
                          onClick={this.onExcludeAnswers}
                          className="exclude-other-answers"
                        >
                          Chỉ chọn đáp án này
                        </a>
                      </div>
                    </div> : null
                }
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
