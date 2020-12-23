import Home from "./components/Home";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import { TabsContext } from "./contexts/TabsContext";
import Chat from "./components/Chat";
import { useState, useEffect, useCallback } from "react";
import Options from "./components/Options";
import { OptionsContext } from "./contexts/OptionsContext";
import Login from "./components/Options/Login";
import { AuthContext } from "./contexts/AuthContext";
import { CLIENT_ID } from "./constants";
import InstallUpdate from "./components/InstallUpdate";
import Update from "./components/Update";
import BrowserSync from "./components/BrowserSync";
// const ipcRenderer = require("electron").ipcRenderer;

export const updateTabsStorage = (tabs) => {
  localStorage.setItem("userTabs", JSON.stringify(tabs));
};

function App() {
  const [userTabs, setUserTabs] = useState([]);
  const [userOptions, setUserOptions] = useState(window.optionsSchema);
  const [authUser, setAuthUser] = useState({
    username: null,
    userId: null,
    token: null,
    follows: null,
  });
  const [isLoadingAuthUser, setIsLoadingAuthUser] = useState(true);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdateDownloaded, setIsUpdateDownloaded] = useState(false);
  const [updateClosed, setUpdateClosed] = useState(false);

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

  const removeTabById = (id) => {
    let tabIndex = userTabs.findIndex((t) => t.id === id);
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
      if (opt.auth.token !== "") {
        updateAuthUser(opt.auth.token);
      } else logout();
    });
  };

  const logout = () => {
    setAuthUser({
      username: null,
      userId: null,
      token: null,
      follows: null,
    });
    setIsLoadingAuthUser(false);
  };

  const updateAuthUser = useCallback((token) => {
    setIsLoadingAuthUser(true);
    fetch("https://api.twitch.tv/helix/users", {
      headers: {
        Authorization: "Bearer " + token,
        "Client-Id": CLIENT_ID,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data !== null) {
          const user = data.data[0];
          fetch(
            "https://api.twitch.tv/helix/users/follows?from_id=" + user.id,
            {
              headers: {
                Authorization: "Bearer " + token,
                "Client-Id": CLIENT_ID,
              },
            }
          )
            .then((res) => res.json())
            .then((res) => {
              setAuthUser({
                username: user.login,
                userId: user.id,
                token: token,
                follows: res.data,
              });
              setIsLoadingAuthUser(false);
            });
        }
      })
      .catch((res) => {
        logout();
      });
  }, []);

  useEffect(() => {
    const userTabs = JSON.parse(localStorage.getItem("userTabs"));
    if (userTabs) {
      setUserTabs(userTabs);
    }
    window.ipcRenderer.invoke("getOptions").then((opt) => {
      setUserOptions(opt);
      if (opt.auth.token !== "") {
        updateAuthUser(opt.auth.token);
      } else logout();
    });

    window.ipcRenderer.on("clearTabs", () => {
      localStorage.setItem("userTabs", JSON.stringify([]));
      setUserTabs([]);
    });

    window.ipcRenderer.on("updateAvailable", () => {
      setUpdateClosed(false);
      setIsUpdateAvailable(true);
    });

    window.ipcRenderer.on("updateDownloaded", () => {
      setUpdateClosed(false);
      setIsUpdateAvailable(true);
      setIsUpdateDownloaded(true);
    });
  }, [setUserTabs, updateAuthUser]);

  return (
    <AuthContext.Provider
      value={{
        authUser: authUser,
        isLoading: isLoadingAuthUser,
        update: updateAuthUser,
        logout: logout,
      }}
    >
      <OptionsContext.Provider
        value={{
          save: saveOptions,
          update: updateOptions,
          options: userOptions,
        }}
      >
        <TabsContext.Provider
          value={{
            tabs: userTabs,
            addTab: addTab,
            removeTab: removeTab,
            removeTabById: removeTabById,
          }}
        >
          <Router>
            <Navbar />
            {isUpdateAvailable && !updateClosed ? (
              isUpdateDownloaded ? (
                <InstallUpdate isClosed={setUpdateClosed} />
              ) : (
                <Update isClosed={setUpdateClosed} />
              )
            ) : null}
            <main>
              <BrowserSync />
              <Switch>
                <Route path="/" exact>
                  <Home />
                </Route>
                <Route path="/chat">
                  <Chat />
                </Route>
                <Route
                  path="/options"
                  render={({ match: { url } }) => (
                    <>
                      <Route path={`${url}/`} component={Options} exact />
                      <Route path={`${url}/login`} component={Login} />
                    </>
                  )}
                />
              </Switch>
            </main>
          </Router>
        </TabsContext.Provider>
      </OptionsContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
