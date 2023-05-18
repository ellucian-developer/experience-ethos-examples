// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import { fetchJsonData } from './json-data';
import { dispatchEvent } from '../util/events';

import log from 'loglevel';
const logger = log.getLogger('default');
const resourceName = 'today-classes';

export async function fetchTodayClasses({ queryKey }) {
    // eslint-disable-next-line no-unused-vars
    const [ _key, { getExtensionJwt, serviceUrl }] = queryKey;

    try {
        const start = new Date();

        // send browser date rather than using server's
        const now = process.env.DATE ? new Date(process.env.DATE) : new Date();
        const date = new Date(now.toLocaleDateString()).toISOString().slice(0, 10);

        const searchParams = new URLSearchParams();
        searchParams.append('date', date);

        let url = serviceUrl.trim();
        if (!url.endsWith(`/${resourceName}`)) {
            if (!url.endsWith('/')) {
                url += '/'
            }
            url = `${url}${resourceName}?${searchParams.toString()}`
        }

        const response = await fetchJsonData({
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

        return response;
    } catch (error) {
        logger.error('unable to fetch data: ', error);
        throw error;
    }
}
