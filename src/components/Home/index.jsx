import React, { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { TabsContext } from "../../contexts/TabsContext";

import "./style.css";

const Home = () => {
  const { addTab } = useContext(TabsContext);

  const [channel, setChannel] = useState("");

  const add = () => {
    if (channel !== "") {
      const tab = {
        id: uuidv4(),
        name: channel,
        messages: [],
      };
      addTab(tab);
    }
  };

  return (
    <div className="home-container">
      <h1>Hello World! 🌎</h1>
      <h4>Add channel</h4>
      <input
        type="text"
        value={channel}
        onChange={(e) => setChannel(e.target.value)}
      />
      <button onClick={add}>Add</button>
    </div>
  );
};

export default Home;
