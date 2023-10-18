import {
  UPDATE_PAGE_TITLE,
} from 'actions/constant';

const pageContentReducer = (state = {}, action) => {
  switch(action.type) {
    case UPDATE_PAGE_TITLE:
      return { ...state, pageTitle: action.pageTitle }
    default:
      return state;
  }
}

export default pageContentReducer;
