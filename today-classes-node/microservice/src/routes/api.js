// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import express from 'express';
import cors from 'cors';
import { expressUtil } from '@ellucian/experience-extension-server-util';
import { getTodayClasses } from '../today-classes.js';

import { logUtil } from '@ellucian/experience-extension-server-util';
const logger = logUtil.getLogger();

const apiRouter = express.Router();

apiRouter.use(cors({
    origin: /https:\/\/experience(-.*)?\.elluciancloud\.com/
}));

apiRouter.use(expressUtil.jwtAuthorize({ options: { secret: process.env.JWT_SECRET } }));

apiRouter.get('/today-classes', async (request, response) => {
    const { query: { date }, jwt, jwt: { user: { id: personId } } } = request;

    try {
        const result = await getTodayClasses(personId, date, jwt) || {};

        if (result.error) {
            response.status(result.error.statusCode);
        }

        response.send(result);
    } catch(error) {
        logger.error(error);
        response.status(error.statusCode || 500);
        response.send({ error: {message: error.message }});
    }
});

export default apiRouter;
