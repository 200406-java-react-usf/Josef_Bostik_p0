import dotenv from 'dotenv';
import bodyparser from 'body-parser';
import express from 'express';
import fs from 'fs';
import morgan from 'morgan';
import path from 'path';

import { UserRouter } from './routers/user_router';
import { OrderRouter } from './routers/order_router';
import { ItemRouter } from './routers/item_router';
import { sessionMiddleware } from './middleware/session-middleware';
import { corsFilter } from './middleware/cors-filter';
import { Pool } from 'pg';

//environment configuration
dotenv.config();

//database configuration
export const connectionPool: Pool = new Pool({
    host: process.env['DB_HOST'],
    port: +process.env['DB_PORT'],
    database: process.env['DB_NAME'],
    user: process.env['DB_USERNAME'],
    password: process.env['DB_PASSWORD'],
    max: 5
});

// logging configuration
fs.mkdir(`${__dirname}/logs`, () => {});
const logStream = fs.createWriteStream(path.join(__dirname, 'logs/access.log'), { flags: 'a' });

//web server configuration
const app = express();
app.use(morgan('combined', { stream: logStream }));
app.use(sessionMiddleware);
app.use(corsFilter);
app.use('/', bodyparser.json());
app.use('/users', UserRouter);
app.use('/orders', OrderRouter);
app.use('/items', ItemRouter);


app.listen(8080, () => {
    console.log(`Application running and listening at: http://localhost:8080`);
});
