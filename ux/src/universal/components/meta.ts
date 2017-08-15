import * as React from 'react';

const keys = {
    Enter: 13,
    Space: 32
}

function removeActive(element: HTMLElement) {
    requestAnimationFrame(function () {
        if (element) {
            element.classList.remove("is-active");
        }
    });
}

function buttonKeydownHandler(behavior: () => void, event: React.KeyboardEvent<HTMLElement>) {
    if (event.keyCode === keys.Enter || event.keyCode === keys.Space) {
        event.currentTarget.classList.add("is-active");
        setTimeout(removeActive.bind(null, event.currentTarget), 250);
        behavior();
    }
}

export function btn(
    behavior: () => void,
    tabIndex: number
) {
    return {
        role: "button",
        onClick: behavior,
        onKeyDown: buttonKeydownHandler.bind(null, behavior),
        tabIndex
    };
}