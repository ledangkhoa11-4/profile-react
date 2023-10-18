const localeFriend = window.locale.Friend;

export const FRIEND_TYPE = {
  ACCEPT: 'acceptfriend',
  ADD: 'addfriend',
  UNFRIEND: 'unfriend',
  // for 2 cases:
  // - cancel => sender
  // - reject => receiver
  CANCEL: 'cancelfriend',
  REJECT: 'rejectfriend',
};

export const FRIEND_STATUS = {
  ALL: 'all',
  INVITING: 'inviting',
  PENDING: 'pending',
  CONNECTED: 'friend',
  STRANGER: 'false',
  SOCIAL: 'social',
};

export const FRIEND_STATUS_OPTS = [
  { value: FRIEND_STATUS.ALL, label: localeFriend.ALL_OPTION },
  { value: FRIEND_STATUS.INVITING, label: localeFriend.INVITING_OPTION },
  { value: FRIEND_STATUS.PENDING, label: localeFriend.PENDING_OPTION },
  { value: FRIEND_STATUS.CONNECTED, label: localeFriend.CONNECTED_OPTION },
  { value: FRIEND_STATUS.SOCIAL, label: localeFriend.SOCIAL_OPTION },
];

export const SEARCH_NAME = 'search-friend';
