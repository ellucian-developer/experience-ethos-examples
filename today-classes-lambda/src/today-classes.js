import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import { StatusCodes } from 'http-status-codes';
import { fetchTodayClasses } from './data/today-classes.js';
import { experienceUtil, lambdaUtil } from '@ellucian/experience-extension-server-util';

import { logUtil } from '@ellucian/experience-extension-server-util';
logUtil.initializeLogging();
const logger = logUtil.getLogger();

async function todayClassesHandler (event) {
    logger.debug('inbound event: ', event);

    const { jwt: { card: { cardServerConfigurationApiUrl } = {}, user: { id: personId } = {} } = {} } = event;

    const extensionApiToken = process.env.EXTENSION_API_TOKEN;

    const { config, error } = await experienceUtil.getCardServerConfiguration({
        url: cardServerConfigurationApiUrl,
        token: extensionApiToken
    });

    const { apiKey } = config || {};

    if (apiKey && !error) {
        const { date } = event.queryStringParameters || {};
        logger.debug('date', date);
        const sections = await fetchTodayClasses({ apiKey, date, personId });

        return lambdaUtil.buildResponse({
            statusCode: StatusCodes.OK,
            body: sections
        });
    } else {
        const throwError = new Error(JSON.stringify({ error }));
        throwError.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

        throw throwError;
    }
}

export const handler = middy(todayClassesHandler);

handler.use(httpHeaderNormalizer());
handler.use(httpErrorHandler());
handler.use(lambdaUtil.jwtAuthorizeMiddy({ options: { secret: process.env.JWT_SECRET } }));
