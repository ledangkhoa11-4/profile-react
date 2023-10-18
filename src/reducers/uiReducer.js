import {
  GET_USER,
  REQUEST,
  TOGGLE_MENU,
  UPDATE_USER,
  UPLOAD_AVATAR,
  SHOW_LOADING,
  HIDE_LOADING,
  GET_NETWORKS,
} from 'actions/constant';

const requestReducer = (state = 0, action) => {
  switch (action.type) {
    case UPLOAD_AVATAR.PENDING:
    case UPDATE_USER.PENDING:
    case GET_USER.PENDING:
    case GET_NETWORKS.PENDING:
    case REQUEST.PENDING:
    case SHOW_LOADING:
      return state + 1;
    case UPLOAD_AVATAR.RECEIVED:
    case UPLOAD_AVATAR.FAILURED:
    case UPDATE_USER.RECEIVED:
    case UPDATE_USER.FAILURED:
    case GET_USER.RECEIVED:
    case GET_USER.FAILURED:
    case GET_NETWORKS.RECEIVED:
    case GET_NETWORKS.FAILURED:
    case REQUEST.RECEIVED:
    case REQUEST.FAILURED:
    case HIDE_LOADING:
      return state > 0 ? state - 1 : 0;
    default:
      return state;
  }
}

const toggleMenuReducer = (state = true, action) => {
  switch(action.type) {
    case TOGGLE_MENU.SHOW:
      return true;
    case TOGGLE_MENU.HIDE:
      return false;
    default:
      return state;
  }
}

const initalUIState = {
  isLoading: 0,
  isShowMenu: false,
}

const uiReducer = (state = initalUIState, action) => {
  switch(action.type) {
    case UPDATE_USER.PENDING:
    case UPDATE_USER.RECEIVED:
    case UPDATE_USER.FAILURED:
    case UPLOAD_AVATAR.PENDING:
    case UPLOAD_AVATAR.RECEIVED:
    case UPLOAD_AVATAR.FAILURED:
    case GET_USER.PENDING:
    case GET_USER.RECEIVED:
    case GET_USER.FAILURED:
    case GET_NETWORKS.PENDING:
    case GET_NETWORKS.RECEIVED:
    case GET_NETWORKS.FAILURED:
    case REQUEST.PENDING:
    case REQUEST.RECEIVED:
    case REQUEST.FAILURED:
    case SHOW_LOADING:
    case HIDE_LOADING:
      return { ...state, isLoading: requestReducer(state.isLoading, action) }
    case TOGGLE_MENU.SHOW:
    case TOGGLE_MENU.HIDE:
      return { ...state, isShowMenu: toggleMenuReducer(initalUIState, action) }
    default:
      return state;
  }
}

export default uiReducer;
