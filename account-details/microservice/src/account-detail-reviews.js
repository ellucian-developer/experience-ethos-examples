// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import { StatusCodes } from 'http-status-codes';
import { fetchAccountDetailReviews } from './data/account-detail-reviews.js';
import { experienceUtil, lambdaUtil } from '@ellucian/experience-extension-server-util';

import { logUtil } from '@ellucian/experience-extension-server-util';
logUtil.initializeLogging();
const logger = logUtil.getLogger();

async function handler (event) {
    logger.debug('inbound event: ', event);

    const {
        jwt: {
            card: { cardServerConfigurationApiUrl } = {},
            user: { erpId } = {}
        } = {}
    } = event;

    const extensionApiToken = process.env.EXTENSION_API_TOKEN;

    const { config, error } = await experienceUtil.getCardServerConfiguration({
        url: cardServerConfigurationApiUrl,
        token: extensionApiToken
    });

    const { apiKey } = config || {};

    if (apiKey && !error) {
        const adr = await fetchAccountDetailReviews({ apiKey, erpId });

        return lambdaUtil.buildResponse({
            statusCode: StatusCodes.OK,
            body: adr
        });
    } else {
        const response = { error: {}};
        if (error) {
            response.error.message = error.message;
            response.error.statusCode = error.statusCode;
        } else if (config) {
            response.error.message = 'Unable to get apiKey from card server configuration at URL';
            response.error.statusCode = StatusCodes.NOT_FOUND;
        } else {
            response.error.message = 'Unable to get card server configuration at URL';
            response.error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        }
        response.error.cardServerConfigurationApiUrl = cardServerConfigurationApiUrl;

        return lambdaUtil.buildResponse({
            statusCode: response.error.statusCode,
            body: response
        });
    }
}

export const middyHandler = middy(handler);

middyHandler.use(httpHeaderNormalizer());
middyHandler.use(httpErrorHandler());
middyHandler.use(lambdaUtil.jwtAuthorizeMiddy({ options: { secret: process.env.JWT_SECRET } }));
