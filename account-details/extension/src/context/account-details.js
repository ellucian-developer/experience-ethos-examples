// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import React, { createContext, useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import log from 'loglevel';

import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

import { useCache, useCardInfo, useData } from '@ellucian/experience-extension/extension-utilities';

import { fetchAccountDetails } from '../data/account-details';

const logger = log.getLogger('default');

const Context = createContext()

const cacheKey = 'account-details';

const queryClient = new QueryClient();

function AccountDetailsProviderInternal({children}) {
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

    const { data, isError, isLoading } = useQuery(
        ['account-details', {getExtensionJwt, lambdaUrl}],
        fetchAccountDetails,
        {
            enabled: Boolean(getExtensionJwt && lambdaUrl),
            initialData: cachedData
        }
    );

    useEffect(() => {
        if (cardId && data) {
            storeItem({data, key: cacheKey, scope: cardId});
        }
    }, [cardId, data]);

    const contextValue = useMemo(() => {
        return {
            data,
            isError,
            isLoading
        }
    }, [ data, isError, isLoading ]);

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
