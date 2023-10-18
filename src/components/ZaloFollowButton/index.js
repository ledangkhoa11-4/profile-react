import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ZaloFollowButton extends Component {
    componentDidMount() {
        this.initZalo()
        this.clearZalo()
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
            <div class="zalo-follow-only-button" data-oaid="1056425240097198920"></div>
        )
      }
}
ZaloFollowButton.propTypes = {
    onClick: PropTypes.func,
  }
  
ZaloFollowButton.defaultProps = {
    onClick: () => {
    }
}
  
export default ZaloFollowButton