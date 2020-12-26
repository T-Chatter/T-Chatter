import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { OptionsContext } from "../../contexts/Options/options.context";
import Container from "../Container";
import "./style.css";
import { AuthContext } from "../../contexts/Auth/auth.context";
import { TabsContext } from "../../contexts/Tabs/tabs.context";

const Options = () => {
  const optionsContext = useContext(OptionsContext);
  const tabsContext = useContext(TabsContext);
  const authContext = useContext(AuthContext);
  let clearTabs = optionsContext.options?.tabs?.clearTabs;
  let messageLimit = optionsContext.options?.chat?.messages?.limit?.toString();
  let browserSync = optionsContext.options?.chat?.browserSync;
  let smoothScroll = optionsContext.options?.chat?.smoothScroll;
  let alwaysOnTop = optionsContext.options?.general?.alwaysOnTop;

  const [isNotValid, setIsNotValid] = useState(false);
  const [messageLimitError, setMessageLimitError] = useState("");
  const [appVersion, setAppVersion] = useState(0);
  const [updateMessage, setUpdateMessage] = useState(null);

  const onChange = (e) => {
    const btn = document.getElementById("save-btn");
    btn.innerText = "Save";
    btn.classList.remove("saved");
    let { id, value, checked } = e.target;
    if (id) {
      switch (id) {
        case "clearTabs":
          clearTabs = checked;
          break;
        case "messageLimit":
          messageLimit = value;
          break;
        case "smoothScroll":
          smoothScroll = checked;
          break;
        case "alwaysOnTop":
          alwaysOnTop = checked;
          break;
        case "browserSync":
          browserSync = checked;
          break;
        default:
          break;
      }
    }

    if (
      messageLimit === "" ||
      messageLimit <= 0 ||
      messageLimit >= 2000 ||
      messageLimit.includes(".") ||
      messageLimit.includes(",")
    ) {
      setIsNotValid(true);
    } else if (smoothScroll === null || clearTabs === null) {
      setMessageLimitError("The field contains an invalid character.");
      setIsNotValid(true);
    } else {
      setIsNotValid(false);
      setMessageLimitError("");
    }
  };

  useEffect(() => {
    document.getElementById("clearTabs").checked = clearTabs;
    document.getElementById("smoothScroll").checked = smoothScroll;
    document.getElementById("alwaysOnTop").checked = alwaysOnTop;
    document.getElementById("messageLimit").value = messageLimit;
    document.getElementById("browserSync").value = browserSync;
    window.ipcRenderer
      .invoke("getAppVersion")
      .then((res) => setAppVersion(res));
  }, [clearTabs, messageLimit, smoothScroll, alwaysOnTop, browserSync]);

  const saveOptions = (e) => {
    e.target.animate(
      [
        { position: "relative", top: "0px" },
        { position: "relative", top: "-7px" },
        { position: "relative", top: "0px" },
        { position: "relative", top: "-2px" },
        { position: "relative", top: "0" },
      ],
      {
        duration: 500,
        easing: "ease-in",
      }
    );

    const btn = document.getElementById("save-btn");
    btn.innerText = "Saved!";
    btn.classList.add("saved");

    if (!browserSync) tabsContext.removeTabById(0);

    window.ipcRenderer.send("updateOption", "tabs.clearTabs", clearTabs);
    window.ipcRenderer.send(
      "updateOption",
      "chat.messages.limit",
      messageLimit
    );
    window.ipcRenderer.send("updateOption", "chat.smoothScroll", smoothScroll);
    window.ipcRenderer.send("updateOption", "general.alwaysOnTop", alwaysOnTop);
    window.ipcRenderer.send("updateOption", "chat.browserSync", browserSync);
    optionsContext.update();
  };

  const resetOptions = () => {
    window.ipcRenderer.send("resetOptions");
    optionsContext.update();
  };

  const logout = (e) => {
    window.ipcRenderer.send("updateOption", "auth.token", "");
    window.ipcRenderer.send("updateOption", "auth.scope", "");
    optionsContext.update();
  };

  const checkForUpdate = (e) => {
    setUpdateMessage(null);
    window.ipcRenderer
      .invoke("checkForUpdate")
      .then((res) => {})
      .catch((res) => {});
  };

  return (
    <Container>
      <h1 className="options-title">Options</h1>

      {/* General options */}
      <div className="options-category">
        <h3 className="options-category-title">General</h3>
        <div className="options-input-container">
          <h4 className="options-input-title w-1/2">Window always on top</h4>
          <div className="w-1/2 option-input">
            <label className="switch">
              <input
                type="checkbox"
                id="alwaysOnTop"
                onChange={onChange}
                defaultChecked={alwaysOnTop}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Authentication */}
      <div className="options-category">
        <h3 className="options-category-title">Authentication</h3>
        <div className="options-input-container">
          {(authContext?.authUser?.username ?? "") !== "" ? (
            <div className="w-full options-login-container">
              <h4 className="options-input-title w-full">
                Logged in as {authContext.authUser.username}
              </h4>
              <div className="w-1/2 option-input">
                <button onClick={logout} className="options-login-btn">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full options-login-container">
              <h4 className="options-input-title w-1/2">Login with twitch</h4>
              <div className="w-1/2 option-input">
                <Link to="/options/login" className="options-login-btn">
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat options */}
      <div className="options-category">
        <h3 className="options-category-title">Chat</h3>
        <div className="options-input-container">
          <h4 className="options-input-title w-1/2">
            Message limit
            <span
              className="tooltip tooltip-bottom options-tooltip"
              data-text="Default: 200. May cause performance issues if set too high."
            >
              <i className="fas fa-question-circle"></i>
            </span>
          </h4>
          <div className="w-1/2 option-input">
            <input
              type="number"
              id="messageLimit"
              className="options-form-input"
              onChange={onChange}
              defaultValue={messageLimit}
            />
            <p
              id="messageLimitError"
              className={`options-error ${
                messageLimitError === "" ? "hidden" : null
              }`}
            >
              {messageLimitError}
            </p>
          </div>
        </div>
        <div className="options-input-container">
          <h4 className="options-input-title w-1/2">Smooth scroll</h4>
          <div className="w-1/2 option-input">
            <label className="switch">
              <input
                type="checkbox"
                id="smoothScroll"
                onChange={onChange}
                defaultChecked={smoothScroll}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
        <div className="options-input-container">
          <h4 className="options-input-title w-1/2">
            Browser Sync
            <span
              className="tooltip tooltip-bottom options-tooltip"
              data-text="Will sync the current channel in the browser with the active tab. Reqiures the T-Chatter Browser Sync extension."
            >
              <i className="fas fa-question-circle"></i>
            </span>
          </h4>
          <div className="w-1/2 option-input">
            <label className="switch">
              <input
                type="checkbox"
                id="browserSync"
                onChange={onChange}
                defaultChecked={browserSync}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Tab options */}
      <div className="options-category">
        <h3 className="options-category-title">Tabs</h3>
        <div className="options-input-container">
          <h4 className="options-input-title w-1/2">Clear tabs on exit</h4>
          <div className="w-1/2 option-input">
            <label className="switch">
              <input
                type="checkbox"
                id="clearTabs"
                onChange={onChange}
                defaultChecked={clearTabs}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Update */}
      <div className="options-category last">
        <h3 className="options-category-title">Update</h3>
        <div className="options-input-container">
          <div className="w-full options-login-container">
            <h4 className="options-input-title w-1/2">Check for update</h4>
            <div className="w-1/2 option-input">
              <button
                to="/options/login"
                className="options-login-btn"
                onClick={checkForUpdate}
              >
                {updateMessage !== null ? updateMessage : "Check"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="w-full options-save-container">
        <button
          type="button"
          onClick={saveOptions}
          className="options-save-btn"
          id="save-btn"
          disabled={isNotValid}
        >
          Save
        </button>
      </div>
      <div className="w-full options-reset-container">
        <button
          type="button"
          onClick={resetOptions}
          className="options-reset-btn"
          id="reset-btn"
        >
          Reset
        </button>
      </div>

      <small className="options-version">T-Chatter v{appVersion}</small>
    </Container>
  );
};

export default Options;
