const React = require("react");

export const TabsContext = React.createContext({
  tabs: [],
  addTab: (tab) => {},
  removeTab: (name) => {},
});
