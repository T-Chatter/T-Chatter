import actions from "./options.actions";

const optionsReducer = (state, action) => {
  switch (action.type) {
    case actions.SET:
      return {
        ...state,
        options: action.payload,
      };
    default:
      return state;
  }
};

export default optionsReducer;
