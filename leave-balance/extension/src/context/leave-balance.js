// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import log from 'loglevel';

import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

import { useCache, useCardInfo, useData } from '@ellucian/experience-extension/extension-utilities';

import { fetchLeaveBalance } from '../data/leave-balance';
import { useEventListener } from '../util/events';

const logger = log.getLogger('default');

const Context = createContext()

const cacheKey = 'leave-balance';
const queryKey = 'leave-balance';

const queryClient = new QueryClient();

function LeaveBalanceProviderInternal({children}) {
    // Experience SDK hooks
    const { getItem, storeItem } = useCache();
    const { configuration, cardConfiguration, cardId } = useCardInfo();
    const { getExtensionJwt } = useData();

    const { lambdaUrl } = configuration || cardConfiguration || {};

    const cachedData = useMemo(() => {
        if (cardId) {
            return getItem({key: cacheKey, scope: cardId})?.data
        }
    }, [cardId]);
    const [ isRefreshing, setIsRefreshing ] = useState(false);

    const { data, isError, isLoading, isRefetching } = useQuery(
        [queryKey, {getExtensionJwt, lambdaUrl}],
        fetchLeaveBalance,
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

    useEffect(() => {
        if (cardId && data && Array.isArray(data)) {
            storeItem({data, key: cacheKey, scope: cardId});
        }

        if (isRefreshing && !isRefetching) {
            setIsRefreshing(false);
        }
    }, [ cardId, data, isRefetching, isRefreshing]);

    const contextValue = useMemo(() => {
        return {
            data: isRefetching && isRefreshing ? undefined : data,
            isError,
            isLoading: isLoading || isRefreshing
        }
    }, [ cachedData, data, isError, isLoading, isRefetching, isRefreshing ]);

    useEffect(() => {
        logger.debug('LeaveBalanceProvider mounted');

        return () => {
            logger.debug('LeaveBalanceProvider unmounted');
        }
    }, []);

    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    )
}

LeaveBalanceProviderInternal.propTypes = {
    children: PropTypes.object.isRequired
}

export function LeaveBalanceProvider({children}) {
    return (
        <QueryClientProvider client={queryClient}>
            <LeaveBalanceProviderInternal>
                {children}
            </LeaveBalanceProviderInternal>
        </QueryClientProvider>
    )
}

LeaveBalanceProvider.propTypes = {
    children: PropTypes.object.isRequired
}

export function useLeaveBalance() {
    return useContext(Context);
}
