const wifi = require('node-wifi');
const {ipcMain} = require('electron');

// Initialize wifi module
wifi.init({
    iface: 'wlan0' // Network interface. wlan0 for the Pi's internal wireless chipset. We could make this user configurable to support external USB WiFi adapters.
});

ipcMain.handle('wifi.list', async function (event, arg) {
    console.log('WiFi Comms Driver: Got IPC request to list discovered APs');
    const result = await wifi.scan();
    console.log(result);
    return result;
});

ipcMain.handle('wifi.scan', async function (event, arg) {
    console.log('WiFi Comms Driver: Got IPC request to perform a AP rescan');
    const result = await wifi.scan();
    console.log(result);
    return result;
});

ipcMain.handle('wifi.getConnections', async function (event, arg) {
    console.log('WiFi Comms Driver: Got IPC request for current connections');
    const result = await wifi.getCurrentConnections();
    console.log(result);
    return result;
});