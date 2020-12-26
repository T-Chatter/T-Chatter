import Home from "./components/Home";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import TabsState from "./contexts/Tabs/TabsState";
import Chat from "./components/Chat";
import { useState, useEffect } from "react";
import Options from "./components/Options";
import OptionsState from "./contexts/Options/OptionsState";
import Login from "./components/Options/Login";
import InstallUpdate from "./components/InstallUpdate";
import Update from "./components/Update";
import BrowserSync from "./components/BrowserSync";
import AuthState from "./contexts/Auth/AuthState";
// const ipcRenderer = require("electron").ipcRenderer;

function App() {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdateDownloaded, setIsUpdateDownloaded] = useState(false);
  const [updateClosed, setUpdateClosed] = useState(false);

  useEffect(() => {
    window.ipcRenderer.on("updateAvailable", () => {
      setUpdateClosed(false);
      setIsUpdateAvailable(true);
    });

    window.ipcRenderer.on("updateDownloaded", () => {
      setUpdateClosed(false);
      setIsUpdateAvailable(true);
      setIsUpdateDownloaded(true);
    });
  }, []);

  return (
    <AuthState>
      <OptionsState>
        <TabsState>
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
        </TabsState>
      </OptionsState>
    </AuthState>
  );
}

export default App;
