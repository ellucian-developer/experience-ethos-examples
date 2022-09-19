// Copyright 2021-2022 Ellucian Company L.P. and its affiliates.

import { fetchJsonData } from '../../common/data/json-data';

import log from 'loglevel';
const logger = log.getLogger('Instructor');

export async function fetchInstructorClasses({ getExtensionJwt, url }) {
    try {
        const start = new Date();

        const {data: sections = []} = await fetchJsonData({
            url,
            getJwt: getExtensionJwt
        });

        logger.debug('Lambda fetchInstructorClasses time:', new Date().getTime() - start.getTime());
        return  { data: sections };
    } catch (error) {
        logger.error('unable to fetch data sources: ', error);
        return {error: error.message};
    }
}
