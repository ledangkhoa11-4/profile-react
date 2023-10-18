import React, { Component } from 'react';
import { INPUT_NAME } from '../constant';
import { jsonEqual } from 'services/utils'


const localeCreate = window.locale.Create;
class CheckBoxSettingForm extends Component {  
  constructor(props) {
    super(props)

    this.state = {
      [INPUT_NAME.VIEW_RESULT]: props.checkboxSetting[INPUT_NAME.VIEW_RESULT],
      [INPUT_NAME.VIEW_SOCIAL]: props.checkboxSetting[INPUT_NAME.VIEW_SOCIAL],
    }
  }  

  componentWillReceiveProps(nextProps) {
    if (!jsonEqual(this.props.checkboxSetting, nextProps.checkboxSetting)) {
      this.setState({
        [INPUT_NAME.VIEW_RESULT]: nextProps.checkboxSetting[INPUT_NAME.VIEW_RESULT],
        [INPUT_NAME.VIEW_SOCIAL]: nextProps.checkboxSetting[INPUT_NAME.VIEW_SOCIAL],
      })
    }
  }
  
  onChange = (fieldName) => {
    this.setState({
      [fieldName]: !this.state[fieldName]
    })
  }

  render() {
    return (
      
      <div className="row box-checkbox-view-result-social">
        
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <div>
              <span>
                { localeCreate.ALLOW_VIEW_RESULT_LABEL }
              </span>
              <input
                type="checkbox"
                name={INPUT_NAME.VIEW_RESULT}
                className="toggle"
                checked={!!this.state[INPUT_NAME.VIEW_RESULT]}
                onChange={() => this.onChange(INPUT_NAME.VIEW_RESULT)}
              />
          </div>
          <div>
            <span>
              { localeCreate.ALLOW_SHARE_LABEL }
            </span>
            <input
              type="checkbox"
              name={INPUT_NAME.VIEW_SOCIAL}
              className="toggle"
              checked={!!this.state[INPUT_NAME.VIEW_SOCIAL]}
              onChange={() => this.onChange(INPUT_NAME.VIEW_SOCIAL)}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default CheckBoxSettingForm;
