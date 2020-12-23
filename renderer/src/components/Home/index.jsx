import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { TabsContext } from "../../contexts/TabsContext";
import { OptionsContext } from "../../contexts/OptionsContext";
import Follows from "./Follows";

import "./style.css";

const Home = () => {
  const { addTab, tabs } = useContext(TabsContext);
  const optionsContext = useContext(OptionsContext);
  const [redirect, setRedirect] = useState(false);

  const [channel, setChannel] = useState("");

  const handleSubmit = (e) => {
    if (e.key === "Enter") {
      add();
    }
  };

  const add = () => {
    if (channel !== "") {
      const tab = {
        id: uuidv4(),
        name: channel,
        messages: [],
      };
      addTab(tab);
      setRedirect(true);
    }
  };

  const addWithName = (channel) => {
    if (channel !== "") {
      const tab = {
        id: uuidv4(),
        name: channel,
        messages: [],
      };
      addTab(tab);
      setChannel(channel);
      setRedirect(true);
    }
  };

  const addSync = () => {
    const syncTab = tabs.find((t) => t.id === 0);
    if (syncTab) {
      setChannel(syncTab.name);
      setRedirect(true);
    } else {
      const tab = {
        id: 0,
        name: "Sync_",
        messages: [],
      };
      addTab(tab);
      setChannel("Sync_");
      setRedirect(true);
    }
  };

  if (redirect) return <Redirect to={`/chat/${channel}`} />;
  return (
    <div className="home-container">
      <h1 className="home-title">Add channel</h1>
      <div className="home-form">
        <input
          type="text"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          onKeyUp={handleSubmit}
          className="home-form-input"
        />
        <button className="home-form-submit" onClick={add}>
          Add
        </button>
        <br />
        {optionsContext?.options?.chat?.browserSync ? (
          <button className="home-form-submit" onClick={addSync}>
            Sync Tab
            <span
              className="tooltip tooltip-top sync-tab-tip"
              data-text="Adds a Browser Sync tab that will sync the channel to the current channel in the browser. Requires T-Chatter Browser Sync extension."
            >
              <i className="fas fa-question-circle"></i>
            </span>
          </button>
        ) : null}
      </div>
      <div>
        <Follows addTab={addWithName} />
      </div>
    </div>
  );
};

export default Home;
