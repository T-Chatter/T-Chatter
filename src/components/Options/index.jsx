import React, { useContext, useEffect, useState } from "react";
import { OptionsContext } from "../../contexts/OptionsContext";
import Container from "../Container";
import "./style.css";

const Options = () => {
  const optionsContext = useContext(OptionsContext);
  let clearTabs = optionsContext.options?.tabs?.clearTabs;
  let messageLimit = optionsContext.options?.messages?.limit;

  const [isLoading, setIsLoading] = useState(true);

  const onChange = (e) => {
    const btn = document.getElementById("save-btn");
    btn.innerText = "Save";
    btn.classList.remove("saved");
    const { id, value, checked } = e.target;
    if (id) {
      switch (id) {
        case "clearTabs":
          clearTabs = checked;
          break;
        case "messageLimit":
          messageLimit = value;
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    if (isLoading) {
      if (clearTabs !== undefined && messageLimit !== undefined) {
        setIsLoading(!isLoading);
      }
    } else {
      document.getElementById("clearTabs").checked = clearTabs;
      document.getElementById("messageLimit").value = messageLimit;
    }
  }, [clearTabs, messageLimit, isLoading]);

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
    window.ipcRenderer.send("updateOption", "tabs.clearTabs", clearTabs);
    window.ipcRenderer.send("updateOption", "messages.limit", messageLimit);
    optionsContext.update();
  };

  return isLoading ? (
    <h1 className="options-loading">Loading...</h1>
  ) : (
    <Container className="options-container">
      <h1 className="options-title">Options</h1>
      <div className="options-input-container">
        <h3 className="options-input-title w-1/2">Clear tabs on exit</h3>
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
      <div className="options-input-container">
        <h3 className="options-input-title w-1/2">
          Message limit
          <span
            className="tooltip tooltip-bottom options-tooltip"
            data-text="Default: 200. May cause performance issues if set too high."
          >
            <i class="fas fa-question-circle"></i>
          </span>
        </h3>
        <div className="w-1/2 option-input">
          <input
            type="text"
            id="messageLimit"
            className="options-form-input"
            onChange={onChange}
            defaultValue={messageLimit}
          />
        </div>
      </div>
      <div className="w-full options-save-container">
        <button
          type="button"
          onClick={saveOptions}
          className="options-save-btn"
          id="save-btn"
        >
          Save
        </button>
      </div>
    </Container>
  );
};

export default Options;
