import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Layout from 'components/Layout';
import { requestAPI } from 'services/utils';
import { APIs, CHILD_ROUTE_PATH } from 'services/config';
import './style.css';
import ListPollSurvey from './List';

const enableCreateSurvey = window.Config ? Boolean(window.Config.enableCreateSurvey) : false;
class ProjectDetailContent extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      projectName: '',
    }
  }
  
  componentDidMount() {
    this.getProjectInfo()
  }

  getProjectInfo() {
    const { getProjectInfo } = APIs.project;    
    const { projectId } = this.props.match.params;
    requestAPI({
      url: getProjectInfo.url.replace('{projectId}', projectId),
      method: getProjectInfo.method,
    }).then(res => {
      if (res.success) {
        this.setState({
          projectName: res.data[0].name,
        })
      }
    })
  }

  goBackPage = () => {
    this.props.history.goBack();
  }

  render() {
    const projectId = this.props.match.params.projectId;
    return (
      <div className="container-detail-project">
        <div className="title-and-add">
          <div className="row">
            <div className="col-sm-6 col-xs-12">
                <div className="title">
                  {this.state.projectName}
                </div>
            </div>
            <div className="col-sm-6 col-xs-12">
              <div className="add">
                <div className="dropdown">
                  <button className="btn btn-primary dropdown-toggle btn-add-survey-and-poll" 
                  type="button" 
                  data-toggle="dropdown">
                    {this.props.localeProject.CREATE_BUTTON}<span className="fa fa-caret-down"></span>
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <Link
                        className="btn"
                        to={CHILD_ROUTE_PATH.PROJECT_CREATE_POLL.replace(':projectId', projectId)}
                      >
                        <span className="text">
                          {this.props.localeCommon.POLL_PAGE}  
                        </span>
                      </Link>
                    </li>
                    {
                      enableCreateSurvey || this.props.user.isadmin ?
                      <li>
                        <Link
                            className="btn"
                            to={CHILD_ROUTE_PATH.PROJECT_CREATE_SURVEY.replace(':projectId', projectId)}
                          >
                            <span className="text">
                              {this.props.localeCommon.SURVEY_PAGE}
                            </span>
                          </Link>
                      </li>
                    :
                      null
                    }
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ListPollSurvey
          projectId={projectId}
          user={this.props.user}
        />
      </div>
     
    )
  }
}

ProjectDetailContent = connect((state, ownProps) => ({
  ...ownProps,
  user: state.user,
}), {
})(ProjectDetailContent)

export default (props) => <Layout
  index={4}
  title="Project Detail"
  menuIcon="assignment"
  mainContent={withRouter(() => <ProjectDetailContent
    {...props}
  />)}
/>
