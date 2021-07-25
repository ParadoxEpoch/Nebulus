// Nebula Framework
// (c) Copyright Tristan Gauci, 2019-2020. All Rights Reserved.
let thisPage = {};
class Nebula {
    constructor() {
        this._version = '1.2';
        this.init();
    }
    async init() {
        this.config = await $.getJSON("nebula/config.json");
        this.pageMeta = this.config.pageMeta;
        console.log('%cNebula v' + this._version + ' | (c) Tristan Gauci, 2020', 'font-size:14px');

        await Promise.all(this.config.modules.map(async module => {
            await this.import('./nebula/modules/' + module + '.js');
            console.log('Nebula: Loaded Module ' + module);
        }));

        // Init main app script
        await this.import('./system/main.js'); // Init Nebos Main Script
    }
    set title(newTitle) {
        // Set page and breadcrumb title
        document.title = 'AeonLabs - ' + newTitle; // Update Page Title
    }
    get devMode() {
        return localStorage.isDebug == 'true' ? true : false;
    }
    set devMode(status) {
        if (typeof status === 'boolean') localStorage.isDebug = status;
        return localStorage.isDebug;
    }
    async import(script) {
        await $.getScript(script).done(function (result, textStatus) {
            return true;
        }).fail(function (jqxhr, settings, exception) {
            console.error(exception);
            return false;
        });
    }
    async importCSS(path) {
        $('<link>').appendTo('head').attr({
            type: 'text/css', 
            rel: 'stylesheet',
            href: nebula.config.path + path
        });
    }
    reloadScript(src) {
        if (!src.includes('http://') && !src.includes('https://')) src = './assets/js/' + src;
        $('script[src="' + src + '"]').remove();
        $('<script>').attr('src', src).appendTo('#pageScripts');
        //debugLog('Success: ' + src + ' has been (re)loaded.');
    }
    throwMe(message, title, type = 'error') {
        switch (type) {
            case 'warning':
            case 'error':
                this.notify(message, title, type);
                break;
            case 'serious':
                this.notify(message, title, 'error');
                break;
            case 'fatal':
                this.animate('#appContainer', 'fadeOutDown', () => {
                    $('#appContainer').hide();
                    nebula.notify(message, title, type);
                });
                break;
        }
    }
}

// Catch unhandled exceptions
window.onerror = (errorMsg, url, lineNumber) => {
    if (nebula.devMode) nebula.throwMe(errorMsg, 'An unexpected error occurred', 'serious');
    return false;
}

$(document).on('click', '[toPage]', function() {
    // When clicking an elem with the toPage attribute
    let allParams = {}
    let target = $(this).attr('toPage').split('?');
    if (target[1] !== undefined) {
        let stringParams = target[1].split('&');
        stringParams.forEach(stringParam => {
            stringParam = stringParam.split('=');
            allParams[stringParam[0]] = stringParam[1];
        });
    }
    nebula.active = {"toPage":target[0],"params":allParams}; // Set active page
});

function findGetParam(parameterName) {
    var result = null, tmp = [];
    location.search.substr(1).split("&").forEach(item => {
        tmp = item.split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
    return result;
}

// DevBox Content Collapse/Expand (Prototype)
$(document).on('click', '#devbox .devbox-collapse', () => {
    if ($('#devbox .devbox-content').is(':visible')) {
        this.animate('#devbox .devbox-content', 'fadeOutDown', () => {
            $('.devbox-bar').css('transform','translateY(370px)'); // Offset debug bar by the missing content height
            $('#devbox .devbox-content').hide();
            $('#devbox .devbox-collapse i').html('expand_less');
        });
    } else {
        $('#devbox .devbox-content').show();
        this.animate('#devbox .devbox-content', 'fadeInUp');
        $('.devbox-bar').css('transform','none');
        $('#devbox .devbox-collapse i').html('expand_more');
    }
});

// Handle browser back/forward
window.addEventListener('popstate', event => nebula.setPage(event.state, false));

let nebula = {};
$(document).ready(()=> nebula = new Nebula());