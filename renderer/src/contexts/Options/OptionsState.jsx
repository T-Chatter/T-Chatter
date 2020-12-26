import React, { useContext, useEffect, useReducer } from "react";
import { AuthContext } from "../Auth/auth.context";
import actions from "./options.actions";
import { OptionsContext } from "./options.context";
import optionsReducer from "./options.reducer";

const OptionsState = ({ children }) => {
  const initialState = {
    options: window.optionsSchema,
  };
  const [state, dispatch] = useReducer(optionsReducer, initialState);

  const authContext = useContext(AuthContext);

  const save = (newOptions) => {
    dispatch({
      type: actions.SET,
      payload: newOptions,
    });
    window.ipcRenderer.send("updateOptions", newOptions);
  };

  const update = () => {
    window.ipcRenderer.invoke("getOptions").then((opt) => {
      dispatch({
        type: actions.SET,
        payload: opt,
      });
      authContext.updateAuthUser(opt.auth.token);
    });
  };

  useEffect(() => {
    window.ipcRenderer.invoke("getOptions").then((opt) => {
      dispatch({
        type: actions.SET,
        payload: opt,
      });
      if (opt.auth.token !== "") {
        authContext.updateAuthUser(opt.auth.token);
      } else authContext.logout();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <OptionsContext.Provider
      value={{ options: state.options, save: save, update: update }}
    >
      {children}
    </OptionsContext.Provider>
  );
};

export default OptionsState;
