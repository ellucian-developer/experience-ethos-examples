// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import dotenv from 'dotenv';
import express from 'express';
import api from './routes/api.js';

dotenv.config();

import { logUtil } from '@ellucian/experience-extension-server-util';
logUtil.initializeLogging();
const logger = logUtil.getLogger();

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
const integrationUrl = process.env.ETHOS_INTEGRATION_URL || 'https://integrate.elluciancloud.com';

if (!process.env.ETHOS_INTEGRATION_URL) {
    logger.warn("ETHOS_INTEGRATION_URL environment variable defaulted to " + integrationUrl);
    process.env.ETHOS_INTEGRATION_URL = integrationUrl;
}

if (!process.env.JWT_SECRET) {
    logger.error("Missing JWT_SECRET environment variable");
    process.exit(1);
}

if (!process.env.EXTENSION_API_TOKEN) {
    logger.error("Missing EXTENSION_API_TOKEN environment variable");
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
