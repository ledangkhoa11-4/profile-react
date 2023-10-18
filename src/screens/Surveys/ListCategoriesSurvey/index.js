import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Layout from 'components/Layout';
import CategoriesSurvey from './CategoriesSurvey';
import { requestAPI } from 'services/utils';
import { APIs, CHILD_ROUTE_PATH } from 'services/config';
import { updatePageTitle } from 'actions/ui';

const localeCommon = window.locale.Common;

class ListCategoriesContent extends Component {
  state = {
    categories: [],
  }

  componentWillMount () {
    this.props.updatePageTitle(localeCommon.SURVEY_PAGE)
  }

  componentDidMount() {
    this.getListCategory()
  }

  getListCategory() {
    const {
      url,
      method,
    } = APIs.category.getListCategories;

    requestAPI({
      url,
      method,
    }).then(res => {
      if (res.success) {
        this.setState({
          categories: res.data,
        })
      }
    })
  }

  gotoSubcategoriesSurvey = (category) => {
    const url = CHILD_ROUTE_PATH.SURVEY_LIST.replace(':categoryId', category.id)
    this.props.history.push({
      pathname: url,
      state: {
        title: category.name,
      },
    })
  }

  render() {
    if (!this.state.categories.length) {
      return null;
    }
    
    return (
      <div>
        <CategoriesSurvey
          categories={this.state.categories}
          gotoSubcategoriesSurvey={this.gotoSubcategoriesSurvey}
        />
      </div>
    )
  }
}

ListCategoriesContent = connect((state, ownProps) => ({
  ...ownProps,
}), {
  updatePageTitle,
})(ListCategoriesContent)

const ListCategories = () => {
  return (
    <Layout
      index={6}
      mainContent={withRouter(ListCategoriesContent)}
      title="Survey"
      menuIcon="library_books"
    />
  )
}

export default ListCategories;
