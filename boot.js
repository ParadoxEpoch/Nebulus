const {app, BrowserWindow} = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 1920,
        height: 1200,
        frame: false,
        fullscreen: true
    })

    win.loadFile('index.html');

    //win.openDevTools();
}

function launchApp(appId) {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        transparent: true,
        //frame: false,
        //resizable: false
    })

    win.loadFile(`apps/${appId}/main.html`);

    //win.openDevTools();
}

app.whenReady().then(() => {
    createWindow();
    //createAppWindow();

    launchApp('settings');

});