// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  Tray,
  nativeImage,
  screen,
  Menu,
  MenuItem,
  ipcMain,
} = require("electron");
const path = require("path");
const { env } = require("process");
const Store = require("electron-store");
const express = require("express");
const { autoUpdater } = require("electron-updater");
const cors = require("cors");

const optionsDefaults = {
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
      alwaysOnTop: false,
      hideOffline: true,
    },
    auth: {
      token: "",
      scope: "",
    },
  },
};

const store = new Store({
  defaults: optionsDefaults,
  clearInvalidConfig: true,
  migrations: {
    "0.1.0": (store) => {
      store.delete("options.messages");
      store.set(
        "options.chat.messages.limit",
        store.get(
          "options.messages.limit",
          optionsDefaults.options.chat.messages.limit
        )
      );
      store.set("options.chat.smoothScroll", true);
    },
    "0.1.1": (store) => {
      store.delete("options.messages");
    },
    "0.2.2": (store) => {
      store.set("options.general.alwaysOnTop", false);
    },
    "0.3.0": (store) => {
      store.set("options.auth.token", "");
      store.set("options.auth.scope", "");
    },
    "0.3.10": (store) => {
      store.set("options.chat.browserSync", false);
    },
    "0.3.14": (store) => {
      store.set("options.general.hideOffline", true);
    },
  },
});

let tray, window, authWindow;

const platform = process.platform;
const icon = path.join(__dirname, "./assets/tchatter-256x256.png");
const nIcon = nativeImage.createFromPath(icon);

if (platform === "darwin") app.dock.hide();

function createWindow() {
  // Create the browser window.
  window = new BrowserWindow({
    icon: nIcon,
    width: 800,
    height: 600,
    show: true,
    resizable: true,
    title: "T-Chatter",
    minHeight: 500,
    minWidth: 250,
    backgroundColor: "#060407",
    alwaysOnTop: store.get(
      "options.general.alwaysOnTop",
      optionsDefaults.options.general.alwaysOnTop
    ),
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname + "/preload.js"),
      contextIsolation: false,
    },
  });

  window.once("ready-to-show", () => {
    if (env.NODE_ENV === "development") {
      autoUpdater.checkForUpdates();
    } else {
      autoUpdater.checkForUpdatesAndNotify();
    }
  });

  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on("update-available", () => {
    window.webContents.send("updateAvailable");
  });

  autoUpdater.on("update-downloaded", () => {
    window.webContents.send("updateDownloaded");
  });

  window.on("closed", () => (window = null));

  // and load the index.html of the app.
  if (env.NODE_ENV === "development") {
    window.loadURL("http://localhost:3000/");
    // window.loadURL(`file://${path.join(__dirname, "../build/index.html")}`);
    // Open the DevTools.
    window.webContents.openDevTools();
  } else {
    window.loadURL(`file://${path.join(__dirname, "../build/index.html")}`);
    Menu.setApplicationMenu(null);
  }
}

const localhostServer = express();
const port = 6749;

const browserSyncServer = express();
browserSyncServer.use(cors());
const browserSyncPort = 6748;

localhostServer.get("/token", (req, res) => {
  res.sendFile(path.join(__dirname + "/token/token.html"));
});

localhostServer.get("/access_token", (req, res) => {
  const { access_token, scope, token_type } = req.query;
  window.webContents.send("loginCallback", access_token, scope, token_type);
  authWindow.close();
});

function createAuthWindow() {
  authWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
  });

  let localhostServerInstance = localhostServer.listen(port);

  authWindow.on("closed", () => {
    window.webContents.send("loginCallback");
    localhostServerInstance.close();
    authWindow = null;
  });
}

let browserSyncServerInstance;

browserSyncServer.get("/", (req, res) => {
  window.webContents.send("updateActiveChannel", req.query.channel);
  res.status(200).send({ channel: req.query.channel });
});

function browserSync(isEnabled) {
  if (isEnabled) {
    if (!browserSyncServerInstance?.listening) {
      browserSyncServerInstance = browserSyncServer.listen(
        browserSyncPort,
        () => console.log("Listening for browserSync requests.")
      );
    }
  } else if (browserSyncServerInstance !== undefined) {
    browserSyncServerInstance.close();
    browserSyncServerInstance = undefined;
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createTray();
  createWindow();

  const browserSyncEnabled = store.get(
    "options.chat.browserSync",
    optionsDefaults.options.chat.browserSync
  );
  browserSync(browserSyncEnabled);

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (platform !== "darwin") app.quit();
});

const createTray = () => {
  tray = new Tray(nIcon);
  tray.setToolTip("T-Chatter");
  tray.on("click", (event) => toggleWindow());
  tray.on("right-click", (event) => {
    const template = [
      new MenuItem({
        label: "Exit",
        toolTip: "Exit the application",
        click: () => app.quit(),
      }),
    ];
    const menu = Menu.buildFromTemplate(template);
    tray.popUpContextMenu(menu);
  });
};

const toggleWindow = () => {
  window.isVisible() ? window.hide() : showWindow();
};

const showWindow = () => {
  const position = windowPosition();
  window.setPosition(position.x, position.y);
  window.show();
};

const windowPosition = () => {
  const windowBounds = window.getBounds();
  const screenBounds = screen.getPrimaryDisplay().bounds;
  // const trayBounds = tray.getBounds();

  const x = screenBounds.width / 2 - windowBounds.width / 2;
  const y = screenBounds.height / 2 - windowBounds.height / 2;

  return { x, y };
};

app.on("will-quit", (e) => {
  if (store.get("options.tabs.clearTabs")) {
    window.webContents.send("clearTabs");
  }
});

ipcMain.on("updateOption", (e, key, value) => {
  store.set(`options.${key}`, value);
  switch (key) {
    case "general.alwaysOnTop":
      window.setAlwaysOnTop(value);
      break;
    case "chat.browserSync":
      browserSync(value);
      break;
    default:
      break;
  }
});

ipcMain.handle("getOptions", (e) => {
  return store.get("options");
});

ipcMain.on("startLogin", (e, authUrl) => {
  createAuthWindow();
  authWindow.loadURL(authUrl);
  authWindow.show();
  authWindow.webContents.on("will-navigate", (e, newUrl) => {});
});

ipcMain.handle("getAppVersion", (e) => {
  return app.getVersion();
});

ipcMain.handle("checkForUpdate", (e) => {
  if (env.NODE_ENV === "development") {
    autoUpdater
      .checkForUpdates()
      .then((res) => {
        return true;
      })
      .catch((res) => {
        return false;
      });
  } else {
    autoUpdater
      .checkForUpdatesAndNotify()
      .then((res) => {
        return true;
      })
      .catch((res) => {
        return false;
      });
  }
  return false;
});

ipcMain.on("downloadUpdate", (e) => {
  autoUpdater
    .checkForUpdates()
    .then((res) => {
      // console.log(res.updateInfo);
      autoUpdater.downloadUpdate(res.cancellationToken);
    })
    .catch((res) => {
      console.log(res);
    });
});

ipcMain.on("installUpdate", () => {
  autoUpdater.quitAndInstall();
});

ipcMain.on("resetOptions", (e) => {
  store.reset("options");
  console.log("Reset");
});
