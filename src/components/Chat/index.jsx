import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router";
import { TabsContext } from "../../contexts/TabsContext";
import Channel from "./Channel";

const Chat = () => {
  const { tabs } = useContext(TabsContext);

  return (
    <>
      <Switch>
        {tabs.map((tab) => (
          <Route key={tab.id} path={`/chat/${tab.name}`} exact={true}>
            <div className="chat-channel-container">
              <Channel />
            </div>
          </Route>
        ))}
        <Route path="/chat">
          <Redirect to="/" />
        </Route>
      </Switch>
    </>
  );
};

export default Chat;
