nebula.animate = (element, animationName, callback) => {
    let animations = ['animated'];
    $.isArray(animationName) ? animationName.forEach(item => animations.push(item)) : animations.push(animationName);
    const node = document.querySelector(element);
    node.classList.add(...animations);
    function handleAnimationEnd() {
        node.classList.remove(...animations);
        node.removeEventListener('animationend', handleAnimationEnd);
        if (typeof callback === 'function') callback();
    }
    node.addEventListener('animationend', handleAnimationEnd);
}

function animateQuake(element) {
    element = document.querySelector(element);
    element.classList.remove("animate-quake");
    void element.offsetWidth;
    element.classList.add("animate-quake");
    setTimeout(() => element.classList.remove("animate-quake"), 1000);
}