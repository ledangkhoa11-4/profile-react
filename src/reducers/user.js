import Alert from 'react-s-alert';
import {
  GET_USER,
  UPDATE_USER,
  UPLOAD_AVATAR,
  UPDATE_USER_POINT,
  UPDATE_USER_PHONE,
} from 'actions/constant';
import { forEach } from 'lodash';

const initialUserState = {
  name: '',
  email: '',
  gender: '',
  birthday: '',
  address: '',
  city: '',
  phone: '',
  nation: '',
  description: '',
  point: 0,
  reward_count: 0,
  poll_count: 0,
  survey_count: 0,
  profile_count: 0,
  profile_number_count: 0,
  isadmin: false,
  quantitybookmark: 0,
  quantityLike: 0,
  information: 0,
};

const user = (state = initialUserState, action) => {
  switch(action.type) {
    case UPDATE_USER.RECEIVED:
    case UPLOAD_AVATAR.RECEIVED:
      if (action.payload.success) {
        Alert.success(action.payload.message)
      }
    case GET_USER.RECEIVED:
      return Object.assign({}, state, action.payload.data);
    case UPLOAD_AVATAR.FAILURED:
    case UPDATE_USER.FAILURED:
    case GET_USER.FAILURED:
      if(typeof action.payload.response.message === 'object'){
        forEach(action.payload.response.message, msg => {
          msg[0] && Alert.error(msg[0]);
        })
      }else{
        Alert.error(action.payload.response.message)
      }
      return { ...state, error: true };
    case UPDATE_USER_POINT:
      return { ...state, point: action.point }
      case UPDATE_USER_PHONE:
      return { ...state, phone: action.phone, verified_phone: action.verified_phone }
    default:
      return state;
  }
}

export default user;
