const {exec, spawn} = require("child_process");
const {ipcMain} = require('electron');

ipcMain.handle('metrics.system', async function (event, arg) {
    const systemStats = await runInternalScript('systemStats');
    return systemStats;
});

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

module.exports = async function() {
    const systemStats = await runInternalScript('systemStats');
    return systemStats;
}