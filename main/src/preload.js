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
      browserSync: false,
    },
    general: {
      allwaysOnTop: false,
      hideOffline: true,
    },
    auth: {
      token: "",
      scope: "",
    },
  },
};
