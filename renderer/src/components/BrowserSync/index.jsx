import React, { useContext, useCallback, useEffect, useState } from "react";
import { TabsContext } from "../../contexts/Tabs/tabs.context";
import { OptionsContext } from "../../contexts/OptionsContext";
import { Redirect } from "react-router-dom";

const BrowserSync = () => {
  const { addTab, tabs, removeTabById } = useContext(TabsContext);
  const optionsContext = useContext(OptionsContext);

  const [redirect, setRedirect] = useState(false);
  const [channel, setChannel] = useState("");

  const updateActiveChannel = useCallback(
    (e, channel) => {
      if (optionsContext?.options?.chat?.browserSync) {
        const hashLocation = window.location.hash;
        if (hashLocation.includes("#/chat/Sync_")) {
          const syncTab = tabs.find((t) => t.id === 0);
          setChannel(`Sync_${channel}`);
          if (syncTab) {
            if (syncTab.name !== `Sync_${channel}`) {
              removeTabById(0);
              const syncTab = {
                id: 0,
                name: `Sync_${channel}`,
                messages: [],
              };
              addTab(syncTab);
            }
          } else {
            const syncTab = {
              id: 0,
              name: `Sync_${channel}`,
              messages: [],
            };
            addTab(syncTab);
          }
          setRedirect(true);
          setRedirect(false);
        }
      }
    },
    [optionsContext, tabs, addTab, removeTabById]
  );

  useEffect(() => {
    window.ipcRenderer.on("updateActiveChannel", updateActiveChannel);
    return () => {
      window.ipcRenderer.removeListener(
        "updateActiveChannel",
        updateActiveChannel
      );
    };
  }, [optionsContext, updateActiveChannel]);

  if (redirect) return <Redirect to={`/chat/${channel}`} />;
  return null;
};

export default BrowserSync;
