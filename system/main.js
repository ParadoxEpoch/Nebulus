$(document).on('click', '#osDesktop [target]', (target) => nebos.desktop.highlight(target.currentTarget.className)); // Highlight Desktop Icon
$(document).on('dblclick', '#osDesktop [target]', (target) => nebos.app.open(target.currentTarget.getAttribute('target'))); // Launch Desktop Icon
$(document).on('click', '#osTaskbar .menu', () => $('#menu').toggleClass('is-hidden')); // Toggle launcher on taskbar button click
$(document).on('click', '.window .drag-handle span.close', (target) => { // Quit app on close button
    let targetInstance = target.currentTarget.closest('.window').id;
    nebos.app.quit(targetInstance);
});

const activeInstances = {};
let nebos = new class NebulaOS {
    constructor() {}

    async boot() {
        console.log('Booting Nebulus v0.1 Technical Preview...');

        this.desktop = (await import("/system/services/desktop.service.js")).default;
        this.taskbar = (await import("/system/services/taskbar.service.js")).default;

        nebos.app.open('welcomeApp');
        
    }

    menu = {
        open: () => $('#menu').removeClass('is-hidden'),
        close: () => $('#menu').addClass('is-hidden'),
        trigger: () => $('#menu').toggleClass('is-hidden')
    }
    app = {
        open: async (appID) => {
            let seed = 's' + parseInt(Math.random() * 100000000000).toString();
            let config = await $.getJSON('apps/' + appID + '/config.json');
        
            if (!config.multiInstance) {
                if (nebos.app.exists(appID)) {
                    nebula.throwMe('You cannot launch multiple instances of this app.', config.title + ' is already running');
                    return;
                };
            }
        
            // Prepare windowShell
            let windowShell = document.createElement('div');
            windowShell.classList.add('window');
            windowShell.id = seed;
            Object.keys(config.launchStyles).forEach((style) => {
                windowShell.style[style] = config.launchStyles[style];
            });
        
            // Load Content
            let windowContent = document.createElement('div');
            await $(windowContent).load('apps/' + appID + '/main.html?ts=' + Date.now());
            
            // Create title bar
            let titleBar = document.createElement('div');
            titleBar.classList.add('drag-handle');
            let titleContent = document.createElement('span');
            titleContent.classList.add('titlebar-content');
            titleContent.innerText = `${config.title} (${appID}:${seed})`;
            titleBar.append(titleContent);
            let closeBtn = document.createElement('span');
            closeBtn.innerHTML = '<i class="material-icons">close</i>';
            closeBtn.classList.add('close');
            titleBar.append(closeBtn);
        
            windowShell.prepend(titleBar);
            windowShell.append(windowContent);
            $('#windowManager').append(windowShell);

            nebula.import('apps/' + appID + '/main.js');
        
            // Add window instance to taskbar
            let taskbarItem = document.createElement('span');
            taskbarItem.classList.add('item', seed);
            taskbarItem.innerText = config.title;
            $('#osTaskbar').append(taskbarItem);
        
            // Make window draggable
            nebula.makeDraggable(windowShell);
        
            // Add instance to activeInstances array
            activeInstances[seed] = {
                instance: seed,
                appID: appID
            };
        },
        quit: (instance) => {
            let appWindow = document.getElementById(instance);
            appWindow.parentNode.removeChild(appWindow);
        
            let taskbarItem = document.querySelector('#osTaskbar .item.' + instance);
            taskbarItem.parentNode.removeChild(taskbarItem);

            delete activeInstances[instance];
        },
        exists: (appID) => {
            let hasInstance = false;
            Object.keys(activeInstances).forEach(instance => {if (activeInstances[instance].appID === appID) hasInstance = true});
            return hasInstance;
        }
    }
}

nebos.boot();