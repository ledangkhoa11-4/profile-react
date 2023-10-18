import React from 'react';
import { filter } from 'lodash';
import Select from 'react-select';
import Users from './Users';
import AddingEmailForm from './AddingEmailForm';
import {
  FRIEND_STATUS_OPTS,
  SEARCH_NAME,
  FRIEND_STATUS,
} from './constant';

const FriendsContent = (props) => {
  const {
    formState,
    onFilter,
    localeNetwork,
  } = props;

  if (!formState.socialName) {
    return null
  }

  const isEmailPhoneNetwork = formState.socialName.toLowerCase().indexOf('phone') > -1 ||
                              formState.socialName.toLowerCase().indexOf('email') > -1 ?
                                true : false;
  const friendStatusOpts = filter(FRIEND_STATUS_OPTS, item => item.value !== FRIEND_STATUS.SOCIAL)

  return (
    <div>
      <form name="search" className="field-search form" onSubmit={props.searchFriends}>
        <div className="row" style={{
          paddingBottom: '15px'
        }}>
          <div className="col-sm-8">
            <input
              type="text"
              name={SEARCH_NAME}
              value={formState[SEARCH_NAME]}
              onChange={props.onChangeSearchInput}
              placeholder={localeNetwork.SEARCH_TEXT}
              className="input"
            />
          </div>
          <div className="col-sm-4">
            <button className="btn" title="Submit" type="submit">
              <span className="material-icons">&#xE8B6;</span>
              <span className="text">
                {localeNetwork.SEARCH_BUTTON}
              </span>
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-8">
            <Select
              searchable={false}
              clearable={false}
              options={friendStatusOpts}
              value={formState.friendTypeOpt}
              className="custom-select"
              onChange={(val) => {
                onFilter(val.value);
              }}
            />
          </div>
          <div className="col-sm-4">
            {/* onSyncSocial */}
            {
              !isEmailPhoneNetwork ?
                <button className="btn" title={localeNetwork.SYNC_SOCIAL_TITLE} onClick={props.onSyncSocial}>
                  <span className="material-icons">sync</span>
                  <span className="text">
                    {localeNetwork.SYNC_SOCIAL_BTN}
                  </span>
                </button> : null
            }
          </div>
        </div>
      </form>
      {
        isEmailPhoneNetwork ?
          <AddingEmailForm
            localeNetwork={props.localeNetwork}
            provider={formState.socialProvider}
            onAfterInvitingPhoneEmail={props.onAfterInvitingPhoneEmail}
          /> : null
      }
      <div className="list friend style-list">
        {
          formState.strangeUser.length ?
            <div className="strange-user">
              <h4>{localeNetwork.SENT_MAIL_TEXT}:</h4>
              {
                formState.strangeUser.map((user, idx) => {
                  return (
                    <p key={idx} className="item">{ user.email || user.phone }</p>
                  )
                })
              }
            </div> : null
        }
        
        <Users
          localeNetwork={props.localeNetwork}
          users={formState.friends}
          sendAddFriendRequest={props.sendAddFriendRequest}
          sendUnfriendRequest={props.sendUnfriendRequest}
          sendCancelRequest={props.sendCancelRequest}
          sendAcceptFriendRequest={props.sendAcceptFriendRequest}
          sendRejectInvitingRequest={props.sendRejectInvitingRequest}
          isEmailPhoneNetwork={isEmailPhoneNetwork}
        />
      </div>
    </div>
  );
}

export default FriendsContent;
