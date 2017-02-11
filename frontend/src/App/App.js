import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import routes from './routes';

function App({ store, history }) {
  return (
    <DocumentTitle title="Sonarr">
      <Provider store={store}>
        <Router history={history} routes={routes} />
      </Provider>
    </DocumentTitle>
  );
}

App.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default App;
