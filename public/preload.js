window.ipcRenderer = require("electron").ipcRenderer;
window.shell = require("electron").shell;
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
    general: {
      allwaysOnTop: false,
    },
    auth: {
      token: "",
      scope: "",
    },
  },
};
