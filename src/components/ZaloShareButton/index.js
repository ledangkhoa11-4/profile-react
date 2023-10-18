import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './index.css'

class ZaloShareButton extends Component {
  componentDidMount() {
    this.clearZalo()
    this.initZalo()
  }

  initZalo() {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://sp.zalo.me/plugins/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'zalo-jssdk'));
      }, 300);
  }
  
  clearZalo() {
    const scriptEl = document.getElementById('zalo-jssdk')
    if (scriptEl) {
      if (window.ZaloHeader) {
        window.ZaloHeader = undefined
      }
      if (window.ZaloSocialSDK) {
        window.ZaloSocialSDK = undefined
      }
      scriptEl.remove()
    }
  }

  render() {
    return (
      <div
        className="zalo-share-button"
        data-href={this.props.url}
        data-oaid="3195242309830750254"
        data-layout="2"
        data-color="blue"
        data-customize={true}
        onClick={this.props.onClick}
      >
        <div className="zalo-icon-wrapper">
          <img
            src={require('../../assets/images/zalo-icon.png')}
            alt="zalo"
          />
        </div>
      </div>
    )
  }
}

ZaloShareButton.propTypes = {
  onClick: PropTypes.func,
}

ZaloShareButton.defaultProps = {
  onClick: () => {
  }
}

export default ZaloShareButton
