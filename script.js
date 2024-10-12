let currentElement = null;
let mouseCoord = {x: 0, y: 0};
document.documentElement.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    showContextMenu(event.clientX, event.clientY);
    if (event.target.classList.contains('circle'))
        return;
    let circleElement = document.createElement('div');
    circleElement.classList.add('circle');
    document.body.appendChild(circleElement);
    let width = parseInt(getComputedStyle(circleElement).width);
    let height = parseInt(getComputedStyle(circleElement).height);
    circleElement.style.top = (event.clientY - width / 2) + 'px';
    circleElement.style.left = (event.clientX - height / 2) + 'px';
    setActiveElement(circleElement);
});

function showContextMenu(x, y) {
    let menuElement = document.querySelector('#contextmenu');
    menuElement.style.display = 'block';
    menuElement.style.left = x + 'px';
    menuElement.style.top = y + 'px';
}
function hideContextMenu() {
    let menuElement = document.querySelector('#contextmenu');
    menuElement.style.display = 'none';
}

function moveElement(element, dx, dy) {
    let leftCoord = parseInt(getComputedStyle(element).left);
    let topCoord = parseInt(getComputedStyle(element).top);
    leftCoord += dx;
    topCoord += dy;
    element.style.left = leftCoord + 'px';
    element.style.top = topCoord + 'px';
}

function setActiveElement(element) {
    if (currentElement === element)
        return;
    element.classList.add('active');
    if (currentElement !== null)
        currentElement.classList.remove('active');
    currentElement = element;
}

document.documentElement.addEventListener('keydown', (event) => {
    event.preventDefault();
    if (currentElement === null)
        return;
    switch (event.code) {
        case 'ArrowUp':
            moveElement(currentElement, 0, -10);
            break;
        case 'ArrowDown':
            moveElement(currentElement, 0, 10);
            break;
        case 'ArrowLeft':
            moveElement(currentElement, -10, 0);
            break;
        case 'ArrowRight':
            moveElement(currentElement, 10, 0);
            break;
        case 'Tab':
            if (event.shiftKey) {
                if (currentElement.previousElementSibling !== null &&
                    currentElement.previousElementSibling.classList.contains('circle'))
                    setActiveElement(currentElement.previousElementSibling);
                else
                    setActiveElement(document.querySelector('.circle:last-child'));
            } else {
                if (currentElement.nextElementSibling !== null &&
                    currentElement.nextElementSibling.classList.contains('circle')) {
                    setActiveElement(currentElement.nextElementSibling);
                } else {
                    setActiveElement(document.querySelector('.circle'));
                }
            }
            break;
    }
});

let isMove = false;

document.documentElement.addEventListener('mousedown', (event) => {
    if (!event.target.classList.contains('circle'))
        return;
    setActiveElement(event.target);
    mouseCoord.x = event.clientX;
    mouseCoord.y = event.clientY;
    isMove = true;
});

document.documentElement.addEventListener('mousemove', (event) => {
    if (!isMove)
        return;
    let coordX = event.clientX;
    let coordY = event.clientY;
    let dx = coordX - mouseCoord.x;
    let dy = coordY - mouseCoord.y;
    mouseCoord.x = coordX;
    mouseCoord.y = coordY;
    moveElement(currentElement, dx, dy);
});

document.documentElement.addEventListener('mouseup', (event) => {
   isMove = false;
});

document.documentElement.addEventListener('click', (event) => {
    let currentTag = event.target;
    event.preventDefault();
    if (currentTag.tagName === 'A' && currentTag.closest('#contextmenu'))
    {
        currentElement.classList.remove(...currentElement.classList);
        currentElement.classList.add('circle');
        currentElement.classList.add('active');
        currentElement.classList.add(
            currentTag.getAttribute('href').slice(1)
        )
    } else
        hideContextMenu();
});