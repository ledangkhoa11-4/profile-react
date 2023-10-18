import { CALL_API } from 'redux-api-middleware';
import { REQUEST, UPDATE_USER_POINT, UPDATE_USER_PHONE } from './constant';
import { APIs } from 'services/config';
import { getTokenCookie } from 'services/utils';

const {
  PENDING,
  RECEIVE,
  FAILURE
} = REQUEST;
export const updateUserBasicInfo = (bodyData) => {
  const token = getTokenCookie();
  return {
    [CALL_API]: {
      endpoint: APIs.profile.updateUserBasicInfo.url,
      method: APIs.profile.updateUserBasicInfo.method,
      type: [PENDING, RECEIVE, FAILURE],
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: bodyData,
    }
  }
};

export const updateUserPoint = (point) => ({
  type: UPDATE_USER_POINT,
  point,
})

export const updeteUserPhone = (phone, verified_phone) => ({
  type: UPDATE_USER_PHONE,
  phone,
  verified_phone
})
