import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import uiReducer from './uiReducer';
import userReducer from './user';
import networksReducer from './networks';
import pageContentReducer from './pageContentReducer';

const rootReducer = combineReducers({
  form: formReducer,
  ui: uiReducer,
  user: userReducer,
  networks: networksReducer,
  pageContent: pageContentReducer,
});

export default rootReducer;
