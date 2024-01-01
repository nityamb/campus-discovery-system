const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, 'src/assets/app_logo.png'),
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });

    win.setMenu(null);
    win.loadURL('http://localhost:3000');
    win.maximize();
    win.webContents.openDevTools({ mode: 'detach' });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});