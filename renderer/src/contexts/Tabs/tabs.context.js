const React = require("react");

export const TabsContext = React.createContext({
  tabs: [
    {
      id: "",
      name: "",
      messages: [""],
      ffz: {},
      bttv: {},
      lastEmoteUpdate: new Date(1970, 1, 1).getTime(),
    },
  ],
  globalFfz: [],
  globalBttv: [],
  lastGlobalEmoteUpdate: new Date(1970, 1, 1).getTime(),
  addTab: (tab) => {},
  removeTab: (name) => {},
  removeTabById: (id) => {},
  updateLocalStorage: (tabs) => {},
  updateGlobalEmotes: () => {},
  updateTabEmotes: (channelId, tabId) => {},
});
