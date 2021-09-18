/* import '../../node_modules/gridstack/dist/gridstack.min.css';
import { GridStack } from 'gridstack';
import '../../node_modules/gridstack/dist/jq/gridstack-dd-jqueryui'; */

const module = new class Desktop {
    constructor() {

        console.log('Initialising Desktop Service...');
        
        const options = {
            alwaysShowResizeHandle: true,
            disableResize: true,
            disableDrag: true,
            animate: true,
            float: true,
            maxRow: 6,
            minRow: 6,
            removable: true
        };
        this.grid = GridStack.init(options);

        this.initWidgets();
        
    }

    initWidgets() {

        const sampleBtnWidgets = [
            {w: 2, h: 2, content: `
                <div class="has-text-centered py-5" ipc="app.open" arg="netusb">
                    <span class="icon is-large mt-5">
                        <i class="fad fa-usb-drive fa-5x"></i>
                    </span>
                    <div class="mt-4">USB Sharing is <b>off</b></div>
                    <div><b>0</b> clients connected</div>
                </div>
            `},
            {w: 2, h: 2, content: `
                <div class="has-text-centered py-5" ipc="driver" arg="wifihotspot.toggle">
                    <span class="icon is-large mt-5">
                        <i class="fad fa-router fa-5x"></i>
                    </span>
                    <div class="mt-5">Hotspot is <b>disabled</b></div>
                </div>
            `}
        ];

        this.grid.load(sampleBtnWidgets);

        this.addIcon('app.open', 'settings', 'Settings', 'fad fa-tools');
        this.addIcon('app.open', 'netusb', 'NetUSB', 'fad fa-usb-drive');
        this.addIcon('app.open', 'wifihotspot', 'Hotspot', 'fad fa-house-signal');
        this.addIcon('app.open', 'ethbridge', 'Bridge', 'fad fa-wifi-2');
        this.addIcon('app.open', 'wallet', 'Wallet', 'fad fa-wallet');
        this.addIcon('app.open', 'plex', 'Plex', 'fad fa-photo-video');
        this.addIcon('app.open', 'twitch', 'Twitch', 'fab fa-twitch');
        this.addIcon('app.open', 'obs', 'OBS Studio', 'fad fa-signal-stream');
        this.addIcon('app.open', 'netman', 'Network', 'fad fa-ethernet');
        this.addIcon('app.open', 'systemstats', 'System', 'fad fa-monitor-heart-rate');

        this.addIcon('obs.connect', '', 'OBS Conn', 'fad fa-signal-stream');

        //this.addIcon('hue.link', '192.168.1.231', 'Hue Link', 'fad fa-lightbulb-on');

        const items = [
            {w: 3, h: 1, content: `
                <div class="is-flex is-justify-content-space-between p-4 mt-1">
                    <div><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/BTC_Logo.svg/2000px-BTC_Logo.svg.png" style="height:80px"></div>
                    <div class="has-text-right">
                        <div class="title is-5">Bitcoin Price</div>
                        <div class="subtitle">$69420</div>
                    </div>
                </div>
            `},
            {w: 5, h: 2, x: 7, y: 4, content: `
                <div class="has-text-centered">
                    <div class="title is-5 has-text-centered mt-4 mb-3">QA Shortcuts</div>
                    <button class="button is-info is-light" onclick="ipc.invoke('devtools')">
                        <span class="icon"><i class="fad fa-terminal"></i></span>
                        <span>DevTools</span>
                    </button>
                    <button class="button is-info is-light" onclick="nebos.desktop.saveLayout()">
                        <span class="icon"><i class="fad fa-save"></i></span>
                        <span>Save Grid State</span>
                    </button>
                    <button class="button is-info is-light" onclick="Swal.fire({title: 'Oops', text: 'This is not yet implemented', icon: 'error'})">
                        <span class="icon"><i class="fad fa-download"></i></span>
                        <span>Load Grid State</span>
                    </button>
                    <button class="button is-success is-light" onclick="nebos.desktop.addIcon('', '', 'App', 'fad fa-box-open')">
                        <span class="icon"><i class="fad fa-plus"></i></span>
                        <span>Add Icon</span>
                    </button>
                    <button class="button is-success is-light" onclick="nebos.desktop.grid.addWidget({w: 3, h: 1, content: 'Test Wide Boi Widget'})">
                        <span class="icon"><i class="fad fa-plus"></i></span>
                        <span>Add 3x1 Widget</span>
                    </button>
                    <button class="button is-info is-light" onclick="ipc.invoke('testipc', 'Hello from the other siiiideeee!!')">
                        <span class="icon"><i class="fad fa-flask"></i></span>
                        <span>Test IPC</span>
                    </button>
                    <button class="button is-danger is-light" onclick="ipc.invoke('relaunch')">
                        <span class="icon"><i class="fad fa-redo"></i></span>
                        <span>Soft Reboot</span>
                    </button>
                    <button class="button is-danger is-light" onclick="ipc.invoke('reboot')">
                        <span class="icon"><i class="fad fa-redo"></i></span>
                        <span>Reboot Device</span>
                    </button>
                    <button class="button is-danger is-light" onclick="ipc.invoke('terminate')">
                        <span class="icon"><i class="fad fa-portal-exit"></i></span>
                        <span>Terminate</span>
                    </button>
                </div>
            `},
            {
                content: `
                    <div class="has-text-centered py-4" onclick="linkHueBridge()">
                        <span class="icon is-medium mb-2">
                            <i class="fad fa-lightbulb-on fa-2x"></i>
                        </span>
                        <div>Hue Link</div>
                    </div>
                `
            }
        ];

        this.grid.load(items);

    }

    addIcon(ipc, arg, name, icon, pos) {
        this.grid.addWidget({
            content: `
                <div class="has-text-centered py-4" ipc="${ipc}" arg="${arg}">
                    <span class="icon is-medium mb-2">
                        <i class="${icon} fa-2x"></i>
                    </span>
                    <div>${name}</div>
                </div>
            `
        });
    }

    addWidget() {

    }

    toggleEditing() {
        this.grid.enableMove(this.grid.opts.disableDrag);
    }

    saveLayout() {
        this.savedLayout = this.grid.save();
    }

    loadLayout() {
        this.grid.removeAll();
        this.grid.load(this.savedLayout);
    }

}

export default module;