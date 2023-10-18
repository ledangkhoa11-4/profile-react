import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import Select from 'react-select';

const optionsAnswer = (answers) => {
  if (!answers.length) return [];
  return answers.map(ans => ({
    value: ans.id,
    label: ans.name,
  }));
}

class FormAnswer extends Component {
  constructor(props) {
    super(props);
    const value = this.props.question.type === '0' ? 
                    this.props.userAnswer[0] :
                    this.props.userAnswer;
    const isShowForm = (value == 0) ? true : false;
    this.state = {
      isShowForm: isShowForm,
      value,
    };
  }

  toggleForm = () => {
    const value = this.props.question.type === '0' ? 
                    this.props.userAnswer[0] :
                    this.props.userAnswer;
    this.setState({
      value: value ? value : undefined,
      isShowForm: !value ? true : !this.state.isShowForm
    });
  }

  showForm = () => {
    this.setState({ isShowForm: true });
  }

  onChange = (value) => {
    this.setState({ value });
  }

  updateUserProfile = () => {
    const answer_id = Array.isArray(this.state.value) ?
      map(this.state.value, val => val.value) :
      [this.state.value.value];
    const dataForm = {
      answer_id,
      question_id: this.props.question.id,
    }
    
    this.props.updateUserProfile(dataForm, () => {
      this.toggleForm();
    });
  }

  render() {
    const ques = this.props.question;
    return (
      <form
        name="question-form"
        className={this.state.isShowForm ? `answer form` : `hidden`}
      >
        <div className="form-group">
          <Select
            clearable={false}
            searchable={false}
            className="custom-select"
            multi={ques.type === '0' ? false : true}
            closeOnSelect={ques.type === '0' ? true : false}
            removeSelected={false}
            options={optionsAnswer(ques.answer)}
            value={this.state.value}
            onChange={this.onChange}
          />
        </div>
        <button type="button" name="check" className="btn" onClick={this.updateUserProfile}>
          <span className="material-icons">check</span>
        </button>
        {
          this.state.value ?
            <button type="button" name="clear" className="btn" onClick={this.toggleForm}>
              <span className="material-icons">clear</span>
            </button>
          : null
        }
      </form>
    );
  }
}

FormAnswer.propTypes = {
  question: PropTypes.object.isRequired,
  userAnswer: PropTypes.array,
  updateUserProfile: PropTypes.func.isRequired,
};

export default FormAnswer;
