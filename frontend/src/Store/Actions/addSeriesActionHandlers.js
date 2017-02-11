import _ from 'lodash';
import $ from 'jquery';
import { batchActions } from 'redux-batched-actions';
import getNewSeries from 'Utilities/Series/getNewSeries';
import * as types from './actionTypes';
import { set, update, updateItem } from './baseActions';

const section = 'addSeries';

const addSeriesActionHandlers = {
  [types.LOOKUP_SERIES]: function(payload) {
    return function(dispatch, getState) {
      dispatch(set({ section, isFetching: true }));

      const promise = $.ajax({
        url: '/series/lookup',
        data: {
          term: payload.term
        }
      });

      promise.done((data) => {
        dispatch(batchActions([
          update({ section, data }),

          set({
            section,
            isFetching: false,
            isPopulated: true,
            error: null
          })
        ]));
      });

      promise.fail((xhr) => {
        dispatch(set({
          section,
          isFetching: false,
          isPopulated: false,
          error: xhr
        }));
      });
    };
  },

  [types.ADD_SERIES]: function(payload) {
    return function(dispatch, getState) {
      dispatch(set({ section, isAdding: true }));

      const tvdbId = payload.tvdbId;
      const items = getState().addSeries.items;
      const newSeries = getNewSeries(_.cloneDeep(_.find(items, { tvdbId })), payload);

      const promise = $.ajax({
        url: '/series',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(newSeries)
      });

      promise.done((data) => {
        dispatch(batchActions([
          updateItem({ section: 'series', ...data }),

          set({
            section,
            isAdding: false,
            isAdded: true,
            addError: null
          })
        ]));
      });

      promise.fail((xhr) => {
        dispatch(set({
          section,
          isAdding: false,
          isAdded: false,
          addError: xhr
        }));
      });
    };
  }
};

export default addSeriesActionHandlers;
