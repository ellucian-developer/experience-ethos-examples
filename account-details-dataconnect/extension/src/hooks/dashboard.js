// Copyright 2022 Ellucian Company L.P. and its affiliates.

import { useEffect, useMemo, useRef } from 'react';

import { useDataQuery } from '@ellucian/experience-extension-extras';

import { dispatchEvent, useEventListener } from '../util/events';

const dashboardResource = 'account-details-dataconnect';

export function useDashboard() {
    const { data, isLoading, isRefreshing, loadTimes, refresh } = useDataQuery(process.env.PIPELINE_GET_ACCOUNT_DETAILS);
    const requestStartedAtRef = useRef();

    useEffect(() => {
        if (isLoading || isRefreshing) {
            requestStartedAtRef.current = Date.now();
        }
    }, [isLoading, isRefreshing]);

    useEffect(() => {
        if (loadTimes && loadTimes.length > 0) {
            const latestLoadTime = loadTimes[loadTimes.length - 1];
            const latestTime = latestLoadTime?.time ?? latestLoadTime?.duration ?? latestLoadTime?.elapsedTime;

            if (!Number.isFinite(latestTime)) {
                return;
            }

            // publish the latest load time
            dispatchEvent({
                name: 'api-stat',
                data: {
                    type: dashboardResource,
                    time: latestTime
                }
            });
        }
    }, [loadTimes]);

    useEffect(() => {
        const isIdle = !isLoading && !isRefreshing;
        const hasLoadTimes = Array.isArray(loadTimes) && loadTimes.length > 0;

        if (isIdle && data && !hasLoadTimes && requestStartedAtRef.current !== undefined) {
            const elapsedTime = Math.max(0, Date.now() - requestStartedAtRef.current);

            dispatchEvent({
                name: 'api-stat',
                data: {
                    type: dashboardResource,
                    time: elapsedTime
                }
            });

            requestStartedAtRef.current = undefined;
        }
    }, [data, isLoading, isRefreshing, loadTimes]);

    const options = useMemo(() => ({
        name: 'refresh',
        handler: data => {
            const { type } = data || {};
            if ((!type || type === dashboardResource) && refresh) {
                refresh();
            }
        }
    }), [ refresh ]);

    useEventListener(options);
}
