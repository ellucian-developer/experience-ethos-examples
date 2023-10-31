// Copyright 20222 Ellucian Company L.P. and its affiliates.

import { useEffect, useMemo } from 'react';

import { useDataQuery } from '@ellucian/experience-extension-extras';

import { dispatchEvent, useEventListener } from '../util/events';

const dashboardResource = 'account-details-dataconnect';

export function useDashboard() {
    const { loadTimes, refresh } = useDataQuery(process.env.PIPELINE_GET_EMERGENCY_CONTACTS);

    useEffect(() => {
        if (loadTimes && loadTimes.length > 0) {
            // publish the latest load time
            dispatchEvent({
                name: 'api-stat',
                data: {
                    type: dashboardResource,
                    time: loadTimes[loadTimes.length-1].time
                }
            });
        }
    }, [ loadTimes ]);

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
