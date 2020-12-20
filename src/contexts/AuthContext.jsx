const React = require("react");

export const AuthContext = React.createContext({
  authUser: {
    username: null,
    userId: null,
    token: null,
    follows: null,
  },
  isLoading: true,
  update: (token) => {},
  logout: () => {},
});
