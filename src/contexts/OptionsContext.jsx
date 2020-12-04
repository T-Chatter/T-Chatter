const React = require("react");

export const OptionsContext = React.createContext({
  save: () => {},
  update: () => {},
  options: window.optionsSchema,
});
