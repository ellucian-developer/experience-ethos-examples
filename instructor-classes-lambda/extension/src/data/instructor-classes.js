// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import { fetchJsonData } from './json-data';
import { dispatchEvent } from '../util/events';

import log from 'loglevel';
const logger = log.getLogger('Instructor');

export async function fetchInstructorClasses({ queryKey }) {
    // eslint-disable-next-line no-unused-vars
    const [ _key, { getExtensionJwt, lambdaUrl }] = queryKey;

    try {
        const start = new Date();
        const url = `${lambdaUrl}/instructor-classes`;

        const { data, error } = await fetchJsonData({
            url,
            getJwt: getExtensionJwt
        });

        if (error) {
            logger.debug('fetch received an error', error);
            throw new Error(error);
        }

        if (!Array.isArray(data)) {
            logger.error('unable to fetch data: ', error);
            throw error;
        }

        const end = new Date();
        logger.debug('Lambda fetchInstructorClasses time:', end.getTime() - start.getTime());

        dispatchEvent({
            name: 'api-stat',
            data: {
                type: 'instructor-classes-lambda',
                time: end.getTime() - start.getTime()
            }
        });

        return  data;
    } catch (error) {
        logger.error('unable to fetch data sources: ', error);
        return {error: error.message};
    }
}
