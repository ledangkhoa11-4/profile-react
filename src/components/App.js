import React, { Component } from 'react';
import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from 'react-redux';
// import Article from 'screens/Article';
import Bookmark from 'screens/Bookmark';
import DashBoard from 'screens/Dashboard';
import InviteFriend from 'screens/InviteFriend';
import Notifications from 'screens/Notification';
import Page404 from 'screens/Page404';
// import Preference from 'screens/Preference';
import Poll from 'screens/Poll';
import PollDetail from 'screens/Poll/PollDetailPage';
import Profile from 'screens/Profile';
import ProfileFriend from 'screens/ProfileFriend';
import Project from 'screens/Project';
import PointHistory from 'screens/PointHistory';
import Rewards from 'screens/Rewards';
import RewardHistory from 'screens/Rewards/RewardHistory';
import ChangePassword from 'screens/ChangePassword';
// import Survey from 'screens/Surveys';
import ResultDetail from 'screens/ResultDetail';
import { getUserInfo } from 'actions/requestAPIsAction';
import { getNetworks } from 'actions/networks'
import { ROUTER_PATH, CHILD_ROUTE_PATH } from 'services/config';
const enableInviteFriend = window.Config ? window.Config.enableInviteFriend : 1;
class App extends Component {
  componentWillMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      window.scrollTo(0, 0);
    });
  }
  componentWillUnmount() {
      this.unlisten();
  }
  componentDidMount() {
    this.props.getUserInfo();
    this.props.getNetworks();
  }
  render() {
    return (
      <Switch>
        
        {/* new */}
        <Route path={ROUTER_PATH.CHANGEPASSWORD} component={ChangePassword} />
        {/* end new */}
        <Route path={ROUTER_PATH.USER_PROFILE} component={Profile} />
        <Route exact path={CHILD_ROUTE_PATH.INDEX_WITH_POLL} component={DashBoard}/>
        {/* <Route path={ROUTER_PATH.ARTICLE} component={Article} /> */}
        <Route path={ROUTER_PATH.BOOKMARK} component={Bookmark} />
        {
          enableInviteFriend ?
            <Route path={ROUTER_PATH.FRIEND} component={InviteFriend}/>
           : null
        }
        <Route path={ROUTER_PATH.FRIEND_PROFILE} component={ProfileFriend}/>
        <Route exact path={ROUTER_PATH.POLL} component={Poll}/>
        <Route path={ROUTER_PATH.POLL_DETAIL} component={PollDetail}/>
        <Route exact path={ROUTER_PATH.REWARD} component={Rewards}/>
        <Route exact path={ROUTER_PATH.REWARD_HISTORY} component={RewardHistory}/>
        {/* <Route exact path={ROUTER_PATH.REWARD_TYPE_DETAIL} component={RewardDetail}/>
        <Route exact path={ROUTER_PATH.REWARD_DETAIL} component={RewardDetail}/> */}
        {/* <Route path={ROUTER_PATH.SURVEY} component={Survey}/> */}
        <Route path={ROUTER_PATH.PROJECT} component={Project} />
        <Route path={ROUTER_PATH.POINT_HISTORY} component={PointHistory} />
        {/* <Route path={ROUTER_PATH.PREFERENCE} component={Preference} /> */}
        <Route path={ROUTER_PATH.NOTIFICATION} component={Notifications} />
        <Route exac path={ROUTER_PATH.RESULT_DETAIL_SURVEY} component={ResultDetail} />
        <Route exac path={ROUTER_PATH.RESULT_DETAIL_POLL} component={ResultDetail} />
        <Route component={Page404} />
      </Switch>
    );
  }
}

const mapDispatchToProps = {
  getUserInfo,
  getNetworks,
};

App = withRouter(connect(null, mapDispatchToProps)(App));

export default App;
