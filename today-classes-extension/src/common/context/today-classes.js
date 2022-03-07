// Copyright 2021-2022 Ellucian Company L.P. and its affiliates.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from 'react-dom';
import { emitCustomEvent, useCustomEventListener } from 'react-custom-events';

import { useCache } from '@ellucian/experience-extension-hooks';

import log from 'loglevel';
const logger = log.getLogger('Today');

const Context = createContext()

const cacheKey = 'sections';

export function TodayClassesProvider({children, type, getTodaysClasses}) {
    const cache = useCache();

    const [ dataState, setDataState ] = useState('initialize');
    const [ loading, setLoading ] = useState(true);
    const [ loadTimes, setLoadTimes ] = useState([]);
    const [ events, setEvents ] = useState([]);
    const [ isErrorState, setIsErrorState ] = useState(false);

    useEffect(() => {
        if (dataState !== 'loaded') {
            (async () => {
                let loadedFromCache = false;

                let cacheExpired = false;
                if (dataState !== 'reload') {
                    let cacheData
                    ({ data: cacheData, expired: cacheExpired } = await cache.getItem({key: cacheKey}));

                    if (cacheData) {
                        const { fetchDate, events } = cacheData;
                        const today = new Date().toISOString().slice(0, 10);
                        if (today === fetchDate) {
                            loadedFromCache = true;
                            unstable_batchedUpdates(() => {
                                setDataState('loaded');
                                setEvents(events);
                                setLoading(false);
                            });
                        }
                    }
                }

                let sections = [];
                if (!loadedFromCache || cacheExpired) {
                    const startTime = new Date().getTime();

                    const {data, error} = await getTodaysClasses();

                    if (error) {
                        unstable_batchedUpdates(() => {
                            setIsErrorState(true);
                            setLoading(false);
                        });
                    } else {
                        sections = data || [];

                        // change to a list of instructional events with section data attached
                        const events = [];
                        for (const section of sections) {
                            const { course, instructionalEvents} = section;
                            for (const event of instructionalEvents) {
                                const newEvent = {
                                    ...event,
                                    course
                                };
                                events.push(newEvent);
                            }
                        }
                        events.sort((left, right) => left.startOn.localeCompare(right.startOn));
                        unstable_batchedUpdates(() => {
                            setIsErrorState(false);
                            setDataState('loaded');
                            setEvents(events);

                            const endTime = new Date().getTime();
                            setLoadTimes(() => [ ...loadTimes, endTime - startTime]);

                            setLoading(false);

                            emitCustomEvent('today-load-stats', {
                                type,
                                time: endTime - startTime
                            });
                        });

                        // cache it
                        cache.storeItem({
                            key: cacheKey,
                            data: {
                                fetchDate: new Date().toISOString().slice(0, 10),
                                events
                            }
                        });
                    }
                }
            })();
        }
    }, [dataState])

    const requestRefreshData = useCallback(() => {
        setDataState('reload');
        setLoading(true);
    }, [setDataState])

    useCustomEventListener(`refresh-${type}`, () => {
        requestRefreshData();
    });

    const contextValue = useMemo(() => {
        return {
            isErrorState,
            events,
            loading,
            loadTimes,
            refreshData: requestRefreshData
        }
    }, [ isErrorState, events, loading, loadTimes, requestRefreshData ]);

    useEffect(() => {
        logger.debug('TodayClassesProvider mounted');

        return () => {
            logger.debug('TodayClassesProvider unmounted');
        }
    }, []);

    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    )
}

TodayClassesProvider.propTypes = {
    children: PropTypes.object.isRequired,
    getTodaysClasses: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired
}

export function useTodayData() {
    return useContext(Context);
}
