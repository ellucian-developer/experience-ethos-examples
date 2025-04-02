// Copyright 2021-2025 Ellucian Company L.P. and its affiliates.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import log from 'loglevel';

import { useCache } from '@ellucian/experience-extension-utils';

import { useEventListener } from '../util/events';
import { randomPathColor } from '../util/path';

const logger = log.getLogger('default');

const Context = createContext()

const cacheKey = 'api-dashboard';

function ApiDashboardProviderInternal({children}) {
    // Experience SDK hooks
    const { getItem, storeItem } = useCache();


    const [stats, setStats] = useState();

    const types = useMemo(() => (stats ? Object.keys(stats) : []), [stats]);

    useEffect(() => {
        const cachedStats = getItem({ key: cacheKey } )?.data
        if (cachedStats) {
            setStats(cachedStats);
        }
    }, []);

    useEffect(() => {
        if (stats) {
            storeItem({ data: stats, key: cacheKey });
        }
    }, [ stats ]);

    const addTiming = useCallback(({ type, time }) => {
        const newStats = stats ? { ...stats } : {};
        let stat = newStats[type];
        if (!stat) {
            const colorsUsed = types.map(type => stats[type].color);
            stat = {
                color: randomPathColor({colorsUsed}),
                average: 'N/A',
                latest: 'N/A',
                count: 0,
                total: 0,
                times: []
            };
        }

        const { max, min, times } = stat;

        stat.count++;
        stat.min = min !== undefined ? Math.min(min, time) : time;
        stat.max = max !== undefined ? Math.max(max, time) : time;
        stat.total += time;
        stat.average = Math.round(stat.total / stat.count * 10) / 10;
        times.push(time);

        newStats[type] = stat;

        // store a new stats object to cause a render
        setStats(() => (newStats));
    }, [stats, types]);

    const clear = useCallback(() => {
        if (stats) {
            let anyTimings = false;
            types.forEach( type => {
                const currentStat = stats[type];
                anyTimings = anyTimings || Boolean(currentStat.times.length > 0);
                stats[type] = {
                    type,
                    color: currentStat.color,
                    average: 'N/A',
                    latest: 'N/A',
                    count: 0,
                    total: 0,
                    times: []
                }
            })

            if (anyTimings) {
                setStats({ ...stats });
            } else {
                setStats({});
            }
        }
    }, [stats, types]);

    useEventListener({ name: 'api-stat', handler: addTiming });

    const contextValue = useMemo(() => {
        return {
            clear,
            stats,
            types
        }
    }, [ clear, stats, types ]);

    useEffect(() => {
        logger.debug('ApiDashboardProvider mounted');

        return () => {
            logger.debug('ApiDashboardProvider unmounted');
        }
    }, []);

    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    )
}

ApiDashboardProviderInternal.propTypes = {
    children: PropTypes.object.isRequired
}

export function ApiDashboardProvider({children}) {
    return (
        <ApiDashboardProviderInternal>
            {children}
        </ApiDashboardProviderInternal>
    )
}

ApiDashboardProvider.propTypes = {
    children: PropTypes.object.isRequired
}

export function useApiDashboard() {
    return useContext(Context);
}
