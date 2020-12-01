import React, { useEffect, useState } from "react";
import "./style.css";

const Options = () => {
  const [userSettings, setUserSettings] = useState({
    clearTabs: false,
  });
  const [clearTabs, setClearTabs] = useState(userSettings.clearTabs);

  const save = () => {
    localStorage.setItem("userSettings", JSON.stringify(userSettings));
  };

  const onChange = (e) => {
    const { id, value, checked } = e.target;
    if (id) {
      switch (id) {
        case "clearTabs":
          console.log(!checked);
          setClearTabs(!checked);
          userSettings.clearTabs = clearTabs;
          break;

        default:
          break;
      }
    }
  };

  useEffect(() => {
    const userSettings = JSON.parse(localStorage.getItem("userSettings"));
    if (userSettings) {
      setUserSettings(userSettings);
      console.log(userSettings);
    }
  }, [setUserSettings]);
  return (
    <div className="options-container">
      <h1 className="options-title">Options</h1>
      <div>
        <input
          type="checkbox"
          id="clearTabs"
          onChange={onChange}
          checked={clearTabs}
        />
        <button type="button" onClick={save}>
          Save
        </button>
      </div>
    </div>
  );
};

export default Options;
