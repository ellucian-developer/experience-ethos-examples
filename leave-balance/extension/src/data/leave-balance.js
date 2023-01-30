// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import { fetchJsonData } from './json-data';
import { dispatchEvent } from '../util/events';

import log from 'loglevel';
const logger = log.getLogger('default');

export async function fetchLeaveBalance({ queryKey }) {
    // eslint-disable-next-line no-unused-vars
    const [ _key, { getExtensionJwt, lambdaUrl }] = queryKey;

    try {
        const start = new Date();

        const url = `${lambdaUrl}/leave-balance`;

        const { data, error } = await fetchJsonData({
            url,
            getJwt: getExtensionJwt
        });

        const end = new Date();
        logger.debug('Lambda fetchLeaveBalance time:', end.getTime() - start.getTime());

        dispatchEvent({
            name: 'api-stat',
            data: {
                type: 'leave-balance',
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
