window.ipcRenderer = require("electron").ipcRenderer;
window.optionsSchema = {
  options: {
    tabs: {
      clearTabs: false,
    },
    messages: {
      limit: 200,
    },
  },
};
