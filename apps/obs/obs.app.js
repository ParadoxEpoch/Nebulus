const electron = require('electron');
const ipc = electron.ipcRenderer;

//ipc.invoke('obs.connect');

async function getSceneList() {
    
}

document.getElementById("connect").addEventListener("click", async function (e) {
    await ipc.invoke('obs.connect');
    console.log(result);
});

document.getElementById("get-scene-list").addEventListener("click", async function (e) {
    const sceneList = await ipc.invoke('obs.send', 'GetSceneList');
    // JSON.stringify(sceneList);
    document.getElementById('output').innerHTML = `
        <div class="title">Current Scene:</div>
        <div class="subtitle">${sceneList['current-scene']}</div>
        <br>
        <div class="title">Raw Scenes Data:</div>
        <div class="subtitle">${JSON.stringify(sceneList['scenes'])}</div>
        <br>
    `;
});

document.getElementById("close-btn").addEventListener("click", function (e) {
    //ipc.invoke('obs.disconnect');
    ipc.invoke('app.quit', 'obs');
});