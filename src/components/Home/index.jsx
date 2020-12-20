import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { TabsContext } from "../../contexts/TabsContext";
import Follows from "./Follows";

import "./style.css";

const Home = () => {
  const { addTab } = useContext(TabsContext);
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
      </div>
      <div>
        <Follows addTab={addWithName} />
      </div>
    </div>
  );
};

export default Home;
