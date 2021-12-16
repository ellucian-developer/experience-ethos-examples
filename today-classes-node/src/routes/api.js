import express from 'express';
import cors from 'cors';
import { expressUtil } from '@ellucian/experience-extension-server-util';
import { getTodayClasses } from '../today-classes.js';

import { logUtil } from '@ellucian/experience-extension-server-util';
const logger = logUtil.getLogger();

const apiRouter = express.Router();

apiRouter.use(cors({
    origin: /https:\/\/experience(-.*)?\.elluciancloud.com/
}));

apiRouter.use(expressUtil.jwtAuthorize({ options: { secret: process.env.JWT_SECRET } }));

apiRouter.get('/today-classes', async (request, response) => {
    const { query: { date }, jwt, jwt: { user: { id: personId } } } = request;

    try {
        response.send(await getTodayClasses(personId, date, jwt));
    } catch(error) {
        logger.error(error);
        response.status(error.statusCode || 500).send({ error: {message: error.message }});
    }
});

export default apiRouter;