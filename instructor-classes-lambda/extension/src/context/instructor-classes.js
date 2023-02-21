// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

import { useCache, useCardInfo, useData } from '@ellucian/experience-extension/extension-utilities';

import { fetchInstructorClasses } from '../data/instructor-classes';
import { useEventListener } from '../util/events';

import log from 'loglevel';
const logger = log.getLogger('Instructor');

const Context = createContext()

const cacheKey = 'instructor-classes-lambda';
const queryKey = 'instructor-classes-lambda';

const queryClient = new QueryClient();

function InstructorClassesProviderInternal({children}) {
    // Experience SDK hooks
    const { getItem, storeItem } = useCache();
    const { getExtensionJwt } = useData();

    const { configuration: { lambdaUrl } = {} } = useCardInfo();

    const cachedData = useMemo(() => getItem({key: cacheKey})?.data, []);
    const [ isRefreshing, setIsRefreshing ] = useState(false);

    const { data, isError, isLoading, isRefetching } = useQuery(
        [queryKey, { getExtensionJwt, lambdaUrl }],
        fetchInstructorClasses,
        {
            enabled: Boolean(getExtensionJwt && lambdaUrl),
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

    // const [ events, setEvents ] = useState();

    const events = useMemo(() => {
        let events;

        if (data && Array.isArray(data)) {
            storeItem({data, key: cacheKey});

            if (isRefreshing && isRefetching) {
                return undefined;
            } else if (isRefreshing) {
                setIsRefreshing(false);
            }

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
            events,
            isError,
            isLoading: isLoading || isRefreshing
        }
    }, [ events, isError, isLoading, isRefreshing ]);

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

InstructorClassesProviderInternal.propTypes = {
    children: PropTypes.object.isRequired
}

export function InstructorClassesProvider({children}) {
    return (
        <QueryClientProvider client={queryClient}>
            <InstructorClassesProviderInternal>
                {children}
            </InstructorClassesProviderInternal>
        </QueryClientProvider>
    )
}

InstructorClassesProvider.propTypes = {
    children: PropTypes.object.isRequired
}

export function useInstructorData() {
    return useContext(Context);
}
