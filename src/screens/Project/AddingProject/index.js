import React, { Component } from 'react';
import Alert from 'react-s-alert';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import AddingForm from './AddingForm';
import { INPUT_NAME } from 'services/constant';
import { APIs } from 'services/config';
import { requestAPI, validateImage } from 'services/utils';
import { forEach } from 'lodash';
const {
  NAME,
  DESCRIPTION,
  IMAGE,
} = INPUT_NAME.ADD_PROJECT_FORM;

export class AddingProjectContent extends Component {
  static defaultProps = {
    isEdittingProject: false,
    isHiddenBackBtn: false,
    formState: {
      [NAME]: '',
      [DESCRIPTION]: '',
      [IMAGE]: '',
    },
  }

  constructor(props) {
    super(props);
    this.state = {
      [NAME]: props.formState[NAME] || '',
      [DESCRIPTION]: props.formState[DESCRIPTION] || '',
      [IMAGE]: props.formState[IMAGE] || '',
    }
  }

  addProject = (e) => {
    const formData = this.getFormData();
    if (!this.validateAddingProject(formData)) {
      return;
    }

    requestAPI({
      url: APIs.project.addingProject.url,
      method: APIs.project.addingProject.method,
      dataForm: formData,
    }).then(res => {
      if (res.success) {
        this.resetForm();
        Alert.success(res.message)
        this.props.afterAddProject(res.data);
      }
    }).catch(error => {
      if(Array.isArray(error.message) || typeof error.message === 'object'){
        forEach(error.message, msg => {
          msg[0] && Alert.error(msg[0]);
        })
      }else{
        Alert.error(error.message);
      }
    });
  }
  
  editProject(projectId) {
    const formData = this.getFormData();
    let url = APIs.project.edittingProject.url;
    url = url.replace('{projectId}', projectId);
    if (!this.validateEdittingProject(formData)) {
      return;
    }
    requestAPI({
      url: url,
      method: APIs.project.edittingProject.method,
      dataForm: formData,
    }).then(res => {
      if (res.success) {
        Alert.success(res.message)
        this.props.afterEditProject(res.data)
      }
    }).catch(error => {
      if(Array.isArray(error.message) || typeof error.message === 'object'){
        forEach(error.message, msg => {
          msg[0] && Alert.error(msg[0]);
        })
      }else{
        Alert.error(error.message);
      }
    });
  }

  getFormData() {
    const formData = new FormData();
    if (this.state[NAME]) {
      formData.set(NAME, this.state[NAME]);
    }
    
    if (this.state[DESCRIPTION]) {
      formData.set(DESCRIPTION, this.state[DESCRIPTION]);
    }
    if (typeof this.state[IMAGE] === 'object') {
      formData.set(IMAGE, this.state[IMAGE]);
    }
    formData.set('status', 'Public');
    if (this.props.isEdittingProject) {
      formData.set('_method', 'PUT');
    }
    return formData;
  }

  onSubmit = (e) => {
    e.preventDefault();
    if (this.props.isEdittingProject) {
      this.editProject(this.props.formState.id);
    } else {
      this.addProject();
    }
  }

  resetForm() {
    let state = {
      [NAME]: '',
      [DESCRIPTION]: '',
      [IMAGE]: '',
    };

    if (this.props.isEdittingProject) {
      state[NAME] = this.props.formState[NAME];
      state[DESCRIPTION] = this.props.formState[DESCRIPTION];
      state[IMAGE] = this.props.formState[IMAGE];
    }

    this.setState(state);
  }

  onChange = (e) => {
    const el = e.target;
    let value = el.value;
    // if (el.type === 'file') {
    //   if (!validateImage(e.target)) {
    //     return;
    //   }
    //   value = el.files[0];
    // }

    this.setState({
      [el.name]: value,
    });
  }

  validateAddingProject(formData) {
    const { localeProject } = this.props;
    let isValid = true;
    if (!formData.get(NAME)) {
      Alert.error(localeProject.REQUIRED_NAME_MSG)
      isValid = false;
    }
    return isValid;
  }

  validateEdittingProject(formData) {
    if (!formData.get(NAME)) {

      return false;
    }

    return true;
  }

  backToListProjects = () => {
    if (this.props.history && typeof this.props.history.goBack === 'function') {
      this.props.history.goBack();
    }
  }

  render() {
    return (
      <AddingForm
        localeProject={this.props.localeProject}
        localeCommon={this.props.localeCommon}
        onSubmit={this.onSubmit}
        backToListProjects={this.backToListProjects}
        formState={this.state}
        onChange={this.onChange}
        isHiddenBackBtn={this.props.isHiddenBackBtn}
        isEdittingProject={this.props.isEdittingProject}
      />
    )
  }
}

AddingProjectContent.propTypes = {
  afterAddProject: PropTypes.func.isRequired,
  afterEditProject: PropTypes.func.isRequired,
  formState: PropTypes.shape({
    id: PropTypes.number,
    [NAME]: PropTypes.string,
    [DESCRIPTION]: PropTypes.string,
    [IMAGE]: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
  }),
  isEdittingProject: PropTypes.bool.isRequired,
  isHiddenBackBtn: PropTypes.bool,
}

export default withRouter(AddingProjectContent);
