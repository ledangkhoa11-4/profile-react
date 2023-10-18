import React, { Component } from 'react';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';
import { withRouter } from 'react-router-dom';
import { filter, isEmpty, map } from 'lodash';
import Modal from 'react-responsive-modal';
import Layout from 'components/Layout';
import Project from './Project';
import SearchForm from './SearchForm';
import { AddingProjectContent } from '../AddingProject';
import './style.css';
import { requestAPI } from 'services/utils';
import { CHILD_ROUTE_PATH, APIs } from 'services/config';
import { INPUT_NAME } from 'services/constant';
import { updatePageTitle } from 'actions/ui';

const { SEARCH } = INPUT_NAME.SEARCH_PROJECT_FORM;

class ListProjectsContent extends Component {
  state = {
    isOpenModal: false,
    [SEARCH]: '',
    listProjects: [],
    projectSearching: [],
    isSearching: false,
    edittingProjectformState: {},
  }

  componentWillMount () {
    this.props.updatePageTitle(this.props.localeCommon.PROJECT_PAGE)
  }  

  componentDidMount() {
    this.getListProjects();
  }
  
  getListProjects() {
    requestAPI({
      url: APIs.project.getListProjects.url,
      method: APIs.project.getListProjects.method,
    }).then(res => {
      this.setState({
        listProjects: res.data,
      });
    });
  }

  gotoAddingProject = () => {
    // this.props.history.push(CHILD_ROUTE_PATH.PROJECT_ADD);
    this.toggleModal()
  }

  onChangeSearchInput = (e) => {
    this.setState({
      [SEARCH]: e.target.value,
    });
  }

  onDelete = (projectId) => {
    let url = APIs.project.deleteProject.url;
    url = url.replace('{projectId}', projectId);
    requestAPI({
      url,
      method: APIs.project.deleteProject.method,
    }).then(res => {
      const newListProject = filter(this.state.listProjects, item => item.id !== projectId);
      this.setState({
        listProjects: newListProject,
      });
    }).catch(error => {
      Alert.error(error.message)
    });
  }

  onEdit = async (project) => {
    this.setState({
      edittingProjectformState: project
    }, () => this.toggleModal());
  }

  toggleModal = () => {
    this.setState({
      isOpenModal: !this.state.isOpenModal,
    },() =>{
      if(this.state.isOpenModal === false){
        this.setState({
          edittingProjectformState: {}
        })
      }
    });
  }

  afterEditProject = (data) => {
    const newListProject = map(this.state.listProjects, item => {
      const newItem = item.id === data.id ?
        Object.assign({}, item, data) : item;
      return newItem;
    });

    this.setState({
      listProjects: newListProject,
      edittingProjectformState: {},
    }, () => {
      this.toggleModal();
    });
  }

  afterAddProject = (projectInfo) => {
    const listProjects = [...this.state.listProjects]
    projectInfo.poll_count = 0;
    projectInfo.survey_count = 0;
    listProjects.push(projectInfo)
    
    this.setState({
      listProjects,
    }, () => {
      this.toggleModal()
    })
  }

  renderProjects = () => {
    const {
      listProjects,
      projectSearching,
      isSearching,
    } = this.state;
    const projects = isSearching ? projectSearching : listProjects;
    const listProject = [];
    let row;
    for (let i = 0, l = projects.length; i < l; i ++) {
      row = <div className="row list-projetc " key={projects[i].id}>
              <Project
                localeCommon={this.props.localeCommon}
                gotoProjectDetail={this.gotoProjectDetail}
                onDelete={this.onDelete}
                onEdit={this.onEdit}
                toggleModal={this.toggleModal}
                project={projects[i]}
              />
            </div>;
      listProject.push(row);
    }
    return listProject;
  }

  gotoProjectDetail = (idx, projectId) => {
    const pathname = CHILD_ROUTE_PATH.PROJECT_DETAIL
                      .replace(':projectId', projectId);
    
    this.props.history.push(pathname);
  }

  onSearchProject = (e) => {
    e.preventDefault();
    if (!this.state[SEARCH]) {
      return;
    }

    const { searchProject } = APIs.project;
    requestAPI({
      url: searchProject.url,
      method: searchProject.method,
      dataForm: {
        reseach: this.state[SEARCH],
      },
    }).then(res => {
      if (res.success) {
        this.setState({
          isSearching: true,
          projectSearching: res.data,
        })
      }
    })
  }

  clearSearchResult = () => {
    this.setState({
      [SEARCH]: '',
      isSearching: false,
      projectSearching: [],
    })
  }

  render() {
    const { localeProject } = this.props;
    const isEdittingProject = !isEmpty(this.state.edittingProjectformState);
    return (
      <div>
        <SearchForm
          formState={this.state}
          localeProject={this.props.localeProject}
          clearSearchResult={this.clearSearchResult}
          onChangeSearchInput={this.onChangeSearchInput}
          gotoAddingProject={this.gotoAddingProject}
          onSearchProject={this.onSearchProject}
          isSearching={this.state.isSearching}
        />
        <div className="box-project">
          <div className="inner">
            { this.renderProjects() }
          </div>
        </div>
        <Modal
          open={this.state.isOpenModal}
          onClose={this.toggleModal}
          showCloseIcon={true}
          classNames={{
            overlay: 'Modal-overlay-0-1',
            modal: 'Modal-modal-0-3',
            closeIcon: 'Modal-closeIcon-0-4 '
          }}
        >
          <div className="box-item">
            <div className="head">
              <div className="title project">
                <h3>
                  {
                    isEdittingProject ?
                      localeProject.EDIT_TITLE :
                      localeProject.ADD_TITLE
                  }
                </h3>
              </div>
            </div>
            <AddingProjectContent
              localeProject={this.props.localeProject}
              localeCommon={this.props.localeCommon}
              isHiddenBackBtn={true}
              isEdittingProject={isEdittingProject}
              formState={this.state.edittingProjectformState}
              afterEditProject={this.afterEditProject}
              afterAddProject={this.afterAddProject}
            />
          </div>
        </Modal>
      </div>
    )
  }
}

ListProjectsContent = connect((state, ownProps) => ({
  ...ownProps,
}), {
  updatePageTitle,
})(ListProjectsContent)

const ListProjects = (props) => {
  return (
    <Layout
      index={4}
      title="List Projects"
      menuIcon="assignment"
      mainContent={withRouter(() => {
        return <ListProjectsContent {...props}/>
      })}
    />
  )
}

export default ListProjects;
