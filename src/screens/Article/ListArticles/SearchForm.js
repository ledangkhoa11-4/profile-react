import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select'

import { INPUT_NAME } from 'services/constant';

const { SEARCH } = INPUT_NAME.SEARCH_PROJECT_FORM;

const SearchForm = (props) => {
  return (
    <form onSubmit={props.onSubmitForm}>
      <div className="search">
        <input
          name={SEARCH}
          type="search"
          placeholder={window.locale.Article.SEARCH} 
          value={props.formState[SEARCH]}
          onChange={props.onChangeSearch}
        />
        <button onClick={props.onClickSearch} className='btnsearch'><i className="fa fa-search"/></button>
      </div>
      <Select
        value={props.formState.categoryId}
        onChange={props.handleChangeCategory}
        options={props.formState.categories}
      />
    </form>
  )
}

SearchForm.propTypes = {
  onSubmitForm: PropTypes.func.isRequired,
  formState: PropTypes.object.isRequired,
  onChangeSearch: PropTypes.func.isRequired,
  onClickSearch: PropTypes.func.isRequired,
}

export default SearchForm;
