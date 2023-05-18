// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

import { useCache, useCardInfo, useData } from '@ellucian/experience-extension-utils';

import { fetchTodayClasses } from '../data/today-classes';
import { useEventListener } from '../util/events';

import log from 'loglevel';
const logger = log.getLogger('Instructor');

const Context = createContext()

const cacheKey = 'today-classes';
const queryKey = 'today-lambda';

const queryClient = new QueryClient();

function TodayClassesProviderInternal({children}) {
    // Experience SDK hooks
    const { getItem, storeItem } = useCache();
    const { getExtensionJwt } = useData();

    const {
        configuration: {
            serviceUrl
        } = {},
        serverConfigContext: {
            cardPrefix
        } = {}
    } = useCardInfo();

    const inPreviewMode = cardPrefix === 'preview:';

    const cachedData = useMemo(() => getItem({key: cacheKey})?.data, []);
    const [ isRefreshing, setIsRefreshing ] = useState(false);

    const { data: { data, error: dataError } = {}, isError, isFetching, isRefetching } = useQuery(
        [queryKey, { getExtensionJwt, serviceUrl }],
        fetchTodayClasses,
        {
            enabled: Boolean(getExtensionJwt && serviceUrl),
            refetchOnWindowFocus: false,
            placeholderData: cachedData
        }
    );

    useEventListener({
        name: 'refresh',
        handler: data => {
            const { type } = data || {};
            if (!type || type === queryKey) {
                queryClient.invalidateQueries(queryKey);
                setIsRefreshing(true);
            }
        }
    });

    const events = useMemo(() => {
        let events;

        if (isRefreshing && isRefetching) {
            return undefined;
        } else if (isRefreshing) {
            setIsRefreshing(false);
        }

        if (data && Array.isArray(data)) {
            storeItem({data, key: cacheKey});

            // change to a list of instructional events with section data attached
            events = [];
            for (const section of data) {
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
        }

        return events;
    }, [ data, isRefetching, isRefreshing ]);

    const contextValue = useMemo(() => {
        return {
            dataError,
            events,
            inPreviewMode,
            isError,
            isLoading: isFetching || isRefreshing
        }
    }, [ dataError, events, inPreviewMode, isError, isFetching, isRefreshing ]);

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

TodayClassesProviderInternal.propTypes = {
    children: PropTypes.object.isRequired
}

export function TodayClassesProvider({children}) {
    return (
        <QueryClientProvider client={queryClient}>
            <TodayClassesProviderInternal>
                {children}
            </TodayClassesProviderInternal>
        </QueryClientProvider>
    )
}

TodayClassesProvider.propTypes = {
    children: PropTypes.object.isRequired
}

export function useTodayData() {
    return useContext(Context);
}
