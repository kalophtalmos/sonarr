import { createSelector } from 'reselect';
import scrollPositions from 'Store/scrollPositions';

function createScrollPositionSelector(scrollPosition, path) {
  return createSelector(
    (state) => state.routing,
    (routing) => {
      const locationBeforePush = routing.locationBeforeTransitions;
      const {
        action,
        pathname
      } = locationBeforePush;

      if (action === 'POP' && pathname === path) {
        return scrollPositions[scrollPosition];
      }

      return 0;
    }
  );
}

export default createScrollPositionSelector;
