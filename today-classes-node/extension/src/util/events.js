// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import { useCallback, useEffect } from 'react';

// create a non-visible document element
window.eventsElement = window.eventsElement || document.createElement('events');

function getElement({ element }) {
    return element || window.eventsElement;
}

export function useEventListener(options) {
    const element = getElement(options);
    const {name, handler} = options;

    const handleEvent = useCallback(event => {
        handler(event.detail);
    }, [handler]);

    useEffect(() => {
        element.addEventListener(name, handleEvent, false);

        return () => {
            element.removeEventListener(name, handleEvent, false);
        }
    }, [handleEvent]);
}

export function dispatchEvent(options) {
    const {name, data} = options;
    var element = getElement(options);

    const event = new CustomEvent(name, { detail: data });
    element.dispatchEvent(event);
}