import $ from 'jquery';
import { batchActions } from 'redux-batched-actions';
import { set, update } from '../baseActions';

function createFetchHandler(section, url) {
  return function(payload) {
    return function(dispatch, getState) {
      dispatch(set({ section, isFetching: true }));

      const promise = $.ajax({
        url,
        data: payload,
        traditional: true
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
  };
}

export default createFetchHandler;
