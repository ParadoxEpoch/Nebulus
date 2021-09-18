const electron = require('electron');
const ipc = electron.ipcRenderer;

document.getElementById("wifi-connect").addEventListener("click", async function (e) {
    connectToWifi();
});

document.getElementById("wifi-scan").addEventListener("click", async function (e) {
        
    document.getElementById('output').innerHTML = `
        <div class="title is-4 mb-2">Found WiFi Networks:</div>
        <div id="found-networks" class="has-text-left is-flex is-flex-wrap-wrap" style="width:fit-content;margin:auto"></div>
    `;
        
    const result = await ipc.invoke('wifi.scan');

    result.forEach(network => {
        document.getElementById('found-networks').innerHTML += `
            <div class="m-3 p-5" style="border: 1px solid white; border-radius: 15px; padding: 20px">
                <b>SSID:</b> ${network.ssid}<br>
                <b>Signal Level:</b> ${network.signal_level}<br>
                <b>Signal Strength:</b> ${network.quality}<br>
                <b>Security:</b> ${network.security}<br>
                <b>MAC Address:</b> ${network.mac}<br>
            </div>
        `;
    });

});

document.getElementById("wifi-conns").addEventListener("click", async function (e) {
    const result = await ipc.invoke('wifi.getConnections');
    document.getElementById('output').innerHTML = JSON.stringify(result);
});

document.getElementById("close-btn").addEventListener("click", function (e) {
    ipc.invoke('app.quit', 'netman');
});

async function connectToWifi() {

    const networks = await ipc.invoke('wifi.scan');
    let networkListHTML = '';

    networks.forEach(network => {
        networkListHTML += `
            <li class="my-3 p-3" style="border: 1px solid black; border-radius: 15px">
                <div>
                    <b>SSID:</b> ${network.ssid}
                    <br>
                    <b>Signal Strength:</b> ${network.quality}%
                </div>
            </li>
        `;
    });

    Swal.fire({
        title: `<i class="fad fa-wifi"></i> Select WiFi Network`,
        html: `<ul>${networkListHTML}</ul>`,
        showConfirmButton: false
    })

}