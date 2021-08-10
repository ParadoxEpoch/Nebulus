const module = new class Desktop {
    constructor() {
        console.log('Initialising Desktop Service...');
        $('#osDesktop').html(`
            <span class="desktop-icon s233453466" target="testapp" style="top: 20px; left: 30px;">
                <i class="material-icons drag-handle">folder_open</i>
                <div>Test App</div>
            </span>
            <span class="desktop-icon s643556564" target="terminal" style="top: 150px; left: 30px;">
                <i class="material-icons drag-handle">wysiwyg</i>
                <div>Terminal</div>
            </span>
            <span class="desktop-icon s435345543" target="settings" style="top: 280px; left: 30px;">
                <i class="material-icons drag-handle">settings</i>
                <div>Settings</div>
            </span>
        `);
    }
}

export default module;