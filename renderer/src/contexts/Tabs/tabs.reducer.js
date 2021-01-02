import {
  ADD_TAB,
  REMOVE_TAB,
  REMOVE_TAB_BY_ID,
  SET_TABS,
  UPDATE_EMOTES,
  UPDATE_GLOBAL_EMOTES,
  UPDATE_BADGES,
  UPDATE_GLOBAL_BADGES,
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
    case UPDATE_EMOTES:
      return {
        ...state,
        tabs: state.tabs.map((tab) =>
          tab.id === action.payload.tabId
            ? {
                ...tab,
                ffz: action.payload.ffz,
                bttv: action.payload.bttv,
                lastEmoteUpdate: Date.now(),
              }
            : tab
        ),
      };
    case UPDATE_GLOBAL_EMOTES:
      return {
        ...state,
        globalFfz: action.payload.ffz,
        globalBttv: action.payload.bttv,
        lastGlobalEmoteUpdate: Date.now(),
      };
    case UPDATE_BADGES:
      return {
        ...state,
        tabs: state.tabs.map((tab) =>
          tab.id === action.payload.tabId
            ? {
                ...tab,
                badges: action.payload.badges,
              }
            : tab
        ),
      };
    case UPDATE_GLOBAL_BADGES:
      return {
        ...state,
        globalBadges: action.payload.badges,
      };
    default:
      return state;
  }
};

export default tabsReducer;
