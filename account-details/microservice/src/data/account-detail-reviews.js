// Copyright 2021-2025 Ellucian Company L.P. and its affiliates.

import { integrationUtil } from '@ellucian/experience-extension-server-util';

import { logUtil } from '@ellucian/experience-extension-server-util';
const logger = logUtil.getLogger();

export async function fetchAccountDetailReviews ({ apiKey, erpId }) {
    try {
        const start = new Date();
        const ethosContext = {};

        const adrResult = await integrationUtil.get({
            apiKey,
            context: ethosContext,
            resource: 'account-detail-reviews',
            searchParams: { id: erpId }
        });

        const adr = adrResult?.data;
        if (!adr) {
            throw new Error(`unable to fetch account-detail-reviews for bannerId:  ${erpId}`);
        }

        logger.debug('time:', new Date().getTime() - start.getTime());
        logger.debug('Ethos GET count:', ethosContext.ethosGetCount);
        return adr;
    } catch (error) {
        logger.error('unable to fetch data sources: ', error);
        return { data: [], error: error.message };
    }
}
