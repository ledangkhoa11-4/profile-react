import React from 'react';
import { FRIEND_STATUS } from '../InviteFriend/FriendsSocial/constant';
import { ENUM } from 'services/constant';
import {
  FacebookShareButton,
  FacebookIcon,
} from 'react-share';

const {
  FB,
} = ENUM.SOCIAL_PROVIDER;
const localeProfile = window.locale.Profile;

function getDateMonthYear(stringBirthday) {
  if (!stringBirthday) {
    return {
      date: '',
      month: '',
      year: '',
    }
  }

  let birthday = stringBirthday.split(' ')[0];
  birthday = birthday.split('-');

  return {
    date: birthday[2],
    month: birthday[1],
    year: birthday[0],
  }
}

function renderBtnContent(userInfo, props) {
  let propsBtns;


  
  switch (userInfo.friend) {
    case FRIEND_STATUS.PENDING:
      propsBtns = [{
        classBtn: 'btn-cancel',
        textBtn: 'Cancel',
        icon: 'clear',
        actionFunc: props.sendCancelRequest,
      }];
      break;
    case FRIEND_STATUS.STRANGER:
      propsBtns = [{
        classBtn: 'btn-grey',
        textBtn: 'Add',
        icon: 'add',
        actionFunc: props.sendAddFriendRequest,
      }];
      break;
    case FRIEND_STATUS.INVITING:
      propsBtns = [
        {
          classBtn: 'btn-accept',
          textBtn: 'Accept',
          icon: 'done',
          actionFunc: props.sendAcceptFriendRequest,
        },
        {
          classBtn: 'btn-reject',
          textBtn: 'Reject',
          icon: 'not_interested',
          actionFunc: props.sendRejectInvitingRequest,
        }
      ]
      break;
    default:
      // case 'friend':
      propsBtns = [{
        classBtn: 'btn-unfriend',
        textBtn: 'Unfriend',
        icon: 'remove_circle',
        actionFunc: props.sendUnfriendRequest,
      }]
  }

  return propsBtns.map((item, idx) => {
    return (
      <button
        key={idx}
        type="button"
        className={`btn ${item.classBtn} small`}
        onClick={() => {
          item.actionFunc(userInfo.id);
        }}
      >
        <span className="material-icons">
          { item.icon }
        </span>
        <span className="text">
          { item.textBtn }
        </span>
      </button>
    )
  })
}

const Profile = (props) => {
  const {
    name,
    nation,
    poll_count,
    poll_vote_count,
    survey_count,
    survey_vote_count,
    reward_count,
    point,
    gender,
    email,
    phone,
    birthday,
    address,
    city_ob,
    description,
    fullAvatar,
    shareProfile,
  } = props.userInfo;
  const { date, month, year } = getDateMonthYear(birthday);
  const city = (city_ob && (city_ob.vietnamese + ', ')) || '';
  const shortAddress = city + (nation || '');
  const userAvatar = fullAvatar ||
          require('assets/images/user-icon-placeholder.png');
  const fbShareUrl = `${shareProfile}&network=${FB}`;

  return (
    <div>
      <div className="box-information">
        <div className="inner">
          <div className="cover background-cover">
            <img src={require('assets/images/cover.jpg')} alt="cover"/>
            <div className="profile">
              <span className="name">{ name }</span>
              <span className="address">{ shortAddress }</span>
            </div>
          </div>
          <div className="avatar">
            <div className="thumb">
              <img src={userAvatar} alt="avatar"/>
            </div>
          </div>
          <ul className="list-icon">
            <li>
              <FacebookShareButton
                url={fbShareUrl}
              >
                <FacebookIcon
                  size={35}
                  round
                />
              </FacebookShareButton>
            </li>
            <li className="share">
              <a role="button" title={localeProfile.SHARE}>
                <img
                  src={require('assets/images/networking-1.png')}
                  alt="share"
                />
              </a>
            </li>
          </ul>
          <div className="content">
            <div className="desc">
              <p>{ description }</p>
            </div>
            <ul className="table list-system">
              <div className="tr">
                <div className="td">
                  <div>
                    <span className="number">
                      {poll_count}
                    </span>
                    <span className="text">
                      {localeProfile.OWN_POLL_TEXT}
                    </span>
                  </div>
                </div>
                <div className="td">
                  <div>
                    <span className="number">
                      {poll_vote_count}
                    </span>
                    <span className="text">
                      {localeProfile.VOTE_POLL_TEXT}
                    </span>
                  </div>
                </div>
                <div className="td">
                  <div>
                    <span className="number">
                      {survey_count}
                    </span>
                    <span className="text">
                      {localeProfile.OWN_SURVEY_TEXT}
                    </span>
                  </div>
                </div>
              </div>
              <div className="tr">
                <div className="td">
                  <div>
                    <span className="number">
                      {survey_vote_count}
                    </span>
                    <span className="text">
                      {localeProfile.VOTE_SURVEY_TEXT}
                    </span>
                  </div>
                </div>
                <div className="td">
                  <div>
                    <span className="number">{reward_count}</span>
                    <span className="text">
                      {localeProfile.REWARD}
                    </span>
                  </div>
                </div>
                <div className="td">
                  <div>
                    <span className="number">{point}</span>
                    <span className="text">
                      {localeProfile.POINT}
                    </span>
                  </div>
                </div>
              </div>
            </ul>
          </div>
          <div className="connection-btn text-right">
            {
              props.user.id !== props.userInfo.id ?
                renderBtnContent(props.userInfo, props) : null
            }
          </div>
        </div>
      </div>
      <div className="box">
        <div className="inner">
          <div className="title">
            <span className="material-icons">&#xE853;</span>
            <h2>Basic Information</h2>
          </div>
          <div className="content form">
            <div className="form-group">
              <div className="row">
                <div className="col-xs-12">
                  <label>Name</label>
                  <input
                    className="input"
                    readOnly={true}
                    value={name || ''}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              {/* date month year */}
              <div className="row">
                <div className="col-xs-4">
                  <label>Date </label>
                  <input
                    className="input"
                    readOnly={true}
                    value={date}
                  />
                </div>
                <div className="col-xs-4">
                  <label>Month </label>
                  <input
                    className="input"
                    readOnly={true}
                    value={month}
                  />
                </div>
                <div className="col-xs-4">
                  <label>Year </label>
                  <input
                    className="input"
                    readOnly={true}
                    value={year}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-xs-4">
                  <label>Gender</label>
                  <input
                    className="input"
                    readOnly={true}
                    value={gender || ''}
                  />
                </div>
                <div className="col-xs-4">
                  <label>Email</label>
                  <input
                    className="input"
                    readOnly={true}
                    value={email || ''}
                  />
                </div>
                <div className="col-xs-4">
                  <label>Phone</label>
                  <input
                    className="input"
                    readOnly={true}
                    value={phone || ''}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-xs-12">
                  <label>Address</label>
                  <input
                    className="input"
                    readOnly={true}
                    value={address || ''}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-sm-6">
                  <label>City</label>
                  <input
                    className="input"
                    readOnly={true}
                    value={city}
                  />
                </div>
                <div className="col-sm-6">
                  <label>Nation</label>
                  <input
                    className="input"
                    readOnly={true}
                    value={nation || ''}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-xs-12">
                  <label>Status</label>
                  <textarea
                    className="input"
                    readOnly={true}
                    value={description || ''}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile;
