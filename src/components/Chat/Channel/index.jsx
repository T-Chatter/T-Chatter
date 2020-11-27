import React, { useContext } from "react";
import { Redirect } from "react-router";
import { TabsContext } from "../../../contexts/TabsContext";

const Channel = () => {
  const { removeTab } = useContext(TabsContext);
  let channel = window.location.pathname.replace("/chat/", "");

  const remove = () => {
    removeTab(channel);
    channel = "";
  };

  if (channel === "") return <Redirect to="/" />;
  return (
    <div>
      <h1>{channel}</h1>
      <button onClick={remove}>Remove channel</button>
    </div>
  );
};

export default Channel;
