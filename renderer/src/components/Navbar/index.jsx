import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { TabsContext } from "../../contexts/Tabs/tabs.context";
import "./style.css";

const Navbar = () => {
  const { removeTab, removeTabById } = useContext(TabsContext);
  const [isAdditionalOpen, setIsAdditionalOpen] = useState(false);

  document.addEventListener(
    "wheel",
    function (e) {
      if (
        e.target.classList.contains("navbar-container") ||
        e.target.classList.contains("navbar-link") ||
        e.target.classList.contains("navbar-link-i")
      ) {
        e.preventDefault();
        const scrollContainer = document.getElementById("nav-main");
        if (e.deltaY > 0) scrollContainer.scrollLeft += 10;
        else scrollContainer.scrollLeft -= 10;
      }
    },
    { passive: false }
  );

  const displayAdditional = (e) => {
    if (
      e.target.classList.contains("active") &&
      !e.target.classList.contains("ignore-additional") &&
      !isAdditionalOpen
    ) {
      const target = document.querySelector(
        `#${CSS.escape(e.target.id)}.navbar-additional`
      );
      if (target) {
        setIsAdditionalOpen(true);
        target.classList.remove("hidden");
        target.classList.add("open");
        return;
      }
    } else if (e.button === 1) {
      e.preventDefault();
      const tabId = e.target.id;
      if (tabId) removeTabById(tabId);
    }
    document.querySelectorAll(".navbar-additional").forEach((el) => {
      el.classList.add("hidden");
      el.classList.remove("open");
    });
    setIsAdditionalOpen(false);
  };

  const openStream = (channel) => {
    window.shell.openExternal("https://twitch.com/" + channel);
  };

  const deleteTab = (channel) => {
    removeTab(channel);
  };

  return (
    <>
      <div className="navbar-container" id="nav-main">
        <div className="navbar-nav">
          <NavLink
            to="/options"
            className="navbar-link navbar-link-icon ignore-additional"
            id="settings"
            activeClassName="active"
            onClick={displayAdditional}
            onAuxClick={displayAdditional}
          >
            <i className="fas fa-cog navbar-link-i"></i>
          </NavLink>
        </div>
        <div className="navbar-nav navbar-nav-secondary">
          <NavLink
            to="/"
            className="navbar-link ignore-additional"
            exact={true}
            activeClassName="active"
            onClick={displayAdditional}
            onAuxClick={displayAdditional}
          >
            <i className="fas fa-plus"></i>
          </NavLink>
          <TabsContext.Consumer>
            {(tabs) =>
              tabs.tabs.map((tab) => {
                return (
                  <NavLink
                    to={`/chat/${tab.name}`}
                    className="navbar-link"
                    exact={true}
                    activeClassName="active"
                    key={tab.id}
                    id={tab.id}
                    onClick={displayAdditional}
                    onAuxClick={displayAdditional}
                  >
                    {tab.name}
                  </NavLink>
                );
              })
            }
          </TabsContext.Consumer>
        </div>
      </div>
      <TabsContext.Consumer>
        {(tabs) =>
          tabs.tabs.map((tab) => {
            return (
              <div
                id={tab.id}
                key={tab.id}
                className="navbar-additional hidden"
              >
                <button
                  className="open-stream-btn"
                  onClick={() => openStream(tab.name)}
                >
                  <i className="fas fa-play"></i>
                  Open Stream
                </button>
                <button
                  className="open-stream-btn"
                  onClick={() => deleteTab(tab.name)}
                >
                  <i className="fas fa-ban"></i>
                  Close Tab
                </button>
              </div>
            );
          })
        }
      </TabsContext.Consumer>
    </>
  );
};

export default Navbar;
