// Copyright 20222 Ellucian Company L.P. and its affiliates.

import { useEffect, useMemo } from 'react';

import { useDataQuery } from '@ellucian/experience-extension-extras';

import { dispatchEvent, useEventListener } from '../../util/events';

const resource = 'ethos-example-account-details';

export function useDashboard() {
    const { loadTimes, refresh } = useDataQuery(resource);

    useEffect(() => {
        if (loadTimes && loadTimes.length > 0) {
            // publish the latest load time
            dispatchEvent({
                name: 'api-stat',
                data: {
                    type: resource,
                    time: loadTimes[loadTimes.length-1].time
                }
            });
        }
    }, [ loadTimes ]);

    const options = useMemo(() => ({
        name: 'refresh',
        handler: data => {
            const { type } = data || {};
            if ((!type || type === resource) && refresh) {
                refresh();
            }
        }
    }), [ refresh ]);

    useEventListener(options);
}
