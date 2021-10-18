import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from 'react-dom';
import { emitCustomEvent, useCustomEventListener } from 'react-custom-events';

import { useCache } from '@ellucian/experience-extension-hooks';

const Context = createContext()

const cacheKey = 'sections';

const cacheEnabled = process.env.CACHE_ENABLED === 'true' || false;

export function TodayClassesProvider({children, type, getTodaysClasses}) {
    const cache = useCache();

    const [ refreshData, setRefreshData ] = useState(true);
    const [ loading, setLoading ] = useState(true);
    const [ loadTimes, setLoadTimes ] = useState([]);
    const [ events, setEvents ] = useState([]);

    useEffect(() => {
        if (refreshData) {
            setRefreshData(false);
            (async () => {
                let loadedFromCache = false;

                if (cacheEnabled) {
                    const { data: cacheData } = await cache.getItem({key: cacheKey});

                    if (cacheData) {
                        const { fetchDate, events } = cacheData;
                        const today = new Date().toISOString().slice(0, 10);
                        if (today === fetchDate) {
                            loadedFromCache = true;
                            unstable_batchedUpdates(() => {
                                setEvents(events);
                                setLoading(false);
                            });
                        }
                    }
                }

                let sections = [];
                if (!loadedFromCache) {
                    const startTime = new Date().getTime();

                    sections = await getTodaysClasses();

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
                        setEvents(events);

                        const endTime = new Date().getTime();
                        setLoadTimes(() => [ ...loadTimes, endTime - startTime]);

                        setLoading(false);

                        emitCustomEvent('today-load-stats', {
                            type,
                            time: endTime - startTime
                        });
                    });

                    if (cacheEnabled) {
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
    }, [refreshData])

    const requestRefreshData = useCallback(() => {
        setRefreshData(true);
        setLoading(true);
    }, [setRefreshData])

    useCustomEventListener(`refresh-${type}`, () => {
        requestRefreshData();
    });

    const contextValue = useMemo(() => {
        return {
            events,
            loading,
            loadTimes,
            refreshData: requestRefreshData
        }
    }, [ events, loading, loadTimes, requestRefreshData ]);

    if (process.env.NODE_ENV === 'development') {
        useEffect(() => {
            console.log('TodayClassesProvider mounted');

            return () => {
                console.log('TodayClassesProvider unmounted');
            }
        }, []);
    }

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
