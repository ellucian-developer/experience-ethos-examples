// Copyright 20222 Ellucian Company L.P. and its affiliates.

import { useMemo } from 'react';

import { useDataQuery } from '@ellucian/experience-extension-extras';

export function useTodayClasses() {
    const { data } = useDataQuery('today-classes');

    return useMemo(() => {
        let events;

        if (data && Array.isArray(data)) {
            // change to a list of instructional events with section data attached
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
}
