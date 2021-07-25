nebula.notify('Settings loaded!', 'test');

let settings = new class Settings {
    constructor() {}
    display = {
        windowScaling: (scale) => {
            $('#windowManager .window').css("transform", "scale(" + scale + ")")
        }
    }
}