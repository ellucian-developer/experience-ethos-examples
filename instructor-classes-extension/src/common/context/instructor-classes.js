// Copyright 2021-2022 Ellucian Company L.P. and its affiliates.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from 'react-dom';

import { useEventListener } from '../../util/events';

import { useCache } from '@ellucian/experience-extension/extension-utilities';

import log from 'loglevel';
const logger = log.getLogger('Instructor');

const Context = createContext()

const cacheKey = 'sections';

export function InstructorClassesProvider({children, type, getInstructorsClasses}) {
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
                    ({ data: cacheData, expired: cacheExpired } = cache.getItem({key: cacheKey}));

                    if (cacheData) {
                        const { events } = cacheData;
                        loadedFromCache = true;
                        unstable_batchedUpdates(() => {
                            setDataState('loaded');
                            setEvents(events);
                            setLoading(false);
                        });
                    }
                }

                let sections = [];
                if (!loadedFromCache || cacheExpired) {
                    const startTime = new Date().getTime();

                    const {data, error} = await getInstructorsClasses();

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
    }, [])

    useEventListener({name: `refresh-${type}`, handler: requestRefreshData, globalFlag: true});

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
        logger.debug('InstructorClassesProvider mounted');

        return () => {
            logger.debug('InstructorClassesProvider unmounted');
        }
    }, []);

    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    )
}

InstructorClassesProvider.propTypes = {
    children: PropTypes.object.isRequired,
    getInstructorsClasses: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired
}

export function useInstructorData() {
    return useContext(Context);
}
