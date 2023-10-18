import { applyMiddleware, createStore, compose } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import rootReducer from 'reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let store;

if (process.env.NODE_ENV === 'production') {
  store = createStore(
    rootReducer,
    applyMiddleware(
      apiMiddleware
    )
  )
} else {
  store = createStore(
    rootReducer,
    composeEnhancers(
      applyMiddleware(
        apiMiddleware
      )
    )
  )
}

export default store;
