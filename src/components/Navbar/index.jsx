import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { TabsContext } from "../../contexts/TabsContext";
import "./style.css";

const Navbar = () => {
  const [isAdditionalOpen, setIsAdditionalOpen] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

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
    if (e.target.classList.contains("active") && !isAdditionalOpen) {
      const target = document.querySelector(
        `#${CSS.escape(e.target.id)}.navbar-additional`
      );
      if (target) {
        setIsAdditionalOpen(true);
        target.classList.remove("hidden");
        target.classList.add("open");
        return;
      }
    }
    document.querySelectorAll(".navbar-additional").forEach((el) => {
      el.classList.add("hidden");
      el.classList.remove("open");
    });
    setIsAdditionalOpen(false);
  };

  useEffect(() => {
    if (firstLoad) {
      console.log(
        "This will run every 5 minutes. This will get state of channel (live or offline). " +
          new Date().toLocaleTimeString()
      );
      setFirstLoad(false);
    }
    const interval = setInterval(() => {
      console.log(
        "This will run every 5 minutes. This will get state of channel (live or offline). " +
          Date.now()
      );
    }, 5 * 1000 * 60);
    return () => clearInterval(interval);
  }, [firstLoad]);

  const openStream = (channel) => {
    window.shell.openExternal("https://twitch.com/" + channel);
  };

  return (
    <>
      <div className="navbar-container" id="nav-main">
        <div className="navbar-nav">
          <NavLink
            to="/options"
            className="navbar-link navbar-link-icon"
            id="settings"
            activeClassName="active"
          >
            <i className="fas fa-cog navbar-link-i"></i>
          </NavLink>
        </div>
        <div className="navbar-nav navbar-nav-secondary">
          <NavLink
            to="/"
            className="navbar-link"
            exact={true}
            activeClassName="active"
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
              </div>
            );
          })
        }
      </TabsContext.Consumer>
    </>
  );
};

export default Navbar;
