import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { INPUT_NAME } from 'services/constant';
import { getAssetsURL } from 'services/utils';

const {
  IMAGE,
} = INPUT_NAME.ADD_PROJECT_FORM;

class ImageFileInput extends Component {
  constructor(props) {
    super(props);
    const imgUrl = props.formState[IMAGE] ? getAssetsURL(props.formState[IMAGE]) :
      '';
    this.state = {
      imgPreviewUrl: imgUrl,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.formState[IMAGE] !== nextProps.formState[IMAGE]) {
      this.handlePreviewImg(nextProps.formState[IMAGE]);
    }
  }

  handlePreviewImg(file) {
    let reader = new FileReader();
    if (!file) {
      return this.setState({
        imgPreviewUrl: '',
      });
    }

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      reader.onloadend = () => {
        this.setState({
          imgPreviewUrl: reader.result
        });
      }
      
      reader.readAsDataURL(file);
    }, 50);
  }

  render() {
    const { imgPreviewUrl } = this.state;
    return (
      <div className="form-group">
        <label htmlFor={IMAGE} className="label">
          {this.props.localeProject.IMAGE}
        </label>
        <div className="upload-btn-wrapper">
          <span className="fa fa-file-image-o"></span>
          <input
            id={IMAGE}
            type="file"
            name={IMAGE}
            onChange={this.props.onChange}
          />
          {
            imgPreviewUrl ?
              <img 
                src={imgPreviewUrl}
                alt={this.props.localeProject.STATUS}
              /> : null
          }
        </div>
      </div>
    );
  }
}

ImageFileInput.propTypes = {
  formState: PropTypes.object.isRequired,
  isClearForm: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default ImageFileInput;
