// Copyright 20222 Ellucian Company L.P. and its affiliates.

import { useEffect, useMemo } from 'react';

import { useCardInfo } from '@ellucian/experience-extension-utils';
import { useDataQuery } from '@ellucian/experience-extension-extras';

import { dispatchEvent, useEventListener } from '../util/events';

const dashboardResource = 'leave-balance-dataconnect';

export function useDashboard() {
    const {
        configuration: {
            pipelineApi
        } = {}
    } = useCardInfo();

    const { loadTimes, refresh } = useDataQuery(pipelineApi);

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
