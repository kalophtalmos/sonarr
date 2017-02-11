import $ from 'jquery';
import { set, removeItem } from '../baseActions';

function createRemoveItemHandler(section, url, getFromState) {
  return function(payload) {
    return function(dispatch, getState) {
      const {
        id,
        ...queryParms
      } = payload;

      dispatch(set({ section, isDeleting: true }));

      const ajaxOptions = {
        url: `${url}/${id}?${$.param(queryParms, true)}`,
        method: 'DELETE'
      };

      const promise = $.ajax(ajaxOptions);

      promise.done((data) => {
        dispatch(removeItem({ section, id }));

        dispatch(set({
          section,
          isDeleting: false,
          deleteError: null
        }));
      });

      promise.fail((xhr) => {
        dispatch(set({
          section,
          isDeleting: false,
          deleteError: xhr
        }));
      });
    };
  };
}

export default createRemoveItemHandler;
