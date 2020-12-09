import React, { useContext, useEffect, useState } from "react";
import { OptionsContext } from "../../contexts/OptionsContext";
import Container from "../Container";
import "./style.css";

const Options = () => {
  const optionsContext = useContext(OptionsContext);
  let clearTabs = optionsContext.options?.tabs?.clearTabs;
  let messageLimit = optionsContext.options?.chat?.messages?.limit;
  let smoothScroll = optionsContext.options?.chat?.smoothScroll;

  const [isNotValid, setIsNotValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [messageLimitError, setMessageLimitError] = useState("");

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
    if (isLoading) {
      if (
        (clearTabs !== undefined && messageLimit !== undefined) ||
        smoothScroll !== undefined
      ) {
        setIsLoading(!isLoading);
      }
    } else {
      document.getElementById("clearTabs").checked = clearTabs;
      document.getElementById("smoothScroll").checked = smoothScroll;
      document.getElementById("messageLimit").value = messageLimit;
    }
  }, [clearTabs, messageLimit, isLoading, smoothScroll]);

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
    window.ipcRenderer.send(
      "updateOption",
      "chat.messages.limit",
      messageLimit
    );
    window.ipcRenderer.send("updateOption", "chat.smoothScroll", smoothScroll);
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
        <h3 className="options-input-title w-1/2">Smooth scroll</h3>
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
    </Container>
  );
};

export default Options;
