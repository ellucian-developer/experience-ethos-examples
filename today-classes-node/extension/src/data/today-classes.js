// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import { fetchJsonData } from './json-data';
import { dispatchEvent } from '../util/events';

import log from 'loglevel';
const logger = log.getLogger('default');

export async function fetchTodayClasses({ queryKey }) {
    // eslint-disable-next-line no-unused-vars
    const [ _key, { getExtensionJwt, microserviceUrl }] = queryKey;

    try {
        const start = new Date();

        // send browser date rather than using server's
        const now = process.env.DATE ? new Date(process.env.DATE) : new Date();
        const date = new Date(now.toLocaleDateString()).toISOString().slice(0, 10);

        const searchParams = new URLSearchParams();
        searchParams.append('date', date);
        const url = `${microserviceUrl}/today-classes?${searchParams.toString()}`

        const { data, error } = await fetchJsonData({
            url,
            getJwt: getExtensionJwt
        });

        const end = new Date();
        logger.debug('node fetchLeaveBalance time:', end.getTime() - start.getTime());

        dispatchEvent({
            name: 'api-stat',
            data: {
                type: 'today-node',
                time: end.getTime() - start.getTime()
            }
        });

        if (error) {
            logger.debug('fetch received an error', error);
            throw new Error(error);
        }

        if (!Array.isArray(data)) {
            logger.error('unable to fetch data: ', error);
            throw error;
        }

        return data;
    } catch (error) {
        logger.error('unable to fetch data: ', error);
        throw error;
    }
}
