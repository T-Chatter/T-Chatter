import React from "react";
import { NavLink } from "react-router-dom";
import { TabsContext } from "../../contexts/TabsContext";
import "./style.css";

const Navbar = () => {
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

  return (
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
                >
                  {tab.name}
                </NavLink>
              );
            })
          }
        </TabsContext.Consumer>
      </div>
    </div>
  );
};

export default Navbar;
