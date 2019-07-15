// Modules to control application life and create native browser window
require('dotenv').config()
const nconf = require('nconf')
nconf.env().defaults({
  SPEED_URL: 'https://32mo5c9zs2.execute-api.us-east-1.amazonaws.com/Prod/data',
  TEMP_URL: 'https://i90jji9q5j.execute-api.us-east-1.amazonaws.com/Prod/data',
  ODO_URL: 'https://g9eyv3jby5.execute-api.us-east-1.amazonaws.com/Prod/data',
  TIME_RANGE: 60000,
  REFRESH: 5000,
})

const { app, BrowserWindow, } = require('electron')
const isDev = require("electron-is-dev");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {

  mainWindow = new BrowserWindow({
    show: false,
    center: true,
    webPreferences: {
      nodeIntegration: true,
    }
  })

  mainWindow.maximize()

  // and load the index.html of the app.
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
  } else {
    mainWindow.loadFile('build/index.html')
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // show window
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // load services
  require('./electron/services/data')(mainWindow)
  require('./electron/services/settings')(mainWindow)

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
