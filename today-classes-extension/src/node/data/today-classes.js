// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import { fetchJsonData } from '../../common/data/json-data';

import log from 'loglevel';
const logger = log.getLogger('Today');

export async function fetchTodayClasses({ getExtensionJwt, url: urlBase }) {
    try {
        const start = new Date();
        const now = process.env.DATE ? new Date(process.env.DATE) : new Date();

        // send browser date rather than using server's
        const date = new Date(now.toLocaleDateString()).toISOString().slice(0, 10);

        // build URL
        const url = new URL(urlBase);
        const searchParams = new URLSearchParams(url.searchParams);
        searchParams.append('date', date);
        url.search = searchParams.toString();

        const result = await fetchJsonData({
            url,
            getJwt: getExtensionJwt
        });

        logger.debug('Node fetchTodayClasses time:', new Date().getTime() - start.getTime());
        return result;
    } catch (error) {
        logger.error('unable to fetch data sources: ', error);
        return {data: [], error: error.message};
    }
}
