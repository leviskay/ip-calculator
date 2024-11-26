const { app, BrowserWindow } = require('electron')
const path = require('path')
const { join } = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // В production режиме загружаем собранное приложение
  if (process.env.NODE_ENV === 'production') {
    win.loadFile(path.join(__dirname, '../.output/public/index.html'))
  } else {
    // В режиме разработки загружаем с локального сервера
    win.loadURL('http://localhost:3000')
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
