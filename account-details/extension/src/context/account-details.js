// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import log from 'loglevel';

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

import { useCache, useCardInfo, useData } from '@ellucian/experience-extension-utils';

import { fetchAccountDetails } from '../data/account-details';
import { useEventListener } from '../util/events';

const logger = log.getLogger('default');

const Context = createContext()

const cacheKey = 'account-details';
const queryKey = 'account-details';

const queryClient = new QueryClient();

function AccountDetailsProviderInternal({children}) {
    // Experience SDK hooks
    const { getItem, storeItem } = useCache();
    const {
        configuration: {
            serviceUrl
        } = {},
        cardId,
        serverConfigContext: {
            cardPrefix
        } = {}
     } = useCardInfo();
    const { getExtensionJwt } = useData();

    const inPreviewMode = cardPrefix === 'preview:';

    const cachedData = useMemo(() => {
        if (cardId) {
            return getItem({key: cacheKey, scope: cardId})?.data
        }
    }, [cardId]);
    const [ isRefreshing, setIsRefreshing ] = useState(false);

    const { data: { data, error: dataError } = {}, isError, isFetching, isRefetching } = useQuery(
        [queryKey, {getExtensionJwt, serviceUrl}],
        fetchAccountDetails,
        {
            enabled: Boolean(getExtensionJwt && serviceUrl),
            placeholderData: { data: cachedData },
            refetchOnWindowFocus: false
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

    useEffect(() => {
        if (cardId && data && Array.isArray(data)) {
            storeItem({data, key: cacheKey, scope: cardId});
        }

        if (isRefreshing && !isRefetching) {
            // refresh has completed
            setIsRefreshing(false);
        }
    }, [cardId, data, isRefetching, isRefreshing]);

    const contextValue = useMemo(() => {
        return {
            data,
            dataError,
            inPreviewMode,
            isError,
            isLoading: isFetching,
            isRefreshing
        }
    }, [ data, dataError, inPreviewMode, isError, isFetching, isRefreshing ]);

    useEffect(() => {
        logger.debug('AccountDetailsProvider mounted');

        return () => {
            logger.debug('AccountDetailsProvider unmounted');
        }
    }, []);

    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    )
}

AccountDetailsProviderInternal.propTypes = {
    children: PropTypes.object.isRequired
}

export function AccountDetailsProvider({children}) {
    return (
        <QueryClientProvider client={queryClient}>
            <AccountDetailsProviderInternal>
                {children}
            </AccountDetailsProviderInternal>
        </QueryClientProvider>
    )
}

AccountDetailsProvider.propTypes = {
    children: PropTypes.object.isRequired
}

export function useAccountDetails() {
    return useContext(Context);
}
