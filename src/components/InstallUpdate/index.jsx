import React from "react";
import "./style.css";

const InstallUpdate = ({ isClosed }) => {
  const install = (e) => {
    window.ipcRenderer.send("installUpdate");
    isClosed(true);
  };

  return (
    <div className="install-update-block-container">
      <div className="install-update-container">
        <button onClick={install} className="install-update-btn">
          Install update now
        </button>
      </div>
    </div>
  );
};

export default InstallUpdate;
