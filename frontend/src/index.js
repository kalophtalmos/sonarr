import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import createAppStore from 'Store/createAppStore';
import App from './App/App';
import 'Styles/globals.css';
import './index.css';

const store = createAppStore();
const history = syncHistoryWithStore(browserHistory, store);

render(
  <App store={store} history={history} />,
  document.getElementById('root')
);
