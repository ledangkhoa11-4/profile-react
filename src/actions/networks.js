import { CALL_API } from 'redux-api-middleware';
import { GET_NETWORKS } from './constant';
import { APIs } from 'services/config';
import { getTokenCookie } from 'services/utils';

const {
  PENDING,
  RECEIVED,
  FAILURED
} = GET_NETWORKS;

export const getNetworks = () => {
  const token = getTokenCookie();
  return {
    [CALL_API]: {
      method: APIs.friends.listProviders.method,
      endpoint: APIs.friends.listProviders.url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      types: [PENDING, RECEIVED, FAILURED],
    }
  }
};