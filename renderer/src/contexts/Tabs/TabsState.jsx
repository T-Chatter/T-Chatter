import React, { useReducer, useEffect, useCallback, useState } from "react";
import { TabsContext } from "./tabs.context";
import tabsReducer from "./tabs.reducer";
import actions from "./tabs.actions";

const TabsState = ({ children }) => {
  const initialState = {
    tabs: [],
    globalBttv: [],
    globalFfz: [],
    lastGlobalEmoteUpdate: new Date(1970, 1, 1).getTime(),
    globalBadges: [],
  };
  const [state, dispatch] = useReducer(tabsReducer, initialState);
  const [firstRender, setFirstRender] = useState(true);

  const e_setTabs = useCallback((e, tabs) => {
    if (tabs !== undefined) {
      updateLocalStorage(tabs);
    } else {
      updateLocalStorage([]);
    }
  }, []);

  const setTabs = useCallback((tabs) => {
    dispatch({
      type: actions.SET_TABS,
      payload: tabs,
    });
    updateLocalStorage(tabs);
  }, []);

  const addTab = (tab) => {
    dispatch({
      type: actions.ADD_TAB,
      payload: tab,
    });
    updateLocalStorage(state.tabs);
  };

  const removeTab = (name) => {
    dispatch({
      type: actions.REMOVE_TAB,
      payload: name,
    });
    updateLocalStorage(state.tabs);
  };

  const removeTabById = (id) => {
    dispatch({
      type: actions.REMOVE_TAB_BY_ID,
      payload: id,
    });
    updateLocalStorage(state.tabs);
  };

  const updateLocalStorage = (tabs) => {
    localStorage.setItem("userTabs", JSON.stringify(tabs));
  };

  const updateGlobalEmotes = () => {
    // BTTV Global
    let bttv = [];
    fetch("https://api.betterttv.net/3/cached/emotes/global")
      .then((res) => res.json())
      .then((res) => {
        bttv = res;

        // FFZ Global
        let ffz = [];
        fetch("https://api.frankerfacez.com/v1/set/global")
          .then((res) => res.json())
          .then((res) => {
            ffz = res.sets["3"].emoticons;

            dispatch({
              type: actions.UPDATE_GLOBAL_EMOTES,
              payload: { ffz, bttv },
            });
          });
      });
  };

  const updateGlobalBadges = () => {
    fetch("https://badges.twitch.tv/v1/badges/global/display")
      .then((res) => res.json())
      .then((res) => {
        const badges = res?.badge_sets;
        dispatch({
          type: actions.UPDATE_GLOBAL_BADGES,
          payload: { badges },
        });
      });
  };

  const updateTabEmotes = (channelId, tabId) => {
    const tab = state.tabs.find((tab) => tab.id === tabId);
    if (tab !== undefined) {
      // BTTV Channel
      let bttv = {};
      fetch(`https://api.betterttv.net/3/cached/users/twitch/${channelId}`)
        .then((res) => res.json())
        .then((res) => {
          bttv = res;

          // FFZ Channel
          let ffz = {};
          fetch(`https://api.frankerfacez.com/v1/room/id/${channelId}`)
            .then((res) => res.json())
            .then((res) => {
              if (res.sets && Object.keys(res.sets).length > 0) {
                ffz = res.sets[Object.keys(res.sets)[0]].emoticons;
                dispatch({
                  type: actions.UPDATE_EMOTES,
                  payload: { tabId: tabId, bttv: bttv, ffz: ffz },
                });
              }
            });
        });
    }
  };

  const updateTabBadges = (channelId, tabId) => {
    const tab = state.tabs.find((tab) => tab.id === tabId);
    if (tab !== undefined) {
      fetch(
        "https://badges.twitch.tv/v1/badges/channels/" + channelId + "/display"
      )
        .then((res) => res.json())
        .then((res) => {
          const badges = res?.badge_sets?.subscriber?.versions;
          dispatch({
            type: actions.UPDATE_BADGES,
            payload: { tabId, badges },
          });
        });
    }
  };

  useEffect(() => {
    if (firstRender) {
      const userTabs = JSON.parse(localStorage.getItem("userTabs"));
      if (userTabs) {
        setTabs(userTabs);
      }
      setFirstRender(false);
    }
    window.ipcRenderer.on("clearTabs", e_setTabs);
    updateLocalStorage(state.tabs);
    return () => {
      window.ipcRenderer.removeListener("clearTabs", e_setTabs);
    };
  }, [setTabs, e_setTabs, state, firstRender]);

  return (
    <TabsContext.Provider
      value={{
        tabs: state.tabs,
        globalBttv: state.globalBttv,
        globalFfz: state.globalFfz,
        globalBadges: state.globalBadges,
        lastGlobalEmoteUpdate: state.lastGlobalEmoteUpdate,
        addTab,
        removeTab,
        removeTabById,
        updateLocalStorage,
        updateGlobalEmotes,
        updateGlobalBadges,
        updateTabEmotes,
        updateTabBadges,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
};

export default TabsState;
