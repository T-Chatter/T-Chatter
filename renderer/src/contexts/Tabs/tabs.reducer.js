import {
  ADD_TAB,
  REMOVE_TAB,
  REMOVE_TAB_BY_ID,
  SET_TABS,
} from "./tabs.actions";

const tabsReducer = (state, action) => {
  switch (action.type) {
    case SET_TABS:
      return {
        ...state,
        tabs: action.payload,
      };
    case ADD_TAB:
      return {
        ...state,
        tabs: [...state.tabs, action.payload],
      };
    case REMOVE_TAB:
      return {
        ...state,
        tabs: state.tabs.filter((tab) => tab.name !== action.payload),
      };
    case REMOVE_TAB_BY_ID:
      return {
        ...state,
        tabs: state.tabs.filter((tab) => tab.id !== action.payload),
      };
    default:
      return state;
  }
};

export default tabsReducer;
