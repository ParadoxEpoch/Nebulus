nebula.notify = (message, title, type = 'info', options = {}) => {
    let defaults = {
        title: title,
        message: message,
        position: 'topLeft'
    }
    type !== ''
        ? iziToast[type]({...defaults, ...options})
        : iziToast.show({...defaults, ...options});
}

nebula.alert = (title, message, icon = 'info', options = {}) => {
    let defaults = {
        title: title,
        html: message,
        icon: icon
    }
    swal.fire({...defaults, ...options});
}

nebula.confirm = async (title, message, options = {}) => {
    let defaults = {
        title: title,
        html: message,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Proceed'
    }
    let result = await Swal.fire({...defaults, ...options});
    return result.isConfirmed;
}

nebula.importCSS('/modules/resources/notify/iziToast.min.css');
nebula.import(nebula.config.path + '/modules/resources/notify/iziToast.min.js');
nebula.importCSS('/modules/resources/notify/swal-borderless.css');
nebula.import(nebula.config.path + '/modules/resources/notify/sweetalert2.all.min.js');