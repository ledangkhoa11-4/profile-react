import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-s-alert';
import Select from 'react-select';
import merge from 'deepmerge';
import { find, isEmpty } from 'lodash';
import ProjectCategoroySelect from './ProjectCategorySelect';
import Question from './Question';
import AnswerList from './AnswerList';
import {
  INPUT_NAME,
  QUESTION_TYPES_OPTION,
} from '../../constant';
import { jsonEqual } from 'services/utils';

const {
  POLL_NAME,
  QUESTION_TYPE,
} = INPUT_NAME;
const localeCreate = window.locale.Create;
const localeCommon = window.locale.Common;

class AddQuestionBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categorySelected: undefined,
      projectSelected: props.projectInfo,
      [POLL_NAME]: '',
      isValidCategory: true,
      isValidPollName: true,
      [QUESTION_TYPE]: QUESTION_TYPES_OPTION[0],
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      pollInfo,
      listCategories,
      projectInfo,
    } = nextProps;
    let categorySelected = listCategories[0] || {},
        projectSelected = projectInfo;
    if (jsonEqual(this.props, nextProps)) {
      return;
    }
    
    if (pollInfo.id) {
      // has project_id & category_id
      categorySelected = find(listCategories, { value: pollInfo.category_id });
      const questionTypeString = pollInfo.question && pollInfo.question.question_type;
      const questionType = find(QUESTION_TYPES_OPTION, item => {
        return item.value.indexOf(questionTypeString) > -1;
      })

      this.setState({
        categorySelected,
        projectSelected,
        [POLL_NAME]: pollInfo.name,
        [QUESTION_TYPE]: questionType,
      })
    } else if (!isEmpty(projectInfo)) {
      this.setState({
        projectSelected,
      })
    }
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return !jsonEqual(this.state, nextState);
  }
  
  validateQuestionBox = () => {
    const isValidProjectCategory = this.validateProjectCategory();
    const isValidPollName = this.validatePollName();
    const isValidQuestionBox = this.questionEl.validateQuestionBox();
    const isValidAnswers = this.answersEl.validateAnswers();
    return isValidProjectCategory && isValidPollName &&
          isValidQuestionBox && isValidAnswers;
  }

  validateProjectCategory = () => {
    let isValidCategory = true;
    if (!this.state.categorySelected || !this.state.categorySelected.value) {
      isValidCategory = false;
      Alert.error(localeCreate.REQUIRED_CATEGORY_MSG, {
        timeout: 5000,
      })
    }
    this.setState({
      isValidCategory,
    });
    return isValidCategory;
  }

  validatePollName = () => {
    let isValidPollName = true;
    if (!this.state[POLL_NAME]) {
      isValidPollName = false;
      Alert.error(localeCreate.REQUIRED_POLL_NAME_MSG, {
        timeout: 5000,
      })
    }
    this.setState({ isValidPollName });
    return isValidPollName;
  }

  onChangeProjectCategory = (subState) => {
    this.setState({...this.state, ...subState});
  }

  onChangePollName = (e) => {
    this.setState({ [POLL_NAME]: e.target.value });
  }

  getQuestionBoxData() {
    const questionData = this.questionEl.getQuestion();
    const answersData = this.answersEl.getDataEditing();
    const pollData = {
      poll: {
        project_id: this.state.projectSelected.value,
        category_id: this.state.categorySelected.value,
        name: this.state[POLL_NAME],
      },
    };
    return merge.all([questionData, answersData, pollData]);
  }

  changeQuestionType = (val) => {
    this.setState({
      [QUESTION_TYPE]: val,
    })
  }

  renderAnswers(question, answers) {
    // only render list answer for case create poll OR
    // edit poll if we have an array answer.
    if (this.props.isCreatePoll || Array.isArray(answers)) {
      return <AnswerList
        ref={node => {
          if (node) {
            this.answersEl = node;
          }
        }}
        localeCreate={localeCreate}
        isCreatePoll={this.props.isCreatePoll}
        pollDataFromDashboard={this.props.pollDataFromDashboard}
        question={question}
        questionType={this.state[QUESTION_TYPE]}
        answers={answers}
        isDisableEdit={this.props.isDisableEdit}
      />;
    }
    return null;
  }

  render() {
    const {
      pollInfo,
      pollDataFromDashboard,
      isDisableEdit,
    } = this.props;
    let question, answers;

    if (pollDataFromDashboard && !isEmpty(pollDataFromDashboard)) {
      question = pollDataFromDashboard.question;
      answers = question.answer;
    } else {
      question = pollInfo.question || {};
      answers = question.answer || {};
    }
   
    return (
      <div className="box-poll-add">
        <div className="inner">
          <div className="row">
            <ProjectCategoroySelect
              localeCreate={localeCreate}
              isValidCategory={this.state.isValidCategory}
              listCategories={this.props.listCategories}
              categorySelected={this.state.categorySelected}
              projectSelected={this.state.projectSelected}
              onChangeProjectCategory={this.onChangeProjectCategory}
            />
            <div className="col-xs-12">
              <div className="form-group">
                <label>
                  {localeCreate.POLL_NAME}:
                </label>
                <input
                  className="input"
                  placeholder={localeCreate.POLL_NAME}
                  name={POLL_NAME}
                  value={this.state[POLL_NAME]}
                  onChange={this.onChangePollName}
                />
                {
                  !this.state.isValidPollName ?
                    <span className="placeholder-error">
                      {localeCommon.REQUIRED_FIELD_MSG}
                    </span> : null
                }
              </div>
            </div>
            <div className="col-xs-12">
              <div className="form-group">
                <label>
                  { localeCreate.QUESTION_TYPE_LABEL }
                </label>
                <Select
                  clearable={false}
                  searchable={false}
                  placeholder={localeCreate.QUESTION_TYPE_HOLDER}
                  value={this.state[QUESTION_TYPE]}
                  onChange={this.changeQuestionType}
                  options={QUESTION_TYPES_OPTION}
                  disabled={isDisableEdit}
                />
              </div>
            </div>
            
            <Question
              localeCreate={localeCreate}
              questionData={question}
              ref={node => {
                if (node) {
                  this.questionEl = node;
                }
              }}
            />
            { this.renderAnswers(question, answers) }
          </div>
        </div>
      </div>
    );
  }
}

AddQuestionBox.propTypes = {
  isCreatePoll: PropTypes.bool,
  projectInfo: PropTypes.object.isRequired,
  listCategories: PropTypes.array.isRequired,
  pollInfo: PropTypes.object,
}

export default AddQuestionBox;
