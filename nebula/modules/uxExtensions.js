// Make an element draggable
nebula.makeDraggable = (elmnt) => {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.querySelector("#" + elmnt.id + " .drag-handle")) {
        // if present, the header is where you move the DIV from:
        document.querySelector("#" + elmnt.id + " .drag-handle").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }
  
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Nebula Tabs (Prototype)
$(document).on('click', '.tab-link', function() {
    try {
        let targetTab = $(this).attr('to-tab');
        if (!targetTab) throw {'type':'warning','message':'This link does not point to a valid tab'};
        targetTab = targetTab.split('.');
        if (targetTab.length !== 2) throw {'type':'warning','message':'This link points to an invalid tab'};
        let foundTab = $('.nebula-tabs[tab-collection="' + targetTab[0] + '"] .tab[tab="' + targetTab[1] + '"]')[0];
        if (!foundTab) throw {'type':'warning','message':'The target tab does not exist'};
        let activeTab = $('.nebula-tabs[tab-collection="' + targetTab[0] + '"] .tab.is-active')[0];
        if (activeTab) $(activeTab).removeClass('is-active');
        $(foundTab).addClass('is-active');
    } catch(e) {
        e.type && e.message ? nebula.throwMe(e.message, 'Something went wrong', e.type) : nebula.throwMe('Something went wrong while selecting this tab', 'Oops', 'error');
    }
});

// Logic extension. Convert form data to JSON string.
nebula.formToJSON = (query) => {
    let form = document.querySelector(query);
    var obj = {};
    var elements = form.querySelectorAll("input, select, textarea");
    for(var i = 0; i < elements.length; ++i) {
        var element = elements[i];
        var name = element.name;
        var value = element.value;
        if (name) obj[name] = value;
    }
    return JSON.stringify(obj);
}