import React, { Component } from 'react';
import Alert from 'react-s-alert';
import { INPUT_NAME } from '../../constant';
import { jsonEqual } from 'services/utils';

const localeCreate = window.locale.Create;
const localeCommon = window.locale.Common;
const {
  LABEL_RATING,
} = INPUT_NAME;

class RatingSlider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      [LABEL_RATING]: props.answer[LABEL_RATING],
      isValidLabel: true,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !jsonEqual(this.props, nextProps) || !jsonEqual(this.state, nextState);
  }

  componentWillReceiveProps(nextProps) {
    if (!jsonEqual(this.props.answer, nextProps.answer)) {
      this.setState({...nextProps.answer})
    }
  }  

  onChangeInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    }, () => {
      const answer = {
        numberStar: this.props.answer.numberStar,
        [LABEL_RATING]: this.state[LABEL_RATING],
      }
      this.props.updateAnAnswer(answer, this.props.index)
    })
  }

  validateAnswer = () => {
    let isValidLabel = true;
    if (!this.state[LABEL_RATING]) {
      isValidLabel = false;
      Alert.error(localeCreate.REQUIRED_LABEL, {
        timeout: 5000
      })
    }
    this.setState({ isValidLabel })
    return isValidLabel
  }

  render() {
    return (
      <div className="col-xs-12">
        <div className="form-group">
          <div className="wrap-group">
            <div className="input-group">
              <div className="input-wrap">
                <div className="row">
                  <div className="col-sm-8">
                    <input
                      name={LABEL_RATING}
                      placeholder={localeCreate.LABEL_RATING_HOLDER}
                      className="input"
                      value={this.state[LABEL_RATING]}
                      onChange={this.onChangeInput}
                      tabIndex={2}
                    />
                    {
                      !this.state.isValidLabel ?
                        <span className="placeholder-error">
                          {localeCommon.REQUIRED_FIELD_MSG}
                        </span> : null
                    }
                  </div>
                  <div className="col-sm-4">
                    <img
                      className="question-type-img-holder"
                      src={require('assets/images/rating.jpg')}
                      alt="rating-img-holder"
                    />
                  </div>
                </div>
              </div>
              {
                this.props.lengthAnswer > 1 && !this.props.isDisableEdit?
                  <div className="input-group-addon last">
                    <a
                      role="button"
                      title={localeCreate.ANSWER_REMOVE}
                      onClick={() => {
                        this.props.removeAnswer(this.props.index);
                      }}
                    >
                      <span className="fa fa-trash"></span>
                    </a>
                  </div> : null
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RatingSlider;
