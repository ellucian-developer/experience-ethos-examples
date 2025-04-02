// Copyright 2021-2025 Ellucian Company L.P. and its affiliates.

import {
    fountain400,
    iris400,
    kiwi400,
    meadow400,
    purple400,
    saffron400,
    tangerine400
} from '@ellucian/react-design-system/core/styles/tokens';

const colors = [ fountain400, iris400, kiwi400, meadow400, purple400, saffron400, tangerine400 ];

export function randomPathColor(contextParameter) {
    const context = contextParameter || { colorsUsed: [] };
    context.colorsUsed = context.colorsUsed || [];
    let { colorsUsed } = context;

    let availableColors = colors.filter( c => !colorsUsed.includes(c));

    if (availableColors.length === 0) {
        // reset
        availableColors = colors;
        colorsUsed = [];
        context.colorsUsed = colorsUsed;
    }

    const colorIndex = Math.floor(Math.random() * availableColors.length);
    const color = availableColors[colorIndex];
    context.colorsUsed.push(color);

    return color;
}