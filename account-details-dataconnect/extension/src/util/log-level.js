// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import log from 'loglevel';

export function initializeLogging(name) {
    const initialLevelKey = name ? `loglevel:initial:${name}` : 'loglevel:initial';
    // check for initial level already being stored. If present, don't change the log level
    const storedInitialLevel = localStorage.getItem(initialLevelKey);

    const logger = log.getLogger(name);
    let level = logger.getLevel();
    let levelName = Object.keys(logger.levels).find(key => logger.levels[key] === level);

    const persist = process.env.LOG_LEVEL_PERSIST === 'true';

    if (!persist || !storedInitialLevel) {
        // set both the initial stored and logger's level
        logger.setLevel(process.env.LOG_LEVEL || process.env.NODE_ENV === 'development' ? 'debug' : 'warn');
        level = logger.getLevel();
        levelName = Object.keys(logger.levels).find(key => logger.levels[key] === level);
        localStorage.setItem(initialLevelKey, levelName);
    }

    logger.info(name ? `${name} log level:` : 'log level:', levelName);
}
