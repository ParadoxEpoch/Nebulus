const {app, BrowserWindow, ipcMain} = require('electron');
const {exec, spawn} = require("child_process");
const fs = require('fs-extra');
require('electron-reload')(__dirname);

console.log('\nNebula DashLab | (c) Tristan Gauci, 2021\n');

// Current OpenGL Mesa implementation (Pi4 VC4-V3D FKMS) actually results in worse GPU compositing performance than software rendering. Yikes.
// TODO: Investigate Pi4 V3D Full-KMS driver implementation
app.disableHardwareAcceleration();

let loader;
async function spawnLoader() {
    await new Promise(async function(resolve, reject) {
        loader = new BrowserWindow({
            width: 600,
            height: 300,
            frame: false,
            backgroundColor: '#252f3e',
            alwaysOnTop: true
        })
    
        //loader.setIgnoreMouseEvents(true);
        loader.loadFile('shell/loader.html');
    
        loader.once('ready-to-show', () => {
            resolve();
        });
    });
}

let shell;
function spawnShell() {
    shell = new BrowserWindow({
        width: 1920,
        height: 1200,
        frame: false,
        show: false,
        //fullscreen: true,
        //transparent: false,
        backgroundColor: '#252f3e',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    shell.loadFile('shell/shell.html');

    shell.once('ready-to-show', () => {
        shell.setFullScreen(true);
        shell.show();
        loader.hide();
    });

    console.log('DashLab ShellUI was just launched!');
    console.log('The renderer will not execute in this context. Attach debugger to shellRenderer for logs!\n');

    //shell.openDevTools();
}

app.whenReady().then(async () => {
    await spawnLoader();

    global.drivers = {
        stats: require('./system/drivers/stats.driver'),
        hue: require('./system/drivers/philipshue.driver'),
        obs: require('./system/drivers/obs.driver'),
        wifi: require('./system/drivers/wifi.driver')
    };

    spawnShell();
});

const runningApps = {};

class NebulaApp {
    constructor(appId) {
        this.appId = appId;
        
        loader.show();

        this.window = new BrowserWindow({
            /* fullscreen: true,
            transparent: false, */
            width: 1920,
            height: 1200,
            frame: false,
            show: false,
            backgroundColor: '#252f3e',
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        });

        this.window.loadFile(`apps/${this.appId}/${this.appId}.app.html`);

        this.window.once('ready-to-show', () => {
            this.window.setFullScreen(true);
            this.window.show()
            loader.hide();
        });

    }

    quit() {
        this.window.close();
        delete runningApps[this.appId];
    }
}

// * Main Process IPC

ipcMain.handle('testipc', function (event, arg) {
    console.log('\n--- IPC Event Received! ---');
    console.log(arg);
    event.sender.send('ui.alert', {
        title: 'IPC is working!',
        html: 'Hello from the kernel! This message was sent from the main process via an asynchronous IPC reply',
        icon: 'success'
    });
    return 'IPC was successful!';
});

ipcMain.handle('app.open', function (event, arg) {

    console.log(`\nRenderer wants to launch the app "${arg}"`);

    // Check if app exists
    const appExists = fs.pathExistsSync(`apps/${arg}/${arg}.app.html`);
    if (!appExists) {
        console.error(`The app "${arg}" is not installed!`);
        event.sender.send('ui.alert', {
            title: `"${arg}" is not installed!`,
            icon: 'error'
        });
        return;
    }

    // Check if app is already running
    const isAlreadyRunning = runningApps[arg];
    if (isAlreadyRunning) {
        console.error(`The app "${arg}" is already running!`);
        event.sender.send('ui.alert', {
            title: `"${arg}" is already running!`,
            icon: 'error'
        });
        return;
    }

    // Initialise app
    runningApps[arg] = new NebulaApp(arg);

    console.log(runningApps);
});

ipcMain.handle('app.quit', function (event, arg) {

    console.log(`\nRenderer wants to quit the app "${arg}"`);

    const targetApp = runningApps[arg];

    if (!targetApp) {
        console.error(`The app "${arg}" is not running!`);
        event.sender.send('ui.alert', {
            title: `"${arg}" is not running!`,
            icon: 'error'
        });
        return;
    }

    targetApp.quit();

    console.log(runningApps);
});

ipcMain.handle('devtools', function (event, arg) {
    console.log('Launching DevTools on device...');
    shell.openDevTools();
});

ipcMain.handle('relaunch', function (event, arg) {
    app.relaunch();
    app.exit();
});

ipcMain.handle('terminate', function (event, arg) {
    app.exit();
});

ipcMain.handle('reboot', function (event, arg) {
    //const ls = spawn("ls", ["-la"]);
    console.log('Not implemented. The system will not reboot.');
});

/* function testShellExec() {

    console.log('Spawning shell script process...');

    const ls = spawn("ls", ["-la"]);

    ls.stdout.on("data", data => {
        console.log(`stdout: ${data}`);
    });
    
    ls.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
    });
    
    ls.on('error', (error) => {
        console.log(`error: ${error.message}`);
    });
    
    ls.on("close", code => {
        console.log(`child process exited with code ${code}`);
    });

} */