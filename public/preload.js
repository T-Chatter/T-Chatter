window.ipcRenderer = require("electron").ipcRenderer;
window.optionsSchema = {
  options: {
    tabs: {
      clearTabs: false,
    },
    chat: {
      messages: {
        limit: 200,
      },
      smoothScroll: true,
    },
  },
};
