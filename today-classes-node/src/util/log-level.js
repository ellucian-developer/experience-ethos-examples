// Copyright 2021-2022 Ellucian Company L.P. and its affiliates.

import log from 'loglevel';

export function getLogger(name) {
    return name ? log.getLogger(name) : log;
}

export function initializeLogging(name) {
    const logger = getLogger(name);
    let level = logger.getLevel();
    let levelName = Object.keys(logger.levels).find(key => logger.levels[key] === level);

    // set both the initial stored and logger's level
    logger.setLevel(process.env.LOG_LEVEL || process.env.NODE_ENV === 'development' ? 'debug' : 'warn');
    level = logger.getLevel();
    levelName = Object.keys(logger.levels).find(key => logger.levels[key] === level);

    logger.info(name ? `${name} log level:` : 'log level:', levelName);
}
