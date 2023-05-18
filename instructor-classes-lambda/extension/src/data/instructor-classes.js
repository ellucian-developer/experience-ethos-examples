// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import { fetchJsonData } from './json-data';
import { dispatchEvent } from '../util/events';

import log from 'loglevel';
const logger = log.getLogger('Instructor');
const resourceName = 'instructor-classes';

export async function fetchInstructorClasses({ queryKey }) {
    // eslint-disable-next-line no-unused-vars
    const [ _key, { getExtensionJwt, serviceUrl = "" }] = queryKey;

    try {
        const start = new Date();

        let url = serviceUrl.trim();
        if (!serviceUrl.endsWith(`/${resourceName}`)) {
            if (!serviceUrl.endsWith('/')) {
                url += '/'
            }
            url = `${url}${resourceName}`;
        }

        const response = await fetchJsonData({
            url,
            getJwt: getExtensionJwt
        });

        const end = new Date();
        logger.debug('Lambda fetchInstructorClasses time:', end.getTime() - start.getTime());

        dispatchEvent({
            name: 'api-stat',
            data: {
                type: 'instructor-classes-lambda',
                time: end.getTime() - start.getTime()
            }
        });

        return  response;
    } catch (error) {
        logger.error('unable to fetch data sources: ', error);
        return {error: error.message};
    }
}
