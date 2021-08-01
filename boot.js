const {app, BrowserWindow} = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 1920,
        height: 1200
    })

    win.loadFile('index.html')
}

function createAppWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        transparent: true,
        frame: false,
        resizable: false
    })

    win.loadFile('index.html')
}

function launchApp(appId) {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        //transparent: true,
        //frame: false,
        //resizable: false
    })

    win.loadFile(`apps/${appId}/main.html`);
}

app.whenReady().then(() => {
    createWindow();
    //createAppWindow();

    launchApp('settings');

});