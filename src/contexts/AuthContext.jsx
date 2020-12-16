const React = require("react");

export const AuthContext = React.createContext({
  userId: "",
  username: "",
  token: "",
});
