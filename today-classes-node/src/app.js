import dotenv from 'dotenv';
import express from 'express';
import api from './routes/api.js';

dotenv.config();

import { logUtil } from '@ellucian/experience-extension-server-util';
logUtil.initializeLogging();
const logger = logUtil.getLogger();

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

if (!process.env.ETHOS_INTEGRATION_URL) {
    logger.error("Missing ETHOS_INTEGRATION_URL environment variable");
    process.exit(1);
}

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use('/api', api);

app.listen(port, () => {
    logger.info(`today-classes at http://localhost:${port}/api/today-classes`);
});
