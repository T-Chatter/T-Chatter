import Home from "./components/Home";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import { TabsContext } from "./contexts/TabsContext";
import Chat from "./components/Chat";
import { useState, useEffect } from "react";
import Options from "./components/Options";

export const updateTabsStorage = (tabs) => {
  localStorage.setItem("userTabs", JSON.stringify(tabs));
};

function App() {
  // const [inMemoryTabs, setInMemoryTabs] = useState([]);
  const [userTabs, setUserTabs] = useState([]);

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

  useEffect(() => {
    const userTabs = JSON.parse(localStorage.getItem("userTabs"));
    if (userTabs) {
      setUserTabs(userTabs);
    }
  }, [setUserTabs]);

  return (
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
  );
}

export default App;
