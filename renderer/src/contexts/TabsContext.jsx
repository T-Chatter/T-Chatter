const React = require("react");

export const TabsContext = React.createContext({
  tabs: [{ id: "", name: "", messages: [""] }],
  addTab: (tab) => {},
  removeTab: (name) => {},
  removeTabById: (id) => {},
});
