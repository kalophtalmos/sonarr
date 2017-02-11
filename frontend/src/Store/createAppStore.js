import { createStore } from 'redux';
import reducers, { defaultState } from 'Store/Reducers';
import middlewares from 'Store/Middleware/middlewares';

function createAppStore() {
  const appStore = createStore(
    reducers,
    defaultState,
    middlewares
  );

  return appStore;
}

export default createAppStore;
