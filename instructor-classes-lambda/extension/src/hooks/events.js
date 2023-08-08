// Copyright 20222 Ellucian Company L.P. and its affiliates.

import { useMemo } from 'react';

import { useDataQuery } from '@ellucian/experience-extension-extras';

const resource = 'instructor-classes';

export function useEvents() {
    const { data } = useDataQuery(resource);

    const events = useMemo(() => {
        let events;

        if (Array.isArray(data)) {
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
    }, [ data ]);

    return events;
}
