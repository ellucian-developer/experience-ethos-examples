/* eslint-disable max-depth */
// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import { dispatchEvent } from '../util/events';

import log from 'loglevel';
const logger = log.getLogger('default');

export const resourceName = 'ethos-example-account-details';

export async function fetchAccountDetailReviews({ queryKey }) {
    // eslint-disable-next-line no-unused-vars
    const [ _key, { authenticatedEthosFetch, cardId, cardPrefix }] = queryKey;

    try {
        const start = new Date();

        const searchParameters = new URLSearchParams({
            cardId,
            cardPrefix
        }).toString();
        const resource = `${resourceName}?${searchParameters}`

        const response = await authenticatedEthosFetch(resource, {
            headers: {
                Accept: 'application/vnd.hedtech.integration.v1+json'
            }
        });

        let result;
        if (response) {
            switch (response.status) {
            case 200:
                try {
                    const data = await response.json()

                    result = {
                        data
                    }
                } catch (error) {
                    result = {
                        error: {
                            message: 'unable to parse response',
                            statusCode: 500
                        }
                    };
                }
                break;
            case 400:
                // look for the case where there is an AR Hold blocking data retrieval
                try {
                    const errorResponse = await response.json()
                    const { errors } = errorResponse
                    const { message } = errors ? errors[0] : {};
                    if (message === 'Person has holds, you may not process this account.') {
                        result = {
                            data: {
                                personHasHolds: true
                            }
                        }
                    }
                } catch (error) {
                    // ignore
                }
                if (!result) {
                    result = {
                        error: {
                            message: 'server error',
                            statusCode: response.status
                        }
                    };
                }
                break;
            case 404:
                result = {
                    error: {
                        message: 'unknown user',
                        statusCode: response.status
                    }
                };
                break;
            default:
                result = {
                    error: {
                        message: 'server error',
                        statusCode: response.status
                    }
                };
            }
        }
        const end = new Date();
        logger.debug(`fetch ${resourceName} time: ${end.getTime() - start.getTime()}`);

        dispatchEvent({
            name: 'api-stat',
            data: {
                type: resourceName,
                time: end.getTime() - start.getTime()
            }
        });

        return result;
    } catch (error) {
        logger.error('unable to fetch data: ', error);
        throw error;
    }
}
