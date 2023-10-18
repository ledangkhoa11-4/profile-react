import React, { Component } from 'react'
import { map } from 'lodash'

export default class LanguageSelect extends Component {
  state = {
    isOpen: false,
  }

  onChangeLanguage = (language, url) => (evt) => {
    // const language = evt.target.value
    if (language === window.languageActive) {
      return;
    }
    
    window.location.replace(url + `?redirect=${window.location.href}`)
  }

  toggleDropdown = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }))
  }

  render() {
    const languageVal = window.languageActive || 'vi'
    return (
      <div className="wrap-country-select">
        <div onClick={this.toggleDropdown} className="country-view">
          <strong>{ languageVal }</strong>
          <i className="fa fa-caret-down"/>
        </div>
        {
          this.state.isOpen ?
            <div className="country-list">
              {
                map(window.language, (item, key) => {
                  return <div key={key}
                    className={`country-option ${languageVal === key ? 'active' : ''}`}
                    onClick={this.onChangeLanguage(key, item.url)}
                  >
                    { item.name }
                  </div>
                })
              }
            </div> : null
        }
        {
          this.state.isOpen ?
            <div
              style={{
                position:' fixed',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                zIndex: 1
              }}
              onClick={this.toggleDropdown}
            /> : null
        }
      </div>
    )
  }
}
