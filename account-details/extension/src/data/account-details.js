// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import { fetchJsonData } from './json-data';
import { dispatchEvent } from '../util/events';

import log from 'loglevel';
const logger = log.getLogger('default');

export async function fetchAccountDetails({ queryKey }) {
    // eslint-disable-next-line no-unused-vars
    const [ _key, { getExtensionJwt, lambdaUrl }] = queryKey;

    try {
        const start = new Date();

        const url = `${lambdaUrl}/account-detail-reviews`;

        const { data, error } = await fetchJsonData({
            url,
            getJwt: getExtensionJwt
        });

        const end = new Date();
        logger.debug('Lambda fetchAccountDetails time:', end.getTime() - start.getTime());

        dispatchEvent({
            name: 'api-stat',
            data: {
                type: 'account-details',
                time: end.getTime() - start.getTime()
            }
        });

        if (error) {
            logger.debug('fetch received an error', error);
            throw new Error(error);
        }

        return  data;
    } catch (error) {
        logger.error('unable to fetch data: ', error);
        throw error;
    }
}
