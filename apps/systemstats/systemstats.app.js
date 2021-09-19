const electron = require('electron');
const ipc = electron.ipcRenderer;

async function getStats() {
    const metrics = await ipc.invoke('metrics.system');

    document.getElementById('output').innerHTML = `
        <div class="columns is-multiline">
            <div class="column is-6">
                <ul style="font-size:1.3rem">
                    <li>
                        <i class="fad fa-tachometer-fast fa-3x mb-3"></i>
                        <div class="title is-4 mb-2">CPU Metrics</div>
                    </li>
                    <li><b>Current Frequency:</b> ${metrics.cpu.freqGhz}GHz</li>
                    <li><b>CPU Power Mode:</b> ${metrics.cpu.governor}</li>
                    <li><b>Temperature:</b> ${metrics.cpu.temp} C</li>
                    <li class="mt-2 is-hidden">
                        <div class="dropdown is-hoverable">
                            <div class="dropdown-trigger">
                                <button class="button" aria-haspopup="true" aria-controls="dropdown-menu2">
                                <span><i class="fas fa-tachometer-average mr-2" aria-hidden="true"></i> Balanced</span>
                                <span class="icon is-small">
                                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                                </span>
                                </button>
                            </div>
                            <div class="dropdown-menu" id="dropdown-menu2" role="menu">
                                <div class="dropdown-content">
                                    <a href="#" class="dropdown-item">
                                        <i class="fas fa-leaf mr-2" aria-hidden="true"></i> Power Saving
                                    </a>
                                    <a href="#" class="dropdown-item">
                                        <i class="fas fa-tachometer-slow mr-2" aria-hidden="true"></i> Conservative
                                    </a>
                                    <a href="#" class="dropdown-item">
                                        <i class="fas fa-tachometer-average mr-2" aria-hidden="true"></i> Balanced
                                    </a>
                                    <a href="#" class="dropdown-item">
                                        <i class="fas fa-tachometer-fast mr-2" aria-hidden="true"></i> High Performance
                                    </a>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="column is-6">
                <ul style="font-size:1.3rem">
                    <li>
                        <i class="fad fa-memory fa-3x mb-3"></i>
                        <div class="title is-4 mb-2">Memory Usage</div>
                        <div><b>Free:</b> ${metrics.ram.free} MB <b>| Used:</b> ${metrics.ram.used} MB</div>
                        <div class="mb-2"><b>Available:</b> ${metrics.ram.available} MB</div>
                        <progress value="${metrics.ram.used}" max="${metrics.ram.total}"></progress>
                    </li>    
                </ul>
            </div>
            <div class="column is-12 mt-6">
                <ul class="mb-6" style="font-size:1.3rem">
                    <li>
                        ${metrics.power.throttled
                            ? '<span class="has-text-danger has-text-weight-bold"><i class="fas fa-temperature-hot mr-1"></i> DashLab is currently thermal throttling!</span>'
                            : ''}
                    </li>
                    <li>
                        ${metrics.power.underVoltage
                            ? '<span class="has-text-danger has-text-weight-bold"><i class="fas fa-bolt mr-1"></i> DashLab is currently running under voltage!</span>'
                            : ''}
                    </li>
                    <li>
                        ${metrics.power.throttledOccurred
                            ? '<span class="has-text-warning has-text-weight-bold"><i class="fas fa-tachometer-slow mr-1"></i> DashLab has thermal throttled since bootup!</span>'
                            : '<span class="has-text-success"><i class="fas fa-check mr-1"></i> No thermal throttling detected so far since boot</span>'}
                    </li>
                    <li>
                        ${metrics.power.underVoltageOccurred
                            ? '<span class="has-text-warning has-text-weight-bold"><i class="fas fa-bolt mr-1"></i> DashLab has run under voltage at some point since bootup!</span>'
                            : '<span class="has-text-success"><i class="fas fa-check mr-1"></i> DashLab\'s power supply has delivered adequate power this session</span>'}
                    </li>
                    <li class="mt-5" style="font-size:1.2rem">Last Updated: ${new Date().toLocaleString()}</li>
                </ul>
            </div>
        </div>
    `;
    return result;
}

getStats();
let statUpdater = setInterval(getStats, 1000);

/* document.getElementById("stop-updates").addEventListener("click", async function (e) {
    clearInterval(statUpdater);
}); */

document.querySelectorAll("[ipc]").forEach(trigger => trigger.addEventListener("click", () => {
    //ipc.invoke('app.quit', 'systemstats')
    let targetIpc = trigger.getAttribute('ipc');
    let targetArg = trigger.getAttribute('arg');
    ipc.invoke(targetIpc, targetArg || '');
}));

document.getElementById("close-btn").addEventListener("click", function (e) {
    ipc.invoke('app.quit', 'systemstats');
});

/* $(document).on('click', '[ipc]', async (target) => { // On clicking an element with an ipc attribute
    let targetIpc = target.currentTarget.getAttribute('ipc');
    let targetArg = target.currentTarget.getAttribute('arg');
    const result = await ipc.invoke(targetIpc, targetArg || '');
    console.log(result);
}); */