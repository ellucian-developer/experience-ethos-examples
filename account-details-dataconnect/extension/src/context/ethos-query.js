// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

import { useCache, useCardInfo, useData } from '@ellucian/experience-extension-utils';

import { useEventListener } from '../util/events';

import log from 'loglevel';
const logger = log.getLogger('default');

const contextsByResource = {};

const queryClient = new QueryClient();

function buildKey(cacheKey, queryKeys) {
    let key = cacheKey;
    for (const queryKey in queryKeys) {
        if (Object.hasOwn(queryKeys, queryKey)) {
            key = `${key}-${queryKeys[queryKey]}`;
        }
    }

    return key;
}
function ProviderInternal({children, fetch: paramsFetch, queryKeys: paramQueryKeys = {}, resource}) {
    // Experience SDK hooks
    const { getItem, storeItem } = useCache();
    const { serverConfigContext: { cardPrefix }, cardId } = useCardInfo();
    const { authenticatedEthosFetch } = useData();

    const Context = useMemo(() => {
        const Context = createContext(resource);
        contextsByResource[resource] = Context;

        return Context;
    }, []);
    const cacheKey = useMemo(() => `ethos-${resource}`, []);

    const [ enabled, setEnabled ] = useState(true);
    const [ fetch, setFetch ] = useState(() => paramsFetch);
    const [ queryKeys, setQueryKeys ] = useState(paramQueryKeys);
    const [ isRefreshing, setIsRefreshing ] = useState(false);

    const cachedData = useMemo(() => {
        if (cardId) {
            return getItem({key: buildKey(cacheKey, queryKeys)})?.data;
        }
    }, [ cardId, queryKeys ]);

    // logger.debug(`ethos useQuery - ${resource} cachedData`, cachedData)
    const { data: { data, error: dataError } = {}, isError, isFetching, isRefetching } = useQuery(
        [resource, { authenticatedEthosFetch, cardId, cardPrefix, ...queryKeys }],
        fetch,
        {
            enabled: Boolean(authenticatedEthosFetch && fetch && enabled),
            placeholderData: { data: cachedData },
            refetchOnWindowFocus: false
        }
    );

    useEventListener({
        name: 'refresh',
        handler: data => {
            const { type } = data || {};
            if (!type || type === resource) {
                queryClient.invalidateQueries(resource);
                setIsRefreshing(true);
            }
        }
    });

    useEffect(() => {
        if (data) {
            // logger.debug(`storeItem - ${cacheKey}:`, JSON.stringify(data));
            storeItem({data, key: buildKey(cacheKey, queryKeys)});
        }

        if (isRefreshing && !isRefetching) {
            // refresh has completed
            setIsRefreshing(false);
        }
    }, [ cacheKey, data, isRefetching, isRefreshing, queryKeys ]);

    const contextValue = useMemo(() => {
        // logger.debug(`new Context - ${resource}:`, JSON.stringify(data));
        return {
            data: data || cachedData,
            dataError,
            isError,
            isLoading: isFetching,
            isRefreshing,
            setEnabled,
            setFetch,
            setQueryKeys
        }
    }, [
        cachedData,
        data,
        dataError,
        isError,
        isFetching,
        isRefreshing,
        setEnabled,
        setFetch,
        setQueryKeys
    ]);

    useEffect(() => {
        logger.debug(`EthosQueryProvider for ${resource} mounted`);

        return () => {
            logger.debug(`EthosQueryProvider for ${resource} unmounted`);
        }
    }, []);

    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    )
}

ProviderInternal.propTypes = {
    children: PropTypes.object.isRequired,
    fetch: PropTypes.func.isRequired,
    queryKeys: PropTypes.object,
    resource: PropTypes.string.isRequired
}

export function EthosQueryProvider({children, fetch, queryKeys, resource}) {
    return (
        <QueryClientProvider client={queryClient}>
            <ProviderInternal fetch={fetch} queryKeys={queryKeys} resource={resource}>
                {children}
            </ProviderInternal>
        </QueryClientProvider>
    )
}

EthosQueryProvider.propTypes = {
    children: PropTypes.object.isRequired,
    fetch: PropTypes.func.isRequired,
    queryKeys: PropTypes.object,
    resource: PropTypes.string.isRequired
}

export function useEthosQuery(resource) {
    if (!resource) {
        const message = 'useEthosQuery requires a resource';
        console.error(message);
        throw new Error(message);
    }

    const context = contextsByResource[resource];

    if (!context) {
        const message = `useEthosQuery encountered an unknown resource: ${resource}`;
        console.error(message);
        throw new Error(message);
    }

    return useContext(context);
}
