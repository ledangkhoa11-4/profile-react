import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { INPUT_NAME } from '../../constant';

const localeCommon = window.locale.Common;

const ProjectCategorySelect = (props) => {
  
  return (
    <div className="col-xs-12">
      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <input
              key={props.projectSelected.label}
              className="input"
              readOnly={true}
              defaultValue={props.projectSelected.label}
            />
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <Select
              className="custom-select"
              name={INPUT_NAME.CATEGORY}
              clearable={false}
              searchable={false}
              options={props.listCategories}
              onChange={(val) => {
                props.onChangeProjectCategory({categorySelected: val})
              }}
              placeholder={props.localeCreate.CATEGORY}
              value={props.categorySelected}
            />
            {
              !props.isValidCategory ?
                <span className="placeholder-error">
                  {localeCommon.REQUIRED_FIELD_MSG}
                </span> : null
            }
          </div>
        </div>
      </div>
    </div>
  )
}

ProjectCategorySelect.propTypes = {
  categorySelected: PropTypes.object,
  projectSelected: PropTypes.object,
  listCategories: PropTypes.array.isRequired,
  onChangeProjectCategory: PropTypes.func.isRequired,
}

export default ProjectCategorySelect;
