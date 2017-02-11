import $ from 'jquery';
import { batchActions } from 'redux-batched-actions';
import * as types from './actionTypes';
import { set, updateItem } from './baseActions';

const section = 'seriesEditor';

const seriesEditorActionHandlers = {
  [types.SAVE_SERIES_EDITOR]: function(payload) {
    return function(dispatch, getState) {
      dispatch(set({
        section,
        isSaving: true
      }));

      const promise = $.ajax({
        url: '/series/editor',
        method: 'PUT',
        data: JSON.stringify(payload),
        dataType: 'json'
      });

      promise.done((data) => {
        dispatch(batchActions([
          ...data.map((series) => {
            updateItem({
              id: series.id,
              section: 'series',
              ...series
            });
          }),

          set({
            section,
            isSaving: false,
            saveError: null
          })
        ]));
      });

      promise.fail((xhr) => {
        dispatch(set({
          section,
          isSaving: false,
          saveError: xhr
        }));
      });
    };
  }
};

export default seriesEditorActionHandlers;
