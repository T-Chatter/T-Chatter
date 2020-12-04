import Home from "./components/Home";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import { TabsContext } from "./contexts/TabsContext";
import Chat from "./components/Chat";
import { useState, useEffect } from "react";
import Options from "./components/Options";
import { OptionsContext } from "./contexts/OptionsContext";
// const ipcRenderer = require("electron").ipcRenderer;

export const updateTabsStorage = (tabs) => {
  localStorage.setItem("userTabs", JSON.stringify(tabs));
};

function App() {
  // const [inMemoryTabs, setInMemoryTabs] = useState([]);
  const [userTabs, setUserTabs] = useState([]);
  const [userOptions, setUserOptions] = useState(window.optionsSchema);

  const addTab = (tab) => {
    const newTabs = [...userTabs, tab];
    setUserTabs(newTabs);
    updateTabsStorage(newTabs);
  };

  const removeTab = (name) => {
    let tabIndex = userTabs.findIndex((t) => t.name === name);
    if (tabIndex !== -1) {
      let newArr = userTabs;
      newArr.splice(tabIndex, 1);
      setUserTabs([...newArr]);
      updateTabsStorage(newArr);
    }
  };

  const saveOptions = (newOptions) => {
    setUserOptions(newOptions);
    window.ipcRenderer.send("updateOptions", newOptions);
  };

  const updateOptions = () => {
    window.ipcRenderer.invoke("getOptions").then((opt) => {
      setUserOptions(opt);
    });
  };

  window.ipcRenderer.on("clearTabs", () => {
    localStorage.setItem("userTabs", JSON.stringify([]));
    setUserTabs([]);
  });

  useEffect(() => {
    const userTabs = JSON.parse(localStorage.getItem("userTabs"));
    if (userTabs) {
      setUserTabs(userTabs);
    }
    window.ipcRenderer.invoke("getOptions").then((opt) => {
      setUserOptions(opt);
    });
  }, [setUserTabs]);

  return (
    <OptionsContext.Provider
      value={{ save: saveOptions, update: updateOptions, options: userOptions }}
    >
      <TabsContext.Provider
        value={{ tabs: userTabs, addTab: addTab, removeTab: removeTab }}
      >
        <Router>
          <Navbar />
          <main>
            <Switch>
              <Route path="/" exact>
                <Home />
              </Route>
              <Route path="/chat">
                <Chat />
              </Route>
              <Route path="/options">
                <Options />
              </Route>
            </Switch>
          </main>
        </Router>
      </TabsContext.Provider>
    </OptionsContext.Provider>
  );
}

export default App;
