import _ from 'lodash';
import moment from 'moment';
import { handleActions } from 'redux-actions';
import * as types from 'Store/Actions/actionTypes';
import { sortDirections } from 'Helpers/Props';
import createSetReducer from './Creators/createSetReducer';
import createUpdateReducer from './Creators/createUpdateReducer';
import createSetClientSideCollectionSortReducer from './Creators/createSetClientSideCollectionSortReducer';

export const defaultState = {
  isFetching: false,
  isPopulated: false,
  error: null,
  items: [],
  sortKey: 'quality',
  sortDirection: sortDirections.DESCENDING,
  recentFolders: [],
  sortPredicates: {
    series: function(item, direction) {
      const series = item.series;

      return series ? series.sortTitle : '';
    },

    quality: function(item, direction) {
      return item.quality.qualityWeight;
    }
  }
};

export const persistState = [
  'manualImport.recentFolders'
];

const reducerSection = 'manualImport';

const manualImportReducers = handleActions({

  [types.SET]: createSetReducer(reducerSection),
  [types.UPDATE]: createUpdateReducer(reducerSection),

  [types.UPDATE_MANUAL_IMPORT_ITEM]: (state, { payload }) => {
    const id = payload.id;
    const newState = Object.assign({}, state);
    const items = newState.items;
    const index = _.findIndex(items, { id });
    const item = Object.assign({}, items[index], payload);

    newState.items = [...items];
    newState.items.splice(index, 1, item);

    return newState;
  },

  [types.ADD_RECENT_FOLDER]: function(state, { payload }) {
    const folder = payload.folder;
    const recentFolder = { folder, lastUsed: moment().toISOString() };
    const recentFolders = [...state.recentFolders];
    const index = _.findIndex(recentFolders, { folder });

    if (index > -1) {
      recentFolders.splice(index, 1, recentFolder);
    } else {
      recentFolders.push(recentFolder);
    }

    return Object.assign({}, state, { recentFolders });
  },

  [types.REMOVE_RECENT_FOLDER]: function(state, { payload }) {
    const folder = payload.folder;
    const recentFolders = _.remove([...state.recentFolders], { folder });

    return Object.assign({}, state, { recentFolders });
  },

  [types.CLEAR_MANUAL_IMPORT]: function(state) {
    const newState = {
      ...defaultState,
      recentFolders: state.recentFolders
    };

    return newState;
  },

  [types.SET_MANUAL_IMPORT_SORT]: createSetClientSideCollectionSortReducer(reducerSection)

}, defaultState);

export default manualImportReducers;
