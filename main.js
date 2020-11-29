// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  Tray,
  nativeImage,
  screen,
  Menu,
  MenuItem,
} = require("electron");
const path = require("path");

let tray, window;

const platform = process.platform;
const icon = path.join(__dirname, "assets/tchatter-258x258.png");
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
    minWidth: 200,
    backgroundColor: "#060407",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: false,
    },
  });

  window.on("closed", () => (window = null));

  // and load the index.html of the app.
  window.loadURL("http://localhost:3000");

  // Open the DevTools.
  window.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createTray();
  createWindow();

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

  // For tray "popup"
  // if (platform === "darwin") {
  //   x = Math.round(
  //     trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
  //   );
  //   y = Math.round(trayBounds.y + trayBounds.height);
  // } else {
  //   x = Math.round(
  //     trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
  //   );
  //   y = Math.round(trayBounds.y + trayBounds.height);
  // }

  return { x, y };
};
