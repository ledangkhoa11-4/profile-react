import React from 'react';
import { Link } from 'react-router-dom';
import { CHILD_ROUTE_PATH } from 'services/config';
import { ENUM } from 'services/constant';

const { SOCIAL_PROVIDER } = ENUM;

const renderSocialAssets = (props) => {
  switch(props.provider) {
    case SOCIAL_PROVIDER.FB:
      return (
        <div className="my-infor">
          <div className="thumb">
            <img
              src={`//graph.facebook.com/${props.provider_value}/picture?type=small`}
              alt={props.name}
            />
          </div>
          <a
            className="text"
            href={`//www.facebook.com/app_scoped_user_id/${props.provider_value}`}
            target="_blank"
          >
            { props.user.name }
          </a>
        </div>
      );
    case SOCIAL_PROVIDER.TW:
      return (
        <div className="my-infor">
          <a
            className="text"
            target="_blank"
            href={`//twitter.com/intent/user?user_id=${props.provider_value}`}
          >
            { props.user.name }
          </a>
        </div>
      );
    case SOCIAL_PROVIDER.GG:
      return (
        <div className="my-infor">
          <a
            className="text"
            target="_blank"
            href={`//plus.google.com/${props.provider_value}`}
          >
            { props.user.name }
          </a>
        </div>
      );
    case SOCIAL_PROVIDER.ZA:
      return (
        <div className="my-infor">
          <a
            className="text"
            target="_blank"
            href={`//zalo.me/${props.provider_value}`}
          >
            { props.user.name }
          </a>
        </div>
      );
    default:
      return (
        <div className="my-infor">
          <span className="text">{ props.provider_value }</span>
        </div>
      );
  }
}

const renderContentEle = (props) => {
  let content = <div className="content">
    <div className="add">
      <div className="text">
        { props.messages }
      </div>
      <a
        title="add"
        id={props.provider}
        className="btn"
        onClick={() => {
        props.onConnectSocialNetwork(props.connect_url, props.provider)
      }}>
        <span className="material-icons">person_add</span>
      </a>
    </div>
  </div>;

  if( props.provider_value ) {
    content = <div className="content">
      { renderSocialAssets(props) }      
      <div className="list-friend">
        <ul>
          <li>
            <span className="material-icons">group </span>
            <span className="text">
              { props.invited } {props.localeNetwork.INVITED}
            </span>
          </li>
          <li>
            <span className="material-icons">group_add </span>
            <span className="text">
              { props.connected } {props.localeNetwork.CONNECTED}
            </span>
          </li>
          <li>
            <span className="material-icons">person_add </span>
            <span className="text">
              { props.pendding } {props.localeNetwork.PENDING}
            </span>
          </li>
        </ul>
      </div>
      <Link
        className="btn"
        id={props.provider}
        title="Go to detail"
        to={{
          pathname: `${CHILD_ROUTE_PATH.FRIEND_SOCIAL}/${props.id}`,
          state: {
            provider: props.provider,
            socialName: props.name,
            socialIcon: props.icon,
          },
        }}
      >
        <span className="material-icons">offline_pin</span>
        <span className="text">{props.localeNetwork.DETAIL}</span>
      </Link>
    </div>;
  }

  return content;
}

const FriendProvider = (props) => {
  return (
    <div className="item">
      <div className="title">
        <span className={ props.icon }></span>
        <span className="text">{ props.name }</span>
      </div>
      { renderContentEle(props) }
    </div>
  )
}

export default FriendProvider;
