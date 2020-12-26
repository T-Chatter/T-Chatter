import React, { useState, useReducer, useCallback } from "react";
import authReducer from "./auth.reducer";
import { AuthContext } from "./auth.context";
import { CLIENT_ID } from "../../constants";
import authActions from "./auth.actions";

const AuthState = ({ children }) => {
  const initialState = {
    authUser: {
      username: null,
      userId: null,
      token: null,
      follows: null,
    },
  };
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [isLoadingAuthUser, setIsLoadingAuthUser] = useState(true);

  const logout = () => {
    dispatch({
      type: authActions.LOGOUT,
    });
    setIsLoadingAuthUser(false);
  };

  const updateAuthUser = useCallback((token) => {
    setIsLoadingAuthUser(true);
    fetch("https://api.twitch.tv/helix/users", {
      headers: {
        Authorization: "Bearer " + token,
        "Client-Id": CLIENT_ID,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data !== null) {
          const user = data.data[0];
          fetch(
            "https://api.twitch.tv/helix/users/follows?from_id=" + user.id,
            {
              headers: {
                Authorization: "Bearer " + token,
                "Client-Id": CLIENT_ID,
              },
            }
          )
            .then((res) => res.json())
            .then((res) => {
              dispatch({
                type: authActions.SET_AUTH_USER,
                payload: {
                  username: user.login,
                  userId: user.id,
                  token: token,
                  follows: res.data,
                },
              });
              setIsLoadingAuthUser(false);
            });
        }
      })
      .catch((res) => {
        logout();
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authUser: state.authUser,
        isLoading: isLoadingAuthUser,
        logout,
        updateAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
