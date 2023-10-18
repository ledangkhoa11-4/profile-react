import React from 'react';
import PropTypes from 'prop-types';


const Project = (props) => {
  return (
      <div className="col-xs-12">
          <div className="item box-main-setting">
            <a role="button" onClick={() => {
              props.gotoProjectDetail(0, props.project.id)
            }}>
              <div className="title ">
                {props.project.name}
              </div>
              <div className="detail">
                <div className="row">
                  <div className="col-xs-6 col-sm-6">
                    <span className="quantity">{ props.project.poll_count }</span>  <span className="text">{props.localeCommon.POLL_PAGE}</span>
                  </div>
                  <div className="col-xs-6 col-sm-6">
                    <span className="quantity">{ props.project.survey_count }</span>  <span className="text">{props.localeCommon.SURVEY_PAGE}</span>
                  </div>
                </div>
              </div>
              <div className="description">
                {props.project.description ? props.project.description : ''}
              </div>
            </a>
            <div className="box-edit">
              <div className="dropdown">
                <div 
                  className="dropdown-toggle" 
                  data-toggle="dropdown"
                  onClick={(e) => e.preventDefault()}
                >
                  <span className="fa fa-circle"></span><span className="fa fa-circle"></span><span className="fa fa-circle"></span>
                </div>
                <ul className="dropdown-menu">
                  <li>
                    <a title={props.localeCommon.EDIT} onClick={() => {
                        props.onEdit(props.project)
                      }}>
                      <span className="material-icons">mode_edit</span>
                      <span className="text">
                        {props.localeCommon.EDIT}
                      </span>
                    </a>
                  </li>
                  <li>
                    <a title={props.localeCommon.DELETE} onClick={() => {
                      props.onDelete(props.project.id)
                    }}>
                      <span className="material-icons">delete_forever</span>
                      <span className="text">
                        {props.localeCommon.DELETE}
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
      </div>
   
  )
}

Project.propTypes = {
  project: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
}

export default Project;
