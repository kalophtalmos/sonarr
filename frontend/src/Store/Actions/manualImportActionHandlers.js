import $ from 'jquery';
import { batchActions } from 'redux-batched-actions';
import * as types from './actionTypes';
import { set, update } from './baseActions';

const section = 'manualImport';

const manualImportActionHandlers = {
  [types.FETCH_MANUAL_IMPORT_ITEMS]: function(payload) {
    return function(dispatch, getState) {
      if (!payload.downloadId && !payload.folder) {
        dispatch(set({ section, error: { message: '`downloadId` or `folder` is required.' } }));
        return;
      }

      dispatch(set({ section, isFetching: true }));

      const promise = $.ajax({
        url: '/manualimport',
        data: payload
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
  }
};

export default manualImportActionHandlers;
