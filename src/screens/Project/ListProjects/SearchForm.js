import React from 'react';
import PropTypes from 'prop-types';
import { INPUT_NAME } from 'services/constant';

const { SEARCH } = INPUT_NAME.SEARCH_PROJECT_FORM;

const SearchForm = (props) => {
  return (
    <div className="box-add background margin-bottom-30">
      <div className="inner">
        <form className="form" onSubmit={props.onSearchProject}>
          <div className="row">
            <div className="col-xs-4 col-sm-6 box-btn-add-project">
              <button type="button" className="btn btn-grey btn-add-project" onClick={props.gotoAddingProject}>
                <span className="material-icons">add</span>
                <span className="text">
                  {props.localeProject.ADD}
                </span>
              </button>
            </div>
            <div className="col-xs-8 col-sm-6 box-btn-search-project">
              <div className="group-search seacrh-project">
                <input
                  name={SEARCH}
                  type="text"
                  className="input"
                  value={props.formState[SEARCH]}
                  onChange={props.onChangeSearchInput}
                  placeholder={props.localeProject.SEARCH}
                />
                {
                  props.isSearching ?
                    <span
                      className="fa fa-times"
                      title="Clear search result"
                      onClick={props.clearSearchResult}
                    /> : null
                }
                <span className="material-icons">search</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

SearchForm.propTypes = {
  gotoAddingProject: PropTypes.func.isRequired,
  formState: PropTypes.object.isRequired,
  onChangeSearchInput: PropTypes.func.isRequired,
  onSearchProject: PropTypes.func.isRequired,
  clearSearchResult: PropTypes.func.isRequired,
}

export default SearchForm;
