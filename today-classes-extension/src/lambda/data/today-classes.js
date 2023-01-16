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

        const searchParams = new URLSearchParams();
        searchParams.append('date', date);
        const url = `${urlBase}?${searchParams.toString()}`

        const {data: sections = []} = await fetchJsonData({
            url,
            getJwt: getExtensionJwt
        });

        logger.debug('Lambda fetchTodayClasses time:', new Date().getTime() - start.getTime());
        return  { data: sections };
    } catch (error) {
        logger.error('unable to fetch data sources: ', error);
        return {error: error.message};
    }
}
