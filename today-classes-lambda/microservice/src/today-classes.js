// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import { StatusCodes } from 'http-status-codes';
import { fetchTodayClasses } from './data/today-classes.js';
import { experienceUtil, lambdaUtil } from '@ellucian/experience-extension-server-util';

import { logUtil } from '@ellucian/experience-extension-server-util';
logUtil.initializeLogging();
const logger = logUtil.getLogger();

async function handler(event) {
    logger.debug('inbound event: ', event);

    const {
        jwt: {
            card: { cardServerConfigurationApiUrl } = {},
            user: { id: personId } = {}
        } = {}
    } = event;

    const extensionApiToken = process.env.EXTENSION_API_TOKEN;

    const { config, error } = await experienceUtil.getCardServerConfiguration({
        url: cardServerConfigurationApiUrl,
        token: extensionApiToken
    });

    const { ethosApiKey: apiKey } = config || {};

    if (apiKey && !error) {
        const { date } = event.queryStringParameters || {};
        const { sections, error } = await fetchTodayClasses({ apiKey, date, personId });

        if (error) {
            return lambdaUtil.buildResponse({
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                body: { error }
            });
        } else {
            return lambdaUtil.buildResponse({
                statusCode: StatusCodes.OK,
                body: sections
            });
        }
    } else {
        const throwError = new Error(JSON.stringify({ error }));
        throwError.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

        throw throwError;
    }
}

export const middyHandler = middy(handler);

middyHandler.use(httpHeaderNormalizer());
middyHandler.use(httpErrorHandler());
middyHandler.use(lambdaUtil.jwtAuthorizeMiddy({ options: { secret: process.env.JWT_SECRET } }));
