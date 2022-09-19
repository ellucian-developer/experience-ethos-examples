// Copyright 2021-2022 Ellucian Company L.P. and its affiliates.

import { useCallback, useEffect } from 'react';

window.globalEventElement = window.globalEventElement || document.createElement('div');
const staticElement = document.createElement('div');

function getElement({element, globalFlag}) {
    return element || globalFlag ? window.globalEventElement : staticElement;
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

    var event = new CustomEvent(name, { detail: data });
    element.dispatchEvent(event);
}