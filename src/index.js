import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from 'store';
import './index.css';
import './version2.css';
import App from './components/App';
import { unregister } from './registerServiceWorker';
import { BASE_PATH } from 'services/config';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename={BASE_PATH}>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
unregister();
