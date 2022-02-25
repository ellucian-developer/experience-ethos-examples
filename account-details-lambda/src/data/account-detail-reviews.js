// Copyright 2021-2022 Ellucian Company L.P. and its affiliates.

import { integrationUtil } from '@ellucian/experience-extension-server-util';

import { logUtil } from '@ellucian/experience-extension-server-util';
const logger = logUtil.getLogger();

export async function fetchAccountDetailReviews ({ apiKey, personId }) {
    try {
        const start = new Date();
        const ethosContext = {};
        const personResult = await integrationUtil.get({ apiKey, context: ethosContext, resource: 'persons', id: personId });
        const person = personResult?.data;
        if (!person) {
            throw new Error(`person not found for GUID: ${personId}`);
        }

        const bannerId = person.credentials.find(credential => credential.type === 'bannerId').value;

        if (!bannerId) {
            throw new Error(`person: ${person} missing bannerId`);
        }

        const adrResult = await integrationUtil.get({ apiKey, context: ethosContext, resource: 'account-detail-reviews', searchParams: { id: bannerId }});
        logger.debug('result:', adrResult);
        const adr = adrResult?.data;
        if (!adr) {
            throw new Error(`unable to fetch account-detail-reviews for bannerId:  ${bannerId}`);
        }

        logger.debug('time:', new Date().getTime() - start.getTime());
        logger.debug('Ethos GET count:', ethosContext.ethosGetCount);
        return adr;
    } catch (error) {
        logger.error('unable to fetch data sources: ', error);
        return { data: [], error: error.message };
    }
}
