import authActions from "./auth.actions";

const authReducer = (state, action) => {
  switch (action.type) {
    case authActions.SET_AUTH_USER:
      return {
        ...state,
        authUser: action.payload,
      };
    case authActions.LOGOUT:
      return {
        ...state,
        authUser: {
          username: null,
          userId: null,
          token: null,
          follows: null,
        },
      };
    default:
      return state;
  }
};

export default authReducer;
