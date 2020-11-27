import Home from "./components/Home";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import { TabsContext } from "./contexts/TabsContext";
import Chat from "./components/Chat";
import { useState } from "react";

function App() {
  const [inMemoryTabs, setInMemoryTabs] = useState([]);

  const addTab = (tab) => {
    setInMemoryTabs([...inMemoryTabs, tab]);
  };

  const removeTab = (name) => {
    let tabIndex = inMemoryTabs.findIndex((t) => t.name === name);
    if (tabIndex !== -1) {
      console.log(inMemoryTabs);
      let newArr = inMemoryTabs;
      newArr.splice(tabIndex, 1);
      setInMemoryTabs([...newArr]);
    }
  };

  return (
    <TabsContext.Provider
      value={{ tabs: inMemoryTabs, addTab: addTab, removeTab: removeTab }}
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
          </Switch>
        </main>
      </Router>
    </TabsContext.Provider>
  );
}

export default App;
