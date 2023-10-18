import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Masonry from 'react-masonry-component';
import Layout from 'components/Layout';
import { ROUTER_PATH } from 'services/config';
import FriendProvider from './FriendProvider';
import { updatePageTitle } from 'actions/ui';

class ListFriendProvider extends Component {
  // state = {
  //   listProviders: [],
  // }
  
  componentWillMount () {
    window.addEventListener('message', this.onPostMessage, false)
  }
  
  componentWillUnmount() {
    window.removeEventListener('message', this.onPostMessage, false);
  }

  componentDidMount() {
    const { location: { state } } = this.props
    
    if (state && state.providerSelected) {
      const el = document.getElementById(state.providerSelected)
      el && el.click()
    }
  }
  
  onPostMessage = (evt) => {
    let response = evt.data
    if (typeof response === 'string' && response.indexOf('isSuccess') > -1) {
      response = JSON.parse(evt.data);
      if (response.isSuccess) {
        window.location.reload()
      }
    }
  }

  renderListProviders() {
    return this.props.networks.map(item => <FriendProvider
      key={item.id}
      localeNetwork={this.props.localeNetwork}
      onConnectSocialNetwork={this.onConnectSocialNetwork}
      user={this.props.user}
      {...item}
    />)
  }

  onConnectSocialNetwork = (urlConnection, provider) => {
    if (provider.toLowerCase().indexOf('phone') > -1) {
      return this.props.history.push(ROUTER_PATH.USER_PROFILE)
    }
    const left = window.screen.width / 2 - 400;
    window.open(
      urlConnection + '?api_token=' + window.uuid,
      '',
      `width=800, height=500, left=${left}`
    );
  }


  
  render() {
    return (
      <div className="box-netword">
        <div className="inner">
          <Masonry>
            { this.renderListProviders() }
          </Masonry>
        </div>
      </div>
    )
  }
}

ListFriendProvider = connect((state, ownProps) => ({
  ...ownProps,
  networks: state.networks,
  user: state.user,
}), {
  updatePageTitle,
})(ListFriendProvider)

const ListFriends = (props) => {
  return (
    <Layout
      index={3}
      title="Network"
      menuIcon="person_add"
      mainContent={withRouter(() => {
        return <ListFriendProvider {...props}/>
      })}
    />
  )
}

export default ListFriends;
