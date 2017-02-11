import getToggledRange from './getToggledRange';

function toggleSelected(state, items, id, selected, shiftKey) {
  let allSelected = true;
  let allUnselected = true;

  const lastToggled = state.lastToggled;
  const selectedState = {
    ...state.selectedState,
    [id]: selected
  };

  if (shiftKey && lastToggled) {
    const { lower, upper } = getToggledRange(items, id, lastToggled);

    for (let i = lower; i < upper; i++) {
      selectedState[items[i].id] = selected;
    }
  }

  Object.keys(selectedState).forEach((key) => {
    if (selectedState[key]) {
      allUnselected = false;
    } else {
      allSelected = false;
    }
  });

  return {
    allSelected,
    allUnselected,
    lastToggled: id,
    selectedState
  };
}

export default toggleSelected;
