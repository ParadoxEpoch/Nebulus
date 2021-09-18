const hue = require('node-hue-api')
const discovery = hue.discovery
const hueApi = hue.v3.api;

const {ipcMain} = require('electron');
const fs = require('fs-extra');

const config = require('../../config/philipshue.config.json');

const appName = 'dashlab-hue';
const deviceName = 'nebula-dashlab';

async function discoverAndLink() {
    
    console.log('Searching for Hue Bridges via nupnp... (quick)');
    let discoveryResults = await discovery.nupnpSearch();

    // If no bridges were found, perform a longer upnp search
    if (!discoveryResults.length) {
        console.log('No bridges found, trying upnp search... (slow)')
        discoveryResults = await discovery.upnpSearch();
    }

    // If no bridges were found, return error
    if (!discoveryResults.length) return false;

    console.log(`Found ${discoveryResults.length}x Hue Bridges!`);

    const result = await new Promise(async function(resolve, reject) {
        
        discoveryResults.forEach(async thisBridge => {

            // Set attemptsLeft to 25. One attempt every 2 seconds for a total of 50 seconds of trying to link.
            let attemptsLeft = 25;

            // Create an unauthenticated instance of the Hue API so that we can create a new user
            const unauthenticatedApi = await hueApi.createLocal(thisBridge.ipaddress).connect();

            async function attemptLink() {
                try {
                    const createdUser = await unauthenticatedApi.users.createUser(appName, deviceName);
            
                    console.log(`Hue Bridge IP Address: ${thisBridge.ipaddress}`);
                    console.log(`Hue Bridge User: ${createdUser.username}`);
                    console.log(`Hue Bridge User Client Key: ${createdUser.clientkey}`);

                    // Save configuration to config file
                    // TODO: Import 'path' so we can use relative directory traversal to point to the config file
                    // TODO: *or* better yet, use an env variable to specify a base config path that can be accessed globally via process.env
                    /* fs.outputJsonSync('../../config/philipshue.config.json', {
                        ipaddress: thisBridge.ipaddress,
                        username: createdUser.username,
                        clientkey: createdUser.clientkey
                    }); */
            
                    // Create a new API instance that is authenticated with the new user we created
                    const authenticatedApi = await hueApi.createLocal(thisBridge.ipaddress).connect(createdUser.username);
            
                    // Do something with the authenticated user/api
                    const bridgeConfig = await authenticatedApi.configuration.getConfiguration();
                    resolve(bridgeConfig);
            
                } catch (err) {
                    if (!!err.getHueErrorType && err.getHueErrorType() === 101) {
                        console.error(`Link button not pressed. Attempts remaining: ${attemptsLeft}`);
                        attemptsLeft -= 1;
                        attemptsLeft ? setTimeout(() => attemptLink(), 2000) : resolve({isError: true, message: 'The link button was not pressed within the time limit. Please try again.'});
                    } else {
                        console.error(`Unexpected Error: ${err.message}`);
                        resolve({
                            isError: true,
                            message: err.message
                        });
                    }
                }
            }

            attemptLink();
            
        });

    });

    return result;

}

ipcMain.handle('hue.link', async function (event, arg) {
    console.log('Philips Hue Driver: Got IPC request to link with a bridge');
    return await discoverAndLink();
});

/* module.exports = {
    discoverAndCreateUser,
    discoverBridge
} */

/* ipcMain.handle('hue.scan', async function (event, arg) {
    console.log('Philips Hue Driver: Got IPC request to scan for bridges');
    const foundBridges = await discoverBridge();

    console.log(foundBridges)

    let alertMsg = [];
    foundBridges.forEach(bridge => alertMsg.push(bridge.config.name + ': ' + bridge.config.ipaddress));

    event.sender.send('ui.alert', {
        title: `Found ${foundBridges.length}x Bridge(s)`,
        html: alertMsg.join('<br>'),
        icon: 'info'
    });

    return foundBridges;
}); */