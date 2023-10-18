import React, { Component } from 'react';
import Alert from 'react-s-alert';
// import PropTypes from 'prop-types';
import { isEmpty, filter, map, reduce } from 'lodash';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'react-share';
import ChartGender from './ChartGender';
import ChartAge from './ChartAge';
import ChartTimeline from './ChartTimeline';
// import SharePollSurvey from 'components/SharePollSurvey';
import {
  requestAPI,
} from 'services/utils';
import { APIs } from 'services/config';
import {
  parseData,
  renderCarousel,
  renderSpecificTarget,
} from './renderOption';
import ZaloShareButton from '../../components/ZaloShareButton';
import IndexQuestion from '../Surveys/Survey/IndexQuestion';
import { INPUT_NAME } from '../Project/constant';
import { BASE_URL, ROUTER_PATH } from 'services/config'
import { renderQuestionSection, exportCSV } from './utils';

const localePoll = window.locale.Poll;
const localeCreate = window.locale.Create;
const localeCommon = window.locale.Common;
const localeSurvey = window.locale.Survey;
const {
  AGE_FROM,
  AGE_TO,
  GENDER,
  CITY,
  COUNTRY,
} = INPUT_NAME;

class ResultContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      [AGE_FROM]: '',
      [AGE_TO]: '',
      [GENDER]: '',
      [CITY]: '',
      answerSelected: {},
      idxActive: 0,
      listTargetOption: [],
      listCityOption: [],
      currentIdxQuestion: 0,
      isShowTimeline: false,
      isShowAdvanceFilter: false,
    }
  }
  
  componentWillMount() {
    this.getTargetOptions()
    this.getCityOptions()
  }  

  clearTargetForm = () => {
    this.setState({
      [AGE_FROM]: '',
      [AGE_TO]: '',
      [GENDER]: '',
      [CITY]: '',
      answerSelected: {},
      idxActive: 0,
    })
  }

  onChangeCity = (val) => {
    this.setState({
      [CITY]: val,
    });
  }

  onChangeGender = (val) => {
    this.setState({
      [GENDER]: val,
    });
  }

  onChangeInputText = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  onChangeTabIndex = (idx) => {
    if (idx === this.state.idxActive) return;
    this.setState({
      idxActive: idx
    });
  }

  /*
  * change answer for the option
  */
  onChangeAnswers = (question, answerObj) => {
    const newAnswer = {
      [question.id]: answerObj
    };
    this.setState({
      answerSelected: {
        ...this.state.answerSelected,
        ...newAnswer
      },
    })
  }

  getCityOptions = async () => {
    const res = await requestAPI({
      url: APIs.poll.getListCity.url,
      method: APIs.poll.getListCity.method,
    });

    if (res.success) {
      const listCityOption = parseData(res.data, 'city_id', 'vietnamese');
      this.setState({ listCityOption })
    }
  }

  getTargetOptions = async () => {
    const res = await requestAPI({
      url: APIs.target.getTargetOptions.url,
      method: APIs.target.getTargetOptions.method,
    });

    if (res.success) {
      this.setState({ listTargetOption: res.data })
    }
  }

  gotoTheQuestion = (index) => {
    const {
      listQuestions,
      getResultBaseOnQuestion,
    } = this.props;
    if (!listQuestions || listQuestions.length === 0) {
      return;
    }
    typeof getResultBaseOnQuestion === 'function' &&
      getResultBaseOnQuestion( listQuestions[index].id, () => {
        this.setState({ currentIdxQuestion: index })
      })
  }

  getDataFilter() {
    const { answerSelected, listTargetOption } = this.state;    
    const basicTarget = {};
    const ageFrom = parseInt(this.state[AGE_FROM], 10);
    const ageTo = parseInt(this.state[AGE_TO], 10);
    if (this.state[GENDER]) basicTarget[GENDER] = map(this.state[GENDER], item => item.value);
    if (this.state[CITY]) basicTarget[CITY] = map(this.state[CITY], item => item.value);
    if (!isNaN(ageFrom)) basicTarget[AGE_FROM] = ageFrom;
    if (!isNaN(ageTo)) basicTarget[AGE_TO] = ageTo;
    if (!isEmpty(basicTarget)) basicTarget[COUNTRY] = 'VietNam';

    const advanceTarget = reduce(answerSelected, (finalResult, answer, key) => {
      let result;
      result = reduce(listTargetOption, (_result, targetOpt) => {
        const temp = filter(targetOpt.question, question => question.id === parseInt(key, 10));
        return [..._result, ...temp];
      }, []);

      if (result.length) {
        let answer_id;
        if (Array.isArray(answer)) {
          answer_id = map(answer, ans => ans.value);
        } else {
          answer_id = [answer.value];
        }
        finalResult.push({
          categorie_id: parseInt(result[0].categorie_id, 10),
          question_id: result[0].id,
          answer_id,
        });
      }
      return finalResult;
    }, []);

    const result = {};

    if (!isEmpty(basicTarget)) {
      result.basicTarget = basicTarget;
    }
    if (!isEmpty(advanceTarget)) {
      result.advanceTarget = advanceTarget;
    }
    return result;
  }

  validateFilterData = () => {
    const filterData = this.getDataFilter();

    return !isEmpty(filterData);
  }

  filterResultWithTarget = async () => {
    const filterData = this.getDataFilter();
    
    const { keyPollSurvey, question } = this.props;
    const api = keyPollSurvey === 'poll' ?
      APIs.poll.getResultAnswer : APIs.survey.getResultAnswer;

    if (!this.validateFilterData()) {
      return;
    }
    
    const dataForm = {
      [`${keyPollSurvey}_id`]: question[`${keyPollSurvey}_id`],
      ...filterData
    };

    if (keyPollSurvey === 'survey') {
      dataForm.question_id = question.id;
    }

    const res = await requestAPI({
      url: api.url,
      method: api.method,
      dataForm
    });

    if (!res.success) {
      return Alert.error('Request error');
    }
    this.props.onFilterResultWithTarget(res.data)
  }

  toggleTimeline = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    this.setState((prevState) => ({
      isShowTimeline: !prevState.isShowTimeline
    }))
  }

  toggleAdvanceFilter = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.setState((prevState) => ({
      isShowAdvanceFilter: !prevState.isShowAdvanceFilter
    }))
  }

  render() {
    const {
      question,
      listQuestions,
      resultAnswer,
      isHideQuestion,
      viewSocial,
      shareSocial,
      isFreePoll,
    } = this.props;
    if (!question) {
      return null;
    }
    const shareResultUrl = this.props.keyPollSurvey === 'poll' ?
      BASE_URL + '/share' + ROUTER_PATH.RESULT_DETAIL_POLL
        .replace(':pollId', question.id) : '';
  
    return (
      <div className="result-content">
        {
          listQuestions && listQuestions.length ?
            <div className="nav-result-survey">
              <ul className="list">
                {
                  listQuestions.map((item, index) => {
                    return <IndexQuestion
                      key={index}
                      backToQuestion={this.gotoTheQuestion}
                      current={this.state.currentIdxQuestion}
                      index={index}
                      isActiveOne={true}
                    />;
                  })
                }
              </ul>
            </div> : null
        }
        <div className="content">
        {
            question && !isHideQuestion ?
              this.props.keyPollSurvey === 'poll' ?
                this.props.name ?
                  <p>{this.props.name}</p>
                :
                  <p dangerouslySetInnerHTML={{
                    __html: question.question
                  }}/>
              : 
                <p>{question.question}</p>
            :
              null
          }
          {
            this.props.isOwner  && !isFreePoll ?
              <div className="form">
                <a
                  className="paid-btn advance-filter-result"
                  onClick={this.toggleAdvanceFilter}
                >
                  <span className="text">
                    { localeCommon.ADVANCE_FILTER_BTN }
                  </span>
                  &nbsp;
                  <span className="fa fa-filter"/>
                </a>
                {
                  this.state.isShowAdvanceFilter ?
                    <div className="tabs">
                      <div className="tabs-list">
                        <div className="list">
                          {renderCarousel({
                            ...this.props,
                            formState: {
                              idxActive: this.state.idxActive
                            },
                            listTargetOption: this.state.listTargetOption,
                            onChangeTabIndex: this.onChangeTabIndex
                          })}
                        </div>
                      </div>
                      <div className="tabs-content">
                        <div className="detail-tab">
                          <div className="row">
                            {renderSpecificTarget({
                              ...this.props,
                              formState: {
                                idxActive: this.state.idxActive,
                                answerSelected: this.state.answerSelected,
                                [AGE_FROM]: this.state[AGE_FROM],
                                [AGE_TO]: this.state[AGE_TO],
                                [GENDER]: this.state[GENDER],
                                [CITY]: this.state[CITY]
                              },
                              listTargetOption: this.state.listTargetOption,
                              listCityOption: this.state.listCityOption,
                              onChangeInputText: this.onChangeInputText,
                              onChangeGender: this.onChangeGender,
                              onChangeCity: this.onChangeCity,
                              onChangeAnswers: this.onChangeAnswers
                            })}
                          </div>
                        </div>
                      </div>
                      {
                        this.validateFilterData() ?
                          <div className="form-btn text-right">
                            <ul>
                              <li>
                                <button
                                  className="btn btn-grey"
                                  type="button"
                                  onClick={this.clearTargetForm}
                                >
                                  <span className="fa fa-times" />
                                  <span className="text">
                                    {localeCreate.CANCEL_TARGET_BUTTON}
                                  </span>
                                </button>
                              </li>
                              <li>
                                <button
                                  className="btn"
                                  onClick={this.filterResultWithTarget}
                                  type="button"
                                >
                                  <span className="fa fa-search" />
                                  <span className="text">
                                    {localePoll.RESULT_BUTTON}
                                  </span>
                                </button>
                              </li>
                            </ul>
                          </div> : null
                      }
                    </div> : null
                }
              </div> : null
          }
          <div className="view">
            <div id="all" className="item full">
              { renderQuestionSection(question, resultAnswer) }
            </div>
            {
              resultAnswer.advance ?
                <div id="gender" className="item">
                  <h3 className="title">Gender</h3>
                  <div className="chart">
                    <ChartGender
                      resultAnswer={resultAnswer}
                    />
                  </div>
                </div> : null
            }
            {
              resultAnswer.advance ?
                <div id="age" className="item">
                  <h3 className="title">Age</h3>
                  <div className="chart">
                    <ChartAge
                      resultAnswer={resultAnswer}
                    />
                  </div>
                </div> : null
            }
            {
              this.props.isOwner && resultAnswer.advance && !isFreePoll ?
                <div id="timeline" className="item full">
                  <div>
                    <h3 className="title more-timeline" onClick={this.toggleTimeline}>
                      Timeline
                      <span className={
                        this.state.isShowTimeline ?
                          'fa fa-sort-asc': 'fa fa-sort-desc'
                      }/>
                    </h3>
                    {
                      this.state.isShowTimeline ?
                        <div className="chart">
                          <ChartTimeline
                            listCityOption={this.state.listCityOption}
                            resultAnswer={resultAnswer}
                          />
                        </div> : null
                    }
                  </div>
                </div> : null
            }
          </div>
        </div>
        <div className="box">
          <div className="inner">
            <div className="content">
              <div className={
                this.props.keyPollSurvey === 'poll' ?
                  'col-xs-12' : 'pull-left'
              }>
                  {
                    viewSocial ? 
                      <div className="row">
                        <div className={
                          this.props.keyPollSurvey === 'poll' ?
                            'col-sm-6' : ''
                        }>
                          <div className="list-check-social pull-left">
                            <div className="title-share">
                              {
                                this.props.keyPollSurvey === 'poll' ?
                                  localePoll.SHARE_ON :
                                  localeSurvey.SHARE_ON
                              }
                            </div>
                            <ul className="list-icon">
                              <li>
                                <FacebookShareButton
                                  url={shareSocial}
                                >
                                  <FacebookIcon
                                    size={35}
                                    round
                                  />
                                </FacebookShareButton>
                              </li>
                              <li>
                                <TwitterShareButton
                                  url={shareSocial}
                                >
                                  <TwitterIcon
                                    size={35}
                                    round
                                  />
                                </TwitterShareButton>
                              </li>
                              <li>
                                <ZaloShareButton
                                  url={shareSocial}
                                />
                              </li>
                            </ul>
                          </div>
                        </div>
                        {
                          this.props.keyPollSurvey === 'poll' ?
                            <div className="col-sm-6">
                              <div className="list-check-social pull-left">
                                <div className="title-share">
                                  { localePoll.SHARE_ON_RESULT }
                                </div>
                                <ul className="list-icon">
                                  <li>
                                    <FacebookShareButton
                                      url={shareResultUrl}
                                    >
                                      <FacebookIcon
                                        size={35}
                                        round
                                      />
                                    </FacebookShareButton>
                                  </li>
                                  <li>
                                    <TwitterShareButton
                                      url={shareResultUrl}
                                    >
                                      <TwitterIcon
                                        size={35}
                                        round
                                      />
                                    </TwitterShareButton>
                                  </li>
                                  <li>
                                    <ZaloShareButton
                                      url={shareResultUrl}
                                    />
                                  </li>
                                </ul>
                              </div>
                            </div> : null
                        }
                      </div> : null
                  }
              </div>
              <div className={
                this.props.keyPollSurvey === 'poll' ?
                  'col-xs-12' : 'pull-right'
              }>
                <div className="button-save pull-right">
                  <ul>
                    <li>
                      <button type="button" name="download" className="btn" onClick={() => {
                        exportCSV(this.props)
                      }}>
                        <span className="material-icons">file_download</span>
                        <span className="text">
                          { localePoll.DOWNLOAD_BUTTON }
                        </span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// ResultContent.propTypes = {

// };

ResultContent.defaultProps = {
  hasFixHeightSlider: true,
}

export default ResultContent;
