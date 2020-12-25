import React, { useReducer, useEffect, useCallback, useState } from "react";
import { TabsContext } from "./tabs.context";
import tabsReducer from "./tabs.reducer";
import actions from "./tabs.actions";

const TabsState = ({ children }) => {
  const initialState = {
    tabs: [],
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
        addTab,
        removeTab,
        removeTabById,
        updateLocalStorage,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
};

export default TabsState;
