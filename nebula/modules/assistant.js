nebula.assistant = class NebulaAssistant {
    constructor(elem, interactive = true) {
        this.seed = 's' + parseInt(Math.random() * 100000000000).toString();
        this.focused = '.assistant-focus.' + this.seed;
        if ($('.assistant-overlay')[0]) return this.focus(elem);
        let overlay = document.createElement('div');
        overlay.classList.add('assistant-overlay');
        let appContainer = document.getElementById('appContainer');
        let pageContainer = document.getElementById('pageContainer');
        appContainer.insertBefore(overlay, pageContainer);
        this.focus(elem, interactive);
    }
    focus(elem, interactive = true) {
        if (!elem) return;
        $(this.focused).removeClass('nointeraction assistant-focus ' + this.seed);
        let focusElem = document.querySelector(elem);
        focusElem.classList.add('assistant-focus', this.seed);
        if (!interactive) focusElem.classList.add('nointeraction')
    }
    click() {
        $(this.focused).click();
    }
    say(title, message, options = {}) {
        nebula.notify(message, title, 'info', {target: this.focused, ...options});
    }
    end() {
        $(this.focused).removeClass('nointeraction assistant-focus ' + this.seed);
        $('.assistant-overlay').remove();
    }
}

nebula.importCSS('/modules/resources/assistant/main.css');