import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-s-alert';
import { ENUM } from '../../constant';
import {
  jsonEqual,
  validateImage,
} from 'services/utils';

const localeCreate = window.locale.Create;
const localeCommon = window.locale.Common;

class Question extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      videoLink: '',
      image: '',
      isActiveWrapper: false,
      isActiveUpload: false,
      isActiveLinkInput: false,
      isValidContent: true,
    };
  }

  componentDidMount() {
    if (this.props.questionData) {
      this.initStateData(this.props)
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (!jsonEqual(nextProps.questionData, this.props.questionData)) {
      this.initStateData(nextProps)
    }
  }

  initStateData(props) {
    let videoLink = '',
        image = '';
    let isActiveWrapper = false,
        isActiveUpload = false,
        isActiveLinkInput = false;
    if (props.questionData.media_type === ENUM.QUESTION_MEDIA_TYPE.IMAGE) {
      isActiveWrapper = true;
      isActiveUpload = true;
      image = props.questionData.fullMedia;
    } else if (props.questionData.media_type === ENUM.QUESTION_MEDIA_TYPE.VIDEO) {
      isActiveWrapper = true;
      isActiveLinkInput = true;
      videoLink = props.questionData.fullMedia;
    }
    
    this.setState({
      content: props.questionData.question,
      videoLink,
      image,
      isActiveWrapper,
      isActiveUpload,
      isActiveLinkInput,
    });
  }

  validateQuestionBox = () => {
    let isValidContent = true;

    if (!this.state.content) {
      isValidContent = false;
      Alert.error(localeCreate.REQUIRED_QUESTION_MSG, {
        timeout: 5000,
      })
    }
    this.setState({
      isValidContent,
    });
    return isValidContent;
  }

  getQuestion() {
    // public method for parent component can get question data
    const media = { media_type: ENUM.QUESTION_MEDIA_TYPE.TEXT };
    if (this.state.image) {
      media.media = this.state.image;
      media.media_type = ENUM.QUESTION_MEDIA_TYPE.IMAGE;
    } else if (this.state.videoLink) {
      media.media = this.state.videoLink;
      media.media_type = ENUM.QUESTION_MEDIA_TYPE.VIDEO;
    }

    return {
      question: {
        question: this.state.content,
        ...media,
      }
    };
  }

  updateContent = (e) => {
    this.updateInput({ content: e.target.value });
    typeof this.props.onChange === 'function' && this.props.onChange();
  }

  updateVideoLink = (e) => {
    this.updateInput({ videoLink: e.target.value });
  }

  updateInput(subState) {
    this.setState({...this.state, ...subState});
  }

  handlePreviewImg = (e) => {
    if (!validateImage(e.target)) {
      return;
    }
    
    const file = e.target.files[0] || '';
    let reader = new FileReader();
    if (!file) {
      return this.setState({
        image: '',
        isActiveWrapper: false,
        isActiveUpload: false,
        isActiveLinkInput: false,
        videoLink: '',
      });
    }

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      reader.onloadend = () => {
        this.setState({
          image: reader.result,
          isActiveWrapper: true,
          isActiveUpload: true,
          isActiveLinkInput: false,
          videoLink: '',
        });
      }
      
      reader.readAsDataURL(file);
    }, 50);
  }

  clearInput = (e) => {
    this.imgInput.value = '';
    this.setState({
      isActiveWrapper: false,
      isActiveLinkInput: false,
      isActiveUpload: false,
      image: '',
      videoLink: '',
    });
  }

  clearQuestion = () => {
    this.setState({
      content: ''
    }, () => {
      this.clearInput()
    })
  }

  renderInputMedia() {
    return (
      <div className="value-group">
        <a role="button" title="clear" className="clear" onClick={this.clearInput}>
          <i className="material-icons">clear</i>
        </a>
        {
          this.state.isActiveLinkInput ?
            <input
              name="question-video"
              className="input"
              value={this.state.videoLink}
              onChange={this.updateVideoLink}
              placeholder={localeCreate.VIDEO_LINK_HOLDER}
            /> : null
        }
        {
          this.state.isActiveUpload ?
            <div className="upload-btn-wrapper">
              <span className="fa fa-file-image-o"></span>
              {
                this.state.image ?
                  <img src={this.state.image} alt="preview img"/> : null
              }
            </div> : null
        }
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
          onChange={this.handlePreviewImg}
        />
      </div>
    )
  }

  showLinkInput = () => {
    this.imgInput.value = '';
    this.setState({
      isActiveWrapper: true,
      isActiveLinkInput: true,
      isActiveUpload: false,
      image: '',
    });
  }

  render() {
    return (
      <div className="col-xs-12">
        {
          this.props.isShowLabel ?
            <label htmlFor="question">
              {localeCreate.QUESTION}:
            </label> : null
        }
        <div className="form-group">
          <div className={`wrap-group ${this.state.isActiveWrapper ? 'active' : ''}`}>
            <textarea
              id="question-content"
              name="question-content"
              placeholder={localeCreate.QUESTION_HOLDER}
              className="input question-input"
              value={this.state.content}
              onChange={this.updateContent}
              onFocus={this.props.onFocus}
              tabIndex={1}
            />
            <ul className="list-toolbar">
              <li className={this.state.isActiveUpload ? 'active' : ''}>
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
              <li className={this.state.isActiveLinkInput ? 'active' : ''}>
                <a
                  role="button"
                  title={localeCreate.LINK}
                  onClick={this.showLinkInput}
                >
                  <span className="fa fa-video-camera"></span>
                </a>
              </li>
            </ul>
            { this.renderInputMedia() }
          </div>
          {
            !this.state.isValidContent ?
              <span className="placeholder-error">
                {localeCommon.REQUIRED_FIELD_MSG}
              </span> : null
          }
        </div>
      </div>
    )
  }
}

Question.defaultProps = {
  questionData: {
    media: '',
    name: '',
    question: '',
    question_type: ENUM.QUESTION_TYPE.SINGLE,
    media_type: ENUM.QUESTION_MEDIA_TYPE.TEXT,
  },
  isShowLabel: true,
}

Question.propTypes = {
  isShowLabel: PropTypes.bool,
  questionData: PropTypes.shape({
    media: PropTypes.string,
    name: PropTypes.string,
    question: PropTypes.string,
    question_type: PropTypes.string,
    media_type: PropTypes.string,
  }),
}

export default Question;
