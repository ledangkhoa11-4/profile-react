import React from 'react';
import PropTypes from 'prop-types';
import { INPUT_NAME } from 'services/constant';
// import ImageFileInput from './ImageFileInput';

const {
  NAME,
  DESCRIPTION,
} = INPUT_NAME.ADD_PROJECT_FORM;

const AddingForm = (props) => {
  const {
    formState,
    onChange,
    isHiddenBackBtn,
    localeProject,
    localeCommon,
  } = props;

  return (
    <div className="box-form-add box-form-add-project">
      <div className="inner">
        <form
          className="form"
          onSubmit={props.onSubmit}
        >
          <div className="row">
            <div className="col-xs-12">
              <div className="form-group">
                <label htmlFor={NAME} className="label">
                  {localeProject.NAME}
                </label>
                <input
                  id={NAME}
                  name={NAME}
                  value={formState[NAME]}
                  type="text"
                  placeholder={localeProject.NAME}
                  className="input"
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="col-xs-12">
              <div className="form-group">
                <label htmlFor={DESCRIPTION} className="label">
                  {localeProject.DESCRIPTION}
                </label>
                <textarea
                  id={DESCRIPTION}
                  name={DESCRIPTION}
                  value={formState[DESCRIPTION]}
                  placeholder={localeProject.PLACE_HOLDER}
                  className="input"
                  onChange={onChange}
                />
              </div>
            </div>
            {/* <div className="col-xs-12">
              <ImageFileInput
                localeProject={localeProject}
                formState={formState}
                onChange={onChange}
              />
            </div> */}
            <div className="col-xs-12 pull-right">
              <div className="form-btn text-right">
                <ul>
                  {
                    !isHiddenBackBtn ? 
                      <li>
                        <button
                          type="button"
                          name="back"
                          className="btn btn-grey"
                          onClick={props.backToListProjects}
                        >
                          <span className="material-icons">chevron_left</span>
                          <span className="text">
                            {localeCommon.BACK}
                          </span>
                        </button>
                      </li> : null
                  }
                  <li>
                    <button type="submit" name="add" className="btn btn-grey">
                      <span className="material-icons">
                        { props.isEdittingProject ? 'save' : 'add' }
                      </span>
                      <span className="text">
                        { localeCommon.SAVE }
                      </span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

AddingForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  backToListProjects: PropTypes.func.isRequired,
  formState: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  isEdittingProject: PropTypes.bool.isRequired,
}

export default AddingForm;
