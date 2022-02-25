// Copyright 2021-2022 Ellucian Company L.P. and its affiliates.

import { fetchJsonData } from './json-data';

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

        logger.debug('Lambda fetchAccountDetails time:', new Date().getTime() - start.getTime());

        if (error) {
            logger.debug('fetch received an error', error);
            throw new Error(error);
        }

        // fix the dates in TBRACCD
        if (Array.isArray(data)) {
            data.forEach( entry => {
                const { TBRACCD: transactions = [] } = entry || {};
                transactions.forEach(transaction => {
                    transaction.effectiveDate = fixDate(transaction.effectiveDate);
                    transaction.entryDate = fixDate(transaction.entryDate);
                    transaction.transDate = fixDate(transaction.transDate);
                })
            })
        }

        return  data;
    } catch (error) {
        logger.error('unable to fetch data: ', error);
        throw error;
    }
}

const bpDateRegEx = /([0-9]{2})\/([0-9]{2})\/([0-9]{4})(.*)/;
function fixDate(date) {
    if (!date || typeof date !== 'string' || date.length === 0) {
        return date;
    }

    const parsed = bpDateRegEx.exec(date);
    return `${parsed[3]}-${parsed[2]}-${parsed[1]}${parsed[4]}`;
}