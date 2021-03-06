// Copyright 2021-2022 Ellucian Company L.P. and its affiliates.

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from 'react-dom';

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

    const [ loadDataFromQuery, setLoadDataFromQuery ] = useState(false);
    const [ loadDataFromCache, setLoadDataFromCache ] = useState(true);

    const [ cachedData, setCachedData ] = useState();

    const { data, isError, isLoading } = useQuery(
        ['account-details', {getExtensionJwt, lambdaUrl}],
        fetchAccountDetails,
        {
            enabled: Boolean(loadDataFromQuery && getExtensionJwt && lambdaUrl),
            initialData: cachedData
        }
    );

    useEffect(() => {
        if (cardId && loadDataFromCache) {
            (async () => {
                // check for cached data
                const { data: cacheData } = getItem({key: cacheKey, scope: cardId});

                unstable_batchedUpdates(() => {
                    setLoadDataFromCache(false);

                    if (cacheData) {
                        setCachedData(cacheData);
                    }

                    setLoadDataFromQuery(true);
                })
            })();
        }
    }, [cardId, loadDataFromCache]);

    useEffect(() => {
        if (cardId && data) {
            storeItem({data, key: cacheKey, scope: cardId});
            setLoadDataFromQuery(false);
            setLoadDataFromCache(false);
        }
    }, [cardId, data]);

    const contextValue = useMemo(() => {
        return {
            data: data || cachedData,
            isError,
            isLoading
        }
    }, [ cachedData, data, isError, isLoading ]);

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
