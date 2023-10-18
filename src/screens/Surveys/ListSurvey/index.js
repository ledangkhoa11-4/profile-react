import React, { Component } from 'react';
import { connect } from 'react-redux';
import { filter, find } from 'lodash';
import { withRouter } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import Layout from 'components/Layout';
import Survey from './Survey';
import ResultContent from '../../Poll/ResultContent';
import FilterForm from './FilterForm';
import BottomLoading from 'components/BottomLoading';
import { APIs, CHILD_ROUTE_PATH } from 'services/config';
import { onScroll, requestAPI } from 'services/utils';
import { updatePageTitle } from 'actions/ui';
import { INPUT_NAME } from '../../Project/constant';

const localeSurvey = window.locale.Survey;
const localePoll = window.locale.Poll;
const localeCommon = window.locale.Common;
const localeCreate = window.locale.Create;

class ListSurveysContent extends Component {
  state = {
    isBottomLoading: false,
    next_page_url: '',
    surveys: [],
    categories: [],
    category: '',
    surveyId: '',
    expiredStatus: 'no',
    all_total: 0,
    view_total: 0,
    currentSurvey: null,
    currentQuestion: null,
    isShowResultModal: false,
  }

  constructor() {
    super();
    this.hasWillUnmount = false;
  }
  
  componentWillMount () {
    const title = (this.props.location.state && this.props.location.state.title) || '';
    this.props.updatePageTitle(title)
  }

  componentDidMount () {
    const { categoryId } = this.props.match.params;
    window.addEventListener('scroll', this.handleLoadmore)
    this.getListSurvey(categoryId)
    this.getListCategory(categoryId)
  }

  componentWillUnmount () {
    this.hasWillUnmount = true;
    window.removeEventListener('scroll', this.handleLoadmore)
  }

  changeCategory = (val) => {
    this.setState({
      category: val,
      expiredStatus: 'no',
    }, () => {
      this.props.updatePageTitle(val.label)
      this.getListSurvey()
    })
  }

  changeExpiredStatus = (val) => {
    this.setState({ expiredStatus: val }, () => {
      this.getListSurvey()
    })
  }

  closeResultModal = () => {
    this.setState({
      isShowResultModal: false,
      currentSurvey: null,
      currentQuestion: null,
      resultAnswer: null,
    })
  }

  onOpenResultPopup = async (survey) => {
    const { id, question } = survey;

    if (!question || !question[0]) {
      return;
    }

    const res = await this.getResultAnswer(id, question[0].id);

    if (res.success) {
      this.setState({
        currentQuestion: question[0],
        currentSurvey: survey,
        isShowResultModal: true,
        resultAnswer: res.data,
      })
    }
  }

  handleLoadmore = async () => {
    await onScroll();
    if (this.state.isBottomLoading) return;
    
    if (this.state.next_page_url) {
      this.setState({
        isBottomLoading: true,
      }, () => {
        this.getListSurvey(
          this.state.category.value,
          this.state.next_page_url,
          false
        )
      });
    }
  }
  
  getResultAnswer = (surveyId, questionId) => {
    const { getResultAnswer } = APIs.survey;

    return requestAPI({
      url: getResultAnswer.url,
      method: getResultAnswer.method,
      dataForm: {
        survey_id: parseInt(surveyId, 10),
        question_id: questionId
      },
    })
  }

  getResultBaseOnQuestion = async (questionId, successCB) => {
    const {
      currentSurvey,
      // currentQuestion,
    } = this.state;

    if (!currentSurvey) {
      return;
    }

    const res = await this.getResultAnswer(currentSurvey.id, questionId);

    if (res.success) {
      const question = find(currentSurvey.question, { id: questionId })
      typeof successCB === 'function' && successCB();
      this.setState({
        currentQuestion: question,
        resultAnswer: res.data,
      });
    }
  }
  
  getListSurvey(categoryId, loadmoreUrl, isShowPageLoading = true) {
    const { getListSurveys } = APIs.survey;
    requestAPI({
      url: loadmoreUrl || getListSurveys.url,
      method: getListSurveys.method,
      isShowPageLoading,
      dataForm: {
        category_id: categoryId || this.state.category.value,
        expired: this.state.expiredStatus.value
      }
    }).then(res => {      
      if (this.hasWillUnmount) {
        return;
      }

      if (res.success) {
        const surveys = !loadmoreUrl ? res.data.data :
          this.state.surveys.concat(res.data.data);

        this.setState({
          next_page_url: res.data.next_page_url,
          surveys,
          all_total: res.data.all_total,
          view_total: res.data.total,
          isBottomLoading: false,
        })
      }
    })
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
        const { categoryId } = this.props.match.params;
        let currentCategory = filter(res.data, category => {
          return category.id === parseInt(categoryId, 10)
        })[0]
        
        if (currentCategory) {
          currentCategory = {
            value: currentCategory.id,
            label: currentCategory.name,
          }
        }
        
        this.setState({
          categories: res.data,
          category: currentCategory,
        })
      }
    })
  }

  gotoSurveyDetail = (surveyId) => {
    this.props.history.push({
      pathname: CHILD_ROUTE_PATH.SURVEY_DETAIL.replace(':surveyId', surveyId),
    })
  }

  renderNoMatchTarget() {
    const { surveys, all_total, view_total } = this.state
    if (surveys.length) {
      return null
    }

    if (view_total === 0 && all_total) {
      return (
        <div className="appropriate-target">
          <div className="col-sm-6 item text-center">
            <p>
              { localeSurvey.LIMIT_VIEW_MSG }
            </p>
          </div>
          <div className="col-sm-6 item text-center">
            <p>
              { localeSurvey.TOTAL_COUNT_LABEL }
            </p>
            <span>
              { all_total }
            </span>
          </div>
        </div>
      )
    }

    // view_total === 0 && all_total === 0
    return (
      <div>
        <div className="form form-option">
          <div className="alert alert-warning" role="alert">
            {localeSurvey.NO_SURVEY_MSG}
          </div>
        </div>
      </div>
    )
  }

  onFilterResultWithTarget = (resultAnswer) => {
    this.setState({ resultAnswer });
  }

  render() {
    const { currentSurvey } = this.state;
    const userAvatar = currentSurvey && currentSurvey.user ?
      currentSurvey.user.fullAvatar :
      require('assets/images/user-icon-placeholder.png');
    const isOwner = this.state.currentSurvey ?
      this.props.user.id === this.state.currentSurvey.user_id : false;

    return (      
      <div>
        <FilterForm
          categories={this.state.categories}
          category={this.state.category}
          changeCategory={this.changeCategory}
          localeSurvey={localeSurvey}
          expiredStatus={this.state.expiredStatus}
          changeExpiredStatus={this.changeExpiredStatus}
        />
        <div className="box-dashboard">
          <div className="inne">
            { this.renderNoMatchTarget() }
            {
              this.state.surveys.map((survey, idx) => {
                return (
                  <Survey
                    key={idx}
                    survey={survey}
                    gotoSurveyDetail={this.gotoSurveyDetail}
                    localeSurvey={localeSurvey}
                    localePoll={localePoll}
                    localeCommon={localeCommon}
                    user={this.props.user}
                    onOpenResultPopup={this.onOpenResultPopup}
                  />
                )
              })
            }
            {
              this.state.isBottomLoading ?
                <BottomLoading/> : null
            }
          </div>
        </div>

        <Modal
          open={this.state.isShowResultModal}
          onClose={this.closeResultModal}
          showCloseIcon={true}
          classNames={{
            overlay: 'Modal-overlay-0-1',
            modal: 'Modal-modal-0-3',
            closeIcon: 'Modal-closeIcon-0-4'
          }}
        >
          {
            currentSurvey && currentSurvey.user ?
              (
                <div className="box-item">
                  <div className="head">
                    <div className="thumb">
                      <img src={userAvatar} alt={currentSurvey.user.name} />
                    </div>
                    <div className="title">
                      <h3>{currentSurvey.user.name}</h3>
                    </div>
                    <div className="point">
                      <span className="number">{currentSurvey.point || 0}</span>
                      <span className="text">
                        {localePoll.POINT_RESULT}
                      </span>
                    </div>
                  </div>
                  <ResultContent
                    keyPollSurvey="survey"
                    localeCreate={localeCreate}
                    question={this.state.currentQuestion}
                    resultAnswer={this.state.resultAnswer}
                    viewResult={isOwner || this.state.currentSurvey[INPUT_NAME.VIEW_RESULT]}
                    viewSocial={isOwner || this.state.currentSurvey[INPUT_NAME.VIEW_SOCIAL]}
                    shareSocial={this.state.currentSurvey.shareSocial || ''}
                    listQuestions={this.state.currentSurvey.question}
                    getResultBaseOnQuestion={this.getResultBaseOnQuestion}
                    isOwner={isOwner}
                    onFilterResultWithTarget={this.onFilterResultWithTarget}
                  />
                </div>
              ) : null
          }
        </Modal>
      </div>
    )
  }
}

ListSurveysContent = connect((state, ownProps) => ({
  ...ownProps,
  user: state.user,
}), {
  updatePageTitle,
})(ListSurveysContent)

const ListSurveys = (props) => {
  return (
    <Layout
      index={6}
      mainContent={withRouter(ListSurveysContent)}
      title={(props.location.state && props.location.state.title) || ''}
      menuIcon="library_books"
    />
  )
}

export default withRouter(ListSurveys);
