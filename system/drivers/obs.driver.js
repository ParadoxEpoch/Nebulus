const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
const {ipcMain} = require('electron');

const fs = require('fs-extra');
const config = require(process.env.PATH_CONFIG + '/obs.config');

async function connect(address, password) {
    await obs.connect({
        address: address,
        password: password
    });
}

ipcMain.handle('obs.connect', async function (event, arg) {
    console.log('OBS Studio Driver: Got IPC request to connect to an obs-websocket server');
    const result = await connect(config.address, config.password);

    // ! For testing purposes
    obs.on('SwitchScenes', data => {
        event.sender.send('ui.alert', {
            title: `OBS Scene Changed`,
            text: `New Active Scene: ${data.sceneName}`,
            icon: 'info'
        });
    });

    return result;
});

ipcMain.handle('obs.disconnect', async function (event, arg) {
    return obs.disconnect();
});

ipcMain.handle('obs.send', async function (event, arg) {
    console.log('OBS Studio Driver: Got IPC to send a request to OBS');
    const result = await obs.send(arg);
    console.log(result);
    event.sender.send('ui.alert', {
        title: `OBS Studio`,
        text: JSON.stringify(result),
        icon: 'info'
    });
    return result;
});