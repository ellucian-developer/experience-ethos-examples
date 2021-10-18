import dotenv from 'dotenv';
import express from 'express';
import api from './routes/api.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

if (!process.env.ETHOS_INTEGRATION_URL) {
    console.error("Missing ETHOS_INTEGRATION_URL environment variable");
    process.exit(1);
}

if (!process.env.ETHOS_API_KEY) {
    console.error("Missing ETHOS_API_KEY environment variable");
    process.exit(1);
}

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use('/api', api);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
