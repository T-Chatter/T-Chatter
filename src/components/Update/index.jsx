import React, { useState } from "react";
import "./style.css";

const Update = ({ isClosed }) => {
  const [isDownloadingUpdate, setIsDownloadingUpdate] = useState(false);
  const downloadUpdate = (e) => {
    setIsDownloadingUpdate(true);
    window.ipcRenderer.send("downloadUpdate");
  };

  const notDownloadingHtml = (
    <>
      <h2>Update Available</h2>
      <div>
        <button className="update-btn" onClick={downloadUpdate}>
          Update
        </button>
        <button className="update-btn close" onClick={() => isClosed(true)}>
          Close
        </button>
      </div>
    </>
  );

  const downloadingHtml = (
    <>
      <h2>Downloading update, please wait.</h2>
    </>
  );

  return (
    <div className="update-block-container">
      <div className="update-container">
        {isDownloadingUpdate ? downloadingHtml : notDownloadingHtml}
      </div>
    </div>
  );
};

export default Update;
