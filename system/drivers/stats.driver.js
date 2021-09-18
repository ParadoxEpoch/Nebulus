const {exec, spawn} = require("child_process");
const RpiThrottled = require('rpi-throttled');
const {ipcMain} = require('electron');

//create a new object
let thermalEvents = new RpiThrottled();

ipcMain.handle('metrics.system', async function (event, arg) {
    const systemStats = await runInternalScript('systemStats');
    systemStats.thermals = await getThermals();
    return systemStats;
});

ipcMain.handle('metrics.thermalEvents', async function (event, arg) {
    return await getThermals();
});

async function getThermals() {
    thermalEvents.update(false);
    return {
        //temp: 
        events: {
            throttled: thermalEvents.throttled,
            underVoltage: thermalEvents.underVoltage,
            softTempLimit: thermalEvents.softTempLimit,
            frequencyCapped: thermalEvents.frequencyCapped,
            throttledOccurred: thermalEvents.throttledOccurred,
            underVoltageOccurred: thermalEvents.underVoltageOccurred,
            softTempLimitOccurred: thermalEvents.softTempLimitOccurred,
            frequencyCappedOccurred: thermalEvents.frequencyCappedOccurred
        }
    };
}

// Runs a script from the scripts directory and parses its JSON stdout
async function runInternalScript(scriptName) {

    const result = await new Promise(async function(resolve, reject) {
    
        const script = spawn("bash", [`./scripts/${scriptName}.sh`]);
        script.stdout.on("data", data => resolve(data));
        script.stderr.on("data", data => console.error(`Script "${scriptName}" wrote to stderr: ${data}`));
        script.on('error', (error) => reject(error));
        
        /* script.on("close", code => console.log(`child process exited with code ${code}`)); */
    
    });

    const jsonResult = JSON.parse(result);

    return jsonResult;

}