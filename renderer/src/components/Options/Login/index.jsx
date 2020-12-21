import React, { useEffect, useState, useContext } from "react";
import Container from "../../Container";
import { CLIENT_ID } from "../../../constants";
import { OptionsContext } from "../../../contexts/OptionsContext";
import { Redirect } from "react-router-dom";
import "./style.css";
import "../style.css";

const Login = () => {
  const scopes = [
    "bits:read",
    // "channel:edit:commercial",
    // "channel:manage:broadcast",
    "channel:read:subscriptions",
    // "user:edit",
    "user:edit:follows",
    "user:read:broadcast",
    "user:read:email",
    "channel:moderate",
    "chat:edit",
    "chat:read",
    "whispers:read",
    "whispers:edit",
  ];
  const port = 6749;
  const hostname = "localhost";
  const redirectUri = `http://${hostname}:${port}/token/`;
  const authUrl = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&force_verify=true&scope=${scopes.join(
    " "
  )}`;

  const [isLoading, setIsLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const optionsContext = useContext(OptionsContext);

  const handleLogin = () => {
    setIsLoading(true);
    window.ipcRenderer.send("startLogin", authUrl);
  };

  useEffect(() => {
    window.ipcRenderer.on("loginCallback", (e, token, scope, tokenType) => {
      if (token || scope) {
        window.ipcRenderer.send("updateOption", "auth.token", token);
        window.ipcRenderer.send("updateOption", "auth.scope", scope);
        optionsContext.update();
        setRedirect(true);
      }
      setIsLoading(false);
    });
  }, [optionsContext]);

  if (redirect) return <Redirect to="/options" />;
  if (isLoading)
    return (
      <Container>
        <h1 className="options-login-title">Loading...</h1>
      </Container>
    );
  return (
    <Container>
      <h1 className="options-login-title">Login</h1>
      <button onClick={handleLogin} className="options-login-btn">
        Start login
      </button>
    </Container>
  );
};

export default Login;
