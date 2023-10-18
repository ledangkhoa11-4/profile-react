import { CALL_API } from 'redux-api-middleware';
import {
  GET_USER,
  REQUEST,
  UPDATE_USER,
  UPLOAD_AVATAR,
} from './constant';
import { getTokenCookie } from 'services/utils';
import { APIs } from 'services/config';

export const startRequest = () => ({ type: REQUEST.PENDING })
export const receivedRequest = () => ({ type: REQUEST.RECEIVED })
export const failureRequest = () => ({ type: REQUEST.FAILURED })

export const getUserInfo = () => {
  const token = getTokenCookie();
  return {
    [CALL_API]: {
      method: APIs.profile.getUserBasicInfo.method,
      endpoint: APIs.profile.getUserBasicInfo.url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      types: [GET_USER.PENDING, GET_USER.RECEIVED, GET_USER.FAILURED],
    }
  }
}

export const updateUserInfo = (formData) => {
  const token = getTokenCookie();
  return {
    [CALL_API]: {
      method: APIs.profile.updateUserBasicInfo.method,
      endpoint: APIs.profile.updateUserBasicInfo.url,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      types: [UPDATE_USER.PENDING, UPDATE_USER.RECEIVED, UPDATE_USER.FAILURED],
      body: JSON.stringify(formData),
    }
  }
}

export const uploadAvatar = (formData) => {
  const token = getTokenCookie();
  return {
    [CALL_API]: {
      method: APIs.profile.uploadAvatar.method,
      endpoint: APIs.profile.uploadAvatar.url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      types: [UPLOAD_AVATAR.PENDING, UPLOAD_AVATAR.RECEIVED, UPLOAD_AVATAR.FAILURED],
      body: formData,
    }
  }
}
