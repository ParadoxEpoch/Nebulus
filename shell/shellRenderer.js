const electron = require('electron');
const ipc = electron.ipcRenderer;

$(document).on('click', '[ipc]', async (target) => { // On clicking an element with an ipc attribute
    let targetIpc = target.currentTarget.getAttribute('ipc');
    let targetArg = target.currentTarget.getAttribute('arg');
    const result = await ipc.invoke(targetIpc, targetArg || '');
    console.log(result);
});

ipc.on('ui.alert', function (event, arg) {
    let defaults = {
        title: '',
        html: '',
        icon: 'info'
    };
    
    const isArgValid = typeof arg === 'object' && arg !== null && !Array.isArray(arg);
    if (!isArgValid) return Swal.fire({
        title: 'Unknown Message',
        html: `The kernel IPC handler failed to pass a data argument with the request. The renderer doesn't know what in the fuck main process wants to tell you, sorry!`,
        icon: 'error',
        showClass: {
            popup: 'animate__animated animate__fadeInDown animate__faster',
            icon: 'animate__animated animate__pulse animate__delay-1s'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp animate__faster',
        }
    });

    Swal.fire({
        ...defaults,
        ...arg
    });
});

// Temporary location. This is a test function to link a hue bridge.
async function linkHueBridge() {

    Swal.fire({
        title: 'Link your Hue Bridge',
        text: 'Press the button on your Hue Bridge to link it with DashLab',
        imageUrl: 'https://www.pngkit.com/png/full/303-3034728_philips-hue-bridge-v2-wireless.png',
        timer: 60000,
        timerProgressBar: true,
        imageWidth: 200,
        imageAlt: 'Philips Hue Bridge',
        showConfirmButton: true,
        didOpen: async () => {
            Swal.showLoading();
            const ipcResult = await ipc.invoke('hue.link');

            if (ipcResult.isError) return Swal.fire({
                icon: 'error',
                title: 'Failed to link Hue Bridge',
                text: ipcResult.message
            });

            return Swal.fire({
                icon: 'success',
                title: 'Hue Bridge Linked',
                text: `Successfully linked the Hue Bridge "${ipcResult.data.name}"`
            });

        }
    });

}

let nebos = new class NebulaOS {
    constructor() {}

    async boot() {
        console.log('Booting Nebula DashOS Technical Preview...');

        this.desktop = (await import("../services/desktop.service.js")).default;
        
    }

}

nebos.boot();