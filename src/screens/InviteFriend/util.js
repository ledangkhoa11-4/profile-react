import { filter, map } from 'lodash';
import {
  FRIEND_TYPE,
  FRIEND_STATUS,
} from './FriendsSocial/constant';

export const getNewList = (list, friendId) => {
  return filter(list, user => user.id !== friendId);
}

export const getNewListInTabAllFriend = (type, list, friendId) => {
  let newStatus = '';
  switch(type) {
    case FRIEND_TYPE.ADD:
      newStatus = FRIEND_STATUS.PENDING;
      break;
    case FRIEND_TYPE.ACCEPT:
      newStatus = FRIEND_STATUS.CONNECTED;
      break;
    case FRIEND_TYPE.UNFRIEND:
    case FRIEND_TYPE.CANCEL:
    case FRIEND_TYPE.REJECT:
      newStatus = FRIEND_STATUS.STRANGER;
      break;
    default:
      break;
  }
  return map(list, user => {
    if (user.id === friendId) {
      user.friend = newStatus;
    }
    return user;
  });
}
